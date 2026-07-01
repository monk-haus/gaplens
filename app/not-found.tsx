import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center bg-paper px-6 text-center text-ink">
      <p
        className="reveal font-display italic"
        style={{
          fontSize: "clamp(1.4rem, 3.4vw, 2.8rem)",
          lineHeight: 1.14,
          letterSpacing: "-0.01em",
          maxWidth: "16em",
          animationDelay: "60ms",
        }}
      >
        The image you are looking for was never taken.
      </p>
      <p
        className="reveal mt-7 text-[11px] uppercase tracking-[0.32em] text-black/45 md:mt-9 md:text-xs"
        style={{ animationDelay: "180ms" }}
      >
        404 — Page not found
      </p>
      <Link
        href="/"
        className="reveal mt-10 text-sm text-black/70 transition-colors duration-300 ease-out hover:text-black md:mt-14"
        style={{ animationDelay: "300ms" }}
      >
        Return home
      </Link>
    </main>
  );
}
