import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

export default function WelcomeScreen({ navigation }) {
    const [displayPercent, setDisplayPercent] = useState(0);

    const animatedWidth = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const avatarPulse = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
                easing: Easing.out(Easing.ease),
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 60,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(avatarPulse, {
                    toValue: 1.08,
                    duration: 900,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.ease),
                }),
                Animated.timing(avatarPulse, {
                    toValue: 1,
                    duration: 900,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.ease),
                }),
            ])
        ).start();

        const steps = [
            { time: 1000, value: 25 },
            { time: 2500, value: 50 },
            { time: 4000, value: 75 },
            { time: 5500, value: 100 },
        ];

        steps.forEach(({ time, value }) => {
            setTimeout(() => {
                setDisplayPercent(value);

                Animated.timing(animatedWidth, {
                    toValue: value,
                    duration: 700,
                    useNativeDriver: false,
                    easing: Easing.out(Easing.ease),
                }).start();
            }, time);
        });

        const navTimer = setTimeout(() => {
            navigation?.navigate("AuthScreen");
        }, 6200);

        return () => clearTimeout(navTimer);
    }, []);

    const barWidth = animatedWidth.interpolate({
        inputRange: [0, 100],
        outputRange: ["0%", "100%"],
    });

    const getStepColor = (step) => {
        return displayPercent >= step ? "#2563EB" : "#E2E8F0";
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                <Animated.View
                    style={[
                        styles.avatarContainer,
                        {
                            transform: [{ scale: avatarPulse }],
                        },
                    ]}
                >
                    <View style={styles.avatarInner}>
                        <Ionicons
                            name="hardware-chip-outline"
                            size={48}
                            color="#FFFFFF"
                        />
                    </View>

                    <View style={styles.avatarRing} />
                </Animated.View>

                <Text style={styles.appName}>Opinion Nest</Text>

                <Text style={styles.tagline}>
                    Think deeper. Learn faster.
                </Text>

                <View style={styles.loaderSection}>
                    <View style={styles.stepDots}>
                        {[25, 50, 75, 100].map((step) => (
                            <View
                                key={step}
                                style={[
                                    styles.stepDot,
                                    {
                                        backgroundColor: getStepColor(step),
                                    },
                                ]}
                            />
                        ))}
                    </View>

                    <View style={styles.progressTrack}>
                        <Animated.View
                            style={[
                                styles.progressFill,
                                {
                                    width: barWidth,
                                },
                            ]}
                        />
                    </View>

                    <View style={styles.progressLabelRow}>
                        <Text style={styles.progressLabel}>
                            Loading experience
                        </Text>

                        <Text style={styles.progressPercent}>
                            {displayPercent}%
                        </Text>
                    </View>
                </View>
            </Animated.View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Powered by Intelligence
                </Text>

                <View style={styles.footerDot} />

                <Text style={styles.footerText}>v2.0</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
    },

    content: {
        width: "100%",
        alignItems: "center",
    },

    avatarContainer: {
        width: 130,
        height: 130,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 30,
        position: "relative",
    },

    avatarInner: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: "#2563EB",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#2563EB",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 12,
    },

    avatarRing: {
        position: "absolute",
        width: 125,
        height: 125,
        borderRadius: 62.5,
        borderWidth: 2,
        borderColor: "#BFDBFE",
    },

    appName: {
        fontSize: 38,
        fontWeight: "800",
        color: "#0F172A",
        letterSpacing: -1,
        marginBottom: 8,
    },

    tagline: {
        fontSize: 15,
        color: "#64748B",
        marginBottom: 55,
        letterSpacing: 0.3,
    },

    loaderSection: {
        width: "100%",
        alignItems: "center",
    },

    stepDots: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 14,
    },

    stepDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },

    progressTrack: {
        width: "100%",
        height: 7,
        backgroundColor: "#E2E8F0",
        borderRadius: 10,
        overflow: "hidden",
    },

    progressFill: {
        height: "100%",
        backgroundColor: "#2563EB",
        borderRadius: 10,
    },

    progressLabelRow: {
        width: "100%",
        marginTop: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    progressLabel: {
        fontSize: 12,
        color: "#94A3B8",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 0.6,
    },

    progressPercent: {
        fontSize: 12,
        color: "#2563EB",
        fontWeight: "700",
    },

    footer: {
        position: "absolute",
        bottom: 45,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    footerText: {
        fontSize: 12,
        color: "#CBD5E1",
        fontWeight: "500",
    },

    footerDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#CBD5E1",
    },
});