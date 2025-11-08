"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { submitVote } from "@/app/actions/votes";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function ReviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const guestId = searchParams.get("guestId");
  const costumeVotes = searchParams.get("costumeVotes")?.split(",") || [];
  const karaokeVote = searchParams.get("karaokeVote");
  const [costumeNames, setCostumeNames] = useState<string[]>([]);
  const [karaokeName, setKaraokeName] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!guestId || costumeVotes.length !== 3 || !karaokeVote) {
      router.push("/select-guest");
      return;
    }

    async function loadNames() {
      const supabase = createClient();

      // Get costume vote names - preserve order by fetching all and mapping
      const { data: costumeGuests } = await supabase
        .from("guests")
        .select("id, name")
        .in("id", costumeVotes);

      if (costumeGuests) {
        // Create a map for quick lookup
        const guestMap = new Map(costumeGuests.map((g) => [g.id, g.name]));
        // Map costumeVotes array (which is in correct order) to names
        const orderedNames = costumeVotes
          .map((id) => guestMap.get(id))
          .filter((name): name is string => name !== undefined);
        setCostumeNames(orderedNames);
      }

      // Get karaoke family name
      const { data: karaokeFamily } = await supabase
        .from("families")
        .select("name")
        .eq("id", karaokeVote)
        .single();

      if (karaokeFamily) {
        setKaraokeName(karaokeFamily.name);
      }
    }
    loadNames();
  }, [guestId, costumeVotes, karaokeVote, router]);

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async () => {
    if (!guestId || costumeVotes.length !== 3 || !karaokeVote) return;

    setSubmitting(true);
    const result = await submitVote(
      guestId,
      [costumeVotes[0], costumeVotes[1], costumeVotes[2]],
      karaokeVote
    );

    if (result.error) {
      alert(result.error);
      setSubmitting(false);
    } else {
      router.push("/confirmation");
    }
  };

  return (
    <div className="min-h-screen bg-sunburst pt-20 pb-24">
      <div className="max-w-md mx-auto px-4 space-y-6">
        <Card className="bg-white/95">
          <CardHeader className="mb-4">
            <CardTitle className="text-center text-retro-teal">
              Revisa tus votos 👀
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-bold text-retro-orange text-xl">
                Tus 3 votos para mejor pinta: 👗
              </h3>
              <ul className="space-y-2 pl-4">
                {costumeNames.map((name, idx) => (
                  <li
                    key={idx}
                    className="text-retro-brown text-lg flex items-center"
                  >
                    <span className="mr-2 text-retro-orange">•</span>
                    {name}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 border-t-2 border-retro-brown/20 pt-4">
              <h3 className="font-bold text-retro-pink text-xl">
                Tu voto para mejor karaoke: 🎤
              </h3>
              <p className="text-retro-brown text-lg pl-4">
                <span className="mr-2 text-retro-pink">•</span>
                {karaokeName}
              </p>
            </div>

            <p className="text-center text-retro-brown text-base font-semibold pt-4">
              ¿Quieres cambiar algo? Usa el botón &quot;Atrás&quot;. Si todo está bien,
              ¡confirma tu voto! ✨
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-retro-gold border-t-4 border-retro-brown shadow-lg z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleBack}
              variant="outline"
              size="lg"
              className="w-1/3"
              disabled={submitting}
            >
              Atrás
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              size="lg"
              className={`w-2/3 ${!submitting ? "button-active-pulse" : ""}`}
            >
              {submitting ? "Enviando..." : "Confirmar y enviar"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Review() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-retro-gold pt-20 px-4">
        <div className="max-w-md mx-auto text-center py-20">
          <p className="text-retro-brown text-xl">Cargando...</p>
        </div>
      </div>
    }>
      <ReviewContent />
    </Suspense>
  );
}

