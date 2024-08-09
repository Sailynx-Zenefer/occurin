import { SafeAreaView, StyleSheet, View } from "react-native";
import React, { useCallback, useEffect } from "react";
import { FlashList } from "@shopify/flash-list";
import WeekScrollCard from "./WeekScrollCard";
import "react-native-url-polyfill/auto";
import useEventWeek from "@/hooks/useEventWeek";
import { Surface, Text } from "react-native-paper";
import dayjs from "dayjs";
import DayChipRibbon from "./DayChipRibbon";
import { useAuth } from "@/hooks/Auth";
import { useFocusEffect } from "expo-router";

const dateIncrement = (date: Date, days: number): Date => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
const dateMod = (n: number) => -((n - 1) % 8);

const SavedCalendar = () => {
  const { user } = useAuth();
  const {
    hasNextPage,
    eventWeeks,
    isFetching,
    fetchNextPage,
    refetch,
    status
  } = useEventWeek({ saved: true, tabName:"saved-calendar",}, user);

  useFocusEffect(
    useCallback(() => {
      refetch()
    }, [refetch])
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.blurContainer}>
        <DayChipRibbon />
      </View>

      {eventWeeks.length > 0 ? null : (
        <Text style={styles.nothingText}>{"You have no events saved..."}</Text>
      )}

      <FlashList
        data={eventWeeks}
        renderItem={({ item: eventWeek }) => (
          <WeekScrollCard eventWeek={eventWeek.eventWeek} refetch={refetch} isFetching={isFetching} tabName={"saved-calendar"} />
        )}
        numColumns={1}
        extraData={[eventWeeks,isFetching,status]}
        estimatedItemSize={200 * 200}
        estimatedListSize={{ height: 1000, width: 700 }}
        refreshing={isFetching}
        onRefresh={fetchNextPage}
        onEndReached={() =>
          hasNextPage ? !isFetching && fetchNextPage() : null
        }
        onEndReachedThreshold={0.1}
        keyExtractor={(item,index) => `${index}saved-calendar${item.eventWeek.toString()}`}
        ListHeaderComponentStyle={styles.headerStyle}
        ListHeaderComponent={() => <View></View>}
        ListFooterComponentStyle={styles.footerStyle}
        ListFooterComponent={() => (
          <View>
            {/* <Text>{isFetchingNextPage ? "Loading..." : null}</Text> */}
          </View>
        )}
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
    height: 50,
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
  safe: {
    flex: 1,
  },
});
