import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

function Result() {
  const { genreId, level, score, questionIds } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { updateUserProgress } = useAuth();
  const totalQuestions = 5;
  const scoreNum = parseInt(score);
  const isPerfect = scoreNum === totalQuestions;

  useEffect(() => {
    // 全問正解の場合は進捗を更新
    if (isPerfect) {
      updateUserProgress(genreId, level);
    }
    
    // 問題の詳細を取得
    async function fetchQuestionDetails() {
      try {
        if (!questionIds) return;
        
        const ids = questionIds.split(',');
        const questionData = [];
        
        for (const id of ids) {
          const questionDoc = await getDoc(doc(db, 'quizzes', id));
          if (questionDoc.exists()) {
            questionData.push({
              id: questionDoc.id,
              ...questionDoc.data()
            });
          }
        }
        
        setQuestions(questionData);
        setLoading(false);
      } catch (error) {
        console.error("問題の詳細取得エラー:", error);
        setLoading(false);
      }
    }
    
    fetchQuestionDetails();
  }, [isPerfect, updateUserProgress, genreId, level, questionIds]);

  const handleRetry = () => {
    navigate(`/quiz/${genreId}/${level}`);
  };

  const handleBackToLevels = () => {
    navigate(`/genres/${genreId}`);
  };

  return (
    <div className="quiz-background">
      <div className="container result-container">
        <h1>結果</h1>
        
        <h2>スコア: {score}/{totalQuestions}</h2>
        
        <div>
          {isPerfect ? (
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', textAlign: 'center', color: '#2ecc71', fontWeight: 'bold' }}>
              🎉 おめでとうございます！全問正解です！ 🎉
            </p>
          ) : (
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', textAlign: 'center', color: '#e74c3c', fontWeight: 'bold' }}>
              残念！もう一度挑戦してみましょう。
            </p>
          )}
        </div>
        
        {!loading && questions.length > 0 && (
          <div className="questions-review">
            <h3>問題の復習</h3>
            {questions.map((question, index) => (
              <div key={question.id} className="question-review-card">
                <div className="review-question-header">問{index + 1}</div>
                <p className="review-question-text">{question.text}</p>
                <div className="review-answer">
                  <span>正解: </span>
                  <span className={`review-answer-icon ${question.answer ? 'correct' : 'incorrect'}`}>
                    {question.answer ? '⭕' : '❌'}
                  </span>
                </div>
                <div className="review-explanation">
                  <h4>解説</h4>
                  <p>{question.explanation || "解説はありません。"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="result-actions">
          <button onClick={handleRetry} className="retry-btn">もう一度挑戦</button>
          <button onClick={handleBackToLevels} className="back-btn">レベル選択に戻る</button>
        </div>
      </div>
    </div>
  );
}

export default Result;