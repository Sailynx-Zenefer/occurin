
import { Database } from "../types/supabaseTypes";
import EventCard from "./EventCard";
import { useAuth } from "@/hooks/Auth";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useRef } from "react";

type FullEventInfo = Database["public"]["Tables"]["events"]["Row"];
type EventInfo = Omit<FullEventInfo, 'tickets_bought' | 'capacity'> & { profiles: {username: string} };

interface WeekScrollCardProps {
  eventWeek: EventInfo[];
}

const WeekScrollCard = ({
  eventWeek,
}: WeekScrollCardProps): React.JSX.Element => {
  const flatListRef = useRef(null);
  const scrollToIndex = (index) => {
    flatListRef.current.scrollToIndex({ index, animated: true });
  };

  // scrollToIndex({params: {
  //   index: number;
  //   animated?: true;
  //   viewOffset?: 0,
  //   viewPosition?: 0,
  // }})
  useEffect(()=>{
    scrollToIndex(5)
  },[flatListRef])
  const { session } = useAuth();
  return (
        <FlashList
          ref={flatListRef}
          data={eventWeek}
          renderItem={({ item: event }) => (
            <EventCard event={event} session={session} />
          )}
          numColumns={1}
          keyExtractor={(item, index) => index.toString()}
          horizontal={true}
          estimatedItemSize={190 * 15}
          onEndReachedThreshold={0.1}
          contentContainerStyle={{ paddingHorizontal: 0 }
        }
        />
  );
};

export default WeekScrollCard;
