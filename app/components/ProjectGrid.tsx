"use client";

import { useRef, useState } from "react";
import { projects, studio } from "@/app/data/projects";
import { useMountEffect } from "@/hooks/useMountEffect";

type Item = { src: string; projectIndex: number; title: string };

const WAVE = 4;
const TARGET = 16;
const items: Item[] = (() => {
  const out: Item[] = [];
  for (let pass = 0; pass < 12 && out.length < TARGET; pass += 1) {
    projects.forEach((p, pi) => {
      if (out.length >= TARGET) return;
      const src = p.images[pass];
      if (src) out.push({ src, projectIndex: pi, title: p.title });
    });
  }
  return out;
})();
const TOTAL_WAVES = Math.max(1, Math.floor(items.length / WAVE));

const mod = (n: number, m: number) => ((n % m) + m) % m;

type Path = (t: number, eX: number, eY: number) => [number, number];
const paths: Path[] = [
  (t, eX) => [-eX + 2 * eX * t, 0],
  (t, _eX, eY) => [0, eY - 2 * eY * t],
  (t, eX, eY) => [eX - 2 * eX * t, eY - 2 * eY * t],
  (t, eX, eY) => [-eX + 2 * eX * t, -eY + 2 * eY * t],
  (t, eX) => [eX - 2 * eX * t, 0],
  (t, eX, eY) => [eX - 2 * eX * t, -eY + 2 * eY * t],
  (t, _eX, eY) => [0, -eY + 2 * eY * t],
  (t, eX, eY) => [-eX + 2 * eX * t, eY - 2 * eY * t],
];

const lanes: [number, number][] = [
  [-0.24, -0.17],
  [0.24, -0.17],
  [-0.24, 0.17],
  [0.24, 0.17],
];

export function ProjectGrid({
  visible,
  visibleRef,
  onOpen,
}: {
  visible: boolean;
  visibleRef: React.RefObject<boolean>;
  onOpen: (i: number) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const meta = useRef(
    items.map((_, i) => {
      const wave = Math.floor(i / WAVE);
      const slot = i % WAVE;
      const dir = (slot * 2 + wave * 3) % paths.length;
      return { wave, slot, dir };
    }),
  );

  const eng = useRef({ P: 0, sv: 0, started: false });

  useMountEffect(() => {
    setMounted(true);
    const e = eng.current;
    let raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visibleRef.current || !e.started) return;

      e.sv *= 0.92;
      if (Math.abs(e.sv) < 0.00003) e.sv = 0;
      e.P += e.sv;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const eX = vw / 2 + 380;
      const eY = vh / 2 + 380;

      for (let i = 0; i < items.length; i += 1) {
        const el = refs.current[i];
        if (!el) continue;
        const m = meta.current[i];
        const t = mod(e.P - m.wave, TOTAL_WAVES);
        if (t > 1) {
          el.style.opacity = "0";
          el.style.pointerEvents = "none";
          continue;
        }
        const [px, py] = paths[m.dir](t, eX, eY);
        const x = px + lanes[m.slot][0] * vw;
        const y = py + lanes[m.slot][1] * vh;

        const edge = Math.max(Math.abs(x) / (vw / 2), Math.abs(y) / (vh / 2));
        const scale = 0.86 + 0.14 * Math.max(0, 1 - edge);
        el.style.opacity = "1";
        el.style.zIndex = String(Math.round((1 - Math.min(edge, 1)) * 60));
        el.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) scale(${scale})`;
        el.style.pointerEvents = edge < 1.05 ? "auto" : "none";
      }
    };
    raf = requestAnimationFrame(tick);

    const onWheel = (ev: WheelEvent) => {
      if (!visibleRef.current) return;
      ev.preventDefault();
      e.started = true;
      e.sv += ev.deltaY * 0.00006;
    };

    let lastTouchY = 0;
    const onTouchStart = (ev: TouchEvent) => {
      if (!visibleRef.current) return;
      lastTouchY = ev.touches[0].clientY;
    };
    const onTouchMove = (ev: TouchEvent) => {
      if (!visibleRef.current) return;
      ev.preventDefault();
      const y = ev.touches[0].clientY;
      const dy = lastTouchY - y;
      lastTouchY = y;
      e.started = true;
      e.sv += dy * 0.00018;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  });

  return (
    <div
      className="fixed inset-0 z-10 overflow-hidden bg-paper"
      style={{
        opacity: visible && mounted ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity var(--dur) var(--ease-out)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 70 }}
      >
        <span
          className="reveal font-display px-6 text-center leading-[0.95] text-black"
          style={{ fontSize: "clamp(1.8rem, 6vw, 5rem)", animationDelay: "150ms" }}
        >
          {studio.name}
        </span>
      </div>

      <div className="absolute inset-0">
        {items.map((it, i) => (
          <button
            key={`${it.src}-${i}`}
            data-proj={it.projectIndex}
            ref={(el) => {
              refs.current[i] = el;
            }}
            onClick={() => onOpen(it.projectIndex)}
            className="absolute left-1/2 top-1/2 block cursor-pointer will-change-transform"
            style={{
              height: "clamp(220px, 40vh, 540px)",
              opacity: 0,
              pointerEvents: "none",
            }}
            aria-label={`Open ${it.title}`}
          >
            <img
              src={it.src}
              alt={it.title}
              draggable={false}
              decoding="async"
              className="pointer-events-none block h-full w-auto select-none object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
