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
  const { data: votes, error: votesError } = await supabase.from("votes")
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

  // Get costume winners (top 2, including ties)
  const costumeEntries = Object.entries(costumeCounts)
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => b.count - a.count);

  // Get top count and second top count
  const topCount = costumeEntries[0]?.count || 0;
  const secondCount =
    costumeEntries.find((e) => e.count < topCount)?.count || topCount;

  // Include all entries with top count or second count
  const topTwoEntries = costumeEntries.filter(
    (e) => e.count === topCount || e.count === secondCount
  );

  const costumeWinners = await Promise.all(
    topTwoEntries.map(async ({ id }) => {
      const { data } = await supabase
        .from("guests")
        .select("name")
        .eq("id", id)
        .single();
      return {
        id,
        name: data?.name || "Desconocido",
        count: costumeCounts[id],
      };
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

  // Get karaoke winners (top 1, including ties)
  const karaokeEntries = Object.entries(karaokeCounts)
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => b.count - a.count);

  const topKaraokeCount = karaokeEntries[0]?.count || 0;
  const topKaraokeEntries = karaokeEntries.filter(
    (e) => e.count === topKaraokeCount
  );

  // For karaoke, return array of winners (can be multiple in case of tie)
  const karaokeWinners = await Promise.all(
    topKaraokeEntries.map(async ({ id }) => {
      const { data } = await supabase
        .from("families")
        .select("name")
        .eq("id", id)
        .single();
      return {
        id,
        name: data?.name || "Desconocido",
        count: karaokeCounts[id],
      };
    })
  );

  // Get all guests with vote status
  const { data: allGuests } = await supabase
    .from("guests")
    .select("id, name, family_id, families(name, id)")
    .order("name");

  const votedIds = new Set(votes.map((v) => v.voter_id));
  const guestsWithStatus =
    allGuests?.map((g: any) => {
      const family = g.families as { name: string; id: string } | null;
      const familyId = family?.id || g.family_id;
      return {
        id: g.id,
        name: g.name,
        family: family?.name || "",
        familyId: familyId,
        hasVoted: votedIds.has(g.id),
        costumeVoteCount: costumeCounts[g.id] || 0,
        familyVoteCount: familyId ? (karaokeCounts[familyId] || 0) : 0,
      };
    }) || [];

  return {
    results: {
      totalVotes: votes.length,
      costumeWinners,
      karaokeWinners: karaokeWinners.length > 0 ? karaokeWinners : null,
      guestsWithStatus,
    },
  };
}
