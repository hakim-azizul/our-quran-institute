'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from './Icons';

export default function CourseCurriculumViewer({
  course,
  courses = [],
  enrollment,
  currentUser,
  studentsList = [],
  selectedStudentId,
  onSelectStudent,
  onSelectCourse,
  onLaunchQuiz,
  onRefreshEnrollment,
  onCourseUpdated,
}) {
  const isTeacher = currentUser?.role === 'teacher';
  const isTeacherOrAdmin = currentUser?.role === 'teacher' || currentUser?.role === 'admin';

  // Defensive modules extraction
  const modules = Array.isArray(course?.modules) ? course.modules : [];

  const [activeModuleIndex, setActiveModuleIndex] = useState(0);

  // Clamped safe module index
  const safeModuleIndex =
    modules.length > 0
      ? activeModuleIndex >= 0 && activeModuleIndex < modules.length
        ? activeModuleIndex
        : 0
      : 0;

  const activeModule = modules[safeModuleIndex] || modules[0] || null;

  const [activeLesson, setActiveLesson] = useState(null);

  // Reset active module index when switching courses
  useEffect(() => {
    setActiveModuleIndex(0);
  }, [course?.id]);

  // Synchronize active lesson whenever activeModule changes
  useEffect(() => {
    const lessons = Array.isArray(activeModule?.lessons) ? activeModule.lessons : [];
    if (lessons.length > 0) {
      if (!activeLesson || !lessons.some((l) => l.id === activeLesson.id)) {
        setActiveLesson(lessons[0]);
      }
    } else {
      setActiveLesson(null);
    }
  }, [activeModule?.id, activeModuleIndex, course?.id]);

  // If teacher, student inspector state
  const [inspectedStudentId, setInspectedStudentId] = useState(
    selectedStudentId || studentsList[0]?.studentId || studentsList[0]?.id || ''
  );

  // Sync external selectedStudentId
  useEffect(() => {
    if (selectedStudentId && selectedStudentId !== inspectedStudentId) {
      setInspectedStudentId(selectedStudentId);
    }
  }, [selectedStudentId]);

  const inspectedStudentEnrollment = isTeacher
    ? studentsList.find((s) => s.studentId === inspectedStudentId || s.id === inspectedStudentId) ||
      studentsList[0] ||
      null
    : null;

  // Active completedLessons for display
  const effectiveEnrollment = isTeacher ? inspectedStudentEnrollment : enrollment;
  const completedLessons = Array.isArray(effectiveEnrollment?.completedLessons)
    ? effectiveEnrollment.completedLessons
    : [];

  // Teacher editing module state
  const [isEditingModule, setIsEditingModule] = useState(false);
  const [editModuleTitle, setEditModuleTitle] = useState('');
  const [editModuleDesc, setEditModuleDesc] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Teacher / Admin adding module state
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleDesc, setNewModuleDesc] = useState('');

  if (!course) {
    return (
      <div
        className="dash-panel"
        style={{
          padding: '48px 24px',
          textAlign: 'center',
          background: 'var(--color-white)',
          borderRadius: '16px',
        }}
      >
        <span style={{ fontSize: '36px', display: 'block', marginBottom: '12px' }}>📖</span>
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '22px',
            color: 'var(--color-green-primary)',
            marginBottom: '6px',
          }}
        >
          No Course Selected
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
          Please select a Quran course from the catalog or switch courses above.
        </p>
      </div>
    );
  }

  const handleMarkComplete = async (lessonId) => {
    if (!effectiveEnrollment) return;
    try {
      const enrollId = effectiveEnrollment.enrollmentId || effectiveEnrollment.id;
      const isAlreadyComplete = completedLessons.includes(lessonId);
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
      if (data.success && onRefreshEnrollment) {
        onRefreshEnrollment();
      }
    } catch (err) {
      console.error('Error toggling lesson completion:', err);
    }
  };

  const handleStartEditModule = (mod) => {
    if (!mod) return;
    setEditModuleTitle(mod.title || '');
    setEditModuleDesc(mod.description || '');
    setIsEditingModule(true);
  };

  const handleSaveModuleEdit = async () => {
    if (!activeModule) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/courses/${course.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId: activeModule.id,
          updatedModuleData: {
            title: editModuleTitle,
            description: editModuleDesc,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsEditingModule(false);
        if (onCourseUpdated) onCourseUpdated();
      } else {
        alert(data.error || 'Failed to update module.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateNewModule = async () => {
    setIsSaving(true);
    try {
      const nextNum = modules.length + 1;
      const res = await fetch(`/api/courses/${course.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_module',
          newModule: {
            title: newModuleTitle.trim() || `Module ${nextNum}: Core Recitation & Rules`,
            description:
              newModuleDesc.trim() ||
              'Detailed scholarly commentary, Makharij rules, and Quranic recitation exercises.',
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddingModule(false);
        setNewModuleTitle('');
        setNewModuleDesc('');
        if (onCourseUpdated) onCourseUpdated();
      } else {
        alert(data.error || 'Failed to add module.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Optional Course Selection Bar if Institute Has Multiple Courses */}
      {courses.length > 1 && (
        <div className="dash-panel" style={{ padding: '16px 20px', background: '#FFFFFF' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--color-gold-deep)',
            }}
          >
            Switch Course ({courses.length} Available)
          </span>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
            {courses.map((c) => {
              const isSelected = c.id === course?.id;
              return (
                <button
                  key={c.id}
                  onClick={() => onSelectCourse && onSelectCourse(c)}
                  className="btn-table-action"
                  style={{
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: '700',
                    background: isSelected ? 'var(--color-green-primary)' : '#FAFAF9',
                    color: isSelected ? '#FFFFFF' : 'var(--text-main)',
                    borderColor: isSelected ? 'var(--color-gold-primary)' : 'var(--border-light)',
                    cursor: 'pointer',
                  }}
                >
                  <span>{c.code || c.id}</span> • <span>{c.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Teacher Student Progress Inspector Bar */}
      {isTeacher && studentsList.length > 0 && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(13, 74, 56, 0.05) 0%, rgba(197, 164, 90, 0.1) 100%)',
            border: '1.5px solid var(--color-gold-primary)',
            borderRadius: '14px',
            padding: '14px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>🎓</span>
            <div>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: '800',
                  color: 'var(--color-green-deep)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Scholar Student Material Inspector
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-body)' }}>
                Inspecting individual syllabus progress for:{' '}
                <strong style={{ color: 'var(--color-green-primary)' }}>
                  {effectiveEnrollment?.studentName || effectiveEnrollment?.name || 'Student'}
                </strong>{' '}
                ({effectiveEnrollment?.progressPercent || 0}% Complete •{' '}
                {completedLessons.length} Lessons Mastered)
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-body)' }}>
              Inspect Student:
            </span>
            <select
              value={inspectedStudentId}
              onChange={(e) => {
                setInspectedStudentId(e.target.value);
                if (onSelectStudent) onSelectStudent(e.target.value);
              }}
              className="form-control"
              style={{
                padding: '6px 14px',
                fontSize: '13px',
                borderRadius: '8px',
                fontWeight: '700',
                borderColor: 'var(--color-gold-primary)',
                background: '#FFFFFF',
                color: 'var(--color-green-deep)',
              }}
            >
              {studentsList.map((stu) => {
                const sId = stu.studentId || stu.id;
                return (
                  <option key={sId} value={sId}>
                    {stu.studentName || stu.name} ({stu.progressPercent || 0}%)
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      )}

      {/* Course Hero Header Card */}
      <div
        style={{
          background: 'var(--color-white)',
          border: '1.5px solid var(--color-gold-primary)',
          borderRadius: '18px',
          padding: '28px 32px',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="dashboard-user-badge">
              📖 Course Syllabus • {course.level || 'All Levels'}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {course.totalDuration || 'Comprehensive'}
            </span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '26px',
              fontWeight: '700',
              color: 'var(--color-green-primary)',
              margin: '0 0 4px 0',
            }}
          >
            {course.title}
          </h2>
          {course.arabicTitle && (
            <p
              style={{
                fontFamily: 'var(--font-arabic)',
                fontSize: '22px',
                color: 'var(--color-gold-deep)',
                margin: '4px 0 8px 0',
              }}
            >
              {course.arabicTitle}
            </p>
          )}

          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', maxWidth: '720px', lineHeight: '1.5', margin: '4px 0 0 0' }}>
            {course.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '12px' }}>
            <span style={{ fontSize: '12.5px', color: 'var(--text-body)', fontWeight: '600' }}>
              Instructor:{' '}
              <strong style={{ color: 'var(--color-green-primary)' }}>
                {course.teacherName || 'Al-Azhar Faculty Scholar'}
              </strong>
            </span>
            {enrollment && (
              <span style={{ fontSize: '12.5px', color: 'var(--text-body)', fontWeight: '600' }}>
                Overall Progress:{' '}
                <strong style={{ color: '#166534' }}>{enrollment.progressPercent || 0}%</strong>
              </span>
            )}
          </div>
        </div>

        {/* Progress Circle or Enrolled Pill */}
        {enrollment && (
          <div style={{ textAlign: 'center', minWidth: '140px' }}>
            <div
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                border: '4px solid var(--color-gold-primary)',
                background: 'var(--color-gold-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 8px auto',
                fontSize: '18px',
                fontWeight: '700',
                color: 'var(--color-green-primary)',
              }}
            >
              {enrollment.progressPercent || 0}%
            </div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-green-primary)' }}>
              Completed
            </span>
          </div>
        )}
      </div>

      {/* Curriculum Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '22px' }}>
        {/* Left Column: Module & Lesson Tree */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3
              style={{
                fontSize: '15px',
                fontWeight: '700',
                color: 'var(--color-green-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                margin: 0,
              }}
            >
              Course Modules ({modules.length})
            </h3>
            {isTeacherOrAdmin && (
              <button
                onClick={() => setIsAddingModule(true)}
                className="btn-table-action"
                style={{ fontSize: '12px', padding: '4px 10px', borderColor: 'var(--color-gold-primary)' }}
              >
                + Add Module
              </button>
            )}
          </div>

          {modules.length === 0 ? (
            <div
              style={{
                background: 'var(--color-white)',
                border: '1.5px dashed var(--border-light)',
                borderRadius: '14px',
                padding: '24px 16px',
                textAlign: 'center',
                color: 'var(--text-muted)',
              }}
            >
              <span style={{ fontSize: '28px', display: 'block', marginBottom: '8px' }}>📚</span>
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>
                No Modules Added Yet
              </div>
              <p style={{ fontSize: '12.5px', margin: 0 }}>
                {isTeacherOrAdmin
                  ? 'Click "+ Add Module" above to provision the first curriculum module.'
                  : 'Syllabus modules are currently being prepared by the faculty.'}
              </p>
            </div>
          ) : (
            modules.map((mod, idx) => {
              const isActive = safeModuleIndex === idx;
              const modLessons = Array.isArray(mod.lessons) ? mod.lessons : [];
              const completedCount = modLessons.filter((l) => completedLessons.includes(l.id)).length;
              const isFullyComplete = modLessons.length > 0 && completedCount === modLessons.length;

              return (
                <div
                  key={mod.id || `mod-${idx}`}
                  style={{
                    background: 'var(--color-white)',
                    border: isActive ? '2px solid var(--color-gold-primary)' : '1px solid var(--border-light)',
                    borderRadius: '14px',
                    padding: '16px',
                    cursor: 'pointer',
                    boxShadow: isActive ? 'var(--shadow-card)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => {
                    setActiveModuleIndex(idx);
                    if (modLessons.length > 0) setActiveLesson(modLessons[0]);
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '6px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        color: isActive ? 'var(--color-gold-deep)' : 'var(--text-muted)',
                      }}
                    >
                      Module {mod.moduleNumber ?? idx + 1}
                    </span>
                    {isFullyComplete && (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          color: '#166534',
                          background: '#DCFCE7',
                          padding: '2px 6px',
                          borderRadius: '4px',
                        }}
                      >
                        ✓ Completed
                      </span>
                    )}
                  </div>

                  <h4
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: isActive ? 'var(--color-green-primary)' : 'var(--text-main)',
                      margin: '0 0 4px 0',
                    }}
                  >
                    {mod.title || `Module ${idx + 1}`}
                  </h4>

                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {completedCount} of {modLessons.length} Lessons done
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Active Module Details & Lesson Reader */}
        <div className="dash-panel">
          {!activeModule ? (
            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>📖</span>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '24px',
                  fontWeight: '700',
                  color: 'var(--color-green-primary)',
                  marginBottom: '8px',
                }}
              >
                Curriculum Syllabus in Preparation
              </h3>
              <p
                style={{
                  fontSize: '14.5px',
                  color: 'var(--text-muted)',
                  maxWidth: '520px',
                  margin: '0 auto 20px auto',
                  lineHeight: '1.6',
                }}
              >
                The structured lessons and recitation passages for <strong>{course.title}</strong> are being finalized by{' '}
                {course.teacherName || 'the assigned scholar'}.
              </p>
              {isTeacherOrAdmin && (
                <button
                  onClick={() => setIsAddingModule(true)}
                  className="btn-auth-submit"
                  style={{ width: 'auto', margin: '0 auto', padding: '12px 24px', fontSize: '14px' }}
                >
                  <span>➕ Provision First Module &amp; Lessons</span>
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Module Header Bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  borderBottom: '1.5px solid var(--border-light)',
                  paddingBottom: '16px',
                  marginBottom: '20px',
                }}
              >
                <div>
                  <span className="dashboard-user-badge" style={{ marginBottom: '8px' }}>
                    Module {activeModule.moduleNumber ?? safeModuleIndex + 1} Overview
                  </span>
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '26px',
                      fontWeight: '700',
                      color: 'var(--color-green-primary)',
                      margin: '0 0 4px 0',
                    }}
                  >
                    {activeModule.title || 'Module Overview'}
                  </h3>
                  {activeModule.arabicTitle && (
                    <p
                      style={{
                        fontFamily: 'var(--font-arabic)',
                        fontSize: '22px',
                        color: 'var(--color-gold-deep)',
                        margin: '2px 0 6px 0',
                      }}
                    >
                      {activeModule.arabicTitle}
                    </p>
                  )}
                  <p
                    style={{
                      fontSize: '15px',
                      color: 'var(--text-muted)',
                      margin: 0,
                      lineHeight: '1.6',
                    }}
                  >
                    {activeModule.description || 'Module curriculum overview.'}
                  </p>
                </div>

                {isTeacherOrAdmin && (
                  <button
                    onClick={() => handleStartEditModule(activeModule)}
                    className="btn-table-action"
                    style={{
                      fontSize: '13.5px',
                      padding: '8px 16px',
                      borderColor: 'var(--color-gold-primary)',
                      color: 'var(--color-green-primary)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    ✏️ Edit Module Notes
                  </button>
                )}
              </div>

              {/* Lesson Picker Tabs */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '22px' }}>
                {(activeModule.lessons || []).map((les) => {
                  const isSelected = activeLesson?.id === les.id;
                  const isDone = completedLessons.includes(les.id);

                  return (
                    <button
                      key={les.id}
                      onClick={() => setActiveLesson(les)}
                      className="btn-table-action"
                      style={{
                        background: isSelected ? 'var(--color-green-primary)' : 'var(--color-white)',
                        color: isSelected ? '#FFFFFF' : 'var(--text-main)',
                        borderColor: isSelected ? 'var(--color-gold-primary)' : 'var(--border-light)',
                        fontWeight: isSelected ? '700' : '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        fontSize: '14.5px',
                      }}
                    >
                      {isDone ? <span>✓</span> : <span>📖</span>}
                      <span>{(les.title || 'Lesson').split(':')[0]}</span>
                    </button>
                  );
                })}

                {/* Assessment / Quiz Button */}
                {activeModule.quizId && (
                  <button
                    onClick={() => onLaunchQuiz && onLaunchQuiz(activeModule.quizId, activeModule.id)}
                    className="btn-table-action"
                    style={{
                      background: 'var(--color-gold-light)',
                      color: 'var(--color-green-deep)',
                      borderColor: 'var(--color-gold-primary)',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      fontSize: '14.5px',
                    }}
                  >
                    <span>🏆</span>
                    <span>Module {activeModule.moduleNumber ?? safeModuleIndex + 1} Assessment</span>
                  </button>
                )}
              </div>

              {/* Active Lesson Content Box */}
              {activeLesson ? (
                <div
                  style={{
                    background: 'var(--bg-canvas-subtle)',
                    border: '1.5px solid var(--border-light)',
                    borderRadius: '18px',
                    padding: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '18px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4
                      style={{
                        fontSize: '22px',
                        fontWeight: '700',
                        color: 'var(--color-green-primary)',
                        margin: 0,
                      }}
                    >
                      {activeLesson.title}
                    </h4>
                    {activeLesson.duration && (
                      <span style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-muted)' }}>
                        ⏱ {activeLesson.duration}
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: '16px', color: 'var(--text-body)', lineHeight: '1.7', margin: 0 }}>
                    {activeLesson.content}
                  </p>

                  {/* Practice Arabic Calligraphy Block */}
                  {activeLesson.practiceText && (
                    <div
                      style={{
                        background: 'var(--color-white)',
                        border: '1.5px dashed var(--color-gold-primary)',
                        borderRadius: '14px',
                        padding: '24px',
                        textAlign: 'center',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '13px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          fontWeight: '700',
                          color: 'var(--color-gold-deep)',
                        }}
                      >
                        Tajweed Recitation &amp; Practice Text:
                      </span>
                      <div
                        dir="rtl"
                        style={{
                          fontFamily: 'var(--font-arabic)',
                          fontSize: '40px',
                          lineHeight: '2.2',
                          color: 'var(--color-green-deep)',
                          margin: '12px 0',
                        }}
                      >
                        {activeLesson.practiceText}
                      </div>
                    </div>
                  )}

                  {/* Lesson Completion Action */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '12px',
                      flexWrap: 'wrap',
                      gap: '10px',
                    }}
                  >
                    {(enrollment || isTeacher) && (
                      <button
                        onClick={() => handleMarkComplete(activeLesson.id)}
                        className="btn-auth-submit"
                        style={{
                          margin: 0,
                          width: 'auto',
                          padding: '12px 24px',
                          fontSize: '15px',
                          background: completedLessons.includes(activeLesson.id)
                            ? isTeacher
                              ? '#FEF2F2'
                              : '#166534'
                            : 'var(--color-green-primary)',
                          color:
                            completedLessons.includes(activeLesson.id) && isTeacher ? '#991B1B' : '#FFFFFF',
                          border:
                            completedLessons.includes(activeLesson.id) && isTeacher
                              ? '1.5px solid #F87171'
                              : 'none',
                        }}
                      >
                        {completedLessons.includes(activeLesson.id) ? (
                          isTeacher ? (
                            <span>
                              ↺ Reopen Lesson for{' '}
                              {effectiveEnrollment?.studentName?.split(' ')[0] || 'Student'}
                            </span>
                          ) : (
                            <span>✓ Lesson Completed</span>
                          )
                        ) : isTeacher ? (
                          <span>
                            ✓ Verify &amp; Mark Mastered for{' '}
                            {effectiveEnrollment?.studentName?.split(' ')[0] || 'Student'}
                          </span>
                        ) : (
                          <>
                            <span>Mark Lesson as Completed</span>
                            <Icon name="check" size={16} color="#FFDF85" />
                          </>
                        )}
                      </button>
                    )}

                    {activeModule.quizId && (
                      <button
                        onClick={() => onLaunchQuiz && onLaunchQuiz(activeModule.quizId, activeModule.id)}
                        className="btn-table-action"
                        style={{ padding: '12px 20px', fontSize: '14.5px', fontWeight: '700' }}
                      >
                        Take Module Quiz →
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>
                  {(activeModule.lessons || []).length > 0
                    ? 'Select a lesson above to read the curriculum instructions.'
                    : 'No lessons added yet for this module.'}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Teacher / Admin Add Module Modal */}
      {isAddingModule && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(6, 42, 31, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
          onClick={() => setIsAddingModule(false)}
        >
          <div
            style={{
              background: 'var(--color-white)',
              border: '2px solid var(--color-gold-primary)',
              borderRadius: '20px',
              maxWidth: '540px',
              width: '100%',
              padding: '28px',
              boxShadow: 'var(--shadow-elevated)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '22px',
                fontWeight: '700',
                color: 'var(--color-green-primary)',
                marginBottom: '14px',
              }}
            >
              ➕ Provision New Curriculum Module
            </h3>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">Module Title</label>
              <input
                type="text"
                value={newModuleTitle}
                placeholder={`e.g. Module ${modules.length + 1}: Articulation Points & Rules`}
                onChange={(e) => setNewModuleTitle(e.target.value)}
                className="form-input form-input-noicon"
              />
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label">Module Description &amp; Scholarly Guidance</label>
              <textarea
                rows={4}
                value={newModuleDesc}
                placeholder="Overview of module objectives, pronunciation tips, and study guidance..."
                onChange={(e) => setNewModuleDesc(e.target.value)}
                className="form-input form-input-noicon"
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleCreateNewModule}
                disabled={isSaving}
                className="btn-auth-submit"
                style={{ margin: 0 }}
              >
                {isSaving ? 'Provisioning Module...' : 'Add Module to Course'}
              </button>
              <button onClick={() => setIsAddingModule(false)} className="btn-table-action">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Edit Module Modal */}
      {isEditingModule && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(6, 42, 31, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
          onClick={() => setIsEditingModule(false)}
        >
          <div
            style={{
              background: 'var(--color-white)',
              border: '2px solid var(--color-gold-primary)',
              borderRadius: '20px',
              maxWidth: '540px',
              width: '100%',
              padding: '28px',
              boxShadow: 'var(--shadow-elevated)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '22px',
                fontWeight: '700',
                color: 'var(--color-green-primary)',
                marginBottom: '14px',
              }}
            >
              ✏️ Update Module Curriculum
            </h3>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">Module Title</label>
              <input
                type="text"
                value={editModuleTitle}
                onChange={(e) => setEditModuleTitle(e.target.value)}
                className="form-input form-input-noicon"
              />
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label">Module Description &amp; Scholarly Guidance</label>
              <textarea
                rows={4}
                value={editModuleDesc}
                onChange={(e) => setEditModuleDesc(e.target.value)}
                className="form-input form-input-noicon"
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleSaveModuleEdit}
                disabled={isSaving}
                className="btn-auth-submit"
                style={{ margin: 0 }}
              >
                {isSaving ? 'Saving Updates...' : 'Save Curriculum Changes'}
              </button>
              <button onClick={() => setIsEditingModule(false)} className="btn-table-action">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
