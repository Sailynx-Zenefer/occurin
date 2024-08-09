import { StyleSheet } from "react-native";
import CalendarFeed from "../../../components/CalendarFeed";
import "react-native-url-polyfill/auto";
const CalendarFeedView
 = () => {
  return (
      <CalendarFeed/>
  );
};

const styles = StyleSheet.create({
  CalendarFeed: {
    flexGrow:1
  },
});

export default CalendarFeedView
;
