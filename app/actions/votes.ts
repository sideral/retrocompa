"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitVote(
  voterId: string,
  costumeVotes: [string, string, string],
  karaokeVote: string
) {
  const supabase = await createClient();

  const { error } = await supabase.from("votes").insert({
    voter_id: voterId,
    costume_vote_1: costumeVotes[0],
    costume_vote_2: costumeVotes[1],
    costume_vote_3: costumeVotes[2],
    karaoke_vote: karaokeVote,
  });

  if (error) {
    if (error.code === "23505") {
      // Unique constraint violation - already voted
      return { error: "Ya has votado" };
    }
    return { error: error.message };
  }

  revalidatePath("/select-guest");
  revalidatePath("/winners");
  return { success: true };
}

export async function getAvailableGuests() {
  const supabase = await createClient();

  // Get all guests with their families
  const { data: guests, error: guestsError } = await supabase
    .from("guests")
    .select("*, families(*)")
    .order("name");

  if (guestsError || !guests) {
    return { error: guestsError?.message, guests: [] };
  }

  // Get all voters
  const { data: votes } = await supabase.from("votes").select("voter_id");

  const votedIds = new Set(votes?.map((v) => v.voter_id) || []);

  // Filter out guests who have voted
  const available = guests.filter((g) => !votedIds.has(g.id));

  return { guests: available };
}

export async function getAllGuests() {
  const supabase = await createClient();

  const { data: guests, error } = await supabase
    .from("guests")
    .select("*, families(*)")
    .order("name");

  if (error) {
    return { error: error.message, guests: [] };
  }

  return { guests: guests || [] };
}

export async function getVotingResults() {
  const supabase = await createClient();

  // Get all votes
  const { data: votes, error: votesError } = await supabase
    .from("votes")
    .select(`
      *,
      voters:guests!votes_voter_id_fkey(name),
      costume1:guests!votes_costume_vote_1_fkey(name),
      costume2:guests!votes_costume_vote_2_fkey(name),
      costume3:guests!votes_costume_vote_3_fkey(name),
      karaoke:families!votes_karaoke_vote_fkey(name)
    `);

  if (votesError || !votes) {
    return { error: votesError?.message, results: null };
  }

  // Count costume votes
  const costumeCounts: Record<string, number> = {};
  votes.forEach((vote) => {
    [vote.costume_vote_1, vote.costume_vote_2, vote.costume_vote_3].forEach(
      (id) => {
        if (id) costumeCounts[id] = (costumeCounts[id] || 0) + 1;
      }
    );
  });

  // Get costume winners (top 2)
  const costumeEntries = Object.entries(costumeCounts)
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 2);

  const costumeWinners = await Promise.all(
    costumeEntries.map(async ({ id }) => {
      const { data } = await supabase
        .from("guests")
        .select("name")
        .eq("id", id)
        .single();
      return { id, name: data?.name || "Desconocido", count: costumeCounts[id] };
    })
  );

  // Count karaoke votes
  const karaokeCounts: Record<string, number> = {};
  votes.forEach((vote) => {
    if (vote.karaoke_vote) {
      karaokeCounts[vote.karaoke_vote] =
        (karaokeCounts[vote.karaoke_vote] || 0) + 1;
    }
  });

  // Get karaoke winner (top 1)
  const karaokeEntry = Object.entries(karaokeCounts)
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => b.count - a.count)[0];

  let karaokeWinner = null;
  if (karaokeEntry) {
    const { data } = await supabase
      .from("families")
      .select("name")
      .eq("id", karaokeEntry.id)
      .single();
    karaokeWinner = {
      id: karaokeEntry.id,
      name: data?.name || "Desconocido",
      count: karaokeEntry.count,
    };
  }

  // Get all guests with vote status
  const { data: allGuests } = await supabase
    .from("guests")
    .select("id, name, families(name)")
    .order("name");

  const votedIds = new Set(votes.map((v) => v.voter_id));
  const guestsWithStatus =
    allGuests?.map((g) => ({
      id: g.id,
      name: g.name,
      family: g.families?.name || "",
      hasVoted: votedIds.has(g.id),
    })) || [];

  return {
    totalVotes: votes.length,
    costumeWinners,
    karaokeWinner,
    guestsWithStatus,
  };
}

