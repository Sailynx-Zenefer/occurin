import { DayFilter, EventInfo } from "@/types/types";
import { BlurView } from "expo-blur";
import { useState } from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import { Button, Chip, Surface, Text, useTheme } from "react-native-paper";
import { useAlerts } from "react-native-paper-alerts";
interface SyncToGoogleCalProps {
  eventsToSync: EventInfo[];
}

const SyncToGoogleCal = ({ eventsToSync }: SyncToGoogleCalProps) => {
  const theme = useTheme();
  const alerts = useAlerts();
  return (
    <View style={styles.blurStyle}>
      <View style={[styles.syncBar,{backgroundColor: theme.colors.tertiaryContainer,
        paddingHorizontal:5,
        paddingVertical:3,
        borderRadius:12
      }]}>
        <Text style={styles.textStyle}>
          {"Sync saved events to Google Calendar : "}
        </Text>
        <Button
        style={{borderRadius:12}}
          buttonColor={theme.colors.tertiary}
          onPress={() => {
            alerts.alert(`events to sync:${eventsToSync.length > 0}`);
          }}
        >
          <Text style={{ color: theme.colors.onTertiary }}>{"Sync!"}</Text>
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
    justifyContent:"space-around"

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
