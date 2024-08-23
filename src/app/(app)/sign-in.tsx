import { router } from "expo-router";
import { useState, useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import {
  Text,
  TextInput,
  Button,
  Icon,
  Surface,
  useTheme,
} from "react-native-paper";
import { StoreAdapter, supabaseClient } from "../../config/supabase-client";
import { AuthError, Session } from "@supabase/supabase-js";
import { useAlerts } from "react-native-paper-alerts";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { ScrollView } from "react-native";
import { AlertsMethods } from "react-native-paper-alerts/lib/typescript/type";

WebBrowser.maybeCompleteAuthSession(); // required for web only
const redirectTo = makeRedirectUri();

export const createSessionFromUrl = async (url: string,alerts: AlertsMethods ) => {
  
  try {
    const { params, errorCode,} = QueryParams.getQueryParams(url);

      if(params.error){
        alerts.alert('The address is already linked to a different user, please try another!')
        throw new AuthError(params.error_description,+params.error_code,params.error_status)
      }
    if (errorCode) throw new Error(errorCode);
    const { access_token, refresh_token, provider_token } = params || {};


    if (!access_token) {
      console.error('Access token is missing from the URL');
      return;
    }
    if (!provider_token) {
      console.error('Provider token is missing from the URL');
      return;
    }else{
      StoreAdapter.setItem('provider_token', provider_token)
    }

    const { data, error } = await supabaseClient.auth.setSession({
      access_token,
      refresh_token,
    });

    if (error) throw error;

    return data.session;
  } catch (err) {
    console.error('Error creating session from URL:', err);
  }
};

export const performOAuth = async (alerts: AlertsMethods) => {
  try {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        scopes: "https://www.googleapis.com/auth/calendar",
        skipBrowserRedirect: true,
        queryParams:{
          accessType:'offline',
           prompt: 'consent'
        }
      },
    });

    if (error) throw error;

    if (data?.url) {
      const res = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

      if (res.type === "success" && res.url) {
        await createSessionFromUrl(res.url,alerts);
      } else {
        console.error('OAuth session failed:', res);
      }
    } else {
      console.error('No URL returned for OAuth');
    }
  } catch (err) {
    console.error('Error during OAuth:', err);
  }
};

export default function SignIn() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [signUpEmail, setSignUpEmail] = useState<string>("");
  const [signUpPassword, setSignUpPassword] = useState<string>("");
  const [session, setSession] = useState<Session | null>();
  const [loading, setLoading] = useState(false);
  const [signUp, setSignUp] = useState(false);
  const theme = useTheme();
  const alerts = useAlerts();
  const url = Linking.useURL();
  
useEffect(() => {
  if (url) {
    createSessionFromUrl(url,alerts).catch(err =>
      console.error('Error in useURL effect:', err)
    );
  }
}, [url,alerts]);

useEffect(() => {
  supabaseClient.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      setSession(session);
    }
  }).catch(error => console.error('Error fetching session:', error));

  supabaseClient.auth.onAuthStateChange((_event, session) => {
    if (session) {
      setSession(session);
    }
  });
}, []);

  useEffect(() => {
    if (session) {
      router.replace("/");
    }
  }, [session]);

  async function signUpWithEmail() {
    setLoading(true);
    try {
      const { error } = await supabaseClient.auth.signUp({
        email: signUpEmail,
        password: signUpPassword,
      });
  
      if (error) {
        alerts.alert(error.message);
      }
    } catch (err) {
      console.error('Sign-up error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function signInWithEmail() {
    setLoading(true);
    try {
      const { error,data } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password,
      });
  
      if (error) {
        alerts.alert(error.message);
      }else{
      }
    } catch (err) {
      console.error('Sign-in error:', err);
    } finally {
      setLoading(false);
    }
  }

  const sendMagicLink = async (email: string) => {
    const { error } = await supabaseClient.auth.signInWithOtp({
      email: `${email}`,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) throw error;
    // Email sent.
  };

  const Logout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
  };

  if (loading) return <Text>Loading</Text>;

  return (
    <ScrollView>
      <Image
        style={styles.splash}
        source={require("../../assets/splash.png")}
      />
      {!session ? (
        <View style={styles.container}>
          {signUp ? (
            <Surface style={styles.formContainer}>
              <View style={styles.signInUpContainer}>
                <Text
                  style={[
                    styles.midText,
                    {
                      fontSize: 30,
                      fontWeight: "bold",
                      textAlign: "center",
                    },
                  ]}
                >
                  {"Sign Up"}
                </Text>
                <Button
                  style={styles.googleButton}
                  buttonColor={theme.colors.primary}
                  onPress={()=>performOAuth(alerts)}
                >
                  {
                    <View style={styles.buttonContainer}>
                      <Icon
                        color={theme.colors.onPrimary}
                        source={"google"}
                        size={30}
                      />
                      <Text
                        style={{
                          color: theme.colors.onPrimary,
                          marginLeft: 10,
                        }}
                      >
                        {"Continue with google"}
                      </Text>
                    </View>
                  }
                </Button>
                <Text style={styles.midText}>
                  {"...Or sign up using your preferred email address:"}
                </Text>
                <TextInput
                  label="Email"
                  style={styles.textInput}
                  mode="outlined"
                  left={
                    <TextInput.Icon icon="email" style={{ marginRight: 10 }} />
                  }
                  onChangeText={(text) => setSignUpEmail(text)}
                  value={signUpEmail}
                  placeholder="email@address.com"
                  autoCapitalize={"none"}
                />
                <TextInput
                  label="Password"
                  mode="outlined"
                  style={styles.textInput}
                  left={
                    <TextInput.Icon style={{ marginRight: 10 }} icon="lock" />
                  }
                  onChangeText={(text) => setSignUpPassword(text)}
                  value={signUpPassword}
                  secureTextEntry={true}
                  placeholder="Password"
                  autoCapitalize={"none"}
                />
                <View style={styles.buttonRow}>
                  <Button
                    style={styles.button}
                    buttonColor={theme.colors.tertiary}
                    textColor={theme.colors.onTertiary}
                    mode={"outlined"}
                    disabled={loading}
                    onPress={() => signUpWithEmail()}
                  >
                    {"Sign up"}
                  </Button>
                </View>
                <View style={styles.buttonRow}>
                  <Text style={{ marginLeft: "auto", marginVertical: "auto" }}>
                    {"Already have an account?"}
                  </Text>
                  <Button
                    style={styles.button2}
                    mode={"text"}
                    disabled={loading}
                    buttonColor={theme.colors.secondary}
                    textColor={theme.colors.onSecondary}
                    onPress={() => {
                      setSignUp(false);
                    }}
                  >
                    {"Sign In"}
                  </Button>
                </View>
              </View>
            </Surface>
          ) : (
            <Surface style={styles.formContainer}>
              <View style={styles.signInUpContainer}>
              <Text
                style={[
                  styles.midText,
                  {
                    fontSize: 30,
                    fontWeight: "bold",
                    textAlign: "center",
                  },
                ]}
              >
                {"Sign In"}
              </Text>
              <Button
                style={styles.googleButton}
                buttonColor={theme.colors.primary}
                onPress={()=>performOAuth(alerts)}
              >
                {
                  <View style={styles.buttonContainer}>
                    <Icon
                      color={theme.colors.onPrimary}
                      source={"google"}
                      size={30}
                    />
                    <Text
                      style={{
                        color: theme.colors.onPrimary,
                        marginLeft: 10,
                      }}
                    >
                      {"Continue with google"}
                    </Text>
                  </View>
                }{" "}
              </Button>
                <Text style={styles.midText}>
                  {"...Or enter your email address and password:"}
                </Text>
                <TextInput
                  mode="outlined"
                  label="Email"
                  style={styles.textInput}
                  left={
                    <TextInput.Icon style={{ marginRight: 10 }} icon="email" />
                  }
                  onChangeText={(text) => setEmail(text)}
                  value={email}
                  placeholder="email@address.com"
                  autoCapitalize={"none"}
                />

                <TextInput
                  label="Password"
                  mode="outlined"
                  style={styles.textInput}
                  left={
                    <TextInput.Icon style={{ marginRight: 10 }} icon="lock" />
                  }
                  onChangeText={(text) => setPassword(text)}
                  value={password}
                  secureTextEntry={true}
                  placeholder="Password"
                  autoCapitalize={"none"}
                />
                <View style={styles.buttonRow}>
                  <Button
                    style={styles.button}
                    mode={"outlined"}
                    disabled={loading}
                    buttonColor={theme.colors.tertiary}
                    textColor={theme.colors.onTertiary}
                    onPress={() => signInWithEmail()}
                  >
                    {"Sign in"}
                  </Button>
                </View>
                <View style={styles.buttonRow}>
                  <Text style={{ marginLeft: "auto", marginVertical: "auto" }}>
                    {"Don't have an account?"}
                  </Text>
                  <Button
                    style={styles.button2}
                    mode={"text"}
                    disabled={loading}
                    buttonColor={theme.colors.secondary}
                    textColor={theme.colors.onSecondary}
                    onPress={() => {
                      setSignUp(true);
                    }}
                  >
                    {"Sign up"}
                  </Button>
                </View>
              </View>
            </Surface>
          )}
        </View>
      ) : (
        <>
          <Text>Welcome back {session.user.email}!</Text>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    marginHorizontal: 20,
    marginVertical: 5,
    width: "100%",
    maxWidth: 500,
  },
  buttonRow: {
    flexDirection: "row",
    textAlign: "center",
    justifyContent: "center",
  },
  midText: {
    marginHorizontal: "auto",
    marginVertical: 5,
  },
  button: {
    margin: "auto",
    // maxWidth: 400,
    width: "62.8%",
    marginVertical: 5,
  },
  button2: {
    marginRight: "auto",
    marginLeft: 20,
    maxWidth: "38.2%",
    marginVertical: 5,
  },
  buttonText: {
    marginHorizontal: 10,
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  googleButton: {
    marginHorizontal: "auto",
    marginVertical: 5,
    width: "62.8%",
  },
  container: {
    marginTop: 0,
    padding: 0,
  },
  signInUpContainer: {
    marginHorizontal: "auto",
    marginVertical: 40,
    width: "100%",
    maxWidth: 500,
  },
  formContainer: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingHorizontal: 0,
    margin: "auto",
    width: "100%",
    maxWidth: 1000,
  },
  splash: {
    marginVertical: 0,
    marginHorizontal: "auto",
    width: 382,
    height: 236,
  },
});

{
  /* <Button
style={styles.button2}
onPress={() => {
  sendMagicLink(signUpEmail);
}}
>
<Text>
  {`Don't remember your password?
Click here to send a sign-in link`}
</Text>
</Button> */
}
