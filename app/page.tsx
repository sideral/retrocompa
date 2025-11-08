import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-sunburst flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img
              src="/assets/logoretro.png"
              alt="RetroCompa 2025"
              className="max-w-full h-auto drop-shadow-lg"
              style={{ maxHeight: '300px' }}
            />
          </div>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm">
          <CardHeader className="mb-4">
            <CardTitle className="text-center text-retro-teal">
              ¡Bienvenido a RetroCompa 2025!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-retro-brown">
            <p className="text-lg leading-relaxed">
              ¡Llegó el momento de elegir a los ganadores de esta fiesta retro! 🎊
            </p>
            <p className="text-lg leading-relaxed">
              Vota por las{" "}
              <span className="font-bold text-retro-orange">
                3 mejores pintas 👗
              </span>{" "}
              y por la{" "}
              <span className="font-bold text-retro-pink">
                mejor presentación de karaoke en familia 🎤
              </span>
              .
            </p>
          </CardContent>
        </Card>

        <Link href="/select-guest" className="block">
          <Button size="lg" className="w-full text-xl py-6 shadow-2xl">
            ¡Empezar a Votar! 🎉
          </Button>
        </Link>
      </div>
    </div>
  );
}

