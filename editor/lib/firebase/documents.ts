import { adminDb } from './config';
import { FieldValue } from 'firebase-admin/firestore';

export async function createDocument(uid: string, fileName: string, templateType: string) {
  const newDocRef = adminDb.collection('users').doc(uid).collection('drafts').doc();
  const newFileId = newDocRef.id;

  await newDocRef.set({
    fileId: newFileId,
    fileName,
    templateType,
    createdAt: FieldValue.serverTimestamp(),
  });

  return newFileId;
}

export async function getDocument(uid: string, fileId: string) {
  const doc = await adminDb.collection('users').doc(uid).collection('drafts').doc(fileId).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
}
