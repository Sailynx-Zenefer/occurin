
import { supabaseClient } from "../config/supabase-client";
import { PostgrestError, User } from "@supabase/supabase-js";
import { ProfileVote, ToVoteOn } from "@/types/types";

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
    .select("user_id,voted_upon,save_event,hide_event")
    .eq("user_id", user.id)
    .eq("voted_upon", toVoteOnId)
    .throwOnError();
  if (error) {
    throw error;
  }
  return { profileVote, error } || { profileVote: [], error };
}

export async function voteUpsert(
  user: User,
  oldProfileVote: ProfileVote,
  newProfileVote: ProfileVote,
  toVoteOn: ToVoteOn,
): Promise<VoteUpsert> {
  let oldUpVal = oldProfileVote.save_event ? 1 : 0;
  let newUpVal = newProfileVote.save_event ? 1 : 0;
  let newUpValChange = 0;
  if (oldUpVal === 0 && newUpVal === 1) {
    newUpValChange = 1;
  } else if (oldUpVal === 1 && newUpVal === 0) {
    newUpValChange = -1;
  }

  let oldDownVal = oldProfileVote.hide_event ? 1 : 0;
  let newDownVal = newProfileVote.hide_event ? 1 : 0;
  let newDownValChange = 0;
  if (oldDownVal === 0 && newDownVal === 1) {
    newDownValChange = 1;
  } else if (oldDownVal === 1 && newDownVal === 0) {
    newDownValChange = -1;
  }
  const voteVal = toVoteOn.votes + newUpValChange - newDownValChange;
  const { error, status } = await supabaseClient
    .from("profiles_votes")
    .upsert(newProfileVote, { onConflict: "user_id, voted_upon" })
    .throwOnError();
  if (error && status !== 406) {
    throw error;
  }
  return { error, voteVal };
}



export async function fetchProfileVote(
  user : User,
  toVoteOn : ToVoteOn, 
  setProfileVote : React.Dispatch<React.SetStateAction<ProfileVote>>){
  try {
    const { error, profileVote : profileVoteFromSB } = await voteFetch(user, toVoteOn.id);
    if (error) {
      throw error;
    }
    if (profileVoteFromSB.length > 0) {
      const vote = profileVoteFromSB[0];
      setProfileVote({
        user_id: vote.user_id,
        voted_upon: vote.voted_upon,
        save_event: vote.save_event,
        hide_event: vote.hide_event,
      });
    }else if (profileVoteFromSB.length === 0) {
      setProfileVote({
        user_id: user.id,
        voted_upon: toVoteOn.id,
        save_event: false,
        hide_event: false,
      });
    }
  } catch (error) {
    console.error("Error fetching profile vote:", error);
  }
};