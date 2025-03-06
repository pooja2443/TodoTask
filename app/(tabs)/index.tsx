import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler'; 
import FirstScreen from "@/Screens/FirstScreen";
import SecondScreen from "@/Screens/SecondScreen";
import AddTask from "@/Screens/AddTasks"; 

type RootStackParamList = {
  Home: undefined;
  About: { userEmail: string; isDarkMode: boolean };
  AddTask: { isDarkMode: boolean };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App(){
  return(
    <SafeAreaProvider>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={FirstScreen} options={{headerShown: false}}/>
          <Stack.Screen name="About" component={SecondScreen} options={{headerShown: false}}/>
          <Stack.Screen name="AddTask" component={AddTask} options={{headerShown: false}}/> 
        </Stack.Navigator>
    </SafeAreaProvider>
  )
}