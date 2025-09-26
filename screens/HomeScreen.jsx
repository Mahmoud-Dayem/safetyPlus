import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, removeUser } from "../helper/authStorage";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/color';
import { useNavigation } from '@react-navigation/native';
import { logout, saveUser } from '../store/authSlice';

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const name = user?.displayName;
  const id = user?.companyId;


  const navigateToStopCard = () => {
    navigation.navigate('StopCard');
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout? You will need to sign in again.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear AsyncStorage
              dispatch(logout());
              await removeUser();

              // Navigate to Auth screen and reset stack
              navigation.reset({
                index: 0,
                routes: [{ name: 'Auth' }],
              });
            } catch (error) {
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor= '#FF9500' 
        translucent={false}
        hidden={false}
      />
      {/* <StatusBar
        barStyle="light-content"
        backgroundColor={colors.primary || '#FF9500'}
        translucent={false}
        hidden={false}
      /> */}

      <View style={styles.content}>
        <View style={styles.headerSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.primary || '#FF9500'} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          {/* Compact User Info */}
          <View style={styles.compactUserInfo}>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.userNameCompact}>{name}</Text>
            <Text style={styles.companyIdCompact}>ID: {id}</Text>
          </View>

          <Ionicons
            name="shield-checkmark"
            size={70}
            color={colors.primary || '#FF9500'}
          />
          <Text style={styles.appTitle}>Safety Plus</Text>
          <Text style={styles.subtitle}>Workplace Safety Management</Text>
        </View>

        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={styles.stopCardButton}
            onPress={navigateToStopCard}
            activeOpacity={0.8}
          >
            <Ionicons
              name="clipboard-outline"
              size={28}
              color="#FFFFFF"
              style={styles.buttonIcon}
            />
            <View style={styles.buttonTextContainer}>
              <Text style={styles.buttonTitle}>Start STOP Card</Text>
              <Text style={styles.buttonSubtitle}>Safety Task Observation Program</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.reportsButton}
            onPress={() => navigation.navigate('ReportHistory')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="document-text-outline"
              size={28}
              color={colors.primary || '#FF9500'}
              style={styles.buttonIcon}
            />
            <View style={styles.buttonTextContainer}>
              <Text style={styles.reportsButtonTitle}>View Report History</Text>
              <Text style={styles.reportsButtonSubtitle}>Review past safety observations</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={colors.primary || '#FF9500'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.footerSection}>
          <Text style={styles.footerText}>
            Conduct safety observations and generate reports
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 60,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text || '#1C1C1E',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary || '#8E8E93',
    marginTop: 8,
    textAlign: 'center',
  },
  buttonSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopCardButton: {
    backgroundColor: colors.primary || '#FF9500',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    width: '100%',
    maxWidth: 320,
  },
  buttonIcon: {
    marginRight: 16,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  buttonSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  footerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary || '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
  logoutButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: colors.primary || '#FF9500',
    gap: 6,
  },
  logoutText: {
    fontSize: 14,
    color: colors.primary || '#FF9500',
    fontWeight: '600',
  },
  reportsButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginTop: 15,
    borderWidth: 2,
    borderColor: colors.primary || '#FF9500',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    width: '100%',
    maxWidth: 320,
  },
  reportsButtonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary || '#FF9500',
  },
  reportsButtonSubtitle: {
    fontSize: 14,
    color: colors.textSecondary || '#8E8E93',
    marginTop: 2,
  },
  compactUserInfo: {
    alignItems: 'center',
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 16,
    color: colors.textSecondary || '#8E8E93',
    marginBottom: 4,
  },
  userNameCompact: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text || '#1C1C1E',
    marginBottom: 2,
  },
  companyIdCompact: {
    fontSize: 14,
    color: colors.primary || '#FF9500',
    fontWeight: '600',
    backgroundColor: '#FFF3E6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
});

export default HomeScreen;