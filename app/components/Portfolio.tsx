"use client";

import { useRef, useState } from "react";
import { useMountEffect } from "@/hooks/useMountEffect";
import { projects, studio } from "@/app/data/projects";
import { FloatingList } from "./FloatingList";
import { ProjectGrid } from "./ProjectGrid";
import { AboutModal } from "./AboutModal";
import { Gallery } from "./Gallery";
import { Preloader } from "./Preloader";

const N = projects.length;
const mod = (n: number, m: number) => ((n % m) + m) % m;

type View = "grid" | "list";

export function Portfolio() {
  const [view, setView] = useState<View>("grid");
  const [ready, setReady] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [galleryIdx, setGalleryIdx] = useState<number | null>(null);

  const viewRef = useRef<View>("grid");
  const gridVisibleRef = useRef(true);
  const listVisibleRef = useRef(false);
  const aboutRef = useRef(false);
  const galleryRef = useRef<number | null>(null);
  const isOverlay = () => aboutRef.current || galleryRef.current !== null;
  const syncActive = () => {
    gridVisibleRef.current = viewRef.current === "grid" && !isOverlay();
    listVisibleRef.current = viewRef.current === "list" && !isOverlay();
  };

  const openAbout = (v: boolean) => {
    aboutRef.current = v;
    setAboutOpen(v);
    syncActive();
  };
  const openGallery = (i: number | null) => {
    const idx = i === null ? null : mod(i, N);
    galleryRef.current = idx;
    setGalleryIdx(idx);
    syncActive();
  };

  const switchView = (next: View) => {
    viewRef.current = next;
    setView(next);
    syncActive();
  };

  useMountEffect(() => {
    setReady(true);
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") {
        openGallery(null);
        openAbout(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <Preloader />

      <ProjectGrid
        visible={view === "grid"}
        visibleRef={gridVisibleRef}
        onOpen={openGallery}
      />

      <FloatingList
        visible={view === "list"}
        visibleRef={listVisibleRef}
        onOpen={openGallery}
      />

      <div
        className="pointer-events-none fixed inset-0 z-20"
        style={{ opacity: ready ? 1 : 0, transition: "opacity var(--dur-slow) var(--ease-out)" }}
      >
        <h1 className="absolute left-4 top-4 text-xs leading-none text-black md:left-5 md:top-5 md:text-sm">
          {studio.name}
        </h1>
        <button
          onClick={() => openAbout(true)}
          className="pointer-events-auto absolute right-4 top-4 cursor-pointer text-xs leading-none text-black transition-opacity duration-300 ease-out hover:opacity-50 md:right-5 md:top-5 md:text-sm"
        >
          About
        </button>
        <button
          onClick={() => switchView(view === "grid" ? "list" : "grid")}
          className="pointer-events-auto absolute bottom-4 left-4 cursor-pointer text-xs leading-none text-black transition-opacity duration-300 ease-out hover:opacity-50 md:bottom-5 md:left-5 md:text-sm"
        >
          {view === "grid" ? "Index" : "Cover"}
        </button>
        <a
          href={`mailto:${studio.email}`}
          className="pointer-events-auto absolute bottom-4 right-4 text-xs leading-none text-black transition-opacity duration-300 ease-out hover:opacity-50 md:bottom-5 md:right-5 md:text-sm"
        >
          Email
        </a>
      </div>

      <AboutModal open={aboutOpen} onClose={() => openAbout(false)} />
      <Gallery
        project={galleryIdx === null ? null : projects[galleryIdx]}
        onClose={() => openGallery(null)}
      />
    </main>
  );
}
