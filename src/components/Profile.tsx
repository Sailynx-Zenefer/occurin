import { useState, useEffect } from "react";
import { StoreAdapter, supabaseClient } from "../config/supabase-client";
import { StyleSheet, View, Alert } from "react-native";
import {
  Badge,
  Button,
  Chip,
  Icon,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { Session, UserIdentity } from "@supabase/supabase-js";
import AvatarUploader from "./AvatarUploader";
import { ScrollView } from "react-native";
import { useAlerts } from "react-native-paper-alerts";
import { AuthError, makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import { createSessionFromUrl } from "@/app/(app)/sign-in";

WebBrowser.maybeCompleteAuthSession();

const redirectTo = makeRedirectUri();


type ProfileUpdates = {
  username: string;
  website: string;
  avatar_url: string;
  full_name: string;
  profile_role: string;
};

type GoogleTokenCheck = {
  issued_to: string
  audience: string
  user_id: string
  scope: string
  expires_in: number
  email: string
  verified_email: boolean
  access_type: string
}

export default function Profile({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [profileRole, setProfileRole] = useState("");
  const [googleEmail, setGoogleEmail] = useState("No Google Email");
  const [hasGoogle, setHasGoogle] = useState(false);
  const [hasProviderToken, setHasProviderToken] = useState(false);
  const [hasCalendarScope, setHasCalendarScope] = useState(false);
  const [allowEdit, setAllowEdit] = useState(false);
  const alerts = useAlerts();
  const theme = useTheme();

  const hasGoogleColor = hasGoogle && hasProviderToken && hasCalendarScope ? theme.colors.primary : theme.colors.error;
  const hasGoogleColorText = hasGoogle && hasProviderToken && hasCalendarScope
    ? theme.colors.onPrimary
    : theme.colors.onError;

  useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true);
        if (!session?.user) throw new Error("No user on the session!");

        let { data, error, status } = await supabaseClient
          .from("profiles")
          .select(
            `created_at, updated_at, username, full_name, avatar_url, website, profile_role`,
          )
          .eq("id", session?.user.id)
          .single();
        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setUsername(data?.username || "");
          setWebsite(data?.website || "");
          setAvatarUrl(data?.avatar_url || "");
          setFullName(data?.full_name || "");
          setProfileRole(data?.profile_role || "");
        }
      } catch (error) {
        if (error instanceof Error) {
          Alert.alert("Error:", error.message);
        }
      } finally {
        setLoading(false);
      }
    }

    if (session) getProfile();
  }, [session]);

  useEffect(() => {
    async function getGoogleAuthDetails() {
      try {
        setLoading(true);
        if (!session?.user) throw new Error("No user on the session!");

        const { data, error } = await supabaseClient.auth.getUserIdentities();

        if (error) {
          throw error;
        }

        if (data) {
          if (
            data.identities.find((identity) => identity.provider === "google")
          ) {
            setHasGoogle(true);
            if((await StoreAdapter.getItem('provider_token')).length > 0){
              await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${await StoreAdapter.getItem('provider_token')}`, {
                method: "POST"
              }).then((data)=>{
                return data.json()
              }).then((data : GoogleTokenCheck)=>{
                if(data.scope.split(' ').find((scope)=>scope === "https://www.googleapis.com/auth/calendar")){
                  setHasCalendarScope(true)
                }else{setHasCalendarScope(false)}
              })
              
             setHasProviderToken(true)
            }else(
              setHasProviderToken(false)
            )
            setGoogleEmail(
              data.identities.find((identity) => identity.provider === "google")
                .identity_data["email"],
            );
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          Alert.alert("Error:", error.message);
        }
      } finally {
        setLoading(false);
      }
    }
    if (session) getGoogleAuthDetails();
  }, [session]);

//keeping this code incase partial authentication can be implemented.

  // const upgradeGooglePermissions = async () => {
  //   try {
  //     const { data, error } = await supabaseClient.auth.signInWithOAuth({
  //       provider: "google",
  //       options: {
  //         scopes: "https://www.googleapis.com/auth/calendar",
  //         redirectTo,
  //         skipBrowserRedirect: true,
  //         queryParams:{
  //         }
  //       },
  //     });

  //     if (error) throw error;

  //     if (data?.url) {
  //       const res = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  //       if (res.type === "success" && res.url) {
  //         await createSessionFromUrl(res.url);
  //         alerts.alert("Google account authorized for calendar access!");
  //       } else {
  //         console.error("OAuth session failed:", res);
  //       }
  //     } else {
  //       console.error("No URL returned for OAuth");
  //     }
  //   } catch (err) {
  //     console.error("Error during OAuth:", err);
  //   }
  // };

  const linkGoogleAccount = async () => {
    try {
      const { data, error } = await supabaseClient.auth.linkIdentity({
        provider: "google",
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;

      if (data?.url) {
        const res = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

        if (res.type === "success" && res.url) {
          await createSessionFromUrl(res.url,alerts);
        } else {
          console.error("OAuth session failed:", res);
        }
      } else {
        console.error("No URL returned for OAuth");
      }
    } catch (err) {
      console.error("Error during OAuth:", err);
    }
  };

  async function handleSignOut(){
    await StoreAdapter.removeItem('provider_token')
    supabaseClient.auth.signOut()
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
    full_name,
    profile_role,
  }: ProfileUpdates) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        full_name,
        profile_role,
        updated_at: new Date().toISOString(),
      };

      let { error } = await supabaseClient.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        alerts.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topPage}>
        <AvatarUploader
          size={200}
          url={avatarUrl}
          onUpload={(url: string) => {
            setAvatarUrl(url);
            updateProfile({
              username,
              website,
              full_name: fullName,
              profile_role: profileRole,
              avatar_url: avatarUrl,
            });
          }}
        />

        <Surface style={styles.changeDetails}>
          <Text style={styles.title}>{"Profile Details"}</Text>

          {googleEmail === session?.user?.email ? (
            <></>
          ) : (
            <View style={[styles.verticallySpaced, styles.mt20]}>
              <TextInput label="Email" value={session?.user?.email} disabled />
            </View>
          )}

          <View style={[styles.verticallySpaced, styles.mt20]}>
            <TextInput label="Google Email" value={googleEmail} disabled />
          </View>
          <Badge
            style={{
              backgroundColor: hasGoogleColor,
              color: hasGoogleColorText,
            }}
          >
            {hasGoogle && hasProviderToken && hasCalendarScope
              ? "Can sync events to google calendar"
              : "Cannot sync events to google calendar"}
          </Badge>
          <Button
            mode={"outlined"}
            style={styles.button2}
            buttonColor={theme.colors.secondary}
            textColor={theme.colors.onSecondary}
            onPress={() => linkGoogleAccount()}
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
                  {"Link google account"}
                </Text>
              </View>
            }
          </Button>
          {/* <Button
            mode={"outlined"}
            style={styles.button2}
            buttonColor={theme.colors.secondary}
            textColor={theme.colors.onSecondary}
            onPress={upgradeGooglePermissions}
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
                  {"Authorize Google to create calendars"}
                </Text>
              </View>
            }
          </Button> */}
          <View style={styles.verticallySpaced}>
            <TextInput
              disabled={allowEdit}
              label="Username"
              value={username || ""}
              onChangeText={(text) => setUsername(text)}
            />
          </View>
          <View style={styles.verticallySpaced}>
            <TextInput
            disabled={allowEdit}
              label="Website"
              value={website || ""}
              onChangeText={(text) => setWebsite(text)}
            />
          </View>
          <View style={styles.verticallySpaced}>
            <TextInput
            disabled={allowEdit}
              label="Full Name"
              value={fullName || ""}
              onChangeText={(text) => setFullName(text)}
            />
          </View>
          <View style={[styles.buttonRow]}>
            <Button
              mode={"outlined"}
              style={styles.button1}
              buttonColor={theme.colors.tertiary}
              textColor={theme.colors.onTertiary}
              onPress={() => {setAllowEdit(!allowEdit)}}
              disabled={loading}
            >
              {loading ? "Editing ..." : "Edit"}
            </Button>
            <Button
              mode={"outlined"}
              style={styles.button1}
              buttonColor={theme.colors.secondary}
              textColor={theme.colors.onSecondary}
              onPress={() =>
                updateProfile({
                  username,
                  website,
                  full_name: fullName,
                  profile_role: profileRole,
                  avatar_url: avatarUrl,
                })
              }
              disabled={loading}
            >
              {loading ? "Loading ..." : "Update"}
            </Button>
          </View>
        </Surface>
      </View>
      <View style={[styles.buttonRow]}>
        <Button
          mode={"outlined"}
          style={styles.button2}
          buttonColor={theme.colors.secondary}
          textColor={theme.colors.onSecondary}
          onPress={handleSignOut}
        >
          {"Sign Out"}
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  changeDetails: {
    marginVertical: 10,
    marginLeft: "auto",
    marginRight: "auto",
    padding: 20,
    borderRadius: 10,
  },
  topPage: {
    flexDirection: "row",
    padding: "auto",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
  },
  container: {
    marginTop: 10,
    marginBottom: 40,
    marginLeft: "auto",
    marginRight: "auto",
    padding: "auto",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button1: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "auto",
    minWidth: 10,
    paddingHorizontal: 5,
  },
  button2: {
    marginRight: 30,
    marginLeft: "auto",
    marginVertical: 20,
    minWidth: 10,
    paddingHorizontal: 5,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  mt20: {
    marginTop: 5,
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
  },
});
