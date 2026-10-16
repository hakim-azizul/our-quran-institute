'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from './Icons';
import StudentProgressComboChart from './StudentProgressComboChart';

export default function StudentParentProgressView({
  currentUser,
  onOpenReviewModal,
  onOpenDigitalQuran,
  onOpenInvoiceModal,
}) {
  const isParent = currentUser?.role === 'parent';

  // Demo children for parent
  const parentChildren = [
    {
      id: 'QI-STU-8842',
      name: 'Tariq Al-Mansoor',
      avatar: 'student',
      role: 'student',
      memorizedJuz: 12,
      totalJuz: 30,
      mentor: 'Dr. Sheikh Ahmad Al-Azhari',
      mentorId: 'QI-FAC-014',
      attendanceRate: 96,
      currentSurah: 'Surah Yusuf (يُوسُف)',
      currentPara: 12,
      targetKhatmDate: 'June 2027',
      pagesMemorized: 240,
    },
    {
      id: 'QI-STU-7721',
      name: 'Zaid bin Harith',
      avatar: 'student',
      role: 'student',
      memorizedJuz: 6,
      totalJuz: 30,
      mentor: 'Ustadh Mahmoud Al-Misri',
      mentorId: 'QI-FAC-028',
      attendanceRate: 92,
      currentSurah: 'Surah An-Nisa (النِّسَاء)',
      currentPara: 6,
      targetKhatmDate: 'December 2027',
      pagesMemorized: 120,
    },
  ];

  const [activeChildId, setActiveChildId] = useState(
    isParent ? parentChildren[0].id : currentUser?.id || 'QI-STU-8842'
  );

  const activeStudent = isParent
    ? parentChildren.find((c) => c.id === activeChildId) || parentChildren[0]
    : {
        id: currentUser?.id || 'QI-STU-8842',
        name: currentUser?.name || 'Tariq Al-Mansoor',
        avatar: currentUser?.avatar || 'student',
        memorizedJuz: currentUser?.memorizedJuz || 12,
        totalJuz: 30,
        mentor: currentUser?.mentor || 'Dr. Sheikh Ahmad Al-Azhari',
        mentorId: currentUser?.assignedTeacherId || 'QI-FAC-014',
        attendanceRate: 96,
        currentSurah: 'Surah Yusuf (يُوسُف)',
        currentPara: currentUser?.memorizedJuz || 12,
        targetKhatmDate: 'June 2027',
        pagesMemorized: (currentUser?.memorizedJuz || 12) * 20,
      };

  const [progressLogs, setProgressLogs] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData(activeStudent.id);
  }, [activeStudent.id]);

  const fetchStudentData = async (stuId) => {
    try {
      setLoading(true);
      const [progRes, attRes] = await Promise.all([
        fetch(`/api/progress?studentId=${encodeURIComponent(stuId)}`),
        fetch(`/api/attendance?studentId=${encodeURIComponent(stuId)}`),
      ]);

      const progData = await progRes.json();
      const attData = await attRes.json();

      if (progData.success && progData.progressLogs) {
        setProgressLogs(progData.progressLogs);
      }
      if (attData.success && attData.attendance) {
        setAttendanceRecords(attData.attendance);
      }
    } catch (err) {
      console.error('Failed to load student progress:', err);
    } finally {
      setLoading(false);
    }
  };

  const latestLog = progressLogs[0] || null;
  const latestAttendance = attendanceRecords[0] || null;

  const memorizedCount = activeStudent.memorizedJuz || 12;
  const totalCount = activeStudent.totalJuz || 30;
  const completionPercentage = Math.round((memorizedCount / totalCount) * 100);

  return (
    <div className="student-parent-progress-wrapper">
      {/* If Parent: Child Selector Switcher */}
      {isParent && (
        <div className="parent-child-switcher-bar">
          <div className="switcher-info">
            <span className="switcher-badge">
              <Icon name="users" size={14} style={{ marginRight: 6 }} /> Guardian View
            </span>
            <span className="switcher-prompt">Select Child to Monitor Progress:</span>
          </div>
          <div className="child-tabs-row">
            {parentChildren.map((child) => {
              const isSelected = child.id === activeChildId;
              return (
                <button
                  key={child.id}
                  type="button"
                  className={`child-tab-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => setActiveChildId(child.id)}
                >
                  <span className="child-avatar">
                    <Icon name="student" size={16} />
                  </span>
                  <div className="child-details">
                    <span className="child-name">{child.name}</span>
                    <span className="child-meta">
                      Para {child.memorizedJuz} of {child.totalJuz} ({Math.round((child.memorizedJuz / child.totalJuz) * 100)}%)
                    </span>
                  </div>
                  {isSelected && <span className="child-active-dot">●</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Hero Card: Live Hifz Progress & Circular Gauge */}
      <div className="hifz-hero-card">
        <div className="hifz-hero-left">
          <div className="hifz-header-badge">
            <Icon name="book-open" size={14} style={{ marginRight: 6, color: '#c5a45a' }} />
            <span>Quran Memorization Progress</span>
          </div>
          <h2 className="hifz-hero-title">
            {activeStudent.name}’s Progress
          </h2>
          <p className="hifz-hero-subtitle">
            Teacher: <strong>{activeStudent.mentor}</strong>.
            Currently learning <strong>{activeStudent.currentSurah}</strong> (Juz {activeStudent.currentPara}).
          </p>

          <div className="hifz-quick-stats-row">
            <div className="quick-stat-box">
              <span className="stat-num">{memorizedCount}</span>
              <span className="stat-desc">Juz Completed</span>
            </div>
            <div className="quick-stat-box">
              <span className="stat-num">{totalCount - memorizedCount}</span>
              <span className="stat-desc">Juz Remaining</span>
            </div>
            <div className="quick-stat-box">
              <span className="stat-num">{activeStudent.pagesMemorized}</span>
              <span className="stat-desc">Pages Recited</span>
            </div>
            <div className="quick-stat-box">
              <span className="stat-num">{activeStudent.attendanceRate}%</span>
              <span className="stat-desc">Attendance Rate</span>
            </div>
          </div>
        </div>

        {/* Circular Radial Gauge */}
        <div className="hifz-hero-right">
          <div className="circular-progress-container">
            <svg viewBox="0 0 100 100" className="circular-chart">
              <path
                className="circle-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="circle-fill"
                strokeDasharray={`${completionPercentage}, 100`}
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="circle-inner-content">
              <span className="circle-percent">{completionPercentage}%</span>
              <span className="circle-label">Completed</span>
              <span className="circle-sub">{memorizedCount}/30 Juz</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive 30-Juz Progress Visual Grid */}
      <div className="juz-grid-card">
        <div className="juz-grid-header">
          <div>
            <h3 className="juz-grid-title">30 Juz Tracker</h3>
            <p className="juz-grid-subtitle">
              Track memorized sections, active lessons, and upcoming chapters across all 30 Juz.
            </p>
          </div>
          <div className="juz-grid-legend">
            <span className="legend-item"><span className="legend-dot memorized"></span> Completed ({memorizedCount})</span>
            <span className="legend-item"><span className="legend-dot active"></span> Current Lesson (Juz {activeStudent.currentPara})</span>
            <span className="legend-item"><span className="legend-dot remaining"></span> Upcoming ({totalCount - memorizedCount})</span>
          </div>
        </div>

        <div className="juz-boxes-grid">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((juzNum) => {
            const isMemorized = juzNum <= memorizedCount;
            const isActive = juzNum === activeStudent.currentPara;
            return (
              <div
                key={juzNum}
                className={`juz-box ${isActive ? 'active-sabaq' : isMemorized ? 'memorized' : 'remaining'}`}
                title={`Juz ${juzNum} ${isMemorized ? '— Completed' : isActive ? '— Current Lesson' : '— Upcoming'}`}
              >
                <span className="juz-box-number">Juz {juzNum}</span>
                <span className="juz-box-status">
                  {isActive ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                      <Icon name="zap" size={11} /> Active
                    </span>
                  ) : isMemorized ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                      <Icon name="check" size={11} /> Completed
                    </span>
                  ) : (
                    'Pending'
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analytical Multi-Metric Bar + Line Combo Chart */}
      <StudentProgressComboChart
        studentName={activeStudent.name}
        studentId={activeStudent.id}
        memorizedJuz={activeStudent.memorizedJuz}
        progressLogs={progressLogs}
      />

      {/* Real-Time Daily Feed */}
      <div className="daily-updates-section">
        <div className="section-title-row">
          <div>
            <h3 className="section-title">Today’s Lesson &amp; Feedback</h3>
            <p className="section-subtitle">
              Daily report recorded by teacher <strong>{activeStudent.mentor}</strong> for today’s session.
            </p>
          </div>
          {onOpenDigitalQuran && (
            <button
              type="button"
              className="btn-read-quran-cta"
              onClick={onOpenDigitalQuran}
            >
              <Icon name="book-open" size={16} style={{ marginRight: 8 }} />
              Open Quran Reader
            </button>
          )}
        </div>

        <div className="daily-cards-grid">
          {/* Card 1: Today's Sabaq (New Lesson) */}
          <div className="daily-feed-card sabaq-card">
            <div className="daily-card-top">
              <span className="daily-card-icon">
                <Icon name="book" size={18} />
              </span>
              <span className="daily-card-tag">New Lesson (Sabaq)</span>
            </div>
            <h4 className="daily-card-title">
              {latestLog?.sabaq?.surah || 'Surah Yusuf (يُوسُف)'}
            </h4>
            <div className="daily-card-detail">
              <strong>Ayahs:</strong> {latestLog?.sabaq?.startAyah || 1} to {latestLog?.sabaq?.endAyah || 22}
            </div>
            <div className="daily-card-detail">
              <strong>Juz:</strong> Juz {latestLog?.sabaq?.para || activeStudent.currentPara}
            </div>
            <div className="daily-card-grade">
              Grade: <span className="grade-pill">{latestLog?.sabaq?.grade || 'Mumtaz (Excellent)'}</span>
            </div>
            {latestLog?.sabaq?.notes && (
              <p className="daily-card-notes">"{latestLog.sabaq.notes}"</p>
            )}
          </div>

          {/* Card 2: Today's Sabqi / Revision */}
          <div className="daily-feed-card sabqi-card">
            <div className="daily-card-top">
              <span className="daily-card-icon">
                <Icon name="repeat" size={18} />
              </span>
              <span className="daily-card-tag">Recent Revision (Sabqi)</span>
            </div>
            <h4 className="daily-card-title">
              {latestLog?.sabqi?.surahs || 'Surah Hud (Ayahs 50-123)'}
            </h4>
            <div className="daily-card-detail">
              <strong>Revision Juz:</strong> Juz {latestLog?.sabqi?.para || 11}
            </div>
            <div className="daily-card-detail">
              <strong>Accuracy:</strong> {latestLog?.sabqi?.accuracy || '96%'}
            </div>
            <div className="daily-card-grade">
              Grade: <span className="grade-pill">{latestLog?.sabqi?.grade || 'Jayyid Jiddan (Very Good)'}</span>
            </div>
            <p className="daily-card-notes">Retention confirmed. Ready for next Juz progression.</p>
          </div>

          {/* Card 3: Today's Attendance & Punctuality */}
          <div className="daily-feed-card attendance-card">
            <div className="daily-card-top">
              <span className="daily-card-icon">
                <Icon name="clock" size={18} />
              </span>
              <span className="daily-card-tag">Attendance</span>
            </div>
            <h4 className="daily-card-title">
              {latestAttendance?.status === 'present' ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#10b981' }}>
                  <Icon name="check-circle" size={16} /> Present
                </span>
              ) : (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#f59e0b' }}>
                  <Icon name="clock" size={16} /> Attended
                </span>
              )}
            </h4>
            <div className="daily-card-detail">
              <strong>Status:</strong> {latestAttendance?.status?.toUpperCase() || 'PRESENT'}
            </div>
            <div className="daily-card-detail">
              <strong>Logged By:</strong> {latestAttendance?.teacherName || activeStudent.mentor}
            </div>
            <div className="daily-card-detail">
              <strong>Time:</strong> {latestAttendance ? new Date(latestAttendance.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:00 AM'}
            </div>
            <p className="daily-card-notes">
              {latestAttendance?.note || 'On time, prepared, and attentive.'}
            </p>
          </div>

          {/* Card 4: Daily Habits & Character */}
          <div className="daily-feed-card tarbiyah-card">
            <div className="daily-card-top">
              <span className="daily-card-icon">
                <Icon name="heart" size={18} />
              </span>
              <span className="daily-card-tag">Daily Habits &amp; Character</span>
            </div>
            <h4 className="daily-card-title">
              {latestLog?.tarbiyah?.adabScore || 'Outstanding (10/10)'}
            </h4>
            <div className="daily-card-detail">
              <strong>Daily Prayers:</strong> {latestLog?.tarbiyah?.salatAttendance || '5/5 In Congregation'}
            </div>
            <div className="daily-card-detail">
              <strong>Sunnah Practice:</strong> {latestLog?.tarbiyah?.sunnahHabit || 'Morning & Evening Adhkar'}
            </div>
            {latestLog?.tarbiyah?.teacherGuidance && (
              <p className="daily-card-notes">
                <strong>Guidance:</strong> {latestLog.tarbiyah.teacherGuidance}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Teacher's Daily Comment & Review Box */}
      <div className="ustadh-feedback-card">
        <div className="ustadh-feedback-header">
          <div className="ustadh-avatar-info">
            <span className="ustadh-avatar">
              <Icon name="scholar" size={20} />
            </span>
            <div>
              <h4 className="ustadh-name">{activeStudent.mentor}</h4>
              <span className="ustadh-title">Certified Teacher • Tajweed &amp; Qira’at</span>
            </div>
          </div>

          <div className="ustadh-actions">
            {onOpenReviewModal && (
              completionPercentage >= 100 ? (
                <button
                  type="button"
                  className="btn-rate-teacher"
                  onClick={() => onOpenReviewModal(activeStudent.mentorId, activeStudent.mentor, activeStudent.id)}
                >
                  <Icon name="star" size={15} style={{ marginRight: 6 }} fill="#FFDF85" />
                  Review Teacher
                </button>
              ) : (
                <div
                  className="ustadh-review-locked-pill"
                  title="Teacher review available upon course completion"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#94A3B8',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  <Icon name="lock" size={13} color="#94A3B8" />
                  <span>Teacher review unlocks upon course completion ({completionPercentage}%)</span>
                </div>
              )
            )}
            {onOpenInvoiceModal && (
              <button
                type="button"
                className="btn-view-tuition-invoice"
                onClick={onOpenInvoiceModal}
              >
                <Icon name="receipt" size={15} style={{ marginRight: 6 }} />
                Invoices &amp; Receipts
              </button>
            )}
          </div>
        </div>

        <div className="ustadh-quote-body">
          <span className="quote-mark">“</span>
          <p className="quote-text">
            {latestLog?.teacherFeedback ||
              'MashaAllah, Tariq showed exceptional dedication today in Surah Yusuf. His Makharij on throat letters and smooth transitions between Ayahs are progressing swiftly. Parents are encouraged to maintain 20 minutes of audio recitation listening before Fajr.'}
          </p>
        </div>
      </div>
    </div>
  );
}
