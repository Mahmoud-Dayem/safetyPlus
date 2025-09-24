import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import StopCard from './screens/StopCard';
import { SafeAreaProvider } from 'react-native-safe-area-context';
const Stack = createStackNavigator();
import { StyleSheet } from 'react-native';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <NavigationContainer>

        <Stack.Navigator
          initialRouteName="StopCard"
          screenOptions={{
            headerShown: true, // Show header to display the title
          }}
        >
          <Stack.Screen
            name="StopCard"
            component={StopCard}
            options={{ title: 'STOP Card' }}
          />
        </Stack.Navigator>
      </NavigationContainer>


    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
