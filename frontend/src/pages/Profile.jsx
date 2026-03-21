import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import { getUser, apiGet, apiPost, updateStoredUser, getToken } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const API_BASE = 'http://localhost:5000';

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [userState, setUserState] = useState(null);
  const [formData, setFormData] = useState({
    degree: '',
    branch: '',
    gpa: '',
    specialization: '',
    experience: '',
    certifications: '',
    skills: ''
  });

  const [skillsList, setSkillsList] = useState([]);
  const [skillInput, setSkillInput] = useState('');

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let u = getUser();
    if (!u) {
      navigate('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        const res = await apiGet('/profile/me');
        if (res?.user) {
          u = res.user;
          localStorage.setItem('edu2job_user', JSON.stringify(u));
        }
      } catch (err) {
        console.warn('Could not fetch profile from server, using localStorage:', err);
      }
      setUserState(u);
      setFormData({
        degree: u.degree || '',
        branch: u.branch || '',
        gpa: u.gpa || '',
        specialization: u.specialization || '',
        experience: u.experience || '',
        certifications: u.certifications || '',
      });
      if (u.skills) {
        const parsedSkills = u.skills.split(',').map(s => s.trim()).filter(Boolean);
        setSkillsList(parsedSkills);
      }
    };

    loadProfile();
  }, [navigate]);

  const showToast = (msg, type = 'success') => {
    if (type === 'error') setError(msg);
    else setSuccess(msg);
    setTimeout(() => { setError(''); setSuccess(''); }, 3200);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = skillInput.trim();
      if (val && !skillsList.includes(val)) {
        setSkillsList([...skillsList, val]);
      }
      setSkillInput('');
    }
  };

  const removeSkill = (name) => {
    setSkillsList(skillsList.filter(s => s !== name));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      gpa: parseFloat(formData.gpa) || 0,
      experience: parseInt(formData.experience, 10) || 0,
      skills: skillsList.join(','),
    };
    try {
      const res = await apiPost('/profile/update', data);
      if (res.message) {
        updateStoredUser(data);
        showToast('Profile saved!', 'success');
      } else {
        showToast(res.error || 'Update failed', 'error');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Resume Upload Handlers
  const handleZoneClick = () => fileInputRef.current.click();
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };
  const handleFileChange = (e) => {
    if (e.target.files.length) {
      setSelectedFile(e.target.files[0]);
    }
  };
  const removeSelectedFile = () => setSelectedFile(null);

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    const data = new FormData();
    data.append('resume', selectedFile);

    setUploading(true);
    try {
      const token = getToken();
      const res = await fetch(API_BASE + '/resume/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data,
      });
      const parsedRes = await res.json();
      setUploading(false);

      if (res.ok) {
        showToast('Resume uploaded & parsed!', 'success');
        if (parsedRes.parsed) {
          const p = parsedRes.parsed;
          setFormData(prev => ({
            ...prev,
            degree: p.degree || prev.degree,
            branch: p.branch || prev.branch,
            gpa: p.gpa > 0 ? p.gpa : prev.gpa,
            experience: p.experience > 0 ? p.experience : prev.experience,
            certifications: p.certifications || prev.certifications,
          }));
          if (p.skills && p.skills.length) {
            setSkillsList(Array.from(new Set([...skillsList, ...p.skills])));
          }

          updateStoredUser({
            degree: p.degree || '',
            gpa: p.gpa || 0,
            experience: p.experience || 0,
            certifications: p.certifications || '',
            skills: (p.skills || []).join(','),
          });
          
          showToast(`Extracted: ${p.skills ? p.skills.length : 0} skills, degree: ${p.degree || 'N/A'}`, 'success');
        }
      } else {
        showToast(parsedRes.error || 'Upload failed', 'error');
      }
    } catch (err) {
      setUploading(false);
      showToast(err.message || 'Upload error', 'error');
    }
    removeSelectedFile();
  };

  return (
    <div className="app-layout">
      <Sidebar activePage="profile" variant="light" />

      <div className="main-content">
        <header className="main-header">
          <h2>Profile & Resume</h2>
          <div className="header-actions">
            <button className="notification-btn">
              <span className="material-symbols-outlined">notifications</span>
              <span className="notification-dot"></span>
            </button>
          </div>
        </header>

        <div className="page-content">
          {(error || success) && (
             <div className={`toast toast-${error ? 'error' : 'success'}`} style={{ position: 'relative', top: 0, left: 0, right: 0, transform: 'none', marginBottom: '16px' }}>
               {error || success}
             </div>
          )}

          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-900)', marginBottom: '4px' }}>Complete Your Profile</h3>
            <p style={{ color: 'var(--text-500)' }}>Update your student information and upload your latest resume to get matched with top opportunities.</p>
          </div>

          <div className="profile-grid">
            <div className="profile-card">
              <h4>
                <span className="material-symbols-outlined">account_circle</span>
                Student Information Form
              </h4>
              <form onSubmit={handleSaveProfile} noValidate>
                <div className="form-row" style={{ marginBottom: '20px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="degree">Degree Program</label>
                    <select id="degree" value={formData.degree} onChange={handleChange}>
                      <option value="">Select Degree</option>
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
                    <label htmlFor="branch">Branch</label>
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

                <div className="form-row" style={{ marginBottom: '20px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="gpa">Current GPA</label>
                    <input type="number" id="gpa" value={formData.gpa} onChange={handleChange} placeholder="3.8" step="0.1" min="0" max="10" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="specialization">Specialization <span style={{ fontWeight: 400, color: 'var(--text-400)' }}>(optional)</span></label>
                    <input type="text" id="specialization" value={formData.specialization} onChange={handleChange} placeholder="e.g. Cloud Computing" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Core Skills</label>
                  <div className="skill-tags-wrapper">
                    {skillsList.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill} <span className="material-symbols-outlined remove" onClick={() => removeSkill(skill)}>close</span>
                      </span>
                    ))}
                    <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={handleSkillKeyDown} placeholder="Type and press enter..." />
                  </div>
                </div>

                <div className="form-row" style={{ marginBottom: '20px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="experience">Years of Experience</label>
                    <input type="number" id="experience" value={formData.experience} onChange={handleChange} placeholder="2" min="0" max="30" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="certifications">Certifications</label>
                    <input type="text" id="certifications" value={formData.certifications} onChange={handleChange} placeholder="AWS Cloud, PMP..." />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary">
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>save</span>
                  Save Profile
                </button>
              </form>
            </div>

            <div className="profile-card" style={{ height: 'fit-content' }}>
              <h4>
                <span className="material-symbols-outlined">description</span>
                Resume Upload
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-500)', marginBottom: '24px' }}>
                Upload your resume and we'll <strong style={{ color: 'var(--primary)' }}>auto-extract</strong> your skills, degree, GPA & experience.
              </p>

              <div className="upload-zone" onClick={handleZoneClick} onDragOver={handleDragOver} onDrop={handleDrop}>
                <div className="upload-icon-circle">
                  <span className="material-symbols-outlined" style={{ fontSize: '1.875rem' }}>cloud_upload</span>
                </div>
                <h5>Click to upload or drag and drop</h5>
                <p>PDF, DOCX, or DOC (Max. 5MB)</p>
                <button type="button" className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>Browse Files</button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt" style={{ display: 'none' }} />
              </div>

              {selectedFile && (
                <>
                  <div className="file-card" style={{ display: 'flex' }}>
                    <div className="file-info">
                      <div className="file-icon"><span className="material-symbols-outlined">picture_as_pdf</span></div>
                      <div>
                        <p className="file-name">{selectedFile.name}</p>
                        <p className="file-meta">{(selectedFile.size / (1024 * 1024)).toFixed(1)} MB • Selected</p>
                      </div>
                    </div>
                    <button className="file-delete" onClick={removeSelectedFile}>
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>

                  <button type="button" className="btn btn-primary btn-full" onClick={handleFileUpload} disabled={uploading}>
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>upload_file</span>
                    {uploading ? 'Uploading & Parsing...' : 'Upload Resume'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
