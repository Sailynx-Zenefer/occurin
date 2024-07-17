import { Link, router } from "expo-router";
import {Pressable, Text, View } from "react-native";

const NewsFeed = () => {
    return (<View>
        <Text>Home Page</Text>
        <Link href="/users/1">Go to user 1</Link>
        <Pressable onPress={() => router.push("/users/2")}>
            <Text>Go to User 2</Text>
        </Pressable>
    </View>)
}

export default NewsFeed;