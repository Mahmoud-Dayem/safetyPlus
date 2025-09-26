# Google Sheets Integration Setup Guide

## Step 1: Create a Google Spreadsheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it "STOP Card Reports" or similar
4. Copy the spreadsheet ID from the URL (the long string between `/d/` and `/edit`)
   - Example: `https://docs.google.com/spreadsheets/d/1ABC123XYZ456/edit#gid=0`
   - The ID is: `1ABC123XYZ456`
   1IVnqXBvbPwMedpVgRHa-BYOcGowm3ajh6wQNEcE4WgU

## Step 2: Set Up Google Apps Script
1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Replace the default `Code.gs` content with the code from `google-apps-script/Code.gs`
4. Replace `YOUR_SPREADSHEET_ID` with your actual spreadsheet ID from Step 1
5. Save the project (Ctrl+S or File > Save)
6. Name your project "STOP Card Data Handler"

## Step 3: Deploy the Web App
1. In Apps Script, click "Deploy" > "New Deployment"
2. Click the gear icon next to "Type" and select "Web app"
3. Fill in the deployment settings:
   - Description: "STOP Card Data Collection"
   - Execute as: "Me"
   - Who has access: "Anyone" (this allows your app to send data)
4. Click "Deploy"
5. Review permissions and click "Authorize access"
6. Copy the web app URL (it will look like: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`)

## Step 4: Update Your React Native App
1. In `StopCard.jsx`, find the `sendToGoogleSheets` function
2. Replace the URL in the fetch call:
   ```javascript
   const response = await fetch('YOUR_WEB_APP_URL_HERE', {
   ```
   With your actual web app URL from Step 3.

## Step 5: Test the Integration
1. Run your React Native app
2. Fill out a STOP Card report
3. Click "Send Report"
4. Check your Google Spreadsheet to see if the data appears

## Troubleshooting

### Common Issues:
1. **403 Forbidden Error**: Check that the web app is deployed with "Anyone" access
2. **Script not found**: Verify the web app URL is correct
3. **No data appearing**: Check the spreadsheet ID in the Apps Script code
4. **CORS errors**: Make sure you're using the web app URL, not the script.google.com editor URL

### Data Structure:
The spreadsheet will have these columns:
- Timestamp, User_Email, Company_ID, Site, Area, Date, Shift
- Duration_Minutes, People_Conducted, People_Observed
- Safe_Acts_Count, Safe_Acts_List, Unsafe_Acts_Count, Unsafe_Acts_List
- Actions_Completion, Conditions_Completion
- Actions_Details, Conditions_Details, Suggestions, Report_ID

### Security Notes:
- The web app URL contains a secret token - keep it secure
- Only share the spreadsheet with authorized personnel
- Consider using Google Workspace for additional security features

## Optional Enhancements:
1. **Email Notifications**: Add email alerts when new reports are submitted
2. **Data Validation**: Add additional validation in the Apps Script
3. **Dashboard**: Create charts and pivot tables in Google Sheets for analytics
4. **Automated Reports**: Set up scheduled reports to be sent to management

## Support:
If you encounter issues:
1. Check the Apps Script execution log for errors
2. Verify all IDs and URLs are correct
3. Test the web app deployment in a browser first
4. Ensure your Google account has necessary permissions