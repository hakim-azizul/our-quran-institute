'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthNavbar from '../../../components/AuthNavbar';
import RoleSelector from '../../../components/RoleSelector';
import { Icon } from '../../../components/Icons';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState('student'); // 'student' | 'teacher'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('pendingApproval') === 'true' || params.get('pending') === 'true') {
        setInfoMsg(
          '⏳ Scholar Application Submitted: Your teacher account has been registered and is currently under review by the Institute Governing Council. Once an Administrator approves your credentials and Sanad, you will be able to log in.'
        );
        setRole('teacher');
      }
    }
  }, []);

  // 1-Click Demo Fill for easy testing
  const handleDemoFill = (selectedRole) => {
    setErrorMsg('');
    if (selectedRole === 'student') {
      setRole('student');
      setEmail('tariq.student@quraninstitute.org');
      setPassword('password123');
    } else if (selectedRole === 'teacher') {
      setRole('teacher');
      setEmail('dr.ahmad@quraninstitute.org');
      setPassword('password123');
    } else if (selectedRole === 'admin') {
      setEmail('admin@quraninstitute.org');
      setPassword('admin123');
    }
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Authentication failed. Please verify your credentials.');
        setIsSubmitting(false);
        return;
      }

      setSuccessMsg(`Welcome back, ${data.user.name}! Opening your sanctuary workspace...`);
      const targetDestination = data.redirectUrl || (data.user.role === 'admin' ? '/admin' : '/dashboard');
      setTimeout(() => {
        router.push(targetDestination);
      }, 700);
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error. Could not connect to the sanctuary authentication server.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-ambient-glow" />
      <div className="auth-trellis-bg" />

      {/* Navigation Header */}
      <AuthNavbar />

      {/* Main Container */}
      <main className="auth-main-container">
        <div className="auth-card">
          <div className="auth-card-corner-ornament">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>

          {/* Header */}
          <div className="auth-card-header">
            <div className="auth-card-badge">
              <Icon name="sparkles" size={13} color="#0D4A38" />
              <span>Sanctuary Portal Access</span>
            </div>
            <h1 className="auth-card-title">Welcome to Your Portal</h1>
            <p className="auth-card-subtitle">
              Secure classroom, Sanad verification &amp; Hifz tracking for enrolled students &amp; certified scholars.
            </p>
          </div>

          {/* Role Switcher (Student & Teacher Only) */}
          <RoleSelector activeRole={role} onRoleChange={handleRoleChange} />

          {/* Quick Demo Pre-Fill Box */}
          <div className="demo-helper-box">
            <div className="demo-helper-text">
              <span>Quick Test Access:</span>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="demo-helper-btn"
                onClick={() => handleDemoFill('student')}
                title="Fill Tariq Al-Mansoor credentials"
              >
                🎓 Student
              </button>
              <button
                type="button"
                className="demo-helper-btn"
                onClick={() => handleDemoFill('teacher')}
                title="Fill Dr. Sheikh Ahmad Al-Azhari credentials"
              >
                🕌 Scholar
              </button>
              <button
                type="button"
                className="demo-helper-btn"
                style={{ background: '#062A1F', borderColor: '#D4AF37' }}
                onClick={() => handleDemoFill('admin')}
                title="Fill Database-Provisioned Admin credentials"
              >
                👑 Admin
              </button>
            </div>
          </div>

          {/* Info feedback */}
          {infoMsg && (
            <div
              className="auth-alert-box"
              style={{
                background: '#FEF3C7',
                border: '1.5px solid #F59E0B',
                color: '#92400E',
                marginBottom: '16px',
                fontSize: '13px',
                lineHeight: '1.5',
              }}
            >
              <span>{infoMsg}</span>
            </div>
          )}

          {/* Alert feedback */}
          {errorMsg && (
            <div className="auth-alert-box auth-alert-error">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="auth-alert-box auth-alert-success">
              <span>✅</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="portal-email-input">
                {role === 'student'
                  ? 'Student Email or Institute ID (QI-STU-8842)'
                  : 'Faculty Scholar Email or ID (QI-FAC-014)'}
              </label>
              <div className="form-input-container">
                <span className="form-input-icon">
                  <Icon name="mail" size={17} color="#0D4A38" />
                </span>
                <input
                  id="portal-email-input"
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    role === 'student'
                      ? 'student@quraninstitute.org or QI-STU-8842'
                      : 'faculty@quraninstitute.org or QI-FAC-014'
                  }
                  className="form-input"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label" htmlFor="portal-password-input">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(
                      'Password reset instruction has been dispatched to your registered admissions email address.'
                    );
                  }}
                  className="form-forgot-link"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="form-input-container">
                <span className="form-input-icon">
                  <Icon name="lock" size={17} color="#0D4A38" />
                </span>
                <input
                  id="portal-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your sanctuary portal password"
                  className="form-input"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="form-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <Icon name={showPassword ? 'eye-off' : 'eye'} size={16} />
                </button>
              </div>
            </div>

            <div className="form-checkbox-row">
              <input
                type="checkbox"
                id="portal-remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="form-checkbox"
              />
              <label htmlFor="portal-remember-me" className="form-checkbox-text">
                Keep me securely signed in on this computer
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-auth-submit"
            >
              {isSubmitting ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <span>
                    Sign In to {role === 'student' ? 'Student Sanctuary' : 'Faculty Scholar Portal'}
                  </span>
                  <Icon name="arrow-right" size={16} color="#FFDF85" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="auth-card-footer">
            <p className="auth-footer-prompt">
              New learner or seeking Sanad enrollment?
              <Link href="/register" className="auth-footer-link">
                Register New Account
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
