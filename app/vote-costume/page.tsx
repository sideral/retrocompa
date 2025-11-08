"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAllGuests } from "@/app/actions/votes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface Guest {
  id: string;
  name: string;
  families?: {
    name: string;
  };
}

function VoteCostumeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const guestId = searchParams.get("guestId");
  const [allGuests, setAllGuests] = useState<Guest[]>([]);
  const [selectedGuests, setSelectedGuests] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!guestId) {
      router.push("/select-guest");
      return;
    }

    async function loadGuests() {
      const result = await getAllGuests();
      if (result.guests) {
        // Filter out the voter
        const filtered = result.guests.filter(
          (g: any) => g.id !== guestId
        ) as Guest[];
        setAllGuests(filtered);
      }
      setLoading(false);
    }
    loadGuests();
  }, [guestId, router]);

  const handleToggle = (guestId: string) => {
    setSelectedGuests((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(guestId)) {
        newSet.delete(guestId);
      } else {
        if (newSet.size < 3) {
          newSet.add(guestId);
        }
      }
      return newSet;
    });
  };

  const handleContinue = () => {
    if (selectedGuests.size === 3) {
      const votes = Array.from(selectedGuests);
      router.push(`/vote-karaoke?guestId=${guestId}&votes=${votes.join(",")}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-retro-gold pt-20 px-4">
        <div className="max-w-md mx-auto text-center py-20">
          <p className="text-retro-brown text-xl">Cargando...</p>
        </div>
      </div>
    );
  }

  // Group guests by family
  const groupedGuests = allGuests.reduce((acc, guest) => {
    const familyName = guest.families?.name || "Sin familia";
    if (!acc[familyName]) {
      acc[familyName] = [];
    }
    acc[familyName].push(guest);
    return acc;
  }, {} as Record<string, Guest[]>);

  return (
    <div className="h-[100dvh] bg-sunburst pt-20 pb-24 flex flex-col overflow-hidden">
      <div className="max-w-md mx-auto px-4 flex-1 flex flex-col min-h-0 w-full overflow-hidden">
        <Card className="bg-white/95 flex flex-col flex-1 min-h-0 overflow-hidden">
          <CardHeader className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 pb-4 mb-4 flex-shrink-0">
            <CardTitle className="text-center text-retro-teal text-4xl font-bold">
              Voto Mejor Pinta 👗
            </CardTitle>
            <div className="text-center mt-4">
              <div className="text-3xl font-bold text-retro-orange">
                {selectedGuests.size}/3{" "}
                <span className="text-retro-brown font-semibold">
                  Seleccionados
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col flex-1 min-h-0 overflow-y-scroll overflow-x-hidden scrollable-area">
            <div className="text-center space-y-2 flex-shrink-0 mb-4">
              <p className="text-retro-brown text-lg font-semibold">
                Elige las{" "}
                <span className="font-bold text-retro-orange text-2xl">3</span>{" "}
                <span className="font-bold text-retro-orange text-xl">
                  pintas más cheveres
                </span>
                , no importa el orden. 🎨
              </p>
              <p className="text-retro-brown/80 text-center text-sm">
                (No puedes votar por ti, ¡lo siento! 😅)
              </p>
            </div>
            <div className="space-y-6 flex-1 overflow-y-scroll overflow-x-hidden scrollable-area min-h-0 -mx-4 px-4">
              {Object.entries(groupedGuests).map(
                ([familyName, familyGuests]) => (
                  <div
                    key={familyName}
                    className="space-y-3 border-2 border-retro-teal/40 rounded-lg p-4 bg-white/50"
                  >
                    <h3 className="font-bold text-retro-brown text-xl text-center">
                      {familyName}
                    </h3>
                    <div className="space-y-2 pl-2">
                      {familyGuests.map((guest) => {
                        const isSelected = selectedGuests.has(guest.id);
                        return (
                          <label
                            key={guest.id}
                            className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              isSelected
                                ? "border-retro-orange bg-retro-orange/20 shadow-lg"
                                : selectedGuests.size >= 3
                                ? "border-retro-brown/20 opacity-50 cursor-not-allowed"
                                : "border-retro-brown/30 hover:border-retro-pink"
                            }`}
                          >
                            <Checkbox
                              checked={isSelected}
                              onChange={() => handleToggle(guest.id)}
                              disabled={!isSelected && selectedGuests.size >= 3}
                              className="mr-3"
                            />
                            <span className="text-retro-brown font-medium text-lg">
                              {guest.name}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-retro-gold border-t-4 border-retro-brown shadow-lg z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <Button
            onClick={handleContinue}
            disabled={selectedGuests.size !== 3}
            size="lg"
            className={`w-full ${
              selectedGuests.size === 3 ? "button-active-pulse" : ""
            }`}
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function VoteCostume() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-retro-gold pt-20 px-4">
          <div className="max-w-md mx-auto text-center py-20">
            <p className="text-retro-brown text-xl">Cargando...</p>
          </div>
        </div>
      }
    >
      <VoteCostumeContent />
    </Suspense>
  );
}
