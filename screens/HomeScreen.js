import { View, StyleSheet, StatusBar, ScrollView } from "react-native";
import BottomBar from "../components/BottomBar";
import Hero from "../components/HomeComponents/Hero";
import AIModel from "../components/HomeComponents/AIModel";
import TopBar from "../components/TopBar";

export default function HomeScreen() {
    return (
        <>
        <View style={styles.container}>
            <TopBar />
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#ffffff"
            />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                bounces={true}
            >
                <Hero />
                <AIModel />
            </ScrollView>

            <BottomBar activeTab="HomeScreen" />
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },

    scroll: {
        flex: 1,
        width: "100%",
    },

    content: {
        paddingTop: 10,
        paddingBottom: 130,
        alignItems: "center",
    },
});