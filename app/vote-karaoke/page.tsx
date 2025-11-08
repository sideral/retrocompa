"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Family {
  id: string;
  name: string;
}

function VoteKaraokeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const guestId = searchParams.get("guestId");
  const costumeVotes = searchParams.get("votes")?.split(",") || [];
  const [families, setFamilies] = useState<Family[]>([]);
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [voterFamilyId, setVoterFamilyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!guestId || costumeVotes.length !== 3) {
      router.push("/select-guest");
      return;
    }

    async function loadData() {
      const supabase = createClient();

      // Get voter's family
      const { data: voter } = await supabase
        .from("guests")
        .select("family_id")
        .eq("id", guestId)
        .single();

      if (voter) {
        setVoterFamilyId(voter.family_id);
      }

      // Get all families except voter's
      const { data: allFamilies } = await supabase
        .from("families")
        .select("id, name")
        .order("name");

      if (allFamilies) {
        const filtered = allFamilies.filter(
          (f) => f.id !== voter?.family_id
        ) as Family[];
        setFamilies(filtered);
      }
      setLoading(false);
    }
    loadData();
  }, [guestId, costumeVotes, router]);

  const handleContinue = () => {
    if (selectedFamily) {
      router.push(
        `/review?guestId=${guestId}&costumeVotes=${costumeVotes.join(
          ","
        )}&karaokeVote=${selectedFamily}`
      );
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
    <div className="h-[100dvh] bg-sunburst pt-20 pb-24 flex flex-col overflow-hidden">
      <div className="max-w-md mx-auto px-4 flex-1 flex flex-col min-h-0 w-full overflow-hidden">
        <Card className="bg-white/95 flex flex-col flex-1 min-h-0 overflow-hidden">
          <CardHeader className="flex-shrink-0 mb-4">
            <CardTitle className="text-center text-retro-pink text-4xl font-bold">
              Mejor Karaoke 🎤
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="flex-shrink-0 mb-4 px-6">
              <p className="text-retro-brown text-center text-lg">
                Elige a la{" "}
                <span className="font-bold text-retro-pink">
                  familia que más se lució
                </span>{" "}
                en el karaoke. Solo puedes elegir una, ¡piénsalo bien! 🤔
              </p>
              <p className="text-retro-brown/80 text-center text-sm -mt-2">
                (No puedes votar por tu familia, ¡sé justo! ⚖️)
              </p>
            </div>
            <div className="flex-1 overflow-y-scroll scrollable-area min-h-0 px-2">
              <div className="space-y-2 px-4">
                {families.map((family) => {
                  const isSelected = selectedFamily === family.id;
                  return (
                    <div
                      key={family.id}
                      onClick={() => setSelectedFamily(family.id)}
                      className={`border-2 rounded-lg p-4 bg-white/50 cursor-pointer transition-all ${
                        isSelected
                          ? "border-retro-pink shadow-lg"
                          : "border-retro-teal/40"
                      }`}
                    >
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="family"
                          value={family.id}
                          checked={isSelected}
                          onChange={(e) => setSelectedFamily(e.target.value)}
                          className="mr-3 h-5 w-5 text-retro-pink pointer-events-none"
                        />
                        <span
                          className={`text-retro-brown font-medium text-lg ${
                            isSelected ? "font-bold" : ""
                          }`}
                        >
                          {family.name}
                        </span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-retro-gold border-t-4 border-retro-brown shadow-lg z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <Button
            onClick={handleContinue}
            disabled={!selectedFamily}
            size="lg"
            className={`w-full ${selectedFamily ? "button-active-pulse" : ""}`}
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function VoteKaraoke() {
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
      <VoteKaraokeContent />
    </Suspense>
  );
}
