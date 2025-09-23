import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCfvEpmrQhozQSYgIXzccUdVtwyDxN4l8",
  authDomain: "legalease-prod.firebaseapp.com",
  databaseURL: "https://legalease-prod-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "legalease-prod",
  storageBucket: "legalease-prod.firebasestorage.app",
  messagingSenderId: "350135218428",
  appId: "1:350135218428:web:9c0a1af738194456e8a779",
  measurementId: "G-2M7FSZYDZF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser environment)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Firestore
export const db = getFirestore(app);

export { analytics };
export default app;
