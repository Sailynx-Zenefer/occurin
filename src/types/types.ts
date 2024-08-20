import { InfiniteData, QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { Database } from "./supabaseTypes";

export type FullEventInfo = Database["public"]["Tables"]["events"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];


export type EventInfo = Omit<FullEventInfo, "tickets_bought" | "capacity"> & {
  profiles: { username: string, avatar_url: string }
}

export type PostType = Database["public"]["Tables"]["posts"]["Row"];
export type CommentType = Database["public"]["Tables"]["comments"]["Row"];

export type ToVoteOn = EventInfo | PostType | CommentType;

export type ProfileVote = {
  user_id: string;
  voted_upon: string;
  save_event: boolean;
  hide_event: boolean;
};

export type DayFilter = {
  Mon: boolean
  Tue: boolean
  Wed: boolean
  Thu: boolean
  Fri: boolean
  Sat: boolean
  Sun: boolean
};

export interface EventWeekSB {
  eventWeek: EventInfo[] | [] | null;
  
}
export interface EventWeek extends EventWeekSB {
  eventWeek: EventInfo[] | [] | null;
  weekBeginDate: Date;
  nextWeekBeginDate: Date;
}

export type RefetchType = (options?: RefetchOptions) => Promise<QueryObserverResult<InfiniteData<EventWeek, unknown>, Error>>

