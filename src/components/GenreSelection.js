import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function GenreSelection() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  useEffect(() => {
    async function fetchGenres() {
      try {
        const genresSnapshot = await getDocs(collection(db, 'genres'));
        const genresList = [];
        genresSnapshot.forEach(doc => {
          genresList.push({
            id: doc.id,
            ...doc.data()
          });
        });
        setGenres(genresList);
        setLoading(false);
      } catch (error) {
        console.error("ジャンルの取得エラー:", error);
        setLoading(false);
      }
    }

    fetchGenres();
  }, []);

  const handleGenreSelect = (genreId) => {
    navigate(`/genres/${genreId}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("ログアウトエラー:", error);
    }
  };

  if (loading) {
    return <div className="container">読み込み中...</div>;
  }

  return (
    <div className="container">
      <h1>ジャンル</h1>
      {genres.length > 0 ? (
        genres.map(genre => (
          <div 
            key={genre.id} 
            className="card"
            onClick={() => handleGenreSelect(genre.id)}
          >
            <h3>{genre.name}</h3>
          </div>
        ))
      ) : (
        <p>ジャンルがありません。管理者にお問い合わせください。</p>
      )}
      <button className="btn-secondary" onClick={handleLogout}>ログアウト</button>
    </div>
  );
}

export default GenreSelection;