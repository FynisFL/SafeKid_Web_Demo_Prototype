// Adapted from React Bits Gradual Blur (TS-TW).
// https://reactbits.dev/r/GradualBlur-TS-TW.json
// MIT + Commons Clause. See public/licenses/react-bits.txt.
const layers = [
  { blur: 1, start: 0, peak: 35, end: 80 },
  { blur: 2, start: 30, peak: 65, end: 100 },
  { blur: 4, start: 65, peak: 100, end: 100 },
];

export function GradualBlur({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" data-gradual-blur="" className={className}>
      {layers.map(({ blur, start, peak, end }) => (
        <span key={blur} className="pointer-events-none absolute inset-0" style={{
          backdropFilter: `blur(${blur}px)`,
          maskImage: `linear-gradient(to bottom, transparent ${start}%, black ${peak}%, ${end === 100 && peak === 100 ? "black" : "transparent"} ${end}%)`,
        }} />
      ))}
    </div>
  );
}
