import { Pressable, StyleSheet, View } from "react-native";
import {
  Avatar,
  Card,
  Chip,
  IconButton,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import Voter from "./Voter";
import { Session } from "@supabase/supabase-js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {  useEffect, useState } from "react";
import { router,} from "expo-router";

import { EventInfo, RefetchType } from "../types/types";
import { downloadImage } from "@/utils/imageUtils";

interface EventCardProps {
  event: EventInfo;
  session: Session;
  setEventVisible:React.Dispatch<React.SetStateAction<boolean>>
  tabName : string
}

// const onSelect = (item: EventInfo)=>{
//   router.replace('/event-screen');
// }

const EventCardModal = ({ event, setEventVisible, tabName}: EventCardProps): React.JSX.Element => {
  dayjs.extend(relativeTime);
  const [eventState, setEventState] = useState<EventInfo>(event);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [eventImageUrl, setEventImageUrl] = useState<string | null>(null);
  const timeAndUserInfo = `Posted ${dayjs().to(dayjs(event.created_at))} by ${eventState.profiles.username}`;
  const theme = useTheme();
  const dynmStyles = StyleSheet.create({
    day: {
      display: "flex",
      flexDirection: "column",
      flexWrap: "wrap",
      alignItems: "stretch",
      justifyContent: "flex-start",
      marginHorizontal: 5,
      backgroundColor: dayColors[dayjs(event.begin_time).format("ddd")],
    },
    textOver: {
      color: theme.colors.onTertiary,
      position: "absolute",
      top: 21,
      bottom: 0,
      left: 28,
      right: 0,
      zIndex: 100,
    },
    infoContainer: {
      color: theme.colors.onPrimaryContainer,
      fontSize: 12,
      margin:5,
      marginRight:-5,
    },
  });


  useEffect(() => {
    if (eventState.profiles.avatar_url)
      downloadImage(eventState.profiles.avatar_url, setAvatarUrl, "avatars",);
  }, [eventState.profiles]);

  useEffect(() => {
    if (eventState.img_url)
      downloadImage(eventState.img_url, setEventImageUrl, "event_imgs",);
  }, [eventState.img_url]);

  return (
      <Card style={styles.card} elevation={3}>
        <View style={styles.cardTitleBodyAvatar}>
          <View style={styles.container}>
            <Text style={dynmStyles.textOver}>{`${event.votes !== null? event.votes : 0}`}</Text>
            <IconButton
              style={styles.starOver}
              icon={"star"}
              iconColor={theme?.colors.tertiary}
              size={44}
            />
          </View>

          <View style={styles.cardTitleBody}>
            <Text> </Text>
          </View>
        </View>
        <Card.Title
        title={event.title}
        titleStyle={styles.cardTitle}
        />
          <Card.Cover
            style={styles.cardCover}
            source={{ uri: eventImageUrl }}
          />

        <Card.Content style={styles.cardContent}>
          <Text>
            {`${event.description}

Takes place at : ${event.location_name}
${dayjs(event.begin_time).format('[Begins on ]dddd DD MMMM[ at ]hh:mm ')}
${dayjs(event.finish_time).format('[Ends on ]dddd DD MMMM[ at ]hh:mm ')}
Tickets cost : £${event.ticket_price}

`}

          </Text>
        </Card.Content>
        <Avatar.Image
            style={styles.avatar}
            size={35}
            source={{ uri: avatarUrl }}
          />
        <Text style={styles.cardTitle2}> {timeAndUserInfo}</Text>
        <Card.Actions style={styles.cardActions}>
          
            <Voter toVoteOn={eventState} setToVoteOn={setEventState} setEventVisible={setEventVisible} tabName={tabName}/>
            
        </Card.Actions>
      </Card>
  );
};

const dayColors = {
  Mon: "red",
  Tue: "orange",
  Wed: "yellow",
  Thu: "green",
  Fri: "blue",
  Sat: "indigo",
  Sun: "violet",
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    width: 50,
    height: 50,
  },
  starOver: {
    position: "absolute",
    top: -5,
    bottom: 0,
    left: -3,
    right: 0,
  },
  card: {
    padding:5,
    margin:0,
    width:550,
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitleBody: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 5,
  },
  cardTitleBodyAvatar: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingTop: 5,
    paddingRight: 5,
  },
  cardTitle: {
    display: "flex",
    fontWeight: "bold",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    textAlign: "justify",
    textAlignVertical: "bottom",
  },
  cardTitle2: {
    // display: "flex",
    // flexDirection: "row",
    // alignItems: "center",
    // justifyContent: "flex-start",
    fontSize: 10,
  },
  text: {
    fontSize: 13,
    marginBottom: 3,
    borderWidth: 3,
    borderStyle: "solid",
  },
  avatar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
    marginRight: "auto",
    padding: 0,
  },
  cardCover: {
    objectFit:"contain",
    width:500,
    height:300,
    // alignItems:"stretch",
    justifyContent:"center",
    marginTop:0,
    marginVertical: 5,
    resizeMode:"contain",
    padding:0,
    borderWidth:5

  },
  cardContent: {
    padding: 0,
    margin: 0,
    // borderWidth: 3,
    // borderStyle: "solid",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",

  },
  cardActions: {
    padding: 0,
    margin: 0,
    // borderWidth: 3,
    // borderStyle: "solid",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
});

export default EventCardModal;
