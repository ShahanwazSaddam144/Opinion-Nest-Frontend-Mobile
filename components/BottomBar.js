import { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Modal,
    Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const BLUE = "#1D4ED8";
const BLUE_LIGHT = "#EFF6FF";
const BLUE_MID = "#BFDBFE";
const BLACK = "#0F172A";
const GREY = "#94A3B8";
const WHITE = "#FFFFFF";

const API_URL = "https://api.opinion-nest-mobile.buttnetworks.com/api/auth";

export default function BottomBar({ activeTab }) {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const [avatarMenuVisible, setAvatarMenuVisible] = useState(false);
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);

    const [user, setUser] = useState(null);
    const [initials, setInitials] = useState("U");

    const avatarScale = useRef(new Animated.Value(1)).current;
    const menuAnim = useRef(new Animated.Value(0)).current;
    const modalAnim = useRef(new Animated.Value(0)).current;

    const tabs = [
        {
            key: "HomeScreen",
            label: "Home",
            icon: (active) => (
                <Ionicons
                    name={active ? "home" : "home-outline"}
                    size={22}
                    color={active ? BLUE : GREY}
                />
            ),
        },
        {
            key: "ChatHistoryScreen",
            label: "History",
            icon: (active) => (
                <MaterialCommunityIcons
                    name={active ? "chat-processing" : "chat-processing-outline"}
                    size={22}
                    color={active ? BLUE : GREY}
                />
            ),
        },
        {
            key: "ReportScreen",
            label: "Reports",
            icon: (active) => (
                <Ionicons
                    name={active ? "bar-chart" : "bar-chart-outline"}
                    size={22}
                    color={active ? BLUE : GREY}
                />
            ),
        },
    ];

    const getInitials = (name) => {
        if (!name) return "U";
        const parts = name.trim().split(" ");
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const fetchUser = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) return;

            const res = await fetch(`${API_URL}/me`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (data?.success) {
                setUser(data.user);
                setInitials(getInitials(data.user.name));
            } else {
                await AsyncStorage.removeItem("token");
                navigation.replace("AuthScreen");
            }
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const openAvatarMenu = () => {
        setAvatarMenuVisible(true);

        Animated.spring(menuAnim, {
            toValue: 1,
            tension: 80,
            friction: 8,
            useNativeDriver: true,
        }).start();

        Animated.spring(avatarScale, {
            toValue: 0.92,
            tension: 80,
            friction: 6,
            useNativeDriver: true,
        }).start();
    };

    const closeAvatarMenu = () => {
        Animated.timing(menuAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
        }).start(() => {
            setAvatarMenuVisible(false);

            Animated.spring(avatarScale, {
                toValue: 1,
                tension: 80,
                friction: 6,
                useNativeDriver: true,
            }).start();
        });
    };

    const openLogoutModal = () => {
        closeAvatarMenu();

        setTimeout(() => {
            setLogoutModalVisible(true);

            Animated.spring(modalAnim, {
                toValue: 1,
                tension: 70,
                friction: 8,
                useNativeDriver: true,
            }).start();
        }, 200);
    };

    const closeLogoutModal = () => {
        Animated.timing(modalAnim, {
            toValue: 0,
            duration: 180,
            useNativeDriver: true,
        }).start(() => setLogoutModalVisible(false));
    };

    const confirmLogout = async () => {
        try {
            const token = await AsyncStorage.getItem("token");

            await fetch(`${API_URL}/logout`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("user");

            closeLogoutModal();
            setTimeout(() => navigation.replace("AuthScreen"), 250);
        } catch (e) {
            console.log(e);
        }
    };

    const menuTranslateY = menuAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [12, 0],
    });

    const modalScale = modalAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.88, 1],
    });

    return (
        <>
            <View
                style={[
                    styles.wrapper,
                    { paddingBottom: insets.bottom || 12 },
                ]}
            >
                <View style={styles.bar}>
                    {tabs.map((tab) => {
                        const active = activeTab === tab.key;

                        return (
                            <TouchableOpacity
                                key={tab.key}
                                style={styles.tabItem}
                                onPress={() => navigation.navigate(tab.key)}
                                activeOpacity={0.7}
                            >
                                <View
                                    style={[
                                        styles.iconWrap,
                                        active && styles.iconWrapActive,
                                    ]}
                                >
                                    {tab.icon(active)}
                                </View>

                                <Text
                                    style={[
                                        styles.tabLabel,
                                        active && styles.tabLabelActive,
                                    ]}
                                >
                                    {tab.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}

                    <View style={styles.tabItem}>
                        {avatarMenuVisible && (
                            <Pressable
                                style={styles.menuOverlay}
                                onPress={closeAvatarMenu}
                            />
                        )}

                        {avatarMenuVisible && (
                            <Animated.View
                                style={[
                                    styles.avatarMenu,
                                    {
                                        opacity: menuAnim,
                                        transform: [
                                            { translateY: menuTranslateY },
                                        ],
                                    },
                                ]}
                            >
                                <View style={styles.menuArrow} />

                                <View style={styles.menuContent}>
                                    <View style={styles.menuUserRow}>
                                        <View style={styles.menuAvatarSmall}>
                                            <Text style={styles.menuAvatarText}>
                                                {initials}
                                            </Text>
                                        </View>

                                        <View>
                                            <Text style={styles.menuName}>
                                                {user?.name || "User"}
                                            </Text>

                                            <Text style={styles.menuRole}>
                                                Administrator
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.menuDivider} />

                                    <TouchableOpacity
                                        style={styles.logoutBtn}
                                        onPress={openLogoutModal}
                                        activeOpacity={0.8}
                                    >
                                        <Ionicons
                                            name="log-out-outline"
                                            size={16}
                                            color="#EF4444"
                                        />

                                        <Text style={styles.logoutBtnText}>
                                            Logout
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>
                        )}

                        <TouchableOpacity
                            onPress={openAvatarMenu}
                            activeOpacity={0.85}
                        >
                            <Animated.View
                                style={[
                                    styles.avatar,
                                    {
                                        transform: [{ scale: avatarScale }],
                                    },
                                ]}
                            >
                                <Text style={styles.avatarText}>
                                    {initials}
                                </Text>

                                <View style={styles.avatarOnline} />
                            </Animated.View>
                        </TouchableOpacity>

                        <Text style={styles.tabLabel}>Profile</Text>
                    </View>
                </View>
            </View>

            <Modal visible={logoutModalVisible} transparent animationType="none">
                <Animated.View
                    style={[
                        styles.modalBackdrop,
                        { opacity: modalAnim },
                    ]}
                >
                    <Pressable
                        style={StyleSheet.absoluteFill}
                        onPress={closeLogoutModal}
                    />

                    <Animated.View
                        style={[
                            styles.modalCard,
                            {
                                transform: [{ scale: modalScale }],
                                opacity: modalAnim,
                            },
                        ]}
                    >
                        <View style={styles.modalIconWrap}>
                            <Ionicons
                                name="log-out-outline"
                                size={28}
                                color={BLUE}
                            />
                        </View>

                        <Text style={styles.modalTitle}>Sign Out?</Text>

                        <Text style={styles.modalBody}>
                            You'll be returned to the login screen. Any unsaved
                            progress will be lost.
                        </Text>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={closeLogoutModal}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.cancelBtnText}>
                                    Stay
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.confirmBtn}
                                onPress={confirmLogout}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.confirmBtnText}>
                                    Sign Out
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </Animated.View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: WHITE,
        borderTopWidth: 1,
        borderTopColor: "#F1F5F9",
        shadowColor: BLACK,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 12,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
    },
    bar: {
        flexDirection: "row",
        paddingTop: 10,
        paddingHorizontal: 8,
    },
    tabItem: {
        flex: 1,
        alignItems: "center",
        gap: 4,
        position: "relative",
    },
    iconWrap: {
        width: 44,
        height: 36,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    iconWrapActive: {
        backgroundColor: BLUE_LIGHT,
    },
    tabLabel: {
        fontSize: 10,
        fontWeight: "500",
        color: GREY,
        letterSpacing: 0.3,
    },
    tabLabelActive: {
        color: BLUE,
        fontWeight: "700",
    },
    avatar: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: BLUE,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: BLUE,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
    },
    avatarText: {
        color: WHITE,
        fontSize: 11,
        fontWeight: "800",
        letterSpacing: 0.5,
    },
    avatarOnline: {
        position: "absolute",
        bottom: 1,
        right: 1,
        width: 9,
        height: 9,
        borderRadius: 5,
        backgroundColor: "#22C55E",
        borderWidth: 1.5,
        borderColor: WHITE,
    },
    menuOverlay: {
        position: "absolute",
        top: -1000,
        left: -1000,
        right: -1000,
        bottom: -1000,
        zIndex: 10,
    },
    avatarMenu: {
        position: "absolute",
        bottom: 58,
        right: 8,
        width: 230,
        zIndex: 20,
    },
    menuArrow: {
        width: 12,
        height: 12,
        backgroundColor: WHITE,
        transform: [{ rotate: "45deg" }],
        alignSelf: "flex-end",
        marginRight: 22,
        marginBottom: -6,
        shadowColor: BLACK,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        borderTopLeftRadius: 2,
    },
    menuContent: {
        backgroundColor: WHITE,
        borderRadius: 14,
        overflow: "hidden",
        shadowColor: BLACK,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 16,
        borderWidth: 1,
        borderColor: "#F1F5F9",
    },
    menuUserRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 14,
        paddingVertical: 14,
    },
    menuAvatarSmall: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: BLUE,
        alignItems: "center",
        justifyContent: "center",
    },
    menuAvatarText: {
        color: WHITE,
        fontSize: 9,
        fontWeight: "800",
        letterSpacing: 0.4,
    },
    menuName: {
        fontSize: 13,
        fontWeight: "700",
        color: BLACK,
    },
    menuRole: {
        fontSize: 11,
        color: GREY,
        fontWeight: "400",
    },
    menuDivider: {
        height: 1,
        backgroundColor: "#F1F5F9",
    },
    logoutBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 14,
        paddingVertical: 13,
    },
    logoutBtnText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#EF4444",
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: "rgba(15,23,42,0.45)",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 28,
    },
    modalCard: {
        backgroundColor: WHITE,
        borderRadius: 20,
        padding: 28,
        width: "100%",
        alignItems: "center",
        shadowColor: BLACK,
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.18,
        shadowRadius: 32,
        elevation: 20,
    },
    modalIconWrap: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: BLUE_LIGHT,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 18,
        borderWidth: 1.5,
        borderColor: BLUE_MID,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: BLACK,
        marginBottom: 10,
        letterSpacing: -0.4,
    },
    modalBody: {
        fontSize: 13,
        color: GREY,
        textAlign: "center",
        lineHeight: 20,
        marginBottom: 26,
        fontWeight: "400",
    },
    modalActions: {
        flexDirection: "row",
        gap: 10,
        width: "100%",
    },
    cancelBtn: {
        flex: 1,
        paddingVertical: 13,
        borderRadius: 12,
        alignItems: "center",
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    cancelBtnText: {
        fontSize: 14,
        fontWeight: "700",
        color: BLACK,
    },
    confirmBtn: {
        flex: 1,
        paddingVertical: 13,
        borderRadius: 12,
        alignItems: "center",
        backgroundColor: BLUE,
        shadowColor: BLUE,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    confirmBtnText: {
        fontSize: 14,
        fontWeight: "700",
        color: WHITE,
    },
});