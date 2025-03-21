import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);

  async function loginWithGoogle() {
    return signInWithPopup(auth, googleProvider);
  }

  function logout() {
    return signOut(auth);
  }

  async function fetchUserProgress(userId) {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setUserProgress(userDoc.data().progress || {});
      } else {
        // 新規ユーザーの場合、初期進捗データを作成
        const initialProgress = {};
        await setDoc(userDocRef, {
          email: auth.currentUser.email,
          displayName: auth.currentUser.displayName,
          progress: initialProgress
        });
        setUserProgress(initialProgress);
      }
    } catch (error) {
      console.error("ユーザーデータの取得に失敗しました:", error);
    }
  }

  async function updateUserProgress(genreId, level) {
    try {
      if (!currentUser) return;

      const updatedProgress = { ...userProgress };
      if (!updatedProgress[genreId]) {
        updatedProgress[genreId] = {};
      }
      updatedProgress[genreId][level] = true;

      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(userDocRef, { progress: updatedProgress }, { merge: true });
      setUserProgress(updatedProgress);
    } catch (error) {
      console.error("進捗の更新に失敗しました:", error);
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async user => {
      setCurrentUser(user);
      if (user) {
        await fetchUserProgress(user.uid);
      } else {
        setUserProgress({});
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProgress,
    loginWithGoogle,
    logout,
    updateUserProgress
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
