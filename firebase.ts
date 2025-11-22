import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// User provided configuration for biomednlp-8432a
const firebaseConfig = {
  apiKey: "AIzaSyAci8d-gdQIu-1p_uk8HVX4hZwmOMKGeSs",
  authDomain: "biomednlp-8432a.firebaseapp.com",
  databaseURL: "https://biomednlp-8432a.firebaseio.com",
  projectId: "biomednlp-8432a",
  storageBucket: "biomednlp-8432a.firebasestorage.app",
  messagingSenderId: "13674372711",
  appId: "1:13674372711:web:b8ced23c5dc40c13c07ec2",
  measurementId: "G-NWVREBLTWT"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;