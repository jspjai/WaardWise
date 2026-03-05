# TRS Group | Ward Intelligence Portal

An advanced political survey and data collection platform built for ward-level analysis, field operations, and candidate strategy.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + Shadcn UI
- **Backend**: Firebase (Authentication & Firestore)
- **AI Engine**: Genkit (Gemini 2.5 Flash)
- **Icons**: Lucide React
- **Charts**: Recharts

## 🛠️ Local Setup Instructions

### 1. Prerequisites
- Node.js 18+ installed.
- A Firebase Project created at [console.firebase.google.com](https://console.firebase.google.com/).

### 2. Firebase Configuration
Before running the app, you need to enable services in your Firebase Console:

1.  **Authentication**: Enable the **Email/Password** provider.
2.  **Firestore Database**: Create a database in **Production Mode** (or Test Mode for internal dev).
3.  **Project Settings**: Add a **Web App** to your project to get your `firebaseConfig` object.

### 3. Environment Variables
Create a `.env` file in the root directory (or update the existing one) and paste your credentials:

```env
# Firebase Web App Credentials
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Generative AI (for Genkit)
GOOGLE_GENAI_API_KEY=your_gemini_api_key
```

### 4. Installation & Running
```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

The app will be available at `http://localhost:9002`.

## 📂 Data Schema (Firestore)

The app expects the following structure in Firestore:

- `users/{userId}`: User profiles with `role` (ADMIN, SURVEYOR, CANDIDATE).
- `wards/{wardId}`: Detailed statistics for specific administrative zones.
- `surveys/{surveyId}`: Individual field submissions.
- `unlockedWards/{id}`: Tracking which candidates have purchased access to ward data.

## 🤖 AI Features
The platform uses **Genkit** to analyze field notes. Ensure your `GOOGLE_GENAI_API_KEY` is set to enable real-time sentiment extraction and trend detection.

---
*Created by TRS Group Development Team*