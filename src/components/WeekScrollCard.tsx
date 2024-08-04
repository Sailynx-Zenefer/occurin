import { StyleSheet } from "react-native";
import { Database } from "../types/supabaseTypes";
import { Button, Card, Text } from "react-native-paper";
import EventCard from "./EventCard";
import { useAuth } from "@/hooks/Auth";
import { CellContainer, FlashList } from "@shopify/flash-list";
import CardContent from "react-native-paper/lib/typescript/components/Card/CardContent";
import { useEffect, useRef } from "react";

type EventType = Database["public"]["Tables"]["events"]["Row"];

interface WeekScrollCardProps {
  eventWeek: EventType[];
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

const styles = StyleSheet.create({
  cardContent: {
    flexDirection: "row",
    borderWidth:2,
    borderStyle:"solid",
    borderColor:"purple"
  },
  card: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    alignItems: "stretch",
    justifyContent: "flex-start",
  },
  cardCover: {
    marginHorizontal: 0,
    marginVertical: 10,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "red",
  },
  cardActions: {
    marginHorizontal: 0,
    marginVertical: 10,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "green",
  },
});

export default WeekScrollCard;
