import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StopCard from './screens/StopCard';
import HomeScreen from './screens/HomeScreen';
import { setAuthenticated } from './store/authSlice'
import { logout, saveUser } from './store/authSlice';

import ReportHistory from './screens/ReportHistory';
import AuthScreen from './screens/AuthScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { useDispatch } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import store from './store/store';
import { useState, useEffect } from 'react'
import { colors } from './constants/color'
import { getUser, removeUser } from "./helper/authStorage";
import { StyleSheet, View ,ActivityIndicator } from 'react-native';
import { Provider, useSelector } from 'react-redux';
// import { setAuthenticated } from './store/authSlice'
const Stack = createStackNavigator();

export function RootStack() {
  
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    checkLoginStatus();
  }, []);
 

  const checkLoginStatus = async () => {
    try {
      // const userToken = await AsyncStorage.getItem('userToken');
      // const userData = await AsyncStorage.getItem('userData');
      const user = await getUser();

      if (user) {
        dispatch(setAuthenticated(true)); // ✅ Dispatch to Redux once
        dispatch(saveUser(user))
        setIsLoggedIn(true);
      } else {
        dispatch(setAuthenticated(false));
      }
    } catch (error) {
       dispatch(setAuthenticated(false));
    } finally {
        // setTimeout(() => {
        setIsLoading(false);
      // }, 500);
    }
  };
    useEffect(() => {
    // Auth state monitoring for development
  }, [isAuthenticated, user]);
  if (isLoading) {
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary || '#FF9500'} />
        </View>
      </SafeAreaProvider>
    );
  }


  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? "Home" : "Auth"}
      // initialRouteName={isLoggedIn ? "Home" : "Auth"}
      screenOptions={{
        headerShown: false, // Hide header by default
        animation: 'slide_from_right',
      }}
    >
{!isAuthenticated ? (
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{
            title: 'Sign Up',
            headerShown: false
          }}
        />
      ) : (
        <>
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
      </>)}
    </Stack.Navigator>
  )
}


export default function App() {


  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <Provider store={store}>
          <NavigationContainer>
            <RootStack/>

          </NavigationContainer>
        </Provider>

      </SafeAreaProvider >
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});
