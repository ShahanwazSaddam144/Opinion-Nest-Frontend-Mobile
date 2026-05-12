import { View, Text, StyleSheet, StatusBar } from "react-native";
import BottomBar from "../components/BottomBar";
import Hero from "../components/HomeComponents/Hero";

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.content}>
                <Hero />
            </View>

            <BottomBar />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    text: {
        fontSize: 20,
        fontWeight: "bold",
    },
});