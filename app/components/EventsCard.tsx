import { View,StyleSheet } from "react-native"
import { Database} from "../../types/supabase";

type EventType = Database['public']['Tables']['events']['Row'];
interface EventCardProps {
    event: EventType;
  }

const EventCard: React.FC<EventCardProps> = ({event}) => {
    return (
        <View style={styles.event}>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <View style={styles.votes}>{event.votes}</View>
        </View>
    )
}

const styles = StyleSheet.create({
    event: {
        backgroundColor: 'lightgrey',
        borderStyle:'solid',
        borderColor:'grey',
        borderWidth: 5,
        padding: 5,
        paddingLeft:30
    },
    votes: {
        backgroundColor: 'blue',
    },
});

export default EventCard