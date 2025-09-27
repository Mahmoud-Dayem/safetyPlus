# SafetyPlus App - Crash Troubleshooting Guide

## 🚨 App Crash During Start - Troubleshooting Steps

### Common Causes for App Crashes After Build:

1. **Environment Variables Missing in Build**
2. **Firebase Configuration Issues**
3. **AsyncStorage Native Module Issues** 
4. **Missing Native Dependencies**
5. **React Native Version Compatibility**

---

## 🔧 Step-by-Step Fix Instructions

### Step 1: Check Environment Variables in EAS Build
The environment variables might not be available in the built APK.

**Fix:** Add secrets to EAS:
```bash
# Push your environment secrets to EAS
eas secret:push

# Or manually add them:
eas secret:create --scope project --name FIREBASE_API_KEY --value "your-api-key"
eas secret:create --scope project --name FIREBASE_AUTH_DOMAIN --value "your-auth-domain"
# ... (add all other Firebase config variables)
```

### Step 2: Add Error Boundary to Catch Crashes
Add error handling to see what's causing the crash.

**Create:** `components/ErrorBoundary.jsx`

### Step 3: Update Firebase Configuration
Add fallback values for missing environment variables.

### Step 4: Check AsyncStorage Configuration
Make sure AsyncStorage is properly configured for standalone builds.

### Step 5: Update App Config for Build Issues
Add specific plugins and configurations for standalone builds.

---

## 🔍 Debugging Commands

```bash
# Check if environment variables are loaded
npx expo start --clear
# Then check in your app if Constants.expoConfig.extra has values

# Check EAS secrets
eas secret:list --profile preview

# Build with verbose logging
eas build -p android --profile preview --verbose

# Check app logs (if you can get device logs)
adb logcat | grep -i "expo\|react\|firebase"
```

---

## 🛠️ Quick Fixes to Try

### Fix 1: Add Error Boundary
### Fix 2: Update Firebase Config with Fallbacks  
### Fix 3: Add AsyncStorage Plugin
### Fix 4: Update EAS Build Profile
### Fix 5: Add Missing Native Dependencies

---

## ⚡ Immediate Actions

1. **Add error boundary to catch crash details**
2. **Update Firebase config with fallbacks**
3. **Check environment variables are pushed to EAS**
4. **Rebuild with latest configuration**