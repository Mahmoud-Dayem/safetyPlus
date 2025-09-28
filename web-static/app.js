// SafetyPlus Static Web App JavaScript

// Configuration
const CONFIG = {
    FIREBASE_CONFIG: {
        apiKey: "AIzaSyAArZ8v8W6SmWzUUbJbdhZfxRHfzUUBDnw",
        authDomain: "safetyplusapp-8f368.firebaseapp.com",
        projectId: "safetyplusapp-8f368",
        storageBucket: "safetyplusapp-8f368.firebasestorage.app",
        messagingSenderId: "1065215663549",
        appId: "1:1065215663549:web:7d5c0833a31a1c3c17c6d4"
    },
    GOOGLE_SHEETS_API_KEY: "AIzaSyAml-zkaTJq8iOKrDz7SZWotq-bqETtu-c",
    GOOGLE_SHEETS_SPREADSHEET_ID: "1t3bkyKHosw4K_iQFX2x82I0A7BbjO0qLBjJB_2Q2eoM"
};

// Admin configuration (UIDs allowed to access admin-only features like All Reports)
const ADMIN_UID = 'kMPQoPsJt3OeBr9IqSneVCsVorb2';

// Global Variables
let currentUser = null;
let currentScreen = 'loading';
let stopCardData = {
    actions: {},
    conditions: {},
    report: {
        site: '',
        area: '',
        shift: 'General',
        date: '',
        time: '',
        duration: '',
        peopleConducted: '',
        peopleObserved: '',
        observations: {
            safe: '',
            atRisk: '',
            nearMiss: '',
            incident: ''
        },
        suggestions: ''
    }
};

// Utility Functions
function isAdmin() {
    return !!(currentUser && currentUser.uid === ADMIN_UID);
}

function showScreen(screenId) {
    console.log('showScreen called with:', screenId);

    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });

    // Prefer selecting an element that is both .screen and with the id
    let screen = document.querySelector(`.screen#${CSS.escape(screenId)}`);
    if (!screen) {
        // Fallback to getElementById
        screen = document.getElementById(screenId);
    }

    console.log('Target screen element found:', !!screen);
    console.log('Target screen element:', screen);

    if (screen) {
        screen.classList.remove('hidden');
        currentScreen = screenId;
        console.log('Screen switched to:', screenId);
        console.log('Screen classes after switch:', screen.className);

        // Update header visibility and content
        updateHeader(screenId);
    } else {
        console.error('Screen element not found for ID:', screenId);
    }
}

function updateHeader(screenId) {
    const header = document.querySelector('.header');
    const backBtn = document.querySelector('.back-btn');
    const userInfo = document.querySelector('.user-info span');
    
    if (screenId === 'auth' || screenId === 'loading') {
        header.style.display = 'none';
    } else {
        header.style.display = 'block';
        
        // Show/hide back button
        if (screenId === 'home') {
            backBtn.style.display = 'none';
        } else {
            backBtn.style.display = 'inline-block';
        }
        
        // Update user info
        if (currentUser && userInfo) {
            userInfo.textContent = currentUser.displayName || currentUser.email;
        }

        // Hide admin-only buttons for non-admins if they exist
        const allReportsBtn = document.getElementById('detailed-reports-btn');
        const analyticsBtn = document.getElementById('analytics-btn');
        if (allReportsBtn) allReportsBtn.style.display = isAdmin() ? 'inline-flex' : 'none';
        if (analyticsBtn) analyticsBtn.style.display = isAdmin() ? 'inline-flex' : 'none';
    }
}

function showLoading() {
    showScreen('loading');
}

function hideLoading() {
    if (currentUser) {
        showScreen('home');
    } else {
        showScreen('auth');
    }
}

function showModal(title, message, callback) {
    const modal = document.getElementById('success-modal');
    const modalTitle = modal.querySelector('.modal-header h3');
    const modalBody = modal.querySelector('.modal-body p');
    
    modalTitle.textContent = title;
    modalBody.textContent = message;
    modal.classList.remove('hidden');
    
    // Store callback for the OK button
    modal.dataset.callback = callback ? callback.name : '';
}

function hideModal() {
    const modal = document.getElementById('success-modal');
    modal.classList.add('hidden');
    
    // Execute callback if exists
    const callbackName = modal.dataset.callback;
    if (callbackName && window[callbackName]) {
        window[callbackName]();
    }
}

// Local Storage Functions
function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error saving to storage:', error);
    }
}

function getFromStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error('Error reading from storage:', error);
        return null;
    }
}

function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing from storage:', error);
    }
}

// Authentication Functions
function switchAuthTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[onclick="switchAuthTab('${tab}')"]`).classList.add('active');
    
    // Update form
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
    } else {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    }
}

async function login() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    showLoading();
    
    try {
        const result = await window.FirebaseWeb.signinWithFirebase(email, password);
        
        if (result.success) {
            // Firebase auth state listener will handle the UI update
            console.log('Login successful:', result.message);
        } else {
            alert(result.message || 'Login failed. Please try again.');
            showScreen('auth');
        }
        
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
        showScreen('auth');
    }
}

async function signup() {
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const companyId = document.getElementById('signup-company').value.trim();
    const password = document.getElementById('signup-password').value;
    // Fix: use the correct confirm field ID from index.html
    const confirmPassword = document.getElementById('signup-confirm').value;
    
    if (!name || !email || !companyId || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }
    
    showLoading();
    
    try {
        // Pass through the Company ID captured from the form
        const result = await window.FirebaseWeb.signupWithFirebase(email, password, name, companyId);
        
        if (result.success) {
            showModal('Success!', 'Account created successfully. Welcome to SafetyPlus!');
            
            setTimeout(() => {
                hideModal();
                // Firebase auth state listener will handle the UI update
            }, 2000);
        } else {
            alert(result.message || 'Signup failed. Please try again.');
            showScreen('auth');
        }
        
    } catch (error) {
        console.error('Signup error:', error);
        alert('Signup failed. Please try again.');
        showScreen('auth');
    }
}

async function logout() {
    if (confirm('Are you sure you want to logout?')) {
        try {
            const result = await window.FirebaseWeb.signoutFromFirebase();
            
            if (result.success) {
                // Clear local data
                currentUser = null;
                stopCardData = {
                    actions: {},
                    conditions: {},
                    report: {
                        site: '',
                        area: '',
                        shift: 'General',
                        date: '',
                        time: '',
                        duration: '',
                        peopleConducted: '',
                        peopleObserved: '',
                        observations: {
                            safe: '',
                            atRisk: '',
                            nearMiss: '',
                            incident: ''
                        },
                        suggestions: ''
                    }
                };
                
                removeFromStorage('stopCardData');
                
                // Firebase auth state listener will handle the UI update
                console.log('Logout successful');
            } else {
                alert('Logout failed. Please try again.');
            }
        } catch (error) {
            console.error('Logout error:', error);
            alert('Logout failed. Please try again.');
        }
    }
}

// STOP Card Functions
function showStopCard() {
    showScreen('stop-card');
    loadStopCardData();
    updateProgress();
}

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tabs .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Save data when switching tabs
    saveStopCardData();
    updateProgress();
}

function saveStopCardData() {
    // Save actions checkboxes
    document.querySelectorAll('#actions-tab input[type="checkbox"]').forEach(checkbox => {
        stopCardData.actions[checkbox.id] = checkbox.checked;
    });
    
    // Save conditions checkboxes
    document.querySelectorAll('#conditions-tab input[type="checkbox"]').forEach(checkbox => {
        stopCardData.conditions[checkbox.id] = checkbox.checked;
    });
    
    // Save report form data
    const reportInputs = document.querySelectorAll('#report-tab input, #report-tab select, #report-tab textarea');
    reportInputs.forEach(input => {
        const key = input.id.replace('report-', '');
        
        if (key.includes('-')) {
            const parts = key.split('-');
            if (parts[0] === 'observations') {
                stopCardData.report.observations[parts[1]] = input.value;
            } else if (parts[0] === 'people') {
                // Handle people-conducted, people-observed -> camelCase in data
                const camel = parts[0] + parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
                stopCardData.report[camel] = input.value;
            }
        } else {
            stopCardData.report[key] = input.value;
        }
    });

    // Also capture Safe/Unsafe acts and suggestions (these inputs don't use the report- prefix)
    try {
        const safeActsEl = document.getElementById('safe-acts');
        const unsafeActsEl = document.getElementById('unsafe-acts');
        const suggestionsEl = document.getElementById('suggestions');

        const toList = (val) => {
            if (!val) return [];
            // Split by new lines or commas, trim, and remove empties
            return val
                .split(/\n|,/g)
                .map(s => (s || '').trim())
                .filter(Boolean);
        };

        // Store in a dedicated safetyActs object on stopCardData for later use
        stopCardData.safetyActs = {
            safeActsList: toList(safeActsEl?.value || ''),
            unsafeActsList: toList(unsafeActsEl?.value || '')
        };

        // Also mirror suggestions into report.suggestions
        if (suggestionsEl) {
            stopCardData.report.suggestions = suggestionsEl.value || '';
        }
    } catch (e) {
        console.warn('Could not capture safe/unsafe acts or suggestions:', e);
    }

    // Build mobile-like assessmentData from the current DOM (categories + questions)
    try {
        const buildSection = (tabSelector) => {
            const sections = Array.from(document.querySelectorAll(`${tabSelector} .checklist-section`));
            return sections.map(section => {
                const rawCat = section.querySelector('.section-header h3')?.textContent || '';
                // Remove leading emojis/symbols and extra spaces
                const category = rawCat.replace(/^[^\p{L}\p{N}]+/u, '').trim();
                const items = Array.from(section.querySelectorAll('.checklist-items label.checkbox-item'));
                const questions = items.map(lbl => {
                    const input = lbl.querySelector('input[type="checkbox"]');
                    const text = lbl.querySelector('span')?.textContent?.trim() || '';
                    return { question: text, status: !!input?.checked };
                });
                return { category, questions };
            });
        };

        stopCardData.assessmentData = {
            actions: buildSection('#actions-tab'),
            conditions: buildSection('#conditions-tab')
        };
    } catch (e) {
        console.warn('Could not build assessmentData structure:', e);
    }
    
    // Save to local storage
    saveToStorage('stopCardData', stopCardData);
}

function loadStopCardData() {
    const savedData = getFromStorage('stopCardData');
    if (savedData) {
        stopCardData = { ...stopCardData, ...savedData };
        
        // Load actions checkboxes
        Object.entries(stopCardData.actions).forEach(([id, checked]) => {
            const checkbox = document.getElementById(id);
            if (checkbox) checkbox.checked = checked;
        });
        
        // Load conditions checkboxes
        Object.entries(stopCardData.conditions).forEach(([id, checked]) => {
            const checkbox = document.getElementById(id);
            if (checkbox) checkbox.checked = checked;
        });
        
        // Load report form data
        Object.entries(stopCardData.report).forEach(([key, value]) => {
            if (key === 'observations') {
                Object.entries(value).forEach(([subkey, subvalue]) => {
                    const input = document.getElementById(`report-observations-${subkey}`);
                    if (input) input.value = subvalue;
                });
            } else if (key === 'peopleConducted') {
                const input = document.getElementById('report-people-conducted');
                if (input) input.value = value;
            } else if (key === 'peopleObserved') {
                const input = document.getElementById('report-people-observed');
                if (input) input.value = value;
            } else {
                const input = document.getElementById(`report-${key}`);
                if (input) input.value = value;
            }
        });
    }
    
    // Set default date and time if empty
    const dateInput = document.getElementById('report-date');
    const timeInput = document.getElementById('report-time');
    
    if (dateInput && !dateInput.value) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }
    
    if (timeInput && !timeInput.value) {
        timeInput.value = new Date().toTimeString().slice(0, 5);
    }
}

function updateProgress() {
    const actionsCount = Object.values(stopCardData.actions).filter(Boolean).length;
    const conditionsCount = Object.values(stopCardData.conditions).filter(Boolean).length;
    const reportFields = [
        stopCardData.report.site,
        stopCardData.report.area,
        stopCardData.report.date,
        stopCardData.report.time,
        stopCardData.report.duration,
        stopCardData.report.peopleConducted,
        stopCardData.report.peopleObserved
    ].filter(field => field && String(field).trim());

    // Define essential fields required to enable submit
    const essentials = [
        stopCardData.report.site,
        stopCardData.report.area,
        stopCardData.report.date,
        stopCardData.report.peopleObserved
    ];
    const essentialsFilled = essentials.every(v => v && String(v).trim());

    const totalFields = 35; // keep progress bar scale
    const completedFields = actionsCount + conditionsCount + reportFields.length;
    const progress = Math.min((completedFields / totalFields) * 100, 100);
    
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.getElementById('progress-text');
    const submitBtn = document.getElementById('submit-stop-card');
    
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
    
    if (progressText) {
        progressText.textContent = `${Math.round(progress)}% Complete`;
    }
    
    if (submitBtn) {
        // Enable when essential fields are provided (instead of 50%)
        submitBtn.disabled = !essentialsFilled;
    }
}

async function submitStopCard() {
    if (!currentUser) {
        alert('Please login to submit the report');
        return;
    }
    // Recompute latest form state and derived structures before submit
    saveStopCardData();
    try {
        // Normalize date/time fields (if both provided, keep date only as mobile schema expects YYYY-MM-DD)
        const dateInput = document.getElementById('report-date')?.value || '';
        const timeInput = document.getElementById('report-time')?.value || '';
        if (dateInput) {
            stopCardData.report.date = dateInput; // YYYY-MM-DD
        }
        if (timeInput) {
            stopCardData.report.time = timeInput; // HH:mm
        }
    } catch (_) {}
    
    const submitBtn = document.getElementById('submit-stop-card');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    
    try {
        // Prepare report data
        const reportData = { ...stopCardData, submissionDate: new Date().toISOString() };
        
        console.log('Submitting STOP card data:', reportData);
        
        // Save to Firestore
        const result = await window.FirebaseWeb.saveStopCardToFirestore(reportData);
        
        console.log('Firestore save result:', result);
        
        if (result.success) {
            // Clear form data first
            stopCardData = {
                actions: {},
                conditions: {},
                report: {
                    site: '',
                    area: '',
                    shift: 'General',
                    date: '',
                    time: '',
                    duration: '',
                    peopleConducted: '',
                    peopleObserved: '',
                    observations: {
                        safe: '',
                        atRisk: '',
                        nearMiss: '',
                        incident: ''
                    },
                    suggestions: ''
                }
            };
            removeFromStorage('stopCardData');

            console.log('STOP Card submitted with ID:', result.reportId);

            // Navigate to Home immediately on success
            returnToHome();
        } else {
            alert(result.message || 'Failed to submit report. Please try again.');
        }
        
    } catch (error) {
        console.error('Submit error:', error);
        alert('Failed to submit report. Please try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit STOP Card';
    }
}

function returnToHome() {
    showScreen('home');
    
    // Clear and reset the form
    document.querySelectorAll('#stop-card input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('#stop-card input[type="text"], #stop-card input[type="number"], #stop-card input[type="date"], #stop-card input[type="time"], #stop-card select, #stop-card textarea').forEach(input => input.value = '');
    
    updateProgress();
}

// Reports Functions
function showReports() {
    showScreen('reports');
    loadReports();
}

async function loadReports() {
    const reportsContainer = document.getElementById('reports-list');
    
    if (!currentUser) {
        reportsContainer.innerHTML = `
            <div class="no-reports">
                <h3>Please login</h3>
                <p>You need to be logged in to view reports.</p>
            </div>
        `;
        return;
    }
    
    // Show loading state
    reportsContainer.innerHTML = `
        <div class="no-reports">
            <div class="loading-spinner" style="width: 30px; height: 30px; margin: 0 auto 10px;"></div>
            <p>Loading reports...</p>
        </div>
    `;
    
    try {
        console.log('Loading reports for user:', currentUser);
        const result = await window.FirebaseWeb.getStopCardsFromFirestore();
        console.log('Firestore result:', result);
        
        if (result.success) {
            const reports = result.reports;
            userReports = reports; // store for modal lookup
            
            if (reports.length === 0) {
                reportsContainer.innerHTML = `
                    <div class="no-reports">
                        <h3>No reports found</h3>
                        <p>You haven't submitted any STOP cards yet.</p>
                    </div>
                `;
                return;
            }
            
            reportsContainer.innerHTML = reports.map(report => {
                const date = new Date(report.submissionDate);
                const formattedDate = date.toLocaleDateString();
                
                // Handle both new mobile schema and legacy schema
                let actionsCount = 0;
                let conditionsCount = 0;
                let site = 'Unknown Site';
                let area = 'Unknown Area';
                let reportDate = 'N/A';
                let userName = 'Unknown User';
                let platform = 'Unknown';
                let companyId = '';
                let actionsCompletion = 0;
                let conditionsCompletion = 0;
                let suggestions = '';
                
                // Check if it's new mobile schema format
                if (report.assessmentData) {
                    // New mobile schema
                    actionsCount = report.assessmentData.actions?.length || 0;
                    conditionsCount = report.assessmentData.conditions?.length || 0;
                    site = report.siteInfo?.site || report.site || 'Unknown Site';
                    area = report.siteInfo?.area || report.area || 'Unknown Area';
                    reportDate = report.siteInfo?.date || report.submittedAt?.split('T')[0] || 'N/A';
                    userName = report.userInfo?.displayName || report.userName || 'Unknown User';
                    platform = report.metadata?.platform || 'mobile';
                    companyId = report.userInfo?.companyId || '';
                    actionsCompletion = report.completionRates?.actionsCompletion || 0;
                    conditionsCompletion = report.completionRates?.conditionsCompletion || 0;
                    suggestions = report.feedback?.suggestions || '';
                } else {
                    // Legacy schema
                    actionsCount = Object.values(report.actions || {}).filter(Boolean).length;
                    conditionsCount = Object.values(report.conditions || {}).filter(Boolean).length;
                    site = report.report?.site || report.site || 'Unknown Site';
                    area = report.report?.department || report.area || 'Unknown Area';
                    reportDate = report.report?.date || 'N/A';
                    userName = report.userName || 'Unknown User';
                    platform = 'web (legacy)';
                    suggestions = report.report?.description || report.description || '';
                    companyId = report.companyId || '';
                }
                
                const rid = report.reportId || report.id || '';
                return `
                    <div class="report-item" data-report-id="${rid}" data-company-id="${companyId}">
                        <div class="report-header">
                            <div class="report-title">${userName} — ${companyId || '—'}</div>
                            <div class="report-date">${formattedDate}</div>
                        </div>
                        <div class="report-details">
                            <div><strong>Site:</strong> ${site}</div>
                            <div><strong>Area:</strong> ${area}</div>
                            <div><strong>Date:</strong> ${reportDate}</div>
                            <div><strong>Submitted by:</strong> ${userName}</div>
                            <div><strong>Platform:</strong> ${platform}</div>
                            ${actionsCompletion > 0 ? `<div><strong>Actions Completion:</strong> ${actionsCompletion}%</div>` : `<div><strong>Actions Checked:</strong> ${actionsCount}</div>`}
                            ${conditionsCompletion > 0 ? `<div><strong>Conditions Completion:</strong> ${conditionsCompletion}%</div>` : `<div><strong>Conditions Checked:</strong> ${conditionsCount}</div>`}
                            ${suggestions ? `<div><strong>Comments:</strong> ${suggestions.substring(0, 100)}${suggestions.length > 100 ? '...' : ''}</div>` : ''}
                            <div><strong>Status:</strong> <span style="color: var(--success-color);">Submitted</span></div>
                        </div>
                    </div>
                `;
            }).join('');

            // Attach click delegation once for user reports list
            if (!reportsContainer.dataset.bound) {
                reportsContainer.addEventListener('click', (e) => {
                    const item = e.target.closest('.report-item');
                    if (!item) return;
                    const rid = item.getAttribute('data-report-id');
                    openReportDetails(rid);
                });
                reportsContainer.dataset.bound = '1';
            }
        } else {
            reportsContainer.innerHTML = `
                <div class="no-reports">
                    <h3>Error loading reports</h3>
                    <p>${result.message}</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading reports:', error);
        reportsContainer.innerHTML = `
            <div class="no-reports">
                <h3>Error loading reports</h3>
                <p>Please try again later.</p>
            </div>
        `;
    }
}

async function refreshReports() {
    const refreshBtn = document.querySelector('.refresh-btn');
    refreshBtn.disabled = true;
    refreshBtn.textContent = 'Refreshing...';
    
    try {
        await loadReports();
    } catch (error) {
        console.error('Error refreshing reports:', error);
    } finally {
        refreshBtn.disabled = false;
        refreshBtn.textContent = '🔄 Refresh';
    }
}

async function testDatabase() {
    const testBtn = document.getElementById('test-db');
    testBtn.disabled = true;
    testBtn.textContent = 'Testing...';
    
    try {
        console.log('Starting database connectivity test...');
        const result = await window.FirebaseWeb.testDatabaseConnection();
        
        if (result.success) {
            alert('✅ Database test passed! Check console for details.');
        } else {
            alert('❌ Database test failed: ' + result.error);
        }
    } catch (error) {
        console.error('Test function error:', error);
        alert('❌ Test failed: ' + error.message);
    } finally {
        testBtn.disabled = false;
        testBtn.textContent = '🔧 Test Database';
    }
}

// Navigation Functions
function goBack() {
    console.log('goBack called, current screen:', currentScreen);
    switch (currentScreen) {
        case 'stop-card':
        case 'reports':
            showScreen('home');
            break;
        default:
            showScreen('home');
    }
}

// Detailed Reports Functions
let allReports = []; // Store all reports for filtering (all users)
let userReports = []; // Store current user's reports for history view

// Function to get ALL reports from ALL users (admin view)
async function getAllUsersReports() {
    try {
        console.log('Fetching all reports from all users...');
        
        // Query all documents in stopCardReports collection without user filter
        const db = window.FirebaseWeb.getDb();
        const querySnapshot = await db.collection('stopCardReports').get();
        
        console.log('Total documents found:', querySnapshot.size);
        const reports = [];
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log('Found report:', doc.id, data);
            reports.push({
                id: doc.id,
                ...data,
                // Convert Firestore timestamp to JavaScript Date for compatibility
                submissionDate: data.timestamp?.toDate() || new Date(data.submittedAt),
                // Extract key fields for display based on schema
                site: data.siteInfo?.site || data.report?.site || data.site || 'Unknown Site',
                area: data.siteInfo?.area || data.report?.department || data.area || 'Unknown Area',
                actionsCompletion: data.completionRates?.actionsCompletion || 0,
                conditionsCompletion: data.completionRates?.conditionsCompletion || 0,
                suggestions: data.feedback?.suggestions || data.report?.description || data.description || '',
                userName: data.userInfo?.displayName || data.userName || data.userEmail || 'Unknown User'
            });
        });
        
        // Sort reports by submission date (newest first)
        reports.sort((a, b) => {
            const dateA = a.submissionDate || new Date(a.submittedAt);
            const dateB = b.submissionDate || new Date(b.submittedAt);
            return dateB - dateA;
        });
        
        return {
            success: true,
            reports: reports,
            message: `Found ${reports.length} reports from all users`
        };
    } catch (error) {
        console.error('Error fetching all users reports:', error);
        return {
            success: false,
            reports: [],
            error: error.message,
            message: 'Failed to load reports from all users'
        };
    }
}

async function showDetailedReports() {
    console.log('showDetailedReports called');
    // Guard: only admin can navigate to detailed reports
    if (!isAdmin()) {
        alert('You do not have permission to view All Reports.');
        showScreen('home');
        return;
    }
    showScreen('detailed-reports');
    console.log('Screen switched to detailed-reports');
    await loadAllReports();
}

// Analytics
async function showAnalytics() {
    showScreen('analytics');
    const container = document.getElementById('analytics-container');
    container.innerHTML = `<div class="loading-message"><p>Loading analytics...</p></div>`;

    // Ensure authenticated
    const firebaseUser = window.FirebaseWeb?.getCurrentUser();
    if (!currentUser && firebaseUser) {
        currentUser = { uid: firebaseUser.uid, email: firebaseUser.email, displayName: firebaseUser.displayName || firebaseUser.email };
    }

    try {
        // If we don't yet have allReports, load them
        if (!allReports || allReports.length === 0) {
            const result = await getAllUsersReports();
            if (result.success) allReports = result.reports;
        }
        renderAnalytics(allReports);
    } catch (err) {
        console.error('Analytics error:', err);
        container.innerHTML = `<div class="no-reports"><h3>Error</h3><p>Could not load analytics.</p></div>`;
    }
}

function renderAnalytics(reports) {
    const container = document.getElementById('analytics-container');
    if (!reports || reports.length === 0) {
        container.innerHTML = `<div class="no-reports"><h3>No Data</h3><p>No reports available for analytics.</p></div>`;
        return;
    }

    // Aggregate metrics
    const total = reports.length;
    const bySite = reports.reduce((acc, r) => { const s = r.siteInfo?.site || r.report?.site || r.site || 'Unknown'; acc[s]=(acc[s]||0)+1; return acc; }, {});
    const safeActsTotal = reports.reduce((acc, r) => acc + (r.safetyActs?.safeActsCount || 0), 0);
    const unsafeActsTotal = reports.reduce((acc, r) => acc + (r.safetyActs?.unsafeActsCount || 0), 0);
    const avgActionsCompletion = average(reports.map(r => r.completionRates?.actionsCompletion).filter(isNum));
    const avgConditionsCompletion = average(reports.map(r => r.completionRates?.conditionsCompletion).filter(isNum));

    // Top sites
    const topSites = Object.entries(bySite).sort((a,b)=>b[1]-a[1]).slice(0,5);
    const siteBars = topSites.map(([site,count]) => bar(site, count, topSites[0][1])).join('');

    // Reports per user aggregation (also track companyId for display)
    const byUser = reports.reduce((acc, r) => {
        const uid = r.userInfo?.uid || r.userId || 'unknown';
        const name = r.userInfo?.displayName || r.userName || r.userInfo?.email || r.userEmail || 'Unknown User';
        const companyId = r.userInfo?.companyId || r.companyId || '';
        if (!acc[uid]) acc[uid] = { uid, name, companyId, count: 0 };
        // Prefer to preserve an existing non-empty companyId; fill if missing
        if (!acc[uid].companyId && companyId) acc[uid].companyId = companyId;
        acc[uid].count += 1;
        return acc;
    }, {});
    const usersArray = Object.values(byUser).sort((a,b)=>b.count - a.count);

    // ========= Assessment Analytics (Actions & Conditions) =========
    const normalizeKey = (s) => String(s || '').toLowerCase().replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
    const firstNonEmpty = (a, b) => (a && a.trim()) ? a : (b || '');
    const esc = (s) => escapeHtml(String(s ?? ''));

    function buildAssessmentStats(type) {
        const categoriesMap = new Map(); // catKey -> { category, ok, total }
        const questionsMap = new Map();  // catKey||qKey -> { category, question, ok, total }

        for (const r of reports) {
            const items = r.assessmentData?.[type];
            if (!Array.isArray(items)) continue;
            for (const cat of items) {
                const categoryLabel = firstNonEmpty(cat?.category, 'Unknown Category');
                const catKey = normalizeKey(categoryLabel);
                const qArr = Array.isArray(cat?.questions) ? cat.questions : [];

                if (!categoriesMap.has(catKey)) {
                    categoriesMap.set(catKey, { category: categoryLabel, ok: 0, total: 0 });
                }
                const catStat = categoriesMap.get(catKey);

                for (const q of qArr) {
                    const qLabel = firstNonEmpty(q?.question, '—');
                    const qKey = normalizeKey(qLabel);
                    const status = !!q?.status;
                    const key = `${catKey}||${qKey}`;

                    if (!questionsMap.has(key)) {
                        questionsMap.set(key, { category: categoryLabel, question: qLabel, ok: 0, total: 0 });
                    }
                    const qStat = questionsMap.get(key);

                    // Update
                    qStat.total += 1;
                    if (status) qStat.ok += 1;
                    catStat.total += 1;
                    if (status) catStat.ok += 1;
                }
            }
        }

        // Convert maps to arrays with percentages
        const cats = Array.from(categoriesMap.values()).map(s => ({
            category: s.category,
            ok: s.ok,
            total: s.total,
            okPct: s.total ? Math.round((s.ok / s.total) * 100) : 0
        })).sort((a,b) => a.okPct - b.okPct || a.category.localeCompare(b.category));

        const questions = Array.from(questionsMap.values()).map(s => ({
            category: s.category,
            question: s.question,
            ok: s.ok,
            total: s.total,
            okPct: s.total ? Math.round((s.ok / s.total) * 100) : 0
        })).sort((a,b) => a.okPct - b.okPct || a.question.localeCompare(b.question));

        // Overall % for the type
        const totalOk = cats.reduce((acc, x) => acc + x.ok, 0);
        const totalCount = cats.reduce((acc, x) => acc + x.total, 0);
        const overallPct = totalCount ? Math.round((totalOk / totalCount) * 100) : 0;

        return { cats, questions, overallPct };
    }

    const actionsStats = buildAssessmentStats('actions');
    const conditionsStats = buildAssessmentStats('conditions');

    const renderTable = (headers, rowsHtml) => `
        <div style="overflow:auto;">
            <table class="data-table">
                <thead><tr>${headers.map((h,i) => `<th style="${i>0 ? 'text-align:right;' : ''}">${esc(h)}</th>`).join('')}</tr></thead>
                <tbody>${rowsHtml}</tbody>
            </table>
        </div>`;

    // Group questions by category for per-category question stats
    const groupByCategory = (arr) => arr.reduce((acc, s) => {
        const key = s.category || 'Unknown Category';
        if (!acc[key]) acc[key] = [];
        acc[key].push(s);
        return acc;
    }, {});

    const actionsByCat = groupByCategory(actionsStats.questions);
    const conditionsByCat = groupByCategory(conditionsStats.questions);

    const renderQuestionsByCategory = (grouped) => {
        const sections = Object.entries(grouped).sort((a,b)=>a[0].localeCompare(b[0])).map(([cat, items]) => {
            // Sort questions alphabetically for stable UI
            const rows = items.sort((a,b)=>a.question.localeCompare(b.question)).map(s => `
                <tr>
                    <td>${esc(s.question)}</td>
                    <td style="text-align:right;">${fmtPct(s.okPct)}</td>
                    <td style="text-align:right;">${s.ok}/${s.total}</td>
                </tr>`).join('');
            return `
                <div class="chart" style="margin-top:.5rem;">
                    <h4>${esc(cat)}</h4>
                    ${renderTable(['Question', 'OK %', 'OK/Total'], rows)}
                </div>`;
        });
        return sections.join('');
    };

    container.innerHTML = `
        <div class="analytics-grid">
            <div class="stat-card"><div class="stat-title">Total Reports</div><div class="stat-value">${total}</div></div>
            <div class="stat-card"><div class="stat-title">Safe Acts (sum)</div><div class="stat-value">${safeActsTotal}</div></div>
            <div class="stat-card"><div class="stat-title">Unsafe Acts (sum)</div><div class="stat-value">${unsafeActsTotal}</div></div>
            <div class="stat-card"><div class="stat-title">Avg Actions Completion</div><div class="stat-value">${fmtPct(avgActionsCompletion)}</div></div>
            <div class="stat-card"><div class="stat-title">Avg Conditions Completion</div><div class="stat-value">${fmtPct(avgConditionsCompletion)}</div></div>
        </div>

        <div class="chart">
            <h3>Top Sites by Report Count</h3>
            ${siteBars || '<p>No site data.</p>'}
        </div>

        <div class="chart" style="margin-top:1rem;">
            <h3>Reports per User</h3>
            <div style="overflow:auto;">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Company ID</th>
                            <th style="text-align:right;">Reports</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${usersArray.map(u => `
                            <tr>
                                <td>${escapeHtml(u.name)}</td>
                                <td>${escapeHtml(u.companyId || '—')}</td>
                                <td style="text-align:right;">${u.count}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>

        <div class="chart" style="margin-top:1rem;">
            <h3>Actions — Questions by Category</h3>
            ${actionsStats.questions.length ? renderQuestionsByCategory(actionsByCat) : '<p>No actions questions data.</p>'}
        </div>

        <div class="chart" style="margin-top:1rem;">
            <h3>Actions — Category OK% (Overview)</h3>
            ${actionsStats.cats.length ? actionsStats.cats.map(s => pctBar(s.category, s.okPct, 'var(--success-color, #30D158)')).join('') : '<p>No actions data.</p>'}
        </div>

        <div class="chart" style="margin-top:1rem;">
            <h3>Conditions — Questions by Category</h3>
            ${conditionsStats.questions.length ? renderQuestionsByCategory(conditionsByCat) : '<p>No conditions questions data.</p>'}
        </div>

        <div class="chart" style="margin-top:1rem;">
            <h3>Conditions — Category OK% (Overview)</h3>
            ${conditionsStats.cats.length ? conditionsStats.cats.map(s => pctBar(s.category, s.okPct, 'var(--warning-color, #FF9500)')).join('') : '<p>No conditions data.</p>'}
        </div>
    `;
}

function average(arr){
    if (!Array.isArray(arr) || arr.length === 0) return 0;
    return arr.reduce((a,b)=>a+b,0) / arr.length;
}
function isNum(x){ return typeof x==='number' && !isNaN(x); }
function fmtPct(x){ return isNum(x)? `${x.toFixed(0)}%` : '—'; }
function bar(label, value, max){
    const width = max ? Math.max(4, Math.round((value/max)*100)) : 0;
    return `<div style="display:flex;align-items:center;margin:6px 0;gap:8px;">
        <div style="width:160px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${label}">${label}</div>
        <div style="flex:1;background:var(--background);border:1px solid var(--border-color);border-radius:6px;overflow:hidden;">
            <div style="width:${width}%;min-width:24px;background:var(--primary-color);color:#fff;padding:4px 6px;">${value}</div>
        </div>
    </div>`;
}

// Horizontal percent bar (0-100%) used for category OK% charts
function pctBar(label, pct, color){
    const width = isNum(pct) ? Math.max(2, Math.min(100, Math.round(pct))) : 0;
    const barColor = color || 'var(--primary-color)';
    const safeLabel = escapeHtml(label);
    return `<div style="display:flex;align-items:center;margin:6px 0;gap:8px;">
        <div style="width:220px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${safeLabel}">${safeLabel}</div>
        <div style="flex:1;background:var(--background);border:1px solid var(--border-color);border-radius:6px;overflow:hidden;position:relative;height:24px;">
            <div style="width:${width}%;height:100%;background:${barColor};"></div>
            <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:flex-end;padding:0 6px;font-size:12px;color:var(--text-color);">${fmtPct(pct)}</div>
        </div>
    </div>`;
}

function escapeHtml(str){
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Expose
window.showAnalytics = showAnalytics;

async function loadAllReports() {
    console.log('Loading all reports for detailed view...');
    
    // First check if user is authenticated
    const firebaseUser = window.FirebaseWeb?.getCurrentUser();
    console.log('Current user check:', currentUser);
    console.log('Firebase user check:', firebaseUser);
    
    if (!currentUser && !firebaseUser) {
        console.log('No authenticated user, redirecting to auth');
        showScreen('auth');
        return;
    }
    
    // Update currentUser if it's not set but Firebase user exists
    if (!currentUser && firebaseUser) {
        currentUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email
        };
        console.log('Updated currentUser from Firebase:', currentUser);
    }

    // Guard: only admin can actually load all reports
    if (!isAdmin()) {
        console.warn('Blocked non-admin from loading all reports');
        showScreen('home');
        return;
    }
    
    try {
        // Show loading message
        const reportsGrid = document.getElementById('reports-grid');
        if (reportsGrid) {
            reportsGrid.innerHTML = `
                <div class="loading-message">
                    <p>Loading reports...</p>
                </div>
            `;
        }
        
        // Get ALL reports from all users instead of just current user's reports
        const result = await getAllUsersReports();
        console.log('All users reports loaded:', result);
        console.log('Reports array:', result.reports);
        console.log('Reports count:', result.reports ? result.reports.length : 0);
        
        if (result.success && result.reports) {
            allReports = result.reports;
            console.log('Setting allReports to:', allReports);
            displayReportsGrid(allReports);
            updateReportsCount(allReports.length);
        } else {
            console.log('No reports or failed result:', result);
            displayNoReports();
            updateReportsCount(0);
        }
    } catch (error) {
        console.error('Error loading all reports:', error);
        displayErrorMessage();
        updateReportsCount(0);
    }
}

function displayReportsGrid(reports) {
    console.log('displayReportsGrid called with:', reports);
    const reportsGrid = document.getElementById('reports-grid');
    console.log('reportsGrid element:', reportsGrid);
    
    if (!reportsGrid) {
        console.error('reports-grid element not found!');
        return;
    }
    
    if (reports.length === 0) {
        console.log('No reports to display');
        reportsGrid.innerHTML = `
            <div class="no-reports-found">
                <h3>No reports found</h3>
                <p>No reports match your current search criteria.</p>
            </div>
        `;
        return;
    }
    
    console.log('Displaying', reports.length, 'reports');
    
    // Debug each report before processing
    reports.forEach((report, index) => {
        console.log(`Report ${index}:`, report);
        console.log(`Report ${index} submissionDate:`, report.submissionDate);
        console.log(`Report ${index} userInfo:`, report.userInfo);
        console.log(`Report ${index} siteInfo:`, report.siteInfo);
    });
    
    const htmlContent = reports.map(report => {
        console.log('Processing report for HTML:', report);
        
        const date = new Date(report.submissionDate);
        console.log('Parsed date:', date);
    const formattedDate = date.toLocaleDateString();
    console.log('Formatted date:', formattedDate);
        
        // Extract report details based on schema
        let reportId = report.reportId || report.id || 'N/A';
        let userName = 'Unknown User';
        let site = 'Unknown Site';
        let area = 'Unknown Area';
    let platform = 'Unknown';
    let companyId = '';
        
        // Handle both new mobile schema and legacy schema
        if (report.userInfo) {
            // New mobile schema
            userName = report.userInfo.displayName || report.userInfo.email || 'Unknown User';
            site = report.siteInfo?.site || 'Unknown Site';
            area = report.siteInfo?.area || 'Unknown Area';
            platform = report.metadata?.platform || 'mobile';
            companyId = report.userInfo.companyId || '';
            console.log('Mobile schema - userName:', userName, 'site:', site, 'area:', area);
        } else {
            // Legacy schema
            userName = report.userName || report.userEmail || 'Unknown User';
            site = report.report?.site || report.site || 'Unknown Site';
            area = report.report?.department || report.area || 'Unknown Area';
            platform = 'web (legacy)';
            companyId = report.companyId || '';
            console.log('Legacy schema - userName:', userName, 'site:', site, 'area:', area);
        }
        
        console.log('Final values - ID:', reportId, 'User:', userName, 'Site:', site, 'Area:', area, 'Platform:', platform);
        
        return `
            <div class="report-card" data-report-id="${reportId}" data-user-name="${userName}" data-site="${site}" data-area="${area}" data-company-id="${companyId}">
                <div class="report-card-header">
                    <div class="report-main"><span class="report-name">${userName}</span> <span class="report-id">${companyId}</span></div>
                    <div class="report-date">${formattedDate}</div>
                </div>
                
                <div class="report-details">
                    <div class="report-detail">
                        <span class="report-detail-label">🏢 Site:</span>
                        <span class="report-detail-value">${site}</span>
                    </div>
                    <div class="report-detail">
                        <span class="report-detail-label">📍 Area:</span>
                        <span class="report-detail-value">${area}</span>
                    </div>
                    <div class="report-detail">
                        <span class="report-detail-label">🏢 Company ID:</span>
                        <span class="report-detail-value">${companyId || '—'}</span>
                    </div>
                    <div class="report-detail">
                        <span class="report-detail-label">📱 Platform:</span>
                        <span class="report-detail-value">${platform}</span>
                    </div>
                    
                </div>
                
                <div class="report-status submitted">
                    ✅ Submitted
                </div>
            </div>
        `;
    }).join('');
    
    console.log('Generated HTML content length:', htmlContent.length);
    console.log('First 200 chars of HTML:', htmlContent.substring(0, 200));
    
    // Check if reportsGrid element exists
    console.log('reportsGrid element:', reportsGrid);
    console.log('reportsGrid exists:', !!reportsGrid);
    
    if (!reportsGrid) {
        console.error('ERROR: reports-grid element not found!');
        return;
    }
    
    // Set the HTML content
    reportsGrid.innerHTML = htmlContent;
    
    // Attach click handler via event delegation once
    if (!reportsGrid.dataset.bound) {
        reportsGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.report-card');
            if (!card) return;
            const reportId = card.getAttribute('data-report-id');
            openReportDetails(reportId);
        });
        reportsGrid.dataset.bound = '1';
    }
    
    console.log('HTML content set to reportsGrid');
    console.log('reportsGrid.innerHTML after setting:', reportsGrid.innerHTML.substring(0, 200));
}

function displayNoReports() {
    const reportsGrid = document.getElementById('reports-grid');
    reportsGrid.innerHTML = `
        <div class="no-reports-found">
            <h3>No reports found</h3>
            <p>No STOP Cards have been submitted to the system yet.</p>
        </div>
    `;
}

function displayErrorMessage() {
    const reportsGrid = document.getElementById('reports-grid');
    reportsGrid.innerHTML = `
        <div class="no-reports-found">
            <h3>Error loading reports</h3>
            <p>Please try again later or refresh the page.</p>
        </div>
    `;
}

function updateReportsCount(count) {
    const reportsCountElement = document.getElementById('reports-count');
    if (count === 0) {
        reportsCountElement.textContent = 'No reports found';
    } else if (count === 1) {
        reportsCountElement.textContent = '1 report found';
    } else {
        reportsCountElement.textContent = `${count} reports found`;
    }
}

function filterReports() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (!searchTerm) {
        displayReportsGrid(allReports);
        updateReportsCount(allReports.length);
        return;
    }
    
    const filteredReports = allReports.filter(report => {
        // Extract searchable fields
        let reportId = (report.reportId || report.id || '').toString().toLowerCase();
        let userName = '';
        let site = '';
        let area = '';
        let companyId = '';
        
        if (report.userInfo) {
            // New mobile schema
            userName = (report.userInfo.displayName || report.userInfo.email || '').toLowerCase();
            site = (report.siteInfo?.site || '').toLowerCase();
            area = (report.siteInfo?.area || '').toLowerCase();
            companyId = (report.userInfo.companyId || '').toString().toLowerCase();
        } else {
            // Legacy schema
            userName = (report.userName || report.userEmail || '').toLowerCase();
            site = (report.report?.site || report.site || '').toLowerCase();
            area = (report.report?.department || report.area || '').toLowerCase();
            companyId = (report.companyId || '').toString().toLowerCase();
        }
        
        // Search in all fields
        return reportId.includes(searchTerm) ||
               userName.includes(searchTerm) ||
               site.includes(searchTerm) ||
               area.includes(searchTerm) ||
               companyId.includes(searchTerm);
    });
    
    displayReportsGrid(filteredReports);
    updateReportsCount(filteredReports.length);
}

function clearFilters() {
    const searchInput = document.getElementById('search-input');
    searchInput.value = '';
    displayReportsGrid(allReports);
    updateReportsCount(allReports.length);
}

// Initialization
function initializeApp() {
    console.log('SafetyPlus Web App Initializing...');
    
    // Initialize Firebase first
    if (!window.FirebaseWeb) {
        console.error('Firebase not loaded');
        showScreen('auth');
        return;
    }
    
    const firebaseInitialized = window.FirebaseWeb.initializeFirebase();
    if (!firebaseInitialized) {
        console.error('Failed to initialize Firebase');
        showScreen('auth');
        return;
    }
    
    // Listen for authentication state changes
    window.FirebaseWeb.onAuthStateChanged((user) => {
        console.log('Auth state changed:', user);
        
        if (user) {
            currentUser = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || user.email
            };
            console.log('Loading home screen for authenticated user');
            showScreen('home');
        } else {
            currentUser = null;
            console.log('Loading auth screen for unauthenticated user');
            showScreen('auth');
        }
    });
    
    // Add event listeners for form submissions
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const target = e.target;
            
            if (target.closest('#login-form')) {
                e.preventDefault();
                login();
            } else if (target.closest('#signup-form')) {
                e.preventDefault();
                signup();
            }
        }
    });
    
    // Add event listeners for checkboxes and inputs to update progress
    document.addEventListener('change', function(e) {
        if (e.target.closest('#stop-card')) {
            saveStopCardData();
            updateProgress();
        }
    });
    
    // Add event listeners for input events (real-time updates)
    document.addEventListener('input', function(e) {
        if (e.target.closest('#stop-card')) {
            setTimeout(() => {
                saveStopCardData();
                updateProgress();
            }, 100);
        }
    });

    // Add event listeners for Select All checkboxes
    document.addEventListener('change', function(e) {
        if (e.target.closest('.select-all-category')) {
            console.log('Select All checkbox clicked:', e.target);
            
            // Determine the type and category from the closest section
            const section = e.target.closest('.checklist-section');
            const tabContent = e.target.closest('.tab-content');
            
            let type = '';
            if (tabContent && tabContent.id === 'actions-tab') {
                type = 'action';  // Changed from 'actions' to 'action' to match HTML name attribute
            } else if (tabContent && tabContent.id === 'conditions-tab') {
                type = 'condition';  // Changed from 'conditions' to 'condition' to match HTML name attribute
            }
            
            // Get category from section header
            const header = section?.querySelector('h3')?.textContent || 'unknown';
            const categoryId = header.toLowerCase().replace(/[^a-z]/g, '-');
            
            console.log('Calling toggleCategory with:', type, categoryId, e.target);
            toggleCategory(type, categoryId, e.target);
        }
    });
    
    console.log('SafetyPlus Web App Initialized');
}

// Category Toggle Function
function toggleCategory(type, categoryId, selectAllCheckbox) {
    console.log('toggleCategory called with:', type, categoryId, selectAllCheckbox);
    
    try {
        // Find the parent section of the select all checkbox
        const section = selectAllCheckbox.closest('.checklist-section');
        console.log('Found section:', section);
        
        if (!section) {
            console.error('No parent section found for select all checkbox');
            return;
        }
        
        // Get all checkboxes in this specific section
        const checkboxes = section.querySelectorAll(`input[name="${type}"]`);
        console.log('Found checkboxes:', checkboxes.length, checkboxes);
        
        if (checkboxes.length === 0) {
            console.error(`No checkboxes found with name="${type}" in section`);
            return;
        }
        
        // Toggle all checkboxes in this category
        checkboxes.forEach((checkbox, index) => {
            console.log(`Setting checkbox ${index} (${checkbox.value}) to:`, selectAllCheckbox.checked);
            checkbox.checked = selectAllCheckbox.checked;
            // Trigger change event to update progress and save data
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        });
        
        console.log(`${selectAllCheckbox.checked ? 'Selected' : 'Deselected'} all ${categoryId} (${checkboxes.length} items)`);
    } catch (error) {
        console.error('Error in toggleCategory:', error);
    }
}

// Global event handlers 
window.hideModal = hideModal;
window.returnToHome = returnToHome;
window.goBack = goBack;
window.login = login;
window.signup = signup;
window.logout = logout;
window.switchAuthTab = switchAuthTab;
window.switchTab = switchTab;
window.showStopCard = showStopCard;
window.showReports = showReports;
window.submitStopCard = submitStopCard;
window.refreshReports = refreshReports;
window.testDatabase = testDatabase;
window.toggleCategory = toggleCategory;
window.showDetailedReports = showDetailedReports;
window.filterReports = filterReports;
window.clearFilters = clearFilters;

// Test function - can be called from console to verify function works
window.testToggle = function() {
    console.log('Test function called - toggleCategory is available:', typeof window.toggleCategory);
    const firstSelectAll = document.querySelector('.select-all-category input[type="checkbox"]');
    if (firstSelectAll) {
        console.log('Found first select all checkbox:', firstSelectAll);
        toggleCategory('actions', 'test', firstSelectAll);
    } else {
        console.log('No select all checkbox found');
    }
};

// Test detailed reports function
window.testDetailedReports = function() {
    console.log('Testing detailed reports...');
    console.log('Current user:', currentUser);
    console.log('showDetailedReports function:', typeof showDetailedReports);
    
    const detailedReportsScreen = document.getElementById('detailed-reports');
    console.log('Detailed reports screen element:', detailedReportsScreen);
    
    const reportsGrid = document.getElementById('reports-grid');
    console.log('Reports grid element:', reportsGrid);
    
    if (detailedReportsScreen && reportsGrid) {
        console.log('Elements found, calling showDetailedReports...');
        showDetailedReports();
    } else {
        console.log('Elements not found');
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Open a report in a modal by ID
function openReportDetails(reportId) {
    try {
        if (!reportId) return;
        // Find the report in either allReports (All users) or userReports (My history)
        let report = allReports.find(r => (r.reportId || r.id) === reportId || r.id === reportId);
        if (!report && Array.isArray(userReports)) {
            report = userReports.find(r => (r.reportId || r.id) === reportId || r.id === reportId);
        }
        if (!report) {
            console.warn('Report not found for id:', reportId);
            return;
        }
        
        // Build details HTML
        const rawDate = (report.submissionDate instanceof Date)
            ? report.submissionDate
            : (report.submissionDate || report.submittedAt || null);
        const date = rawDate ? (rawDate instanceof Date ? rawDate : new Date(rawDate)) : new Date();
        const formattedDate = isNaN(date.getTime()) ? new Date().toLocaleDateString() : date.toLocaleDateString();
        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',report.feedback )
    const userName = report.userInfo ? (report.userInfo.displayName || report.userInfo.email) : (report.userName || report.userEmail || 'Unknown User');
    const site = report.siteInfo?.site || report.report?.site || report.site || 'Unknown Site';
    const area = report.siteInfo?.area || report.report?.department || report.area || 'Unknown Area';
    const shift = report.siteInfo?.shift || report.shift || 'General';
        const companyId = report.userInfo?.companyId || report.companyId || '';
        const platform = report.metadata?.platform || (report.userInfo ? 'mobile' : 'web (legacy)');
        const suggestions = report.feedback?.suggestions || report.report?.description || report.description || '';
        
        const actionsCompletion = report.completionRates?.actionsCompletion ?? null;
        const conditionsCompletion = report.completionRates?.conditionsCompletion ?? null;

        // Safer HTML output helper (declare before use below)
        const esc = (s) => escapeHtml(s);

    // Safety Acts (safe/unsafe) - lists and counts
    const safeActsList = Array.isArray(report.safetyActs?.safeActsList) ? report.safetyActs.safeActsList : [];
    const unsafeActsList = Array.isArray(report.safetyActs?.unsafeActsList) ? report.safetyActs.unsafeActsList : [];
    const safeActsCount = report.safetyActs?.safeActsCount ?? (safeActsList.length || null);
    const unsafeActsCount = report.safetyActs?.unsafeActsCount ?? (unsafeActsList.length || null);
        
        // Text helpers: humanize labels and clean category prefixes
        const humanize = (s) => {
            if (s == null) return '';
            const cleaned = String(s)
                .replace(/[-_]+/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
            return cleaned.replace(/\b\w/g, (ch) => ch.toUpperCase());
        };
        const cleanCategoryTitle = (raw) => {
            const withoutPrefix = String(raw || '')
                .replace(/^(Action|Actions|Condition|Conditions)\s*-?\s*/i, '');
            return humanize(withoutPrefix);
        };
        // Normalize question text by removing leading Action/Condition and category prefix
        const normalizeQuestionText = (rawQ, categoryTitle) => {
            let q = String(rawQ || '');
            // replace separators to spaces
            q = q.replace(/[-_]+/g, ' ');
            // remove leading action/condition words
            q = q.replace(/^\s*(Action|Actions|Condition|Conditions)\s+/i, '');
            const cat = String(categoryTitle || '').replace(/[-_]+/g, ' ').trim();
            if (cat) {
                const rx = new RegExp('^\\s*' + cat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s+', 'i');
                q = q.replace(rx, '');
            }
            // collapse spaces and humanize
            q = q.replace(/\s+/g, ' ').trim();
            return humanize(q);
        };

        // Helper to render grouped assessment sections (Actions/Conditions)
        const renderAssessmentSection = (title, items) => {
            if (!items || !Array.isArray(items) || items.length === 0) return '';
            // Render ALL items with a status icon (✅ for OK, ❌ for Not OK)
            const groups = items.map(cat => {
                const questions = Array.isArray(cat.questions) ? cat.questions : [];
                if (questions.length === 0) return '';
                const categoryTitle = cleanCategoryTitle(cat.category || '');
                const perQuestion = questions.map(q => {
                    const isOk = !!(q?.status);
                    const qText = normalizeQuestionText(q?.question || '', categoryTitle);
                    const note = q?.note || q?.comment || q?.feedback;
                    const icon = isOk ? '✅' : '❌';
                    const color = isOk ? '#28a745' : '#dc3545';
                    return `<li class="qa-item">
                        <div class="qa-row" style="display:flex;align-items:center;gap:8px;">
                            <span class="qa-status" style="color:${color};font-weight:700;">${icon}</span>
                            <span class="qa-question">${esc(qText)}</span>
                        </div>
                        ${note ? `<div class="qa-feedback">${esc(String(note))}</div>` : ''}
                    </li>`;
                }).join('');
                const catNote = cat?.note || cat?.comment || cat?.feedback;
                const titleText = categoryTitle;
                return `
                    <div class="category-block">
                        <div class="category-header">
                            <h5 class="category-title">${esc(titleText)}</h5>
                        </div>
                        <ul class="qa-list">${perQuestion}</ul>
                        ${catNote ? `<div class="category-feedback">${esc(String(catNote))}</div>` : ''}
                    </div>
                `;
            }).filter(Boolean).join('');
            if (!groups) return '';
            return `<h4 class="section-title">${esc(title)}</h4>${groups}`;
        };

        // Fallback renderer for legacy web schema (flat key/value)
        const renderLegacySection = (title, obj) => {
            if (!obj || typeof obj !== 'object') return '';
            const keys = Object.keys(obj);
            if (!keys.length) return '';
            const items = keys.map(k => {
                const isOk = !!obj[k];
                const label = humanize(k);
                const icon = isOk ? '✅' : '❌';
                const color = isOk ? '#28a745' : '#dc3545';
                return `<li class="qa-item">
                    <div class="qa-row" style="display:flex;align-items:center;gap:8px;">
                        <span class="qa-status" style="color:${color};font-weight:700;">${icon}</span>
                        <span class="qa-question">${esc(label)}</span>
                    </div>
                </li>`;
            }).join('');
            return `<h4 class="section-title">${esc(title)}</h4><ul class="qa-list">${items}</ul>`;
        };

        const actionsHtml = (report.assessmentData && report.assessmentData.actions)
            ? renderAssessmentSection('Actions', report.assessmentData.actions)
            : renderLegacySection('Actions', report.actions);
        const conditionsHtml = (report.assessmentData && report.assessmentData.conditions)
            ? renderAssessmentSection('Conditions', report.assessmentData.conditions)
            : renderLegacySection('Conditions', report.conditions);

        // Safety acts HTML
        let safetyActsHtml = '';
        const safeHtml = safeActsList && safeActsList.length
            ? `<div class="detail-group"><div class="detail-group-title">Safe Acts (${safeActsList.length})</div><ul class="detail-list">${safeActsList.map(item => `<li>${item}</li>`).join('')}</ul></div>`
            : (safeActsCount ? `<div class="detail-row"><strong>Safe Acts:</strong> ${safeActsCount}</div>` : '');
        const unsafeHtml = unsafeActsList && unsafeActsList.length
            ? `<div class="detail-group"><div class="detail-group-title">Unsafe Acts (${unsafeActsList.length})</div><ul class="detail-list">${unsafeActsList.map(item => `<li>${item}</li>`).join('')}</ul></div>`
            : (unsafeActsCount ? `<div class="detail-row"><strong>Unsafe Acts:</strong> ${unsafeActsCount}</div>` : '');
        if (safeHtml || unsafeHtml) {
            safetyActsHtml = `<h4>Safety Acts</h4>${safeHtml}${unsafeHtml}`;
        }
        
        const modalTitle = document.getElementById('report-modal-title');
        const modalBody = document.getElementById('report-modal-body');
        const modal = document.getElementById('report-modal');
        
        if (!modal || !modalBody || !modalTitle) return;
        
    modalTitle.textContent = `${esc(userName)} — ${esc(companyId || '—')}`;

        const completionChips = (actionsCompletion != null || conditionsCompletion != null)
            ? `<div class="chip-group">
                    <span class="chip chip--info">Actions: ${actionsCompletion ?? 0}%</span>
                    <span class="chip chip--info">Conditions: ${conditionsCompletion ?? 0}%</span>
               </div>`
            : '';

        const suggestionsBlock = suggestions
            ? `<div class="detail-group">
                    <div class="detail-group-title">Suggestions</div>
                    <div>${esc(String(suggestions)).replace(/\n/g, '<br>')}</div>
               </div>`
            : '';

        const metaChips = `
            <div class="chip-group report-meta">
                <span class="chip">Date: ${esc(formattedDate)}</span>
                <span class="chip">Shift: ${esc(shift)}</span>
                <span class="chip">Platform: ${esc(platform)}</span>
                ${companyId ? `<span class="chip">Company: ${esc(String(companyId))}</span>` : ''}
            </div>`;

        modalBody.innerHTML = `
            ${metaChips}
            <div class="details-grid">
                <div class="kv"><div class="kv-label">Site</div><div class="kv-value">${esc(site)}</div></div>
                <div class="kv"><div class="kv-label">Area</div><div class="kv-value">${esc(area)}</div></div>
            </div>
            ${completionChips}
            ${suggestionsBlock}
            ${safetyActsHtml}
            ${actionsHtml || ''}
            ${conditionsHtml || ''}
        `;
        
        modal.classList.remove('hidden');
    } catch (err) {
        console.error('Error opening report details:', err);
    }
}

function closeReportModal() {
    const modal = document.getElementById('report-modal');
    if (modal) modal.classList.add('hidden');
}

// Expose close function globally for button
window.closeReportModal = closeReportModal;