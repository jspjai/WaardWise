# TRS Group | Ward Intelligence Portal

An advanced political survey and data collection platform built for ward-level analysis, field operations, and candidate strategy.

## 🚀 Quick Setup Guide

### 1. Configure Firebase Credentials
Update your `.env` file with your specific Firebase Web App configuration. You can find these in the [Firebase Console](https://console.firebase.google.com/):
1. **Project Settings** (Gear Icon) -> **General** tab.
2. Scroll to **Your apps** -> Select your Web App.
3. Select the **Config** radio button to see the keys.

**Required Environment Variables:**
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
GOOGLE_GENAI_API_KEY=your_gemini_api_key
```

### 2. Enable Authentication
1. In Firebase Console, go to **Authentication**.
2. Click **Get Started** and enable **Email/Password**.

### 3. Deploy Security Rules
Ensure your data is protected:
```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules
```

### 4. Seed Initial Data (Optional)
The portal will function with mock data in **Demo Mode**. For Live Mode, users are automatically provisioned in the `users` collection upon signup.

---
*Created by TRS Group Development Team*
