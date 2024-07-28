import { View } from "react-native";
import Profile from "../../components/Profile";
import { useAuth} from "../../hooks/Auth";
import { router } from "expo-router";

const ProfilePage = () => {
  const {session,user} = useAuth()

  return (
    <View>
      {!session || !user ? (<>{router.replace('/sign-in')}</>) : (<Profile key={user.id} session={session} /> ) }
    </View>
  );
};

export default ProfilePage;
