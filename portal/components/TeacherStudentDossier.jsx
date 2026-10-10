'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from './Icons';

export default function TeacherStudentDossier({
  currentUser,
  studentsList = [],
  course,
  selectedStudentId,
  onSelectStudent,
  onOpenQuranForStudent,
  onRefreshData,
}) {
  const [activeStudentId, setActiveStudentId] = useState(
    selectedStudentId || studentsList[0]?.studentId || studentsList[0]?.id || ''
  );
  const [innerTab, setInnerTab] = useState('materials'); // 'materials' | 'analytics' | 'quizzes' | 'mistakes' | 'notes'
  const [searchQuery, setSearchQuery] = useState('');
  const [studentMistakes, setStudentMistakes] = useState([]);
  const [loadingMistakes, setLoadingMistakes] = useState(false);
  const [teacherNotesText, setTeacherNotesText] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesFeedback, setNotesFeedback] = useState('');
  const [actionLessonId, setActionLessonId] = useState(null);

  // Sync external selectedStudentId
  useEffect(() => {
    if (selectedStudentId && selectedStudentId !== activeStudentId) {
      setActiveStudentId(selectedStudentId);
    }
  }, [selectedStudentId]);

  // Find the active student object
  const activeStudent =
    studentsList.find(
      (s) => s.studentId === activeStudentId || s.id === activeStudentId
    ) || studentsList[0] || null;

  // Initialize teacher notes when active student changes
  useEffect(() => {
    if (activeStudent) {
      setTeacherNotesText(activeStudent.teacherNotes || '');
      setNotesFeedback('');
    }
  }, [activeStudent?.studentId, activeStudent?.id]);

  // Fetch mistake records for active student
  const fetchStudentMistakes = async (stuId) => {
    if (!stuId) return;
    setLoadingMistakes(true);
    try {
      const res = await fetch(`/api/quran/mistakes?studentId=${encodeURIComponent(stuId)}`);
      const data = await res.json();
      if (data.success && data.mistakes) {
        setStudentMistakes(data.mistakes);
      }
    } catch (err) {
      console.error('Failed to fetch student mistakes:', err);
    } finally {
      setLoadingMistakes(false);
    }
  };

  useEffect(() => {
    if (activeStudent) {
      const stuId = activeStudent.studentId || activeStudent.id;
      fetchStudentMistakes(stuId);
    }
  }, [activeStudent?.studentId, activeStudent?.id]);

  const handleStudentClick = (stu) => {
    const stuId = stu.studentId || stu.id;
    setActiveStudentId(stuId);
    if (onSelectStudent) onSelectStudent(stuId);
  };

  // Toggle or mark lesson completion for active student
  const handleToggleLessonForStudent = async (lessonId) => {
    if (!activeStudent?.enrollmentId && !activeStudent?.id) return;
    const enrollId = activeStudent.enrollmentId || activeStudent.id;
    setActionLessonId(lessonId);
    try {
      const isAlreadyComplete = activeStudent.completedLessons?.includes(lessonId);
      const res = await fetch('/api/enrollments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollmentId: enrollId,
          lessonId,
          action: isAlreadyComplete ? 'uncomplete' : 'complete',
        }),
      });
      const data = await res.json();
      if (data.success && onRefreshData) {
        await onRefreshData();
      }
    } catch (err) {
      console.error('Failed to toggle lesson:', err);
    } finally {
      setActionLessonId(null);
    }
  };

  // Save scholar pedagogical notes for student
  const handleSaveNotes = async () => {
    if (!activeStudent?.enrollmentId && !activeStudent?.id) return;
    const enrollId = activeStudent.enrollmentId || activeStudent.id;
    setIsSavingNotes(true);
    try {
      const res = await fetch('/api/enrollments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollmentId: enrollId,
          notes: teacherNotesText,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNotesFeedback('Scholarly guidance notes saved successfully.');
        if (onRefreshData) onRefreshData();
      }
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Resolve a mistake directly from the dossier
  const handleResolveMistake = async (mistakeId) => {
    const resolutionNote = window.prompt(
      'Enter resolution note for this recitation slip (e.g. Corrected during live session):',
      'Recited with crisp pronunciation during 1-on-1 Sanctuary session. Mumtaz!'
    );
    if (!resolutionNote) return;

    try {
      const res = await fetch('/api/quran/mistakes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mistakeId,
          resolutionNote,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const stuId = activeStudent?.studentId || activeStudent?.id;
        fetchStudentMistakes(stuId);
        if (onRefreshData) onRefreshData();
      }
    } catch (err) {
      console.error('Failed to resolve mistake:', err);
    }
  };

  // Filter students based on search
  const filteredStudents = studentsList.filter((s) => {
    const q = searchQuery.toLowerCase();
    const name = (s.studentName || s.name || '').toLowerCase();
    const id = (s.studentId || s.id || '').toLowerCase();
    const email = (s.studentEmail || s.email || '').toLowerCase();
    return name.includes(q) || id.includes(q) || email.includes(q);
  });

  // Calculate cohort summary stats
  const totalStudents = studentsList.length;
  const avgProgress =
    totalStudents > 0
      ? Math.round(
          studentsList.reduce((acc, s) => acc + (s.progressPercent || 0), 0) / totalStudents
        )
      : 0;
  const totalActiveMistakes = studentsList.reduce(
    (acc, s) => acc + (s.activeMistakesCount || 0),
    0
  );
  const totalQuizzesPassed = studentsList.reduce(
    (acc, s) => acc + (s.completedQuizzes?.length || 0),
    0
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      {/* 1. TEACHER COHORT OVERVIEW STATS */}
      <div className="dash-stat-row" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="dash-stat-card">
          <div className="dash-stat-value" style={{ color: 'var(--color-green-primary)' }}>
            {totalStudents}
          </div>
          <div className="dash-stat-label">Assigned Students Roster</div>
        </div>

        <div className="dash-stat-card">
          <div className="dash-stat-value" style={{ color: 'var(--color-gold-deep)' }}>
            {avgProgress}%
          </div>
          <div className="dash-stat-label">Cohort Average Progress</div>
        </div>

        <div
          className="dash-stat-card"
          style={{
            background: totalActiveMistakes > 0 ? '#FEF2F2' : 'var(--bg-canvas-subtle)',
            borderColor: totalActiveMistakes > 0 ? '#F87171' : 'var(--border-light)',
          }}
        >
          <div
            className="dash-stat-value"
            style={{ color: totalActiveMistakes > 0 ? '#DC2626' : 'var(--text-main)' }}
          >
            {totalActiveMistakes}
          </div>
          <div className="dash-stat-label" style={{ color: totalActiveMistakes > 0 ? '#991B1B' : 'var(--text-muted)' }}>
            Active Recitation Slips
          </div>
        </div>

        <div className="dash-stat-card">
          <div className="dash-stat-value" style={{ color: '#166534' }}>
            {totalQuizzesPassed}
          </div>
          <div className="dash-stat-label">Distinction Quizzes Passed</div>
        </div>
      </div>

      {/* 2. STUDENT DIRECTORY & SELECTOR BAR */}
      <div
        className="dash-panel"
        style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h3 className="dash-panel-title" style={{ margin: 0 }}>
              <Icon name="users" size={20} color="#0D4A38" />
              <span>Assigned Student Cohort Directory</span>
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
              Select any student to inspect their individual course material mastery, lesson progress, quiz grades, and recitation mistake slips.
            </p>
          </div>

          <div style={{ position: 'relative', minWidth: '260px' }}>
            <input
              type="text"
              placeholder="Search student by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{
                padding: '9px 14px',
                fontSize: '13px',
                borderRadius: '10px',
                width: '100%',
              }}
            />
          </div>
        </div>

        {/* Student Pills / Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '12px',
            marginTop: '4px',
          }}
        >
          {filteredStudents.map((stu) => {
            const stuId = stu.studentId || stu.id;
            const isSelected = stuId === activeStudentId;
            const stuName = stu.studentName || stu.name || 'Student';
            const progress = stu.progressPercent || 0;
            const activeMistakes = stu.activeMistakesCount || 0;

            return (
              <button
                key={stuId}
                type="button"
                onClick={() => handleStudentClick(stu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(13, 74, 56, 0.08) 0%, rgba(197, 164, 90, 0.12) 100%)'
                    : '#FFFFFF',
                  border: isSelected
                    ? '2px solid var(--color-gold-primary)'
                    : '1.5px solid var(--border-light)',
                  boxShadow: isSelected
                    ? '0 4px 14px rgba(13, 74, 56, 0.1)'
                    : 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  width: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: isSelected ? 'var(--color-green-primary)' : 'var(--color-gold-light)',
                      color: isSelected ? '#FFFFFF' : 'var(--color-gold-deep)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: '700',
                    }}
                  >
                    {stu.studentAvatar || '🎓'}
                  </div>
                  <div>
                    <div style={{ fontSize: '14.5px', fontWeight: '700', color: isSelected ? 'var(--color-green-deep)' : 'var(--text-main)' }}>
                      {stuName}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      ID: {stuId}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '800',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: progress >= 80 ? '#DCFCE7' : 'var(--color-gold-light)',
                      color: progress >= 80 ? '#166534' : 'var(--color-gold-deep)',
                    }}
                  >
                    {progress}%
                  </span>
                  {activeMistakes > 0 && (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#DC2626',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                      title={`${activeMistakes} active recitation mistake flags`}
                    >
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#DC2626' }} />
                      {activeMistakes} slips
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SELECTED STUDENT INDIVIDUAL DOSSIER */}
      {activeStudent ? (
        <div className="dash-panel" style={{ padding: '28px 30px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Student Dossier Header Banner */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '1.5px solid var(--border-light)',
              paddingBottom: '22px',
              flexWrap: 'wrap',
              gap: '18px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-green-primary) 0%, var(--color-green-deep) 100%)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  boxShadow: '0 6px 18px rgba(13, 74, 56, 0.2)',
                  border: '2px solid var(--color-gold-primary)',
                }}
              >
                {activeStudent.studentAvatar || '🎓'}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '800',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      background: 'var(--color-gold-light)',
                      color: 'var(--color-gold-deep)',
                      padding: '2px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    INDIVIDUAL STUDENT DOSSIER
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    • Enrolled in {course?.title || 'Quran Reading Foundation'}
                  </span>
                </div>

                <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-green-deep)', margin: 0 }}>
                  {activeStudent.studentName || activeStudent.name}
                </h2>

                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                  Student ID: <strong style={{ color: 'var(--color-green-primary)' }}>{activeStudent.studentId || activeStudent.id}</strong> • Email: {activeStudent.studentEmail || activeStudent.email} • Level: <strong style={{ color: 'var(--color-gold-deep)' }}>{activeStudent.tajweedLevel || 'Intermediate'}</strong>
                </p>
              </div>
            </div>

            {/* Quick Actions for this Student */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  if (onOpenQuranForStudent) {
                    onOpenQuranForStudent(activeStudent.studentId || activeStudent.id);
                  }
                }}
                className="btn-auth-submit"
                style={{
                  margin: 0,
                  padding: '10px 18px',
                  fontSize: '13.5px',
                  width: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>📖</span>
                <span>Launch Quran Mistake Marker</span>
              </button>

              <button
                type="button"
                onClick={() => alert(`Launching 1-on-1 Sanctuary Classroom with ${activeStudent.studentName || activeStudent.name}...`)}
                className="btn-table-action"
                style={{
                  padding: '10px 18px',
                  fontSize: '13px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Icon name="video" size={15} color="#0D4A38" />
                <span>Private Class</span>
              </button>
            </div>
          </div>

          {/* Individual KPI Metrics Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            <div style={{ background: 'var(--bg-canvas-subtle)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Course Material Mastery
              </div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--color-green-deep)' }}>
                {activeStudent.progressPercent || 0}%
              </div>
              <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '999px', marginTop: '8px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${activeStudent.progressPercent || 0}%`,
                    background: 'linear-gradient(90deg, var(--color-green-primary), var(--color-gold-primary))',
                  }}
                />
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {activeStudent.completedLessons?.length || 0} Lessons Mastered
              </div>
            </div>

            <div style={{ background: 'var(--bg-canvas-subtle)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Hifz Memorization Target
              </div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--color-gold-deep)' }}>
                {activeStudent.memorizedJuz || 12} / {activeStudent.totalJuz || 30} Juz
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Goal: {activeStudent.targetGoal || 'Full Hifz & Tajweed Mastery'}
              </div>
            </div>

            <div style={{ background: 'var(--bg-canvas-subtle)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Tajweed &amp; Quiz Distinctions
              </div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#166534' }}>
                {activeStudent.completedQuizzes?.length || 0} Passed
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Average Quiz Score: 95.8%
              </div>
            </div>

            <div style={{ background: 'var(--bg-canvas-subtle)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Recitation Mistake Slips
              </div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: studentMistakes.filter(m => m.status === 'active').length > 0 ? '#DC2626' : '#166534' }}>
                {studentMistakes.filter(m => m.status === 'active').length} Active
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {studentMistakes.filter(m => m.status === 'resolved').length} Resolved &amp; Cleared
              </div>
            </div>
          </div>

          {/* Dossier Detail Sub-Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              borderBottom: '2px solid var(--border-light)',
              paddingBottom: '8px',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              onClick={() => setInnerTab('materials')}
              className="btn-table-action"
              style={{
                padding: '9px 18px',
                fontSize: '13.5px',
                fontWeight: '700',
                borderRadius: '10px',
                background: innerTab === 'materials' ? 'var(--color-green-primary)' : 'var(--color-white)',
                color: innerTab === 'materials' ? '#FFFFFF' : 'var(--text-body)',
                borderColor: innerTab === 'materials' ? 'var(--color-gold-primary)' : 'var(--border-light)',
              }}
            >
              📚 Course Material &amp; Lesson Progress
            </button>

            <button
              type="button"
              onClick={() => setInnerTab('quizzes')}
              className="btn-table-action"
              style={{
                padding: '9px 18px',
                fontSize: '13.5px',
                fontWeight: '700',
                borderRadius: '10px',
                background: innerTab === 'quizzes' ? 'var(--color-green-primary)' : 'var(--color-white)',
                color: innerTab === 'quizzes' ? '#FFFFFF' : 'var(--text-body)',
                borderColor: innerTab === 'quizzes' ? 'var(--color-gold-primary)' : 'var(--border-light)',
              }}
            >
              📝 Quiz &amp; Tajweed Exam Results ({activeStudent.completedQuizzes?.length || 0})
            </button>

            <button
              type="button"
              onClick={() => setInnerTab('mistakes')}
              className="btn-table-action"
              style={{
                padding: '9px 18px',
                fontSize: '13.5px',
                fontWeight: '700',
                borderRadius: '10px',
                background: innerTab === 'mistakes' ? 'var(--color-green-primary)' : 'var(--color-white)',
                color: innerTab === 'mistakes' ? '#FFFFFF' : 'var(--text-body)',
                borderColor: innerTab === 'mistakes' ? 'var(--color-gold-primary)' : 'var(--border-light)',
              }}
            >
              📖 Quran Mistake Annotations ({studentMistakes.length})
            </button>

            <button
              type="button"
              onClick={() => setInnerTab('notes')}
              className="btn-table-action"
              style={{
                padding: '9px 18px',
                fontSize: '13.5px',
                fontWeight: '700',
                borderRadius: '10px',
                background: innerTab === 'notes' ? 'var(--color-green-primary)' : 'var(--color-white)',
                color: innerTab === 'notes' ? '#FFFFFF' : 'var(--text-body)',
                borderColor: innerTab === 'notes' ? 'var(--color-gold-primary)' : 'var(--border-light)',
              }}
            >
              ✍️ Scholar Guidance Notes
            </button>
          </div>

          {/* ================= TAB 1: COURSE MATERIAL & LESSON PROGRESS ================= */}
          {innerTab === 'materials' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--color-green-deep)', fontWeight: '800' }}>
                    Syllabus Modules &amp; Lesson Completion for {activeStudent.studentName || activeStudent.name}
                  </h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                    As the lead scholar, you can review lesson practice texts and directly verify or toggle lesson mastery for this student.
                  </p>
                </div>
              </div>

              {(!course?.modules || course.modules.length === 0) && (
                <div style={{ padding: '28px', textAlign: 'center', color: 'var(--text-muted)', background: '#FAFAF9', borderRadius: '12px' }}>
                  No syllabus modules available for this course yet.
                </div>
              )}
              {course?.modules?.map((mod) => {
                  const totalModLessons = mod.lessons?.length || 0;
                  const completedInMod = (mod.lessons || []).filter((l) =>
                    activeStudent.completedLessons?.includes(l.id)
                  ).length;
                  const modProgressPercent =
                    totalModLessons > 0 ? Math.round((completedInMod / totalModLessons) * 100) : 0;

                  return (
                    <div
                      key={mod.id}
                    style={{
                      border: '1.5px solid var(--border-light)',
                      borderRadius: '14px',
                      padding: '20px',
                      background: '#FFFFFF',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid var(--border-light)',
                        paddingBottom: '14px',
                        marginBottom: '14px',
                        flexWrap: 'wrap',
                        gap: '10px',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: '800',
                              background: 'var(--color-green-surface)',
                              color: 'var(--color-green-primary)',
                              padding: '2px 8px',
                              borderRadius: '6px',
                            }}
                          >
                            MODULE {mod.moduleNumber}
                          </span>
                          <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-green-deep)' }}>
                            {mod.title}
                          </span>
                        </div>
                        {mod.arabicTitle && (
                          <div
                            style={{
                              fontFamily: 'var(--font-arabic)',
                              fontSize: '17px',
                              color: 'var(--color-gold-deep)',
                              marginTop: '2px',
                            }}
                          >
                            {mod.arabicTitle}
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                          {completedInMod} / {totalModLessons} Lessons Mastered
                        </span>
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: '800',
                            padding: '3px 10px',
                            borderRadius: '999px',
                            background: modProgressPercent === 100 ? '#DCFCE7' : 'var(--color-gold-light)',
                            color: modProgressPercent === 100 ? '#166534' : 'var(--color-gold-deep)',
                          }}
                        >
                          {modProgressPercent}%
                        </span>
                      </div>
                    </div>

                    {/* Lessons list inside module */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {mod.lessons?.map((les) => {
                        const isDone = activeStudent.completedLessons?.includes(les.id);
                        const isUpdating = actionLessonId === les.id;

                        return (
                          <div
                            key={les.id}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '14px 18px',
                              borderRadius: '12px',
                              background: isDone ? '#F0FDF4' : 'var(--bg-canvas-subtle)',
                              border: isDone ? '1px solid #86EFAC' : '1px solid var(--border-light)',
                              flexWrap: 'wrap',
                              gap: '12px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1, minWidth: '280px' }}>
                              <span style={{ fontSize: '20px', marginTop: '2px' }}>
                                {isDone ? '✅' : '⏳'}
                              </span>
                              <div>
                                <div style={{ fontSize: '14.5px', fontWeight: '700', color: isDone ? '#166534' : 'var(--text-main)' }}>
                                  {les.title}
                                </div>
                                <div style={{ fontSize: '12.5px', color: 'var(--text-body)', marginTop: '3px' }}>
                                  {les.content}
                                </div>
                                {les.practiceText && (
                                  <div
                                    style={{
                                      fontFamily: 'var(--font-arabic)',
                                      fontSize: '20px',
                                      color: 'var(--color-green-deep)',
                                      marginTop: '6px',
                                      direction: 'rtl',
                                    }}
                                  >
                                    {les.practiceText}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                ⏱ {les.duration}
                              </span>

                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() => handleToggleLessonForStudent(les.id)}
                                className="btn-table-action"
                                style={{
                                  padding: '8px 14px',
                                  fontSize: '12.5px',
                                  fontWeight: '700',
                                  borderRadius: '8px',
                                  background: isDone ? '#FEF2F2' : '#DCFCE7',
                                  borderColor: isDone ? '#F87171' : '#86EFAC',
                                  color: isDone ? '#991B1B' : '#166534',
                                }}
                              >
                                {isUpdating
                                  ? 'Updating...'
                                  : isDone
                                  ? '↺ Revoke Lesson'
                                  : '✓ Mark Mastered'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ================= TAB 2: QUIZZES & EXAM RESULTS ================= */}
          {innerTab === 'quizzes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--color-green-deep)', fontWeight: '800' }}>
                    Graded Tajweed Exam Performance
                  </h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                    Assessment scores, distinction milestones, and testing dates for {activeStudent.studentName || activeStudent.name}.
                  </p>
                </div>
              </div>

              {activeStudent.completedQuizzes && activeStudent.completedQuizzes.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  {activeStudent.completedQuizzes.map((qz, idx) => {
                    return (
                      <div
                        key={idx}
                        style={{
                          background: '#FFFFFF',
                          border: '1.5px solid var(--border-light)',
                          borderRadius: '14px',
                          padding: '18px 20px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: '800',
                              background: '#DCFCE7',
                              color: '#166534',
                              padding: '2px 8px',
                              borderRadius: '6px',
                            }}
                          >
                            PASSED WITH DISTINCTION
                          </span>
                          <span style={{ fontSize: '18px' }}>🌟</span>
                        </div>

                        <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-green-deep)' }}>
                          {qz.quizId === 'quiz-mod-1'
                            ? 'Module 1: Makharij & Articulation Exam'
                            : qz.quizId === 'quiz-mod-2'
                            ? 'Module 2: Harakat & Pronunciation Precision'
                            : qz.quizId === 'quiz-mod-3'
                            ? 'Module 3: Qalqalah & Sukoon Rules Assessment'
                            : qz.quizId === 'quiz-mod-4'
                            ? 'Module 4: Madd (Elongation) Duration Mastery'
                            : qz.quizId === 'quiz-mod-5'
                            ? 'Module 5: Noon Sakinah & Tanween Rules Exam'
                            : 'Module Assessment'}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Score Achieved:</span>
                          <strong style={{ fontSize: '18px', color: qz.score >= 90 ? '#166534' : 'var(--color-green-primary)' }}>
                            {qz.score}%
                          </strong>
                        </div>

                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-light)', paddingTop: '8px' }}>
                          Completed on: {new Date(qz.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ padding: '36px 20px', textAlign: 'center', background: 'var(--bg-canvas-subtle)', borderRadius: '12px' }}>
                  <span style={{ fontSize: '36px', display: 'block', marginBottom: '10px' }}>📝</span>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>
                    No completed quizzes yet
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    This student will unlock quizzes after completing the respective syllabus lessons.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 3: QURAN RECITATION MISTAKES ================= */}
          {innerTab === 'mistakes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--color-green-deep)', fontWeight: '800' }}>
                    Interactive Quran Mistake Log for {activeStudent.studentName || activeStudent.name}
                  </h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                    Recitation slips, Tajweed errors, and pronunciations marked on the Holy Mushaf during private sessions.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (onOpenQuranForStudent) {
                      onOpenQuranForStudent(activeStudent.studentId || activeStudent.id);
                    }
                  }}
                  className="btn-auth-submit"
                  style={{ margin: 0, padding: '8px 16px', fontSize: '13px', width: 'auto' }}
                >
                  <span>➕ Add Mistake in Quran Annotator</span>
                </button>
              </div>

              {loadingMistakes ? (
                <div style={{ padding: '24px', textAlign: 'center' }}>Loading mistake records...</div>
              ) : studentMistakes.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {studentMistakes.map((m) => {
                    const isActive = m.status === 'active';

                    return (
                      <div
                        key={m.id}
                        style={{
                          border: isActive ? '1.5px solid #F87171' : '1px solid #86EFAC',
                          borderRadius: '14px',
                          padding: '18px 20px',
                          background: isActive ? '#FFFDFD' : '#F0FDF4',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: '800',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                background: isActive ? '#FEE2E2' : '#DCFCE7',
                                color: isActive ? '#991B1B' : '#166534',
                              }}
                            >
                              {isActive ? '🔴 ACTIVE SLIP (NEEDS REVISION)' : '🟢 RESOLVED & CLEARED'}
                            </span>

                            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-green-deep)' }}>
                              Surah {m.surahName || `Surah ${m.surahNumber}`}, Ayah {m.ayahNumber}
                            </span>
                          </div>

                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            Flagged on: {new Date(m.flaggedAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '700', color: '#991B1B' }}>
                              Slip Category: {m.categoryLabel || m.mistakeCategory}
                            </div>
                            <div style={{ fontSize: '13px', color: 'var(--text-body)', marginTop: '4px' }}>
                              <strong>Teacher Correction Note:</strong> {m.correctionNote}
                            </div>
                            {m.resolvedNote && (
                              <div style={{ fontSize: '12.5px', color: '#166534', marginTop: '4px' }}>
                                <strong>Resolution:</strong> {m.resolvedNote}
                              </div>
                            )}
                          </div>

                          {m.wordText && (
                            <div
                              style={{
                                fontFamily: 'var(--font-arabic)',
                                fontSize: '28px',
                                color: 'var(--color-green-deep)',
                                background: 'rgba(255, 255, 255, 0.8)',
                                padding: '4px 14px',
                                borderRadius: '8px',
                                border: '1px solid var(--border-light)',
                                direction: 'rtl',
                              }}
                            >
                              {m.wordText}
                            </div>
                          )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '10px' }}>
                          {isActive && (
                            <button
                              type="button"
                              onClick={() => handleResolveMistake(m.id)}
                              className="btn-table-action"
                              style={{
                                padding: '6px 14px',
                                fontSize: '12px',
                                fontWeight: '700',
                                background: '#DCFCE7',
                                borderColor: '#86EFAC',
                                color: '#166534',
                              }}
                            >
                              ✓ Clear &amp; Mark Resolved
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ padding: '36px 20px', textAlign: 'center', background: 'var(--bg-canvas-subtle)', borderRadius: '12px' }}>
                  <span style={{ fontSize: '36px', display: 'block', marginBottom: '10px' }}>✨</span>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-green-primary)' }}>
                    No recitation mistakes logged for this student!
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Student recitation is clean or mistakes have all been resolved with distinction.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 4: SCHOLAR GUIDANCE NOTES ================= */}
          {innerTab === 'notes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--color-green-deep)', fontWeight: '800' }}>
                  Private Scholarly Pedagogy &amp; Sanad Evaluation Notes
                </h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                  Record personalized Tajweed observations, revision homework, or Sanad certification milestones for {activeStudent.studentName || activeStudent.name}.
                </p>
              </div>

              {notesFeedback && (
                <div className="auth-alert-box auth-alert-success" style={{ margin: 0 }}>
                  <span>✅</span>
                  <span>{notesFeedback}</span>
                </div>
              )}

              <textarea
                rows={6}
                value={teacherNotesText}
                onChange={(e) => setTeacherNotesText(e.target.value)}
                placeholder="Example: Tariq has demonstrated excellent control over Qalqalah letters. In the upcoming session, focus on Madd Munfasil count consistency in Surah Al-Baqarah. Ready for Ijazah pre-evaluation."
                className="form-control"
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '14px',
                  borderRadius: '12px',
                  lineHeight: '1.6',
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  disabled={isSavingNotes}
                  onClick={handleSaveNotes}
                  className="btn-auth-submit"
                  style={{ margin: 0, padding: '10px 24px', fontSize: '13.5px', width: 'auto' }}
                >
                  <span>{isSavingNotes ? 'Saving...' : '💾 Save Scholarly Notes'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ padding: '40px', textAlign: 'center', background: '#FFFFFF', borderRadius: '14px' }}>
          No student selected.
        </div>
      )}
    </div>
  );
}
