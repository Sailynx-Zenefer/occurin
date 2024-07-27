import { Stack } from "expo-router";
import {
  PaperProvider,
  MD3LightTheme,
  MD3DarkTheme,
  adaptNavigationTheme,
} from "react-native-paper";
import { useColorScheme } from "react-native";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import merge from "deepmerge";

import { Colors } from "../constants/colors";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AlertsProvider } from "react-native-paper-alerts";

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
            <Stack>
              <Stack.Screen name="(Tabs)" options={{ headerShown: false }} />
            </Stack>
          </AlertsProvider>
        </ThemeProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
