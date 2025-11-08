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
          <CardHeader>
            <CardTitle className="text-center text-retro-teal">
              ¡Bienvenidos!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-retro-brown">
            <p className="text-lg leading-relaxed">
              ¡Qué tal, mi gente! Llegó el momento de ponerle sabor a esta
              fiesta retro. Estamos aquí para elegir a los más chéveres del
              evento.
            </p>
            <p className="text-lg leading-relaxed">
              Tienes que votar por los{" "}
              <span className="font-bold text-retro-orange">
                3 mejores pintas
              </span>{" "}
              y por la{" "}
              <span className="font-bold text-retro-pink">
                familia que más se lució en el karaoke
              </span>
              . ¡Así que dale, que la fiesta está que arde!
            </p>
          </CardContent>
        </Card>

        <Link href="/select-guest" className="block">
          <Button size="lg" className="w-full text-xl py-6 shadow-2xl">
            ¡Quiero votar ya! 🎉
          </Button>
        </Link>
      </div>
    </div>
  );
}

