import { View } from "react-native";
import Profile from "../../components/Profile";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import { useState, useEffect } from "react";
import Auth from "../../components/Auth";

const ProfilePage = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <View>
      {session && session.user ? <Profile key={session.user.id} session={session} /> : <Auth/>}
    </View>
  );
};

export default ProfilePage;
