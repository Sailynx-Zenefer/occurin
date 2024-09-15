import { SafeAreaView, StyleSheet, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import WeekScrollCard from "./WeekScrollCard";
import "react-native-url-polyfill/auto";
import useEventWeek from "@/utils/useEventWeek";
import { ActivityIndicator, Surface, Text } from "react-native-paper";
import dayjs from "dayjs";
import DayChipFilter from "./DayChipFilter";
import { useAuth } from "@/utils/Auth";
import { useFocusEffect } from "expo-router";
import { DayFilter, EventInfo } from "@/types/types";
import SyncToGoogleCal from "./SyncToGoogleCal";
import { useRefreshEvents } from "@/utils/RefreshEvents";

const dateIncrement = (date: Date, days: number): Date => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
const dateMod = (n: number) => -((n - 1) % 8);

const SavedCalendar = () => {
  const {
    newEventLoading,
    setNewEventLoading,
    savedEventLoading,
    setSavedEventLoading,
  } = useRefreshEvents();
  const { user } = useAuth();
  const {
    hasNextPage,
    eventWeeks,
    isFetching,
    fetchNextPage,
    isLoading,
    refetch,
    status
  } = useEventWeek({ saved: true, tabName:"saved-calendar",}, user);

  const [eventsToSync,setEventsToSync] = useState<EventInfo[]>([])

  useEffect(() => {
    if (newEventLoading) {
      setNewEventLoading(false)
      refetch()
    }else if (savedEventLoading){
      setSavedEventLoading(false)
      refetch()
    }
  }, [newEventLoading,savedEventLoading,refetch,setNewEventLoading,setSavedEventLoading]);

  const [dayFilter,setDayFilter]= useState<DayFilter>({
    Mon: true,
    Tue: true,
    Wed: true,
    Thu: true,
    Fri: true,
    Sat: true,
    Sun: true,
  })

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.blurContainer}>
        <DayChipFilter dayFilter={dayFilter} setDayFilter={setDayFilter}/>
      </View>
      <View style={[styles.blurContainer,{marginTop:40}]}>
        <SyncToGoogleCal eventsToSync={eventsToSync}/>
      </View>
      {eventWeeks.length > 0 ? null : (
        <Text style={styles.nothingText}>{"You have no events saved..."}</Text>
      )}

      <FlashList
        data={eventWeeks}
        renderItem={(data) => {
          if (!data || !data.item || data.item.eventWeek.length === 0) {
            return null; 
          }
          return(
          <WeekScrollCard setEventsToSync={setEventsToSync}
          eventWeek={data.item.eventWeek} 
          refetch={refetch} isFetching={isFetching} 
          tabName={"saved-calendar"}
          dayFilter={dayFilter} />)
        }}
        numColumns={1}
        extraData={[eventWeeks,isFetching,status,eventsToSync]}
        estimatedItemSize={200 * 200}
        estimatedListSize={{ height: 1000, width: 700 }}
        refreshing={isFetching}
        onRefresh={fetchNextPage}
        onEndReached={() =>
          hasNextPage ? !isFetching && fetchNextPage() : null
        }
        onEndReachedThreshold={0.1}
        keyExtractor={
          (item,index) => item ? `${index}saved-calendar${item.eventWeek.toString()}` : `${index}-null2`}
        ListHeaderComponentStyle={styles.headerStyle}
        ListHeaderComponent={() => <View></View>}
        ListFooterComponent={() => 
          <>
          {isLoading ? <ActivityIndicator size={"large"} style={styles.activityIndicator}/> : <></>}
        <View style={styles.footerStyle}>
        </View>
        </>}
        ItemSeparatorComponent={({trailingItem }) => {
          if (!trailingItem || !trailingItem.eventWeek || trailingItem.eventWeek.length === 0) {
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

export default SavedCalendar;

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
    height: 54,
  },
  nothingText: {
    display: "flex",
    height: "50%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  footerStyle: {
    flexWrap: "wrap",
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
