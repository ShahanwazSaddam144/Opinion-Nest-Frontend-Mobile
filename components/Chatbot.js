import React, { useRef, useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    SafeAreaView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

export default function Chatbot() {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const scrollRef = useRef(null);

    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "Hello 👋 How can I help you today?",
        },
    ]);

    useEffect(() => {
        if (scrollRef.current) {
            setTimeout(() => {
                scrollRef.current.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages, loading]);

    const sendMessage = async () => {
        if (!message.trim()) return;

        const currentMessage = message;

        const userMessage = {
            sender: "user",
            text: currentMessage,
        };

        setMessages((prev) => [...prev, userMessage]);

        setMessage("");
        setLoading(true);

        try {
            const response = await fetch(
                "https://api.chatbot.buttnetworks.com/chat",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        message: currentMessage,
                    }),
                }
            );

            const data = await response.json();

            const botMessage = {
                sender: "bot",
                text: data.reply || "No response",
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: "Unable to connect to server",
                },
            ]);
        }

        setLoading(false);
    };

    return (
        <>
            <View style={styles.floatingContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.chatButton}
                        onPress={() => setVisible(true)}
                    >
                        <View style={styles.innerButton}>
                            <Ionicons
                                name="chatbubble-ellipses"
                                size={28}
                                color="#ffffff"
                            />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <Modal
                visible={visible}
                transparent
                animationType="fade"
                statusBarTranslucent
            >
                <SafeAreaView style={styles.modalOverlay}>
                    <KeyboardAvoidingView
                        style={styles.keyboardView}
                        behavior={Platform.OS === "ios" ? "padding" : undefined}
                    >
                        <View style={styles.chatContainer}>
                            <View style={styles.header}>
                                <View style={styles.headerLeft}>
                                    <View style={styles.botAvatar}>
                                        <Ionicons
                                            name="sparkles"
                                            size={20}
                                            color="#2563EB"
                                        />
                                    </View>

                                    <View>
                                        <Text style={styles.headerTitle}>
                                            AI Assistant
                                        </Text>

                                        <Text style={styles.headerStatus}>
                                            Online
                                        </Text>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={styles.closeButton}
                                    onPress={() => setVisible(false)}
                                >
                                    <Ionicons
                                        name="close"
                                        size={24}
                                        color="#2563EB"
                                    />
                                </TouchableOpacity>
                            </View>

                            <ScrollView
                                ref={scrollRef}
                                style={styles.chatArea}
                                contentContainerStyle={styles.chatContent}
                                showsVerticalScrollIndicator={false}
                            >
                                {messages.map((item, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.messageRow,
                                            item.sender === "user"
                                                ? styles.userRow
                                                : styles.botRow,
                                        ]}
                                    >
                                        <View
                                            style={[
                                                styles.messageBubble,
                                                item.sender === "user"
                                                    ? styles.userBubble
                                                    : styles.botBubble,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.messageText,
                                                    item.sender === "user"
                                                        ? styles.userText
                                                        : styles.botText,
                                                ]}
                                            >
                                                {item.text}
                                            </Text>
                                        </View>
                                    </View>
                                ))}

                                {loading && (
                                    <View style={styles.loadingWrapper}>
                                        <View style={styles.loadingBubble}>
                                            <ActivityIndicator
                                                size="small"
                                                color="#2563EB"
                                            />
                                        </View>
                                    </View>
                                )}
                            </ScrollView>

                            <View style={styles.inputWrapper}>
                                <TextInput
                                    value={message}
                                    onChangeText={setMessage}
                                    placeholder="Type a message..."
                                    placeholderTextColor="#9CA3AF"
                                    style={styles.input}
                                    multiline
                                />

                                <TouchableOpacity
                                    activeOpacity={0.85}
                                    style={styles.sendButton}
                                    onPress={sendMessage}
                                >
                                    <Ionicons
                                        name="send"
                                        size={20}
                                        color="#ffffff"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    floatingContainer: {
        position: "absolute",
        right: 0,
        bottom: 110,
        zIndex: 999,
    },

    scrollContent: {
        paddingRight: 18,
    },

    chatButton: {
        justifyContent: "center",
        alignItems: "center",
    },

    innerButton: {
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: "#2563EB",
        justifyContent: "center",
        alignItems: "center",
        elevation: 14,
        shadowColor: "#2563EB",
        shadowOpacity: 0.35,
        shadowRadius: 14,
        shadowOffset: {
            width: 0,
            height: 8,
        },
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        alignItems: "center",
    },

    keyboardView: {
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },

    chatContainer: {
        width: "92%",
        height: "82%",
        backgroundColor: "#ffffff",
        borderRadius: 30,
        overflow: "hidden",
        elevation: 20,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 20,
        shadowOffset: {
            width: 0,
            height: 10,
        },
    },

    header: {
        height: 82,
        backgroundColor: "#ffffff",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
        paddingHorizontal: 18,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
    },

    botAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#DBEAFE",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
    },

    headerStatus: {
        fontSize: 13,
        color: "#2563EB",
        marginTop: 3,
        fontWeight: "600",
    },

    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#EFF6FF",
        justifyContent: "center",
        alignItems: "center",
    },

    chatArea: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },

    chatContent: {
        paddingHorizontal: 16,
        paddingVertical: 18,
        paddingBottom: 35,
    },

    messageRow: {
        marginBottom: 14,
        flexDirection: "row",
    },

    userRow: {
        justifyContent: "flex-end",
    },

    botRow: {
        justifyContent: "flex-start",
    },

    messageBubble: {
        maxWidth: "82%",
        paddingHorizontal: 16,
        paddingVertical: 13,
        borderRadius: 20,
    },

    userBubble: {
        backgroundColor: "#2563EB",
        borderBottomRightRadius: 6,
    },

    botBubble: {
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderBottomLeftRadius: 6,
    },

    messageText: {
        fontSize: 15,
        lineHeight: 22,
    },

    userText: {
        color: "#ffffff",
    },

    botText: {
        color: "#111827",
    },

    inputWrapper: {
        flexDirection: "row",
        alignItems: "flex-end",
        paddingHorizontal: 14,
        paddingVertical: 14,
        backgroundColor: "#ffffff",
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
    },

    input: {
        flex: 1,
        minHeight: 54,
        maxHeight: 120,
        backgroundColor: "#F3F4F6",
        borderRadius: 18,
        paddingHorizontal: 18,
        paddingTop: 14,
        paddingBottom: 14,
        fontSize: 15,
        color: "#111827",
    },

    sendButton: {
        width: 54,
        height: 54,
        borderRadius: 18,
        backgroundColor: "#2563EB",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 10,
    },

    loadingWrapper: {
        marginTop: 2,
        flexDirection: "row",
    },

    loadingBubble: {
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        paddingHorizontal: 18,
        paddingVertical: 14,
        borderRadius: 18,
    },
});