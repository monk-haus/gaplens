"use client";

import { useState } from "react";
import { useMountEffect } from "@/hooks/useMountEffect";
import { studio } from "@/app/data/projects";

export function Preloader() {
  const [exiting, setExiting] = useState(false);
  const [done, setDone] = useState(false);

  useMountEffect(() => {
    const t1 = window.setTimeout(() => setExiting(true), 1400);
    const t2 = window.setTimeout(() => setDone(true), 2300);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  });

  if (done) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-paper"
      style={{
        opacity: exiting ? 0 : 1,
        pointerEvents: exiting ? "none" : "auto",
        transition: "opacity var(--dur-slow) var(--ease-out)",
      }}
      aria-hidden={exiting}
    >
      <span
        className="reveal font-display px-6 text-center leading-[0.95] text-black"
        style={{ fontSize: "clamp(1.8rem, 6vw, 5rem)", animationDelay: "80ms" }}
      >
        {studio.name}
      </span>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <span className="preloader-line block" />
      </div>
    </div>
  );
}
