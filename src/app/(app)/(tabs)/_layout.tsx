import {Tabs} from 'expo-router';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { StyleSheet, useColorScheme } from 'react-native';
import { BlurView } from 'expo-blur';
import { Avatar, Icon } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { downloadImage } from '@/utils/imageUtils';
import { useAuth } from '@/utils/Auth';
import { Profile } from '@/types/types';
import { supabaseClient } from '@/config/supabase-client';
import { User } from '@supabase/supabase-js';

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const tint =
  colorScheme === "dark" ? "systemMaterialDark" : "systemMaterialLight"
  const {user} = useAuth()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (profile?.avatar_url) {
      downloadImage(profile.avatar_url, setAvatarUrl, 'avatars');
    }
  }, [profile]);

  useEffect(() => {
    const setProfileData = async (user :User) => {
      try {
        const { data, error} = await supabaseClient
        .from("profiles")
        .select()
        .eq("id", user.id);
        setProfile(data[0]);
      if (error) throw error;
      }catch(error){
        console.error("Error getting profile data:", error);
      }}
      setProfileData(user)
  },[user])


  return (
    <ProtectedRoute>
      <Tabs screenOptions={{
            tabBarStyle: { 
              borderTopWidth: 0,
              position: 'absolute' },
            tabBarBackground: () => (
              <BlurView tint={tint} intensity={38} style={StyleSheet.absoluteFill} />
            ),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            headerShown: false,
            headerTitle: "Home",
            title: "Home",
            tabBarIcon: ({color}) => (
              <Icon size={28} source={"calendar-month"} />
            ),
          }}
        />
        <Tabs.Screen
          name="create-event"
          options={{
            headerShown: false,
            headerTitle: "Create Event",
            title: "Create Event",
            tabBarIcon: ({ color }) => (
              <Icon size={28} source={"calendar-plus"} />
            ),
          }}
        />
        <Tabs.Screen
          name="saved-calendar"
          options={{
            headerShown: false,
            headerTitle: "Calendar",
            title: "Saved",
            tabBarIcon: ({ color }) => (
              <Icon size={28} source={"calendar-star"} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            headerShown: false,
            headerTitle: "Profile Page",
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <Avatar.Image
              size={28}
              source={{ uri: avatarUrl }}
            />
            ),
          }}
        />
      </Tabs>
      </ProtectedRoute>
  );
};
