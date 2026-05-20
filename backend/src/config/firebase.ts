import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;

if (serviceAccountBase64) {
  try {
    const serviceAccount = JSON.parse(
      Buffer.from(serviceAccountBase64, 'base64').toString('utf8')
    );
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error) {
    console.error('Error parsing Firebase service account B64:', error);
  }
} else {
  // Fallback for local development/testing without real credentials
  console.warn(
    'WARNING: Firebase service account not provided. Using mocked configuration.'
  );
}

export const db = serviceAccountBase64 ? admin.firestore() : null;
export const messaging = serviceAccountBase64 ? admin.messaging() : null;
export const auth = serviceAccountBase64 ? admin.auth() : null;
export default admin;
