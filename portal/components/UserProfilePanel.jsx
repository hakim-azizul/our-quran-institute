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
  const [tajweedLevel, setTajweedLevel] = useState(user?.tajweedLevel || 'Advanced Hifz Candidate');
  const [targetGoal, setTargetGoal] = useState(
    user?.targetGoal || 'Complete 30 Juz Hifz with Ijazah certification by 2027'
  );
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 382-9014');
  const [language, setLanguage] = useState(user?.preferredLanguage || 'English & Bengali');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [unenrollLoading, setUnenrollLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const isStudent = user?.role === 'student';
  const isTeacher = user?.role === 'teacher';
  const isParent = user?.role === 'parent';
  const isAdmin = user?.role === 'admin';

  const handleCopyId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

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
          preferredLanguage: language,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile.');
      }

      setSuccessMsg('Profile settings updated successfully!');
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
    if (
      !window.confirm(
        'Are you sure you want to unenroll from this course? You can re-enroll with any teacher anytime.'
      )
    ) {
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* =========================================================================
          TOP HERO PROFILE BANNER (HIGH SIGNAL / SAAS MODERN)
          ========================================================================= */}
      <div
        style={{
          background: '#0D4A38',
          borderRadius: '20px',
          padding: '28px 32px',
          color: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(13, 74, 56, 0.16)',
          border: '2px solid #D4AF37',
        }}
      >
        {/* Subtle decorative background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '45%',
            backgroundImage:
              'radial-gradient(circle at right, rgba(197, 164, 90, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* User Avatar + Main Identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.12)',
                border: '2.5px solid #FFDF85',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '34px',
                boxShadow: '0 4px 18px rgba(0, 0, 0, 0.35)',
                position: 'relative',
                flexShrink: 0,
              }}
            >
              {isTeacher ? (
                <Icon name="scholar" size={32} />
              ) : isAdmin ? (
                <Icon name="shield-user" size={32} />
              ) : isParent ? (
                <Icon name="parent" size={32} />
              ) : (
                <Icon name="student" size={32} />
              )}
              <span
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  background: '#10B981',
                  border: '2.5px solid #062A1F',
                }}
                title="Account Status: Active"
              />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h1
                  style={{
                    margin: 0,
                    fontSize: '26px',
                    fontWeight: '800',
                    fontFamily: 'var(--font-serif)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {user?.name}
                </h1>
                <span
                  style={{
                    background: '#FFDF85',
                    color: '#062A1F',
                    padding: '3px 12px',
                    borderRadius: '999px',
                    fontSize: '11.5px',
                    fontWeight: '800',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  {isTeacher
                    ? 'Verified Scholar'
                    : isAdmin
                    ? 'Superuser Admin'
                    : isParent
                    ? 'Guardian Account'
                    : 'Hifz Candidate'}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginTop: '8px',
                  fontSize: '13px',
                  color: 'rgba(255, 255, 255, 0.85)',
                  flexWrap: 'wrap',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Icon name="shield" size={13} />
                  <strong>{user?.id}</strong>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: '#FFF',
                      fontSize: '10.5px',
                      padding: '2px 7px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    {copiedId ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                        <Icon name="check-circle" size={11} color="#FFFFFF" /> Copied
                      </span>
                    ) : (
                      'Copy'
                    )}
                  </button>
                </span>
                <span>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <Icon name="mail" size={13} /> {user?.email}
                </span>
                <span>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <Icon name="mosque" size={13} /> Online Quran Institute
                </span>
              </div>
            </div>
          </div>

          {/* Quick High-Signal Badge */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(197, 164, 90, 0.4)',
              borderRadius: '14px',
              padding: '12px 18px',
              textAlign: 'right',
            }}
          >
            <span style={{ fontSize: '11px', color: '#FFDF85', textTransform: 'uppercase', fontWeight: '700' }}>
              Institute Credential
            </span>
            <div style={{ fontSize: '16px', fontWeight: '800', marginTop: '2px' }}>
              {isTeacher
                ? 'Certified Quran Teacher'
                : isAdmin
                ? 'Administrator'
                : isParent
                ? 'Registered Parent'
                : 'Quran Student'}
            </div>
          </div>
        </div>

        {/* High-Signal Metrics Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px',
            marginTop: '22px',
            paddingTop: '18px',
            borderTop: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          {isStudent && (
            <>
              <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '10px 14px', borderRadius: '10px' }}>
                <span style={{ fontSize: '11px', color: '#FFDF85' }}>Hifz Progress</span>
                <div style={{ fontSize: '18px', fontWeight: '800' }}>12 / 30 Juz (40%)</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '10px 14px', borderRadius: '10px' }}>
                <span style={{ fontSize: '11px', color: '#FFDF85' }}>Attendance Rate</span>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#34D399' }}>96% Consistent</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '10px 14px', borderRadius: '10px' }}>
                <span style={{ fontSize: '11px', color: '#FFDF85' }}>Current Sabaq</span>
                <div style={{ fontSize: '18px', fontWeight: '800' }}>Surah Yusuf</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '10px 14px', borderRadius: '10px' }}>
                <span style={{ fontSize: '11px', color: '#FFDF85' }}>Target Completion</span>
                <div style={{ fontSize: '18px', fontWeight: '800' }}>June 2027</div>
              </div>
            </>
          )}

          {isParent && (
            <>
              <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '10px 14px', borderRadius: '10px' }}>
                <span style={{ fontSize: '11px', color: '#FFDF85' }}>Children Enrolled</span>
                <div style={{ fontSize: '18px', fontWeight: '800' }}>2 Students</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '10px 14px', borderRadius: '10px' }}>
                <span style={{ fontSize: '11px', color: '#FFDF85' }}>Tuition Status</span>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#34D399' }}>100% Paid (Current)</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '10px 14px', borderRadius: '10px' }}>
                <span style={{ fontSize: '11px', color: '#FFDF85' }}>Family Reference</span>
                <div style={{ fontSize: '18px', fontWeight: '800' }}>FAM-8821</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '10px 14px', borderRadius: '10px' }}>
                <span style={{ fontSize: '11px', color: '#FFDF85' }}>Classroom Feedback</span>
                <div style={{ fontSize: '18px', fontWeight: '800' }}>Daily Live Feed</div>
              </div>
            </>
          )}

          {isTeacher && (
            <>
              <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '10px 14px', borderRadius: '10px' }}>
                <span style={{ fontSize: '11px', color: '#FFDF85' }}>Active Students</span>
                <div style={{ fontSize: '18px', fontWeight: '800' }}>18 Enrolled</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '10px 14px', borderRadius: '10px' }}>
                <span style={{ fontSize: '11px', color: '#FFDF85' }}>Teaching Experience</span>
                <div style={{ fontSize: '18px', fontWeight: '800' }}>14+ Years</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '10px 14px', borderRadius: '10px' }}>
                <span style={{ fontSize: '11px', color: '#FFDF85' }}>Per-Class Honorarium</span>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#34D399' }}>${user?.ratePerClass || user?.hourlyRate || 35} / Class</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '10px 14px', borderRadius: '10px' }}>
                <span style={{ fontSize: '11px', color: '#FFDF85' }}>Council Status</span>
                <div style={{ fontSize: '18px', fontWeight: '800' }}>Verified Al-Azhar</div>
              </div>
            </>
          )}

          {isAdmin && (
            <>
              <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '10px 14px', borderRadius: '10px' }}>
                <span style={{ fontSize: '11px', color: '#FFDF85' }}>Access Level</span>
                <div style={{ fontSize: '18px', fontWeight: '800' }}>Superuser Tier 1</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '10px 14px', borderRadius: '10px' }}>
                <span style={{ fontSize: '11px', color: '#FFDF85' }}>Database Status</span>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#34D399' }}>Connected &amp; Synced</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '10px 14px', borderRadius: '10px' }}>
                <span style={{ fontSize: '11px', color: '#FFDF85' }}>Audit Compliance</span>
                <div style={{ fontSize: '18px', fontWeight: '800' }}>100% Passed</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '10px 14px', borderRadius: '10px' }}>
                <span style={{ fontSize: '11px', color: '#FFDF85' }}>Council Authority</span>
                <div style={{ fontSize: '18px', fontWeight: '800' }}>Global Oversight</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* =========================================================================
          MAIN 2-COLUMN HIGH-SIGNAL CONTENT GRID
          ========================================================================= */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '22px' }}>
        {/* Left Column: Account Settings & Contact Editor */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1.5px solid var(--border-light)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <Icon name="settings" size={20} />
            <div>
              <h2 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: 'var(--color-green-deep)' }}>
                Account Settings &amp; Preferences
              </h2>
              <p style={{ margin: '2px 0 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Keep your profile and communication channels up to date
              </p>
            </div>
          </div>

          {successMsg && (
            <div
              style={{
                background: '#DCFCE7',
                border: '1px solid #86EFAC',
                color: '#166534',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Icon name="check-circle" size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div
              style={{
                background: '#FEE2E2',
                border: '1px solid #FCA5A5',
                color: '#991B1B',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Icon name="alert-circle" size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="form-label" style={{ marginBottom: '6px' }}>
                Full Legal / Registered Name
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
                Registered Email (Official)
              </label>
              <input
                type="email"
                className="form-input"
                value={user?.email || ''}
                disabled
                style={{ background: '#F8FAFC', cursor: 'not-allowed', color: 'var(--text-muted)' }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                Locked to your verified Institute ID credentials.
              </span>
            </div>

            <div>
              <label className="form-label" style={{ marginBottom: '6px' }}>
                Contact Phone / WhatsApp Notification
              </label>
              <input
                type="text"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1784-413139 or +1 (555) 000-0000"
              />
            </div>

            {isStudent && (
              <>
                <div>
                  <label className="form-label" style={{ marginBottom: '6px' }}>
                    Tajweed / Recitation Target Track
                  </label>
                  <select
                    className="form-input"
                    value={tajweedLevel}
                    onChange={(e) => setTajweedLevel(e.target.value)}
                  >
                    <option value="Beginner">Beginner (Arabic Letters &amp; Makharij)</option>
                    <option value="Intermediate">Intermediate (Noon Sakinah, Meem &amp; Mudood)</option>
                    <option value="Advanced">Advanced (Sifaat, Waqf &amp; Fluency)</option>
                    <option value="Advanced Hifz Candidate">Advanced Hifz Candidate (30-Juz Track)</option>
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ marginBottom: '6px' }}>
                    Personal Spiritual Goal
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={targetGoal}
                    onChange={(e) => setTargetGoal(e.target.value)}
                  />
                </div>
              </>
            )}

            <div>
              <label className="form-label" style={{ marginBottom: '6px' }}>
                Preferred Interface Language
              </label>
              <select
                className="form-input"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="English">English (Default)</option>
                <option value="Arabic">العربية (Arabic)</option>
              </select>
            </div>

            {/* Notification Toggles */}
            <div
              style={{
                background: '#F8FAFC',
                borderRadius: '10px',
                padding: '12px 14px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-green-deep)' }}>
                Automated Class &amp; Progress Notifications
              </span>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                />
                <span>Email me daily Sabaq and Attendance summaries</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                />
                <span>WhatsApp reminder 15 minutes before class session</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn-auth-submit"
              style={{
                marginTop: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Icon name="check" size={16} color="#FFDF85" />
              <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Role-Specific High-Signal Workspace Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* ====================================================================
              STUDENT VIEW: Active Academic Enrollment Card
              ==================================================================== */}
          {isStudent && (
            <div
              style={{
                background: '#FFFFFF',
                border: '1.5px solid var(--border-light)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon name="book-open" size={20} color="var(--color-green-primary)" />
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: 'var(--color-green-deep)' }}>
                    Enrolled Course &amp; Teacher
                  </h3>
                </div>
                <span
                  style={{
                    background: '#DCFCE7',
                    color: '#166534',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: '700',
                  }}
                >
                  ● Enrolled
                </span>
              </div>

              {/* Course Detail Card */}
              <div
                style={{
                  background: 'var(--color-green-surface)',
                  border: '1px solid rgba(13, 74, 56, 0.15)',
                  borderRadius: '12px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-gold-primary)', fontWeight: '700' }}>
                    Primary Discipline
                  </span>
                  <h4 style={{ margin: '2px 0 0 0', fontSize: '16px', fontWeight: '800', color: 'var(--color-green-deep)' }}>
                    {course?.title || 'Quran Reading Foundation & Tajweed Mastery'}
                  </h4>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderTop: '1px solid rgba(13, 74, 56, 0.1)' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'var(--color-green-primary)',
                      color: '#FFDF85',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                    }}
                  >
                    <Icon name="scholar" size={20} />
                  </div>
                  <div>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Assigned Mentor Scholar:</span>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-green-deep)' }}>
                      {enrollment?.teacherName || 'Dr. Sheikh Ahmad Al-Azhari'}
                    </div>
                  </div>
                </div>

                {/* Progress Visual */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: '600' }}>Curriculum Completion</span>
                    <strong style={{ color: 'var(--color-green-primary)' }}>{enrollment?.progressPercent || 40}%</strong>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#E2E8F0', borderRadius: '999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${enrollment?.progressPercent || 40}%`,
                        background: '#D4AF37',
                        borderRadius: '999px',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={onNavigateToCatalog}
                  className="btn-quick-top-action"
                  style={{ flex: 1, justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <Icon name="sparkles" size={15} color="var(--color-gold-deep)" />
                  <span>Explore Other Courses</span>
                </button>
                <button
                  type="button"
                  onClick={handleUnenroll}
                  disabled={unenrollLoading}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: '#FEF2F2',
                    border: '1px solid #FCA5A5',
                    color: '#991B1B',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: unenrollLoading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {unenrollLoading ? '...' : 'Switch Teacher'}
                </button>
              </div>
            </div>
          )}

          {/* ====================================================================
              PARENT VIEW: Family & Children Dossier
              ==================================================================== */}
          {isParent && (
            <div
              style={{
                background: '#FFFFFF',
                border: '1.5px solid var(--border-light)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon name="users" size={20} />
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: 'var(--color-green-deep)' }}>
                    Registered Children (Family Roster)
                  </h3>
                </div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-green-primary)' }}>
                  Family ID: FAM-8821
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Child Card 1 */}
                <div
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon name="student" size={22} />
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '14.5px', color: 'var(--color-green-deep)' }}>
                        Tariq Al-Mansoor (QI-STU-8842)
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Para 12 (40%) • Mentor: Dr. Sheikh Ahmad Al-Azhari
                      </span>
                    </div>
                  </div>
                  <span style={{ background: '#DCFCE7', color: '#166534', fontSize: '11px', fontWeight: '800', padding: '3px 8px', borderRadius: '6px' }}>
                    96% ATTENDANCE
                  </span>
                </div>

                {/* Child Card 2 */}
                <div
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon name="student" size={22} />
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '14.5px', color: 'var(--color-green-deep)' }}>
                        Zaid bin Harith (QI-STU-7721)
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Para 6 (20%) • Mentor: Ustadh Mahmoud Al-Misri
                      </span>
                    </div>
                  </div>
                  <span style={{ background: '#DCFCE7', color: '#166534', fontSize: '11px', fontWeight: '800', padding: '3px 8px', borderRadius: '6px' }}>
                    92% ATTENDANCE
                  </span>
                </div>
              </div>

              <div
                style={{
                  marginTop: '16px',
                  background: 'var(--color-gold-light)',
                  border: '1px solid rgba(197, 164, 90, 0.4)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  fontSize: '12.5px',
                  color: 'var(--color-green-deep)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Icon name="zap" size={16} color="var(--color-gold-deep)" />
                <span>
                  All child progress records sync automatically to your Guardian Progress Dashboard tab.
                </span>
              </div>
            </div>
          )}

          {/* ====================================================================
              TEACHER VIEW: Faculty Scholar Accreditation Card
              ==================================================================== */}
          {isTeacher && (
            <div
              style={{
                background: '#FFFFFF',
                border: '1.5px solid var(--border-light)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon name="award" size={20} color="var(--color-gold-deep)" />
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: 'var(--color-green-deep)' }}>
                    Teacher Credentials &amp; Certifications
                  </h3>
                </div>
                <span style={{ background: '#FEF3C7', color: '#92400E', padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '700' }}>
                  Verified Teacher
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Certification / Ijazah:</span>
                  <div style={{ fontWeight: '700', fontSize: '13.5px', color: 'var(--color-green-deep)' }}>
                    {user?.sanadCertification || '10 Qira’at Mutawatirah Certification'}
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Specialization:</span>
                  <div style={{ fontWeight: '700', fontSize: '13.5px', color: 'var(--color-green-deep)' }}>
                    {user?.specialization || 'Tajweed & Quran Memorization'}
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Next Scheduled Session:</span>
                  <div style={{ fontWeight: '700', fontSize: '13.5px', color: '#0D4A38' }}>
                    {user?.nextSession || 'Today at 5:00 PM with Tariq Al-Mansoor'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================================
              ADMIN VIEW: Security & Audit Tier
              ==================================================================== */}
          {isAdmin && (
            <div
              style={{
                background: '#FFFFFF',
                border: '1.5px solid var(--border-light)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon name="shield-check" size={20} />
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: 'var(--color-green-deep)' }}>
                    Superuser Security Matrix
                  </h3>
                </div>
                <span style={{ background: '#0D4A38', color: '#FFDF85', padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '800' }}>
                  TIER-1 ACCESS
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['Database Provisioning', 'Faculty Verification', 'Audit Log Access', 'Fee Approvals', 'Salary Disbursement', 'Global Announcements'].map((perm) => (
                  <span
                    key={perm}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#EBF5F0',
                      color: '#0D4A38',
                      border: '1px solid rgba(13, 74, 56, 0.2)',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '700',
                    }}
                  >
                    <Icon name="check-circle" size={12} color="#0D4A38" />
                    <span>{perm}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quick Support Card */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1.5px solid var(--border-light)',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontWeight: '800', fontSize: '14.5px', color: 'var(--color-green-deep)' }}>
                Need Academic Support or Assistance?
              </div>
              <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Institute Registrar: support@ourquran.com • +880 1784-413139
              </span>
            </div>
            <a
              href="mailto:support@ourquran.com"
              style={{
                background: 'var(--color-green-primary)',
                color: '#FFDF85',
                padding: '8px 14px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '12px',
                whiteSpace: 'nowrap',
              }}
            >
              Contact Registrar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
