import { SafeAreaView, StyleSheet, View } from "react-native";
import React, { useCallback, useEffect } from "react";
import { FlashList } from "@shopify/flash-list";
import WeekScrollCard from "./WeekScrollCard";
import "react-native-url-polyfill/auto";
import useEventWeek from "@/hooks/useEventWeek";
import { Button, Surface, Text } from "react-native-paper";
import dayjs from "dayjs";
import DayChipRibbon from "./DayChipRibbon";
import { useAuth } from "@/hooks/Auth";
import { useFocusEffect } from "expo-router";

const dateIncrement = (date: Date, days: number): Date => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
const dateMod = (n) => -((n - 1) % 8);



const CalendarFeed = () => {
  const { user } = useAuth();
  const {
    isFetching,
    hasNextPage,
    fetchNextPage,
    eventWeeks,
    refetch,
    status

  } = useEventWeek({ saved: false, tabName:"index"}, user);

  useFocusEffect(
    useCallback(() => {
      refetch()
    }, [refetch])
  );

  useEffect(()=>{
    if (status === "success"){

    }},[status]
  )

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.blurContainer}>
        <DayChipRibbon />
      </View>
      <FlashList
        data={eventWeeks}
        renderItem={({ item: eventWeek }) => (
          <WeekScrollCard refetch={refetch} eventWeek={eventWeek.eventWeek} isFetching={isFetching} tabName={"index"}/>
        )}
        numColumns={1}
        estimatedItemSize={200 * 200}
        estimatedListSize={ {height:1000, width:700} }
        refreshing={isFetching}
        extraData={[eventWeeks,isFetching,status]}
        keyExtractor={(item,index) => `${index}index${item.eventWeek.toString()}`}
        onRefresh={fetchNextPage}
        onEndReached={() => (hasNextPage ? !isFetching && fetchNextPage() : null)}
        onEndReachedThreshold={0.1}
        ListHeaderComponentStyle={styles.headerStyle}
        ListHeaderComponent={() => <View></View>}
        ListFooterComponentStyle={styles.footerStyle}
        ListFooterComponent={() => <View>

        </View>}
        ItemSeparatorComponent={({ trailingItem: { eventWeek } }) => {
          if (!eventWeek || eventWeek.length === 0) {
            return <></>;
          }
          const firstEventTime = new Date(eventWeek[0].begin_time);
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
  safe: {
    flex: 1,
  },
});
