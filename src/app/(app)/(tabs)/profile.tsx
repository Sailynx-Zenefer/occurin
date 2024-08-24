
import Profile from "../../../components/Profile";
import { useAuth } from "../../../utils/Auth";

// ...

const ProfileView = () => {
  const { session, user } = useAuth();

  if (!session || !user) {
    return null;
  }

  return (
      <Profile key={user.id} session={session} />
  );
};

export default ProfileView;
