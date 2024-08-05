import { Pressable, StyleSheet } from "react-native";
import { Database } from "../types/supabaseTypes";
import { Avatar, Card, Text } from "react-native-paper";
import Voter from "./Voter";
import { Session } from "@supabase/supabase-js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
import { router } from "expo-router";

type FullEventInfo = Database["public"]["Tables"]["events"]["Row"];
type EventInfo = Omit<FullEventInfo, 'tickets_bought' | 'capacity'> & { profiles: {username: string} };

interface EventCardProps {
  event: EventInfo;
  session: Session;
}

function dateFormat(eventDate: string): string {
  const dateToFormat = new Date(eventDate);
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/London",
    hour12: true,
  }).format(dateToFormat);
}

// const onSelect = (item: EventInfo)=>{
//   router.replace('/event-screen');
// }

const EventCard = ({ event }: EventCardProps): React.JSX.Element => {
  dayjs.extend(relativeTime);
  const timeAndUserInfo = `Posted ${dayjs().to(dayjs(event.created_at))} by ${event.profiles.username}`
  const [eventState, setEventState] = useState<EventInfo>(event)
  const cardSubtitle = dateFormat(event.begin_time);

  return (
    <Card style={styles.card}>
      <Text
        style={styles.cardTitle2}
      > {timeAndUserInfo}</Text>
      <Card.Title
        style={styles.cardTitle}
        title={event.title}
        subtitle={cardSubtitle}
        left={(props) => (
          <Avatar.Image {...props} size={32} source={{ uri: event.img_url }} />
        )}
      />
      <Pressable onPress={()=>{router.push('/event-card-full')}}>
      <Card.Cover style={styles.cardCover} source={{ uri: event.img_url }} />
      </Pressable>
      <Card.Actions style={styles.cardActions}>
        <Voter toVoteOn={eventState} setToVoteOn={setEventState}/>
      </Card.Actions>
    </Card>
  );
};

{/* <Button
uppercase={false}
mode="outlined"

>
Go Back
</Button></Surface> */}

const styles = StyleSheet.create({
  card: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    alignItems: "stretch",
    justifyContent: "flex-start",
    marginHorizontal:5

  },
  cardTitle: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent:"center",
    alignItems: "center",
    padding:0,
    margin:0,
    textAlign:"center",
    textAlignVertical:"center"
    // justifyContent: "center"
  },
  cardTitle2: {
    display:"flex",
    padding:0,
    margin:0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"flex-start",
  },
  cardCover: {
    marginHorizontal: 0,
    marginVertical: 10,

  },
  cardActions: {
    alignItems: "flex-start",
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
});

export default EventCard;
