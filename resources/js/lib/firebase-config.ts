import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyA_oavdZXsSArDqpsiMwh25bbrzyaBcWmQ',
  authDomain: 'leonz9000.firebaseapp.com',
  projectId: 'leonz9000',
  storageBucket: 'leonz9000.firebasestorage.app',
  messagingSenderId: '759403420385',
  appId: '1:759403420385:web:e2a1c1adfd48cf864075a0',
  measurementId: 'G-6713CD47DM',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Analytics (only in browser)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
