import { adminDb } from '../../../lib/firebase/config';
import { FieldValue } from 'firebase-admin/firestore';

if (!adminDb) {
  console.error('Firebase Admin is not properly initialized');
  throw new Error('Firebase Admin is not properly initialized');
}

export async function createDocument(uid: string, fileName: string, templateType: string): Promise<string> {
  try {
    if (!adminDb) {
      throw new Error('Firebase Admin is not properly initialized');
    }

    const newDocRef = adminDb.collection('users').doc(uid).collection('drafts').doc();
    const newFileId = newDocRef.id;

    await newDocRef.set({
      fileId: newFileId,
      fileName,
      templateType,
      createdAt: FieldValue.serverTimestamp(),
      caseId: "",
    });

    return newFileId;
  } catch (error) {
    console.error('Error in createDocument:', error);
    throw new Error(`Failed to create document: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function getDocument(uid: string, fileId: string) {
  try {
    if (!adminDb) {
      throw new Error('Firebase Admin is not properly initialized');
    }

    const doc = await adminDb.collection('users').doc(uid).collection('drafts').doc(fileId).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  } catch (error) {
    console.error('Error in getDocument:', error);
    throw new Error(`Failed to get document: ${error instanceof Error ? error.message : String(error)}`);
  }
}
