import { useAuth } from "@/hooks/Auth";
import { voteFetch, voteUpsert } from "@/hooks/profileVote";
import { Database } from "@/types/supabaseTypes";
import { useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { IconButton, Surface, Text, useTheme } from "react-native-paper";
// import {}

type FullEventInfo = Database["public"]["Tables"]["events"]["Row"];
type EventInfo = Omit<FullEventInfo, "tickets_bought" | "capacity"> & {
  profiles: { username: string }
};
type PostType = Database["public"]["Tables"]["posts"]["Row"];
type CommentType = Database["public"]["Tables"]["comments"]["Row"];

type ToVoteOn =  EventInfo | PostType | CommentType ;
interface VoterProps {
  toVoteOn: ToVoteOn,
  setToVoteOn: React.Dispatch<React.SetStateAction<ToVoteOn>>
}

type ProfileVote = {
  profile_id: string;
  voted_upon: string;
  vote_up: boolean;
  vote_down: boolean;
};

// const Voter = ({ item }) => {

//   const lastItemId = useRef(item.someId);
//   const [liked, setLiked] = useState(item.liked);
//   if (item.someId !== lastItemId.current) {
//     lastItemId.current = item.someId;
//     setLiked(item.liked);
//   }

//   return (
//     <Button onPress={() => setLiked(true)}>
//       <Text>{liked}</Text>
//     </Button>
//   );
// };

const Voter = ({ toVoteOn,setToVoteOn}: VoterProps): React.JSX.Element => {
  const { user } = useAuth();
  const theme = useTheme();
  //resets state because of flashlist recycling
  const lastVotedOnId = useRef(toVoteOn.id);
  const [profileVote, setProfileVote] = useState<ProfileVote>({
    profile_id: user.id,
    voted_upon: toVoteOn.id,
    vote_up: false,
    vote_down: false,
  });

  const handleVoteButton = (voteButton: string) => {
    setProfileVote((prevState) => {
      const newState = { ...prevState };
      if (voteButton === "up") {
        newState.vote_up = !prevState.vote_up;
         if (prevState.vote_down === true) {
          newState.vote_down = false}
      } else {
        newState.vote_down = !prevState.vote_down;
        if (prevState.vote_up === true) {
          newState.vote_up = false}
      }
      return newState;
    });
    const upsertProfileVote = async () => {
      try {
        const { error, voteVal} = await voteUpsert(user, profileVote, toVoteOn);
        setToVoteOn((prevState)=>{
          const newState = {...prevState}
          newState.votes = voteVal
          return newState
        })
        if (error) {
          throw error;
        }
      } catch (error) {
        console.error("Error upserting profile vote:", error);
      }
    };
    upsertProfileVote();
  };

  useEffect(() => {
    const fetchProfileVote = async () => {
      try {
        const { error, profileVote } = await voteFetch(user, toVoteOn.id);
        if (profileVote.length > 0) {
          const vote = profileVote[0];
          setProfileVote({
            profile_id: vote.profile_id,
            voted_upon: vote.voted_upon,
            vote_up: vote.vote_up,
            vote_down: vote.vote_down,
          });
        }
        if (error) {
          throw error;
        }
      } catch (error) {
        console.error("Error fetching profile vote:", error);
      }
    };
    if (toVoteOn.id !== lastVotedOnId.current) {
      lastVotedOnId.current = toVoteOn.id;
      fetchProfileVote();
    }
    fetchProfileVote();
  }, [toVoteOn.id, user]);

  const upIcon = profileVote.vote_up
    ? "arrow-up-drop-circle"
    : "arrow-up-drop-circle-outline";
  const upColor = profileVote.vote_up
    ? theme?.colors.tertiary
    : theme?.colors.onTertiary;
  const downIcon = profileVote.vote_down
    ? "arrow-down-drop-circle"
    : "arrow-down-drop-circle-outline";
  const downColor = profileVote.vote_down
    ? theme?.colors.error
    : theme?.colors.onError;

  return (
    <Surface style={styles.surface}>
      <Text style={styles.text}>{"Interested?"}</Text>
      <IconButton
        style={styles.voteButton}
        icon={upIcon}
        iconColor={upColor}
        size={20}
        onPress={() => handleVoteButton("up")}
      />
      <Text style={styles.voteDisplay}>{`${toVoteOn.votes}`}</Text>
      <IconButton
        style={styles.voteButton}
        icon={downIcon}
        iconColor={downColor}
        size={20}
        onPress={() => handleVoteButton("down")}
      />
    </Surface>
  );
};

const styles = StyleSheet.create({
  text:{
    textAlign:"center",
    textAlignVertical:"center",
    padding:0,
    margin:0,
  },
  surface: {
    padding:0,
    margin:0,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    flexWrap: "wrap",
    borderRadius: 2,
  },
  voteDisplay: {
    textAlign: "center",
    padding:0,
    margin:0,

  },
  voteButton: {
    padding:0,
    margin:0,
  },
});

export default Voter;
