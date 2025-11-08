"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAvailableGuests } from "@/app/actions/votes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Guest {
  id: string;
  name: string;
  families: {
    name: string;
  };
}

export default function SelectGuest() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadGuests() {
      const result = await getAvailableGuests();
      if (result.guests) {
        setGuests(result.guests as Guest[]);
      }
      setLoading(false);
    }
    loadGuests();
  }, []);

  const groupedGuests = guests.reduce((acc, guest) => {
    const familyName = guest.families?.name || "Sin familia";
    if (!acc[familyName]) {
      acc[familyName] = [];
    }
    acc[familyName].push(guest);
    return acc;
  }, {} as Record<string, Guest[]>);

  const handleContinue = () => {
    if (selectedGuest) {
      router.push(`/vote-costume?guestId=${selectedGuest}`);
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

  return (
    <div className="min-h-screen bg-sunburst pt-20 pb-24">
      <div className="max-w-md mx-auto px-4 space-y-6">
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="text-center text-retro-teal text-4xl font-bold">
              ¿Quién eres tú?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-retro-brown text-center mb-4">
              Selecciona tu nombre para comenzar a votar
            </p>
            <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto scrollable-area">
                {Object.entries(groupedGuests).map(([familyName, familyGuests]) => (
                  <div key={familyName} className="space-y-2">
                    <h3 className="font-bold text-retro-brown text-lg border-b-2 border-retro-teal pb-1">
                      {familyName}
                    </h3>
                    <div className="space-y-2 pl-4">
                      {familyGuests.map((guest) => (
                        <label
                          key={guest.id}
                          className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedGuest === guest.id
                              ? "border-retro-orange bg-retro-orange/20 shadow-lg"
                              : "border-retro-brown/30 hover:border-retro-pink"
                          }`}
                        >
                          <input
                            type="radio"
                            name="guest"
                            value={guest.id}
                            checked={selectedGuest === guest.id}
                            onChange={(e) => setSelectedGuest(e.target.value)}
                            className="mr-3 h-5 w-5 text-retro-orange"
                          />
                          <span className="text-retro-brown font-medium">
                            {guest.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-retro-gold border-t-4 border-retro-brown shadow-lg z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <Button
            onClick={handleContinue}
            disabled={!selectedGuest}
            size="lg"
            className={`w-full ${selectedGuest ? 'button-active-pulse' : ''}`}
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
}

