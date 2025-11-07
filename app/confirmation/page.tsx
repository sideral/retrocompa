"use client";

import { useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Confirmation() {
  useEffect(() => {
    // Trigger confetti animation
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-retro-gold via-retro-orange/20 to-retro-pink/20 flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-retro-teal text-4xl">
              ¡Listo! 🎉
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="text-retro-brown text-xl leading-relaxed">
              ¡Tus votos han sido enviados! Ya hiciste tu parte para elegir a
              los más bacanos de la fiesta.
            </p>
            <p className="text-retro-brown text-lg leading-relaxed">
              Ahora sí, a disfrutar de la fiesta y a ver quién se lleva los
              premios. ¡Que la pasen de lo mejor!
            </p>
            <div className="pt-4">
              <Link href="/">
                <Button size="lg" className="w-full">
                  Volver al inicio
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

