import { Database } from "@/types/supabaseTypes";
import { supabaseClient } from "../config/supabase-client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { error } from "console";

const dateIncrement = (date: Date, days: number): Date => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

type FullEventInfo = Database["public"]["Tables"]["events"]["Row"];
type EventInfo = Omit<FullEventInfo, 'tickets_bought' | 'capacity'> & { profiles: {username: string} };
interface EventWeek {
  eventWeek: EventInfo[] | [];
  weekBeginDate: Date;
  nextWeekBeginDate: Date;
}

const fetchNextDate = async (lastDate: Date): Promise<Date> => {
  const {
    data: { begin_time },
    error,
    status,
  } = await supabaseClient
    .from("events")
    .select("begin_time")
    .gte("begin_time", lastDate.toISOString())
    .order("begin_time", { ascending: true })
    .limit(1)
    .single();
  if (error && status !== 406) {
    throw error;
  }
  const nextDate = new Date(begin_time);
  return nextDate;
};

const fetchEventWeekSB = async (nextDate): Promise<EventWeek> => {
  const dateIncrement = (date: Date, days: number): Date => {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };
  const dateMod = (n) => -((n - 1) % 8);
  const weekBeginDate = dateIncrement(nextDate, dateMod(nextDate.getDay()));
  const nextWeekBeginDate = dateIncrement(weekBeginDate, 7);
    const { data, error, status } = await supabaseClient
      .from("events")
      .select('id,creator_id, profiles!inner(username),begin_time,created_at,creator_id,description,finish_time,img_url,in_person,location_lat,location_long,location_name,ticket_price,ticketed,title,updated_at,votes')
      .gte("begin_time", weekBeginDate.toISOString())
      .lt("begin_time", nextWeekBeginDate.toISOString())
      .order("begin_time", { ascending: true });
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

const fetchEventWeek = async (pageParam: Date): Promise<EventWeek> => {
  try {
    const { eventWeek, weekBeginDate, nextWeekBeginDate } =
      await fetchEventWeekSB(await fetchNextDate(pageParam));
    console.log("eventweek:", eventWeek, weekBeginDate, nextWeekBeginDate);
    if (error instanceof Error) {
      console.error(error);
    }
    
    return {
      eventWeek,
      weekBeginDate,
      nextWeekBeginDate,
    };
  } catch (error) {
    console.log("fetcheventweekerror:", error);
  }
};

const useEventWeek = () => {
  const today = new Date();
  const {
    data,
    isError,
    isLoading,
    error,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["events"],
    queryFn: ({ pageParam}) => fetchEventWeek(pageParam),
    initialPageParam: today,
    getNextPageParam: (lastpage) => lastpage.nextWeekBeginDate,
    staleTime: Infinity,
  });
  const eventWeeks = data?.pages ?? [];

  return {
    eventWeeks,
    isError,
    isLoading,
    error,
    isFetching,
    hasNextPage,
    fetchNextPage,
  };
};

export default useEventWeek;


