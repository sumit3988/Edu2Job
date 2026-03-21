import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { getUser, apiPost } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import './Prediction.css';

const roleIcons = {
  'Software Engineer': 'developer_mode',
  'Data Analyst': 'monitoring',
  'Frontend Developer': 'web',
  'Data Scientist': 'psychology',
  'ML Engineer': 'smart_toy',
  'Database Admin': 'storage',
  'DevOps Engineer': 'cloud',
  'Systems Analyst': 'analytics',
  'Backend Developer': 'dns',
  'Full Stack Developer': 'stacks',
  'Cloud Architect': 'cloud_circle',
  'Mechanical Engineer': 'precision_manufacturing',
  'Civil Engineer': 'architecture',
  'Electrical Engineer': 'bolt',
  'Business Analyst': 'query_stats',
  'HR Manager': 'groups',
  'Marketing Executive': 'campaign',
  'Chemical Engineer': 'science',
};
const roleCats = {
  'Software Engineer': 'Tech',
  'Data Analyst': 'Data',
  'Frontend Developer': 'Web',
  'Data Scientist': 'AI / ML',
  'ML Engineer': 'AI / ML',
  'Database Admin': 'Data',
  'DevOps Engineer': 'Cloud',
  'Systems Analyst': 'Tech',
  'Backend Developer': 'Tech',
  'Full Stack Developer': 'Web',
  'Cloud Architect': 'Cloud',
  'Mechanical Engineer': 'Core Engineer',
  'Civil Engineer': 'Core Engineer',
  'Electrical Engineer': 'Core Engineer',
  'Business Analyst': 'Business',
  'HR Manager': 'Business',
  'Marketing Executive': 'Business',
  'Chemical Engineer': 'Core Engineer',
};

const Prediction = () => {
  const navigate = useNavigate();
  const user = getUser();
  
  const [formData, setFormData] = useState({
    degree: 'B.Tech',
    branch: '',
    gpa: '3.8',
    specialization: '',
    skills: 'Python, React, SQL'
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setFormData(prev => ({
        ...prev,
        degree: user.degree || prev.degree,
        branch: user.branch || prev.branch,
        specialization: user.specialization || prev.specialization,
        gpa: user.gpa > 0 ? user.gpa : prev.gpa,
        skills: user.skills || prev.skills
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.skills) {
      setError('Please enter your skills');
      return;
    }
    setError(null);
    setLoading(true);
    setResults(null);

    const payload = {
      ...formData,
      specialization: formData.specialization.trim(),
      skills: formData.skills.trim(),
      gpa: parseFloat(formData.gpa) || 0,
      experience: 1,
      certifications: '',
    };

    try {
      const res = await apiPost('/prediction/predict', payload);
      setLoading(false);
      
      if (res.predictions) {
        setResults(res);
        const topPred = res.predictions[0];
        const predEntry = { role: topPred.role, confidence: Math.round(topPred.confidence), date: new Date().toLocaleDateString() };
        const saved = JSON.parse(localStorage.getItem('edu2job_predictions') || '[]');
        saved.push(predEntry);
        localStorage.setItem('edu2job_predictions', JSON.stringify(saved));

        try { await apiPost('/profile/predictions', predEntry); } catch (e) { console.warn('Could not save prediction to server:', e); }
      } else {
        setError(res.error || 'Prediction failed');
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Network error');
    }
  };

  return (
    <div className="app-layout">
      <Sidebar activePage="prediction" variant="light" />

      <div className="main-content">
        <header className="main-header">
          <h2>Career Prediction</h2>
        </header>

        <div className="page-content" style={{ maxWidth: '900px' }}>
          {error && <div className="toast toast-error" style={{ position: 'relative', top: 0, left: 0, right: 0, transform: 'none', marginBottom: '16px' }}>{error}</div>}

          <div className="pred-form-card">
            <h3>Prediction Parameters</h3>
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-grid-2" style={{ marginBottom: '20px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="degree" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-600)' }}>Degree Program</label>
                  <select id="degree" value={formData.degree} onChange={handleChange}>
                    <option value="B.Tech">B.Tech</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="B.Sc">B.Sc</option>
                    <option value="M.Sc">M.Sc</option>
                    <option value="BCA">BCA</option>
                    <option value="MCA">MCA</option>
                    <option value="B.E">B.E</option>
                    <option value="MBA">MBA</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="branch" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-600)' }}>Branch</label>
                  <select id="branch" value={formData.branch} onChange={handleChange}>
                    <option value="">Select Branch</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="IT">Information Technology</option>
                    <option value="ECE">Electronics & Communication</option>
                    <option value="EE">Electrical Engineering</option>
                    <option value="ME">Mechanical Engineering</option>
                    <option value="Civil">Civil Engineering</option>
                    <option value="Chemical">Chemical Engineering</option>
                    <option value="AI/ML">AI / ML</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="BBA">BBA</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="form-grid-2" style={{ marginBottom: '20px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="gpa" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-600)' }}>Current GPA</label>
                  <input type="number" id="gpa" value={formData.gpa} onChange={handleChange} placeholder="e.g. 3.8" step="0.1" />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="specialization" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-600)' }}>Specialization <span style={{ fontWeight: 400, color: 'var(--text-400)' }}>(optional)</span></label>
                  <input type="text" id="specialization" value={formData.specialization} onChange={handleChange} placeholder="e.g. Cloud Computing" />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="skills" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-600)' }}>Key Skills</label>
                <input type="text" id="skills" value={formData.skills} onChange={handleChange} placeholder="Python, React, SQL..." />
              </div>
              <button type="submit" className="btn btn-primary btn-full">Predict Top Roles</button>
            </form>
          </div>

          {loading && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="spinner"></div>
              <p style={{ color: 'var(--text-500)', marginTop: '12px' }}>Analyzing your profile...</p>
            </div>
          )}

          {results && (
            <div id="resultsSection" style={{ marginTop: '24px' }}>
              <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-800)', marginBottom: '16px' }}>Results</h4>
              <div>
                {results.predictions.map((p, i) => {
                  const icon = roleIcons[p.role] || 'work';
                  const cat = roleCats[p.role] || 'General';
                  const pct = Math.round(p.confidence);
                  const breakdown = p.education_score !== undefined
                    ? `Education: ${Math.round(p.education_score)}% · Skills: ${Math.round(p.skills_score)}% · Resume: ${Math.round(p.resume_score)}% · Certs: ${Math.round(p.certifications_score)}%`
                    : '';

                  return (
                    <div className="result-card" key={i}>
                      <div className="result-card-inner">
                        <div className="result-role-info">
                          <div className="result-role-icon"><span className="material-symbols-outlined">{icon}</span></div>
                          <div>
                            <div className="result-role-name">{p.role}</div>
                            <div className="result-role-cat">{cat}</div>
                          </div>
                        </div>
                        <div className="result-bar-container">
                          <div className="result-bar">
                            <div className="result-bar-fill" style={{ width: `${pct}%`, transition: 'width 1s ease-out' }}></div>
                          </div>
                          <span className="result-percent">{pct}%</span>
                        </div>
                      </div>
                      {breakdown && <div style={{ padding: '4px 16px 12px', fontSize: '0.75rem', color: 'var(--text-400)' }}>{breakdown}</div>}
                      {p.explanations?.length > 0 && (
                        <div style={{ padding: '0 16px 12px' }}>
                          {p.explanations.map((exp, j) => (
                            <div key={j} style={{ fontSize: '0.8rem', color: 'var(--text-500)', padding: '2px 0' }}>• {exp}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {results.explanation?.length > 0 && (
                <div className="explanation-card" style={{ marginTop: '24px' }}>
                  <h3><span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>lightbulb</span> AI Explanation</h3>
                  <ul className="explanation-list">
                    {results.explanation.map((exp, i) => <li key={i}>{exp}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prediction;
