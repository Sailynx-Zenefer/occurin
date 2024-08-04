import { Database } from "@/types/supabaseTypes";
import { supabaseClient } from "../config/supabase-client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAlerts } from "react-native-paper-alerts";
import { error } from "console";

const dateIncrement = (date: Date, days: number): Date => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

type EventType = Database["public"]["Tables"]["events"]["Row"];

interface EventWeek {
  eventWeek: EventType[] | [];
  weekBeginDate: Date;
  nextWeekBeginDate: Date;
}

const fetchNextDate = async (lastDate: Date): Promise<Date> => {
  console.log("fNDate/lastDate:", lastDate.toLocaleDateString());
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
  console.log("fnDate/nextDate:", nextDate.toLocaleDateString());
  return nextDate;
};

const fetchEventWeekSB = async (nextDate): Promise<EventWeek> => {
  var weekday = new Array(7);
  weekday[0] = "Monday";
  weekday[1] = "Tuesday";
  weekday[2] = "Wednesday";
  weekday[3] = "Thursday";
  weekday[4] = "Friday";
  weekday[5] = "Saturday";
  weekday[6] = "Sunday";
  console.log(
    "fnDate/nextDate:",
    nextDate.toLocaleDateString(),
    "is a:",
    weekday[nextDate.getDay()],
  );

  const dateMod = (n) => -((n - 1) % 8);
  console.log("finDate/dateMod :", dateMod(nextDate.getDay()));
  const weekBeginDate = dateIncrement(nextDate, dateMod(nextDate.getDay()));
  console.log(
    "fnDate/weekBeginDate:",
    weekBeginDate.toLocaleDateString(),
    "is a:",
    weekday[weekBeginDate.getDay()],
  );
  const nextWeekBeginDate = dateIncrement(weekBeginDate, 7);

  console.log("dates:", weekBeginDate, nextWeekBeginDate);
  try {
    const { data, error, status } = await supabaseClient
      .from("events")
      .select()
      .gte("begin_time", weekBeginDate.toISOString())
      .lt("begin_time", nextWeekBeginDate.toISOString())
      .order("begin_time", { ascending: true });
    if (error && status !== 406) {
      throw error;
    }
    console.log("eventWeek:", data);
    const eventWeek = data || [];
    return {
      eventWeek,
      weekBeginDate,
      nextWeekBeginDate,
    };
  } catch (error) {
    console.log("fetchEventWeekSB Error:", error);
  }
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
  console.log("data:", data);
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
