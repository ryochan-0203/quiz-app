import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const { loginWithGoogle } = useAuth();

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("ログインエラー:", error);
    }
  };

  return (
    <div className="container">
      <h1>クイズアプリ</h1>
      <p style={{ marginBottom: '2rem', textAlign: 'center' }}>
        さまざまなジャンルのクイズに挑戦しよう！
      </p>
      <button 
        onClick={handleLogin} 
        className="google-btn"
      >
        Googleでログイン
      </button>
    </div>
  );
}

export default Login;
