import { router } from 'expo-router';
import {useState,useEffect} from 'react';
import { Text, View } from 'react-native';
import Auth from '../components/Auth'
import { Session } from '@supabase/supabase-js'
import { supabase } from "../lib/supabase";


export default function SignIn() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {session && session.user ?       <Text
        onPress={() => {
          router.replace('/');
        }}>
        Sign In
      </Text>: <Auth />}
          ;
    </View>
  );
}
