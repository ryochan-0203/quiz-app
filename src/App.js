import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import './App.css';

function App() {
  const { currentUser } = useAuth();

  return (
    <div className="App">
      <Routes>
        <Route 
          path="/" 
          element={currentUser ? <div>ログイン成功！</div> : <Login />} 
        />
      </Routes>
    </div>
  );
}

export default App;
