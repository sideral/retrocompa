import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Quicksand } from "next/font/google";

const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RetroCompa 2025 - Votaciones",
  description: "Vota por la mejor pinta y karaoke en RetroCompa 2025",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={quicksand.className}>
        <Suspense>
          <Navigation />
        </Suspense>
        {children}
      </body>
    </html>
  );
}

