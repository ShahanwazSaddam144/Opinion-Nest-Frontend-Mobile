import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from "react-native-safe-area-context";

import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';
import AuthScreen from './screens/AuthScreen';
import ChatHistoryScreen from './screens/ChatHistoryScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen}/>
        <Stack.Screen name="HomeScreen" component={HomeScreen}/>
        <Stack.Screen name="AuthScreen" component={AuthScreen}/>
        <Stack.Screen name="ChatHistoryScreen" component={ChatHistoryScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
  );
}