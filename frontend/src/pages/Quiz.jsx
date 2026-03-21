import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { getUser, apiGet, apiPost } from '../utils/api';
import { motion } from 'framer-motion';
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
      setSuccess('Score recorded in matrix!');
    } catch (err) {
      setError('Could not record score');
    }
  };

  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200 } }
  };

  return (
    <div className="app-layout">
      <Sidebar activePage="interview" />

      <div className="main-content">
        <header className="main-header">
          <h2>Combat Arena</h2>
          <div className="header-actions">
            <div className="header-avatar" id="headerAvatar">
              {getUser()?.full_name?.charAt(0)?.toUpperCase()}
            </div>
          </div>
        </header>

        <div className="page-content quiz-container-inner-epic">
          {(error || success) && (
            <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} className={`toast-epic toast-${error ? 'error' : 'success'}`}>
              <span className="material-symbols-outlined">{error ? 'error' : 'check_circle'}</span>
              {error || success}
            </motion.div>
          )}

          {loading && (
            <div className="loading-container-epic">
              <div className="spinner-epic"><span className="material-symbols-outlined spinner-icon-epic">sync</span></div>
              <p>Spinning up virtual arena...</p>
            </div>
          )}

          {!loading && quizData && !completed && (
            <motion.form onSubmit={handleSubmit} variants={containerVars} initial="hidden" animate="visible" className="quiz-form-epic">
              <motion.div className="quiz-header-top-epic" variants={itemVars}>
                <div className="quiz-title-main-epic">{quizData.subject} Simulation</div>
                <div className="quiz-meta-epic">{quizData.questions.length} Nodes</div>
              </motion.div>
              
              <div className="questions-wrapper-epic">
                {quizData.questions.map((q, index) => (
                  <motion.div className="question-card-epic" key={q.id} variants={itemVars}>
                    <div className="question-text-epic">{index + 1}. {q.q}</div>
                    <div className="options-grid-epic">
                      {q.options.map((opt, optIdx) => (
                        <label className="option-label-epic" key={optIdx}>
                          <input type="radio" name={`q_${q.id}`} value={opt} required className="option-input-epic" />
                          <span className="custom-radio"></span>
                          {opt}
                        </label>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <motion.button type="submit" className="btn btn-primary btn-epic-full" variants={itemVars}>
                <span className="material-symbols-outlined">rocket_launch</span> Execute Sequence
              </motion.button>
            </motion.form>
          )}

          {completed && quizData && (
            <motion.div className="result-section-epic" initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} transition={{type: 'spring', stiffness: 200, damping: 20}}>
              <div className="result-glow-epic"></div>
              <h2 className="result-title-epic">Simulation Completed</h2>
              <div className="score-circle-epic">
                <div className="score-ring"></div>
                <span>{score}</span>
              </div>
              <p className="score-text-epic">
                You synchronized <b>{score}</b> out of <b>{quizData.questions.length}</b> nodes.
              </p>
              <div className="result-actions-epic">
                <Link to="/dashboard" className="btn btn-epic-glass"><span className="material-symbols-outlined">dashboard</span> Dashboard</Link>
                <Link to="/interview" className="btn btn-epic-primary"><span className="material-symbols-outlined">replay</span> Reload Arena</Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
