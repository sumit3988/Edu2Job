import React, { useEffect, useState, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { getUser, apiGet, apiPost } from '../utils/api';
import { motion } from 'framer-motion';
import './MockInterview.css';

const MockInterview = () => {
  const [searchParams] = useSearchParams();
  const subject = searchParams.get('subject') || 'python';
  const navigate = useNavigate();
  const user = getUser();

  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [hasStarted, setHasStarted] = useState(false);
  
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  
  const [feedback, setFeedback] = useState(null);
  const [gamification, setGamification] = useState(null);

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }

    const fetchQuestions = async () => {
      try {
        const res = await apiGet(`/mock-interview/questions/${encodeURIComponent(subject)}`);
        if (res.questions) {
          setQuestions(res.questions);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuestions();

    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript + ' ';
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        setCurrentTranscript(prev => final ? prev + final : prev + interim);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [subject, navigate, user]);

  const speakText = (text, onEndCallback) => {
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    
    // Choose a realistic English voice if available
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes('en-US') && v.name.includes('Google'));
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      if (onEndCallback) onEndCallback();
    };
    synthRef.current.speak(utterance);
  };

  const startInterview = () => {
    setHasStarted(true);
    setCurrentIdx(0);
    if (questions.length > 0) {
      // Intro speech
      speakText(`Welcome to your ${subject.toUpperCase()} mock interview. Let's begin. ${questions[0].q}`);
    }
  };

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (synthRef.current.speaking) synthRef.current.cancel();
      setCurrentTranscript(answers[questions[currentIdx].id] || '');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  useEffect(() => {
    if (currentTranscript && !isListening) {
      setAnswers(prev => ({
        ...prev,
        [questions[currentIdx].id]: currentTranscript
      }));
    }
  }, [currentTranscript, isListening, currentIdx, questions]);

  const handleNext = () => {
    // Save current transcript
    if (isListening) toggleListen();
    
    setAnswers(prev => ({
      ...prev,
      [questions[currentIdx].id]: currentTranscript
    }));
    setCurrentTranscript('');

    if (currentIdx < questions.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      speakText(`Okay, next question. ${questions[nextIdx].q}`);
    } else {
      finishInterview();
    }
  };

  const finishInterview = async () => {
    if (synthRef.current.speaking) synthRef.current.cancel();
    speakText("Thank you, that concludes our interview. Let me evaluate your answers.");

    // Final answer update from transcript
    const finalAnswers = { ...answers };
    if (currentTranscript) {
       finalAnswers[questions[currentIdx].id] = currentTranscript;
    }

    try {
      // 1. Evaluate
      const evalRes = await apiPost('/mock-interview/evaluate', {
        subject,
        answers: finalAnswers
      });
      setFeedback(evalRes);

      // 2. Award gamification points
      const pointsEarned = evalRes.score * 10;
      const gameRes = await apiPost('/gamification/award', { points: pointsEarned });
      setGamification(gameRes);
      
    } catch (err) {
      console.error(err);
    }
  };

  if (!hasStarted) {
    return (
      <div className="app-layout">
        <Sidebar activePage="interview" />
        <div className="main-content">
          <div className="mock-interview-container">
            <motion.div className="onboarding-epic" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <h2>AI Mock Interviewer</h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-700)', marginBottom: '40px' }}>
                You are about to start a realistic audio mock interview for <b>{subject.toUpperCase()}</b>. 
                Make sure your microphone is working. The AI will ask you questions out loud, and you'll hold to speak your response.
              </p>
              {questions.length > 0 ? (
                <button className="btn btn-epic-full" onClick={startInterview}>
                  <span className="material-symbols-outlined">play_arrow</span> Start Interview
                </button>
              ) : (
                <div className="spinner-epic"><span className="material-symbols-outlined spinner-icon-epic">sync</span></div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar activePage="interview" />
      <div className="main-content">
        <div className="mock-interview-container">
          
          {!feedback ? (
            <motion.div className="interview-session-epic" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* AI Avatar */}
              <div className="avatar-container">
                <div className={`ai-avatar ${isSpeaking ? 'speaking' : ''}`}>
                  <span className="material-symbols-outlined" style={{ fontSize: '4rem' }}>person</span>
                </div>
                <div className="avatar-ring"></div>
                <div className="avatar-ring"></div>
              </div>

              {/* Controls and Q/A */}
              <div className="interview-controls">
                <div className="question-text-epic">
                  "{questions[currentIdx]?.q}"
                </div>

                {!recognitionRef.current ? (
                  <p className="text-danger">Speech recognition is not supported in this browser.</p>
                ) : (
                  <button 
                    className={`mic-button-epic ${isListening ? 'listening' : ''}`}
                    onMouseDown={toggleListen}
                    onMouseUp={toggleListen}
                    onTouchStart={toggleListen}
                    onTouchEnd={toggleListen}
                  >
                    <span className="material-symbols-outlined">{isListening ? 'mic' : 'mic_none'}</span>
                  </button>
                )}

                <p style={{ color: 'var(--text-500)', fontSize: '0.9rem', marginBottom: '20px' }}>
                  {isListening ? 'Listening... release to stop.' : 'Hold the microphone to answer.'}
                </p>

                <div className="transcript-epic">
                  {currentTranscript || answers[questions[currentIdx]?.id] || "No answer recorded yet."}
                </div>

                <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '800', color: 'var(--primary)' }}>Question {currentIdx + 1} / {questions.length}</span>
                  <button className="btn btn-epic-primary" onClick={handleNext}>
                    {currentIdx === questions.length - 1 ? 'Finish Interview' : 'Next Question'} <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div className="feedback-session-epic" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              
              {gamification && (
                <div className="gamification-summary">
                  <h2 style={{ fontSize: '2rem', margin: 0, color: 'var(--text-900)' }}>Interview Completed!</h2>
                  <div className="gamification-stats">
                    <div className="gamification-stat">
                      <span className="value">+{gamification.points_added}</span>
                      <span className="label">Points Earned</span>
                    </div>
                    <div className="gamification-stat">
                      <span className="value">🔥 {gamification.streak}</span>
                      <span className="label">Day Streak</span>
                    </div>
                    {gamification.title_upgraded && (
                      <div className="gamification-stat">
                        <span className="value">🏆 {gamification.title}</span>
                        <span className="label">Title Unlocked!</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <h3 style={{ fontSize: '1.8rem', color: 'var(--text-900)' }}>Detailed Feedback</h3>
              {feedback.results.map((res, i) => (
                <div key={res.id} className={`feedback-card-epic ${res.passed ? 'passed' : 'failed'}`}>
                  <div className="feedback-q">Q{i + 1}: {res.q}</div>
                  <div className="feedback-a">"{res.user_answer || 'No answer provided'}"</div>
                  <div className="feedback-msg">
                    {res.passed ? <span className="material-symbols-outlined" style={{color: '#10b981', verticalAlign: 'middle'}}>check_circle</span> : <span className="material-symbols-outlined" style={{color: '#ef4444', verticalAlign: 'middle'}}>cancel</span>}
                    {' '}{res.feedback}
                  </div>
                </div>
              ))}

              <div style={{ marginTop: '40px', textAlign: 'center' }}>
                <Link to="/interview" className="btn btn-epic-glass">Back to Interviews</Link>
                <Link to="/dashboard" className="btn btn-epic-primary" style={{ marginLeft: '16px' }}>Go to Dashboard</Link>
              </div>

            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};

export default MockInterview;
