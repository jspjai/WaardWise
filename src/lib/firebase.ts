import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;

// Basic validation: Check if essential keys exist
const isConfigValid = 
  typeof process.env.NEXT_PUBLIC_FIREBASE_API_KEY === 'string' && 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY.length > 10 &&
  typeof process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === 'string' &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID.length > 0;

if (typeof window !== "undefined") {
  if (isConfigValid) {
    try {
      app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      db = getFirestore(app);
      auth = getAuth(app);
    } catch (error) {
      console.error("Firebase initialization error:", error);
    }
  }
}

export { app, db, auth, isConfigValid };
