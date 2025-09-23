import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminDb: Firestore;

// Check if we're running in a server-side environment
const isServer = typeof window === 'undefined';

if (isServer) {
  // Get service account from environment variables
  const serviceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  // Verify required environment variables
  if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
    console.error('Missing Firebase Admin SDK environment variables');
    console.log('Project ID:', serviceAccount.projectId ? 'Set' : 'Missing');
    console.log('Client Email:', serviceAccount.clientEmail ? 'Set' : 'Missing');
    console.log('Private Key:', serviceAccount.privateKey ? 'Set' : 'Missing');
  } else {
    try {
      // Initialize Firebase Admin
      if (!getApps().length) {
        initializeApp({
          credential: cert({
            projectId: serviceAccount.projectId,
            clientEmail: serviceAccount.clientEmail,
            privateKey: serviceAccount.privateKey,
          }),
          databaseURL: `https://${serviceAccount.projectId}.firebaseio.com`
        });
        console.log('Firebase Admin initialized successfully');
      }
      
      adminDb = getFirestore();
    } catch (error) {
      console.error('Firebase admin initialization error', error);
    }
  }
} else {
  console.warn('Firebase Admin should only be used server-side');
}

export { adminDb };
