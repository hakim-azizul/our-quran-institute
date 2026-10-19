'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icons';

export default function AdminCourseCurriculumModal({
  isOpen = false,
  onClose,
  course = null,
  onOpenAssignTeacher = null,
}) {
  const [mounted, setMounted] = useState(false);
  const [expandedModuleId, setExpandedModuleId] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (course?.modules?.[0]?.id) {
      setExpandedModuleId(course.modules[0].id);
    }
  }, [course]);

  if (!isOpen || !course) return null;

  const modules = course.modules || [];
  const totalLessons = modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0);

  const modalContent = (
    <div
      className="admin-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 24, 18, 0.76)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeInModal 0.2s ease-out',
      }}
    >
      <div
        className="admin-curriculum-modal-box"
        style={{
          width: '100%',
          maxWidth: '880px',
          maxHeight: '90vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(13, 74, 56, 0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'scaleInModal 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: '#0D4A38',
            borderBottom: '2px solid #D4AF37',
            padding: '24px 30px',
            color: '#FFFFFF',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '14px',
                  background: 'rgba(212, 175, 55, 0.16)',
                  border: '1.5px solid rgba(212, 175, 55, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D4AF37',
                  flexShrink: 0,
                }}
              >
                <Icon name="book-open" size={26} />
              </div>
              <div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    color: '#D4AF37',
                    display: 'block',
                    marginBottom: '2px',
                  }}
                >
                  Academic Syllabus &amp; Curriculum Structure
                </span>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '22px',
                    fontFamily: 'var(--font-cormorant), Georgia, serif',
                    fontWeight: '700',
                    color: '#FFFFFF',
                  }}
                >
                  {course.title}
                </h2>
                {course.arabicTitle && (
                  <div
                    dir="rtl"
                    style={{
                      fontSize: '16px',
                      color: '#E6D5AC',
                      fontFamily: 'var(--font-cormorant), Traditional Arabic, serif',
                      marginTop: '4px',
                    }}
                  >
                    {course.arabicTitle}
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: 'none',
                color: '#FFFFFF',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              aria-label="Close modal"
            >
              <Icon name="x" size={16} />
            </button>
          </div>
        </div>

        {/* Top Meta Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            padding: '16px 30px',
            backgroundColor: '#F8FAF9',
            borderBottom: '1px solid #E5E9E7',
          }}
        >
          <div style={{ padding: '8px 12px', background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Faculty Scholar</div>
            <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#0D4A38', marginTop: '2px' }}>{course.teacherName}</div>
          </div>

          <div style={{ padding: '8px 12px', background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Proficiency Level</div>
            <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#0D4A38', marginTop: '2px' }}>{course.level}</div>
          </div>

          <div style={{ padding: '8px 12px', background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Modules &amp; Lessons</div>
            <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#0D4A38', marginTop: '2px' }}>
              {modules.length} Modules • {totalLessons} Lessons
            </div>
          </div>

          <div style={{ padding: '8px 12px', background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Passing Standard</div>
            <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#0D4A38', marginTop: '2px' }}>
              {course.passingGrade || 80}% Grade Threshold
            </div>
          </div>
        </div>

        {/* Modules Accordion List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 30px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: '#0D4A38', letterSpacing: '0.5px' }}>
            Course Instructional Modules ({modules.length})
          </div>

          {modules.map((mod, idx) => {
            const isExpanded = expandedModuleId === mod.id;
            return (
              <div
                key={mod.id || idx}
                style={{
                  border: isExpanded ? '1.5px solid #0D4A38' : '1px solid #E2E8F0',
                  borderRadius: '14px',
                  backgroundColor: '#FFFFFF',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  boxShadow: isExpanded ? '0 4px 14px rgba(13, 74, 56, 0.08)' : 'none',
                }}
              >
                {/* Module Trigger */}
                <button
                  type="button"
                  onClick={() => setExpandedModuleId(isExpanded ? null : mod.id)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: isExpanded ? '#F0FDF4' : '#FFFFFF',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: isExpanded ? '#0D4A38' : '#F1F5F9',
                        color: isExpanded ? '#FFFFFF' : '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: '800',
                      }}
                    >
                      {mod.moduleNumber || idx + 1}
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A' }}>
                        {mod.title}
                      </div>
                      {mod.arabicTitle && (
                        <div
                          dir="rtl"
                          style={{
                            fontSize: '13px',
                            color: '#0D4A38',
                            fontFamily: 'var(--font-cormorant), Traditional Arabic, serif',
                            marginTop: '2px',
                          }}
                        >
                          {mod.arabicTitle}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        padding: '3px 9px',
                        borderRadius: '999px',
                        background: '#E2E8F0',
                        color: '#475569',
                      }}
                    >
                      {mod.lessons?.length || 0} Lessons
                    </span>
                    <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} size={18} color="#64748B" />
                  </div>
                </button>

                {/* Module Content */}
                {isExpanded && (
                  <div style={{ padding: '16px 20px', borderTop: '1px solid #E2E8F0', backgroundColor: '#FAFBFA' }}>
                    {mod.description && (
                      <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#4B5563', lineHeight: '1.5' }}>
                        {mod.description}
                      </p>
                    )}

                    {/* Lessons list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {mod.lessons?.map((les, lIdx) => (
                        <div
                          key={les.id || lIdx}
                          style={{
                            padding: '12px 16px',
                            background: '#FFFFFF',
                            borderRadius: '10px',
                            border: '1px solid #E2E8F0',
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            gap: '14px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                            <span style={{ marginTop: '2px', color: '#10B981' }}>
                              <Icon name="check-circle" size={15} />
                            </span>
                            <div>
                              <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#1E293B' }}>
                                {les.title}
                              </div>
                              <div style={{ fontSize: '12.5px', color: '#64748B', marginTop: '3px' }}>
                                {les.content}
                              </div>
                              {les.practiceText && (
                                <div
                                  dir="rtl"
                                  style={{
                                    marginTop: '6px',
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    background: '#F0FDF4',
                                    border: '1px solid #DCFCE7',
                                    color: '#0D4A38',
                                    fontSize: '14px',
                                    display: 'inline-block',
                                    fontFamily: 'var(--font-cormorant), Traditional Arabic, serif',
                                  }}
                                >
                                  Practice: {les.practiceText}
                                </div>
                              )}
                            </div>
                          </div>

                          <span
                            style={{
                              fontSize: '11.5px',
                              fontWeight: '600',
                              color: '#64748B',
                              background: '#F1F5F9',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {les.duration || '25 mins'}
                          </span>
                        </div>
                      ))}
                    </div>

                    {mod.quizId && (
                      <div
                        style={{
                          marginTop: '12px',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          background: '#FEF3C7',
                          border: '1px solid #FDE68A',
                          color: '#92400E',
                          fontSize: '12px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <Icon name="award" size={16} color="#92400E" />
                        <span>Module Assessment Exam Linked (Required for Progression)</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 30px',
            backgroundColor: '#F8FAF9',
            borderTop: '1px solid #E5E9E7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontSize: '12.5px', color: '#64748B' }}>
            ID: <strong>{course.id}</strong> • Slug: <code>{course.slug}</code>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {onOpenAssignTeacher && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAssignTeacher(course);
                }}
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  border: '1.5px solid #0D4A38',
                  background: '#FFFFFF',
                  color: '#0D4A38',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Icon name="link" size={14} />
                <span>Reassign Lead Scholar</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 20px',
                borderRadius: '10px',
                border: 'none',
                background: '#0D4A38',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              Close Syllabus
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
}
