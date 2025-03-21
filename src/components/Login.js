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
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" 
          alt="Google Logo" 
        />
        Googleでログイン
      </button>
    </div>
  );
}

export default Login;
