import { StyleSheet } from "react-native";
import { Database } from "../types/supabaseTypes";
import { Avatar, Card} from "react-native-paper";
import Voter from "./Voter";
import { Session } from "@supabase/supabase-js"; 

type EventType = Database["public"]["Tables"]["events"]["Row"];
interface EventCardProps {
  event: EventType;
  session: Session
}

function dateFormat (eventDate : string) : string {
  const dateToFormat = new Date(eventDate)
    return new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'Europe/London',
      hour12 : true
    }).format(dateToFormat)
} 

const EventCard = ({ event } : EventCardProps): React.JSX.Element => {

  const cardSubtitle = dateFormat(event.begin_time)
  
  return (     
    <Card style={styles.card}>
      <Card.Title 
      style={styles.cardTitle}
      title={event.title}
      subtitle={cardSubtitle}
      left={(props) => <Avatar.Image {...props}size={32} source={{uri : event.img_url}} />} 
      />
      <Card.Cover style={styles.cardCover} source={{uri:event.img_url}}/>
      <Card.Actions style={styles.cardActions}>
        <Voter toVoteOn={event} tableName="events"/>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    alignItems: "stretch",
    justifyContent: "flex-start",
  },
  cardTitle: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    // justifyContent: "center"
  },
  cardCover: {
    marginHorizontal: 0,
    marginVertical:10,
    borderWidth: 2,
    borderStyle:"solid",
    borderColor:"red",
  },
  cardActions: {
    display: "none",
    alignItems: "flex-start",
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
});

export default EventCard;
