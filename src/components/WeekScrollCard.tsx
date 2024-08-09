import { EventInfo, EventWeek, RefetchType } from "@/types/types";
import EventCard from "./EventCard";
import { useAuth } from "@/hooks/Auth";
import { FlashList } from "@shopify/flash-list";
import { StyleSheet, View } from "react-native";
import { Button, Chip, Surface, Text } from "react-native-paper";

interface WeekScrollCardProps {
  eventWeek: EventInfo[];
  refetch: RefetchType;
  isFetching: boolean;
  tabName : string
}

const WeekScrollCard = ({
  eventWeek,
  refetch,
  isFetching,
  tabName
}: WeekScrollCardProps): React.JSX.Element => {
  const { session } = useAuth();

  return (
    <View style={styles.viewStyle}>
      <Surface elevation={1} style={styles.surfaceStyle}>
        <Chip elevation={1}>
          <Text>{"\u200b"}</Text>
        </Chip>
      </Surface>
      <FlashList
        data={eventWeek}
        renderItem={({ item: eventInfo }) => (
          <EventCard event={eventInfo} session={session} refetch={refetch} />
        )}
        extraData={[eventWeek,isFetching]}
        refreshing={isFetching}
        numColumns={1}
        estimatedItemSize={200 * 200}
        keyExtractor={(item,index) => `${index}${tabName}${item.id.toString()}`}
        horizontal={true}
        onEndReachedThreshold={0.1}
        contentContainerStyle={{ paddingHorizontal: 0, paddingVertical: 0 }}
      />
    </View>
  );
};

export default WeekScrollCard;

const styles = StyleSheet.create({
  viewStyle: {
    display: "flex",
  },
  surfaceStyle: {
    position: "absolute",
    left: 0,
    right: 0,
    margin: 0,
    padding: 0,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    flexWrap: "nowrap",
    overflow: "visible",
    alignSelf: "stretch",
  },
});
