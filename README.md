# TRS Group | Ward Intelligence Portal

An advanced political survey and data collection platform built for ward-level analysis, field operations, and candidate strategy.

## 🚀 Quick Setup Guide

### 1. Configure Firebase Credentials
Update your `.env` file with your specific Firebase Web App configuration. You can find these in the [Firebase Console](https://console.firebase.google.com/):
1. **Project Settings** (Gear Icon) -> **General** tab.
2. Scroll to **Your apps** -> Select your Web App (or create a new Web app if none exists).
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

### 2. Common NPM Messages
When running `npm install`, you might see messages like:
- **"80 packages are looking for funding"**: This is **NOT an error**. It is a standard notice from NPM informing you that some library maintainers accept donations. You can safely ignore this.
- **"found 0 vulnerabilities"**: This confirms your environment is secure.

### 3. Enable Authentication
1. In Firebase Console, go to **Authentication**.
2. Click **Get Started** and enable **Email/Password**.

### 4. Demo Mode
If you want to test the UI without setting up Firebase first, click **"Launch Demo Mode"** on the start screen. This uses mock data to showcase all features.

---
*Created by TRS Group Development Team*
