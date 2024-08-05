import {Tabs} from 'expo-router';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import ProtectedRoute from '../../../components/ProtectedRoute';

export default function TabsLayout() {

  return (
    <ProtectedRoute>
      <Tabs>
        <Tabs.Screen
        
          name="index"
          options={{
            headerShown: false,
            headerTitle: "Home",
            title: "Home",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            headerShown: false,
            headerTitle: "Search",
            title: "Search",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="search" color={color} />
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
              <FontAwesome size={28} name="plus-square" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="user-calendar"
          options={{
            headerShown: false,
            headerTitle: "Calendar",
            title: "Calendar",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="calendar" color={color} />
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
              <FontAwesome size={28} name="user-circle" color={color} />
            ),
          }}
        />
      </Tabs>
      </ProtectedRoute>
  );
};

