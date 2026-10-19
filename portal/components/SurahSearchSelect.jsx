'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Icon } from './Icons';
import { ALL_114_SURAH_METADATA, QURAN_SURAHS } from '../lib/quranData';

// Frequently recited/studied popular Surahs
const POPULAR_SURAH_NUMBERS = [1, 2, 18, 36, 55, 56, 67, 112, 113, 114];

export default function SurahSearchSelect({
  selectedSurahNumber = 1,
  onSelectSurah,
  variant = 'default', // 'default' | 'toolbar' | 'compact'
  align = 'left', // 'left' | 'right'
  placeholder = 'Search 114 Surahs...',
  className = '',
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'meccan' | 'medinan' | 'juz30' | 'popular'
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Active selected Surah metadata
  const currentSurah = useMemo(() => {
    const num = Number(selectedSurahNumber);
    return ALL_114_SURAH_METADATA.find((s) => s.number === num) || ALL_114_SURAH_METADATA[0];
  }, [selectedSurahNumber]);

  // Filtered and searched Surahs list
  const filteredSurahs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return ALL_114_SURAH_METADATA.filter((s) => {
      // Category filter check
      if (activeFilter === 'meccan' && s.revelationType.toLowerCase() !== 'meccan') return false;
      if (activeFilter === 'medinan' && s.revelationType.toLowerCase() !== 'medinan') return false;
      if (activeFilter === 'juz30' && s.juz !== 30) return false;
      if (activeFilter === 'popular' && !POPULAR_SURAH_NUMBERS.includes(s.number)) return false;

      // Search query check
      if (!q) return true;

      const numStr = s.number.toString();
      const numPad = s.number.toString().padStart(2, '0');
      const numPad3 = s.number.toString().padStart(3, '0');
      const matchNumber = numStr === q || numPad === q || numPad3 === q || numStr.startsWith(q);
      const matchName = s.name.toLowerCase().includes(q);
      const matchEnglish = s.englishName.toLowerCase().includes(q);
      const matchArabic = s.arabicName.includes(q);
      const matchJuz = `juz ${s.juz}`.includes(q) || `para ${s.juz}`.includes(q) || (q.startsWith('juz') && s.juz.toString() === q.replace(/\D/g, ''));
      const matchType = s.revelationType.toLowerCase().startsWith(q);

      return matchNumber || matchName || matchEnglish || matchArabic || matchJuz || matchType;
    });
  }, [searchQuery, activeFilter]);

  // Reset highlighted index when filter/query changes
  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchQuery, activeFilter]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input on open & scroll current Surah into view
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
        if (listRef.current) {
          const activeEl = listRef.current.querySelector('[data-selected="true"]');
          if (activeEl) {
            activeEl.scrollIntoView({ block: 'nearest' });
          }
        }
      }, 50);
    } else {
      setSearchQuery('');
      setActiveFilter('all');
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < filteredSurahs.length - 1 ? prev + 1 : prev));
      scrollIndexIntoView(highlightedIndex + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      scrollIndexIntoView(highlightedIndex - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredSurahs[highlightedIndex]) {
        handleSelect(filteredSurahs[highlightedIndex].number);
      }
    }
  };

  const scrollIndexIntoView = (index) => {
    if (listRef.current && index >= 0 && index < filteredSurahs.length) {
      const items = listRef.current.querySelectorAll('.surah-dropdown-item');
      if (items[index]) {
        items[index].scrollIntoView({ block: 'nearest' });
      }
    }
  };

  const handleSelect = (surahNumber) => {
    if (onSelectSurah) {
      onSelectSurah(Number(surahNumber));
    }
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`surah-search-select-container ${variant} ${className}`}
      onKeyDown={handleKeyDown}
      style={{
        position: 'relative',
        display: 'inline-block',
        width: variant === 'toolbar' ? '300px' : variant === 'compact' ? '240px' : '360px',
        maxWidth: '100%',
      }}
    >
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="surah-select-trigger"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          padding: variant === 'toolbar' ? '7px 12px' : '8px 14px',
          background: 'var(--color-white)',
          border: isOpen ? '1.5px solid var(--color-green-primary)' : '1.5px solid var(--border-light)',
          borderRadius: '10px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          boxShadow: isOpen ? '0 0 0 3px rgba(13, 74, 56, 0.12)' : 'var(--shadow-sm)',
          transition: 'all 0.2s ease',
          outline: 'none',
          textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden', minWidth: 0 }}>
          {/* Surah Number Badge */}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '32px',
              height: '32px',
              padding: '0 6px',
              borderRadius: '8px',
              background: 'var(--color-green-surface)',
              border: '1px solid var(--color-gold-border)',
              color: 'var(--color-green-primary)',
              fontSize: '12px',
              fontWeight: '700',
              flexShrink: 0,
            }}
          >
            #{String(currentSurah.number).padStart(2, '0')}
          </span>

          {/* Surah Name & Metadata */}
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontWeight: '700',
                  fontSize: variant === 'toolbar' ? '13.5px' : '14px',
                  color: 'var(--color-green-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {currentSurah.name}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-arabic)',
                  fontSize: '15px',
                  fontWeight: '700',
                  color: 'var(--color-gold-deep)',
                  lineHeight: 1,
                }}
              >
                {currentSurah.arabicName}
              </span>
            </div>
            <span
              style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {currentSurah.ayahCount} Ayahs • {currentSurah.revelationType} • Juz {currentSurah.juz}
            </span>
          </div>
        </div>

        {/* Dropdown Chevron */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            transition: 'transform 0.25s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            flexShrink: 0,
            marginLeft: '4px',
          }}
        >
          <Icon name="chevron-down" size={16} />
        </span>
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div
          role="listbox"
          className="surah-select-popover"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: align === 'right' ? 'auto' : 0,
            right: align === 'right' ? 0 : 'auto',
            width: '420px',
            maxWidth: '92vw',
            background: 'var(--color-white)',
            border: '1.5px solid var(--color-gold-border)',
            borderRadius: '14px',
            boxShadow: '0 20px 45px rgba(13, 74, 56, 0.16), 0 6px 16px rgba(0, 0, 0, 0.05)',
            zIndex: 1050,
            overflow: 'hidden',
            animation: 'portalTabTransitionIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Top Search Input Field */}
          <div
            style={{
              padding: '12px 14px 10px',
              borderBottom: '1px solid var(--border-light)',
              background: 'var(--bg-canvas-subtle)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--color-white)',
                border: '1.5px solid var(--border-light)',
                borderRadius: '8px',
                padding: '6px 12px',
                boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.03)',
              }}
            >
              <Icon name="search" size={16} color="var(--color-green-primary)" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={placeholder}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '13px',
                  color: 'var(--text-main)',
                  background: 'transparent',
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title="Clear search"
                >
                  <Icon name="x" size={14} />
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '10px',
                overflowX: 'auto',
                paddingBottom: '2px',
              }}
            >
              {[
                { id: 'all', label: 'All 114' },
                { id: 'meccan', label: 'Meccan (86)' },
                { id: 'medinan', label: 'Medinan (28)' },
                { id: 'juz30', label: 'Juz 30 (37)' },
                { id: 'popular', label: 'Popular (10)' },
              ].map((chip) => {
                const isActive = activeFilter === chip.id;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => setActiveFilter(chip.id)}
                    style={{
                      border: isActive ? '1px solid var(--color-green-primary)' : '1px solid var(--border-light)',
                      background: isActive ? 'var(--color-green-primary)' : 'var(--color-white)',
                      color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                      padding: '4px 9px',
                      borderRadius: '16px',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Result Count & Shortcut Guidance Bar */}
          <div
            style={{
              padding: '6px 14px',
              fontSize: '11px',
              color: 'var(--text-muted)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--color-white)',
              borderBottom: '1px solid var(--border-light)',
            }}
          >
            <span>
              {filteredSurahs.length === 114
                ? 'Showing all 114 Surahs'
                : `Showing ${filteredSurahs.length} Surah${filteredSurahs.length === 1 ? '' : 's'}`}
            </span>
            <span style={{ fontSize: '10.5px', color: 'var(--text-dim)' }}>
              ↑↓ to navigate • Enter to select
            </span>
          </div>

          {/* Scrollable Results List */}
          <div
            ref={listRef}
            style={{
              maxHeight: '300px',
              overflowY: 'auto',
              padding: '4px 0',
            }}
          >
            {filteredSurahs.length === 0 ? (
              <div
                style={{
                  padding: '32px 16px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                }}
              >
                <div style={{ marginBottom: '8px' }}>
                  <Icon name="search" size={24} color="var(--color-gold-primary)" />
                </div>
                <div style={{ fontWeight: '700', fontSize: '13.5px', color: 'var(--text-main)', marginBottom: '4px' }}>
                  No Surah found matching &quot;{searchQuery}&quot;
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Try searching by Surah number (1-114), Arabic title, English transliteration, or Juz number.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilter('all');
                  }}
                  style={{
                    background: 'var(--color-green-surface)',
                    border: '1px solid var(--color-green-primary)',
                    color: 'var(--color-green-primary)',
                    padding: '5px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  Reset Filters &amp; View All 114
                </button>
              </div>
            ) : (
              filteredSurahs.map((surah, idx) => {
                const isSelected = surah.number === Number(selectedSurahNumber);
                const isHighlighted = idx === highlightedIndex;

                return (
                  <div
                    key={surah.number}
                    data-selected={isSelected}
                    onClick={() => handleSelect(surah.number)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className="surah-dropdown-item"
                    role="option"
                    aria-selected={isSelected}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '9px 14px',
                      cursor: 'pointer',
                      background: isSelected
                        ? 'rgba(13, 74, 56, 0.08)'
                        : isHighlighted
                        ? 'rgba(13, 74, 56, 0.03)'
                        : 'transparent',
                      borderLeft: isSelected
                        ? '3px solid var(--color-gold-bright)'
                        : isHighlighted
                        ? '3px solid var(--color-green-primary)'
                        : '3px solid transparent',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    {/* Left: Badge and Names */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          background: isSelected ? 'var(--color-green-primary)' : 'var(--bg-canvas-subtle)',
                          color: isSelected ? '#FFFFFF' : 'var(--text-muted)',
                          fontSize: '11px',
                          fontWeight: '700',
                          flexShrink: 0,
                          border: isSelected ? '1px solid var(--color-gold-bright)' : '1px solid var(--border-light)',
                        }}
                      >
                        {surah.number}
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span
                            style={{
                              fontWeight: '700',
                              fontSize: '13px',
                              color: isSelected ? 'var(--color-green-primary)' : 'var(--text-main)',
                            }}
                          >
                            {surah.name}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            ({surah.englishName})
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10.5px', color: 'var(--text-dim)', marginTop: '1px' }}>
                          <span>{surah.ayahCount} Ayahs</span>
                          <span>•</span>
                          <span>{surah.revelationType}</span>
                          <span>•</span>
                          <span>Juz {surah.juz}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Arabic calligraphy & Selected check */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, marginLeft: '8px' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-arabic)',
                          fontSize: '17px',
                          fontWeight: '700',
                          color: isSelected ? 'var(--color-green-primary)' : 'var(--color-gold-deep)',
                          direction: 'rtl',
                          lineHeight: 1,
                        }}
                      >
                        {surah.arabicName}
                      </span>
                      {isSelected && (
                        <span style={{ color: 'var(--color-green-primary)', display: 'inline-flex' }}>
                          <Icon name="check-circle" size={16} />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
