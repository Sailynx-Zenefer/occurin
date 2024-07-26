import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function TabsLayout() {
  return (

      <Tabs>
        <Tabs.Screen
          name="index"
          options={{
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
            headerTitle: "Calendar",
            title: "Calendar",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="calendar" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="users/[id]"
          options={{
            headerTitle: "User Page",
            title: "User",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="user-circle" color={color} />
            ),
          }}
        />
      </Tabs>
  );
};
