# 🔥 Firebase API Key Setup Instructions

## The Issue
You're getting an "auth/api-key-not-valid" error because the Firebase API key needs to be configured specifically for web applications.

## 🛠️ How to Fix This

### Step 1: Go to Firebase Console
1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `firebaseauth-f1763`

### Step 2: Create Web App (if not exists)
1. Click on the **Settings gear icon** → **Project Settings**
2. Scroll down to **"Your apps"** section
3. If you don't see a **Web app**, click **"Add app"** → **Web**
4. Register your app:
   - App nickname: `SafetyPlus Web`
   - Check **"Also set up Firebase Hosting"** (optional)
   - Click **Register app**

### Step 3: Get Web Configuration
1. In Project Settings → **Your apps** → Web app
2. Click **"Config"** or the **settings icon**
3. Copy the **firebaseConfig** object
4. You'll see something like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...", // This is the WEB API key you need
  authDomain: "firebaseauth-f1763.firebaseapp.com",
  projectId: "firebaseauth-f1763",
  storageBucket: "firebaseauth-f1763.appspot.com",
  messagingSenderId: "334568068932",
  appId: "1:334568068932:web:...", // This will be different
  measurementId: "G-..."
};
```

### Step 4: Update firebase-web.js
Replace the `firebaseConfig` in `web-static/firebase-web.js` with the new configuration from Step 3.

### Step 5: Enable Authentication Methods
1. In Firebase Console → **Authentication** → **Sign-in method**
2. Make sure **Email/Password** is enabled
3. Add your domain to **Authorized domains** if needed:
   - For local testing: `localhost`
   - For production: your actual domain

## 🚀 Quick Test
After updating the API key:
1. Refresh your web browser
2. Try creating a new account
3. The authentication should work properly

## 📱 Alternative: Use Existing Mobile API Key (Temporary)
If you want to test quickly, you can try using your mobile app's API key, but this is not recommended for production:

1. Open your mobile app's Firebase configuration
2. Look for the API key used in your React Native app
3. Replace it in `firebase-web.js` temporarily

## 🔍 Troubleshooting
- **Still getting API key errors?** Make sure you're using the Web app config, not Android/iOS
- **CORS errors?** Add your domain to Firebase authorized domains
- **Firestore access denied?** Check your Firestore security rules

The main issue is that each platform (Web, Android, iOS) has its own API key in Firebase projects.