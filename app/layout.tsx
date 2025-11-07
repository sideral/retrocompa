import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Navigation } from "@/components/navigation";

export const metadata: Metadata = {
  title: "RetroCompa 2025 - Votaciones",
  description: "Vota por el mejor disfraz y karaoke en RetroCompa 2025",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Suspense fallback={null}>
          <Navigation />
        </Suspense>
        {children}
      </body>
    </html>
  );
}

