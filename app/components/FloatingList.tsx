"use client";

import { useRef, useState } from "react";
import { useMountEffect } from "@/hooks/useMountEffect";
import { projects } from "@/app/data/projects";

const N = projects.length;
const ROW = 58;
const mod = (n: number, m: number) => ((n % m) + m) % m;

export function FloatingList({
  visible,
  visibleRef,
  onOpen,
}: {
  visible: boolean;
  visibleRef: React.RefObject<boolean>;
  onOpen: (i: number) => void;
}) {
  const [active, setActive] = useState(0);
  const titleRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pressedEl = useRef<HTMLElement | null>(null);
  const eng = useRef({
    pos: 0,
    target: 0,
    vel: 0,
    dragging: false,
    lastY: 0,
    moved: 0,
    lastInput: 0,
    active: 0,
  });

  useMountEffect(() => {
    const e = eng.current;
    let raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visibleRef.current) return;

      const now = performance.now();
      if (!e.dragging) {
        e.target += e.vel;
        e.vel *= 0.92;
        if (Math.abs(e.vel) < 0.001) e.vel = 0;
        const idle = now - e.lastInput > 140;
        if (idle && e.vel === 0) e.target += (Math.round(e.target) - e.target) * 0.14;
      }
      e.pos += (e.target - e.pos) * 0.13;

      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < N; i += 1) {
        const el = titleRefs.current[i];
        if (!el) continue;
        let d = i - e.pos;
        d = mod(d + N / 2, N) - N / 2;
        const ad = Math.abs(d);
        el.style.transform = `translate3d(-50%, calc(${d * ROW}px - 50%), 0)`;
        el.style.opacity = String(Math.max(0.12, 1 - ad * 0.34));
        if (ad < bestDist) {
          bestDist = ad;
          best = i;
        }
        if (ad < 0.5) el.dataset.active = "true";
        else if (el.dataset.active) delete el.dataset.active;
      }
      if (best !== e.active) {
        e.active = best;
        setActive(best);
      }
    };
    raf = requestAnimationFrame(tick);

    const onWheel = (ev: WheelEvent) => {
      if (!visibleRef.current) return;
      ev.preventDefault();
      e.lastInput = performance.now();
      e.vel += ev.deltaY * 0.0009;
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", onWheel);
    };
  });

  const onPointerDown = (ev: React.PointerEvent) => {
    if (!visibleRef.current) return;
    const e = eng.current;
    e.dragging = true;
    e.lastY = ev.clientY;
    e.moved = 0;
    e.vel = 0;
    pressedEl.current = ev.target as HTMLElement;
    (ev.currentTarget as HTMLElement).setPointerCapture?.(ev.pointerId);
  };
  const onPointerMove = (ev: React.PointerEvent) => {
    const e = eng.current;
    if (!e.dragging) return;
    const dy = ev.clientY - e.lastY;
    e.lastY = ev.clientY;
    e.moved += Math.abs(dy);
    e.target -= dy / ROW;
    e.vel = -dy / ROW;
    e.lastInput = performance.now();
  };
  const onPointerUp = () => {
    const e = eng.current;
    if (!e.dragging) return;
    e.dragging = false;
    e.lastInput = performance.now();
    if (e.moved < 6) {
      const btn = pressedEl.current?.closest("[data-idx]");
      if (btn) onOpen(Number((btn as HTMLElement).dataset.idx));
    }
    pressedEl.current = null;
  };

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="fl-view"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity var(--dur) var(--ease-out)",
      }}
    >
      <div className="fl-preview">
        {projects.map((p, i) => (
          <img
            key={p.slug}
            src={p.images[0]}
            alt={p.title}
            draggable={false}
            className={i === active ? "show" : ""}
          />
        ))}
      </div>

      <div className="fl-titles">
        {projects.map((p, i) => (
          <button
            key={p.slug}
            data-idx={i}
            ref={(el) => {
              titleRefs.current[i] = el;
            }}
            className="fl-title"
            title={p.title}
          >
            {p.title}
          </button>
        ))}
      </div>
    </div>
  );
}
