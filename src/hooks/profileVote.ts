import { Database } from "@/types/supabaseTypes";
import { supabaseClient } from "../config/supabase-client";
import { PostgrestError, User } from "@supabase/supabase-js";

type TableName = "events" | "posts" | "comments";
type EventType = Database["public"]["Tables"]["events"]["Row"];
type PostType = Database["public"]["Tables"]["posts"]["Row"];
type CommentType = Database["public"]["Tables"]["comments"]["Row"];

type ProfileVote = {
  profile_id: string;
  voted_upon: string;
  vote_up: boolean;
  vote_down: boolean;
};

interface VoteFetch {
  error: PostgrestError,
  profileVote : ProfileVote[] | []
}

interface VoteUpsert {
  error: PostgrestError
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
  return ({profileVote,error} || {profileVote:[],error});
}

export async function voteUpsert(
  profileVote: ProfileVote,
  toVoteOn: EventType | PostType | CommentType,
  toVoteOnTable: TableName,
) :Promise<VoteUpsert> {
  const upVal = profileVote[0].vote_up ? 1 : 0;
  const downVal = profileVote[0].vote_down ? -1 : 0;
  const voteVal = toVoteOn.votes + upVal + downVal;

  const { error, status } = await supabaseClient
    .from("profiles_votes")
    .upsert(profileVote)
    .throwOnError();
  if (error && status !== 406) {
    throw error;
  }
  if (status === 201) {
    const toVoteOnUpdated = { ...toVoteOn };
    toVoteOnUpdated.votes = toVoteOn.votes + voteVal;
    const { error, status } = await supabaseClient
      .from(toVoteOnTable)
      .update(toVoteOnUpdated)
      .eq("id", toVoteOn.id)
      .throwOnError();
    if (error && status !== 406) {
      throw error;
    }
  }
  return {error}
}
