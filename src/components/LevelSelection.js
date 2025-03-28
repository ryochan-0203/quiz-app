import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

function LevelSelection() {
  const { genreId } = useParams();
  const [genre, setGenre] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { userProgress } = useAuth();

  useEffect(() => {
    async function fetchGenre() {
      try {
        const genreDocRef = doc(db, 'genres', genreId);
        const genreDoc = await getDoc(genreDocRef);
        
        if (genreDoc.exists()) {
          setGenre({
            id: genreDoc.id,
            ...genreDoc.data()
          });
        } else {
          console.error("ジャンルが見つかりません");
          navigate('/genres');
        }
        setLoading(false);
      } catch (error) {
        console.error("ジャンルの取得エラー:", error);
        setLoading(false);
      }
    }

    fetchGenre();
  }, [genreId, navigate]);

  const isLevelUnlocked = (level) => {
    const levels = ['beginner', 'intermediate', 'advanced'];
    const levelIndex = levels.indexOf(level);
    
    // 初級は常に解放
    if (levelIndex === 0) return true;
    
    // 前のレベルがクリアされているか確認
    const previousLevel = levels[levelIndex - 1];
    return userProgress[genreId] && userProgress[genreId][previousLevel];
  };

  const handleLevelSelect = (level) => {
    if (isLevelUnlocked(level)) {
      navigate(`/quiz/${genreId}/${level}`);
    }
  };

  const handleBack = () => {
    navigate('/genres');
  };

  if (loading) {
    return <div className="container">読み込み中...</div>;
  }

  return (
    <div className="container">
      <h1>{genre?.name}</h1>
      
      {['beginner', 'intermediate', 'advanced'].map((level) => {
        const unlocked = isLevelUnlocked(level);
        // 日本語の難易度表示を設定
        const levelJapanese = {
          'beginner': '初級',
          'intermediate': '中級',
          'advanced': '上級'
        };
        
        return (
          <div 
            key={level} 
            className={`card ${!unlocked ? 'locked' : ''}`}
            onClick={() => unlocked && handleLevelSelect(level)}
          >
            <h3>{levelJapanese[level]}</h3>
            {!unlocked }
          </div>
        );
      })}
      
      <button className="btn-secondary" onClick={handleBack}>ジャンル選択に戻る</button>
    </div>
  );
}

export default LevelSelection;