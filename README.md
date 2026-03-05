# TRS Group | Ward Intelligence Portal

An advanced political survey and data collection platform built for ward-level analysis, field operations, and candidate strategy.

## 🚀 Quick Start (Local Setup)

### 1. Initialize Firebase
Go to the [Firebase Console](https://console.firebase.google.com/) and:
1. **Create a Project**: Give it a name like `trs-group-portal`.
2. **Enable Authentication**: Go to Build > Authentication > Get Started. Enable **Email/Password**.
3. **Enable Firestore**: Go to Build > Firestore Database > Create Database. Start in **Production Mode** and choose a location.
4. **Register Web App**: Click the `</>` icon on the project overview page. Copy the `firebaseConfig` object.

### 2. Configure Environment
Create a `.env` file in the root directory and paste your config:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# For AI Sentiment Analysis
GOOGLE_GENAI_API_KEY=your_gemini_api_key
```

### 3. Deploy Security Rules
Install Firebase CLI:
```bash
npm install -g firebase-tools
firebase login
firebase init firestore
# Select your project and use the existing firestore.rules file
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

## 🤖 AI Features
Powered by **Genkit**, the platform automatically processes field notes to:
- Extract overall sentiment (Positive/Neutral/Negative).
- Identify key local issues (Water, Roads, etc.).
- Summarize respondent pulse for quick reading.

---
*Created by TRS Group Development Team*
