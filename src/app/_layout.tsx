import { Stack } from "expo-router";
import {
  PaperProvider,
  MD3LightTheme,
  MD3DarkTheme,
  adaptNavigationTheme,
  MD3Colors,
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
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const customDarkTheme = { ...MD3DarkTheme, colors: MD3Colors. };
const customLightTheme = { ...MD3LightTheme, colors: MD3Colors };

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedLightTheme = merge(LightTheme, customLightTheme);
const CombinedDarkTheme = merge(DarkTheme, customDarkTheme);

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const paperTheme = CombinedLightTheme
    // colorScheme === "dark" ? CombinedDarkTheme : CombinedLightTheme;

  return (
    <PaperProvider theme={paperTheme}>
      <ThemeProvider value={CombinedLightTheme}>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <AlertsProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(app)" options={{ headerShown: false }} />
              </Stack>
            </AlertsProvider>
          </QueryClientProvider>
        </AuthProvider>
      </ThemeProvider>
    </PaperProvider>
  );
}
