import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    Pressable,
    ScrollView,
    Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
    LineChart,
    BarChart,
} from "react-native-chart-kit";

import BottomBar from "../components/BottomBar";
import TopBar from "../components/TopBar";
import Chatbot from "../components/Chatbot";

const screenWidth = Dimensions.get("window").width;

const PRIMARY = "#2563EB";
const BG = "#F8FAFC";
const CARD = "#FFFFFF";
const TEXT = "#111827";
const SUBTEXT = "#6B7280";
const BORDER = "#E5E7EB";
const RED = "#DC2626";

export default function ChatHistoryScreen() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedCards, setExpandedCards] = useState({});
    const [expandedResults, setExpandedResults] = useState({});
    const [showAll, setShowAll] = useState(false);

    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteAllModal, setDeleteAllModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            setLoading(true);

            const token = await AsyncStorage.getItem("token");

            const response = await fetch(
                "https://api.opinion-nest-mobile.buttnetworks.com/api/chat-history",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (data.success) {
                setHistory(data.history);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const deleteSingleChat = async () => {
        try {
            const token = await AsyncStorage.getItem("token");

            const response = await fetch(
                `https://api.opinion-nest-mobile.buttnetworks.com/api/chat-history/${selectedId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (data.success) {
                setHistory((prev) =>
                    prev.filter((item) => item._id !== selectedId)
                );
            }

            setDeleteModal(false);
        } catch (error) {
            console.log(error);
        }
    };

    const deleteAllChats = async () => {
        try {
            const token = await AsyncStorage.getItem("token");

            const response = await fetch(
                "https://api.opinion-nest-mobile.buttnetworks.com/api/chat-history",
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (data.success) {
                setHistory([]);
            }

            setDeleteAllModal(false);
        } catch (error) {
            console.log(error);
        }
    };

    const toggleReadMore = (id) => {
        setExpandedCards((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const toggleResult = (id) => {
        setExpandedResults((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const visibleHistory = showAll ? history : history.slice(0, 6);

    const formatValue = (value) => {
        if (
            typeof value === "string" ||
            typeof value === "number"
        ) {
            return value.toString();
        }

        if (Array.isArray(value)) {
            return value.join(", ");
        }

        if (typeof value === "object" && value !== null) {
            return Object.entries(value)
                .map(([key, val]) => {
                    if (
                        typeof val === "object" &&
                        val !== null
                    ) {
                        return `${key}: ${JSON.stringify(val)}`;
                    }

                    return `${key}: ${val}`;
                })
                .join("\n");
        }

        return "";
    };

    const renderGraph = (result) => {
        const yearlyData =
            result?.past_yearly_analysis?.yearly_data;

        if (
            !Array.isArray(yearlyData) ||
            yearlyData.length === 0
        ) {
            return null;
        }

        const labels = yearlyData.map((item) =>
            String(item?.year || "")
        );

        const data = yearlyData.map((item) =>
            Number(item?.value || 0)
        );

        return (
            <>
                <LineChart
                    data={{
                        labels,
                        datasets: [
                            {
                                data,
                            },
                        ],
                    }}
                    width={screenWidth - 70}
                    height={220}
                    yAxisSuffix="%"
                    chartConfig={{
                        backgroundGradientFrom: "#ffffff",
                        backgroundGradientTo: "#ffffff",
                        decimalPlaces: 0,
                        color: (opacity = 1) =>
                            `rgba(37, 99, 235, ${opacity})`,
                        labelColor: (opacity = 1) =>
                            `rgba(17, 24, 39, ${opacity})`,
                        propsForDots: {
                            r: "5",
                            strokeWidth: "2",
                            stroke: PRIMARY,
                        },
                    }}
                    bezier
                    style={{
                        marginTop: 20,
                        borderRadius: 20,
                    }}
                />

                <BarChart
                    data={{
                        labels,
                        datasets: [
                            {
                                data,
                            },
                        ],
                    }}
                    width={screenWidth - 70}
                    height={240}
                    yAxisSuffix="%"
                    fromZero
                    chartConfig={{
                        backgroundGradientFrom: "#ffffff",
                        backgroundGradientTo: "#ffffff",
                        decimalPlaces: 0,
                        color: (opacity = 1) =>
                            `rgba(37, 99, 235, ${opacity})`,
                        labelColor: (opacity = 1) =>
                            `rgba(17, 24, 39, ${opacity})`,
                    }}
                    style={{
                        marginTop: 20,
                        borderRadius: 20,
                    }}
                />
            </>
        );
    };

    const renderObjectData = (obj) => {
        if (!obj || typeof obj !== "object") {
            return null;
        }

        return Object.entries(obj).map(([key, value]) => {
            if (
                key === "yearly_data" ||
                key === "summary"
            ) {
                return null;
            }

            return (
                <View
                    key={key}
                    style={styles.aiBox}
                >
                    <Text style={styles.aiHeading}>
                        {key
                            .replace(/_/g, " ")
                            .replace(
                                /\b\w/g,
                                (c) => c.toUpperCase()
                            )}
                    </Text>

                    <Text style={styles.aiText}>
                        {formatValue(value)}
                    </Text>
                </View>
            );
        });
    };

    const renderAIResult = (item) => {
        const expanded = expandedResults[item._id];
        const result = item.result;

        if (!expanded) {
            return (
                <TouchableOpacity
                    style={styles.aiBtn}
                    onPress={() => toggleResult(item._id)}
                >
                    <Text style={styles.aiBtnText}>
                        View AI Result
                    </Text>
                </TouchableOpacity>
            );
        }

        return (
            <View style={styles.aiContainer}>

                {result?.past_yearly_analysis?.summary && (
                    <View style={styles.aiBox}>
                        <Text style={styles.aiHeading}>
                            AI Summary
                        </Text>

                        <Text style={styles.aiText}>
                            {formatValue(
                                result.past_yearly_analysis
                                    .summary
                            )}
                        </Text>
                    </View>
                )}

                {Array.isArray(result?.insights) &&
                    result.insights.length > 0 && (
                        <View style={styles.aiBox}>
                            <Text style={styles.aiHeading}>
                                AI Insights
                            </Text>

                            {result.insights.map(
                                (insight, index) => (
                                    <View
                                        key={index}
                                        style={
                                            styles.insightRow
                                        }
                                    >
                                        <View
                                            style={
                                                styles.dot
                                            }
                                        />

                                        <Text
                                            style={
                                                styles.insightText
                                            }
                                        >
                                            {formatValue(
                                                insight
                                            )}
                                        </Text>
                                    </View>
                                )
                            )}
                        </View>
                    )}

                {renderObjectData(
                    result?.past_yearly_analysis
                )}

                {renderObjectData(result)}

                {renderGraph(result)}

                <TouchableOpacity
                    style={styles.viewLessBtn}
                    onPress={() => toggleResult(item._id)}
                >
                    <Text style={styles.viewLessText}>
                        Hide AI Result
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderItem = ({ item }) => {
        const expanded = expandedCards[item._id];

        return (
            <View style={styles.card}>
                <View style={styles.cardTop}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.name}>
                            {String(
                                item.name || "Untitled"
                            )}
                        </Text>

                        <Text style={styles.industry}>
                            {String(
                                item.industry || ""
                            )}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => {
                            setSelectedId(item._id);
                            setDeleteModal(true);
                        }}
                    >
                        <MaterialCommunityIcons
                            name="trash-can-outline"
                            size={22}
                            color={RED}
                        />
                    </TouchableOpacity>
                </View>

                <Text style={styles.description}>
                    {expanded
                        ? String(
                              item.description || ""
                          )
                        : String(
                              item.description || ""
                          ).slice(0, 120)}

                    {String(item.description || "")
                        .length > 120 && (
                        <Text
                            style={styles.readMore}
                            onPress={() =>
                                toggleReadMore(
                                    item._id
                                )
                            }
                        >
                            {expanded
                                ? "  View Less"
                                : "... View More"}
                        </Text>
                    )}
                </Text>

                {renderAIResult(item)}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <TopBar />

            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <Text style={styles.title}>
                        Chat History
                    </Text>

                    {history.length > 0 && (
                        <TouchableOpacity
                            style={styles.deleteAllBtn}
                            onPress={() =>
                                setDeleteAllModal(true)
                            }
                        >
                            <Ionicons
                                name="trash-outline"
                                size={16}
                                color="#fff"
                            />

                            <Text
                                style={
                                    styles.deleteAllText
                                }
                            >
                                Delete All
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {loading ? (
                    <View style={styles.loader}>
                        <ActivityIndicator
                            size="large"
                            color={PRIMARY}
                        />
                    </View>
                ) : history.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons
                            name="chatbubble-ellipses-outline"
                            size={70}
                            color="#CBD5E1"
                        />

                        <Text style={styles.emptyText}>
                            No Chat History Found
                        </Text>
                    </View>
                ) : (
                    <>
                        <FlatList
                            data={visibleHistory}
                            keyExtractor={(item) =>
                                item._id
                            }
                            renderItem={renderItem}
                            showsVerticalScrollIndicator={
                                false
                            }
                            contentContainerStyle={{
                                paddingBottom: 140,
                            }}
                        />

                        {history.length > 6 && (
                            <TouchableOpacity
                                style={
                                    styles.viewMoreBtn
                                }
                                onPress={() =>
                                    setShowAll(
                                        !showAll
                                    )
                                }
                            >
                                <Text
                                    style={
                                        styles.viewMoreText
                                    }
                                >
                                    {showAll
                                        ? "View Less"
                                        : "View More"}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </>
                )}
            </View>

            <Modal
                transparent
                animationType="fade"
                visible={deleteModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Ionicons
                            name="warning-outline"
                            size={60}
                            color={RED}
                        />

                        <Text style={styles.modalTitle}>
                            Delete Chat
                        </Text>

                        <Text style={styles.modalText}>
                            Are you sure you want to
                            delete this chat history?
                        </Text>

                        <View style={styles.modalBtns}>
                            <Pressable
                                style={styles.cancelBtn}
                                onPress={() =>
                                    setDeleteModal(false)
                                }
                            >
                                <Text
                                    style={
                                        styles.cancelText
                                    }
                                >
                                    Cancel
                                </Text>
                            </Pressable>

                            <Pressable
                                style={
                                    styles.confirmBtn
                                }
                                onPress={
                                    deleteSingleChat
                                }
                            >
                                <Text
                                    style={
                                        styles.confirmText
                                    }
                                >
                                    Delete
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                transparent
                animationType="fade"
                visible={deleteAllModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Ionicons
                            name="trash-bin-outline"
                            size={60}
                            color={RED}
                        />

                        <Text style={styles.modalTitle}>
                            Delete All Chats
                        </Text>

                        <Text style={styles.modalText}>
                            This action will permanently
                            delete all chat history.
                        </Text>

                        <View style={styles.modalBtns}>
                            <Pressable
                                style={styles.cancelBtn}
                                onPress={() =>
                                    setDeleteAllModal(
                                        false
                                    )
                                }
                            >
                                <Text
                                    style={
                                        styles.cancelText
                                    }
                                >
                                    Cancel
                                </Text>
                            </Pressable>

                            <Pressable
                                style={
                                    styles.confirmBtn
                                }
                                onPress={
                                    deleteAllChats
                                }
                            >
                                <Text
                                    style={
                                        styles.confirmText
                                    }
                                >
                                    Delete All
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
            <Chatbot />
            <BottomBar activeTab={"ChatHistoryScreen"} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BG,
    },

    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 10,
    },

    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },

    title: {
        fontSize: 28,
        fontWeight: "800",
        color: TEXT,
    },

    deleteAllBtn: {
        backgroundColor: RED,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 6,
    },

    deleteAllText: {
        color: "#fff",
        fontWeight: "700",
    },

    card: {
        backgroundColor: CARD,
        borderRadius: 20,
        padding: 18,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: BORDER,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },

    cardTop: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },

    name: {
        fontSize: 18,
        fontWeight: "800",
        color: TEXT,
    },

    industry: {
        marginTop: 4,
        color: PRIMARY,
        fontWeight: "600",
    },

    deleteBtn: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: "#FEE2E2",
        justifyContent: "center",
        alignItems: "center",
    },

    description: {
        color: SUBTEXT,
        lineHeight: 24,
        fontSize: 15,
    },

    readMore: {
        color: PRIMARY,
        fontWeight: "700",
    },

    aiBtn: {
        marginTop: 18,
        backgroundColor: PRIMARY,
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: "center",
    },

    aiBtnText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 15,
    },

    aiContainer: {
        marginTop: 18,
    },

    aiBox: {
        backgroundColor: "#EFF6FF",
        padding: 16,
        borderRadius: 16,
        marginBottom: 14,
    },

    aiHeading: {
        fontSize: 16,
        fontWeight: "800",
        color: PRIMARY,
        marginBottom: 10,
    },

    aiValue: {
        fontSize: 32,
        fontWeight: "900",
        color: TEXT,
    },

    aiText: {
        color: TEXT,
        lineHeight: 24,
        fontSize: 15,
    },

    insightRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 10,
    },

    dot: {
        width: 8,
        height: 8,
        borderRadius: 20,
        backgroundColor: PRIMARY,
        marginTop: 7,
        marginRight: 10,
    },

    insightText: {
        flex: 1,
        color: TEXT,
        lineHeight: 22,
    },

    viewLessBtn: {
        backgroundColor: "#DBEAFE",
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 16,
    },

    viewLessText: {
        color: PRIMARY,
        fontWeight: "800",
    },

    viewMoreBtn: {
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: "center",
        marginBottom: 110,
    },

    viewMoreText: {
        color: PRIMARY,
        fontWeight: "700",
        fontSize: 16,
    },

    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    emptyText: {
        marginTop: 16,
        fontSize: 18,
        fontWeight: "700",
        color: "#94A3B8",
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
    },

    modalBox: {
        backgroundColor: "#fff",
        width: "100%",
        borderRadius: 28,
        padding: 28,
        alignItems: "center",
    },

    modalTitle: {
        fontSize: 24,
        fontWeight: "800",
        color: TEXT,
        marginTop: 14,
    },

    modalText: {
        textAlign: "center",
        color: SUBTEXT,
        marginTop: 12,
        lineHeight: 24,
        fontSize: 15,
    },

    modalBtns: {
        flexDirection: "row",
        marginTop: 26,
        gap: 12,
    },

    cancelBtn: {
        flex: 1,
        backgroundColor: "#E5E7EB",
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: "center",
    },

    confirmBtn: {
        flex: 1,
        backgroundColor: RED,
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: "center",
    },

    cancelText: {
        fontWeight: "700",
        color: TEXT,
    },

    confirmText: {
        fontWeight: "700",
        color: "#fff",
    },
});