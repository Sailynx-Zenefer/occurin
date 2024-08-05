import { Stack } from "expo-router";

export default function AppLayout() {
  return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="sign-in" options={{ headerShown: false, presentation: "fullScreenModal" }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false}} />
        <Stack.Screen name="(modals)" options={{headerShown: false}}/>
      </Stack>
  );
}
