import { Database } from "@/types/supabaseTypes";
import { supabaseClient } from "../config/supabase-client";
import { PostgrestError, User } from "@supabase/supabase-js";

type FullEventInfo = Database["public"]["Tables"]["events"]["Row"];
type EventInfo = Omit<FullEventInfo, "tickets_bought" | "capacity"> & {
  profiles: { username: string };
};

type PostType = Database["public"]["Tables"]["posts"]["Row"];
type CommentType = Database["public"]["Tables"]["comments"]["Row"];

type ProfileVote = {
  profile_id: string;
  voted_upon: string;
  vote_up: boolean;
  vote_down: boolean;
};

interface VoteFetch {
  error: PostgrestError;
  profileVote: ProfileVote[] | [];
}

interface VoteUpsert {
  error: PostgrestError;
  voteVal: number;
}

export async function voteFetch(
  user: User,
  toVoteOnId: string,
): Promise<VoteFetch> {
  const { data: profileVote, error } = await supabaseClient
    .from("profiles_votes")
    .select("profile_id,voted_upon,vote_up,vote_down")
    .eq("profile_id", user.id)
    .eq("voted_upon", toVoteOnId)
    .throwOnError();
  if (error) {
    throw error;
  }
  return { profileVote, error } || { profileVote: [], error };
}

export async function voteUpsert(
  user: User,
  profileVote: ProfileVote,
  toVoteOn: EventInfo | PostType | CommentType,
): Promise<VoteUpsert> {
  let upVal = 0;
  let downVal = 0;
  if (profileVote.vote_up) {
    upVal = 1;
  } else {
    upVal = 0;
  }
  if (profileVote.vote_down) {
    downVal = -1;
  } else {
    downVal = 0;
  }

  const voteVal = toVoteOn.votes + upVal + downVal;

  const { error, status } = await supabaseClient
    .from("profiles_votes")
    .upsert(profileVote, { onConflict: "profile_id, voted_upon" })
    .eq("profile_id", user.id)
    .eq("voted_upon", toVoteOn.id)
    .throwOnError();
  if (error && status !== 406) {
    throw error;
  }
  return { error, voteVal };
}
