import { Link, router } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import React,{ useEffect, useState } from "react";

import { Database } from "../../../types/supabaseTypes";
import { supabaseClient } from "../../../config/supabase-client";

import EventCard from "../../../components/EventsCard";
import "react-native-url-polyfill/auto";
import { SafeAreaView } from "react-native-safe-area-context";

type EventState = Database["public"]["Tables"]["events"]["Row"][] | null;

const NewsFeed = () => {
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [events, setEvents] = useState<EventState>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabaseClient.from("events").select();

      if (error) {
        setFetchError("could not fetch event");
        setEvents(null);
        console.log(error);
      }
      if (data) {
        setEvents(data);
        setFetchError(null);
      }
    };
    fetchEvents();
  }, []);

  return (
    <SafeAreaView>
        <Text>Home Page</Text>
        {fetchError && <Text>{fetchError}</Text>}
        {events && (
          <View style={styles.events}>
            <View style={styles.eventsGrid}>
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </View>
          </View>
        )}
        <Link href="/users/1">
          <Text>Go to User 1</Text>
        </Link>
        <Button onPress={() => router.push("/users/2")}>
          <Text>Go to User 2</Text>
        </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  events: {
    // backgroundColor: "red",
  },
  eventsGrid: {
    // backgroundColor: "blue",
  },
});

export default NewsFeed;
