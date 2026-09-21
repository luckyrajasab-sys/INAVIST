import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Official Firebase Web Configuration for project 'inavist'
const firebaseConfig = {
  apiKey: import.meta?.env?.VITE_FIREBASE_API_KEY || "AIzaSyD_4L3FlrIvTzDTPFFHusXYEqLSGDBAkFI",
  authDomain: import.meta?.env?.VITE_FIREBASE_AUTH_DOMAIN || "inavist.firebaseapp.com",
  projectId: import.meta?.env?.VITE_FIREBASE_PROJECT_ID || "inavist",
  storageBucket: import.meta?.env?.VITE_FIREBASE_STORAGE_BUCKET || "inavist.firebasestorage.app",
  messagingSenderId: import.meta?.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "73992042213",
  appId: import.meta?.env?.VITE_FIREBASE_APP_ID || "1:73992042213:web:a50ef66a596f746d44c60c",
  measurementId: import.meta?.env?.VITE_FIREBASE_MEASUREMENT_ID || "G-ZN8TF8827N"
};

// Safely initialize Firebase app
export const app = getApps().length > 0 
  ? getApp() 
  : initializeApp(firebaseConfig);

import { getDataConnect } from "firebase/data-connect";
import { connectorConfig } from "../dataconnect/esm/index.esm.js";

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const dataConnect = getDataConnect(app, connectorConfig);

// Authentication Providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export default app;
