import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDktT2VEbi370SF9nFnAunvy4rFOFlkoBA",
  authDomain: "vibe-coding-875de.firebaseapp.com",
  projectId: "vibe-coding-875de",
  storageBucket: "vibe-coding-875de.firebasestorage.app",
  messagingSenderId: "564147720236",
  appId: "1:564147720236:web:a05046958ebba2d3c2c189",
  measurementId: "G-L6C5XQ5JJ6"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
