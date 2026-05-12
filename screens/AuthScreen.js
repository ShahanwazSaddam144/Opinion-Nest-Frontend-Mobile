import {View, Text, StyleSheet} from "react-native";
import { StatusBar } from "react-native";

export default function AuthScreen(){
    return(
        <>
        <View style={styles.container}>
            <Text>Auth Screen</Text>
            <StatusBar style="dark" />
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: "center",
        alignItems: "center"
    }
});