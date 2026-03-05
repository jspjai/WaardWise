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

// Enhanced validation to help user identify missing or invalid keys
const getConfigurationDiagnostics = () => {
  const keys = [
    { name: "NEXT_PUBLIC_FIREBASE_API_KEY", value: firebaseConfig.apiKey },
    { name: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", value: firebaseConfig.authDomain },
    { name: "NEXT_PUBLIC_FIREBASE_PROJECT_ID", value: firebaseConfig.projectId },
    { name: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", value: firebaseConfig.storageBucket },
    { name: "NEXT_PUBLIC_FIREBASE_APP_ID", value: firebaseConfig.appId },
  ];
  
  const missing = keys
    .filter(k => !k.value || k.value.trim() === "" || k.value.includes("your-") || k.value.includes("your_"))
    .map(k => k.name);

  return {
    isValid: missing.length === 0,
    missing
  };
};

const { isValid: isConfigValid, missing } = getConfigurationDiagnostics();

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;

if (typeof window !== "undefined") {
  if (isConfigValid) {
    try {
      app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      db = getFirestore(app);
      auth = getAuth(app);
      console.log("✅ TRS Intelligence: Firebase initialized successfully.");
    } catch (error) {
      console.error("❌ TRS Intelligence: Firebase initialization failed:", error);
    }
  } else {
    console.warn("⚠️ TRS Intelligence: Configuration incomplete. Missing keys:", missing.join(", "));
  }
}

export { app, db, auth, isConfigValid, missing };
