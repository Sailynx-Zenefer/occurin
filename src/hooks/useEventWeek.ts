import { EventWeek } from "@/types/types";
import { supabaseClient } from "../config/supabase-client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";

const dateIncrement = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const dateMod = (n: number) => -((n - 1) % 8);

const fetchNextDate = async (
  lastDate: Date,
  { saved }: EventWeekOptions,
  user: User,
): Promise<Date> => {
  const query = supabaseClient
    .from("events")
    .select(
      `begin_time,
      id,
      profiles_votes!inner()`,
    )
    .gte("begin_time", lastDate.toISOString())
    .order("begin_time", { ascending: true });
  if (saved) {
    query
      .eq("profiles_votes.user_id", user.id)
      .eq("profiles_votes.save_event", true);
  }

  const { data, error, status } = await query.limit(1).single();

  if (error && status !== 406) {
    throw error;
  }

  if (data && data.begin_time) {
    return new Date(data.begin_time);
  }

  return null;
};

const fetchEventWeekSB = async (
  nextDate: Date,
  { saved }: EventWeekOptions,
  user: User,
): Promise<EventWeek> => {
  
  const weekBeginDate = dateIncrement(nextDate, dateMod(nextDate.getDay()));
  const nextWeekBeginDate = dateIncrement(weekBeginDate, 7);

  const query = supabaseClient
    .from("events")
    .select(
     `id, 
     creator_id,
     profiles_votes!inner(),
     profiles!inner(username,avatar_url),
     begin_time, created_at, description,
     finish_time,
     img_url,
     in_person,
     location_lat,
     location_long,
     location_name,
     ticket_price,
     ticketed, title,
     updated_at,
     votes`,
    )
    .gte("begin_time", weekBeginDate.toISOString())
    .lt("begin_time", nextWeekBeginDate.toISOString())
    .order("begin_time", { ascending: true });

  if (saved) {
    console.log("saved", query);
    query
      .eq("profiles_votes.user_id", user.id)
      .eq("profiles_votes.save_event", true);
  }

  const { data, error, status } = await query;

  if (error && status !== 406) {
    throw error;
  }

  const eventWeek = data || [];

  return {
    eventWeek,
    weekBeginDate,
    nextWeekBeginDate,
  };
};

interface EventWeekOptions {
  saved: boolean;
  tabName: string
}

export const fetchEventWeek = async (
  pageParam: Date,
  options: EventWeekOptions,
  user: User,
): Promise<EventWeek> => {
  if (pageParam !== null){
  try {
    const nextDate = await fetchNextDate(pageParam, options, user);
    return await fetchEventWeekSB(nextDate, options, user);
  } catch (error) {
    console.error("Error fetching event week:", error);
    throw error;
  }
  }
  return null
};

const useEventWeek = ({ saved, tabName}: EventWeekOptions, user: User) => {
  const today = new Date();

  const {
    data,
    status,
    isLoading,
    error,
    isError,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["events",saved,tabName],
    queryFn: ({ pageParam = today}) =>
      fetchEventWeek(pageParam, { saved, tabName}, user),
    initialPageParam: today,
    getNextPageParam: (lastPage) => lastPage.nextWeekBeginDate
  });

  const eventWeeks = data?.pages ?? [];

  return {
    status,
    isLoading,
    error,
    isError,
    isFetching,
    hasNextPage,
    fetchNextPage,
    refetch,
    isFetchingNextPage,
    eventWeeks
  };
};

export default useEventWeek;
