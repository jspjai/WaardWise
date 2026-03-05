# TRS Group | Ward Intelligence Portal

An advanced political survey and data collection platform built for ward-level analysis, field operations, and candidate strategy.

## 🚀 Local Setup Guide

### 1. Get Your Firebase Credentials
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project.
3. Click the **Project Settings** (gear icon) in the sidebar.
4. Scroll down to **Your apps** and look for your Web App (register one if needed).
5. Select the **Config** radio button to see your keys.

### 2. Configure Environment Variables
Update your `.env` file with these specific mappings:

| Firebase Config Key | Environment Variable (.env) |
|---------------------|-----------------------------|
| `apiKey`            | `NEXT_PUBLIC_FIREBASE_API_KEY` |
| `authDomain`        | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` |
| `projectId`         | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` |
| `storageBucket`     | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` |
| `messagingSenderId` | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` |
| `appId`             | `NEXT_PUBLIC_FIREBASE_APP_ID` |
| `N/A (AI Studio)`   | `GOOGLE_GENAI_API_KEY` |

### 3. Deploy Security Rules
Ensure your data is protected:
```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules
```

### 4. Seed Initial Data (Optional)
You can manually add the wards and users defined in `backend.json` to your Firestore collections via the Firebase Console to match the prototype data.

### 5. Run Development Server
```bash
npm install
npm run dev
```

---
*Created by TRS Group Development Team*
