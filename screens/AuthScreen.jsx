import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/color';
import { useNavigation } from '@react-navigation/native';

const AuthScreen = () => {
  const navigation = useNavigation();
  const [isLogin, setIsLogin] = useState(true); // Start with login mode
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyId: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation (required for both login and signup)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation (required for both login and signup)
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isLogin && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Signup-only validations
    if (!isLogin) {
      // Name validation
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }

      // Confirm password validation
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      // Company ID validation
      const companyIdRegex = /^3[0-9]{4}$/;
      if (!formData.companyId) {
        newErrors.companyId = 'Company ID is required';
      } else if (!companyIdRegex.test(formData.companyId)) {
        newErrors.companyId = 'Company ID must be 5 digits starting with 3 (e.g., 31234)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (validateForm()) {
      // Dummy login - navigate directly to home
      navigation.navigate('Home');
    }
  };

  const handleSignup = () => {
    if (validateForm()) {
      // Dummy signup - navigate to home
      Alert.alert(
        'Success!',
        `Welcome ${formData.name}! Your account has been created.`,
        [
          {
            text: 'Continue',
            onPress: () => navigation.navigate('Home')
          }
        ]
      );
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    // Clear form data when switching modes
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      companyId: '',
    });
  };

  const formatCompanyId = (text) => {
    // Remove non-numeric characters and limit to 5 digits
    const numeric = text.replace(/[^0-9]/g, '');
    return numeric.slice(0, 5);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.primary || '#FF9500'}
        translucent={false}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons 
            name="shield-checkmark" 
            size={50} 
            color="#FFFFFF" 
          />
          <Text style={styles.appTitle}>Safety Plus</Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Welcome Back' : 'Create Your Account'}
          </Text>
        </View>

        {/* Auth Form */}
        <View style={styles.formContainer}>
          
          {/* Name Input - Only for Signup */}
          {!isLogin && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={[styles.inputContainer, errors.name && styles.inputError]}>
                <Ionicons name="person-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={formData.name}
                  onChangeText={(text) => updateFormData('name', text)}
                  placeholder="Enter your full name"
                  autoCapitalize="words"
                  autoComplete="name"
                />
              </View>
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>
          )}

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={[styles.inputContainer, errors.email && styles.inputError]}>
              <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={formData.email}
                onChangeText={(text) => updateFormData('email', text.toLowerCase())}
                placeholder="Enter your email address"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={[styles.inputContainer, errors.password && styles.inputError]}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={formData.password}
                onChangeText={(text) => updateFormData('password', text)}
                placeholder="Enter password (min 6 characters)"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons 
                  name={showPassword ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          {/* Confirm Password Input - Only for Signup */}
          {!isLogin && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={[styles.inputContainer, errors.confirmPassword && styles.inputError]}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={formData.confirmPassword}
                  onChangeText={(text) => updateFormData('confirmPassword', text)}
                  placeholder="Confirm your password"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons 
                    name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color={colors.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>
          )}

          {/* Company ID Input - Only for Signup */}
          {!isLogin && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Company ID</Text>
              <View style={[styles.inputContainer, errors.companyId && styles.inputError]}>
                <Ionicons name="business-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={formData.companyId}
                  onChangeText={(text) => updateFormData('companyId', formatCompanyId(text))}
                  placeholder="3XXXX (e.g., 31234)"
                  keyboardType="number-pad"
                  maxLength={5}
                />
              </View>
              {errors.companyId && <Text style={styles.errorText}>{errors.companyId}</Text>}
              <Text style={styles.helpText}>5-digit ID starting with 3</Text>
            </View>
          )}

          {/* Auth Button */}
          <TouchableOpacity 
            style={styles.authButton}
            onPress={isLogin ? handleLogin : handleSignup}
            activeOpacity={0.8}
          >
            <Text style={styles.authButtonText}>
              {isLogin ? 'Sign In' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          {/* Toggle Auth Mode */}
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </Text>
            <TouchableOpacity onPress={toggleAuthMode}>
              <Text style={styles.toggleLink}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          {!isLogin && (
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                By signing up, you agree to our Terms of Service and Privacy Policy
              </Text>
            </View>
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary || '#FF9500',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 25,
    backgroundColor: colors.primary || '#FF9500',
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 15,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 5,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text || '#1C1C1E',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border || '#D1D1D6',
    borderRadius: 10,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 15,
    minHeight: 50,
  },
  inputError: {
    borderColor: colors.error || '#FF3B30',
    backgroundColor: '#FFF5F5',
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text || '#1C1C1E',
    paddingVertical: 12,
  },
  eyeIcon: {
    padding: 5,
  },
  errorText: {
    fontSize: 14,
    color: colors.error || '#FF3B30',
    marginTop: 5,
    marginLeft: 5,
  },
  helpText: {
    fontSize: 12,
    color: colors.textSecondary || '#8E8E93',
    marginTop: 5,
    marginLeft: 5,
  },
  authButton: {
    backgroundColor: colors.primary || '#FF9500',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  authButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 10,
  },
  toggleText: {
    fontSize: 14,
    color: colors.textSecondary || '#8E8E93',
  },
  toggleLink: {
    fontSize: 14,
    color: colors.primary || '#FF9500',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary || '#8E8E93',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
});

export default AuthScreen;