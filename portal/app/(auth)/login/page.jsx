'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthNavbar from '../../../components/AuthNavbar';
import { Icon } from '../../../components/Icons';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [activeFilledAccount, setActiveFilledAccount] = useState('');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('pendingApproval') === 'true' || params.get('pending') === 'true') {
        setInfoMsg(
          'Account Registration Submitted: Your registration is under administrative verification. You will be able to log in once your account has been reviewed.'
        );
      }
    }
  }, []);

  // 1-Click Quick Fill for testing different roles without manual role selection
  const handleDemoFill = (type) => {
    setErrorMsg('');
    if (type === 'student') {
      setEmail('tariq.student@quraninstitute.org');
      setPassword('password123');
      setActiveFilledAccount('Student: Tariq Al-Mansoor');
    } else if (type === 'teacher') {
      setEmail('dr.ahmad@quraninstitute.org');
      setPassword('password123');
      setActiveFilledAccount('Scholar: Dr. Sheikh Ahmad Al-Azhari');
    } else if (type === 'admin') {
      setEmail('admin@quraninstitute.org');
      setPassword('admin123');
      setActiveFilledAccount('Administrator: Sheikh Dr. Ibrahim');
    }
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
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Authentication failed. Please verify your credentials.');
        setIsSubmitting(false);
        return;
      }

      const roleBadge =
        data.user.role === 'admin'
          ? 'Administrator'
          : data.user.role === 'teacher'
          ? 'Scholar'
          : 'Student';

      setSuccessMsg(`Welcome back, ${data.user.name} (${roleBadge})! Opening your dashboard...`);
      const targetDestination =
        data.redirectUrl ||
        (data.user.role === 'admin'
          ? '/admin'
          : data.user.role === 'teacher'
          ? '/dashboard/teacher'
          : '/dashboard');

      setTimeout(() => {
        router.push(targetDestination);
      }, 700);
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error. Could not connect to the authentication server.');
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
              <span>Institute Academic Portal</span>
            </div>
            <h1 className="auth-card-title">Sign In to Your Account</h1>
            <p className="auth-card-subtitle">
              Enter your credentials to access your classes, Quran lessons, and dashboard.
            </p>
          </div>

          {/* Quick Demo Pre-Fill Box */}
          <div className="demo-helper-box">
            <div className="demo-helper-top">
              <div className="demo-helper-text">
                <span className="demo-helper-sparkle">
                  <Icon name="zap" size={13} />
                </span>
                <span>Quick Access Demo Accounts:</span>
              </div>
              <span className="demo-helper-hint">Automatic role detection</span>
            </div>
            <div className="demo-helper-btn-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              <button
                type="button"
                className={`demo-helper-btn ${activeFilledAccount.includes('Student') ? 'active' : ''}`}
                onClick={() => handleDemoFill('student')}
                title="Fill Tariq Al-Mansoor (Student)"
              >
                <Icon name="student" size={14} style={{ marginRight: 6 }} /> Student
              </button>
              <button
                type="button"
                className={`demo-helper-btn ${activeFilledAccount.includes('Scholar') ? 'active' : ''}`}
                onClick={() => handleDemoFill('teacher')}
                title="Fill Dr. Sheikh Ahmad Al-Azhari (Scholar)"
              >
                <Icon name="scholar" size={14} style={{ marginRight: 6 }} /> Scholar
              </button>
              <button
                type="button"
                className={`demo-helper-btn demo-helper-btn-admin ${activeFilledAccount.includes('Administrator') ? 'active' : ''}`}
                onClick={() => handleDemoFill('admin')}
                title="Fill Sheikh Dr. Ibrahim (Director & Admin)"
              >
                <Icon name="shield-user" size={14} style={{ marginRight: 6 }} /> Admin
              </button>
            </div>
            {activeFilledAccount && (
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#0D4A38', fontWeight: 600 }}>
                Selected: {activeFilledAccount}
              </div>
            )}
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
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Icon name="clock" size={16} /> {infoMsg}
              </span>
            </div>
          )}

          {/* Alert feedback */}
          {errorMsg && (
            <div className="auth-alert-box auth-alert-error">
              <Icon name="alert-circle" size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="auth-alert-box auth-alert-success">
              <Icon name="check-circle" size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="portal-email-input">
                Email Address or Institute ID
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setActiveFilledAccount('');
                  }}
                  placeholder="e.g. name@quraninstitute.org or QI-ID"
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
                      'Password reset instruction has been dispatched to your registered email address.'
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
                  placeholder="Enter your password"
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
                Keep me securely signed in on this device
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
                  <span>Sign In to Dashboard</span>
                  <Icon name="arrow-right" size={16} color="#FFDF85" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="auth-card-footer">
            <p className="auth-footer-prompt">
              New student applying for admission?{' '}
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
