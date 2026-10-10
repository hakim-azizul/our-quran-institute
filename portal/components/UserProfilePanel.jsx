'use client';

import React, { useState } from 'react';
import { Icon } from './Icons';

export default function UserProfilePanel({
  user,
  enrollment,
  course,
  onProfileUpdated,
  onUnenrollSuccess,
  onNavigateToCatalog,
}) {
  const [name, setName] = useState(user?.name || '');
  const [tajweedLevel, setTajweedLevel] = useState(user?.tajweedLevel || 'Intermediate');
  const [targetGoal, setTargetGoal] = useState(
    user?.targetGoal || 'Master Quran Reading & Tajweed Rules'
  );
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 382-9014');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [unenrollLoading, setUnenrollLoading] = useState(false);

  const isStudent = user?.role === 'student';
  const isTeacher = user?.role === 'teacher';

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          tajweedLevel,
          targetGoal,
          phone,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile.');
      }

      setSuccessMsg('Profile updated successfully!');
      if (onProfileUpdated) {
        onProfileUpdated(data.user);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error updating profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleUnenroll = async () => {
    if (!window.confirm('Are you sure you want to unenroll from this course? You can re-enroll with any teacher anytime.')) {
      return;
    }

    setUnenrollLoading(true);
    try {
      const res = await fetch(`/api/enrollments?courseId=${course?.id || 'QI-CRS-001'}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to unenroll.');
      }

      alert('Successfully unenrolled from the course.');
      if (onUnenrollSuccess) {
        onUnenrollSuccess();
      }
    } catch (err) {
      alert(err.message || 'Error unenrolling.');
    } finally {
      setUnenrollLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Profile Summary Card */}
      <div className="dash-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--color-green-primary)',
                color: '#FFDF85',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                border: '2px solid var(--color-gold-primary)',
              }}
            >
              {user?.avatar || (isTeacher ? '🕌' : '🎓')}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '800', color: 'var(--color-green-deep)' }}>
                  {user?.name}
                </h1>
                <span
                  style={{
                    background: 'var(--color-green-surface)',
                    color: 'var(--color-green-primary)',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    border: '1px solid rgba(13,74,56,0.2)',
                  }}
                >
                  {isTeacher ? 'Faculty Scholar' : 'Registered Student'}
                </span>
              </div>
              <p style={{ margin: '6px 0 0 0', fontSize: '14.5px', color: 'var(--text-muted)' }}>
                Institute ID: <strong>{user?.id}</strong> • {user?.email}
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Institute Status:</span>
            <div style={{ fontSize: '15px', fontWeight: '700', color: enrollment ? '#166534' : '#B45309', marginTop: '2px' }}>
              {enrollment ? '● Active Course Enrollment' : '○ Not Enrolled in Course'}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Profile Form + Enrollment Status Panel */}
      <div className="dashboard-grid">
        {/* Left Panel: Profile Settings Form */}
        <div className="dash-panel">
          <h2 className="dash-panel-title">
            <Icon name="user" size={18} color="#0D4A38" />
            <span>Academic Profile &amp; Preferences</span>
          </h2>

          {successMsg && (
            <div className="auth-alert auth-alert-success" style={{ margin: '0 0 16px 0' }}>
              <span>✨ {successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="auth-alert auth-alert-error" style={{ margin: '0 0 16px 0' }}>
              <span>⚠️ {errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="form-label" style={{ marginBottom: '6px' }}>
                Full Name
              </label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label" style={{ marginBottom: '6px' }}>
                Email Address
              </label>
              <input
                type="email"
                className="form-input"
                value={user?.email || ''}
                disabled
                style={{ background: '#F9FAFB', cursor: 'not-allowed' }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Email is locked to your official institute credentials.
              </span>
            </div>

            {isStudent && (
              <>
                <div>
                  <label className="form-label" style={{ marginBottom: '6px' }}>
                    Current Tajweed / Recitation Level
                  </label>
                  <select
                    className="form-input"
                    value={tajweedLevel}
                    onChange={(e) => setTajweedLevel(e.target.value)}
                  >
                    <option value="Beginner">Beginner (Learning Arabic letters &amp; Harakat)</option>
                    <option value="Intermediate">Intermediate (Practicing Noon/Meem Sakinah &amp; Mudood)</option>
                    <option value="Advanced">Advanced (Fluency, Sifaat &amp; Waqf Rules)</option>
                    <option value="Hifz Candidate">Hifz Candidate (Full Quran Memorization)</option>
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ marginBottom: '6px' }}>
                    Personal Learning Goal
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={targetGoal}
                    onChange={(e) => setTargetGoal(e.target.value)}
                    placeholder="e.g. Master Quran reading with authentic Tajweed rules"
                  />
                </div>
              </>
            )}

            <div>
              <label className="form-label" style={{ marginBottom: '6px' }}>
                Contact Phone / WhatsApp
              </label>
              <input
                type="text"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn-auth-submit"
              style={{
                marginTop: '10px',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Icon name="check" size={16} color="#FFDF85" />
              <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </form>
        </div>

        {/* Right Panel: Active Enrollment or Course Status */}
        <div className="dash-panel">
          <h2 className="dash-panel-title">
            <Icon name="book" size={18} color="#0D4A38" />
            <span>Course Enrollment Status</span>
          </h2>

          {isStudent && enrollment ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{
                  background: 'var(--color-green-surface)',
                  border: '1px solid rgba(13,74,56,0.15)',
                  borderRadius: '12px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-green-primary)' }}>
                    Active Enrollment
                  </span>
                  <span style={{ fontSize: '12px', background: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '999px', fontWeight: '700' }}>
                    ID: {enrollment.id}
                  </span>
                </div>

                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--color-green-deep)' }}>
                  {course?.title || 'Quran Reading Foundation & Tajweed Mastery'}
                </h3>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: 'var(--text-body)' }}>
                  <span>Assigned Lead Scholar:</span>
                  <strong style={{ color: 'var(--color-green-primary)' }}>{enrollment.teacherName || 'Dr. Sheikh Ahmad Al-Azhari'}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: 'var(--text-body)' }}>
                  <span>Overall Course Progress:</span>
                  <strong style={{ color: '#166534' }}>{enrollment.progressPercent || 0}% Completed</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  <span>Enrolled On:</span>
                  <span>{new Date(enrollment.enrolledAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                  <span style={{ fontWeight: '600', color: 'var(--text-body)' }}>Curriculum Completion</span>
                  <span style={{ fontWeight: '700', color: 'var(--color-green-primary)' }}>{enrollment.progressPercent || 0}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#E5E7EB', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${enrollment.progressPercent || 0}%`,
                      background: 'linear-gradient(90deg, #0D4A38, #C5A45A)',
                      borderRadius: '999px',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>

              {/* Unenroll / Change Teacher Action */}
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Need to switch scholars or change courses?
                </span>
                <button
                  type="button"
                  onClick={handleUnenroll}
                  disabled={unenrollLoading}
                  style={{
                    background: '#FEF2F2',
                    border: '1px solid #F87171',
                    color: '#991B1B',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    cursor: unenrollLoading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {unenrollLoading ? 'Processing...' : 'Withdraw / Switch Teacher'}
                </button>
              </div>
            </div>
          ) : isStudent ? (
            <div
              style={{
                background: 'var(--color-gold-light)',
                border: '1.5px dashed var(--color-gold-primary)',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <span style={{ fontSize: '32px' }}>📖</span>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--color-green-deep)' }}>
                No Active Course Enrollment
              </h3>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-body)', lineHeight: '1.5' }}>
                You have not yet enrolled in the Quran Reading &amp; Tajweed Mastery course. Choose a teacher to unlock interactive Uthmani Mushaf recitation, module video lessons, and live feedback.
              </p>
              <button
                type="button"
                onClick={onNavigateToCatalog}
                className="btn-auth-submit"
                style={{
                  margin: '8px 0 0 0',
                  padding: '10px 20px',
                  fontSize: '13.5px',
                  width: 'auto',
                }}
              >
                <span>Browse Course &amp; Enroll</span>
              </button>
            </div>
          ) : (
            <div
              style={{
                background: 'var(--color-green-surface)',
                border: '1px solid rgba(13,74,56,0.15)',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: 'var(--color-green-deep)' }}>
                Faculty Credentials
              </h3>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-body)' }}>
                <strong>Certification:</strong> {user?.sanadCertification || '10 Qira’at Mutawatirah'}
              </p>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-body)' }}>
                <strong>Specialization:</strong> {user?.specialization || 'Tajweed & Advanced Hifz'}
              </p>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-body)' }}>
                <strong>Experience:</strong> {user?.yearsExperience || '14+ years'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
