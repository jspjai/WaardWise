# TRS Group | Ward Intelligence Portal

An advanced political survey and data collection platform built for ward-level analysis, field operations, and candidate strategy.

## 🚀 Quick Start (Local Setup)

### 1. Find Your Firebase Credentials
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project.
3. Click the **Project Settings** (gear icon) in the sidebar.
4. Scroll down to **Your apps** and look for the **Firebase SDK snippet**.
5. Select the **Config** radio button.
6. Copy the values into your `.env` file (see below).

### 2. Configure Environment
Create/update your `.env` file in the root directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# For AI Sentiment Analysis (Get from Google AI Studio)
GOOGLE_GENAI_API_KEY=your_gemini_api_key
```

### 3. Deploy Security Rules
Install Firebase CLI:
```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules
```

### 4. Run Development Server
```bash
npm install
npm run dev
```

## 📂 Core User Roles
- **Super Admin**: Access to master dashboard, ward management, and surveyor tracking.
- **Field Surveyor**: Mobile-optimized survey entry with AI sentiment assistance.
- **Candidate**: Marketplace for unlocking ward data and viewing strategic reports.

---
*Created by TRS Group Development Team*
