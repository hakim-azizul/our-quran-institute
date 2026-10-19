'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from './Icons';
import DigitalToolsDictionary from './DigitalToolsDictionary';
import { ALL_114_SURAH_METADATA } from '../lib/quranData';

export default function TeacherActionBoard({
  teacherUser,
  studentsList = [],
  course,
  selectedStudentId,
  onSelectStudent,
  onOpenQuranForStudent,
}) {
  const [activeStudentId, setActiveStudentId] = useState(
    selectedStudentId || studentsList[0]?.studentId || studentsList[0]?.id || 'QI-STU-8842'
  );

  // Sync external selectedStudentId
  useEffect(() => {
    if (selectedStudentId && selectedStudentId !== activeStudentId) {
      setActiveStudentId(selectedStudentId);
    }
  }, [selectedStudentId]);

  const activeStudent =
    studentsList.find(
      (s) => s.studentId === activeStudentId || s.id === activeStudentId
    ) || studentsList[0] || {
      id: 'QI-STU-8842',
      name: 'Tariq Al-Mansoor',
      memorizedJuz: 12,
      totalJuz: 30,
      avatar: 'student',
    };

  // 1-Click Attendance State
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [isSubmittingAttendance, setIsSubmittingAttendance] = useState(false);
  const [attendanceFeedback, setAttendanceFeedback] = useState('');

  // Daily Progress Form State
  const [sabaqPara, setSabaqPara] = useState(activeStudent.memorizedJuz || 12);
  const [sabaqSurah, setSabaqSurah] = useState('Yusuf (يُوسُف)');
  const [sabaqStartAyah, setSabaqStartAyah] = useState('1');
  const [sabaqEndAyah, setSabaqEndAyah] = useState('22');
  const [sabaqGrade, setSabaqGrade] = useState('Mumtaz (ممتاز - 98%)');
  const [sabaqPages, setSabaqPages] = useState('1.5');
  const [sabaqNotes, setSabaqNotes] = useState('Madd Lazim and throat letters recited with great precision.');

  const [sabqiPara, setSabqiPara] = useState(11);
  const [sabqiSurahs, setSabqiSurahs] = useState('Hud 50 - 123');
  const [sabqiAccuracy, setSabqiAccuracy] = useState('96%');
  const [sabqiGrade, setSabqiGrade] = useState('Jayyid Jiddan (جيد جداً)');

  const [salatAttendance, setSalatAttendance] = useState('5/5 In Congregation');
  const [adabScore, setAdabScore] = useState('Outstanding (10/10)');
  const [sunnahHabit, setSunnahHabit] = useState('Morning and Evening Adhkar recited with mindfulness');
  const [teacherGuidance, setTeacherGuidance] = useState('Advised slow Tartil cadence and listening to Sheikh Al-Husary.');

  const [teacherFeedbackText, setTeacherFeedbackText] = useState(
    'MashaAllah, Tariq was thoroughly prepared today. Keep up this consistent revision rhythm!'
  );

  const [isSubmittingProgress, setIsSubmittingProgress] = useState(false);
  const [progressToast, setProgressToast] = useState('');

  // History logs
  const [progressHistory, setProgressHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Dictionary modal state
  const [isDictOpen, setIsDictOpen] = useState(false);

  // Fetch student progress history & today's attendance on student change
  useEffect(() => {
    fetchStudentHistory(activeStudent.studentId || activeStudent.id);
    fetchTodayAttendance(activeStudent.studentId || activeStudent.id);
  }, [activeStudent?.studentId, activeStudent?.id]);

  const fetchStudentHistory = async (stuId) => {
    if (!stuId) return;
    try {
      setLoadingHistory(true);
      const res = await fetch(`/api/progress?studentId=${encodeURIComponent(stuId)}`);
      const data = await res.json();
      if (data.success && data.progressLogs) {
        setProgressHistory(data.progressLogs);
      }
    } catch (err) {
      console.error('Failed to load student progress history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchTodayAttendance = async (stuId) => {
    if (!stuId) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await fetch(`/api/attendance?studentId=${encodeURIComponent(stuId)}&date=${today}`);
      const data = await res.json();
      if (data.success && data.attendance?.length > 0) {
        setTodayAttendance(data.attendance[0]);
      } else {
        setTodayAttendance(null);
      }
    } catch (err) {
      console.error('Failed to load today attendance:', err);
    }
  };

  // 1-Click Attendance Handler
  const handleMarkAttendance = async (status) => {
    try {
      setIsSubmittingAttendance(true);
      setAttendanceFeedback('');
      const stuId = activeStudent.studentId || activeStudent.id;
      const tId = teacherUser?.id || 'QI-FAC-014';
      const today = new Date().toISOString().split('T')[0];

      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: stuId,
          teacherId: tId,
          status,
          date: today,
          note: `Live class attendance logged by ${teacherUser?.name || 'Faculty Scholar'}.`,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setTodayAttendance(data.record);
        setAttendanceFeedback(data.message);
        setTimeout(() => setAttendanceFeedback(''), 4000);
      } else {
        alert(data.error || 'Failed to submit attendance.');
      }
    } catch (err) {
      console.error(err);
      alert('Error recording attendance.');
    } finally {
      setIsSubmittingAttendance(false);
    }
  };

  // Submit Daily Sabaq, Sabqi & Tarbiyah Log
  const handleSubmitDailyProgress = async (e) => {
    e.preventDefault();
    try {
      setIsSubmittingProgress(true);
      setProgressToast('');
      const stuId = activeStudent.studentId || activeStudent.id;
      const tId = teacherUser?.id || 'QI-FAC-014';
      const today = new Date().toISOString().split('T')[0];

      const payload = {
        studentId: stuId,
        teacherId: tId,
        date: today,
        sabaq: {
          para: Number(sabaqPara),
          surah: sabaqSurah,
          startAyah: Number(sabaqStartAyah),
          endAyah: Number(sabaqEndAyah),
          grade: sabaqGrade,
          pages: Number(sabaqPages),
          notes: sabaqNotes,
        },
        sabqi: {
          para: Number(sabqiPara),
          surahs: sabqiSurahs,
          accuracy: sabqiAccuracy,
          grade: sabqiGrade,
        },
        manzil: `Para ${Math.max(1, sabaqPara - 2)} - ${Math.max(1, sabaqPara - 1)} Revision`,
        tarbiyah: {
          salatAttendance,
          adabScore,
          sunnahHabit,
          teacherGuidance,
        },
        teacherFeedback: teacherFeedbackText,
      };

      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setProgressToast(data.message);
        fetchStudentHistory(stuId);
        setTimeout(() => setProgressToast(''), 4000);
      } else {
        alert(data.error || 'Failed to record daily progress.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while saving progress.');
    } finally {
      setIsSubmittingProgress(false);
    }
  };

  const handleInsertTerm = (termText) => {
    setTeacherFeedbackText((prev) => `${prev ? prev + '\n\n' : ''}• Tajweed Rule: ${termText}`);
  };

  return (
    <div className="action-board-wrapper">
      {/* Top Banner & Student Switcher */}
      <div className="action-board-top-card">
        <div className="action-board-header">
          <div>
            <h2 className="action-board-title">
              Dynamic Faculty Action Board
            </h2>
            <p className="action-board-subtitle">
              Manage 1-click live attendance, new Sabaq, revision (Sabqi), and Tarbiyah logs with ease.
            </p>
          </div>

          <div className="action-board-tools">
            <button
              type="button"
              className="btn-open-dictionary"
              onClick={() => setIsDictOpen(true)}
            >
              <Icon name="book-marked" size={15} style={{ marginRight: 6 }} />
              Digital Tajweed Dictionary
            </button>
            {onOpenQuranForStudent && (
              <button
                type="button"
                className="btn-open-quran-live"
                onClick={() => onOpenQuranForStudent(activeStudent.studentId || activeStudent.id)}
                title={`Launch interactive Quran mistake annotator for ${activeStudent.studentName || activeStudent.name}`}
              >
                <Icon name="search" size={15} style={{ marginRight: 6 }} />
                <span>Annotate {activeStudent.studentName ? activeStudent.studentName.split(' ')[0] : (activeStudent.name ? activeStudent.name.split(' ')[0] : 'Student')}&apos;s Quran</span>
              </button>
            )}
          </div>
        </div>

        {/* Assigned Student Roster Selector */}
        <div className="action-board-students-bar">
          <span className="students-bar-label">Assigned Scholar Students:</span>
          <div className="students-pill-row">
            {studentsList.map((stu) => {
              const stuId = stu.studentId || stu.id;
              const isSelected = stuId === (activeStudent.studentId || activeStudent.id);
              return (
                <button
                  key={stuId}
                  type="button"
                  className={`student-pill-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => {
                    setActiveStudentId(stuId);
                    if (onSelectStudent) onSelectStudent(stuId);
                  }}
                >
                  <span className="student-pill-avatar">
                    <Icon name="student" size={16} />
                  </span>
                  <div className="student-pill-info">
                    <span className="student-pill-name">{stu.name || stu.studentName}</span>
                    <span className="student-pill-meta">
                      Para {stu.memorizedJuz || 12} • {stu.progressPercent || 65}%
                    </span>
                  </div>
                  {isSelected && (
                    <span className="pill-check" style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <Icon name="check-circle" size={13} color="#0D4A38" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid: Left Column (Action Board) + Right Column (History & Feedback) */}
      <div className="action-board-grid">
        {/* Left Column: 1-Click Attendance & Daily Entry */}
        <div className="action-board-main-col">
          {/* SECTION 1: 1-CLICK CLASS ATTENDANCE */}
          <div className="action-card attendance-card">
            <div className="action-card-header">
              <div className="header-icon-title">
                <span className="card-badge-icon">
                  <Icon name="zap" size={16} />
                </span>
                <div>
                  <h3 className="card-title">1-Click Live Attendance</h3>
                  <p className="card-subtitle">
                    Mark instant session attendance for <strong>{activeStudent.name || activeStudent.studentName}</strong> today.
                  </p>
                </div>
              </div>

              {todayAttendance && (
                <div className={`attendance-status-pill status-${todayAttendance.status}`}>
                  <span>Status: <strong>{todayAttendance.status.toUpperCase()}</strong></span>
                  <span className="status-time">
                    {new Date(todayAttendance.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
            </div>

            <div className="attendance-buttons-row">
              <button
                type="button"
                disabled={isSubmittingAttendance}
                className={`btn-attendance-action btn-present ${todayAttendance?.status === 'present' ? 'current' : ''}`}
                onClick={() => handleMarkAttendance('present')}
              >
                <span className="btn-att-icon">
                  <Icon name="check-circle" size={18} />
                </span>
                <div className="btn-att-text">
                  <span className="btn-att-label">Present</span>
                  <span className="btn-att-desc">Joined session on time</span>
                </div>
              </button>

              <button
                type="button"
                disabled={isSubmittingAttendance}
                className={`btn-attendance-action btn-late ${todayAttendance?.status === 'late' ? 'current' : ''}`}
                onClick={() => handleMarkAttendance('late')}
              >
                <span className="btn-att-icon">
                  <Icon name="clock" size={18} />
                </span>
                <div className="btn-att-text">
                  <span className="btn-att-label">Late</span>
                  <span className="btn-att-desc">Arrived past start time</span>
                </div>
              </button>

              <button
                type="button"
                disabled={isSubmittingAttendance}
                className={`btn-attendance-action btn-absent ${todayAttendance?.status === 'absent' ? 'current' : ''}`}
                onClick={() => handleMarkAttendance('absent')}
              >
                <span className="btn-att-icon">
                  <Icon name="x-circle" size={18} />
                </span>
                <div className="btn-att-text">
                  <span className="btn-att-label">Absent</span>
                  <span className="btn-att-desc">Did not attend session</span>
                </div>
              </button>

              <button
                type="button"
                disabled={isSubmittingAttendance}
                className={`btn-attendance-action btn-excused ${todayAttendance?.status === 'excused' ? 'current' : ''}`}
                onClick={() => handleMarkAttendance('excused')}
              >
                <span className="btn-att-icon">
                  <Icon name="shield-check" size={18} />
                </span>
                <div className="btn-att-text">
                  <span className="btn-att-label">Excused</span>
                  <span className="btn-att-desc">Prior guardian notice</span>
                </div>
              </button>
            </div>

            {attendanceFeedback && (
              <div className="action-feedback-toast success">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="check-circle" size={14} color="#166534" />
                  <span>{attendanceFeedback}</span>
                </span>
              </div>
            )}
          </div>

          {/* SECTION 2: DAILY SABAQ, SABQI & TARBIYAH ENTRY */}
          <form onSubmit={handleSubmitDailyProgress} className="action-card daily-entry-card">
            <div className="action-card-header">
              <div className="header-icon-title">
                <span className="card-badge-icon">
                  <Icon name="edit" size={16} />
                </span>
                <div>
                  <h3 className="card-title">Daily Sabaq, Sabqi &amp; Tarbiyah Entry Form</h3>
                  <p className="card-subtitle">
                    Record daily new lesson (Sabaq), revision (Sabqi), and character development.
                  </p>
                </div>
              </div>
              <span className="form-date-badge">
                <Icon name="calendar" size={13} style={{ marginRight: 5 }} />
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            {/* Sub-section: 1. NEW SABAQ */}
            <div className="entry-subsection">
              <div className="subsection-header">
                <span className="subsection-number">1</span>
                <h4 className="subsection-title">New Sabaq (Daily Lesson)</h4>
              </div>

              <div className="entry-fields-grid">
                <div className="form-group-item">
                  <label>Para / Juz</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={sabaqPara}
                    onChange={(e) => setSabaqPara(e.target.value)}
                    className="entry-input"
                    required
                  />
                </div>

                <div className="form-group-item">
                  <label>Surah Name</label>
                  <input
                    type="text"
                    list="all-114-surahs-list"
                    value={sabaqSurah}
                    onChange={(e) => setSabaqSurah(e.target.value)}
                    className="entry-input"
                    placeholder="Search 114 Surahs (e.g. Al-Baqarah, Yusuf...)"
                    required
                  />
                  <datalist id="all-114-surahs-list">
                    {ALL_114_SURAH_METADATA.map((s) => (
                      <option key={s.number} value={`${s.number}. ${s.name} (${s.arabicName})`}>
                        {s.englishName} • {s.ayahCount} Ayahs • Juz {s.juz}
                      </option>
                    ))}
                  </datalist>
                </div>

                <div className="form-group-item">
                  <label>Ayah Range</label>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <input
                      type="number"
                      value={sabaqStartAyah}
                      onChange={(e) => setSabaqStartAyah(e.target.value)}
                      className="entry-input"
                      placeholder="From"
                      required
                    />
                    <span>—</span>
                    <input
                      type="number"
                      value={sabaqEndAyah}
                      onChange={(e) => setSabaqEndAyah(e.target.value)}
                      className="entry-input"
                      placeholder="To"
                      required
                    />
                  </div>
                </div>

                <div className="form-group-item">
                  <label>Performance Grade</label>
                  <select
                    value={sabaqGrade}
                    onChange={(e) => setSabaqGrade(e.target.value)}
                    className="entry-select"
                  >
                    <option value="Mumtaz (ممتاز - 98%)">Mumtaz (ممتاز - Excellent)</option>
                    <option value="Jayyid Jiddan (جيد جداً - 90%)">Jayyid Jiddan (جيد جداً - Very Good)</option>
                    <option value="Jayyid (جيد - 80%)">Jayyid (جيد - Good)</option>
                    <option value="Maqbul (مقبول - 70%)">Maqbul (مقبول - Acceptable)</option>
                    <option value="Repeat (إعادة - Needs Revision)">Repeat (إعادة - Needs Revision)</option>
                  </select>
                </div>
              </div>

              <div className="form-group-item" style={{ marginTop: '10px' }}>
                <label>Recitation Observations &amp; Tajweed Notes</label>
                <input
                  type="text"
                  value={sabaqNotes}
                  onChange={(e) => setSabaqNotes(e.target.value)}
                  className="entry-input"
                  placeholder="e.g., Throat letters clean, watch Madd duration..."
                />
              </div>
            </div>

            {/* Sub-section: 2. SABQI / MANZIL (Revision) */}
            <div className="entry-subsection">
              <div className="subsection-header">
                <span className="subsection-number">2</span>
                <h4 className="subsection-title">Revision (Sabqi &amp; Manzil)</h4>
              </div>

              <div className="entry-fields-grid">
                <div className="form-group-item">
                  <label>Revision Para</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={sabqiPara}
                    onChange={(e) => setSabqiPara(e.target.value)}
                    className="entry-input"
                    required
                  />
                </div>

                <div className="form-group-item">
                  <label>Revision Surahs Range</label>
                  <input
                    type="text"
                    value={sabqiSurahs}
                    onChange={(e) => setSabqiSurahs(e.target.value)}
                    className="entry-input"
                    placeholder="e.g. Hud 50-123 or Para 1-2"
                    required
                  />
                </div>

                <div className="form-group-item">
                  <label>Retention Accuracy (%)</label>
                  <input
                    type="text"
                    value={sabqiAccuracy}
                    onChange={(e) => setSabqiAccuracy(e.target.value)}
                    className="entry-input"
                    placeholder="e.g. 96%"
                    required
                  />
                </div>

                <div className="form-group-item">
                  <label>Revision Grade</label>
                  <select
                    value={sabqiGrade}
                    onChange={(e) => setSabqiGrade(e.target.value)}
                    className="entry-select"
                  >
                    <option value="Mumtaz (ممتاز)">Mumtaz (ممتاز - Excellent)</option>
                    <option value="Jayyid Jiddan (جيد جداً)">Jayyid Jiddan (جيد جداً - Very Good)</option>
                    <option value="Jayyid (جيد)">Jayyid (جيد - Good)</option>
                    <option value="Maqbul (مقبول)">Maqbul (مقبول - Pass)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sub-section: 3. TARBIYAH & DAWAH */}
            <div className="entry-subsection">
              <div className="subsection-header">
                <span className="subsection-number">3</span>
                <h4 className="subsection-title">Tarbiyah &amp; Character Development</h4>
              </div>

              <div className="entry-fields-grid">
                <div className="form-group-item">
                  <label>Salat Adherence (5 Daily Prayers)</label>
                  <select
                    value={salatAttendance}
                    onChange={(e) => setSalatAttendance(e.target.value)}
                    className="entry-select"
                  >
                    <option value="5/5 In Congregation">5/5 In Congregation (Jama'ah)</option>
                    <option value="5/5 On Time">5/5 On Time</option>
                    <option value="4/5 Prayed">4/5 Prayed</option>
                    <option value="3/5 Prayed">3/5 Prayed</option>
                  </select>
                </div>

                <div className="form-group-item">
                  <label>Islamic Adab &amp; Akhlaq Score</label>
                  <select
                    value={adabScore}
                    onChange={(e) => setAdabScore(e.target.value)}
                    className="entry-select"
                  >
                    <option value="Outstanding (10/10)">Outstanding (10/10)</option>
                    <option value="Very Good (9/10)">Very Good (9/10)</option>
                    <option value="Good (8/10)">Good (8/10)</option>
                    <option value="Needs Encouragement">Needs Encouragement</option>
                  </select>
                </div>

                <div className="form-group-item" style={{ gridColumn: 'span 2' }}>
                  <label>Daily Sunnah Habit Tracked</label>
                  <input
                    type="text"
                    value={sunnahHabit}
                    onChange={(e) => setSunnahHabit(e.target.value)}
                    className="entry-input"
                    placeholder="e.g., Morning Adhkar, Tahajjud, Smile Sunnah..."
                  />
                </div>
              </div>
            </div>

            {/* Sub-section: 4. DIRECT TEACHER FEEDBACK */}
            <div className="entry-subsection">
              <div className="subsection-header-row">
                <div className="subsection-header">
                  <span className="subsection-number">4</span>
                  <h4 className="subsection-title">Teacher Feedback to Student &amp; Parent</h4>
                </div>
                <button
                  type="button"
                  className="btn-helper-insert-term"
                  onClick={() => setIsDictOpen(true)}
                >
                  <Icon name="book-open" size={14} style={{ marginRight: 6 }} />
                  Insert Terminology from Dictionary
                </button>
              </div>

              <textarea
                rows={3}
                value={teacherFeedbackText}
                onChange={(e) => setTeacherFeedbackText(e.target.value)}
                className="entry-textarea"
                placeholder="Write actionable comments, encouraging advice, or specific homework..."
                required
              />
            </div>

            {/* Form Submit Footer */}
            <div className="entry-form-footer">
              <div className="footer-left">
                {progressToast && (
                  <span className="toast-success-text" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Icon name="check-circle" size={14} color="#166534" />
                    <span>{progressToast}</span>
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmittingProgress}
                className="btn-save-progress-record"
              >
                <Icon name="save" size={15} style={{ marginRight: 6 }} />
                {isSubmittingProgress ? 'Logging Record...' : 'Save & Broadcast to Student/Parent'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Student Profile Dossier & Chronological Progress History */}
        <div className="action-board-side-col">
          {/* Active Student Summary Dossier */}
          <div className="side-card student-summary-card">
            <div className="student-profile-header">
              <div className="student-avatar-wrap">
                <Icon name="student" size={24} />
              </div>
              <div>
                <h4 className="student-card-name">{activeStudent.name || activeStudent.studentName}</h4>
                <span className="student-id-tag">{activeStudent.studentId || activeStudent.id}</span>
              </div>
            </div>

            <div className="student-stats-list">
              <div className="student-stat-row">
                <span className="stat-label">Hifz Progress</span>
                <span className="stat-val highlight">{activeStudent.memorizedJuz || 12} of 30 Juz (40%)</span>
              </div>
              <div className="student-stat-row">
                <span className="stat-label">Next Live Session</span>
                <span className="stat-val">{activeStudent.nextSession || 'Today at 6:30 PM'}</span>
              </div>
              <div className="student-stat-row">
                <span className="stat-label">Guardian / Parent</span>
                <span className="stat-val">{activeStudent.parentName || 'Hajji Mansoor Rahman'}</span>
              </div>
              <div className="student-stat-row">
                <span className="stat-label">Attendance Rate</span>
                <span className="stat-val" style={{ color: '#0D4A38', fontWeight: 700 }}>96% (26 Sessions)</span>
              </div>
            </div>
          </div>

          {/* Chronological Progress History Feed */}
          <div className="side-card history-feed-card">
            <div className="history-header">
              <h4 className="history-title">Personal Progress History</h4>
              <span className="history-count-badge">{progressHistory.length} Recorded Logs</span>
            </div>

            {loadingHistory ? (
              <div className="history-loading">
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                  <Icon name="clock" size={16} /> Loading student progress logs...
                </span>
              </div>
            ) : progressHistory.length === 0 ? (
              <div className="history-empty">
                <span>No logged records for this student yet. Submit the form to add the first log!</span>
              </div>
            ) : (
              <div className="history-timeline">
                {progressHistory.map((item) => (
                  <div key={item.id} className="timeline-item">
                    <div className="timeline-dot" />
                    <div className="timeline-content">
                      <div className="timeline-date-row">
                        <span className="timeline-date">
                          <Icon name="calendar" size={13} style={{ marginRight: 4 }} />
                          {item.date}
                        </span>
                        <span className="timeline-grade-badge">{item.sabaq?.grade || 'Mumtaz'}</span>
                      </div>

                      <div className="timeline-sabaq-info">
                        <strong>Sabaq:</strong> Para {item.sabaq?.para}, {item.sabaq?.surah} (Ayahs {item.sabaq?.startAyah}-{item.sabaq?.endAyah})
                      </div>

                      <div className="timeline-sabqi-info">
                        <strong>Revision:</strong> Para {item.sabqi?.para} ({item.sabqi?.accuracy} accuracy)
                      </div>

                      <div className="timeline-tarbiyah-info">
                        <strong>Tarbiyah:</strong> {item.tarbiyah?.salatAttendance} • {item.tarbiyah?.sunnahHabit}
                      </div>

                      {item.teacherFeedback && (
                        <div className="timeline-feedback-quote">
                          “{item.teacherFeedback}”
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Embedded Dictionary Modal */}
      <DigitalToolsDictionary
        isOpen={isDictOpen}
        onClose={() => setIsDictOpen(false)}
        onInsertTerm={handleInsertTerm}
      />
    </div>
  );
}
