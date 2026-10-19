'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from './Icons';

export default function TajweedToolsPageView({ currentUser, onNavigateTab }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedMakhrajRegion, setSelectedMakhrajRegion] = useState(null);

  const categories = [
    { id: 'all', label: 'All Tajweed Rules', icon: 'book-open' },
    { id: 'makharij', label: 'Makharij (Articulation)', icon: 'mic' },
    { id: 'sifaat', label: 'Sifaat & Qalqalah', icon: 'award' },
    { id: 'noon_tanween', label: 'Noon & Tanween Rules', icon: 'disc' },
    { id: 'meem_sakinah', label: 'Meem Sakinah Rules', icon: 'layers' },
    { id: 'madd', label: 'Madd Rules (Elongation)', icon: 'trending-up' },
    { id: 'waqf', label: 'Waqf Signs (Pausing)', icon: 'alert-circle' },
    { id: 'classroom', label: 'Classroom Directives', icon: 'volume-2' },
  ];

  // Anatomical regions for interactive visual quick selector
  const anatomicalRegions = [
    {
      id: 'al-jawf',
      nameArabic: 'الجَوْف',
      nameEnglish: 'Al-Jawf (Oral Cavity)',
      letters: 'ا - و - ي (Madd Letters)',
      desc: 'Open throat and mouth cavity producing the 3 long vowels.',
      categoryFilter: 'makharij',
      searchKey: 'الجَوْف',
    },
    {
      id: 'al-halq',
      nameArabic: 'الحَلْق',
      nameEnglish: 'Al-Halq (The Throat)',
      letters: 'ء - هـ - ع - ح - غ - خ',
      desc: 'Deepest, middle, and upper throat producing the 6 Izhar letters.',
      categoryFilter: 'makharij',
      searchKey: 'الحَلْق',
    },
    {
      id: 'al-lisan',
      nameArabic: 'اللِّسَان',
      nameEnglish: 'Al-Lisan (The Tongue)',
      letters: '18 Letters across 10 points',
      desc: 'Base, center, edge, and tip of tongue (ق، ك، ض، ل، ن، ر، ط، د، ت، ص، ز، س...).',
      categoryFilter: 'makharij',
      searchKey: 'اللسان',
    },
    {
      id: 'ash-shafatayn',
      nameArabic: 'الشَّفَتَان',
      nameEnglish: 'Ash-Shafatayn (The Lips)',
      letters: 'ف - ب - م - و',
      desc: 'Lower lip to upper teeth (ف) and closure of both lips (ب، م، و).',
      categoryFilter: 'makharij',
      searchKey: 'الشَّفَتَان',
    },
    {
      id: 'al-khayshum',
      nameArabic: 'الخَيْشُوم',
      nameEnglish: 'Al-Khayshum (Nasal Cavity)',
      letters: 'الغُنَّة (Ghunnah)',
      desc: 'Nasal cavity giving rise to 2-count nasal humming in Noon & Meem.',
      categoryFilter: 'makharij',
      searchKey: 'الخَيْشُوم',
    },
  ];

  // Madd count reference guide
  const maddCounts = [
    {
      title: '2 Harakat (حركتان)',
      types: 'Madd Asli • Madd Badal • Madd ‘Iwad',
      countPill: '2 Counts',
      colorClass: 'pill-madd-2',
    },
    {
      title: '4 or 5 Harakat (أربع إلى خمس حركات)',
      types: 'Madd Wajib Muttasil • Madd Ja’iz Munfasil',
      countPill: '4-5 Counts',
      colorClass: 'pill-madd-4',
    },
    {
      title: '2, 4, or 6 Harakat (حركتان، 4، 6 حركات)',
      types: 'Madd ‘Arid li-Sukoon • Madd al-Leen',
      countPill: '2/4/6 Counts',
      colorClass: 'pill-madd-flex',
    },
    {
      title: '6 Compulsory Harakat (ست حركات لازمة)',
      types: 'Madd Lazim Kalimi & Harfi (Muthaqqal & Mukhaffaf)',
      countPill: '6 Counts',
      colorClass: 'pill-madd-6',
    },
  ];

  useEffect(() => {
    fetchEntries();
  }, [activeCategory, searchQuery]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const url = `/api/dictionary?category=${encodeURIComponent(activeCategory)}&search=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.entries) {
        setEntries(data.entries);
      }
    } catch (err) {
      console.error('Failed to load dictionary:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleCopy = (entry) => {
    const textToCopy = `${entry.termArabic} (${entry.termTranslit}) - ${entry.termEnglish}: ${entry.definition} [Example: ${entry.example}]`;
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedId(entry.id);
      showToast(`Copied "${entry.termArabic}" rule & Quranic example to clipboard!`);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleSelectAnatomicalRegion = (region) => {
    if (selectedMakhrajRegion === region.id) {
      setSelectedMakhrajRegion(null);
      setSearchQuery('');
      setActiveCategory('all');
    } else {
      setSelectedMakhrajRegion(region.id);
      setActiveCategory(region.categoryFilter);
      setSearchQuery(region.searchKey);
    }
  };

  // Group count summary
  const categoryCounts = useMemo(() => {
    const counts = { all: entries.length };
    categories.forEach((cat) => {
      if (cat.id !== 'all') {
        counts[cat.id] = entries.filter((e) => e.category === cat.id).length;
      }
    });
    return counts;
  }, [entries]);

  return (
    <div className="tajweed-tools-page-view">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="portal-toast-banner">
          <Icon name="check-circle" size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Dedicated Page Hero Banner */}
      <section className="tajweed-hero-card">
        <div className="tajweed-hero-content">
          <div className="tajweed-badge-row">
            <span className="badge-tajweed-gold">
              <Icon name="book-marked" size={13} style={{ marginRight: 5 }} />
              AUTHENTIC QURANIC SCHOLARSHIP
            </span>
            <span className="badge-tajweed-emerald">Al-Muqaddimah Al-Jazariyyah Standard</span>
            <span className="badge-tajweed-neutral">Hafs &amp; Warsh Transmissions</span>
          </div>

          <h1 className="tajweed-page-title">
            Tajweed Tools &amp; Quranic Articulation Reference
          </h1>

          <p className="tajweed-page-subtitle">
            Comprehensive faculty and student compendium for Points of Articulation (Makharij),
            Phonetic Attributes (Sifaat), Ahkam of Noon &amp; Meem Sakinah, Elongation (Madd),
            and Pausing Signs (Waqf).
          </p>
        </div>

        <div className="tajweed-hero-stats">
          <div className="hero-stat-pill">
            <span className="stat-num">{entries.length}</span>
            <span className="stat-label">Verified Rules</span>
          </div>
          <div className="hero-stat-pill">
            <span className="stat-num">17</span>
            <span className="stat-label">Makharij Points</span>
          </div>
          <div className="hero-stat-pill">
            <span className="stat-num">5</span>
            <span className="stat-label">Anatomical Areas</span>
          </div>
        </div>
      </section>

      {/* 2. Interactive Anatomical Makharij Navigator */}
      <section className="tajweed-card tajweed-anatomical-section">
        <div className="tajweed-section-header">
          <div>
            <div className="teacher-card-badge-row">
              <span className="teacher-card-badge">ANATOMICAL ATLAS</span>
              <span className="teacher-card-count">5 Primary Organs of Articulation</span>
            </div>
            <h2 className="tajweed-section-title">The Five Main Makharij Regions (مخارج الحروف العامة)</h2>
            <p className="tajweed-section-sub">
              Click any anatomical region below to immediately filter the rule list and inspect originating letters.
            </p>
          </div>
        </div>

        <div className="makharij-regions-grid">
          {anatomicalRegions.map((region) => {
            const isSelected = selectedMakhrajRegion === region.id;
            return (
              <button
                key={region.id}
                type="button"
                className={`makhraj-region-card ${isSelected ? 'active-region' : ''}`}
                onClick={() => handleSelectAnatomicalRegion(region)}
              >
                <div className="region-card-top">
                  <span className="region-arabic">{region.nameArabic}</span>
                  <span className="region-pill">{region.nameEnglish}</span>
                </div>
                <div className="region-letters-box">
                  <strong>Letters:</strong> {region.letters}
                </div>
                <p className="region-desc">{region.desc}</p>
                <span className="region-action-hint">
                  {isSelected ? '✓ Filter Active (Click to reset)' : 'Filter by this region →'}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Madd & Duration Quick Reference Guide */}
      <section className="tajweed-card tajweed-madd-guide-section">
        <div className="tajweed-section-header">
          <div>
            <div className="teacher-card-badge-row">
              <span className="teacher-card-badge">ELONGATION RULES</span>
              <span className="teacher-card-count">Harakat Recitation Timing</span>
            </div>
            <h2 className="tajweed-section-title">Madd Duration &amp; Harakat Quick Guide</h2>
            <p className="tajweed-section-sub">
              Standardized finger-flexing counts for authentic Qur'anic prolongation.
            </p>
          </div>
        </div>

        <div className="madd-counts-grid">
          {maddCounts.map((madd, idx) => (
            <div key={idx} className="madd-count-card">
              <div className="madd-count-top">
                <span className={`madd-pill ${madd.colorClass}`}>{madd.countPill}</span>
                <span className="madd-title">{madd.title}</span>
              </div>
              <p className="madd-types-list">{madd.types}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Live Search & Category Control Bar */}
      <section className="tajweed-controls-container">
        <div className="tajweed-search-box">
          <span className="search-icon">
            <Icon name="search" size={18} color="#0D4A38" />
          </span>
          <input
            type="text"
            placeholder="Search by Arabic, transliteration, or meaning (e.g., Qalqalah, Izhar, Madd Lazim, غنة)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedMakhrajRegion(null);
            }}
            className="tajweed-search-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => {
                setSearchQuery('');
                setSelectedMakhrajRegion(null);
              }}
              aria-label="Clear search"
            >
              <Icon name="x" size={14} />
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="tajweed-categories-bar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                className={`tajweed-cat-btn ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSelectedMakhrajRegion(null);
                }}
              >
                <Icon name={cat.icon} size={15} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. Results Grid */}
      <section className="tajweed-results-section">
        {loading ? (
          <div className="tajweed-loading-state">
            <div className="portal-spinner" />
            <p>Loading authentic Tajweed reference rules...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="tajweed-empty-state">
            <Icon name="search" size={36} color="#9F7C35" />
            <h3>No matching Tajweed rules found</h3>
            <p>We couldn't find any rules matching "{searchQuery}".</p>
            <button
              type="button"
              className="btn-dash-primary-gold"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
                setSelectedMakhrajRegion(null);
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="tajweed-cards-grid">
            {entries.map((entry) => (
              <div key={entry.id} className="tajweed-rule-card">
                <div className="rule-card-header">
                  <div className="rule-card-title-box">
                    <span className="rule-arabic-title">{entry.termArabic}</span>
                    <span className="rule-translit-text">{entry.termTranslit}</span>
                  </div>
                  <span className={`rule-cat-badge badge-cat-${entry.category}`}>
                    {entry.category.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="rule-english-heading">
                  <strong>{entry.termEnglish}</strong>
                </div>

                <p className="rule-definition-text">{entry.definition}</p>

                {entry.example && (
                  <div className="rule-quran-example-box">
                    <div className="example-header">
                      <Icon name="quran" size={13} color="#0D4A38" />
                      <span>Authentic Quranic Example (مِثَالٌ قُرْآنِيٌّ)</span>
                    </div>
                    <div className="example-arabic-text">{entry.example}</div>
                  </div>
                )}

                <div className="rule-card-footer">
                  <span className="rule-id-tag">REF #{entry.id}</span>
                  <button
                    type="button"
                    className="btn-copy-tajweed-rule"
                    onClick={() => handleCopy(entry)}
                  >
                    {copiedId === entry.id ? (
                      <>
                        <Icon name="check-circle" size={13} /> Copied!
                      </>
                    ) : (
                      <>
                        <Icon name="copy" size={13} style={{ marginRight: 4 }} /> Copy Rule &amp; Example
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
