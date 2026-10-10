'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthNavbar from '../../../components/AuthNavbar';
import RoleSelector from '../../../components/RoleSelector';
import TeacherRegisterFields from '../../../components/TeacherRegisterFields';
import { Icon } from '../../../components/Icons';

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState('student'); // 'student' | 'teacher'
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Teacher fields
    sanadCertification: '',
    qiraat: 'Hafs ‘an ‘Asim',
    yearsExperience: '3-5 years',
    specialization: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (!agreedTerms) {
      setErrorMsg('Please agree to the Institute Honor Code and Learning Terms.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          // Teacher fields (only submitted if teacher)
          ...(role === 'teacher' && {
            sanadCertification: formData.sanadCertification,
            qiraat: formData.qiraat,
            yearsExperience: formData.yearsExperience,
            specialization: formData.specialization,
          }),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to complete registration.');
        setIsSubmitting(false);
        return;
      }

      setSuccessMsg(
        `Alhamdulillah! Registration complete for ${data.user.name} (Assigned ID: ${data.user.id}). Opening your dashboard...`
      );

      setTimeout(() => {
        router.push(data.redirectUrl || '/dashboard');
      }, 850);
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error. Could not connect to the sanctuary registration service.');
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
        <div className="auth-card auth-card-wide">
          <div className="auth-card-corner-ornament">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>

          {/* Header */}
          <div className="auth-card-header">
            <div className="auth-card-badge">
              <Icon name="award" size={13} color="#0D4A38" />
              <span>Sanctuary Institute Admissions</span>
            </div>
            <h1 className="auth-card-title">Begin Your Sacred Quranic Journey</h1>
            <p className="auth-card-subtitle">
              Register for 1-on-1 personalized lessons, connected Sanad chains with Al-Azhar scholars, and global classroom tracking.
            </p>
          </div>

          {/* Role Switcher (Student & Teacher Only) */}
          <RoleSelector activeRole={role} onRoleChange={handleRoleChange} />

          {/* Security Notice regarding Admin Accounts */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: '10px',
              fontSize: '11.5px',
              color: '#166534',
              marginBottom: '16px',
            }}
          >
            <span>🛡️</span>
            <span>
              <strong>Registration Policy:</strong> Public registration is exclusively for Students and Certified Scholars. Admin accounts cannot be created online and are restricted to database configuration.
            </span>
          </div>

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

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {/* Core credentials */}
            <div className="form-row-two">
              <div className="form-group">
                <label className="form-label" htmlFor="register-name">
                  Full Name
                </label>
                <div className="form-input-container">
                  <span className="form-input-icon">
                    <Icon name="user" size={17} color="#0D4A38" />
                  </span>
                  <input
                    id="register-name"
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Tariq Al-Mansoor"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="register-email">
                  Email Address
                </label>
                <div className="form-input-container">
                  <span className="form-input-icon">
                    <Icon name="mail" size={17} color="#0D4A38" />
                  </span>
                  <input
                    id="register-email"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@quraninstitute.org"
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            <div className="form-row-two">
              <div className="form-group">
                <label className="form-label" htmlFor="register-password">
                  Password
                </label>
                <div className="form-input-container">
                  <span className="form-input-icon">
                    <Icon name="lock" size={17} color="#0D4A38" />
                  </span>
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Min 6 characters"
                    className="form-input"
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

              <div className="form-group">
                <label className="form-label" htmlFor="register-confirm-password">
                  Confirm Password
                </label>
                <div className="form-input-container">
                  <span className="form-input-icon">
                    <Icon name="lock" size={17} color="#0D4A38" />
                  </span>
                  <input
                    id="register-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Re-type password"
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Scholar / Teacher Credential Fields */}
            {role === 'teacher' && (
              <TeacherRegisterFields formData={formData} onChange={handleInputChange} />
            )}

            {/* Agreement Terms */}
            <div className="form-checkbox-row">
              <input
                type="checkbox"
                id="portal-terms-agree"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="form-checkbox"
              />
              <label htmlFor="portal-terms-agree" className="form-checkbox-text">
                I agree to the Sanctuary Honor Code, Student Etiquette (Adab al-Talib), and Institute Policies.
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-auth-submit"
            >
              {isSubmitting ? (
                <span>Registering Account &amp; Enrolling...</span>
              ) : (
                <>
                  <span>
                    Complete Registration as {role === 'student' ? 'Student' : 'Faculty Scholar'}
                  </span>
                  <Icon name="arrow-right" size={16} color="#FFDF85" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="auth-card-footer">
            <p className="auth-footer-prompt">
              Already have an enrolled account?
              <Link href="/login" className="auth-footer-link">
                Sign In to Sanctuary Portal
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
