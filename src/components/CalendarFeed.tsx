import {StyleSheet } from "react-native";
import React from "react";
import { FlashList } from "@shopify/flash-list";
import WeekScrollCard from "./WeekScrollCard";
import "react-native-url-polyfill/auto";
import useEventWeek from "@/hooks/useEventWeek";



const CalendarFeed = () => {
  const {
    eventWeeks,
    isError,
    isLoading,
    error,
    isFetching,
    hasNextPage,
    fetchNextPage,
  }= useEventWeek()

  return (
    <>
    <FlashList
      data={eventWeeks}
      renderItem={({item: eventWeek}) => <WeekScrollCard eventWeek={eventWeek.eventWeek} />}
      numColumns={1}
      estimatedItemSize={190 * 15}
      refreshing={isFetching}
      onRefresh={fetchNextPage}
      onEndReached={() => !isFetching && fetchNextPage()}
      onEndReachedThreshold={0.1}
      contentContainerStyle={{ paddingVertical: 12 }}
    />
    </>
  );
};

export default CalendarFeed;

const styles = StyleSheet.create({
  events: {
    // backgroundColor: "red",
  },
  eventsGrid: {
    // backgroundColor: "blue",
  },
});

