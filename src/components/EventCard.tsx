import { Pressable, StyleSheet, View } from "react-native";
import {
  Avatar,
  Card,
  Chip,
  IconButton,
  Modal,
  Portal,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";

import { Colors } from "../constants/colors";

import Voter from "./Voter";
import { Session } from "@supabase/supabase-js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";

import { DayFilter, EventInfo, RefetchType } from "../types/types";
import { downloadImage } from "@/utils/imageUtils";
import EventCardModal from "./EventCardModal";

interface EventCardProps {
  event: EventInfo;
  session: Session;
  refetch: RefetchType;
  dayFilter : DayFilter,
  loading : boolean,
  setLoading : React.Dispatch<React.SetStateAction<boolean>>
  tabName : string
  setEventsToSync? : React.Dispatch<React.SetStateAction<EventInfo[]>>
}

const EventCard = ({
  event,
  session,
  dayFilter,
  loading,
setLoading,
tabName,
setEventsToSync
}: EventCardProps): React.JSX.Element => {
  dayjs.extend(relativeTime);
  const [eventState, setEventState] = useState<EventInfo>(event);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [eventImageUrl, setEventImageUrl] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [eventVisible, setEventVisible] = useState(true);
  const [eventVisibleFilter, setEventVisibleFilter] = useState(true);
  const dayShort = dayjs(event.begin_time).format("ddd")

  const timeAndUserInfo = `Posted ${dayjs().to(dayjs(event.created_at))} by ${eventState.profiles.username}`;
  const eventDay = dayjs(event.begin_time).format("dddd D MMMM");
  const theme = useTheme();
  const dayColors = {
    Mon: Colors.dark.red,
    Tue: Colors.dark.orange,
    Wed: Colors.dark.yellow,
    Thu: Colors.dark.green,
    Fri: Colors.dark.blue,
    Sat: Colors.dark.indigo,
    Sun: Colors.dark.violet,
  };
  const dynmStyles = StyleSheet.create({
    day: {
      display: "flex",
      flexDirection: "column",
      flexWrap: "wrap",
      alignItems: "stretch",
      justifyContent: "flex-start",
      marginHorizontal: 5,
      backgroundColor: dayColors[dayShort],
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
      margin: 5,
      marginRight: -5,
    },
  });

  useEffect(()=>{
    if(tabName === "saved-calendar"){
    setEventsToSync((prevToSync)=>{
      const newToSync = [...prevToSync]
      if (!prevToSync.find((eventItem)=>(eventItem.id === event.id))){
        newToSync.push(event)
        return newToSync
      }else return prevToSync
    })}
  },[setEventsToSync,event,tabName])

  useEffect(() => {
    if (eventState.profiles.avatar_url)
      downloadImage(eventState.profiles.avatar_url, setAvatarUrl, "avatars");
  }, [eventState.profiles]);

  useEffect(() => {
    if (eventState.img_url)
      downloadImage(eventState.img_url, setEventImageUrl, "event_imgs");
  }, [eventState.img_url]);

  useEffect(()=>{
    if (dayFilter[dayShort])
      {setEventVisibleFilter(true)
    }else{
      setEventVisibleFilter(false)
    }

  },[dayFilter,dayShort])

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  return (
    <>
      {eventVisibleFilter && eventVisible && (
        <>
          <Surface elevation={1}>
            <Chip style={dynmStyles.day}>
              <Text style={{ color: theme.colors.onPrimary }}>{eventDay}</Text>
            </Chip>
          </Surface>
          <Card style={styles.card} elevation={3}>
            <View style={styles.cardTitleBodyAvatar}>
              <View style={styles.container}>
                <Text style={dynmStyles.textOver}>{`${event.votes}`}</Text>
                <IconButton
                  style={styles.starOver}
                  icon={"star"}
                  iconColor={theme?.colors.tertiary}
                  size={44}
                />
              </View>

              <View style={styles.cardTitleBody}>
                <Text style={styles.cardTitle}>{event.title}</Text>
              </View>
            </View>
            <Pressable
              onPress={() => {
                showModal();
              }}
            >
              <Card.Cover
                style={styles.cardCover}
                source={{ uri: eventImageUrl }}
              />
            </Pressable>
            <Text style={styles.cardTitle2}> {timeAndUserInfo}</Text>
            <Card.Actions style={styles.cardActions}>
              <Avatar.Image
                style={styles.avatar}
                size={35}
                source={{ uri: avatarUrl }}
              />
              <Voter toVoteOn={eventState} setToVoteOn={setEventState} setEventVisible={setEventVisible} tabName={tabName}/>
            </Card.Actions>
          </Card>
          <Portal>
            <Modal
              visible={modalVisible}
              onDismiss={hideModal}
              contentContainerStyle={styles.containerStyle}
            >
              <EventCardModal event={event} session={session} setEventVisible={setEventVisible} tabName={tabName}/>
            </Modal>
          </Portal>
        </>
      )}
    </>
  );
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
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
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
  containerStyle: {
    backgroundColor: "transparent",
    padding: 0,
    margin: "auto",
  },
  cardCover: {
    objectFit: "contain",
    width: "100%",
    alignItems: "stretch",
    marginRight: 250,
    marginVertical: 5,
    resizeMode: "contain",
    padding: 0,
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

export default EventCard;
