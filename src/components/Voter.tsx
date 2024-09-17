import { useAuth } from "@/utils/Auth";
import { fetchProfileVote, voteUpsert } from "@/utils/profileVote";

import { ToVoteOn } from "@/types/types";
import { useFocusEffect } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet,} from "react-native";
import { IconButton,Surface,Text,useTheme } from "react-native-paper";
import { useRefreshEvents } from "@/utils/RefreshEvents";
import { User } from "@supabase/supabase-js";
// import {}?
interface VoterProps {
  user: User;
  toVoteOn: ToVoteOn;
  setToVoteOn: React.Dispatch<React.SetStateAction<ToVoteOn>>;
  setEventVisible : React.Dispatch<React.SetStateAction<boolean>>;
  tabName: string
}

type ProfileVote = {
  user_id: string | null;
  voted_upon: string | null;
  save_event: boolean | null;
  hide_event: boolean | null;
};

const Voter = ({ user,toVoteOn, setToVoteOn, setEventVisible, tabName}: VoterProps): React.JSX.Element => {
  const {
    setSavedEventLoading,
  } = useRefreshEvents();
  const theme = useTheme();
  //resets state because of flashlist recycling
  const [profileVote, setProfileVote] = useState<ProfileVote>({
    user_id: null,
    voted_upon: null,
    save_event: null,
    hide_event: null,
  });
  const lastVotedOnId = useRef(toVoteOn.id);
  if (toVoteOn.id !== lastVotedOnId.current) {
    lastVotedOnId.current = toVoteOn.id;
    fetchProfileVote(user, toVoteOn, setProfileVote);
  }

  const handleVoteButton = (voteButton: string) => {
    const upsertProfileVote = async (
      oldProfileVote: ProfileVote,
      newProfileVote: ProfileVote,
    ) => {
      try {
        const { error, voteVal } = await voteUpsert(
          user,
          oldProfileVote,
          newProfileVote,
          toVoteOn,
        );
        if (error) {
          throw error;
        }

        setToVoteOn((prevState) => ({
          ...prevState,
          votes: voteVal,
        }));
      } catch (error) {
        console.error("Error upserting profile vote:", error);
      }
    };
    const oldState = { ...profileVote };
    const newState = { ...profileVote };
    if (voteButton === "save") {
      if (newState.save_event) {
        setEventVisible(false)
        newState.save_event = false;
      } else {
        setEventVisible(true)
        newState.save_event = true;
        newState.hide_event = false;
      }
    } else if (voteButton === "down") {
      if (newState.hide_event) {
        newState.hide_event = false;
      } else {
        newState.hide_event = true;
        newState.save_event = false;
      }
    }
    setProfileVote(newState);
    upsertProfileVote(oldState,newState);
    setSavedEventLoading(true)
  };

  useEffect(() => {
    if (user){fetchProfileVote(user, toVoteOn, setProfileVote);}
  }, [toVoteOn.id, user, toVoteOn]);

  // useFocusEffect(() => {
  //   fetchProfileVote(user, toVoteOn, setProfileVote);
  // });

  const saveIcon = profileVote.save_event
    ? "calendar-star"
    : "calendar-star";
  const saveColor = profileVote.save_event
    ? theme?.colors.primary
    : theme?.colors.inversePrimary;
  // const downIcon = profileVote.hide_event
  //   ? "arrow-down-drop-circle"
  //   : "arrow-down-drop-circle-outline";
  // const downColor = profileVote.hide_event
  //   ? theme?.colors.error
  //   : theme?.colors.onError;

  return (
    <Surface theme={theme} style={styles.textVoteSurface} elevation={5}>
    <Text style={{color:theme.colors.onPrimaryContainer,width:45,height:20,marginRight:-10}}>{profileVote.save_event ? "saved!" : "save?"}</Text>
    <IconButton
        style={styles.voteButton}
        icon={saveIcon}
        iconColor={saveColor}
        size={30}
        onPress={() => handleVoteButton("save")}
      />
  </Surface>

      // {/* <IconButton
      //   style={styles.voteButton}
      //   icon={downIcon}
      //   iconColor={downColor}
      //   size={20}
      //   onPress={() => handleVoteButton("down")}
      // /> */}
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: "center",
    textAlignVertical: "center",
    padding: "auto",
    margin: "auto",
  },
  surface: {
    marginLeft:10,
    padding:5,
    // minWidth:"100%",
    // padding: "auto",
    // margin: "auto",
    alignItems: "center",
    // justifyContent: "space-between",
    flexDirection: "row",
    // flexWrap: "wrap",
  },
  container: {
    minWidth:"100%",
    padding: "auto",
    margin: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  voteDisplay: {
    textAlign: "center",
    // padding: "auto",
    // margin: "auto",
    marginBottom:3,
  },
  textVoteSurface: {
    flexDirection:"row",
    alignItems: "center",
    margin:5,
    borderRadius:10,
    padding:"auto",
    paddingLeft:10,
    paddingRight:0
  },
  voteButton: {
    // padding: "auto",
    marginRight:-2
  },
});

export default Voter;
