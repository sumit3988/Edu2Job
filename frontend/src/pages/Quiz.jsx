import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { getUser, apiGet, apiPost } from '../utils/api';
import './Quiz.css';

const Quiz = () => {
  const [searchParams] = useSearchParams();
  const subject = searchParams.get('subject');
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!getUser()) {
      navigate('/login');
      return;
    }
    if (!subject) {
      navigate('/interview');
      return;
    }

    const loadQuiz = async () => {
      try {
        const res = await apiGet(`/quiz/${subject}`);
        if (res.error) {
          setError(res.error);
        } else {
          setQuizData(res);
        }
      } catch (e) {
        setError('Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [subject, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quizData) return;

    let calculatedScore = 0;
    const formData = new FormData(e.target);

    quizData.questions.forEach(q => {
      const selected = formData.get(`q_${q.id}`);
      if (selected === q.ans) {
        calculatedScore++;
      }
    });

    setScore(calculatedScore);
    setCompleted(true);

    try {
      await apiPost('/quiz/submit', {
        subject: quizData.subject,
        score: calculatedScore,
        date: new Date().toLocaleDateString('en-GB')
      });
      setSuccess('Score saved to profile!');
    } catch (err) {
      setError('Could not save score');
    }
  };

  return (
    <div className="app-layout">
      <Sidebar activePage="interview" variant="dark" />

      <div className="main-content">
        <header className="main-header">
          <h2>Mock Test</h2>
          <div className="header-actions">
            <div className="header-avatar" id="headerAvatar">
              {getUser()?.full_name?.charAt(0)?.toUpperCase()}
            </div>
          </div>
        </header>

        <div className="page-content quiz-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          {(error || success) && (
            <div className={`toast toast-${error ? 'error' : 'success'}`} style={{ position: 'relative', top: 0, left: 0, right: 0, transform: 'none', marginBottom: '16px' }}>
              {error || success}
            </div>
          )}

          {loading && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="spinner"></div>
              <p>Loading questions...</p>
            </div>
          )}

          {!loading && quizData && !completed && (
            <form onSubmit={handleSubmit}>
              <div className="quiz-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                <div className="quiz-title" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-900)' }}>{quizData.subject} Mock Test</div>
                <div className="text-secondary">{quizData.questions.length} Questions</div>
              </div>
              
              <div>
                {quizData.questions.map((q, index) => (
                  <div className="question-card" key={q.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
                    <div className="question-text" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-900)', marginBottom: '16px' }}>{index + 1}. {q.q}</div>
                    <div className="options-grid" style={{ display: 'grid', gap: '12px' }}>
                      {q.options.map((opt, optIdx) => (
                        <label className="option-label" key={optIdx} style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', background: 'var(--bg)' }}>
                          <input type="radio" name={`q_${q.id}`} value={opt} required style={{ marginRight: '12px', accentColor: 'var(--primary)' }} />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <button type="submit" className="btn btn-primary" style={{ marginTop: '24px', width: '100%' }}>Submit Test</button>
            </form>
          )}

          {completed && quizData && (
            <div className="result-section" style={{ textAlign: 'center', padding: '40px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', marginTop: '40px' }}>
              <h2 style={{ marginBottom: '24px' }}>Test Completed!</h2>
              <div className="score-circle" style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #7c3aed)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800, margin: '0 auto 24px', boxShadow: '0 10px 25px rgba(79,70,229,0.3)' }}>
                {score}
              </div>
              <p className="text-secondary" style={{ marginBottom: '32px', fontSize: '1.1rem' }}>
                You scored <b>{score}</b> out of <b>{quizData.questions.length}</b>.
              </p>
              <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
              <Link to="/interview" className="btn btn-outline" style={{ marginLeft: '12px' }}>Take Another Test</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
