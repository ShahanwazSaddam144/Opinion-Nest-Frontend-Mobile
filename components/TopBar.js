import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TopBar() {

    const handleOpenWeb = async () => {
        await Linking.openURL("https://opinion-nest.buttnetworks.com/");
    };

    return (
        <>
            <View style={styles.topContainer}>
                <TouchableOpacity
                    style={styles.webButton}
                    activeOpacity={0.8}
                    onPress={handleOpenWeb}
                >
                    <Ionicons
                        name="globe-outline"
                        size={18}
                        color="#2563eb"
                    />

                    <Text style={styles.TopText}>Web</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    topContainer: {
        marginTop: 25,
        width: "100%",
        alignItems: "flex-end",
        paddingHorizontal: 20,
    },

    webButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#eff6ff",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 14,
    },

    TopText: {
        color: "#2563eb",
        fontWeight: "700",
        fontSize: 14,
    },
});