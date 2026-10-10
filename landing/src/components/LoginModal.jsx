'use client';

import React, { useState } from 'react';
import { Icon } from './Icons';

export default function LoginModal({ isOpen, onClose }) {
  const [activeRole, setActiveRole] = useState('student'); // 'student' | 'teacher'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  if (!isOpen) return null;

  const handleDemoLogin = (role) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (role === 'student') {
        setLoggedInUser({
          role: 'student',
          name: 'Tariq Al-Mansoor',
          id: 'QI-STU-8842',
          program: 'Full Hifz & Tajweed Mastery',
          mentor: 'Sheikh Ahmad Al-Azhari',
          nextSession: 'Today at 6:30 PM (in 45 mins)'
        });
      } else {
        setLoggedInUser({
          role: 'teacher',
          name: 'Dr. Sheikh Ahmad Al-Azhari',
          id: 'QI-FAC-014',
          sanad: '10 Qira’at with Connected Isnad',
          studentsCount: 18,
          nextSession: 'Today at 5:00 PM with Sister Sarah'
        });
      }
    }, 600);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleDemoLogin(activeRole);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="modal-backdrop portal-modal-backdrop" onClick={onClose}>
      <div className="modal-card portal-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close Login Modal">
          ×
        </button>

        {/* Modal Header */}
        <div className="portal-modal-header">
          <div className="portal-brand-badge">
            <img src="/assets/logo_gold.png" alt="Institute Emblem" className="portal-emblem" />
          </div>
          <h3 className="portal-title">Sanctuary Portal Login</h3>
          <p className="portal-subtitle">
            Secure classroom &amp; LMS access for enrolled students, scholars &amp; faculty
          </p>
        </div>

        {/* If Logged In View */}
        {loggedInUser ? (
          <div className="portal-dashboard-preview">
            <div className="portal-welcome-banner">
              <div className="portal-user-avatar">
                {loggedInUser.role === 'student' ? '🎓' : '🕌'}
              </div>
              <div className="portal-user-meta">
                <span className="portal-user-tag">
                  {loggedInUser.role === 'student' ? 'Active Student' : 'Certified Scholar / Faculty'}
                </span>
                <h4 className="portal-user-name">{loggedInUser.name}</h4>
                <span className="portal-user-id">ID: {loggedInUser.id}</span>
              </div>
            </div>

            <div className="portal-session-card">
              <div className="session-card-header">
                <span className="session-kicker">UPCOMING 1-ON-1 CLASSROOM</span>
                <span className="session-status-badge">● Live in 45m</span>
              </div>
              <p className="session-details">
                {loggedInUser.role === 'student'
                  ? `Mentor: ${loggedInUser.mentor} • ${loggedInUser.program}`
                  : `Next Student: Sister Sarah (Surah Al-Baqarah Revision)`}
              </p>
              <div className="session-actions">
                <a
                  href="https://zoom.us"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-portal-launch"
                >
                  <Icon name="play" size={14} color="#062A24" />
                  <span>Launch Live Video Room</span>
                </a>
                <button
                  className="btn-portal-secondary"
                  onClick={() => alert('Opening Student Progress & Audio Recording Log...')}
                >
                  <span>View Hifz Log</span>
                </button>
              </div>
            </div>

            <div className="portal-dashboard-footer">
              <button className="btn-portal-logout" onClick={handleLogout}>
                Sign Out of Portal
              </button>
            </div>
          </div>
        ) : (
          /* Role Selector & Login Form */
          <>
            {/* Role Tabs */}
            <div className="portal-role-tabs">
              <button
                type="button"
                className={`portal-role-tab ${activeRole === 'student' ? 'active' : ''}`}
                onClick={() => {
                  setActiveRole('student');
                  setEmail('tariq.student@quraninstitute.org');
                  setPassword('••••••••••••');
                }}
              >
                <Icon name="book-open" size={15} color={activeRole === 'student' ? '#062A24' : '#C5A45A'} />
                <span>Student / Parent</span>
              </button>
              <button
                type="button"
                className={`portal-role-tab ${activeRole === 'teacher' ? 'active' : ''}`}
                onClick={() => {
                  setActiveRole('teacher');
                  setEmail('dr.ahmad@quraninstitute.org');
                  setPassword('••••••••••••');
                }}
              >
                <Icon name="users" size={15} color={activeRole === 'teacher' ? '#062A24' : '#C5A45A'} />
                <span>Teacher &amp; Scholar</span>
              </button>
            </div>

            {/* Quick Demo Pre-fill Pill */}
            <div className="portal-quick-demo-banner">
              <span>Quick Demo Access:</span>
              <button
                type="button"
                className="portal-quick-demo-btn"
                onClick={() => handleDemoLogin(activeRole)}
              >
                {activeRole === 'student' ? '⚡ Sign in as Demo Student' : '⚡ Sign in as Al-Azhar Scholar'}
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="portal-login-form">
              <div className="portal-field-group">
                <label className="portal-label">
                  {activeRole === 'student' ? 'Student ID or Registered Email' : 'Scholar ID or University Email'}
                </label>
                <div className="portal-input-wrapper">
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      activeRole === 'student'
                        ? 'student@quraninstitute.org or QI-STU-8842'
                        : 'faculty@quraninstitute.org'
                    }
                    className="portal-input"
                  />
                </div>
              </div>

              <div className="portal-field-group">
                <div className="portal-label-row">
                  <label className="portal-label">Password</label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Password reset link sent to your registered admissions email.');
                    }}
                    className="portal-forgot-link"
                  >
                    Forgot?
                  </a>
                </div>
                <div className="portal-input-wrapper">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your sanctuary password"
                    className="portal-input"
                  />
                </div>
              </div>

              <div className="portal-remember-row">
                <label className="portal-checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Keep me signed in on this device</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-portal-submit"
              >
                {isSubmitting ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Enter {activeRole === 'student' ? 'Student Portal' : 'Faculty Dashboard'}</span>
                    <Icon name="arrow-right" size={15} color="#062A24" />
                  </>
                )}
              </button>
            </form>

            {/* Support and Admissions Note */}
            <div className="portal-help-note">
              <span>New student or haven't received login credentials?</span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '6px' }}>
                <a
                  href={`${process.env.NEXT_PUBLIC_PORTAL_URL || 'http://localhost:3001'}/register`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="portal-admissions-link"
                  style={{ color: '#FFDF85', fontWeight: '700' }}
                >
                  Enroll &amp; Register Online ↗
                </a>
                <span style={{ opacity: 0.5 }}>•</span>
                <a
                  href="https://wa.me/201094714943"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="portal-admissions-link"
                >
                  Admissions on WhatsApp
                </a>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <a
                href={`${process.env.NEXT_PUBLIC_PORTAL_URL || 'http://localhost:3001'}/login`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '12px',
                  color: 'rgba(251, 246, 233, 0.75)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>Open Sanctuary Portal full window</span>
                <span style={{ color: '#C5A45A' }}>↗</span>
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
