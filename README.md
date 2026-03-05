# TRS Group | Ward Intelligence Portal

An advanced political survey and data collection platform built for ward-level analysis, field operations, and candidate strategy.

## 🚀 Quick Setup Guide

### 1. Configure Firebase Credentials
Update your `.env` file with your specific Firebase Web App configuration. You can find these in the [Firebase Console](https://console.firebase.google.com/):
1. **Project Settings** (Gear Icon) -> **General** tab.
2. Scroll to **Your apps** -> Select your Web App.
3. Select the **Config** radio button to see the keys.

**Required Environment Variables in `.env`:**
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
GOOGLE_GENAI_API_KEY=your_gemini_api_key
```

### 2. Initializing the Database (First Run)
Once you have logged in for the first time:
1. Navigate to **Settings** in the sidebar (Admin view).
2. Find the **Database Bootstrapper** card.
3. Click **"Bootstrap Initial Data"** to create the required Firestore collections (Wards, etc.).

### 3. Demo Mode
If you haven't set up Firebase yet, click **"Launch Demo Mode"** on the start screen. This uses mock data to showcase all features, including the AI Sentiment Analysis.

### 4. Common NPM Messages (Safe to Ignore)
- **"80 packages are looking for funding"**: This is standard NPM output informing you that library maintainers accept donations. It is **NOT** an error.

---
*Created by TRS Group Development Team*
