import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-retro-gold via-retro-orange/20 to-retro-pink/20 flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-groovy text-retro-brown drop-shadow-lg">
            RetroCompa
          </h1>
          <p className="text-3xl font-groovy text-retro-orange drop-shadow">
            2025
          </p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-retro-teal">
              ¡Bienvenidos, Parceros!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-retro-brown">
            <p className="text-lg leading-relaxed">
              ¡Qué tal, mi gente! Llegó el momento de ponerle sabor a esta
              fiesta retro. Estamos aquí para elegir a los más bacanos del
              evento.
            </p>
            <p className="text-lg leading-relaxed">
              Tienes que votar por los{" "}
              <span className="font-bold text-retro-orange">
                3 mejores disfraces
              </span>{" "}
              y por la{" "}
              <span className="font-bold text-retro-pink">
                familia que más se rajó en el karaoke
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

