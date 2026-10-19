'use client';

import React, { useState, useEffect } from 'react';
import { QURAN_SURAHS } from '../lib/quranData';
import { Icon } from './Icons';
import SurahSearchSelect from './SurahSearchSelect';

export default function InteractiveQuranAnnotator({
  currentUser,
  studentsList = [],
  studentList,
  selectedStudentId,
  initialStudentId,
  onSelectStudent,
  course,
  coursesList = [],
}) {
  const isTeacherOrAdmin = currentUser?.role === 'teacher' || currentUser?.role === 'admin';
  const isParent = currentUser?.role === 'parent';
  const isStudent = currentUser?.role === 'student';

  // Normalize student list from either studentsList or studentList prop, with realistic fallbacks
  const normalizedStudentsList = React.useMemo(() => {
    const list = (studentsList && studentsList.length > 0)
      ? studentsList
      : (studentList && studentList.length > 0)
      ? studentList
      : [];

    if (list.length > 0) {
      return list.map((s) => ({
        id: s.id || s.studentId,
        studentId: s.studentId || s.id,
        name: s.name || s.studentName,
        courseId: s.courseId || 'QI-CRS-001',
        courseTitle: s.courseTitle || 'Quran Reading Foundation & Tajweed Mastery',
        activeMistakesCount: s.activeMistakesCount || 0,
        resolvedMistakesCount: s.resolvedMistakesCount || 0,
      }));
    }

    if (isTeacherOrAdmin) {
      return [
        { id: 'QI-STU-8842', studentId: 'QI-STU-8842', name: 'Tariq Al-Mansoor', courseId: 'QI-CRS-001', courseTitle: 'Quran Reading Foundation & Tajweed Mastery' },
        { id: 'QI-STU-9904', studentId: 'QI-STU-9904', name: 'Maryam Al-Qasim', courseId: 'QI-CRS-001', courseTitle: 'Quran Reading Foundation & Tajweed Mastery' },
        { id: 'QI-STU-7721', studentId: 'QI-STU-7721', name: 'Zaid bin Harith', courseId: 'QI-CRS-001', courseTitle: 'Quran Reading Foundation & Tajweed Mastery' },
      ];
    }

    if (isParent) {
      return [
        { id: 'QI-STU-8842', studentId: 'QI-STU-8842', name: 'Tariq Al-Mansoor (Child)', courseId: 'QI-CRS-001', courseTitle: 'Quran Reading Foundation & Tajweed Mastery' },
        { id: 'QI-STU-7721', studentId: 'QI-STU-7721', name: 'Zaid bin Harith (Child)', courseId: 'QI-CRS-001', courseTitle: 'Quran Reading Foundation & Tajweed Mastery' },
      ];
    }

    return [{
      id: currentUser?.id || 'QI-STU-8842',
      studentId: currentUser?.id || 'QI-STU-8842',
      name: currentUser?.name || 'Tariq Al-Mansoor',
      courseId: course?.id || 'QI-CRS-001',
      courseTitle: course?.title || 'Quran Reading Foundation & Tajweed Mastery',
    }];
  }, [studentsList, studentList, currentUser, isTeacherOrAdmin, isParent, course]);

  // Determine active student ID
  const defaultStudentId = isStudent
    ? (currentUser?.id || 'QI-STU-8842')
    : selectedStudentId || initialStudentId || normalizedStudentsList[0]?.id || normalizedStudentsList[0]?.studentId || 'QI-STU-8842';

  const [activeStudentId, setActiveStudentId] = useState(defaultStudentId);

  // Sync when selectedStudentId / initialStudentId updates from parent
  useEffect(() => {
    const nextId = selectedStudentId || initialStudentId;
    if (nextId && nextId !== activeStudentId) {
      setActiveStudentId(nextId);
    }
  }, [selectedStudentId, initialStudentId]);

  const effectiveStudentId = isStudent ? (currentUser?.id || 'QI-STU-8842') : activeStudentId;

  // Find metadata for currently active student
  const currentStudent = normalizedStudentsList.find(
    (s) => (s.id || s.studentId) === effectiveStudentId
  ) || {
    id: effectiveStudentId,
    studentId: effectiveStudentId,
    name: effectiveStudentId === 'QI-STU-8842'
      ? 'Tariq Al-Mansoor'
      : effectiveStudentId === 'QI-STU-9904'
      ? 'Maryam Al-Qasim'
      : effectiveStudentId === 'QI-STU-7721'
      ? 'Zaid bin Harith'
      : (effectiveStudentId === currentUser?.id ? currentUser.name : `Student ${effectiveStudentId}`),
    courseTitle: course?.title || 'Quran Reading Foundation & Tajweed Mastery',
  };

  // Quran Course Check: Ensure this feature is exclusively for Quran courses
  const activeCourse = course || (coursesList && coursesList.find((c) => c.id === currentStudent.courseId)) || {
    id: currentStudent.courseId || 'QI-CRS-001',
    category: 'quran',
    title: currentStudent.courseTitle || 'Quran Reading Foundation & Tajweed Mastery',
  };

  const isQuranCourseActive = (() => {
    if (!activeCourse) return true;
    const cat = (activeCourse.category || '').toLowerCase();
    if (cat === 'quran' || cat === 'tajweed' || cat === 'hifz') return true;
    if (cat === 'arabic' || cat === 'islamic_studies') return false;
    const title = (activeCourse.title || '').toLowerCase();
    if (title.includes('arabic') && !title.includes('quran')) return false;
    return (
      title.includes('quran') ||
      title.includes('tajweed') ||
      title.includes('hifz') ||
      title.includes('mushaf') ||
      activeCourse.id === 'QI-CRS-001'
    );
  })();

  const [activeSurahNumber, setActiveSurahNumber] = useState(1);
  const [mistakes, setMistakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('mushaf'); // 'mushaf' | 'mistake_log' | 'resolved_history'

  // Teacher Flagging Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetAyah, setTargetAyah] = useState(null);
  const [targetWord, setTargetWord] = useState(null);
  const [category, setCategory] = useState('tajweed_rule');
  const [severity, setSeverity] = useState('major');
  const [categoryLabel, setCategoryLabel] = useState('Madd Duration Deviation');
  const [correctionNote, setCorrectionNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resolution Modal State
  const [resolveTargetMistake, setResolveTargetMistake] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('Recited accurately in live session. Mashallah!');

  // Selected Mistake Drawer View
  const [activeSelectedMistake, setActiveSelectedMistake] = useState(null);

  // Fetch mistakes for effective student
  const fetchMistakes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/quran/mistakes?studentId=${effectiveStudentId}`);
      const data = await res.json();
      if (data.success) {
        setMistakes(data.mistakes || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (effectiveStudentId) {
      fetchMistakes();
    }
  }, [effectiveStudentId]);

  const activeSurah = QURAN_SURAHS.find((s) => s.number === activeSurahNumber) || QURAN_SURAHS[0];

  // Helper to find mistake for a word or ayah
  const getWordMistake = (ayahNum, wordIdx) => {
    return mistakes.find(
      (m) =>
        m.surahNumber === activeSurahNumber &&
        m.ayahNumber === ayahNum &&
        (m.wordIndex === wordIdx || m.wordIndex === null) &&
        m.status === 'active'
    );
  };

  const getResolvedWordMistake = (ayahNum, wordIdx) => {
    return mistakes.find(
      (m) =>
        m.surahNumber === activeSurahNumber &&
        m.ayahNumber === ayahNum &&
        (m.wordIndex === wordIdx || m.wordIndex === null) &&
        m.status === 'resolved'
    );
  };

  // Teacher opens flag modal
  const handleOpenFlagModal = (ayah, word = null) => {
    if (!isTeacherOrAdmin) return;
    setTargetAyah(ayah);
    setTargetWord(word);
    setCategory('tajweed_rule');
    setSeverity('major');
    setCategoryLabel(word ? `Recitation slip on "${word.text}"` : `Recitation slip in Ayah ${ayah.number}`);
    setCorrectionNote('');
    setIsModalOpen(true);
  };

  // Submit new mistake flag
  const handleSubmitMistake = async (e) => {
    e.preventDefault();
    if (!effectiveStudentId || !targetAyah) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/quran/mistakes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: effectiveStudentId,
          surahNumber: activeSurahNumber,
          ayahNumber: targetAyah.number,
          wordIndex: targetWord?.wordIndex || null,
          wordText: targetWord?.text || '',
          mistakeCategory: category,
          categoryLabel,
          severity,
          correctionNote,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchMistakes();
      } else {
        alert(data.error || 'Failed to add mistake note.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Teacher resolves a mistake
  const handleResolveMistake = async (mistakeId) => {
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
        setResolveTargetMistake(null);
        setActiveSelectedMistake(null);
        fetchMistakes();
      } else {
        alert(data.error || 'Failed to resolve mistake.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Teacher deletes a mistake flag
  const handleDeleteMistake = async (mistakeId) => {
    if (!confirm('Are you sure you want to withdraw this recitation marker?')) return;
    try {
      const res = await fetch(`/api/quran/mistakes?id=${mistakeId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setActiveSelectedMistake(null);
        fetchMistakes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const activeMistakes = (mistakes || []).filter((m) => m.status === 'active');
  const resolvedMistakes = (mistakes || []).filter((m) => m.status === 'resolved');
  const handleStudentSwitch = (newStuId) => {
    setActiveStudentId(newStuId);
    if (onSelectStudent) {
      onSelectStudent(newStuId);
    }
  };

  // IF NOT A QURAN COURSE: Render clean gatekeeper card
  if (!isQuranCourseActive) {
    return (
      <div
        style={{
          background: 'var(--color-white)',
          border: '1.5px solid var(--border-medium)',
          borderRadius: '16px',
          padding: '40px 32px',
          textAlign: 'center',
          maxWidth: '720px',
          margin: '30px auto',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--color-gold-light)',
            border: '1.5px solid var(--color-gold-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
          }}
        >
          <Icon name="book-open" size={32} color="var(--color-gold-deep)" />
        </div>
        <span
          style={{
            display: 'inline-block',
            fontSize: '11px',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '4px 12px',
            borderRadius: '999px',
            background: 'rgba(197, 164, 90, 0.15)',
            color: 'var(--color-gold-deep)',
            marginBottom: '12px',
          }}
        >
          Quran Courses Only
        </span>
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '26px',
            fontWeight: '700',
            color: 'var(--color-green-deep)',
            marginBottom: '10px',
          }}
        >
          Interactive Mushaf &amp; Recitation Mistake Tracker
        </h2>
        <p
          style={{
            fontSize: '14.5px',
            color: 'var(--text-muted)',
            lineHeight: '1.6',
            maxWidth: '560px',
            margin: '0 auto 24px auto',
          }}
        >
          This recitation mistake marking tool is exclusively designed for students enrolled in
          <strong> Holy Quran Reading, Tajweed, and Hifz Memorization programs</strong>.
        </p>

        <div
          style={{
            background: 'var(--bg-canvas-subtle)',
            border: '1px solid var(--border-light)',
            borderRadius: '12px',
            padding: '16px 20px',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span style={{ color: 'var(--text-dim)' }}>Selected Student:</span>
            <strong style={{ color: 'var(--color-green-deep)' }}>
              {currentStudent.name} ({effectiveStudentId})
            </strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span style={{ color: 'var(--text-dim)' }}>Active Course:</span>
            <strong style={{ color: 'var(--color-gold-deep)' }}>
              {activeCourse.title} (Academic / Language Track)
            </strong>
          </div>
        </div>

        {isTeacherOrAdmin && normalizedStudentsList.length > 0 && (
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--color-green-deep)' }}>
              Switch to a student enrolled in a Quran recitation course:
            </span>
            <select
              value={effectiveStudentId}
              onChange={(e) => handleStudentSwitch(e.target.value)}
              className="form-input form-select"
              style={{ padding: '8px 32px 8px 14px', fontSize: '13.5px', fontWeight: '700' }}
            >
              {normalizedStudentsList.map((stu) => {
                const sId = stu.id || stu.studentId;
                return (
                  <option key={sId} value={sId}>
                    {stu.name} ({sId}) — {stu.courseTitle || 'Quran Reading Foundation'}
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header bar */}
      <div
        style={{
          background: 'var(--color-white)',
          border: '1.5px solid var(--border-medium)',
          borderRadius: '16px',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <Icon name="book-open" size={26} color="var(--color-green-primary)" />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: '700', color: 'var(--color-green-primary)' }}>
              Interactive Mushaf &amp; Recitation Mistake Tracker
            </h2>
            <span
              style={{
                fontSize: '11px',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                padding: '3px 10px',
                borderRadius: '999px',
                background: 'var(--color-green-light)',
                border: '1px solid var(--color-green-mint)',
                color: 'var(--color-green-deep)',
              }}
            >
              Quran Course Exclusive
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {isTeacherOrAdmin
              ? 'Click any Arabic Ayah or word to flag a recitation error with scholarly guidance. Each student maintains an independent mistake map.'
              : 'Review your teacher’s real-time Tajweed notes directly on the Holy Quran verses to target your practice.'}
          </p>
        </div>

        {/* Dedicated Student Selector & Mistakes Counter Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {isTeacherOrAdmin && normalizedStudentsList.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--color-green-surface)', padding: '8px 14px', borderRadius: '12px', border: '1.5px solid var(--border-medium)' }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-green-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Annotating Student:
              </span>
              <select
                value={effectiveStudentId}
                onChange={(e) => handleStudentSwitch(e.target.value)}
                className="form-input form-select"
                style={{ width: 'auto', padding: '6px 28px 6px 12px', fontSize: '13px', fontWeight: '700' }}
              >
                {normalizedStudentsList.map((stu) => {
                  const sId = stu.id || stu.studentId;
                  return (
                    <option key={sId} value={sId}>
                      {stu.name} ({sId})
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {isParent && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--color-green-surface)', padding: '8px 14px', borderRadius: '12px', border: '1.5px solid var(--border-medium)' }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-green-primary)' }}>
                Child:
              </span>
              <select
                value={effectiveStudentId}
                onChange={(e) => handleStudentSwitch(e.target.value)}
                className="form-input form-select"
                style={{ width: 'auto', padding: '6px 28px 6px 12px', fontSize: '13px', fontWeight: '700' }}
              >
                <option value="QI-STU-8842">Tariq Al-Mansoor</option>
                <option value="QI-STU-7721">Zaid bin Harith</option>
              </select>
            </div>
          )}

          {/* Student Dossier Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 14px',
              background: '#FFFFFF',
              border: '1px solid var(--border-medium)',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(13, 74, 56, 0.05)',
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-green-deep)' }}>
              {currentStudent.name}
            </span>
            <span
              style={{
                fontSize: '12px',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '6px',
                background: activeMistakes.length > 0 ? '#FEE2E2' : '#DCFCE7',
                color: activeMistakes.length > 0 ? '#991B1B' : '#166534',
                border: activeMistakes.length > 0 ? '1px solid #FCA5A5' : '1px solid #86EFAC',
              }}
            >
              {activeMistakes.length} Active {activeMistakes.length === 1 ? 'Slip' : 'Slips'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs & Surah Picker */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('mushaf')}
            className="btn-table-action"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: '700',
              background: activeTab === 'mushaf' ? 'var(--color-green-primary)' : 'var(--color-white)',
              color: activeTab === 'mushaf' ? '#FFFFFF' : 'var(--text-body)',
              borderColor: activeTab === 'mushaf' ? 'var(--color-gold-primary)' : 'var(--border-light)',
            }}
          >
            <Icon name="book-open" size={15} color="currentColor" />
            <span>Interactive Quran View</span>
          </button>
          <button
            onClick={() => setActiveTab('mistake_log')}
            className="btn-table-action"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              fontSize: '14px',
              fontWeight: '700',
              background: activeTab === 'mistake_log' ? 'var(--color-green-primary)' : 'var(--color-white)',
              color: activeTab === 'mistake_log' ? '#FFFFFF' : 'var(--text-body)',
              borderColor: activeTab === 'mistake_log' ? 'var(--color-gold-primary)' : 'var(--border-light)',
            }}
          >
            <Icon name="alert-circle" size={15} color="currentColor" />
            <span>Needs Revision ({activeMistakes.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('resolved_history')}
            className="btn-table-action"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              fontSize: '14px',
              fontWeight: '700',
              background: activeTab === 'resolved_history' ? 'var(--color-green-primary)' : 'var(--color-white)',
              color: activeTab === 'resolved_history' ? '#FFFFFF' : 'var(--text-body)',
              borderColor: activeTab === 'resolved_history' ? 'var(--color-gold-primary)' : 'var(--border-light)',
            }}
          >
            <Icon name="check-circle" size={15} color="currentColor" />
            <span>Cleared Milestones ({resolvedMistakes.length})</span>
          </button>
        </div>

        {/* Surah Dropdown Selector with Instant Live Search & 114 Surahs */}
        {activeTab === 'mushaf' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>
              Surah:
            </span>
            <SurahSearchSelect
              selectedSurahNumber={activeSurahNumber}
              onSelectSurah={(num) => setActiveSurahNumber(num)}
              align="right"
            />
          </div>
        )}
      </div>

      {/* Main Tab Content 1: Interactive Mushaf Display */}
      {activeTab === 'mushaf' && (
        <div
          style={{
            background: 'var(--color-white)',
            border: '2px solid var(--color-gold-primary)',
            borderRadius: '20px',
            padding: '36px 32px',
            boxShadow: 'var(--shadow-elevated)',
            position: 'relative',
          }}
        >
          {/* Surah Header Title Ribbon */}
          <div
            style={{
              textAlign: 'center',
              borderBottom: '2px dashed var(--color-gold-border)',
              paddingBottom: '24px',
              marginBottom: '28px',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 16px',
                background: 'var(--color-gold-light)',
                border: '1px solid var(--color-gold-primary)',
                borderRadius: '999px',
                color: 'var(--color-gold-deep)',
                fontSize: '12px',
                fontWeight: '700',
                marginBottom: '8px',
              }}
            >
              <span>{activeSurah.revelationType} Revelation</span>
              <span>•</span>
              <span>{activeSurah.ayahCount} Verses</span>
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-arabic)',
                fontSize: '44px',
                color: 'var(--color-green-primary)',
                fontWeight: '700',
                margin: '6px 0',
                letterSpacing: '0.02em',
              }}
            >
              سُورَةُ {activeSurah.arabicName}
            </h3>

            <span style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-muted)' }}>
              {activeSurah.name} ({activeSurah.englishName})
            </span>

            {activeSurah.bismillah && (
              <div
                style={{
                  fontFamily: 'var(--font-arabic)',
                  fontSize: '32px',
                  color: 'var(--color-green-primary)',
                  marginTop: '16px',
                }}
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>
            )}
          </div>

          {/* Verses Container */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {activeSurah.ayahs.map((ayah) => {
              const ayahActiveMistakes = mistakes.filter(
                (m) =>
                  m.surahNumber === activeSurahNumber &&
                  m.ayahNumber === ayah.number &&
                  m.status === 'active'
              );

              return (
                <div
                  key={ayah.number}
                  style={{
                    background: ayahActiveMistakes.length > 0 ? '#FFFBEB' : '#FAFAF8',
                    border: ayahActiveMistakes.length > 0 ? '1.5px solid #FCD34D' : '1px solid var(--border-light)',
                    borderRadius: '16px',
                    padding: '20px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Top Bar for Ayah: Verse Number and Teacher Action */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'var(--color-green-primary)',
                          color: 'var(--color-gold-vibrant)',
                          fontSize: '13.5px',
                          fontWeight: '700',
                        }}
                      >
                        {ayah.number}
                      </span>
                      <span style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-muted)' }}>
                        Ayah {ayah.number} of {activeSurah.ayahCount}
                      </span>
                    </div>

                    {isTeacherOrAdmin && (
                      <button
                        onClick={() => handleOpenFlagModal(ayah)}
                        className="btn-table-action"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '13px',
                          padding: '6px 14px',
                          borderColor: 'var(--color-gold-primary)',
                          color: 'var(--color-green-primary)',
                        }}
                      >
                        <Icon name="flag" size={14} color="var(--color-gold-deep)" />
                        <span>Flag Verse Mistake</span>
                      </button>
                    )}
                  </div>

                  {/* Arabic Text (Word-by-word clickable rendering) */}
                  <div
                    dir="rtl"
                    style={{
                      fontFamily: 'var(--font-arabic)',
                      fontSize: '38px',
                      lineHeight: '2.3',
                      color: 'var(--color-green-deep)',
                      textAlign: 'right',
                      wordSpacing: '6px',
                      padding: '8px 0',
                    }}
                  >
                    {ayah.words ? (
                      ayah.words.map((w) => {
                        const wordMistake = getWordMistake(ayah.number, w.wordIndex);
                        const resolvedMistake = getResolvedWordMistake(ayah.number, w.wordIndex);

                        return (
                          <span
                            key={w.wordIndex}
                            onClick={() => {
                              if (wordMistake) {
                                setActiveSelectedMistake(wordMistake);
                              } else if (isTeacherOrAdmin) {
                                handleOpenFlagModal(ayah, w);
                              }
                            }}
                            title={
                              wordMistake
                                ? `Active Mistake: ${wordMistake.categoryLabel} (Click to inspect)`
                                : isTeacherOrAdmin
                                ? 'Click to mark student mistake on this word'
                                : w.text
                            }
                            style={{
                              display: 'inline-block',
                              padding: '2px 8px',
                              margin: '0 4px',
                              borderRadius: '10px',
                              cursor: wordMistake || isTeacherOrAdmin ? 'pointer' : 'default',
                              background: wordMistake
                                ? wordMistake.severity === 'major'
                                ? '#FEE2E2'
                                  : '#FEF3C7'
                                : resolvedMistake
                                ? '#DCFCE7'
                                : 'transparent',
                              borderBottom: wordMistake
                                ? `3px solid ${wordMistake.severity === 'major' ? '#DC2626' : '#D97706'}`
                                : resolvedMistake
                                ? '2.5px solid #16A34A'
                                : 'none',
                              color: wordMistake
                                ? wordMistake.severity === 'major'
                                  ? '#991B1B'
                                  : '#92400E'
                                : 'inherit',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            {w.text}
                            {wordMistake && (
                              <sup
                                style={{
                                  fontSize: '12px',
                                  marginRight: '2px',
                                  color: wordMistake.severity === 'major' ? '#DC2626' : '#D97706',
                                }}
                              >
                                ●
                              </sup>
                            )}
                          </span>
                        );
                      })
                    ) : (
                      <span>{ayah.textArabic}</span>
                    )}

                    {/* Ayah End Symbol */}
                    <span
                      style={{
                        marginRight: '10px',
                        color: 'var(--color-gold-deep)',
                        fontSize: '30px',
                      }}
                    >
                      ۝{ayah.number}
                    </span>
                  </div>

                  {/* English Translation */}
                  <p
                    style={{
                      fontSize: '16px',
                      color: 'var(--text-body)',
                      lineHeight: '1.65',
                      fontStyle: 'italic',
                      borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                      paddingTop: '12px',
                      margin: 0,
                    }}
                  >
                    "{ayah.textEnglish}"
                  </p>

                  {/* If active mistakes exist on this ayah, display note pill */}
                  {ayahActiveMistakes.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                      {ayahActiveMistakes.map((m) => (
                        <div
                          key={m.id}
                          onClick={() => setActiveSelectedMistake(m)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: m.severity === 'major' ? '#FEF2F2' : '#FFFBEB',
                            border: `1.5px solid ${m.severity === 'major' ? '#F87171' : '#FCD34D'}`,
                            borderRadius: '12px',
                            padding: '10px 14px',
                            cursor: 'pointer',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                              <Icon
                                name="alert-circle"
                                size={18}
                                color={m.severity === 'major' ? '#DC2626' : '#D97706'}
                              />
                            </span>
                            <div>
                              <strong style={{ fontSize: '14px', color: m.severity === 'major' ? '#991B1B' : '#92400E' }}>
                                {m.wordText ? `Word: "${m.wordText}" — ` : ''}{m.categoryLabel}
                              </strong>
                              <p style={{ margin: 0, fontSize: '13px', color: '#4B5563' }}>
                                {m.correctionNote}
                              </p>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--color-green-primary)' }}>
                              Inspect Details →
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Tab Content 2: Needs Revision List */}
      {activeTab === 'mistake_log' && (
        <div className="dash-panel">
          <h3 className="dash-panel-title">
            <Icon name="award" size={18} color="#D97706" />
            <span>Active Recitation Mistakes Requiring Revision</span>
          </h3>

          {activeMistakes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'var(--color-green-surface)',
                  color: 'var(--color-green-primary)',
                  marginBottom: '12px',
                }}
              >
                <Icon name="award" size={28} />
              </div>
              <h4 style={{ color: 'var(--color-green-primary)', fontSize: '18px', fontWeight: '700' }}>
                Masha'Allah! Zero Active Recitation Slips
              </h4>
              <p style={{ fontSize: '13px' }}>
                All flagged verses have been corrected or verified with full Tajweed fluency.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activeMistakes.map((m) => (
                <div
                  key={m.id}
                  style={{
                    background: 'var(--color-white)',
                    border: '1.5px solid var(--border-light)',
                    borderLeft: `5px solid ${m.severity === 'major' ? '#DC2626' : '#D97706'}`,
                    borderRadius: '12px',
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span
                        style={{
                          background: m.severity === 'major' ? '#FEF2F2' : '#FEF3C7',
                          color: m.severity === 'major' ? '#991B1B' : '#92400E',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '700',
                        }}
                      >
                        {m.severity.toUpperCase()} • {m.mistakeCategory.replace('_', ' ').toUpperCase()}
                      </span>
                      <strong style={{ fontSize: '14px', color: 'var(--color-green-deep)' }}>
                        Surah {m.surahName} (Verse {m.ayahNumber})
                      </strong>
                    </div>

                    <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', margin: '4px 0' }}>
                      {m.categoryLabel} {m.wordText ? `on word "${m.wordText}"` : ''}
                    </p>

                    <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: 0 }}>
                      <strong>Scholarly Note:</strong> {m.correctionNote}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {isTeacherOrAdmin && (
                      <button
                        onClick={() => setResolveTargetMistake(m)}
                        className="btn-auth-submit"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          margin: 0,
                          padding: '6px 14px',
                          fontSize: '12px',
                          width: 'auto',
                          background: '#166534',
                          borderColor: '#22C55E',
                        }}
                      >
                        <Icon name="check-circle" size={13} color="#FFFFFF" />
                        <span>Mark Resolved</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setActiveSurahNumber(m.surahNumber);
                        setActiveTab('mushaf');
                      }}
                      className="btn-table-action"
                    >
                      View in Mushaf →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Tab Content 3: Resolved & Cleared History */}
      {activeTab === 'resolved_history' && (
        <div className="dash-panel">
          <h3 className="dash-panel-title">
            <Icon name="check" size={18} color="#166534" />
            <span>Cleared Recitation Milestones (Passed Revisions)</span>
          </h3>

          {resolvedMistakes.length === 0 ? (
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '30px' }}>
              No cleared records yet. Revisions will be archived here once approved by the scholar.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {resolvedMistakes.map((m) => (
                <div
                  key={m.id}
                  style={{
                    background: '#F0FDF4',
                    border: '1.5px solid #86EFAC',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' }}>
                        <Icon name="check-circle" size={11} color="#166534" />
                        RESOLVED &amp; MASTERED
                      </span>
                      <strong style={{ fontSize: '14px', color: 'var(--color-green-deep)' }}>
                        Surah {m.surahName} (Verse {m.ayahNumber}) {m.wordText ? `— Word: "${m.wordText}"` : ''}
                      </strong>
                    </div>

                    <p style={{ fontSize: '12.5px', color: '#166534', margin: '4px 0', fontWeight: '600' }}>
                      {m.resolvedNote || 'Cleared in live classroom recitation.'}
                    </p>

                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Cleared on {new Date(m.resolvedAt).toLocaleDateString()} by {m.teacherName}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setActiveSurahNumber(m.surahNumber);
                      setActiveTab('mushaf');
                    }}
                    className="btn-table-action"
                  >
                    View in Quran →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: Teacher Flagging Mistake Modal */}
      {isModalOpen && (
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
          onClick={() => setIsModalOpen(false)}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: '700', color: 'var(--color-green-primary)' }}>
                <Icon name="flag" size={22} color="var(--color-gold-deep)" />
                <span>Flag Recitation Mistake for {currentStudent.name}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ×
              </button>
            </div>

            {/* Target Summary */}
            <div style={{ background: 'var(--color-green-surface)', border: '1px solid rgba(13, 74, 56, 0.15)', borderRadius: '10px', padding: '12px', marginBottom: '18px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Student &amp; Verse Target:</span>
              <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-green-deep)', margin: '2px 0' }}>
                {currentStudent.name} ({effectiveStudentId}) • Surah {activeSurah.name} • Verse {targetAyah?.number} {targetWord ? `• Word: "${targetWord.text}"` : ''}
              </p>
            </div>

            <form onSubmit={handleSubmitMistake} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Mistake Classification</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-input form-select"
                >
                  <option value="tajweed_rule">Tajweed Rule Slip (Madd, Ghunnah, Qalqalah, Ikhfa, Idgham)</option>
                  <option value="harakah_jaliyy">Major Slip: Harakah / Vowel Misread (اللحن الجلي)</option>
                  <option value="makhraj_letter">Makhraj / Point of Articulation Mispronunciation</option>
                  <option value="hesitation_hifz">Memory Slip / Hesitation / Stumbling (تردد)</option>
                  <option value="waqf_stop">Inappropriate Stopping or Starting (وقف وابتداء)</option>
                </select>
              </div>

              <div className="form-row-two">
                <div className="form-group">
                  <label className="form-label">Severity Level</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="form-input form-select"
                  >
                    <option value="major">Major (Critical - Alters Meaning)</option>
                    <option value="minor">Minor (Tajweed Inaccuracy)</option>
                    <option value="info">Info (Scholarly Advice / Recommendation)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Short Tag / Title</label>
                  <input
                    type="text"
                    required
                    value={categoryLabel}
                    onChange={(e) => setCategoryLabel(e.target.value)}
                    placeholder="e.g. Madd Lazim too short"
                    className="form-input form-input-noicon"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Scholarly Correction Note &amp; Instructions</label>
                <textarea
                  required
                  rows={3}
                  value={correctionNote}
                  onChange={(e) => setCorrectionNote(e.target.value)}
                  placeholder="Detail exact instruction on tongue position, harakah counts, or pronunciation correction..."
                  className="form-input form-input-noicon"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-auth-submit"
                  style={{ margin: 0 }}
                >
                  {isSubmitting ? 'Saving Mistake Marker...' : `Save Flag to ${currentStudent.name}'s Mushaf`}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-table-action"
                  style={{ padding: '0 16px' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Teacher Resolve Confirmation Modal */}
      {resolveTargetMistake && (
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
          onClick={() => setResolveTargetMistake(null)}
        >
          <div
            style={{
              background: 'var(--color-white)',
              border: '2px solid #22C55E',
              borderRadius: '20px',
              maxWidth: '500px',
              width: '100%',
              padding: '28px',
              boxShadow: 'var(--shadow-elevated)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: '700', color: '#166534', marginBottom: '8px' }}>
              <Icon name="check-circle" size={22} color="#166534" />
              <span>Mark Mistake as Cleared &amp; Mastered</span>
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Confirm that {resolveTargetMistake.studentName} has successfully recited this verse with proper Tajweed.
            </p>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Scholarly Commendation / Praise Note</label>
              <input
                type="text"
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                className="form-input form-input-noicon"
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleResolveMistake(resolveTargetMistake.id)}
                className="btn-auth-submit"
                style={{ margin: 0, background: '#166534', borderColor: '#22C55E' }}
              >
                Confirm Resolution
              </button>
              <button
                onClick={() => setResolveTargetMistake(null)}
                className="btn-table-action"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Student/Teacher Inspect Drawer */}
      {activeSelectedMistake && (
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
          onClick={() => setActiveSelectedMistake(null)}
        >
          <div
            style={{
              background: 'var(--color-white)',
              border: '2px solid var(--color-gold-primary)',
              borderRadius: '20px',
              maxWidth: '520px',
              width: '100%',
              padding: '28px',
              boxShadow: 'var(--shadow-elevated)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: activeSelectedMistake.status === 'resolved' ? '#DCFCE7' : '#FEF3C7',
                    color: activeSelectedMistake.status === 'resolved' ? '#166534' : '#92400E',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '700',
                  }}
                >
                  <Icon
                    name={activeSelectedMistake.status === 'resolved' ? 'check-circle' : 'alert-circle'}
                    size={12}
                    color={activeSelectedMistake.status === 'resolved' ? '#166534' : '#92400E'}
                  />
                  <span>{activeSelectedMistake.status === 'resolved' ? 'RESOLVED & MASTERED' : 'NEEDS REVISION'}</span>
                </span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: '700', color: 'var(--color-green-primary)', marginTop: '4px' }}>
                  {activeSelectedMistake.categoryLabel}
                </h3>
              </div>
              <button
                onClick={() => setActiveSelectedMistake(null)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ×
              </button>
            </div>

            <div style={{ background: 'var(--color-green-surface)', borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                Target Verse: <strong>Surah {activeSelectedMistake.surahName} (Ayah {activeSelectedMistake.ayahNumber})</strong>
              </p>
              {activeSelectedMistake.wordText && (
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: '700', color: 'var(--color-green-deep)' }}>
                  Word: "{activeSelectedMistake.wordText}"
                </p>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-gold-deep)' }}>
                Teacher's Guidance ({activeSelectedMistake.teacherName}):
              </span>
              <p style={{ fontSize: '14px', color: 'var(--text-main)', marginTop: '6px', lineHeight: '1.5' }}>
                "{activeSelectedMistake.correctionNote}"
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              {isTeacherOrAdmin && activeSelectedMistake.status === 'active' && (
                <button
                  onClick={() => setResolveTargetMistake(activeSelectedMistake)}
                  className="btn-auth-submit"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    margin: 0,
                    padding: '8px 16px',
                    width: 'auto',
                    background: '#166534',
                  }}
                >
                  <Icon name="check-circle" size={14} color="#FFFFFF" />
                  <span>Mark as Cleared</span>
                </button>
              )}

              {isTeacherOrAdmin && (
                <button
                  onClick={() => handleDeleteMistake(activeSelectedMistake.id)}
                  className="btn-table-action"
                  style={{ color: '#DC2626', borderColor: '#FCA5A5' }}
                >
                  Withdraw Marker
                </button>
              )}

              <button
                onClick={() => setActiveSelectedMistake(null)}
                className="btn-table-action"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
