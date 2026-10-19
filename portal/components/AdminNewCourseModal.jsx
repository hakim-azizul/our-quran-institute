'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icons';

export default function AdminNewCourseModal({
  isOpen = false,
  onClose,
  teachers = [],
  onCourseCreated,
}) {
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState('');
  const [arabicTitle, setArabicTitle] = useState('');
  const [category, setCategory] = useState('quran');
  const [level, setLevel] = useState('Beginner to Intermediate');
  const [duration, setDuration] = useState('10 Weeks • 20 Lessons • 4 Quizzes');
  const [assignedTeacherId, setAssignedTeacherId] = useState('');
  const [description, setDescription] = useState('');
  const [passingGrade, setPassingGrade] = useState(80);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (teachers.length > 0 && !assignedTeacherId) {
      setAssignedTeacherId(teachers[0].id);
    }
  }, [teachers, assignedTeacherId]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Course title is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');

      const selectedTeacher = teachers.find((t) => t.id === assignedTeacherId) || teachers[0];

      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          arabicTitle: arabicTitle.trim(),
          category,
          level,
          totalDuration: duration,
          assignedTeacherId: selectedTeacher?.id || 'QI-FAC-014',
          teacherName: selectedTeacher?.name || 'Dr. Sheikh Ahmad Al-Azhari',
          description: description.trim(),
          passingGrade: Number(passingGrade) || 80,
          thumbnail: '/assets/hero_stand_book.png',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (onCourseCreated) {
          onCourseCreated(data.course);
        }
        // Reset form
        setTitle('');
        setArabicTitle('');
        setDescription('');
        onClose();
      } else {
        setErrorMsg(data.error || 'Failed to create course.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error while creating course.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <div
      className="admin-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
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
        className="admin-new-course-modal-box"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '92vh',
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
            padding: '22px 28px',
            color: '#FFFFFF',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(212, 175, 55, 0.16)',
                  border: '1.5px solid rgba(212, 175, 55, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D4AF37',
                  flexShrink: 0,
                }}
              >
                <Icon name="book-open" size={24} />
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
                  Curriculum Authoring Console
                </span>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '20px',
                    fontFamily: 'var(--font-cormorant), Georgia, serif',
                    fontWeight: '700',
                    color: '#FFFFFF',
                  }}
                >
                  Author &amp; Provision New Academic Course
                </h2>
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', marginTop: '2px' }}>
                  Create structured modules, assign lead faculty scholar, and publish to the student curriculum.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
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

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: '24px 28px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          {/* Row 1: English Title */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: '#1E293B',
                marginBottom: '6px',
              }}
            >
              Course Title (English) *
            </label>
            <input
              type="text"
              placeholder="e.g. Advanced Hifz Retention & Mutashabihat Mastery"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '11px 14px',
                fontSize: '14px',
                borderRadius: '10px',
                border: '1.5px solid #CBD5E1',
                outline: 'none',
              }}
            />
          </div>

          {/* Row 2: Arabic Title */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: '#1E293B',
                marginBottom: '6px',
              }}
            >
              Course Title (Sacred Arabic Calligraphy)
            </label>
            <input
              type="text"
              dir="rtl"
              placeholder="e.g. إِتْقَانُ الحِفْظِ وَضَبْطُ المُتَشَابِهَاتِ"
              value={arabicTitle}
              onChange={(e) => setArabicTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                fontSize: '15px',
                borderRadius: '10px',
                border: '1.5px solid #CBD5E1',
                outline: 'none',
                fontFamily: 'var(--font-cormorant), Traditional Arabic, serif',
              }}
            />
          </div>

          {/* Row 3: Category & Level */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: '#1E293B',
                  marginBottom: '6px',
                }}
              >
                Track Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  fontSize: '13.5px',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                }}
              >
                <option value="quran">Holy Quran Recitation &amp; Hifz</option>
                <option value="tajweed">Tajweed Phonetics &amp; Sanad</option>
                <option value="arabic">Classical Arabic &amp; Grammar</option>
                <option value="islamic_studies">Islamic Studies &amp; Hadith</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: '#1E293B',
                  marginBottom: '6px',
                }}
              >
                Target Proficiency Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  fontSize: '13.5px',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                }}
              >
                <option value="Beginner">Beginner (Noorani Qaida &amp; Basics)</option>
                <option value="Beginner to Fluent">Beginner to Fluent</option>
                <option value="Intermediate">Intermediate (Tajweed Application)</option>
                <option value="Advanced">Advanced (Sanad &amp; 10 Qira’at)</option>
              </select>
            </div>
          </div>

          {/* Row 4: Lead Faculty Scholar & Duration */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: '#1E293B',
                  marginBottom: '6px',
                }}
              >
                Lead Faculty Scholar
              </label>
              <select
                value={assignedTeacherId}
                onChange={(e) => setAssignedTeacherId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  fontSize: '13.5px',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                }}
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.specialization ? t.specialization.split(',')[0] : t.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: '#1E293B',
                  marginBottom: '6px',
                }}
              >
                Curriculum Scope &amp; Duration
              </label>
              <input
                type="text"
                placeholder="e.g. 12 Weeks • 24 Lessons • 6 Exams"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  fontSize: '13.5px',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Row 5: Course Description */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: '#1E293B',
                marginBottom: '6px',
              }}
            >
              Academic Overview &amp; Learning Outcomes
            </label>
            <textarea
              rows={3}
              placeholder="Outline the course objectives, memorization milestones, and recitation mastery students will achieve..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                fontSize: '13.5px',
                borderRadius: '10px',
                border: '1.5px solid #CBD5E1',
                outline: 'none',
                resize: 'vertical',
                lineHeight: '1.5',
              }}
            />
          </div>

          {errorMsg && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: '#FEE2E2',
                border: '1px solid #FCA5A5',
                color: '#991B1B',
                fontSize: '12.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Icon name="alert-triangle" size={15} color="#991B1B" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Footer Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '12px',
              marginTop: '8px',
              paddingTop: '14px',
              borderTop: '1px solid #E2E8F0',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: '10px 18px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                background: '#FFFFFF',
                color: '#4B5563',
                fontSize: '13.5px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '10px 22px',
                borderRadius: '10px',
                border: '1px solid #D4AF37',
                background: '#0D4A38',
                color: '#FFFFFF',
                fontSize: '13.5px',
                fontWeight: '700',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(13, 74, 56, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {isSubmitting ? (
                <>
                  <Icon name="loader" size={16} />
                  <span>Authoring Course...</span>
                </>
              ) : (
                <>
                  <Icon name="plus" size={16} />
                  <span>Provision &amp; Publish Course</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
}
