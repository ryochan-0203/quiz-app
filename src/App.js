import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import GenreSelection from './components/GenreSelection';
import LevelSelection from './components/LevelSelection';
import Quiz from './components/Quiz';
import Result from './components/Result';
import './App.css';

function App() {
  const { currentUser } = useAuth();

  return (
    <div className="App">
      <Routes>
        <Route 
          path="/" 
          element={currentUser ? <Navigate to="/genres" /> : <Login />} 
        />
        <Route 
          path="/genres" 
          element={currentUser ? <GenreSelection /> : <Navigate to="/" />} 
        />
        <Route 
          path="/genres/:genreId" 
          element={currentUser ? <LevelSelection /> : <Navigate to="/" />} 
        />
        <Route 
          path="/quiz/:genreId/:level" 
          element={currentUser ? <Quiz /> : <Navigate to="/" />} 
        />
        <Route 
          path="/result/:genreId/:level/:score/:questionIds" 
          element={currentUser ? <Result /> : <Navigate to="/" />} 
        />
      </Routes>
    </div>
  );
}

export default App;