'use client';

import React, { useState, useEffect } from 'react';
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

  // Teacher-Specific Rich Scholarly Portfolio States
  const [honorific, setHonorific] = useState(user?.honorific || 'فضيلة الشيخ د. أحمد الأزهري');
  const [title, setTitle] = useState(user?.title || user?.role || 'Dean of Quranic Studies & Ten Qira\'at Master');
  const [category, setCategory] = useState(user?.category || 'hifz');
  const [division, setDivision] = useState(user?.division || 'brothers');
  const [bio, setBio] = useState(user?.bio || 'A distinguished graduate and former lecturer at the Faculty of Quranic Recitations at Al-Azhar University. Guiding international students from novice reciters to certified Ijazah holders with extraordinary patience, precision, and classical adab.');
  const [teachingPhilosophy, setTeachingPhilosophy] = useState(user?.teachingPhilosophy || 'Knowledge of the Noble Quran is light passed from chest to chest. We cultivate phonetic perfection through patient, gentle guidance, ensuring every student develops an intimate, reverent bond with the Sacred Words.');
  const [credentials, setCredentials] = useState(user?.credentials || 'Ph.D. in Quranic Sciences, Al-Azhar University, Cairo');
  const [sanad, setSanad] = useState(user?.sanad || user?.sanadCertification || 'Connected Chain in Ten Minor & Major Qira\'at (Shatibiyyah & Tayyibah) back to the Prophet ﷺ (28 links unbroken)');
  const [specialties, setSpecialties] = useState(
    user?.specialties || ['Ten Qira\'at Ijazah', 'Hifz & Itqan', 'Waqf & Ibtida Theory', 'Al-Jazariyyah Matn']
  );
  const [languages, setLanguages] = useState(user?.languages || 'Arabic (Native), English (Fluent)');
  const [experience, setExperience] = useState(user?.experience || user?.yearsExperience || '18+ Years Academic & Sanad Instruction');
  const [graduates, setGraduates] = useState(user?.graduates || '180+ Sanad & Ijazah Recipients');
  const [ratePerClass, setRatePerClass] = useState(user?.ratePerClass || user?.hourlyRate || 35);
  const [location, setLocation] = useState(user?.location || 'Cairo, Egypt');
  const [certificates, setCertificates] = useState(user?.certificates || []);

  // Modal / Form state for Adding Certificate
  const [showCertForm, setShowCertForm] = useState(false);
  const [newCert, setNewCert] = useState({
    title: '',
    issuer: '',
    year: '2023',
    degreeLevel: 'Ijazah Sanad',
    grade: 'Mumtaz (Distinction)',
    credentialId: '',
    verificationUrl: '',
    description: '',
  });
  const [newSpecialtyInput, setNewSpecialtyInput] = useState('');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [unenrollLoading, setUnenrollLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const isStudent = user?.role === 'student';
  const isTeacher = user?.role === 'teacher';
  const isParent = user?.role === 'parent';
  const isAdmin = user?.role === 'admin';

  // Synchronize state when user prop updates
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.phone) setPhone(user.phone);
      if (user.honorific) setHonorific(user.honorific);
      if (user.title) setTitle(user.title);
      if (user.category) setCategory(user.category);
      if (user.division) setDivision(user.division);
      if (user.bio) setBio(user.bio);
      if (user.teachingPhilosophy) setTeachingPhilosophy(user.teachingPhilosophy);
      if (user.credentials) setCredentials(user.credentials);
      if (user.sanad || user.sanadCertification) setSanad(user.sanad || user.sanadCertification);
      if (user.specialties && Array.isArray(user.specialties)) setSpecialties(user.specialties);
      if (user.languages) setLanguages(user.languages);
      if (user.experience || user.yearsExperience) setExperience(user.experience || user.yearsExperience);
      if (user.graduates) setGraduates(user.graduates);
      if (user.ratePerClass || user.hourlyRate) setRatePerClass(user.ratePerClass || user.hourlyRate);
      if (user.location) setLocation(user.location);
      if (user.certificates && Array.isArray(user.certificates)) setCertificates(user.certificates);
    }
  }, [user]);

  const handleCopyId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleAddCertificate = (e) => {
    e.preventDefault();
    if (!newCert.title.trim() || !newCert.issuer.trim()) {
      alert('Please enter both Certificate Title and Issuing University/Institution.');
      return;
    }
    const certItem = {
      id: 'cert-' + Date.now(),
      title: newCert.title.trim(),
      issuer: newCert.issuer.trim(),
      year: newCert.year.trim() || new Date().getFullYear().toString(),
      degreeLevel: newCert.degreeLevel || 'Ijazah Sanad',
      grade: newCert.grade || 'Mumtaz (Distinction)',
      credentialId: newCert.credentialId.trim() || `QI-CERT-${Math.floor(1000 + Math.random() * 9000)}`,
      verificationUrl: newCert.verificationUrl.trim(),
      description: newCert.description.trim(),
      verified: true,
    };
    setCertificates((prev) => [...prev, certItem]);
    setNewCert({
      title: '',
      issuer: '',
      year: new Date().getFullYear().toString(),
      degreeLevel: 'Ijazah Sanad',
      grade: 'Mumtaz (Distinction)',
      credentialId: '',
      verificationUrl: '',
      description: '',
    });
    setShowCertForm(false);
  };

  const handleRemoveCertificate = (certId) => {
    if (window.confirm('Are you sure you want to remove this certificate from your profile?')) {
      setCertificates((prev) => prev.filter((c) => c.id !== certId));
    }
  };

  const handleAddSpecialty = () => {
    if (!newSpecialtyInput.trim()) return;
    const val = newSpecialtyInput.trim();
    if (!specialties.includes(val)) {
      setSpecialties((prev) => [...prev, val]);
    }
    setNewSpecialtyInput('');
  };

  const handleRemoveSpecialty = (item) => {
    setSpecialties((prev) => prev.filter((s) => s !== item));
  };

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const payload = {
        name,
        phone,
        preferredLanguage: language,
        ...(isStudent ? { tajweedLevel, targetGoal } : {}),
        ...(isTeacher
          ? {
              honorific,
              title,
              category,
              division,
              bio,
              teachingPhilosophy,
              credentials,
              sanad,
              sanadCertification: sanad,
              specialties,
              specialization: specialties.join(', '),
              languages,
              experience,
              yearsExperience: experience,
              graduates,
              ratePerClass: Number(ratePerClass) || 35,
              hourlyRate: Number(ratePerClass) || 35,
              location,
              certificates,
            }
          : {}),
      };

      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile.');
      }

      setSuccessMsg('Scholarly profile & accreditation updated successfully! Live on catalog.');
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

            {isTeacher && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="form-label" style={{ marginBottom: '6px' }}>
                      Arabic Honorific Title
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={honorific}
                      onChange={(e) => setHonorific(e.target.value)}
                      placeholder="e.g. فضيلة الشيخ د. أحمد الأزهري"
                      style={{ direction: 'rtl', fontFamily: 'var(--font-serif, serif)' }}
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ marginBottom: '6px' }}>
                      Academic Role / Chair
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Dean of Quranic Studies & Ten Qira'at Master"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="form-label" style={{ marginBottom: '6px' }}>
                      Faculty Department / Category
                    </label>
                    <select
                      className="form-input"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="hifz">Hifz &amp; Qira'at</option>
                      <option value="tajweed">Tajweed Specialists</option>
                      <option value="arabic">Quranic Arabic &amp; Grammar</option>
                      <option value="islamic-studies">Islamic Studies &amp; Seerah</option>
                      <option value="sisters">Sisters Division</option>
                      <option value="foundations">Foundations &amp; Qaida</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label" style={{ marginBottom: '6px' }}>
                      Faculty Division
                    </label>
                    <select
                      className="form-input"
                      value={division}
                      onChange={(e) => setDivision(e.target.value)}
                    >
                      <option value="brothers">Brothers Faculty</option>
                      <option value="sisters">Sisters Faculty</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label" style={{ marginBottom: '6px' }}>
                    Primary Academic Degree &amp; Al-Azhar Accreditations
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={credentials}
                    onChange={(e) => setCredentials(e.target.value)}
                    placeholder="e.g. Ph.D. in Quranic Sciences, Al-Azhar University, Cairo"
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label className="form-label" style={{ margin: 0 }}>
                      Biography &amp; Scholarly Background
                    </label>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Auto-synced to public landing page
                    </span>
                  </div>
                  <textarea
                    className="form-input"
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Describe your academic lineage, Al-Azhar training, teaching journey, and devotion to the Noble Quran..."
                    style={{ resize: 'vertical', lineHeight: '1.5' }}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ marginBottom: '6px' }}>
                    Teaching Philosophy &amp; Pedagogical Adab
                  </label>
                  <textarea
                    className="form-input"
                    rows={3}
                    value={teachingPhilosophy}
                    onChange={(e) => setTeachingPhilosophy(e.target.value)}
                    placeholder="Explain your approach to student patience, gentle correction, spiritual grounding, and memorization pacing..."
                    style={{ resize: 'vertical', lineHeight: '1.5' }}
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
                background: '#0D4A38',
                color: '#FFDF85',
                border: '1px solid #D4AF37',
                padding: '14px 20px',
                borderRadius: '10px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              <Icon name="check" size={16} color="#FFDF85" />
              <span>{saving ? 'Saving Scholarly Profile...' : 'Save Profile & Scholarly Portfolio'}</span>
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
              TEACHER VIEW: Comprehensive Scholarly Portfolio & Certificates Manager
              ==================================================================== */}
          {isTeacher && (
            <div
              style={{
                background: '#FFFFFF',
                border: '1.5px solid var(--border-light)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              {/* Header with Title and Public Preview Button */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  borderBottom: '1px solid #E2E8F0',
                  paddingBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'rgba(13, 74, 56, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon name="award" size={20} color="var(--color-gold-deep)" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: 'var(--color-green-deep)' }}>
                      Scholarly Portfolio &amp; Accreditation
                    </h3>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Manage your Sanad chains, verified diplomas, and teaching credentials
                    </span>
                  </div>
                </div>

                <a
                  href={`/teachers/${user?.slug || 'sheikh-ahmed-alazhari'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'var(--color-gold-light, #FAF5E8)',
                    color: 'var(--color-gold-deep, #92400E)',
                    border: '1px solid rgba(197, 164, 90, 0.4)',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '700',
                    textDecoration: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <Icon name="sparkles" size={13} color="var(--color-gold-deep)" />
                  <span>View Public Profile ↗</span>
                </a>
              </div>

              {/* 1. Connected Chain (Sanad) Box */}
              <div>
                <label className="form-label" style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Connected Chain of Transmission (Sanad / الإسناد المتصل)</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-green-primary)' }}>Prophetic Lineage</span>
                </label>
                <textarea
                  className="form-input"
                  rows={2}
                  value={sanad}
                  onChange={(e) => setSanad(e.target.value)}
                  placeholder="e.g. Connected Chain in Ten Minor & Major Qira'at back to the Prophet ﷺ (28 links unbroken)"
                  style={{ resize: 'vertical', fontSize: '13px' }}
                />
              </div>

              {/* 2. Key Logistics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label" style={{ marginBottom: '6px' }}>
                    Honorarium per Class ($ USD)
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    value={ratePerClass}
                    onChange={(e) => setRatePerClass(e.target.value)}
                    placeholder="35"
                  />
                </div>

                <div>
                  <label className="form-label" style={{ marginBottom: '6px' }}>
                    Years of Teaching Experience
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="18+ Years"
                  />
                </div>

                <div>
                  <label className="form-label" style={{ marginBottom: '6px' }}>
                    Total Certified Graduates
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={graduates}
                    onChange={(e) => setGraduates(e.target.value)}
                    placeholder="180+ Sanad Recipients"
                  />
                </div>

                <div>
                  <label className="form-label" style={{ marginBottom: '6px' }}>
                    Sanctuary / Teaching Location
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Cairo, Egypt"
                  />
                </div>
              </div>

              <div>
                <label className="form-label" style={{ marginBottom: '6px' }}>
                  Spoken Languages
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                  placeholder="Arabic (Native), English (Fluent)"
                />
              </div>

              {/* 3. Areas of Specialization Manager */}
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>
                  Areas of Specialization &amp; Matn Mastery
                </label>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                  {specialties.map((spec, i) => (
                    <span
                      key={i}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#0D4A38',
                        color: '#FFDF85',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      <span>✦ {spec}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecialty(spec)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#FFDF85',
                          cursor: 'pointer',
                          padding: '0 2px',
                          fontSize: '13px',
                          lineHeight: 1,
                        }}
                        title="Remove tag"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {/* Quick Preset Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                  {['Ten Qira\'at', 'Hifz & Itqan', 'Waqf & Ibtida', 'Al-Jazariyyah', 'Nahw & Sarf', 'Maqamat', 'Noorani Qaida'].map((preset) => (
                    !specialties.includes(preset) && (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setSpecialties((prev) => [...prev, preset])}
                        style={{
                          background: '#FFFFFF',
                          border: '1px dashed #CBD5E1',
                          borderRadius: '6px',
                          fontSize: '11px',
                          padding: '3px 8px',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                        }}
                      >
                        + {preset}
                      </button>
                    )
                  ))}
                </div>

                {/* Add Custom Tag */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={newSpecialtyInput}
                    onChange={(e) => setNewSpecialtyInput(e.target.value)}
                    placeholder="Type custom specialty..."
                    style={{ fontSize: '12px', padding: '6px 10px' }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSpecialty();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddSpecialty}
                    style={{
                      background: 'var(--color-green-deep)',
                      color: '#FFF',
                      border: 'none',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* 4. Interactive Verified Diplomas & Certificates Showcase */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: 'var(--color-green-deep)' }}>
                      Official Diplomas &amp; Certificates ({certificates.length})
                    </h4>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      Degrees and Ijazahs displayed on your public landing profile
                    </span>
                  </div>

                  {!showCertForm && (
                    <button
                      type="button"
                      onClick={() => setShowCertForm(true)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#0D4A38',
                        color: '#FFDF85',
                        border: '1px solid #D4AF37',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                      }}
                    >
                      <Icon name="check" size={13} color="#FFDF85" />
                      <span>+ Add Certificate</span>
                    </button>
                  )}
                </div>

                {/* Add Certificate Inline Form */}
                {showCertForm && (
                  <div
                    style={{
                      background: '#FAF7EE',
                      border: '1.5px solid #D4AF37',
                      borderRadius: '12px',
                      padding: '16px',
                      marginBottom: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '800', fontSize: '14px', color: '#0D4A38' }}>
                        🎓 Add Scholarly Certificate or Ijazah
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowCertForm(false)}
                        style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', color: '#64748B' }}
                      >
                        ✕
                      </button>
                    </div>

                    <div>
                      <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#0D4A38', display: 'block', marginBottom: '4px' }}>
                        Certificate / Degree Title *
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Ph.D. in Quranic Sciences & Recitations"
                        value={newCert.title}
                        onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#0D4A38', display: 'block', marginBottom: '4px' }}>
                          Issuing University / Institution *
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Faculty of Quranic Recitations, Al-Azhar University"
                          value={newCert.issuer}
                          onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#0D4A38', display: 'block', marginBottom: '4px' }}>
                          Year Awarded
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="2016"
                          value={newCert.year}
                          onChange={(e) => setNewCert({ ...newCert, year: e.target.value })}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#0D4A38', display: 'block', marginBottom: '4px' }}>
                          Degree / License Level
                        </label>
                        <select
                          className="form-input"
                          value={newCert.degreeLevel}
                          onChange={(e) => setNewCert({ ...newCert, degreeLevel: e.target.value })}
                        >
                          <option value="Doctor of Philosophy (Ph.D.)">Doctorate (Ph.D.)</option>
                          <option value="Master of Arts (M.A.)">Master's Degree (M.A.)</option>
                          <option value="Bachelor of Arts (B.A.)">Bachelor's Degree (B.A.)</option>
                          <option value="Supreme Ijazah Kubra">Supreme Ijazah Kubra</option>
                          <option value="Ijazah Sanad">Ijazah Sanad</option>
                          <option value="Postgraduate Diploma">Postgraduate Diploma</option>
                          <option value="Executive Trainer License">Master Trainer License</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#0D4A38', display: 'block', marginBottom: '4px' }}>
                          Grade / Distinction
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Mumtaz with Highest Honors"
                          value={newCert.grade}
                          onChange={(e) => setNewCert({ ...newCert, grade: e.target.value })}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#0D4A38', display: 'block', marginBottom: '4px' }}>
                          Credential / License ID
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="AZH-QUR-2016-8910"
                          value={newCert.credentialId}
                          onChange={(e) => setNewCert({ ...newCert, credentialId: e.target.value })}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#0D4A38', display: 'block', marginBottom: '4px' }}>
                          Online Verification URL (Optional)
                        </label>
                        <input
                          type="url"
                          className="form-input"
                          placeholder="https://alazhar.edu.eg/verify/..."
                          value={newCert.verificationUrl}
                          onChange={(e) => setNewCert({ ...newCert, verificationUrl: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#0D4A38', display: 'block', marginBottom: '4px' }}>
                        Description &amp; Scope of Study
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Authorized to transmit unbroken chains and calibrate acoustic phonetics."
                        value={newCert.description}
                        onChange={(e) => setNewCert({ ...newCert, description: e.target.value })}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                      <button
                        type="button"
                        onClick={handleAddCertificate}
                        style={{
                          background: '#0D4A38',
                          color: '#FFDF85',
                          border: 'none',
                          padding: '10px 18px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '700',
                          cursor: 'pointer',
                        }}
                      >
                        ✓ Add Certificate to Portfolio
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCertForm(false)}
                        style={{
                          background: '#F1F5F9',
                          color: '#475569',
                          border: '1px solid #CBD5E1',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Certificates List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {certificates.length === 0 ? (
                    <div
                      style={{
                        background: '#F8FAFC',
                        border: '1px dashed #CBD5E1',
                        borderRadius: '10px',
                        padding: '24px',
                        textAlign: 'center',
                        color: 'var(--text-muted)',
                        fontSize: '13px',
                      }}
                    >
                      No certificates added yet. Click "+ Add Certificate" above to showcase your academic degrees and Ijazah accreditations.
                    </div>
                  ) : (
                    certificates.map((cert) => (
                      <div
                        key={cert.id}
                        style={{
                          background: '#FAF7EE',
                          border: '1px solid #E6D8A8',
                          borderRadius: '10px',
                          padding: '14px 16px',
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: '12px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '8px',
                              background: '#0D4A38',
                              color: '#FFDF85',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              marginTop: '2px',
                            }}
                          >
                            <Icon name="award" size={20} color="#FFDF85" />
                          </div>

                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <h5 style={{ margin: 0, fontSize: '14.5px', fontWeight: '800', color: '#0D4A38' }}>
                                {cert.title}
                              </h5>
                              <span
                                style={{
                                  background: '#FEF3C7',
                                  color: '#92400E',
                                  padding: '2px 8px',
                                  borderRadius: '999px',
                                  fontSize: '10.5px',
                                  fontWeight: '700',
                                }}
                              >
                                {cert.degreeLevel || 'Verified Degree'}
                              </span>
                            </div>

                            <div style={{ fontSize: '12.5px', color: '#475569', marginTop: '4px' }}>
                              <span>🏛 {cert.issuer}</span>
                              {cert.year && <span> &bull; Year {cert.year}</span>}
                              {cert.grade && <span style={{ color: '#0D4A38', fontWeight: '600' }}> &bull; {cert.grade}</span>}
                            </div>

                            {cert.description && (
                              <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#64748B', lineHeight: '1.4' }}>
                                {cert.description}
                              </p>
                            )}

                            {cert.credentialId && (
                              <div style={{ marginTop: '6px', fontSize: '11px', color: '#0D4A38', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Icon name="shield-check" size={13} color="#10B981" />
                                <span>ID: <strong>{cert.credentialId}</strong></span>
                                {cert.verificationUrl && (
                                  <a
                                    href={cert.verificationUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: '#2563EB', textDecoration: 'underline', marginLeft: '6px' }}
                                  >
                                    Verify Credential ↗
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveCertificate(cert.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#EF4444',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px',
                          }}
                          title="Remove certificate"
                        >
                          <Icon name="x" size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Bottom Quick Save CTA */}
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={saving}
                style={{
                  background: '#0D4A38',
                  color: '#FFDF85',
                  border: '1px solid #D4AF37',
                  padding: '14px 20px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '8px',
                }}
              >
                <Icon name="check" size={16} color="#FFDF85" />
                <span>{saving ? 'Saving Portfolio...' : 'Save Scholarly Portfolio & Diplomas'}</span>
              </button>
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
