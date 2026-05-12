import { View, Text, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function WelcomeScreen(){
    return(
        <>
        <View style={styles.container}>
            <Text>WelcomeScreen</Text>
            <StatusBar style="dark"/>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})