import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAu6LhQas4xkfRldBpAeQPrYNnpjAQBfVo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "nasyidappv2.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "nasyidappv2",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "nasyidappv2.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "174841572485",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:174841572485:android:b84f6ca57a852470f64dec"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
