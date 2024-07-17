import { Stack } from "expo-router";

const RootLayout = () => {
    return (
        <Stack
        screenOptions={{headerShown: false}}>
            <Stack.Screen name="(Tabs)"/>
        </Stack>
    );
};

export default RootLayout;
