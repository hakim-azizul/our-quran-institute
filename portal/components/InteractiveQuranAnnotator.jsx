'use client';

import React, { useState, useEffect } from 'react';
import { QURAN_SURAHS } from '../lib/quranData';
import { Icon } from './Icons';

export default function InteractiveQuranAnnotator({
  currentUser,
  studentsList = [],
  selectedStudentId,
  onSelectStudent,
}) {
  const isTeacherOrAdmin = currentUser.role === 'teacher' || currentUser.role === 'admin';
  const effectiveStudentId = isTeacherOrAdmin
    ? selectedStudentId || (studentsList[0]?.id || 'QI-STU-8842')
    : currentUser.id;

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

  const activeMistakes = mistakes.filter((m) => m.status === 'active');
  const resolvedMistakes = mistakes.filter((m) => m.status === 'resolved');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header bar */}
      <div
        style={{
          background: 'var(--color-white)',
          border: '1.5px solid var(--color-gold-primary)',
          borderRadius: '16px',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <span style={{ fontSize: '24px' }}>📖</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: '700', color: 'var(--color-green-primary)' }}>
              Interactive Mushaf &amp; Recitation Mistake Tracker
            </h2>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {isTeacherOrAdmin
              ? 'Click any Arabic Ayah or word to flag a recitation error with scholarly guidance. Mark resolved once the student recites with precision.'
              : 'Review your teacher’s real-time Tajweed notes directly on the Holy Quran verses to target your practice.'}
          </p>
        </div>

        {/* Teacher Student Switcher */}
        {isTeacherOrAdmin && studentsList.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--color-green-surface)', padding: '8px 14px', borderRadius: '12px', border: '1px solid rgba(13, 74, 56, 0.15)' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-green-primary)' }}>
              Annotating Student:
            </span>
            <select
              value={effectiveStudentId}
              onChange={(e) => onSelectStudent && onSelectStudent(e.target.value)}
              className="form-input form-select"
              style={{ width: 'auto', padding: '6px 28px 6px 12px', fontSize: '13px', fontWeight: '700' }}
            >
              {studentsList.map((stu) => (
                <option key={stu.id} value={stu.id}>
                  🎓 {stu.name} ({stu.id})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tabs & Surah Picker */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('mushaf')}
            className="btn-table-action"
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: '700',
              background: activeTab === 'mushaf' ? 'var(--color-green-primary)' : 'var(--color-white)',
              color: activeTab === 'mushaf' ? '#FFFFFF' : 'var(--text-body)',
              borderColor: activeTab === 'mushaf' ? 'var(--color-gold-primary)' : 'var(--border-light)',
            }}
          >
            📜 Interactive Quran View
          </button>
          <button
            onClick={() => setActiveTab('mistake_log')}
            className="btn-table-action"
            style={{
              padding: '10px 18px',
              fontSize: '14px',
              fontWeight: '700',
              background: activeTab === 'mistake_log' ? 'var(--color-green-primary)' : 'var(--color-white)',
              color: activeTab === 'mistake_log' ? '#FFFFFF' : 'var(--text-body)',
              borderColor: activeTab === 'mistake_log' ? 'var(--color-gold-primary)' : 'var(--border-light)',
            }}
          >
            ⚠️ Needs Revision ({activeMistakes.length})
          </button>
          <button
            onClick={() => setActiveTab('resolved_history')}
            className="btn-table-action"
            style={{
              padding: '10px 18px',
              fontSize: '14px',
              fontWeight: '700',
              background: activeTab === 'resolved_history' ? 'var(--color-green-primary)' : 'var(--color-white)',
              color: activeTab === 'resolved_history' ? '#FFFFFF' : 'var(--text-body)',
              borderColor: activeTab === 'resolved_history' ? 'var(--color-gold-primary)' : 'var(--border-light)',
            }}
          >
            ✓ Cleared Milestones ({resolvedMistakes.length})
          </button>
        </div>

        {/* Surah Dropdown Selector */}
        {activeTab === 'mushaf' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)' }}>
              Select Surah:
            </span>
            <select
              value={activeSurahNumber}
              onChange={(e) => setActiveSurahNumber(Number(e.target.value))}
              className="form-input form-select"
              style={{ width: 'auto', padding: '8px 34px 8px 14px', fontSize: '14.5px', fontWeight: '700', color: 'var(--color-green-primary)' }}
            >
              {QURAN_SURAHS.map((s) => (
                <option key={s.number} value={s.number}>
                  {s.number}. {s.name} ({s.arabicName}) — {s.ayahCount} Ayahs
                </option>
              ))}
            </select>
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
                        <span>🚩 Flag Verse Mistake</span>
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
                            <span style={{ fontSize: '18px' }}>
                              {m.severity === 'major' ? '🛑' : '⚠️'}
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
              <span style={{ fontSize: '42px', display: 'block', marginBottom: '10px' }}>🌟</span>
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
                          margin: 0,
                          padding: '6px 14px',
                          fontSize: '12px',
                          width: 'auto',
                          background: '#166534',
                          borderColor: '#22C55E',
                        }}
                      >
                        ✓ Mark Resolved
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
                      <span style={{ background: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' }}>
                        ✓ RESOLVED &amp; MASTERED
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
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: '700', color: 'var(--color-green-primary)' }}>
                🚩 Flag Recitation Mistake for Student
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
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Verse / Word Target:</span>
              <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-green-deep)', margin: '2px 0' }}>
                Surah {activeSurah.name} • Verse {targetAyah?.number} {targetWord ? `• Word: "${targetWord.text}"` : ''}
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
                    <option value="major">Major (🔴 Critical - Alters Meaning)</option>
                    <option value="minor">Minor (🟡 Tajweed Inaccuracy)</option>
                    <option value="info">Info (🔵 Scholarly Advice / Recommendation)</option>
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
                  {isSubmitting ? 'Saving Mistake Marker...' : 'Save Flag to Student Quran'}
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
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: '700', color: '#166534', marginBottom: '8px' }}>
              ✓ Mark Mistake as Cleared &amp; Mastered
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
                    background: activeSelectedMistake.status === 'resolved' ? '#DCFCE7' : '#FEF3C7',
                    color: activeSelectedMistake.status === 'resolved' ? '#166534' : '#92400E',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '700',
                  }}
                >
                  {activeSelectedMistake.status === 'resolved' ? '✓ RESOLVED & MASTERED' : '⚠️ NEEDS REVISION'}
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
                  style={{ margin: 0, padding: '8px 16px', width: 'auto', background: '#166534' }}
                >
                  ✓ Mark as Cleared
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
