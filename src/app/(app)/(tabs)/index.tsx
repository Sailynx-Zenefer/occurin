import { StyleSheet } from "react-native";
import CalendarFeed from "../../../components/CalendarFeed";
import "react-native-url-polyfill/auto";
const NewsFeed = () => {
  return (
      <CalendarFeed/>
  );
};

const styles = StyleSheet.create({
  CalendarFeed: {
    flexGrow:1
  },
});

export default NewsFeed;
