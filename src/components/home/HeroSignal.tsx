import { useEffect, useRef } from "react";
import { BREAKPOINT } from "@/lib/breakpoints";
import { DURATION } from "../motion/tokens";

type Battery = EventTarget & { level: number; charging: boolean };
type DeviceNavigator = Navigator & { deviceMemory?: number; getBattery?: () => Promise<Battery> };

export default function HeroSignal() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const surface = canvas.current;
    const position = surface?.parentElement;
    const context = surface?.getContext("2d");
    if (!surface || !position || !context) return;
    const device = navigator as DeviceNavigator;
    let frame = 0;
    let active = true;
    let battery: Battery | undefined;
    let width = 0;
    let height = 0;
    let pointer = { x: 0, y: 0 };
    let strength = 0;
    let target = 0;
    let budget = 32;
    let slowFrames = 0;
    let ratio = 1;
    let last = 0;
    let until = 0;
    let half = false;

    function resize() {
      const bounds = position.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const screenWidth = window.innerWidth;
      const limit = screenWidth >= BREAKPOINT.laptop ? 88 : screenWidth >= BREAKPOINT.tablet ? 56 : 32;
      const light = (device.hardwareConcurrency || 4) <= 4 || (device.deviceMemory ?? 4) <= 4;
      budget = Math.min(limit, light ? 32 : limit, half ? 32 : limit);
      ratio = Math.min(window.devicePixelRatio || 1, half || light ? 1 : 2);
      surface.width = Math.round(width * ratio);
      surface.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function draw(now: number) {
      frame = 0;
      if (!active || now > until || document.hidden) {
        context.clearRect(0, 0, width, height);
        return;
      }
      const time = (now - last) / 1000;
      if (last && time > 0.026) slowFrames += 1;
      else slowFrames = Math.max(0, slowFrames - 1);
      last = now;
      if (slowFrames >= 8) {
        if (half) {
          context.clearRect(0, 0, width, height);
          return;
        }
        half = true;
        slowFrames = 0;
        resize();
      }

      strength += (target - strength) * 0.12;
      const remaining = Math.min(1, (until - now) / 380);
      const span = Math.min(width, height);
      const centerX = width / 2 + pointer.x * 15 * strength;
      const centerY = height / 2 + pointer.y * 15 * strength;
      context.clearRect(0, 0, width, height);
      context.globalAlpha = remaining * 0.7;
      context.strokeStyle = "#14bbb8";
      context.lineWidth = 1.4;
      context.beginPath();
      context.ellipse(centerX, centerY, span * .394, span * .31, -0.48, now * .002, now * .002 + 2.1);
      context.stroke();
      context.beginPath();
      for (let index = 0; index < budget; index++) {
        const angle = index * 2.399963 + now * (index % 2 ? .0013 : -.0009);
        const radius = span * (0.27 + (index % 11) * .015 - strength * .039);
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius * .84;
        const size = index % 7 === 0 ? 2.3 : 1.3;
        context.moveTo(x + size, y);
        context.arc(x, y, size, 0, Math.PI * 2);
      }
      context.fillStyle = "#048389";
      context.fill();
      frame = requestAnimationFrame(draw);
    }

    function wake() {
      if (!active) return;
      until = performance.now() + DURATION.slow * 1000;
      if (!frame) {
        last = 0;
        frame = requestAnimationFrame(draw);
      }
    }

    function approach(event: PointerEvent) {
      const bounds = position.getBoundingClientRect();
      pointer = { x: (event.clientX - bounds.left) / bounds.width - .5, y: (event.clientY - bounds.top) / bounds.height - .5 };
      target = 1;
      wake();
    }

    function release() {
      target = 0;
      wake();
    }

    function onBattery() {
      if (battery?.charging || (battery?.level ?? 1) >= .15) return;
      active = false;
      cancelAnimationFrame(frame);
      context.clearRect(0, 0, width, height);
    }

    let disposed = false;
    void device.getBattery?.().then(info => {
      if (disposed) return;
      battery = info;
      battery.addEventListener("levelchange", onBattery);
      battery.addEventListener("chargingchange", onBattery);
      onBattery();
    }).catch(() => undefined);

    const observer = new ResizeObserver(resize);
    observer.observe(position);
    resize();
    wake();
    position.addEventListener("pointermove", approach, { passive: true });
    position.addEventListener("pointerdown", approach, { passive: true });
    position.addEventListener("pointerleave", release, { passive: true });
    position.addEventListener("pointerup", release, { passive: true });
    position.addEventListener("pointercancel", release, { passive: true });
    return () => {
      disposed = true;
      active = false;
      observer.disconnect();
      cancelAnimationFrame(frame);
      position.removeEventListener("pointermove", approach);
      position.removeEventListener("pointerdown", approach);
      position.removeEventListener("pointerleave", release);
      position.removeEventListener("pointerup", release);
      position.removeEventListener("pointercancel", release);
      battery?.removeEventListener("levelchange", onBattery);
      battery?.removeEventListener("chargingchange", onBattery);
    };
  }, []);

  return <canvas ref={canvas} data-hero-signal="" aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] h-full w-full" />;
}
