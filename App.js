import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StopCard from './screens/StopCard';
import HomeScreen from './screens/HomeScreen';
import ReportHistory from './screens/ReportHistory';
import AuthScreen from './screens/AuthScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
const Stack = createStackNavigator();
import { StyleSheet } from 'react-native';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>

        <Stack.Navigator
          initialRouteName="Auth"
          screenOptions={{
            headerShown: false, // Hide header by default
          }}
        >
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{ 
              title: 'Sign Up',
              headerShown: false 
            }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ 
              title: 'Safety Plus',
              headerShown: false 
            }}
          />
          <Stack.Screen
            name="StopCard"
            component={StopCard}
            options={{ 
              title: 'STOP Card',
              headerShown: true 
            }}
          />
          <Stack.Screen
            name="ReportHistory"
            component={ReportHistory}
            options={{ 
              title: 'Report History',
              headerShown: false 
            }}
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
