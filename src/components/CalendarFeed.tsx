import { StyleSheet } from "react-native";
import React from "react";
import { FlashList } from "@shopify/flash-list";
import WeekScrollCard from "./WeekScrollCard";
import "react-native-url-polyfill/auto";
import useEventWeek from "@/hooks/useEventWeek";
import { Icon, Surface, Text } from "react-native-paper";
import dayjs from "dayjs";

const CalendarFeed = () => {
  const { eventWeeks, isFetching, fetchNextPage } = useEventWeek();
  const dateIncrement = (date: Date, days: number): Date => {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };
  const dateMod = (n) => -((n - 1) % 8);


  return (
    <FlashList
      data={eventWeeks}
      renderItem={({ item: eventWeek }) => (
        <WeekScrollCard eventWeek={eventWeek.eventWeek} />
      )}
      numColumns={1}
      estimatedItemSize={190 * 15}
      refreshing={isFetching}
      onRefresh={fetchNextPage}
      onEndReached={() => !isFetching && fetchNextPage()}
      onEndReachedThreshold={0.1}
      ItemSeparatorComponent={({ trailingItem: { eventWeek } }) => {
        const firstEventTime = new Date(eventWeek[0].begin_time)
        const weekBeginDate = dateIncrement(firstEventTime, dateMod(firstEventTime.getDay()));
        const timeWeek = dayjs(weekBeginDate).format(
          "[Week Beginning ]ddd MMM D",
        );
        return (
          <Surface style={styles.surfaceStyle}
          elevation={3}>
                        <Icon
        source={"arrow-down-bold"}
        color={"white"}
        size={20}
      />
            <Text style={styles.textStyle}>{timeWeek}</Text>
            <Icon
        source={"arrow-down-bold"}
        color={"white"}
        size={20}
      />
          </Surface>
        );
      }}
    />
  );
};

export default CalendarFeed;

const styles = StyleSheet.create({
  textStyle: {
    margin: 10,
  },
  surfaceStyle: {
    marginTop:20,
    marginBottom:5,
    display: "flex",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"flex-start"
  }
});
