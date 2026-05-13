import React, { useRef, useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Animated,
    Dimensions,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const API_URL = "https://api.opinion-nest-mobile.buttnetworks.com/api/auth";

export default function AuthScreen() {
    const navigation = useNavigation();

    const [isLogin, setIsLogin] = useState(true);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.92)).current;

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
        }).start();

        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const token = await AsyncStorage.getItem("token");

            if (!token) return;

            const response = await fetch(`${API_URL}/me`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (data.success) {
                navigation.replace("HomeScreen");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const showMessage = (msg, isError = false) => {
        setMessage(msg);
        setError(isError);

        Animated.sequence([
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 350,
                    useNativeDriver: true,
                }),
            ]),
            Animated.delay(2500),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 350,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handleAuth = async () => {
        if (!email || !password) {
            return showMessage("Please fill all fields", true);
        }

        if (!isLogin) {
            if (!name || !confirmPassword) {
                return showMessage("Please fill all fields", true);
            }

            if (password !== confirmPassword) {
                return showMessage("Passwords do not match", true);
            }
        }

        try {
            setLoading(true);

            const endpoint = isLogin ? "/login" : "/signin";

            const response = await fetch(`${API_URL}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    isLogin
                        ? {
                              email,
                              password,
                          }
                        : {
                              name,
                              email,
                              password,
                          }
                ),
            });

            const data = await response.json();

            if (!response.ok) {
                return showMessage(data.message, true);
            }

            await AsyncStorage.setItem("token", data.token);
            await AsyncStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            showMessage(data.message);

            setTimeout(() => {
                navigation.replace("HomeScreen");
            }, 1200);

            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");

        } catch (err) {
            showMessage("Network Error", true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.container}>
                    <StatusBar style="dark" />

                    <View style={styles.backgroundCircleOne} />
                    <View style={styles.backgroundCircleTwo} />

                    <Animated.View
                        style={[
                            styles.toast,
                            {
                                opacity: fadeAnim,
                                transform: [
                                    {
                                        translateY: fadeAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [-40, 0],
                                        }),
                                    },
                                ],
                                backgroundColor: error
                                    ? "#ef4444"
                                    : "#2563eb",
                            },
                        ]}
                    >
                        <Text style={styles.toastText}>{message}</Text>
                    </Animated.View>

                    <Animated.View
                        style={[
                            styles.card,
                            {
                                transform: [{ scale: scaleAnim }],
                            },
                        ]}
                    >
                        <View style={styles.logoContainer}>
                            <View style={styles.logo}>
                                <Ionicons
                                    name="sparkles"
                                    size={32}
                                    color="#2563eb"
                                />
                            </View>
                        </View>

                        <View style={styles.topSection}>
                            <Text style={styles.heading}>
                                {isLogin
                                    ? "Welcome Back"
                                    : "Create Account"}
                            </Text>

                            <Text style={styles.subHeading}>
                                {isLogin
                                    ? "Login to continue your journey"
                                    : "Create your premium account"}
                            </Text>
                        </View>

                        {!isLogin && (
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="person-outline"
                                    size={22}
                                    color="#2563eb"
                                />

                                <TextInput
                                    placeholder="Full Name"
                                    placeholderTextColor="#94a3b8"
                                    style={styles.input}
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                        )}

                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="mail-outline"
                                size={22}
                                color="#2563eb"
                            />

                            <TextInput
                                placeholder="Email Address"
                                placeholderTextColor="#94a3b8"
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={22}
                                color="#2563eb"
                            />

                            <TextInput
                                placeholder="Password"
                                placeholderTextColor="#94a3b8"
                                style={styles.input}
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                            />

                            <TouchableOpacity
                                onPress={() =>
                                    setShowPassword(!showPassword)
                                }
                            >
                                <Ionicons
                                    name={
                                        showPassword
                                            ? "eye-outline"
                                            : "eye-off-outline"
                                    }
                                    size={22}
                                    color="#2563eb"
                                />
                            </TouchableOpacity>
                        </View>

                        {!isLogin && (
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="shield-checkmark-outline"
                                    size={22}
                                    color="#2563eb"
                                />

                                <TextInput
                                    placeholder="Confirm Password"
                                    placeholderTextColor="#94a3b8"
                                    style={styles.input}
                                    secureTextEntry={
                                        !showConfirmPassword
                                    }
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                />

                                <TouchableOpacity
                                    onPress={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                >
                                    <Ionicons
                                        name={
                                            showConfirmPassword
                                                ? "eye-outline"
                                                : "eye-off-outline"
                                        }
                                        size={22}
                                        color="#2563eb"
                                    />
                                </TouchableOpacity>
                            </View>
                        )}

                        <TouchableOpacity
                            style={styles.button}
                            activeOpacity={0.88}
                            onPress={handleAuth}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>
                                    {isLogin
                                        ? "Login"
                                        : "Create Account"}
                                </Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.switchButton}
                            onPress={() => setIsLogin(!isLogin)}
                        >
                            <Text style={styles.switchText}>
                                {isLogin
                                    ? "Don't have an account? Sign Up"
                                    : "Already have an account? Login"}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 22,
    },

    backgroundCircleOne: {
        position: "absolute",
        width: 280,
        height: 280,
        borderRadius: 140,
        backgroundColor: "rgba(37,99,235,0.08)",
        top: -80,
        right: -80,
    },

    backgroundCircleTwo: {
        position: "absolute",
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: "rgba(37,99,235,0.06)",
        bottom: -40,
        left: -60,
    },

    card: {
        width: width * 0.92,
        backgroundColor: "#ffffff",
        borderRadius: 34,
        padding: 26,
        shadowColor: "#2563eb",
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 10,
    },

    logoContainer: {
        width: "100%",
        alignItems: "center",
        marginBottom: 24,
    },

    logo: {
        width: 78,
        height: 78,
        borderRadius: 39,
        backgroundColor: "#eff6ff",
        justifyContent: "center",
        alignItems: "center",
    },

    topSection: {
        marginBottom: 26,
        alignItems: "center",
    },

    heading: {
        color: "#0f172a",
        fontSize: 30,
        fontWeight: "800",
    },

    subHeading: {
        color: "#64748b",
        marginTop: 8,
        fontSize: 15,
        textAlign: "center",
    },

    inputContainer: {
        width: "100%",
        height: 62,
        backgroundColor: "#f8fafc",
        borderRadius: 18,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 18,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#dbeafe",
    },

    input: {
        flex: 1,
        color: "#0f172a",
        marginLeft: 12,
        fontSize: 15,
    },

    button: {
        width: "100%",
        height: 60,
        backgroundColor: "#2563eb",
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        shadowColor: "#2563eb",
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },

    buttonText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "700",
    },

    switchButton: {
        marginTop: 24,
        alignItems: "center",
    },

    switchText: {
        color: "#2563eb",
        fontSize: 14,
        fontWeight: "700",
    },

    toast: {
        position: "absolute",
        top: 70,
        paddingHorizontal: 22,
        paddingVertical: 14,
        borderRadius: 16,
        zIndex: 100,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },

    toastText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "700",
    },
});