# SafetyPlus - EAS Build Guide

## 🏗️ **Pre-Build Setup**

### **1. Environment Variables**
Copy `.env.example` to `.env` and fill in your actual values:
```bash
cp .env.example .env
```

Required environment variables:
- `GOOGLE_SHEETS_URL` - Your Google Apps Script web app URL
- `FIREBASE_*` - Firebase configuration values
- Other API keys as needed

### **2. Install EAS CLI**
```bash
npm install -g @expo/eas-cli
```

### **3. Login to Expo**
```bash
eas login
```

## 📱 **Build Commands**

### **Development Build**
```bash
# For development testing
eas build --profile development --platform android
eas build --profile development --platform ios
```

### **Preview Build (APK)**
```bash
# For internal testing (Android APK)
eas build --profile preview --platform android
```

### **Production Build**
```bash
# For app store submission
eas build --profile production --platform android
eas build --profile production --platform ios
```

### **Build for Both Platforms**
```bash
eas build --profile production --platform all
```

## 🚀 **Build Configurations**

### **Development**
- Internal distribution
- Development client enabled
- For testing new features

### **Preview**  
- Internal distribution
- APK format (Android)
- For stakeholder reviews

### **Production**
- App store ready
- Optimized bundle size
- ProGuard enabled (Android)
- Release configuration (iOS)

## 📋 **Pre-Build Checklist**

- ✅ All console.log statements removed
- ✅ Environment variables configured
- ✅ App icons and splash screens ready
- ✅ Bundle identifiers set
- ✅ Version numbers updated
- ✅ Firebase configuration complete
- ✅ Google Sheets integration tested
- ✅ All features working in development

## 🔧 **Build Optimization Features**

- **ProGuard**: Enabled for Android release builds
- **Resource Shrinking**: Removes unused resources
- **Bundle Format**: AAB for Google Play Store
- **Tree Shaking**: Removes unused code
- **Minification**: Reduces bundle size

## 📄 **Build Artifacts**

After successful build:
- **Android**: `.aab` (App Bundle) or `.apk` file
- **iOS**: `.ipa` file ready for App Store Connect

## 🚨 **Common Issues & Solutions**

### **Build Fails**
1. Check environment variables are set
2. Ensure all dependencies are installed
3. Verify app.config.js syntax
4. Check EAS project configuration

### **Size Optimization**
1. Remove unused assets
2. Optimize image sizes
3. Enable ProGuard/R8 (Android)
4. Use dynamic imports where possible

## 📱 **Testing Built App**

### **Internal Distribution**
```bash
# Install on device via Expo
eas build:run --profile preview --platform android
```

### **Local Testing**
```bash
# Run development build locally
npx expo start --dev-client
```

## 🚀 **Deployment**

### **Google Play Store**
1. Upload `.aab` file to Play Console
2. Complete store listing
3. Set up app signing
4. Submit for review

### **Apple App Store**  
1. Upload `.ipa` to App Store Connect
2. Complete app metadata
3. Submit for review

Your SafetyPlus app is now ready for professional deployment! 🎉