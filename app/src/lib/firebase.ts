import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Data diambil dari file .env.local Anda
const firebaseConfig = {
  apiKey: "AIzaSyAx3tFrqhMgc6UKweK2UQxgdVIAK3dpiL4",
  authDomain: "rekap-5eea3.firebaseapp.com",
  projectId: "rekap-5eea3",
  storageBucket: "rekap-5eea3.firebasestorage.app",
  messagingSenderId: "366619424542",
  appId: "1:366619424542:web:6e7a6fb5f321f59a147b0f",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
