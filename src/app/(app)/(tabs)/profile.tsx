import { View } from "react-native";
import Profile from "../../../components/Profile";
import { useAuth } from "../../../hooks/Auth";

const ProfilePage = () => {
  const { session, user } = useAuth();

  if (!session || !user) {
    return null;
  }

  return (
    <View>
      <Profile key={user.id} session={session} />
    </View>
  );
};

export default ProfilePage;
