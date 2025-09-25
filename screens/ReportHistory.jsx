import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/color';
import { useNavigation } from '@react-navigation/native';

const ReportHistory = () => {
  const navigation = useNavigation();

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
          onPress: () => navigation.navigate('Auth'),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.primary || '#FF9500'}
        translucent={false}
        hidden={false}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report History</Text>
        <View style={styles.headerRightContainer}>
          <TouchableOpacity 
            style={styles.logoutHeaderButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.homeButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Ionicons name="home-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Empty State */}
        <View style={styles.emptyState}>
          <Ionicons 
            name="document-text-outline" 
            size={80} 
            color={colors.textSecondary || '#8E8E93'} 
          />
          <Text style={styles.emptyTitle}>No Reports Yet</Text>
          <Text style={styles.emptySubtitle}>
            Your safety observation reports will appear here after you submit them.
          </Text>
          
          <TouchableOpacity 
            style={styles.createFirstReportButton}
            onPress={() => navigation.navigate('StopCard')}
          >
            <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.createFirstReportText}>Create Your First Report</Text>
          </TouchableOpacity>
        </View>

        {/* Future: Report List Will Go Here */}
        <View style={styles.futureFeatureSection}>
          <Text style={styles.futureTitle}>Coming Soon</Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
              <Text style={styles.featureText}>Search and filter reports</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
              <Text style={styles.featureText}>Export reports to PDF</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
              <Text style={styles.featureText}>Analytics and trends</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
              <Text style={styles.featureText}>Share reports with team</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || '#F8F9FA',
  },
  header: {
    backgroundColor: colors.primary || '#FF9500',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1,
  },
  homeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  logoutHeaderButton: {
    padding: 6,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  content: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text || '#1C1C1E',
    marginTop: 20,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary || '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 30,
  },
  createFirstReportButton: {
    backgroundColor: colors.primary || '#FF9500',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    gap: 8,
  },
  createFirstReportText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  futureFeatureSection: {
    margin: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  futureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text || '#1C1C1E',
    marginBottom: 15,
    textAlign: 'center',
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 15,
    color: colors.text || '#1C1C1E',
    flex: 1,
  },
});

export default ReportHistory;