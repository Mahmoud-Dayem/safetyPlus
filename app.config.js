import 'dotenv/config';

export default {
    expo: {
        name: "SafetyPlus",
        slug: "safetyplus-app",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/adaptive-icon.png",
        userInterfaceStyle: "light",
        newArchEnabled: true,
        scheme: "safetyplus",
        splash: {
            image: "./assets/splash-icon-new.png",
            resizeMode: "cover",
            backgroundColor: "#ffffff"
        },
        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.safetyplus.app",
            buildNumber: "1",
            icon: "./assets/adaptive-icon",
        },
        android: {
             
            adaptiveIcon: {
                foregroundImage: "./assets/adaptive-icon",
                backgroundColor: "#ffffff"
            },
            package: "com.safetyplus.app",
            versionCode: 1,
            edgeToEdgeEnabled: true
        },
        web: {
            favicon: "./assets/adaptive-icon.png"
        },
        plugins: [
            "expo-font",
            [
                "expo-build-properties",
                {
                    android: {
                        enableProguardInReleaseBuilds: true,
                        enableShrinkResourcesInReleaseBuilds: true
                    }
                }
            ]
        ],
        extra: {
             eas : {
                 projectId : "18af1a55-bfd0-4a6c-bfc4-a7b373329e56"
            },
            // These will be available in your app via expo-constants
            googleSheetsUrl: process.env.GOOGLE_SHEETS_URL,
            apiBaseUrl: process.env.API_BASE_URL,
            nodeEnv: process.env.NODE_ENV,
            firebaseApiKey: process.env.FIREBASE_API_KEY,
            firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
            firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
            firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
            firebaseAppId: process.env.FIREBASE_APP_ID,
        }
    }
};