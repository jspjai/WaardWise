
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (!getApps().length) {
    let firebaseApp;
    try {
      // In web workstation, initializeApp() with no args might fail if auto-config isn't detected correctly.
      // We prioritize the explicit config object.
      firebaseApp = initializeApp(firebaseConfig);
    } catch (e) {
      console.warn('Initial Firebase initialization failed. Retrying...', e);
      firebaseApp = initializeApp(firebaseConfig);
    }
    return getSdks(firebaseApp);
  }
  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

/**
 * Creates a Firebase Auth account using a secondary app instance.
 * This allows an Admin to create users without being signed out of their own session.
 */
export async function createAuthAccountSecondary(email: string, password: string): Promise<string> {
  const secondaryAppName = `SecondaryAuth_${Date.now()}`;
  const secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
  const secondaryAuth = getAuth(secondaryApp);
  
  try {
    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    const uid = userCredential.user.uid;
    // Sign out the secondary instance immediately
    await signOut(secondaryAuth);
    // Cleanup the app instance
    await deleteApp(secondaryApp);
    return uid;
  } catch (error) {
    await deleteApp(secondaryApp);
    throw error;
  }
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
