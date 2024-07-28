import { View, StyleSheet } from "react-native";
import { Database } from "../types/supabaseTypes";
import { Card, Text } from "react-native-paper";

type EventType = Database["public"]["Tables"]["events"]["Row"];
interface EventCardProps {
  event: EventType;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <Card>
      <Card.Title title={event.title} />
      <Card.Content>
        <Text variant="bodyMedium">{event.description}</Text>
      </Card.Content>
      <View style={styles.votes}>{event.votes}</View>
    </Card>
  );
};

const styles = StyleSheet.create({
  event: {},
  votes: {},
});

export default EventCard;
