import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://hundred-henna.vercel.app"),
  title: "HUNDRED | one hundred milliseconds.",
  description:
    "A live chronograph for Robinhood Chain. The real block height, ticking from the public RPC, measured against the clocks finance used to keep.",
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png", sizes: "1024x1024" },
      { url: "/brand/logo.svg", type: "image/svg+xml" },
    ],
    apple: "/logo.png",
  },
  openGraph: {
    title: "HUNDRED",
    description: "one hundred milliseconds.",
    images: [{ url: "/banner.png", width: 1600, height: 900 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HUNDRED",
    description: "one hundred milliseconds.",
    images: ["/banner.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
