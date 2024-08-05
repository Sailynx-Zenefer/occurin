import { router } from "expo-router";
import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { supabaseClient } from "../../config/supabase-client";
import { Session } from "@supabase/supabase-js";
import { useAlerts } from "react-native-paper-alerts";
import { makeRedirectUri } from 'expo-auth-session'
import * as QueryParams from 'expo-auth-session/build/QueryParams'
import * as WebBrowser from 'expo-web-browser'
import * as Linking from 'expo-linking'


WebBrowser.maybeCompleteAuthSession() // required for web only
const redirectTo = makeRedirectUri()

const createSessionFromUrl = async (url: string) => {
  const { params, errorCode } = QueryParams.getQueryParams(url)

  if (errorCode) throw new Error(errorCode)
  const { access_token, refresh_token } = params

  if (!access_token) return

  const { data, error } = await supabaseClient.auth.setSession({
    access_token,
    refresh_token,
  })
  if (error) throw error
  return data.session
}

const performOAuth = async () => {
  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    provider: 'google',
    options: {
      scopes: 'https://www.googleapis.com/auth/calendar',
      redirectTo,
      skipBrowserRedirect: true,
    },
  })
  if (error) throw error

  const res = await WebBrowser.openAuthSessionAsync(data?.url ?? '', redirectTo)

  if (res.type === 'success') {
    const { url } = res
    await createSessionFromUrl(url)
  }
}


export default function SignIn() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [session, setSession] = useState<Session | null>();
  const [loading, setLoading] = useState(false);

  const url = Linking.useURL()
  if (url) createSessionFromUrl(url)

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (session) {
      router.replace('/');
    }
  }, [session]);

  const alerts = useAlerts();

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) alerts.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabaseClient.auth.signUp({
      email: email,
      password: password,
    });

    if (error) alerts.alert(error.message);
    setLoading(false);
  }

  const Logout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
  };

  if (loading) return <Text>Loading</Text>;

  return (
    <View>
      {!session ? (
        <View style={styles.container}>
          <View style={[styles.verticallySpaced, styles.mt20]}>
            <TextInput
              label="Email"
              left={<TextInput.Icon icon="email" />}
              onChangeText={(text) => setEmail(text)}
              value={email}
              placeholder="email@address.com"
              autoCapitalize={"none"}
            />
          </View>
          <View style={styles.verticallySpaced}>
            <TextInput
              label="Password"
              left={<TextInput.Icon icon="lock" />}
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry={true}
              placeholder="Password"
              autoCapitalize={"none"}
            />
          </View>
          <View style={[styles.verticallySpaced, styles.mt20]}>
            <Button disabled={loading} onPress={() => signInWithEmail()}>
              <Text>Sign in</Text>
            </Button>
          </View>
          <View style={styles.verticallySpaced}>
            <Button disabled={loading} onPress={() => signUpWithEmail()}>
              <Text>Sign up</Text>
            </Button>
          </View>
          <Button onPress={performOAuth} >{"Sign in with Google"} </Button>
        </View>
      ) : (
        <>
          <Text>Welcome back {session.user.email}!</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
