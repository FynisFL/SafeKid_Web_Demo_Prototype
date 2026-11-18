import { useEffect, useRef } from "react";
import type { MouseEvent } from "react";

// Adapted from React Bits ClickSpark (David Haz).
// https://github.com/DavidHDev/react-bits/blob/1eeb6f105c68b964289d85dabbe84a1d551f3797/src/ts-default/Animations/ClickSpark/ClickSpark.tsx
// License: public/licenses/react-bits.txt
const duration = 540;
const rays = Array.from({ length: 10 }, (_, index) => {
  const angle = (2 * Math.PI * index) / 10;
  return { x: Math.cos(angle), y: Math.sin(angle) };
});

type Burst = { x: number; y: number; start: number; color: string };

export function useClickSpark(disabled: boolean, color: string) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bursts = useRef<Burst[]>([]);
  const frame = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    return () => {
      window.cancelAnimationFrame(frame.current);
      frame.current = 0;
      bursts.current = [];
      canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [disabled]);

  function spark(event: MouseEvent<HTMLDivElement>) {
    const canvas = canvasRef.current;
    if (disabled || !canvas || event.button !== 0) return;

    const bounds = canvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;

    const button = event.target instanceof Element ? event.target.closest("button") : null;
    const focusOrigin = event.detail === 0 ? button?.getBoundingClientRect() : null;
    if (event.detail === 0 && !focusOrigin) return;

    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.round(bounds.width * ratio);
    const height = Math.round(bounds.height * ratio);
    if (width !== canvas.width || height !== canvas.height) {
      window.cancelAnimationFrame(frame.current);
      frame.current = 0;
      canvas.width = width;
      canvas.height = height;
      bursts.current = [];
    }

    const context = canvas.getContext("2d");
    if (!context) return;

    const clientX = focusOrigin ? focusOrigin.left + focusOrigin.width / 2 : event.clientX;
    const clientY = focusOrigin ? focusOrigin.top + focusOrigin.height / 2 : event.clientY;
    bursts.current = [...bursts.current.slice(-5), {
      x: clientX - bounds.left, y: clientY - bounds.top, start: performance.now(), color,
    }];

    if (frame.current) return;

    function draw(now: number) {
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, canvas.width / ratio, canvas.height / ratio);
      context.lineWidth = 2;
      context.lineCap = "round";
      bursts.current = bursts.current.filter((burst) => now - burst.start < duration);

      for (const burst of bursts.current) {
        const progress = Math.max(0, (now - burst.start) / duration);
        const eased = progress * (2 - progress);
        const distance = 5 + eased * 43;
        const length = 12 * (1 - eased);
        context.strokeStyle = burst.color;
        context.globalAlpha = 1 - progress;
        context.beginPath();

        for (const ray of rays) {
          context.moveTo(burst.x + distance * ray.x, burst.y + distance * ray.y);
          context.lineTo(burst.x + (distance + length) * ray.x, burst.y + (distance + length) * ray.y);
        }

        context.stroke();
      }

      frame.current = bursts.current.length ? window.requestAnimationFrame(draw) : 0;
    }

    frame.current = window.requestAnimationFrame(draw);
  }

  return { canvasRef, spark };
}
