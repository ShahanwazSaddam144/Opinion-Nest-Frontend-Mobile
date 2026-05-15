import React, { useMemo, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ScrollView,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomBar from "../components/BottomBar";
import TopBar from "../components/TopBar";
import Chatbot from "../components/Chatbot";

const reports = [
    {
        id: 1,
        title: "Customer Growth Q1",
        date: "Feb 12, 2024",
        owner: "Alice",
        status: "Completed",
        score: 88,
        pages: 14,
        category: "Growth",
        summary:
            "Detailed breakdown of customer acquisition channels with cohort retention analysis.",
    },
    {
        id: 2,
        title: "Revenue Analysis",
        date: "May 03, 2024",
        owner: "Bob",
        status: "In Progress",
        score: 72,
        pages: 22,
        category: "Finance",
        summary:
            "Revenue mapping by region, segment and product tier with MRR trends.",
    },
    {
        id: 3,
        title: "Market Sentiment",
        date: "Jul 21, 2024",
        owner: "Clara",
        status: "Completed",
        score: 95,
        pages: 9,
        category: "Research",
        summary:
            "Sentiment analysis across social mentions and customer feedback.",
    },
    {
        id: 4,
        title: "Risk Assessment",
        date: "Jan 12, 2025",
        owner: "Dan",
        status: "Draft",
        score: 64,
        pages: 31,
        category: "Operations",
        summary:
            "Operational and compliance risk matrix with mitigation strategies.",
    },
];

const statusMeta = {
    Completed: {
        bg: "#DCFCE7",
        text: "#15803D",
    },
    "In Progress": {
        bg: "#FEF3C7",
        text: "#B45309",
    },
    Draft: {
        bg: "#E2E8F0",
        text: "#475569",
    },
};

export default function ReportScreen() {
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState("All");

    const filteredReports = useMemo(() => {
        return reports.filter((r) => {
            const matchesSearch =
                r.title.toLowerCase().includes(query.toLowerCase()) ||
                r.category.toLowerCase().includes(query.toLowerCase());

            const matchesFilter =
                filter === "All" ? true : r.status === filter;

            return matchesSearch && matchesFilter;
        });
    }, [query, filter]);

    const avgScore = Math.round(
        reports.reduce((acc, item) => acc + item.score, 0) / reports.length
    );

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
            >
                <View style={styles.header}>
                    <Text style={styles.label}>Analytics</Text>
                    <Text style={styles.heading}>Reports</Text>
                    <Text style={styles.subheading}>
                        Generated reports and performance summaries
                    </Text>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statTitle}>Total Reports</Text>
                        <Text style={styles.statValue}>
                            {reports.length}
                        </Text>
                    </View>

                    <View style={styles.statCard}>
                        <Text style={styles.statTitle}>Avg Score</Text>
                        <Text style={styles.statValue}>
                            {avgScore}%
                        </Text>
                    </View>

                    <View style={styles.statCard}>
                        <Text style={styles.statTitle}>Active</Text>
                        <Text style={styles.statValue}>
                            {
                                reports.filter(
                                    (r) => r.status !== "Completed"
                                ).length
                            }
                        </Text>
                    </View>
                </View>

                <View style={styles.searchSection}>
                    <View style={styles.searchBox}>
                        <Ionicons
                            name="search"
                            size={18}
                            color="#94A3B8"
                        />
                        <TextInput
                            placeholder="Search reports..."
                            placeholderTextColor="#94A3B8"
                            style={styles.input}
                            value={query}
                            onChangeText={setQuery}
                        />
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filterRow}
                    >
                        {["All", "Completed", "In Progress", "Draft"].map(
                            (item) => (
                                <TouchableOpacity
                                    key={item}
                                    style={[
                                        styles.filterBtn,
                                        filter === item &&
                                            styles.activeFilterBtn,
                                    ]}
                                    onPress={() => setFilter(item)}
                                >
                                    <Text
                                        style={[
                                            styles.filterText,
                                            filter === item &&
                                                styles.activeFilterText,
                                        ]}
                                    >
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            )
                        )}
                    </ScrollView>
                </View>

                {filteredReports.map((report) => {
                    const status = statusMeta[report.status];

                    return (
                        <View
                            key={report.id}
                            style={styles.reportCard}
                        >
                            <View style={styles.cardTop}>
                                <View style={styles.categoryBadge}>
                                    <Text style={styles.categoryText}>
                                        {report.category}
                                    </Text>
                                </View>

                                <View
                                    style={[
                                        styles.statusBadge,
                                        {
                                            backgroundColor: status.bg,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.statusText,
                                            {
                                                color: status.text,
                                            },
                                        ]}
                                    >
                                        {report.status}
                                    </Text>
                                </View>
                            </View>

                            <Text style={styles.reportTitle}>
                                {report.title}
                            </Text>

                            <Text style={styles.reportSummary}>
                                {report.summary}
                            </Text>

                            <View style={styles.progressRow}>
                                <View style={styles.progressBar}>
                                    <View
                                        style={[
                                            styles.progressFill,
                                            {
                                                width: `${report.score}%`,
                                            },
                                        ]}
                                    />
                                </View>

                                <Text style={styles.scoreText}>
                                    {report.score}%
                                </Text>
                            </View>

                            <View style={styles.bottomRow}>
                                <Text style={styles.ownerText}>
                                    {report.owner}
                                </Text>

                                <Text style={styles.dateText}>
                                    {report.date}
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </ScrollView>

            <Chatbot />

            <BottomBar activeTab="ReportScreen" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
    },

    scroll: {
        flex: 1,
    },

    content: {
        paddingHorizontal: 18,
        paddingTop: 12,
        paddingBottom: 160,
    },

    header: {
        marginBottom: 24,
    },

    label: {
        fontSize: 12,
        fontWeight: "700",
        color: "#2563EB",
        textTransform: "uppercase",
        marginBottom: 6,
        letterSpacing: 1,
    },

    heading: {
        fontSize: 32,
        fontWeight: "700",
        color: "#0F172A",
        marginBottom: 6,
    },

    subheading: {
        fontSize: 14,
        color: "#94A3B8",
    },

    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 24,
    },

    statCard: {
        flex: 1,
        backgroundColor: "#ffffff",
        padding: 18,
        borderRadius: 20,
        marginHorizontal: 4,
        elevation: 3,
    },

    statTitle: {
        fontSize: 12,
        color: "#94A3B8",
        marginBottom: 10,
        fontWeight: "600",
    },

    statValue: {
        fontSize: 26,
        fontWeight: "700",
        color: "#0F172A",
    },

    searchSection: {
        backgroundColor: "#ffffff",
        borderRadius: 24,
        padding: 18,
        marginBottom: 24,
    },

    searchBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F1F5F9",
        borderRadius: 14,
        paddingHorizontal: 14,
        marginBottom: 16,
    },

    input: {
        flex: 1,
        height: 50,
        marginLeft: 10,
        color: "#0F172A",
        fontSize: 15,
    },

    filterRow: {
        gap: 10,
    },

    filterBtn: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 30,
        backgroundColor: "#F1F5F9",
    },

    activeFilterBtn: {
        backgroundColor: "#2563EB",
    },

    filterText: {
        color: "#64748B",
        fontWeight: "600",
        fontSize: 13,
    },

    activeFilterText: {
        color: "#ffffff",
    },

    reportCard: {
        backgroundColor: "#ffffff",
        borderRadius: 24,
        padding: 20,
        marginBottom: 18,
        elevation: 3,
    },

    cardTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },

    categoryBadge: {
        backgroundColor: "#DBEAFE",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },

    categoryText: {
        color: "#2563EB",
        fontSize: 12,
        fontWeight: "700",
    },

    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },

    statusText: {
        fontSize: 12,
        fontWeight: "700",
    },

    reportTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#0F172A",
        marginBottom: 10,
    },

    reportSummary: {
        fontSize: 14,
        lineHeight: 22,
        color: "#64748B",
        marginBottom: 20,
    },

    progressRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },

    progressBar: {
        flex: 1,
        height: 8,
        borderRadius: 10,
        backgroundColor: "#E2E8F0",
        overflow: "hidden",
        marginRight: 12,
    },

    progressFill: {
        height: "100%",
        borderRadius: 10,
        backgroundColor: "#2563EB",
    },

    scoreText: {
        fontWeight: "700",
        color: "#0F172A",
    },

    bottomRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    ownerText: {
        color: "#64748B",
        fontWeight: "600",
    },

    dateText: {
        color: "#94A3B8",
        fontSize: 12,
    },
});