import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebaseプロジェクトの設定情報
const firebaseConfig = {
  apiKey: "AIzaSyCYGYGdGVb0vzBVxnnX15SKc9PX5WPF2kw",
  authDomain: "ibs-quiz-app.firebaseapp.com",
  projectId: "ibs-quiz-app",
  storageBucket: "ibs-quiz-app.firebasestorage.app",
  messagingSenderId: "329582154534",
  appId: "1:329582154534:web:558cd778c32d9945b8a7e7",
  measurementId: "G-J5WDV5XJK8"
};

// Firebaseの初期化
const app = initializeApp(firebaseConfig);

// Authentication、Firestoreのエクスポート
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
