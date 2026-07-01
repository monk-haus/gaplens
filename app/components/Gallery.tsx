import type { Project } from "@/app/data/projects";
import { ScrollArea } from "./ScrollArea";

export function Gallery({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-paper text-ink"
      style={{
        opacity: project ? 1 : 0,
        pointerEvents: project ? "auto" : "none",
        transition: "opacity var(--dur) var(--ease-out)",
      }}
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 cursor-pointer text-xs leading-none text-black transition-opacity duration-300 ease-out hover:opacity-60 md:right-5 md:top-5 md:text-sm"
      >
        Close
      </button>

      {project && (
        <ScrollArea
          key={project.slug}
          className="no-scrollbar h-full w-full overflow-y-auto overflow-x-hidden overscroll-contain bg-paper text-ink"
        >
          <header className="flex items-center justify-center px-6 py-28 text-center md:py-40">
            <h1
              className="reveal font-display leading-[1.04] tracking-tight"
              style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)", animationDelay: "80ms" }}
            >
              {project.title}
            </h1>
          </header>

          <section className="columns-1 gap-4 px-5 pb-24 md:columns-2 md:gap-8 md:px-10">
            {project.images.map((src, i) => (
              <figure
                key={src}
                className="reveal mb-4 break-inside-avoid md:mb-8"
                style={{ animationDelay: `${Math.min(0.18 + i * 0.06, 0.6)}s` }}
              >
                <img
                  src={src}
                  alt={`${project.title} — ${i + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full bg-black/[0.03]"
                />
              </figure>
            ))}
          </section>
        </ScrollArea>
      )}
    </div>
  );
}
