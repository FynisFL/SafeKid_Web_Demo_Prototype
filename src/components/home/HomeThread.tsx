import { useEffect, useId, useRef, type RefObject } from "react";
import { DURATION, EASE } from "@/components/motion/tokens";

type Point = { x: number; y: number };

const SAMPLE_COUNT = 96;
const STEADY_STROKE = "hsl(var(--primary))";

function strokePath(points: Point[]) {
  const [start, ...rest] = points;
  return rest.reduce((path, point, index) => {
    const previous = points[index];
    const bend = (point.y - previous.y) * 0.42;
    return `${path} C${previous.x} ${previous.y + bend} ${point.x} ${point.y - bend} ${point.x} ${point.y}`;
  }, `M${start.x} ${start.y}`);
}

function lengthAtY(samples: number[], length: number, y: number) {
  if (y <= samples[0]) return 0;
  if (y >= samples[SAMPLE_COUNT]) return length;

  let low = 0;
  let high = SAMPLE_COUNT;
  while (high - low > 1) {
    const middle = (low + high) >> 1;
    if (samples[middle] <= y) low = middle;
    else high = middle;
  }
  return ((low + (y - samples[low]) / (samples[high] - samples[low])) / SAMPLE_COUNT) * length;
}

export default function HomeThread({
  home,
  staticEntrance,
}: {
  home: RefObject<HTMLDivElement | null>;
  staticEntrance: boolean;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGCircleElement>(null);
  const gradientRef = useRef<SVGLinearGradientElement>(null);
  const gradientId = useId();

  useEffect(() => {
    const root = home.current;
    const svg = svgRef.current;
    const path = pathRef.current;
    const head = headRef.current;
    const gradient = gradientRef.current;
    const start = root?.querySelector("[data-home-thread-start]");
    const end = root?.querySelector("[data-home-thread-end]");
    const chapters = Array.from(root?.querySelectorAll("[data-home-thread-chapter]") ?? []);
    if (!root || !svg || !path || !head || !gradient || !start || !end || chapters.length !== 5) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: EventTarget & { saveData?: boolean } }).connection;
    let frame = 0;
    let inView = true;
    let geometryDirty = true;
    let documentTop = 0;
    let length = 0;
    let previousDistance = -1;
    let samples: number[] = [];

    const measure = () => {
      const bounds = root.getBoundingClientRect();
      const first = start.getBoundingClientRect();
      const last = end.getBoundingClientRect();
      const here = { x: first.left - bounds.left, y: first.top - bounds.top };
      const there = { x: last.left - bounds.left, y: last.top - bounds.top };
      const gutter = Math.min(42, Math.max(10, bounds.width * 0.022));
      const rail = bounds.width - gutter;
      const rects = chapters.map((chapter) => chapter.getBoundingClientRect());
      const firstJoin = rects[0].top - bounds.top;
      const lastTurn = rects[4].top - bounds.top;
      const nodes = rects.slice(0, -1).map((box, index) => ({
        x: rail - gutter * (index % 2 ? 0.34 : 0.12),
        y: box.top - bounds.top + box.height * 0.46,
      }));

      documentTop = bounds.top + scrollY;
      const startY = here.y;
      const endY = there.y;
      geometryDirty = false;
      if (firstJoin <= startY || lastTurn >= endY) return;

      const points = [here, { x: rail, y: firstJoin }, ...nodes, { x: rail, y: lastTurn }, there];
      svg.setAttribute("viewBox", `0 0 ${bounds.width} ${bounds.height}`);
      path.setAttribute("d", strokePath(points));
      gradient.setAttribute("y1", String(startY));
      gradient.setAttribute("y2", String(endY));
      const stops = Array.from(gradient.children);
      for (const [index, point] of points.entries()) {
        stops[index].setAttribute("offset", String((point.y - startY) / (endY - startY)));
      }
      length = path.getTotalLength();
      samples = Array.from({ length: SAMPLE_COUNT + 1 }, (_, index) =>
        path.getPointAtLength((index / SAMPLE_COUNT) * length).y);
      path.setAttribute("stroke-dasharray", `${length} ${length}`);
      previousDistance = -1;
    };

    const draw = () => {
      frame = 0;
      if (geometryDirty) measure();
      if (!length) return;
      const still = staticEntrance || preference.matches || connection?.saveData;
      svg.dataset.threadMode = still ? "static" : "scroll";
      const cursor = scrollY + document.documentElement.clientHeight * 0.79 - documentTop;
      const distance = still ? length : lengthAtY(samples, length, cursor);
      if (distance !== previousDistance) {
        path.setAttribute("stroke-dashoffset", String(length - distance));
        path.setAttribute("opacity", distance === 0 ? "0" : "1");
        previousDistance = distance;
      }
      const travelling = !still && distance > 0 && distance < length;
      if (travelling) {
        const point = path.getPointAtLength(distance);
        head.setAttribute("cx", String(point.x));
        head.setAttribute("cy", String(point.y));
      }
      head.setAttribute("opacity", travelling ? "1" : "0");
      svg.style.opacity = "1";
    };

    const schedule = () => {
      if (!frame && inView && !document.hidden) frame = requestAnimationFrame(draw);
    };

    const refresh = () => {
      geometryDirty = true;
      schedule();
    };

    function syncVisibility() {
      if (!inView || document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else {
        schedule();
      }
    }

    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(refresh);
    for (const node of [root, start.parentElement, end.parentElement, ...chapters]) {
      if (node) resize?.observe(node);
    }
    const intersection = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncVisibility();
    });
    intersection?.observe(root);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", refresh);
    document.addEventListener("visibilitychange", syncVisibility);
    document.fonts?.addEventListener("loadingdone", refresh);
    preference.addEventListener("change", schedule);
    connection?.addEventListener("change", schedule);
    schedule();

    return () => {
      cancelAnimationFrame(frame);
      resize?.disconnect();
      intersection?.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", refresh);
      document.removeEventListener("visibilitychange", syncVisibility);
      document.fonts?.removeEventListener("loadingdone", refresh);
      preference.removeEventListener("change", schedule);
      connection?.removeEventListener("change", schedule);
    };
  }, [home, staticEntrance]);

  return (
    <svg
      ref={svgRef}
      data-testid="home-thread"
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute inset-0 z-10 size-full overflow-hidden opacity-0 motion-safe:transition-opacity"
      style={{ transitionDuration: `${DURATION.quick}s`, transitionTimingFunction: `cubic-bezier(${EASE.join(",")})` }}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient ref={gradientRef} id={gradientId} x1="0" x2="0" y1="0" y2="1" gradientUnits="userSpaceOnUse">
          {[0.85, 0.72, 0.89, 0.91, 0.55, 0.76, 0.64, 1].map((opacity) => (
            <stop key={opacity} stopColor={STEADY_STROKE} stopOpacity={opacity} />
          ))}
        </linearGradient>
      </defs>
      <path ref={pathRef} fill="none" stroke={`url(#${gradientId})`} strokeWidth="1.6" strokeLinecap="round" opacity="0" />
      <circle ref={headRef} r="3.2" fill={STEADY_STROKE} stroke="#eaffff" strokeWidth="1.2" opacity="0" />
    </svg>
  );
}
