import { View, Text, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import BottomBar from "../components/BottomBar";
import TopBar from "../components/TopBar";
import Chatbot from "../components/Chatbot";

export default function ChatHistoryScreen() {
    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <TopBar />

            <View style={styles.content}>
                <Text style={styles.title}>Chat History</Text>

                <Chatbot />
            </View>

            <BottomBar activeTab={"ChatHistoryScreen"} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        position: "relative",
    },

    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 10,
    },

    title: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 15,
        color: "#111827",
    },
});