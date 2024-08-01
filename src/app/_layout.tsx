import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  PaperProvider,
  MD3LightTheme,
  MD3DarkTheme,
  adaptNavigationTheme,
} from "react-native-paper";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { AuthProvider } from "../hooks/Auth";
import { AlertsProvider } from "react-native-paper-alerts";
import { useColorScheme } from "react-native";

import merge from "deepmerge";

import { Colors } from "../constants/colors";

const customDarkTheme = { ...MD3DarkTheme, colors: Colors.dark };
const customLightTheme = { ...MD3LightTheme, colors: Colors.light };

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedLightTheme = merge(LightTheme, customLightTheme);
// const CombinedDarkTheme = merge(DarkTheme, customDarkTheme);
const CombinedDarkTheme = merge(LightTheme, MD3LightTheme);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const paperTheme =
    colorScheme === "dark" ? CombinedDarkTheme : CombinedLightTheme;

  return (
    <SafeAreaProvider>
      <PaperProvider theme={paperTheme}>
        <ThemeProvider value={paperTheme}>
          <AlertsProvider>
            <AuthProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(app)" options={{ headerShown: false }} />
              </Stack>
            </AuthProvider>
          </AlertsProvider>
        </ThemeProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
