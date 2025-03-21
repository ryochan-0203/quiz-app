import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

function Quiz() {
  const { genreId, level } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const q = query(
          collection(db, 'quizzes'), 
          where('genre', '==', genreId), 
          where('level', '==', level)
        );
        
        const questionsSnapshot = await getDocs(q);
        const allQuestions = [];
        
        questionsSnapshot.forEach(doc => {
          allQuestions.push({
            id: doc.id,
            ...doc.data()
          });
        });

        // ランダムに5問選ぶ
        const randomQuestions = getRandomQuestions(allQuestions, 5);
        setQuestions(randomQuestions);
        setLoading(false);
      } catch (error) {
        console.error("問題の取得エラー:", error);
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [genreId, level]);

  const getRandomQuestions = (questions, count) => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
  };

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleShowExplanation = () => {
    if (selectedAnswer === null) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.answer === selectedAnswer) {
      setScore(score + 1);
    }
    
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);
    setSelectedAnswer(null);
    
    const nextQuestionIndex = currentQuestionIndex + 1;
    
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      // クイズ終了、結果ページへ
      navigate(`/result/${genreId}/${level}/${score}/${questions.map(q => q.id).join(',')}`);
    }
  };

  if (loading) {
    return <div className="container">問題を読み込み中...</div>;
  }

  if (questions.length === 0) {
    return (
      <div className="container">
        <h1>エラー</h1>
        <p>問題が見つかりませんでした。</p>
        <button onClick={() => navigate(`/genres/${genreId}`)}>レベル選択に戻る</button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-background">
      <div className="container quiz-container">
        {!showExplanation ? (
          <>
            <div className="question-header">
              <h2>問{currentQuestionIndex + 1}</h2>
            </div>
            
            <div className="question-content">
              <p className="question-text">{currentQuestion.text}</p>
            </div>
            
            <div className="answer-options">
              <button 
                className={`answer-btn correct-btn ${selectedAnswer === true ? 'selected' : ''}`}
                onClick={() => handleAnswer(true)}
              >
                ⭕
              </button>
              <button 
                className={`answer-btn incorrect-btn ${selectedAnswer === false ? 'selected' : ''}`}
                onClick={() => handleAnswer(false)}
              >
                ❌
              </button>
            </div>
            
            <div className="explanation-button-container">
              <button 
                onClick={handleShowExplanation} 
                className="explanation-btn"
                disabled={selectedAnswer === null}
              >
                <span className="book-icon">📖</span> 正解と解説
              </button>
            </div>
          </>
        ) : (
          <div className="explanation-screen">
            <div className="question-content">
              <p className="question-text">{currentQuestion.text}</p>
            </div>
            
            <div className="answer-result">
              <div className="user-answer">
                <p>あなたの解答は</p>
                <div className={`answer-icon ${selectedAnswer === currentQuestion.answer ? 'correct-answer' : 'incorrect-answer'}`}>
                  {selectedAnswer ? '⭕' : '❌'}
                </div>
                <div className="correct-label">
                  {selectedAnswer === currentQuestion.answer ? '正解' : '不正解'}
                </div>
              </div>
              
              <div className="correct-answer-section">
                <p>正解</p>
                <div className="answer-icon">
                  {currentQuestion.answer ? '⭕' : '❌'}
                </div>
              </div>
            </div>
            
            <div className="explanation-section">
              <h3>解説</h3>
              <p>{currentQuestion.explanation || "解説はありません。"}</p>
            </div>
            
            <div className="action-buttons">
              <button onClick={handleNextQuestion} className="next-btn">
                {currentQuestionIndex < questions.length - 1 ? '次の問題へ' : '結果を見る'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Quiz;