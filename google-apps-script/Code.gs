// Google Apps Script for STOP Card Data Collection
// Instructions:
// 1. Go to https://script.google.com
// 2. Create a new project
// 3. Replace the default code with this script
// 4. Deploy as a web app
// 5. Copy the web app URL and replace YOUR_SCRIPT_ID in StopCard.jsx

function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Get or create the spreadsheet
    const spreadsheetId = 'YOUR_SPREADSHEET_ID'; // Replace with your Google Sheets ID
    const sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();
    
    // Ensure headers exist (run this once to set up the sheet)
    setupHeaders(sheet);
    
    // Prepare row data matching the column structure
    const rowData = [
      data.timestamp,                    // A: Timestamp
      data.userEmail,                    // B: User_Email  
      data.companyId,                    // C: Company_ID
      data.site,                         // D: Site
      data.area,                         // E: Area
      data.date,                         // F: Date
      data.shift,                        // G: Shift
      data.durationMinutes,              // H: Duration_Minutes
      data.peopleConducted,              // I: People_Conducted
      data.peopleObserved,               // J: People_Observed
      data.safeActsCount,                // K: Safe_Acts_Count
      data.safeActsList,                 // L: Safe_Acts_List
      data.unsafeActsCount,              // M: Unsafe_Acts_Count
      data.unsafeActsList,               // N: Unsafe_Acts_List
      data.actionsCompletion,            // O: Actions_Completion
      data.conditionsCompletion,         // P: Conditions_Completion
      data.actionsDetails,               // Q: Actions_Details
      data.conditionsDetails,            // R: Conditions_Details
      data.suggestions,                  // S: Suggestions
      data.reportId                      // T: Report_ID
    ];
    
    // Append the data to the sheet
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Data saved successfully',
        reportId: data.reportId
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function setupHeaders(sheet) {
  // Check if headers already exist
  if (sheet.getRange(1, 1).getValue() === 'Timestamp') {
    return; // Headers already set up
  }
  
  // Set up column headers
  const headers = [
    'Timestamp',              // A
    'User_Email',             // B
    'Company_ID',             // C
    'Site',                   // D
    'Area',                   // E
    'Date',                   // F
    'Shift',                  // G
    'Duration_Minutes',       // H
    'People_Conducted',       // I
    'People_Observed',        // J
    'Safe_Acts_Count',        // K
    'Safe_Acts_List',         // L
    'Unsafe_Acts_Count',      // M
    'Unsafe_Acts_List',       // N
    'Actions_Completion',     // O
    'Conditions_Completion',  // P
    'Actions_Details',        // Q
    'Conditions_Details',     // R
    'Suggestions',            // S
    'Report_ID'               // T
  ];
  
  // Set headers in the first row
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#FF9500'); // Orange background
  headerRange.setFontColor('#FFFFFF');  // White text
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, headers.length);
}

// Test function to verify the setup
function testSetup() {
  const spreadsheetId = 'YOUR_SPREADSHEET_ID'; // Replace with your actual ID
  const sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();
  setupHeaders(sheet);
  Logger.log('Headers set up successfully');
}