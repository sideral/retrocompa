"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";

export function Navigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const guestId = searchParams.get("guestId");

  // Don't show navigation on home, confirmation, or winners pages
  if (pathname === "/" || pathname === "/confirmation" || pathname === "/winners") {
    return null;
  }

  const getStepNumber = () => {
    if (pathname === "/select-guest") return 1;
    if (pathname === "/vote-costume") return 2;
    if (pathname === "/vote-karaoke") return 3;
    if (pathname === "/review") return 4;
    return 0;
  };

  const getBackUrl = () => {
    if (pathname === "/select-guest") return "/";
    if (pathname === "/vote-costume") return "/select-guest";
    if (pathname === "/vote-karaoke") return guestId ? `/vote-costume?guestId=${guestId}` : "/vote-costume";
    if (pathname === "/review") return guestId ? `/vote-karaoke?guestId=${guestId}` : "/vote-karaoke";
    return "/";
  };

  const step = getStepNumber();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-retro-gold border-b-4 border-retro-brown shadow-lg">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <Link href={getBackUrl()}>
          <Button variant="ghost" size="sm">
            ← Atrás
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                num <= step
                  ? "bg-retro-orange text-white"
                  : "bg-retro-teal/30 text-retro-brown"
              }`}
            >
              {num}
            </div>
          ))}
        </div>
        <div className="w-16" /> {/* Spacer for centering */}
      </div>
    </nav>
  );
}

