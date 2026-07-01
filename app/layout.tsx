import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const fournier = localFont({
  variable: "--font-fournier",
  display: "swap",
  src: [
    { path: "../public/PS-Fournier-STD/PSFournier Std Light.otf", weight: "300", style: "normal" },
    { path: "../public/PS-Fournier-STD/PSFournier Std Light Italic.otf", weight: "300", style: "italic" },
    { path: "../public/PS-Fournier-STD/PSFournier Std.otf", weight: "400", style: "normal" },
    { path: "../public/PS-Fournier-STD/PSFournier Std Italic.otf", weight: "400", style: "italic" },
    { path: "../public/PS-Fournier-STD/PSFournier Std Bold.otf", weight: "700", style: "normal" },
  ],
});

const fournierGrand = localFont({
  variable: "--font-fournier-grand",
  display: "swap",
  src: [
    { path: "../public/PS-Fournier-STD/PSFournier Std Grand Light.otf", weight: "300", style: "normal" },
    { path: "../public/PS-Fournier-STD/PSFournier Std Grand.otf", weight: "400", style: "normal" },
    { path: "../public/PS-Fournier-STD/PSFournier Std Grand Italic.otf", weight: "400", style: "italic" },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gaplens.com"),
  title: {
    default: "Gaplens — Photography Studio",
    template: "%s — Gaplens",
  },
  description:
    "Gaplens is a photography studio working in the space between seeing and remembering. Light. Shadow. Structure. Silence.",
  keywords: [
    "Gaplens",
    "photography studio",
    "fine art photography",
    "editorial photography",
    "portfolio",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Gaplens — Photography Studio",
    description:
      "Gaplens is a photography studio working in the space between seeing and remembering.",
    url: "/",
    siteName: "Gaplens",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/projects/concrete-shadows/1-1.png",
        alt: "Gaplens — Concrete Shadows",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gaplens — Photography Studio",
    description:
      "Gaplens is a photography studio working in the space between seeing and remembering.",
    images: ["/images/projects/concrete-shadows/1-1.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fournier.variable} ${fournierGrand.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
