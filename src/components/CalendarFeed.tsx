import { SafeAreaView, StyleSheet, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import WeekScrollCard from "./WeekScrollCard";
import "react-native-url-polyfill/auto";
import useEventWeek from "@/utils/useEventWeek";
import { ActivityIndicator, Button, Surface, Text } from "react-native-paper";
import dayjs from "dayjs";
import { useAuth } from "@/utils/Auth";
import DayChipFilter from "./DayChipFilter";
import { DayFilter } from "@/types/types";
import { useRefreshEvents } from "@/utils/RefreshEvents";

const dateIncrement = (date: Date, days: number): Date => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
const dateMod = (n) => -((n - 1) % 8);

const CalendarFeed = () => {
  const {
    newEventLoading,
    setNewEventLoading,
    savedEventLoading,
    setSavedEventLoading,
  } = useRefreshEvents();
  const { user } = useAuth();
  const {
    isFetching,
    hasNextPage,
    fetchNextPage,
    isLoading,
    eventWeeks,
    refetch,
    status,
  } = useEventWeek({ saved: false, tabName: "index" }, user);

  useEffect(() => {
    if (status === "success") {
    }
  }, [status]);

  useEffect(() => {
    if (newEventLoading) {
      setNewEventLoading(false)
      refetch()
    }else if (savedEventLoading){
      setSavedEventLoading(false)
      refetch()
    }
  }, [newEventLoading,savedEventLoading,refetch,setNewEventLoading,setSavedEventLoading]);

  const [dayFilter, setDayFilter] = useState<DayFilter>({
    Mon: true,
    Tue: true,
    Wed: true,
    Thu: true,
    Fri: true,
    Sat: true,
    Sun: true,
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.blurContainer}>
        <DayChipFilter dayFilter={dayFilter} setDayFilter={setDayFilter} />
      </View>
      <FlashList
        data={eventWeeks}
        renderItem={(data) => {
          if (!data || !data.item || data.item.eventWeek.length === 0) {
            return null;
          }

          return (
            <WeekScrollCard
              eventWeek={data.item.eventWeek}
              refetch={refetch}
              isFetching={isFetching}
              tabName={"index"}
              dayFilter={dayFilter}
            />
          );
        }}
        numColumns={1}
        estimatedItemSize={200 * 200}
        estimatedListSize={{ height: 1000, width: 700 }}
        refreshing={isFetching}
        extraData={[eventWeeks, isFetching, status]}
        keyExtractor={(item, index) =>
          item ? `${index}index${item.eventWeek.toString()}` : `${index}-null`
        }
        onRefresh={fetchNextPage}
        onEndReached={() => {
          if (hasNextPage && !isFetching) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.1}
        ListHeaderComponentStyle={styles.headerStyle}
        ListHeaderComponent={() => <View></View>}
        ListFooterComponent={() => (
          <>
            {isLoading ? (
              <ActivityIndicator
                style={styles.activityIndicator}
                size={"large"}
              />
            ) : (
              <></>
            )}
            <View style={styles.footerStyle}></View>
          </>
        )}
        ItemSeparatorComponent={({ trailingItem }) => {
          if (
            !trailingItem ||
            !trailingItem.eventWeek ||
            trailingItem.eventWeek.length === 0
          ) {
            return null;
          }
          const firstEventTime = new Date(trailingItem.eventWeek[0].begin_time);
          const weekBeginDate = dateIncrement(
            firstEventTime,
            dateMod(firstEventTime.getDay()),
          );
          const formatBeginDate = dayjs(weekBeginDate).format(
            "[Week beginning ]dddd DD MMMM",
          );
          return (
            <Surface style={styles.surfaceStyle} elevation={1}>
              <Text style={styles.textStyle}>{formatBeginDate}</Text>
            </Surface>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default CalendarFeed;

const styles = StyleSheet.create({
  blurContainer: {
    zIndex: 100,
  },
  textStyle: {
    marginLeft: 5,
    marginHorizontal: 2,
    fontSize: 12,
    marginBottom: 5,
  },
  surfaceStyle: {
    marginTop: 3,
    marginBottom: 0,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  headerStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    height: 50,
  },
  footerStyle: {
    marginTop: 3,
    marginBottom: 0,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    height: 50,
  },
  activityIndicator: {
    marginVertical: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  safe: {
    flex: 1,
  },
});
