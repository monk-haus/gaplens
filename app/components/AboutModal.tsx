import { studio } from "@/app/data/projects";
import { ScrollArea } from "./ScrollArea";

export function AboutModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const statement = studio.bio.slice(0, 13).join(" ");
  const coda = studio.bio.slice(13).join(" ");
  const reveal = open ? "reveal " : "";

  return (
    <div
      className="fixed inset-0 z-40 bg-paper text-ink"
      style={{
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transition: "opacity var(--dur) var(--ease-out)",
      }}
      aria-hidden={!open}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 cursor-pointer text-xs leading-none text-black transition-opacity duration-300 ease-out hover:opacity-60 md:right-5 md:top-5 md:text-sm"
      >
        Close
      </button>

      <ScrollArea
        key={open ? "open" : "closed"}
        className="no-scrollbar h-full w-full overflow-y-auto overscroll-contain"
      >
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <p
            className={`${reveal}font-display italic`}
            style={{
              fontSize: "clamp(1.4rem, 3.4vw, 2.8rem)",
              lineHeight: 1.14,
              letterSpacing: "-0.01em",
              maxWidth: "16em",
              animationDelay: "60ms",
            }}
          >
            {statement}
          </p>
          <p
            className={`${reveal}mt-7 text-[11px] uppercase tracking-[0.32em] text-black/45 md:mt-9 md:text-xs`}
            style={{ animationDelay: "180ms" }}
          >
            {coda}
          </p>
          <nav
            className={`${reveal}mt-10 flex items-center gap-3 text-sm text-black/70 md:mt-14`}
            style={{ animationDelay: "300ms" }}
          >
            <a
              href={`mailto:${studio.email}`}
              className="transition-colors duration-300 ease-out hover:text-black"
            >
              Email
            </a>
          </nav>
        </div>
      </ScrollArea>
    </div>
  );
}
