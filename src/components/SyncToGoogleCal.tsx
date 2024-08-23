import { EventInfo } from "@/types/types";
import { Linking, StyleSheet, useColorScheme, View } from "react-native";
import { Button, Chip, Surface, Text, useTheme } from "react-native-paper";
import { useAlerts } from "react-native-paper-alerts";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useAuth } from "@/hooks/Auth";
import { StoreAdapter } from "@/config/supabase-client";
import { useState } from "react";
import { AlertButton } from "react-native-paper-alerts/lib/typescript/type";
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

interface TimeCalendarType {
  dateTime?: string;
  timeZone: string;
}
type GoogleEvent = {
  summary: string;
  description: string;
  time: number;
  id: string;
  calendarId: string;
  start: TimeCalendarType;
  end: TimeCalendarType;
};

function makeid() {
  let text = "";
  const possible = "0123456789abcdefghijklmnopqrstuv"; //an ID must contain only these characters

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

interface SyncToGoogleCalProps {
  eventsToSync: EventInfo[];
}



const SyncToGoogleCal = ({ eventsToSync }: SyncToGoogleCalProps) => {
  const theme = useTheme();
  const alerts = useAlerts();
  const [eventLinks,setEventLinks] = useState<AlertButton[]>([])
  const createEvents = async () => {
    try {
      const processedEvents = await processEvents();
      const providerToken = await StoreAdapter.getItem("provider_token");
      if (processedEvents) {
        processedEvents.forEach(async (event) => {
          await fetch(
            "https://www.googleapis.com/calendar/v3/calendars/primary/events",
            {
              method: "POST",
              headers: {
                Authorization: "Bearer " + providerToken,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(event),
            },
          )
            .then((data) => {
              return data.json();
            })
            .then((data) => {
              if (data) {
                setEventLinks((prevLinks)=>{
                  const newLinks = [...prevLinks]
                  newLinks.push(
                    {text: data.summary,onPress:()=>{
                    Linking.openURL(data.htmlLink)
                  }})
                  return newLinks
                })
              }
              if (data.error) {
                throw data.error;
              }
            })
            .catch((error) => {
              console.error("Error syncing events:", error);
              if (error.code === 403) {
                alerts.alert(
                  `You don't have permissions to share to a google calendar. \n`,
                  `please ensure your email is on the list of allowed users`,
                );
              }
              alerts.alert("Error syncing events");
            });
        });
      }
    } catch (err) {
      console.error("Error syncing events:", err);
      alerts.alert("Error syncing events");
    } finally{
      if (eventLinks.length > 0){
        alerts.alert(
          `events created on google calendar`,
          `See your newly created events here:`,
          eventLinks,{cancelable:true})
        setEventLinks([])
      }
    }
  };

  const processEvents = async () => {
    try {
      const processedEvents = eventsToSync.map((event) => {
        const eventduration = dayjs(event.begin_time).diff(
          dayjs(event.finish_time),
          "minutes",
        );
        const processedEvent: GoogleEvent = {
          summary: event.title,
          time: eventduration,
          id: makeid(),
          description: event.description,
          calendarId: "primary",
          start: {
            dateTime: event.begin_time,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          end: {
            dateTime: event.finish_time,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        };
        return processedEvent;
      });
      if (processedEvents.length === 0) {
        throw new Error("No events detected");
      } else {
        return processedEvents;
      }
    } catch (err) {
      console.error("Error processing events:", err);
    }
  };

  return (
    <View style={styles.blurStyle}>
      <View
        style={[
          styles.syncBar,
          {
            backgroundColor: theme.colors.tertiaryContainer,
            paddingHorizontal: 5,
            paddingVertical: 3,
            borderRadius: 12,
          },
        ]}
      >
        <Text style={styles.textStyle}>
          {"Save events to Google Calendar : "}
        </Text>
        <Button
          style={{ borderRadius: 12 }}
          buttonColor={theme.colors.tertiary}
          onPress={createEvents}
        >
          <Text style={{ color: theme.colors.onTertiary }}>{"Save!"}</Text>
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    marginLeft: 10,
    fontSize: 16,
  },
  syncBar: {
    marginLeft: "auto",
    marginRight: 5,
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  blurStyle: {
    zIndex: 100,
    margin: 0,
    position: "absolute",
    left: 0,
    right: 0,
    paddingVertical: 3,
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
  },
});

export default SyncToGoogleCal;
