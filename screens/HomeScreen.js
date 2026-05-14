import { View, StyleSheet, StatusBar, ScrollView } from "react-native";
import BottomBar from "../components/BottomBar";
import Hero from "../components/HomeComponents/Hero";
import AIModel from "../components/HomeComponents/AIModel";
import TopBar from "../components/TopBar";
import Chatbot from "./Chatbot";

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#ffffff"
            />

            <TopBar />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                bounces
            >
                <Hero />
                <AIModel />
            </ScrollView>

            <Chatbot />

            <BottomBar activeTab="HomeScreen" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        position: "relative",
    },

    scroll: {
        flex: 1,
        width: "100%",
    },

    content: {
        paddingTop: 10,
        paddingBottom: 150,
        alignItems: "center",
    },
});