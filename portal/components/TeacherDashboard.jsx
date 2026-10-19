'use client';

import React, { useState } from 'react';
import { Icon } from './Icons';

export default function TeacherDashboard({
  currentUser,
  studentsList = [],
  coursesList = [],
  course,
  onNavigateTab,
  onSelectStudent,
  onOpenQuranForStudent,
  onRefreshData,
}) {
  const teacherName = currentUser?.name || 'Dr. Sheikh Ahmad Al-Azhari';
  const teacherId = currentUser?.id || 'QI-FAC-014';
  const sanadCert =
    currentUser?.sanadCertification ||
    '10 Qira’at Mutawatirah with Connected Chain (Al-Azhar Al-Sharif)';
  const specialization =
    currentUser?.specialization || 'Qira’at, Tajweed Sanad & Advanced Hifz';

  // Demo fallback students if list is empty
  const defaultStudents = [
    {
      studentId: 'QI-STU-8842',
      studentName: 'Tariq Al-Mansoor',
      courseTitle: 'Quran Reading Foundation & Tajweed Mastery',
      memorizedJuz: 12,
      totalJuz: 30,
      lastSabaq: 'Surah Yusuf (Ayahs 1–22)',
      lastGrade: 'Mumtaz (98%)',
      attendanceStreak: 19,
      activeMistakesCount: 2,
      avatar: 'student',
    },
    {
      studentId: 'QI-STU-9904',
      studentName: 'Maryam Al-Qasim',
      courseTitle: 'Full Quran Memorization (Hifz Track)',
      memorizedJuz: 18,
      totalJuz: 30,
      lastSabaq: 'Surah Maryam (Ayahs 1–35)',
      lastGrade: 'Mumtaz (99%)',
      attendanceStreak: 24,
      activeMistakesCount: 1,
      avatar: 'student',
    },
    {
      studentId: 'QI-STU-7721',
      studentName: 'Zaid bin Harith',
      courseTitle: 'Intermediate Tajweed & Makharij Rules',
      memorizedJuz: 8,
      totalJuz: 30,
      lastSabaq: 'Surah Al-Baqarah (Ayahs 255–260)',
      lastGrade: 'Jayyid Jiddan (92%)',
      attendanceStreak: 14,
      activeMistakesCount: 3,
      avatar: 'student',
    },
    {
      studentId: 'QI-STU-6510',
      studentName: 'Bilal bin Rabah',
      courseTitle: 'Noorani Qaida & Arabic Phonetics',
      memorizedJuz: 2,
      totalJuz: 30,
      lastSabaq: 'Noon Sakinah & Tanween (Lesson 8)',
      lastGrade: 'Mumtaz (95%)',
      attendanceStreak: 11,
      activeMistakesCount: 0,
      avatar: 'student',
    },
  ];

  const displayStudents = studentsList.length > 0 ? studentsList : defaultStudents;

  // Live Today's Schedule Data
  const [scheduleItems, setScheduleItems] = useState([
    {
      id: 'sch-1',
      time: '04:00 PM – 04:45 PM',
      studentId: 'QI-STU-8842',
      studentName: 'Tariq Al-Mansoor',
      course: 'Quran Reading Foundation & Tajweed Mastery',
      focus: 'Surah Yusuf (1–22) • Sabaq & Sabqi Review',
      status: 'Completed',
      statusType: 'completed',
      grade: 'Mumtaz (98%)',
      room: 'Halaqah Room #1',
    },
    {
      id: 'sch-2',
      time: '05:00 PM – 05:45 PM',
      studentId: 'QI-STU-9904',
      studentName: 'Maryam Al-Qasim',
      course: 'Full Quran Memorization (Hifz Track)',
      focus: 'Surah Maryam (1–35) • Madd Munfasil Precision',
      status: 'Live Now',
      statusType: 'live',
      grade: 'In Session',
      room: 'Halaqah Room #2',
    },
    {
      id: 'sch-3',
      time: '06:30 PM – 07:15 PM',
      studentId: 'QI-STU-7721',
      studentName: 'Zaid bin Harith',
      course: 'Intermediate Tajweed & Makharij Rules',
      focus: 'Surah Al-Baqarah (255–260) • Manzil Revision',
      status: 'Upcoming (in 45m)',
      statusType: 'upcoming',
      grade: 'Pending',
      room: 'Halaqah Room #1',
    },
    {
      id: 'sch-4',
      time: '07:45 PM – 08:30 PM',
      studentId: 'QI-STU-6510',
      studentName: 'Bilal bin Rabah',
      course: 'Noorani Qaida & Arabic Phonetics',
      focus: 'Lesson 8: Rules of Noon Sakinah & Tanween',
      status: 'Scheduled',
      statusType: 'scheduled',
      grade: 'Pending',
      room: 'Halaqah Room #3',
    },
  ]);

  // Pending Homework / Submission Queue State
  const [pendingSubmissions, setPendingSubmissions] = useState([
    {
      id: 'sub-1',
      studentId: 'QI-STU-8842',
      studentName: 'Tariq Al-Mansoor',
      title: 'Surah Al-Kahf (Ayahs 1–10) Recitation Audio',
      type: 'Audio Recording',
      submittedAt: 'Today at 2:15 PM',
      duration: '3m 42s',
      notes: 'Please check Madd Lazim at Ayah 7 and Qalqalah on Dal.',
      reviewed: false,
    },
    {
      id: 'sub-2',
      studentId: 'QI-STU-9904',
      studentName: 'Maryam Al-Qasim',
      title: 'Module 4 Exam: Rules of Meem Sakinah',
      type: 'Quiz Submission',
      submittedAt: 'Yesterday at 8:40 PM',
      duration: '100% Score (10/10)',
      notes: 'Automated quiz passed with honors. Requires faculty sign-off.',
      reviewed: false,
    },
    {
      id: 'sub-3',
      studentId: 'QI-STU-7721',
      studentName: 'Zaid bin Harith',
      title: 'Surah Ya-Sin (Ayahs 1–20) Homework Audio',
      type: 'Audio Recording',
      submittedAt: '2 days ago',
      duration: '4m 10s',
      notes: 'Focused on Ghunnah timing and throat Makharij.',
      reviewed: false,
    },
  ]);

  const [activeAudioPlaying, setActiveAudioPlaying] = useState(null);
  const [submissionFeedbackModal, setSubmissionFeedbackModal] = useState(null);
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleApproveSubmission = (subId) => {
    setPendingSubmissions((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, reviewed: true } : s))
    );
    showToast('Submission verified and feedback dispatched to student & guardian.');
    setSubmissionFeedbackModal(null);
  };

  return (
    <div className="teacher-dashboard-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="portal-toast-banner">
          <Icon name="check-circle" size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Scholar Executive Header */}
      <section className="teacher-dash-hero-card">
        <div className="teacher-dash-hero-left">
          <div className="teacher-dash-avatar-box">
            <span className="teacher-dash-avatar-icon">
              <Icon name="scholar" size={32} color="#0D4A38" />
            </span>
            <span className="teacher-dash-status-dot" title="Faculty Active Online" />
          </div>

          <div className="teacher-dash-info">
            <div className="teacher-dash-badge-row">
              <span className="status-badge-verified">
                <Icon name="check-circle-2" size={13} style={{ marginRight: 4 }} />
                Verified Scholar
              </span>
              <span className="teacher-dash-id-badge">ID: {teacherId}</span>
              <span className="teacher-dash-date-pill">
                <Icon name="calendar" size={12} style={{ marginRight: 4 }} />
                Sunday, 7 Rabi’ al-Thani 1448 AH • October 2026
              </span>
            </div>

            <h1 className="teacher-dash-title">
              Salam Alaykum, {teacherName}
            </h1>

            <p className="teacher-dash-sanad-text">
              <strong>Ijazah &amp; Credentials:</strong> {sanadCert} •{' '}
              <span className="teacher-dash-spec">{specialization}</span>
            </p>
          </div>
        </div>

        <div className="teacher-dash-hero-actions">
          <button
            type="button"
            className="btn-dash-primary-gold"
            onClick={() => onNavigateTab && onNavigateTab('actionboard')}
          >
            <Icon name="zap" size={16} style={{ marginRight: 6 }} />
            Daily Attendance &amp; Sabaq
          </button>

          <button
            type="button"
            className="btn-dash-outline-emerald"
            onClick={() => onNavigateTab && onNavigateTab('quran')}
          >
            <Icon name="flag" size={15} style={{ marginRight: 6 }} />
            Open Quran Annotator
          </button>
        </div>
      </section>

      {/* 2. Key Executive Performance Metrics (Pure Solid Color Palette) */}
      <section className="teacher-dash-metrics-grid">
        {/* Metric 1: Active Assigned Students */}
        <div className="teacher-metric-card">
          <div className="teacher-metric-header">
            <span className="teacher-metric-label">ACTIVE STUDENTS</span>
            <span className="teacher-metric-icon-wrap bg-green-subtle text-green">
              <Icon name="users" size={18} />
            </span>
          </div>
          <div className="teacher-metric-val-row">
            <span className="teacher-metric-value">{displayStudents.length}</span>
            <span className="teacher-metric-subtag">+2 New Enrolled</span>
          </div>
          <p className="teacher-metric-desc">Assigned to your 1-on-1 Quran halaqat</p>
          <button
            type="button"
            className="teacher-metric-link"
            onClick={() => onNavigateTab && onNavigateTab('overview')}
          >
            View Student Roster →
          </button>
        </div>

        {/* Metric 2: Completed Classes This Month */}
        <div className="teacher-metric-card">
          <div className="teacher-metric-header">
            <span className="teacher-metric-label">MONTHLY SESSIONS</span>
            <span className="teacher-metric-icon-wrap bg-gold-subtle text-gold">
              <Icon name="calendar-days" size={18} />
            </span>
          </div>
          <div className="teacher-metric-val-row">
            <span className="teacher-metric-value">34</span>
            <span className="teacher-metric-subtag text-gold-dark">94.4% Goal</span>
          </div>
          <p className="teacher-metric-desc">October 2026 teaching billing cycle</p>
          <button
            type="button"
            className="teacher-metric-link"
            onClick={() => onNavigateTab && onNavigateTab('salary')}
          >
            Inspect Classes Ledger →
          </button>
        </div>

        {/* Metric 3: Accrued Teaching Salary */}
        <div className="teacher-metric-card">
          <div className="teacher-metric-header">
            <span className="teacher-metric-label">ACCRUED SALARY</span>
            <span className="teacher-metric-icon-wrap bg-emerald-subtle text-emerald">
              <Icon name="wallet" size={18} />
            </span>
          </div>
          <div className="teacher-metric-val-row">
            <span className="teacher-metric-value">$1,240.00</span>
            <span className="teacher-metric-subtag text-green-dark">Authorized</span>
          </div>
          <p className="teacher-metric-desc">~148,800 BDT • $35.00/class base rate</p>
          <button
            type="button"
            className="teacher-metric-link"
            onClick={() => onNavigateTab && onNavigateTab('salary')}
          >
            View Pay Vouchers →
          </button>
        </div>

        {/* Metric 4: Average Recitation Accuracy */}
        <div className="teacher-metric-card">
          <div className="teacher-metric-header">
            <span className="teacher-metric-label">ACCURACY AVERAGE</span>
            <span className="teacher-metric-icon-wrap bg-blue-subtle text-blue">
              <Icon name="check-circle" size={18} />
            </span>
          </div>
          <div className="teacher-metric-val-row">
            <span className="teacher-metric-value">96.4%</span>
            <span className="teacher-metric-subtag text-green-dark">Mumtaz</span>
          </div>
          <p className="teacher-metric-desc">Across Sabaq, Sabqi, &amp; Manzil reviews</p>
          <div className="teacher-metric-bar-bg">
            <div className="teacher-metric-bar-fill" style={{ width: '96.4%' }} />
          </div>
        </div>

        {/* Metric 5: Pending Homework & Submissions */}
        <div className="teacher-metric-card">
          <div className="teacher-metric-header">
            <span className="teacher-metric-label">PENDING REVIEWS</span>
            <span className="teacher-metric-icon-wrap bg-amber-subtle text-amber">
              <Icon name="clock" size={18} />
            </span>
          </div>
          <div className="teacher-metric-val-row">
            <span className="teacher-metric-value">
              {pendingSubmissions.filter((s) => !s.reviewed).length}
            </span>
            <span className="teacher-metric-subtag text-amber-dark">Action Req.</span>
          </div>
          <p className="teacher-metric-desc">Audio recordings &amp; quiz verifications</p>
          <a href="#pending-queue" className="teacher-metric-link">
            Review Submissions ↓
          </a>
        </div>
      </section>

      {/* 3. Main Split Grid: Today's Schedule (Left) + Quick Faculty Shortcuts (Right) */}
      <div className="teacher-dash-split-grid">
        {/* Left Column: Today's Live Schedule */}
        <div className="teacher-dash-card teacher-dash-schedule-card">
          <div className="teacher-dash-card-header">
            <div>
              <div className="teacher-card-badge-row">
                <span className="teacher-card-badge">LIVE AGENDA</span>
                <span className="teacher-card-count">4 Sessions Today</span>
              </div>
              <h2 className="teacher-dash-card-title">Today’s Teaching Schedule</h2>
              <p className="teacher-dash-card-subtitle">
                Scheduled 1-on-1 virtual halaqat, progress milestones, and live classroom links.
              </p>
            </div>
            <button
              type="button"
              className="btn-card-header-action"
              onClick={() => onNavigateTab && onNavigateTab('actionboard')}
            >
              <Icon name="zap" size={14} style={{ marginRight: 5 }} />
              Open Action Board
            </button>
          </div>

          <div className="teacher-schedule-list">
            {scheduleItems.map((item) => {
              const isLive = item.statusType === 'live';
              const isCompleted = item.statusType === 'completed';
              return (
                <div
                  key={item.id}
                  className={`teacher-schedule-item ${isLive ? 'item-live-border' : ''}`}
                >
                  <div className="teacher-schedule-time-box">
                    <span className="teacher-time-text">{item.time}</span>
                    <span className={`teacher-time-pill pill-${item.statusType}`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="teacher-schedule-details">
                    <div className="teacher-schedule-stu-row">
                      <div className="teacher-stu-avatar">
                        <Icon name="student" size={16} />
                      </div>
                      <div>
                        <h3 className="teacher-stu-name">{item.studentName}</h3>
                        <span className="teacher-stu-course">{item.course}</span>
                      </div>
                    </div>

                    <div className="teacher-schedule-meta-box">
                      <div className="meta-item">
                        <Icon name="quran" size={14} color="#0D4A38" />
                        <span>
                          <strong>Focus:</strong> {item.focus}
                        </span>
                      </div>
                      <div className="meta-item">
                        <Icon name="map-pin" size={14} color="#9F7C35" />
                        <span>
                          <strong>Room:</strong> {item.room}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="teacher-schedule-actions">
                    {isLive && (
                      <button
                        type="button"
                        className="btn-live-session-launch"
                        onClick={() => {
                          if (onSelectStudent) onSelectStudent(item.studentId);
                          if (onNavigateTab) onNavigateTab('actionboard');
                        }}
                      >
                        <span className="pulse-dot" />
                        <span>Launch Live Halaqah</span>
                      </button>
                    )}

                    <button
                      type="button"
                      className="btn-schedule-action"
                      onClick={() => {
                        if (onSelectStudent) onSelectStudent(item.studentId);
                        if (onOpenQuranForStudent) {
                          onOpenQuranForStudent(item.studentId);
                        } else if (onNavigateTab) {
                          onNavigateTab('quran');
                        }
                      }}
                      title="Open Interactive Mistake Annotator for this student"
                    >
                      <Icon name="flag" size={14} style={{ marginRight: 4 }} />
                      Annotator
                    </button>

                    <button
                      type="button"
                      className="btn-schedule-action"
                      onClick={() => {
                        if (onSelectStudent) onSelectStudent(item.studentId);
                        if (onNavigateTab) onNavigateTab('actionboard');
                      }}
                      title="Open Sabaq & Attendance Entry"
                    >
                      <Icon name="check-circle" size={14} style={{ marginRight: 4 }} />
                      {isCompleted ? 'View Log' : 'Take Attendance'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Faculty Quick Navigation & Shortcuts */}
        <div className="teacher-dash-sidebar-col">
          {/* Quick Tools Box */}
          <div className="teacher-dash-card teacher-quick-tools-box">
            <h2 className="teacher-dash-card-title">
              <Icon name="sparkles" size={18} color="#D4AF37" style={{ marginRight: 6 }} />
              Faculty Command Shortcuts
            </h2>
            <p className="teacher-dash-card-subtitle">
              Instant access to core teaching tools, logs, and curriculum resources.
            </p>

            <div className="teacher-tools-vertical-list">
              <button
                type="button"
                className="teacher-tool-nav-btn"
                onClick={() => onNavigateTab && onNavigateTab('actionboard')}
              >
                <div className="tool-icon-circle bg-emerald-subtle">
                  <Icon name="zap" size={18} color="#0D4A38" />
                </div>
                <div className="tool-content">
                  <span className="tool-title">Daily Attendance &amp; Action Board</span>
                  <span className="tool-desc">
                    Log Sabaq, Sabqi, Manzil, Salat, &amp; Adab
                  </span>
                </div>
                <Icon name="arrow-right" size={14} color="#9F7C35" />
              </button>

              <button
                type="button"
                className="teacher-tool-nav-btn"
                onClick={() => onNavigateTab && onNavigateTab('quran')}
              >
                <div className="tool-icon-circle bg-gold-subtle">
                  <Icon name="flag" size={18} color="#9F7C35" />
                </div>
                <div className="tool-content">
                  <span className="tool-title">Interactive Mistake Annotator</span>
                  <span className="tool-desc">
                    Pin color-coded Makharij &amp; Tajweed corrections
                  </span>
                </div>
                <Icon name="arrow-right" size={14} color="#9F7C35" />
              </button>

              <button
                type="button"
                className="teacher-tool-nav-btn"
                onClick={() => onNavigateTab && onNavigateTab('overview')}
              >
                <div className="tool-icon-circle bg-green-subtle">
                  <Icon name="users" size={18} color="#15664F" />
                </div>
                <div className="tool-content">
                  <span className="tool-title">Student Dossiers &amp; Roster</span>
                  <span className="tool-desc">
                    Inspect individual student progress &amp; historical curves
                  </span>
                </div>
                <Icon name="arrow-right" size={14} color="#9F7C35" />
              </button>

              <button
                type="button"
                className="teacher-tool-nav-btn"
                onClick={() => onNavigateTab && onNavigateTab('salary')}
              >
                <div className="tool-icon-circle bg-emerald-subtle">
                  <Icon name="wallet" size={18} color="#0D4A38" />
                </div>
                <div className="tool-content">
                  <span className="tool-title">Salary &amp; Teaching Ledger</span>
                  <span className="tool-desc">
                    $1,240.00 earned • 34 classes verified
                  </span>
                </div>
                <Icon name="arrow-right" size={14} color="#9F7C35" />
              </button>

              <button
                type="button"
                className="teacher-tool-nav-btn"
                onClick={() => onNavigateTab && onNavigateTab('curriculum')}
              >
                <div className="tool-icon-circle bg-blue-subtle">
                  <Icon name="edit" size={18} color="#1D4ED8" />
                </div>
                <div className="tool-content">
                  <span className="tool-title">Curriculum Modules &amp; Quizzes</span>
                  <span className="tool-desc">
                    Syllabi, milestone gates, and recitation rubrics
                  </span>
                </div>
                <Icon name="arrow-right" size={14} color="#9F7C35" />
              </button>

              <button
                type="button"
                className="teacher-tool-nav-btn"
                onClick={() => onNavigateTab && onNavigateTab('dictionary')}
              >
                <div className="tool-icon-circle bg-amber-subtle">
                  <Icon name="book-marked" size={18} color="#B45309" />
                </div>
                <div className="tool-content">
                  <span className="tool-title">Tajweed Glossary &amp; Tool Dictionary</span>
                  <span className="tool-desc">
                    Lookup Makharij, Sifat, Qalqalah, &amp; Madd rules
                  </span>
                </div>
                <Icon name="arrow-right" size={14} color="#9F7C35" />
              </button>
            </div>
          </div>

          {/* Academic Council Notice Box */}
          <div className="teacher-dash-card teacher-notice-box">
            <div className="notice-box-header">
              <span className="notice-badge">INSTITUTE BULLETIN</span>
              <span className="notice-date">October 2026</span>
            </div>
            <h3 className="notice-title">
              Mid-Term Hifz Evaluations &amp; Sanad Workshop
            </h3>
            <p className="notice-content">
              All faculty members instructing students in Juz 10 through 30 are requested to
              ensure that all weekly Sabaq &amp; Sabqi logs are current ahead of Thursday’s
              academic review council.
            </p>
            <div className="notice-footer">
              <span className="notice-author">
                Academic Director: Sheikh Dr. Ibrahim Al-Mansoor
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Assigned Students Recitation & Progress Health Table */}
      <section className="teacher-dash-card teacher-students-section">
        <div className="teacher-dash-card-header">
          <div>
            <div className="teacher-card-badge-row">
              <span className="teacher-card-badge">ASSIGNED LEARNERS</span>
              <span className="teacher-card-count">
                {displayStudents.length} Students Active
              </span>
            </div>
            <h2 className="teacher-dash-card-title">Student Recitation &amp; Hifz Progress</h2>
            <p className="teacher-dash-card-subtitle">
              Current memorization milestones, last evaluated lesson, and direct 1-click actions.
            </p>
          </div>
          <button
            type="button"
            className="btn-card-header-action"
            onClick={() => onNavigateTab && onNavigateTab('overview')}
          >
            <Icon name="users" size={14} style={{ marginRight: 5 }} />
            Open Full Student Dossier
          </button>
        </div>

        <div className="teacher-students-table-wrap">
          <table className="teacher-students-table">
            <thead>
              <tr>
                <th>Student &amp; ID</th>
                <th>Course Track</th>
                <th>Memorized Juz</th>
                <th>Last Sabaq</th>
                <th>Latest Grade</th>
                <th>Mistake Flags</th>
                <th>Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayStudents.map((stu) => {
                const stuId = stu.studentId || stu.id;
                const name = stu.studentName || stu.name;
                const courseName =
                  stu.courseTitle || 'Quran Reading Foundation & Tajweed Mastery';
                const juz = stu.memorizedJuz || 12;
                const totalJuz = stu.totalJuz || 30;
                const pct = Math.round((juz / totalJuz) * 100);
                const sabaq = stu.lastSabaq || 'Surah Yusuf (Ayahs 1–22)';
                const grade = stu.lastGrade || 'Mumtaz (98%)';
                const mistakes = stu.activeMistakesCount ?? 2;

                return (
                  <tr key={stuId} className="teacher-student-row">
                    <td>
                      <div className="stu-table-cell-name">
                        <div className="stu-avatar-circle">
                          <Icon name="student" size={15} />
                        </div>
                        <div>
                          <strong className="stu-name-link">{name}</strong>
                          <span className="stu-id-sub">#{stuId}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="stu-course-chip">{courseName}</span>
                    </td>

                    <td>
                      <div className="juz-progress-cell">
                        <div className="juz-numbers">
                          <span>
                            <strong>{juz}</strong> / {totalJuz} Juz
                          </span>
                          <span className="juz-pct">{pct}%</span>
                        </div>
                        <div className="juz-mini-bar-bg">
                          <div
                            className="juz-mini-bar-fill"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="stu-sabaq-text">{sabaq}</span>
                    </td>

                    <td>
                      <span
                        className={`stu-grade-badge ${
                          grade.includes('Mumtaz') ? 'grade-mumtaz' : 'grade-jayyid'
                        }`}
                      >
                        {grade}
                      </span>
                    </td>

                    <td>
                      {mistakes > 0 ? (
                        <span className="stu-mistake-pill">
                          <Icon name="flag" size={11} style={{ marginRight: 3 }} />
                          {mistakes} Pending
                        </span>
                      ) : (
                        <span className="stu-mistake-pill-clean">
                          <Icon name="check" size={11} style={{ marginRight: 3 }} />
                          Clean
                        </span>
                      )}
                    </td>

                    <td>
                      <div className="stu-actions-cell">
                        <button
                          type="button"
                          className="btn-stu-quick-action"
                          onClick={() => {
                            if (onSelectStudent) onSelectStudent(stuId);
                            if (onNavigateTab) onNavigateTab('actionboard');
                          }}
                          title="Record today's Sabaq, Sabqi, and Salat marks"
                        >
                          <Icon name="zap" size={13} style={{ marginRight: 3 }} />
                          Log Sabaq
                        </button>

                        <button
                          type="button"
                          className="btn-stu-quick-action"
                          onClick={() => {
                            if (onSelectStudent) onSelectStudent(stuId);
                            if (onOpenQuranForStudent) {
                              onOpenQuranForStudent(stuId);
                            } else if (onNavigateTab) {
                              onNavigateTab('quran');
                            }
                          }}
                          title="Open Interactive Mistake Annotator"
                        >
                          <Icon name="flag" size={13} style={{ marginRight: 3 }} />
                          Annotate
                        </button>

                        <button
                          type="button"
                          className="btn-stu-quick-action"
                          onClick={() => {
                            if (onSelectStudent) onSelectStudent(stuId);
                            if (onNavigateTab) onNavigateTab('overview');
                          }}
                          title="View Student Learning Behavior & Analytics"
                          style={{ color: '#047857', borderColor: '#A7F3D0', background: '#ECFDF5' }}
                        >
                          <Icon name="analytics" size={13} style={{ marginRight: 3 }} />
                          Behavior
                        </button>

                        <button
                          type="button"
                          className="btn-stu-quick-action btn-stu-dossier"
                          onClick={() => {
                            if (onSelectStudent) onSelectStudent(stuId);
                            if (onNavigateTab) onNavigateTab('overview');
                          }}
                          title="Open Full Student Dossier"
                        >
                          <Icon name="user" size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Pending Homework & Audio Recitation Submissions Queue */}
      <section id="pending-queue" className="teacher-dash-card teacher-submissions-section">
        <div className="teacher-dash-card-header">
          <div>
            <div className="teacher-card-badge-row">
              <span className="teacher-card-badge" style={{ background: '#FEF3C7', color: '#92400E' }}>
                FACULTY REVIEW QUEUE
              </span>
              <span className="teacher-card-count">
                {pendingSubmissions.filter((s) => !s.reviewed).length} Awaiting Verification
              </span>
            </div>
            <h2 className="teacher-dash-card-title">Homework Audio &amp; Exam Submissions</h2>
            <p className="teacher-dash-card-subtitle">
              Listen to student voice recordings, review automated quiz results, and provide official scholar feedback.
            </p>
          </div>
        </div>

        <div className="teacher-submissions-grid">
          {pendingSubmissions.map((sub) => (
            <div
              key={sub.id}
              className={`submission-card ${sub.reviewed ? 'sub-card-reviewed' : ''}`}
            >
              <div className="sub-card-top">
                <span className="sub-type-badge">
                  <Icon
                    name={sub.type === 'Audio Recording' ? 'volume-2' : 'check-circle-2'}
                    size={12}
                    style={{ marginRight: 4 }}
                  />
                  {sub.type}
                </span>
                <span className="sub-date">{sub.submittedAt}</span>
              </div>

              <h3 className="sub-title">{sub.title}</h3>
              <p className="sub-student-name">
                <strong>Student:</strong> {sub.studentName} ({sub.studentId})
              </p>

              <div className="sub-meta-box">
                <div className="sub-meta-row">
                  <span>
                    <strong>Duration / Score:</strong> {sub.duration}
                  </span>
                </div>
                <p className="sub-notes-text">
                  <em>&ldquo;{sub.notes}&rdquo;</em>
                </p>
              </div>

              <div className="sub-card-footer">
                {sub.reviewed ? (
                  <span className="sub-verified-tag">
                    <Icon name="check-circle" size={14} style={{ marginRight: 5 }} />
                    Verified &amp; Feedback Sent
                  </span>
                ) : (
                  <div className="sub-actions-row">
                    <button
                      type="button"
                      className="btn-sub-listen"
                      onClick={() => {
                        setActiveAudioPlaying(
                          activeAudioPlaying === sub.id ? null : sub.id
                        );
                        showToast(
                          activeAudioPlaying === sub.id
                            ? 'Paused audio playback'
                            : `Playing ${sub.studentName}’s recitation audio (${sub.duration})`
                        );
                      }}
                    >
                      <Icon
                        name={activeAudioPlaying === sub.id ? 'pause' : 'play'}
                        size={14}
                        style={{ marginRight: 4 }}
                      />
                      {activeAudioPlaying === sub.id ? 'Pause Audio' : 'Listen Recording'}
                    </button>

                    <button
                      type="button"
                      className="btn-sub-approve"
                      onClick={() => setSubmissionFeedbackModal(sub)}
                    >
                      <Icon name="check" size={14} style={{ marginRight: 4 }} />
                      Grade &amp; Feedback
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Recent Parent & Student Reviews Received */}
      <section className="teacher-dash-card teacher-reviews-section">
        <div className="teacher-dash-card-header">
          <div>
            <div className="teacher-card-badge-row">
              <span className="teacher-card-badge">TESTIMONIALS &amp; REVIEWS</span>
              <span className="teacher-card-count">5.0 Star Faculty Rating</span>
            </div>
            <h2 className="teacher-dash-card-title">Recent Parent &amp; Student Feedback</h2>
            <p className="teacher-dash-card-subtitle">
              Commendations and reviews submitted through the Parent Review Portal.
            </p>
          </div>
        </div>

        <div className="teacher-reviews-grid">
          <div className="teacher-review-card">
            <div className="review-card-stars">
              <span className="star-filled">★</span>
              <span className="star-filled">★</span>
              <span className="star-filled">★</span>
              <span className="star-filled">★</span>
              <span className="star-filled">★</span>
              <span className="rating-num">5.0</span>
            </div>
            <p className="review-text">
              &ldquo;Dr. Sheikh Ahmad has been an exceptional mentor for Tariq. His pronunciation
              of the throat letters (ح and ع) and overall love for the Quran have improved
              dramatically in just three months.&rdquo;
            </p>
            <div className="review-author-row">
              <div className="review-author-avatar">
                <Icon name="parent" size={16} />
              </div>
              <div>
                <strong className="review-author-name">Hajji Mansoor Rahman</strong>
                <span className="review-author-sub">
                  Parent of Tariq Al-Mansoor • Verified Review
                </span>
              </div>
            </div>
          </div>

          <div className="teacher-review-card">
            <div className="review-card-stars">
              <span className="star-filled">★</span>
              <span className="star-filled">★</span>
              <span className="star-filled">★</span>
              <span className="star-filled">★</span>
              <span className="star-filled">★</span>
              <span className="rating-num">5.0</span>
            </div>
            <p className="review-text">
              &ldquo;The systematic Sabaq and Sabqi revision method has given Maryam tremendous
              confidence in her Hifz. May Allah reward the Sheikh for his patience and high
              standards.&rdquo;
            </p>
            <div className="review-author-row">
              <div className="review-author-avatar">
                <Icon name="parent" size={16} />
              </div>
              <div>
                <strong className="review-author-name">Umm Maryam Al-Qasim</strong>
                <span className="review-author-sub">
                  Parent of Maryam Al-Qasim • Verified Review
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Submission Feedback Modal */}
      {submissionFeedbackModal && (
        <div className="portal-modal-backdrop">
          <div className="portal-modal-card" style={{ maxWidth: 540 }}>
            <div className="portal-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: 'var(--color-green-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-green-primary)',
                  }}
                >
                  <Icon name="check-circle-2" size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, color: 'var(--color-green-deep)' }}>
                    Verify &amp; Grade Submission
                  </h3>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>
                    {submissionFeedbackModal.title} • {submissionFeedbackModal.studentName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="portal-modal-close"
                onClick={() => setSubmissionFeedbackModal(null)}
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="portal-modal-body" style={{ padding: '20px 24px' }}>
              <div
                style={{
                  background: 'var(--bg-canvas)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 10,
                  padding: '12px 16px',
                  marginBottom: 16,
                  fontSize: 13,
                }}
              >
                <p style={{ margin: '0 0 6px 0' }}>
                  <strong>Student Note:</strong> &ldquo;{submissionFeedbackModal.notes}&rdquo;
                </p>
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                  Duration: {submissionFeedbackModal.duration} • Submitted:{' '}
                  {submissionFeedbackModal.submittedAt}
                </p>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    marginBottom: 6,
                  }}
                >
                  AWARD GRADE / RATING
                </label>
                <select
                  defaultValue="Mumtaz (98%)"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--border-light)',
                    fontSize: 14,
                    background: '#FFFFFF',
                  }}
                >
                  <option value="Mumtaz (98%)">Mumtaz (ممتاز - 98%) • Excellent</option>
                  <option value="Jayyid Jiddan (92%)">Jayyid Jiddan (جيد جداً - 92%) • Very Good</option>
                  <option value="Jayyid (85%)">Jayyid (جيد - 85%) • Good</option>
                  <option value="Needs Revision (75%)">Needs Revision (يحتاج إعادة - 75%)</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    marginBottom: 6,
                  }}
                >
                  SCHOLAR FEEDBACK &amp; ADVICE
                </label>
                <textarea
                  rows={4}
                  value={feedbackNotes}
                  onChange={(e) => setFeedbackNotes(e.target.value)}
                  placeholder="MashaAllah, excellent cadence. Remember to prolong Madd Lazim full 6 harakat..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--border-light)',
                    fontSize: 13,
                    fontFamily: 'inherit',
                  }}
                />
              </div>
            </div>

            <div
              className="portal-modal-footer"
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 12,
                padding: '16px 24px',
                borderTop: '1px solid var(--border-light)',
              }}
            >
              <button
                type="button"
                className="btn-dash-outline-emerald"
                style={{ padding: '8px 16px', fontSize: 13 }}
                onClick={() => setSubmissionFeedbackModal(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-dash-primary-gold"
                style={{ padding: '8px 18px', fontSize: 13 }}
                onClick={() => handleApproveSubmission(submissionFeedbackModal.id)}
              >
                <Icon name="check-circle" size={15} style={{ marginRight: 6 }} />
                Approve &amp; Send Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
