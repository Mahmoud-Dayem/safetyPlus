// Firebase Web Configuration for SafetyPlus Static App

// Import Firebase modules using CDN (to be included in HTML)
// These will be available as global variables after including Firebase CDN scripts

// Firebase configuration - Updated with correct web app config
const firebaseConfig = {
    apiKey: "AIzaSyAArZ8v8W6SmWzUUbJbdhZfxRHfzUUBDnw",
    authDomain: "safetyplusapp-8f368.firebaseapp.com",
    projectId: "safetyplusapp-8f368",
    storageBucket: "safetyplusapp-8f368.firebasestorage.app",
    messagingSenderId: "1065215663549",
    appId: "1:1065215663549:web:7d5c0833a31a1c3c17c6d4"
};

// Initialize Firebase
let app, auth, db;

function initializeFirebase() {
    try {
        // Check if Firebase is loaded
        if (typeof firebase === 'undefined') {
            console.error('Firebase SDK not loaded. Make sure Firebase CDN scripts are included.');
            return false;
        }
        
        console.log('Initializing Firebase with config:', {
            ...firebaseConfig,
            apiKey: firebaseConfig.apiKey.substring(0, 10) + '...' // Hide full API key in logs
        });
        
        // Initialize Firebase app
        app = firebase.initializeApp(firebaseConfig);
        
        // Initialize Firebase services
        auth = firebase.auth();
        db = firebase.firestore();
        
        // Use the newer cache configuration instead of deprecated enablePersistence
        try {
            // Use the newer enablePersistence without synchronizeTabs for single tab
            db.enablePersistence().catch((err) => {
                if (err.code === 'failed-precondition') {
                    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
                } else if (err.code === 'unimplemented') {
                    console.warn('The current browser does not support all of the features required to enable persistence');
                } else {
                    console.warn('Error enabling persistence:', err);
                }
            });
        } catch (persistenceError) {
            console.warn('Persistence not available:', persistenceError);
        }
        
        console.log('Firebase initialized successfully');
        console.log('Firebase Auth:', !!auth);
        console.log('Firebase Firestore:', !!db);
        
        return true;
    } catch (error) {
        console.error('Error initializing Firebase:', error);
        console.error('This might be due to:');
        console.error('1. Invalid API key - you may need to create a Web app in Firebase Console');
        console.error('2. Firebase CDN scripts not loaded properly');
        console.error('3. Network connectivity issues');
        return false;
    }
}

// Authentication Functions
async function signupWithFirebase(email, password, displayName, companyId = 'default') {
    try {
        // Create user account
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Update user profile
        await user.updateProfile({
            displayName: displayName
        });
        
        // Create user document in Firestore
        await db.collection('users').doc(user.uid).set({
            uid: user.uid,
            email: email,
            displayName: displayName,
            companyId: companyId,
            createdAt: new Date().toISOString(),
            isAdmin: false,
            isPrivileged: false
        });
        
        return {
            success: true,
            user: user,
            message: 'Account created successfully'
        };
    } catch (error) {
        console.error('Signup error:', error);
        return {
            success: false,
            error: error.code,
            message: getFirebaseErrorMessage(error.code)
        };
    }
}

async function signinWithFirebase(email, password) {
    try {
        if (!auth) {
            throw new Error('Firebase Auth not initialized. Please check Firebase configuration.');
        }
        
        console.log('Attempting to sign in user:', email);
        
        // Sign in user
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        console.log('Sign in successful, getting user data from Firestore...');
        
        // Get user data from Firestore
        let userData = {};
        try {
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                userData = userDoc.data();
            }
        } catch (firestoreError) {
            console.warn('Could not fetch user data from Firestore:', firestoreError);
            // Continue without user data - authentication still worked
        }
        
        return {
            success: true,
            user: user,
            userData: userData,
            message: 'Signed in successfully'
        };
    } catch (error) {
        console.error('Signin error:', error);
        
        // Special handling for API key errors
        if (error.code === 'auth/api-key-not-valid' || error.code === 'auth/invalid-api-key') {
            console.error('API Key Error - Please check FIREBASE_SETUP.md for instructions');
        }
        
        return {
            success: false,
            error: error.code,
            message: getFirebaseErrorMessage(error.code)
        };
    }
}

async function signoutFromFirebase() {
    try {
        await auth.signOut();
        return {
            success: true,
            message: 'Signed out successfully'
        };
    } catch (error) {
        console.error('Signout error:', error);
        return {
            success: false,
            error: error.code,
            message: error.message
        };
    }
}

// Firestore Functions
async function saveStopCardToFirestore(stopCardData) {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }
        
        // Get user data for companyId (tolerate permission errors)
        let companyId = 'default';
        try {
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                companyId = userDoc.data().companyId || 'default';
            }
        } catch (profileErr) {
            console.warn('Could not read user profile for companyId (continuing with default):', profileErr?.message || profileErr);
        }
        
        // Generate report ID
        const reportId = 'WEB_' + Date.now();
        
        // Calculate completion rates
        const totalActions = Object.keys(stopCardData.actions || {}).length;
        const completedActions = Object.values(stopCardData.actions || {}).filter(Boolean).length;
        const actionsCompletion = totalActions > 0 ? (completedActions / totalActions * 100).toFixed(1) : 0;
        
        const totalConditions = Object.keys(stopCardData.conditions || {}).length;
        const completedConditions = Object.values(stopCardData.conditions || {}).filter(Boolean).length;
        const conditionsCompletion = totalConditions > 0 ? (completedConditions / totalConditions * 100).toFixed(1) : 0;
        
        // Prepare document data using mobile app schema
        const reportData = {
            // Basic Info
            reportId: reportId,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            submittedAt: new Date().toISOString(),
            
            // User Info (matching mobile app structure)
            userInfo: {
                email: user.email || 'unknown@company.com',
                displayName: user.displayName || user.email || 'Unknown User',
                companyId: companyId || 'default',
                uid: user.uid || 'unknown'
            },
            
            // Report Form Data
            siteInfo: {
                site: stopCardData.report?.site || '',
                area: stopCardData.report?.area || '',
                date: stopCardData.report?.date || new Date().toISOString(),
                shift: 'General'
            },
            
            // Observation Data
            observationData: {
                durationMinutes: stopCardData.report?.duration || 30,
                peopleConducted: stopCardData.report?.peopleConducted || 1,
                peopleObserved: stopCardData.report?.peopleObserved || 1
            },
            
            // Safety Acts
            safetyActs: {
                safeActsCount: completedActions,
                safeActsList: [], // Web app doesn't have detailed safe acts list
                unsafeActsCount: 0,
                unsafeActsList: []
            },
            
            // Completion Rates
            completionRates: {
                actionsCompletion: parseFloat(actionsCompletion),
                conditionsCompletion: parseFloat(conditionsCompletion)
            },
            
            // Detailed Assessment Data (matching mobile structure)
            assessmentData: {
                actions: Object.entries(stopCardData.actions || {}).map(([key, value]) => ({
                    category: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    questions: [{
                        question: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                        status: Boolean(value)
                    }]
                })),
                conditions: Object.entries(stopCardData.conditions || {}).map(([key, value]) => ({
                    category: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    questions: [{
                        question: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                        status: Boolean(value)
                    }]
                }))
            },
            
            // User Feedback
            feedback: {
                suggestions: stopCardData.report?.suggestions || ''
            },
            
            // Metadata
            metadata: {
                appVersion: '1.0.0',
                platform: 'web',
                submissionMethod: 'stopcard_form'
            }
        };
        
        console.log('Saving with mobile-compatible schema:', reportData);
        
        // Save to Firestore
        const docRef = await db.collection('stopCardReports').add(reportData);
        
        return {
            success: true,
            reportId: docRef.id,
            message: 'STOP Card saved successfully'
        };
    } catch (error) {
        console.error('Error saving STOP card:', error);
        return {
            success: false,
            error: error.message,
            message: 'Failed to save STOP Card'
        };
    }
}

async function getStopCardsFromFirestore() {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }
        
        console.log('Querying Firestore for user:', user.uid);
        console.log('User email:', user.email);
        
        // Query user's STOP cards using mobile app schema structure
        // Mobile app stores userId in userInfo.uid field
        const query = db.collection('stopCardReports')
            .where('userInfo.uid', '==', user.uid);
        
        console.log('Executing Firestore query for userInfo.uid:', user.uid);
        const querySnapshot = await query.get();
        console.log('Query completed, doc count:', querySnapshot.size);
        const reports = [];
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log('Found report:', doc.id, data);
            reports.push({
                id: doc.id,
                ...data,
                // Convert Firestore timestamp to JavaScript Date for compatibility
                submissionDate: data.timestamp?.toDate() || new Date(data.submittedAt),
                // Extract key fields for display
                site: data.siteInfo?.site || 'Unknown Site',
                area: data.siteInfo?.area || 'Unknown Area',
                actionsCompletion: data.completionRates?.actionsCompletion || 0,
                conditionsCompletion: data.completionRates?.conditionsCompletion || 0,
                suggestions: data.feedback?.suggestions || '',
                userName: data.userInfo?.displayName || 'Unknown User'
            });
        });
        
        // If no reports found with new schema, try legacy query for backwards compatibility
        if (reports.length === 0) {
            console.log('No reports found with new schema, trying legacy queries...');
            
            // Try old userId field format
            const legacyQuery = db.collection('stopCardReports')
                .where('userId', '==', user.uid);
            const legacyQuerySnapshot = await legacyQuery.get();
            console.log('Legacy userId query found', legacyQuerySnapshot.size, 'documents');
            
            legacyQuerySnapshot.forEach((doc) => {
                const data = doc.data();
                console.log('Found legacy report:', doc.id, data);
                reports.push({
                    id: doc.id,
                    ...data,
                    submissionDate: data.submissionDate?.toDate() || new Date(data.createdAt),
                    // Map legacy fields to new structure for display
                    site: data.site || 'Unknown Site',
                    area: data.area || 'Unknown Area',
                    actionsCompletion: 0,
                    conditionsCompletion: 0,
                    suggestions: data.description || '',
                    userName: data.userName || 'Unknown User'
                });
            });
            
            // Also try email matching for legacy reports
            if (reports.length === 0) {
                const emailQuery = db.collection('stopCardReports')
                    .where('userEmail', '==', user.email);
                const emailQuerySnapshot = await emailQuery.get();
                console.log('Email query found', emailQuerySnapshot.size, 'documents');
                
                emailQuerySnapshot.forEach((doc) => {
                    const data = doc.data();
                    console.log('Found report by email:', doc.id, data);
                    reports.push({
                        id: doc.id,
                        ...data,
                        submissionDate: data.submissionDate?.toDate() || new Date(data.createdAt),
                        site: data.site || 'Unknown Site',
                        area: data.area || 'Unknown Area',
                        actionsCompletion: 0,
                        conditionsCompletion: 0,
                        suggestions: data.description || '',
                        userName: data.userName || 'Unknown User'
                    });
                });
            }
        }
        
        console.log('Final reports array:', reports);
        
        // Sort reports by creation date (newest first) in JavaScript
        reports.sort((a, b) => {
            const dateA = a.submissionDate || new Date(a.createdAt);
            const dateB = b.submissionDate || new Date(b.createdAt);
            return dateB - dateA;
        });
        
        return {
            success: true,
            reports: reports,
            message: 'Reports loaded successfully'
        };
    } catch (error) {
        console.error('Error getting reports:', error);
        return {
            success: false,
            error: error.message,
            message: 'Failed to load reports'
        };
    }
}

// Authentication State Listener
function onAuthStateChanged(callback) {
    return auth.onAuthStateChanged(callback);
}

// Test function to verify database connectivity
async function testDatabaseConnection() {
    try {
        const user = auth.currentUser;
        if (!user) {
            console.error('No user logged in for test');
            return;
        }

        console.log('=== DATABASE CONNECTIVITY TEST ===');
        console.log('Current user:', user.uid, user.email);

        // Test 1: Try to write a simple test document
        console.log('Test 1: Writing test document...');
        const testData = {
            userId: user.uid,
            testField: 'test-value',
            timestamp: new Date().toISOString(),
            createdAt: new Date().toISOString()
        };

        const testDocRef = await db.collection('stopCardReports').add(testData);
        console.log('✅ Test document written with ID:', testDocRef.id);

        // Test 2: Try to read it back
        console.log('Test 2: Reading test document back...');
        const testDoc = await db.collection('stopCardReports').doc(testDocRef.id).get();
        if (testDoc.exists) {
            console.log('✅ Test document read successfully:', testDoc.data());
        } else {
            console.log('❌ Test document not found after write');
        }

        // Test 3: Query by userId
        console.log('Test 3: Querying by userId...');
        const querySnapshot = await db.collection('stopCardReports')
            .where('userId', '==', user.uid)
            .get();
        console.log('✅ Query successful, found', querySnapshot.size, 'documents');
        
        querySnapshot.forEach((doc) => {
            console.log('Document:', doc.id, doc.data());
        });

        // Clean up: Delete test document
        await db.collection('stopCardReports').doc(testDocRef.id).delete();
        console.log('✅ Test document cleaned up');
        
        return {
            success: true,
            message: 'Database connectivity test passed'
        };

    } catch (error) {
        console.error('❌ Database test failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Helper Functions
function getFirebaseErrorMessage(errorCode) {
    const errorMessages = {
        'auth/user-not-found': 'No account found with this email address.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/weak-password': 'Password should be at least 6 characters.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/user-disabled': 'This account has been disabled.',
        'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
        'auth/network-request-failed': 'Network error. Please check your connection.',
        'auth/requires-recent-login': 'Please sign in again to complete this action.',
        'auth/api-key-not-valid': 'Firebase API key not configured for web. Please check Firebase Console.',
        'auth/invalid-api-key': 'Invalid API key. Please check Firebase Console configuration.'
    };
    
    return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
}

// Export functions to global scope for use in app.js
window.FirebaseWeb = {
    initializeFirebase,
    signupWithFirebase,
    signinWithFirebase,
    signoutFromFirebase,
    saveStopCardToFirestore,
    getStopCardsFromFirestore,
    onAuthStateChanged,
    testDatabaseConnection,
    getAuth: () => auth,
    getDb: () => db,
    getCurrentUser: () => auth?.currentUser
};