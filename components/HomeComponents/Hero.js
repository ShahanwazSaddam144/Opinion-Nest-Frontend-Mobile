import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
    Dimensions,
    ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function HeroScreen() {
    const [index, setIndex] = useState(0);

    const imageFade = useRef(new Animated.Value(1)).current;
    const imageScale = useRef(new Animated.Value(1)).current;

    const images = [
        require("../../assets/Hero/image1.jpg"),
        require("../../assets/Hero/image2.jpg"),
        require("../../assets/Hero/image3.jpg"),
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            Animated.parallel([
                Animated.timing(imageFade, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(imageScale, {
                    toValue: 0.95,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setIndex((prev) => (prev + 1) % images.length);

                Animated.parallel([
                    Animated.timing(imageFade, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.spring(imageScale, {
                        toValue: 1,
                        friction: 6,
                        useNativeDriver: true,
                    }),
                ]).start();
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <StatusBar style="dark" />

            <View style={styles.heroImageBox}>
                <Animated.Image
                    source={images[index]}
                    style={[
                        styles.heroImage,
                        {
                            opacity: imageFade,
                            transform: [{ scale: imageScale }],
                        },
                    ]}
                />
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>
                    AI-Powered{" "}
                    <Text style={styles.blue}>Business Insights</Text>
                </Text>

                <Text style={styles.desc}>
                    Predict market trends, analyze ideas, and build future-ready
                    businesses with Opinion-Nest AI.
                </Text>

                <Text style={styles.desc2}>
                    Get data-driven predictions for startups, e-commerce, SaaS,
                    freelancing, and emerging digital markets. Our AI evaluates
                    demand, competition, scalability, and risk in seconds.
                </Text>

                <View style={styles.tags}>
                    <Text style={styles.tag}>Market Analysis</Text>
                    <Text style={styles.tag}>AI Prediction</Text>
                    <Text style={styles.tag}>Business Scoring</Text>
                    <Text style={styles.tag}>Trend Forecast</Text>
                </View>

                <View style={styles.btnRow}>
                    <TouchableOpacity style={styles.primaryBtn}>
                        <Ionicons
                            name="rocket-outline"
                            size={18}
                            color="#fff"
                        />

                        <Text style={styles.primaryText}>
                            Start Analysis
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.secondaryBtn}>
                        <Text style={styles.secondaryText}>
                            Learn More
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.footerText}>
                    Trusted AI model for early-stage business validation and
                    market research insights.
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

    heroImageBox: {
        width: "100%",
        height: 260,
        marginTop: 20,
        alignItems: "center",
        justifyContent: "center",
    },

    heroImage: {
        width: width * 0.9,
        height: 240,
        borderRadius: 20,
    },

    content: {
        padding: 20,
    },

    title: {
        fontSize: 28,
        fontWeight: "800",
        color: "#0f172a",
    },

    blue: {
        color: "#2563eb",
    },

    desc: {
        marginTop: 10,
        fontSize: 14,
        color: "#475569",
        lineHeight: 20,
    },

    desc2: {
        marginTop: 10,
        fontSize: 13,
        color: "#64748b",
        lineHeight: 19,
    },

    tags: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 18,
        gap: 8,
    },

    tag: {
        backgroundColor: "#eff6ff",
        color: "#2563eb",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        fontSize: 12,
        fontWeight: "600",
        overflow: "hidden",
    },

    btnRow: {
        flexDirection: "row",
        marginTop: 20,
        gap: 12,
    },

    primaryBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#2563eb",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
    },

    primaryText: {
        color: "#fff",
        fontWeight: "700",
    },

    secondaryBtn: {
        borderWidth: 1,
        borderColor: "#2563eb",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },

    secondaryText: {
        color: "#2563eb",
        fontWeight: "700",
    },

    footerText: {
        marginTop: 18,
        fontSize: 12,
        color: "#94a3b8",
        lineHeight: 18,
    },
});