'use client';

import React, { useState } from 'react';
import { Icon } from './Icons';

export default function CourseEnrollmentCatalog({
  course,
  courses = [],
  teachers = [],
  currentUser,
  onSelectCourse,
  onEnrollSuccess,
}) {
  const [selectedTeacherId, setSelectedTeacherId] = useState(
    teachers[0]?.id || course?.assignedTeacherId || 'QI-FAC-014'
  );
  const [enrolling, setEnrolling] = useState(false);
  const [expandedModuleId, setExpandedModuleId] = useState(course?.modules?.[0]?.id || null);
  const [enrollError, setEnrollError] = useState('');
  const [enrollSuccessMessage, setEnrollSuccessMessage] = useState('');

  const selectedTeacher = teachers.find((t) => t.id === selectedTeacherId) || teachers[0];

  const handleEnroll = async () => {
    if (!course) return;
    setEnrolling(true);
    setEnrollError('');
    setEnrollSuccessMessage('');

    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.id,
          teacherId: selectedTeacherId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete enrollment.');
      }

      setEnrollSuccessMessage('Alhamdulillah! You are now enrolled. Unlocking your sanctuary Quran learning workspace...');
      if (onEnrollSuccess) {
        setTimeout(() => {
          onEnrollSuccess(data.enrollment);
        }, 800);
      }
    } catch (err) {
      setEnrollError(err.message || 'An error occurred during enrollment.');
    } finally {
      setEnrolling(false);
    }
  };

  if (!course) {
    return (
      <div className="dash-panel" style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading course catalog information...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Banner: Not enrolled notification */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(197, 164, 90, 0.12), rgba(13, 74, 56, 0.08))',
          border: '1.5px solid var(--color-gold-primary)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>📖</span>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'var(--color-green-deep)' }}>
              Enroll in Your First Course to Unlock Quran Modules &amp; Mistake Tracking
            </h2>
            <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-body)', marginTop: '4px' }}>
              You are currently viewing the course syllabus preview. Select a certified Al-Azhar scholar below and enroll to unlock 
              interactive Uthmani Mushaf recitation, module video lectures, quizzes, and personalized mistake annotation.
            </p>
          </div>
        </div>

        {enrollError && (
          <div className="auth-alert auth-alert-error" style={{ margin: '8px 0 0 0' }}>
            <span>⚠️ {enrollError}</span>
          </div>
        )}

        {enrollSuccessMessage && (
          <div className="auth-alert auth-alert-success" style={{ margin: '8px 0 0 0' }}>
            <span>✨ {enrollSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* Optional Course Selection Bar if Institute Has Multiple Courses */}
      {courses.length > 1 && (
        <div className="dash-panel" style={{ padding: '16px 20px', background: '#FFFFFF' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-gold-deep)' }}>
            Available Courses ({courses.length})
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

      {/* Main Course Hero & Overview */}
      <div className="dash-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: '1 1 500px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  background: 'var(--color-green-surface)',
                  color: 'var(--color-green-primary)',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  border: '1px solid rgba(13,74,56,0.2)',
                }}
              >
                {course.code || 'QI-CRS-001'}
              </span>
              <span
                style={{
                  background: 'var(--color-gold-light)',
                  color: 'var(--color-gold-deep)',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  border: '1px solid var(--color-gold-primary)',
                }}
              >
                {course.category || 'Foundation & Tajweed'}
              </span>
              <span
                style={{
                  background: '#DCFCE7',
                  color: '#166534',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '11.5px',
                  fontWeight: '700',
                }}
              >
                Connected Sanad Accreditation
              </span>
            </div>

            <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--color-green-deep)', margin: '0 0 10px 0', fontFamily: 'var(--font-serif)' }}>
              {course.title}
            </h1>
            <p style={{ fontSize: '14.5px', color: 'var(--text-body)', lineHeight: '1.6', margin: 0 }}>
              {course.description}
            </p>

            <div style={{ display: 'flex', gap: '20px', marginTop: '18px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
                <span>📚</span>
                <span><strong>{course.modules?.length || 6}</strong> Progressive Modules</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
                <span>🎙️</span>
                <span><strong>18+</strong> Practical Recitation Lessons</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
                <span>🎯</span>
                <span><strong>Interactive</strong> Quran Mistake Annotator</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
                <span>📜</span>
                <span><strong>Sanad</strong> Ijazah Verification</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TEACHER SELECTION & ENROLLMENT ACTION */}
      <div
        className="dash-panel"
        style={{
          border: '2px solid var(--color-gold-primary)',
          boxShadow: '0 10px 25px -5px rgba(197, 164, 90, 0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 className="dash-panel-title" style={{ margin: 0, fontSize: '18px' }}>
              <Icon name="sparkles" size={18} color="#C5A45A" />
              <span>Step 1: Choose Your Certified Lead Scholar</span>
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Your assigned teacher will personally review your Quran recitations, mark mistakes on your personal Mushaf, and conduct 1-on-1 sessions.
            </p>
          </div>

          <span
            style={{
              fontSize: '12px',
              fontWeight: '700',
              color: 'var(--color-green-primary)',
              background: 'var(--color-green-surface)',
              padding: '4px 12px',
              borderRadius: '999px',
              border: '1px solid rgba(13,74,56,0.15)',
            }}
          >
            {teachers.length} Verified Scholars Available
          </span>
        </div>

        {/* Teacher Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '14px',
            marginBottom: '20px',
          }}
        >
          {teachers.map((teacher) => {
            const isSelected = selectedTeacherId === teacher.id;
            return (
              <div
                key={teacher.id}
                onClick={() => setSelectedTeacherId(teacher.id)}
                style={{
                  border: isSelected ? '2px solid var(--color-green-primary)' : '1px solid var(--border-light)',
                  background: isSelected ? 'var(--color-green-surface)' : '#FFFFFF',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: isSelected ? 'var(--color-green-primary)' : 'var(--color-gold-light)',
                        color: isSelected ? '#FFFFFF' : 'var(--color-gold-deep)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        fontWeight: '700',
                      }}
                    >
                      {teacher.avatar || '🕌'}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '16.5px', fontWeight: '800', color: 'var(--color-green-deep)' }}>
                        {teacher.name}
                      </h3>
                      <span style={{ fontSize: '12.5px', color: 'var(--color-gold-deep)', fontWeight: '700' }}>
                        {teacher.status || 'Verified Scholar'}
                      </span>
                    </div>
                  </div>

                  <input
                    type="radio"
                    name="teacherSelect"
                    checked={isSelected}
                    onChange={() => setSelectedTeacherId(teacher.id)}
                    style={{ accentColor: 'var(--color-green-primary)', width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ fontSize: '13.5px', color: 'var(--text-body)', lineHeight: '1.45', marginTop: '6px' }}>
                  <strong>Certification:</strong> {teacher.sanadCertification || 'Connected Sanad in 10 Qira’at'}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)', borderTop: '1px dashed var(--border-light)', paddingTop: '8px' }}>
                  <span>{teacher.specialization || 'Tajweed & Hifz'}</span>
                  <span>{teacher.yearsExperience || '10+ yrs experience'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enroll Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', borderTop: '1.5px solid var(--border-light)', paddingTop: '18px' }}>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Selected Instructor:</span>
            <p style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--color-green-primary)' }}>
              {selectedTeacher?.name || 'Dr. Sheikh Ahmad Al-Azhari'}
            </p>
          </div>

          <button
            onClick={handleEnroll}
            disabled={enrolling}
            className="btn-auth-submit"
            style={{
              margin: 0,
              padding: '15px 32px',
              fontSize: '16px',
              width: 'auto',
              background: 'linear-gradient(135deg, #0D4A38 0%, #062A1F 100%)',
              color: '#FFDF85',
              borderColor: 'var(--color-gold-primary)',
              cursor: enrolling ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span>✨</span>
            <span>{enrolling ? 'Enrolling in Sanctuary...' : `Enroll Now with ${selectedTeacher?.name?.split(' ')[0] || 'Teacher'}`}</span>
          </button>
        </div>
      </div>

      {/* CURRICULUM MODULES PREVIEW (LOCKED LESSONS) */}
      <div className="dash-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 className="dash-panel-title" style={{ margin: 0 }}>
              <Icon name="book" size={18} color="#0D4A38" />
              <span>Course Syllabus Preview ({(course.modules?.length || 0)} Progressive Modules)</span>
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Here is the complete syllabus designed by Al-Azhar scholars. Enroll above to unlock full lesson player and recitation tests.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {(!course.modules || course.modules.length === 0) && (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
              Curriculum modules are currently being prepared by the scholar.
            </div>
          )}
          {course.modules?.map((mod, idx) => {
              const isExpanded = expandedModuleId === mod.id;
              return (
                <div
                  key={mod.id}
                  style={{
                    border: isExpanded ? '1.5px solid var(--color-green-primary)' : '1px solid var(--border-light)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                  background: '#FFFFFF',
                }}
              >
                {/* Module Header */}
                <div
                  onClick={() => setExpandedModuleId(isExpanded ? null : mod.id)}
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    background: isExpanded ? 'var(--color-green-surface)' : '#FAFAF9',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'var(--color-gold-light)',
                        color: 'var(--color-gold-deep)',
                        fontWeight: '800',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--color-gold-primary)',
                      }}
                    >
                      {idx + 1}
                    </div>

                    <div>
                      <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: 'var(--color-green-deep)' }}>
                        {mod.title}
                      </h3>
                      <p style={{ margin: '2px 0 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                        {mod.description}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
                      {mod.lessons?.length || 0} Lessons • {mod.duration || '2 Weeks'}
                    </span>
                    <span style={{ fontSize: '14px', color: 'var(--color-green-primary)' }}>
                      {isExpanded ? '▲' : '▼'}
                    </span>
                  </div>
                </div>

                {/* Module Lessons Preview (Locked) */}
                {isExpanded && (
                  <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-light)', background: '#FFFFFF' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {mod.lessons?.map((les, lIdx) => (
                        <div
                          key={les.id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px 14px',
                            background: '#F9FAFB',
                            borderRadius: '8px',
                            border: '1px solid var(--border-light)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>
                              {idx + 1}.{lIdx + 1}
                            </span>
                            <div>
                              <div style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-main)' }}>
                                {les.title}
                              </div>
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                {les.objective}
                              </div>
                            </div>
                          </div>

                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              background: '#F3F4F6',
                              color: '#6B7280',
                              padding: '4px 10px',
                              borderRadius: '999px',
                              fontSize: '11.5px',
                              fontWeight: '700',
                            }}
                          >
                            <span>🔒</span>
                            <span>Locked</span>
                          </div>
                        </div>
                      ))}

                      {mod.assessment && (
                        <div
                          style={{
                            padding: '12px 14px',
                            background: 'var(--color-gold-light)',
                            borderRadius: '8px',
                            border: '1px dashed var(--color-gold-primary)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>📝</span>
                            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-green-deep)' }}>
                              {mod.assessment.title}
                            </span>
                          </div>
                          <span style={{ fontSize: '11.5px', color: 'var(--color-gold-deep)', fontWeight: '700' }}>
                            🔒 Passing Score: {mod.assessment.passingScore}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
