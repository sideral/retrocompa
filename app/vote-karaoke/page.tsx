"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Family {
  id: string;
  name: string;
}

export default function VoteKaraoke() {
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
        `/review?guestId=${guestId}&costumeVotes=${costumeVotes.join(",")}&karaokeVote=${selectedFamily}`
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
    <div className="min-h-screen bg-gradient-to-b from-retro-gold to-retro-pink/20 pt-20 pb-8">
      <div className="max-w-md mx-auto px-4 space-y-6">
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="text-center text-retro-pink">
              Mejor Karaoke
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-retro-brown text-center text-lg">
              ¡Ahora sí, parcero! Elige a la{" "}
              <span className="font-bold text-retro-pink">familia que más se rajó</span>{" "}
              en el karaoke. Solo puedes elegir una, así que piénsalo bien.
            </p>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {families.map((family) => {
                const isSelected = selectedFamily === family.id;
                return (
                  <label
                    key={family.id}
                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-retro-pink bg-retro-pink/20 shadow-lg"
                        : "border-retro-brown/30 hover:border-retro-pink"
                    }`}
                  >
                    <input
                      type="radio"
                      name="family"
                      value={family.id}
                      checked={isSelected}
                      onChange={(e) => setSelectedFamily(e.target.value)}
                      className="mr-3 h-5 w-5 text-retro-pink"
                    />
                    <span className="text-retro-brown font-medium text-lg">
                      {family.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleContinue}
          disabled={!selectedFamily}
          size="lg"
          className="w-full"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}

