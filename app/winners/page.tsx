"use client";

import { useEffect, useState } from "react";
import { getVotingResults } from "@/app/actions/votes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Results {
  totalVotes: number;
  costumeWinners: Array<{ id: string; name: string; count: number }>;
  karaokeWinner: { id: string; name: string; count: number } | null;
  guestsWithStatus: Array<{
    id: string;
    name: string;
    family: string;
    hasVoted: boolean;
  }>;
}

export default function Winners() {
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResults() {
      const result = await getVotingResults();
      if (result && "results" in result && result.results) {
        setResults(result.results as Results);
      }
      setLoading(false);
    }
    loadResults();

    // Refresh every 5 seconds
    const interval = setInterval(loadResults, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-retro-gold px-4 py-8">
        <div className="max-w-2xl mx-auto text-center py-20">
          <p className="text-retro-brown text-xl">Cargando resultados...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-retro-gold px-4 py-8">
        <div className="max-w-2xl mx-auto text-center py-20">
          <p className="text-retro-brown text-xl">Error cargando resultados</p>
        </div>
      </div>
    );
  }

  const groupedGuests = results.guestsWithStatus.reduce(
    (acc, guest) => {
      if (!acc[guest.family]) {
        acc[guest.family] = [];
      }
      acc[guest.family].push(guest);
      return acc;
    },
    {} as Record<string, typeof results.guestsWithStatus>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-retro-gold to-retro-pink/20 px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-5xl font-groovy text-retro-brown mb-2">
            Resultados
          </h1>
          <p className="text-retro-brown text-lg">
            Total de votos:{" "}
            <span className="font-bold text-retro-orange">
              {results.totalVotes}
            </span>
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-retro-pink text-center">
                Mejor Karaoke
              </CardTitle>
            </CardHeader>
            <CardContent>
              {results.karaokeWinner ? (
                <div className="text-center space-y-2">
                  <p className="text-2xl font-bold text-retro-brown">
                    {results.karaokeWinner.name}
                  </p>
                  <p className="text-retro-orange text-lg">
                    {results.karaokeWinner.count} voto
                    {results.karaokeWinner.count !== 1 ? "s" : ""}
                  </p>
                </div>
              ) : (
                <p className="text-center text-retro-brown/70">
                  Aún no hay votos
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-retro-orange text-center">
                Mejor Disfraz (Top 2)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {results.costumeWinners.length > 0 ? (
                <div className="space-y-3">
                  {results.costumeWinners.map((winner, idx) => (
                    <div
                      key={winner.id}
                      className="text-center p-2 bg-retro-orange/10 rounded"
                    >
                      <p className="font-bold text-retro-brown text-lg">
                        {idx + 1}. {winner.name}
                      </p>
                      <p className="text-retro-orange">
                        {winner.count} voto{winner.count !== 1 ? "s" : ""}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-retro-brown/70">
                  Aún no hay votos
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="text-retro-teal text-center">
              Estado de Votaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {Object.entries(groupedGuests).map(([familyName, guests]) => (
                <div key={familyName} className="space-y-2">
                  <h3 className="font-bold text-retro-brown text-lg border-b-2 border-retro-teal pb-1">
                    {familyName}
                  </h3>
                  <div className="space-y-1 pl-4">
                    {guests.map((guest) => (
                      <div
                        key={guest.id}
                        className="flex items-center justify-between"
                      >
                        <span className="text-retro-brown">{guest.name}</span>
                        <span
                          className={`text-2xl ${
                            guest.hasVoted
                              ? "text-retro-orange"
                              : "text-retro-brown/30"
                          }`}
                        >
                          {guest.hasVoted ? "✓" : "✗"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

