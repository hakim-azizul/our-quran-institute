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

  // Admin & Teacher editing capabilities
  const isTeacherOrAdmin = currentUser?.role === 'teacher' || currentUser?.role === 'admin';
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [ruleFormData, setRuleFormData] = useState({
    category: 'noon_tanween',
    termArabic: '',
    termTranslit: '',
    termEnglish: '',
    definition: '',
    example: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

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

  // Admin & Teacher Tajweed Rule Handlers
  const handleOpenAddRule = () => {
    setEditingRule(null);
    setRuleFormData({
      category: activeCategory !== 'all' ? activeCategory : 'noon_tanween',
      termArabic: '',
      termTranslit: '',
      termEnglish: '',
      definition: '',
      example: '',
    });
    setIsRuleModalOpen(true);
  };

  const handleOpenEditRule = (rule) => {
    setEditingRule(rule);
    setRuleFormData({
      category: rule.category || 'noon_tanween',
      termArabic: rule.termArabic || '',
      termTranslit: rule.termTranslit || '',
      termEnglish: rule.termEnglish || '',
      definition: rule.definition || '',
      example: rule.example || '',
    });
    setIsRuleModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsRuleModalOpen(false);
    setEditingRule(null);
    setIsSubmitting(false);
  };

  const handleFormChange = (field, value) => {
    setRuleFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveRule = async (e) => {
    if (e) e.preventDefault();
    if (!ruleFormData.termArabic?.trim() || !ruleFormData.termEnglish?.trim()) {
      showToast('⚠️ আরবী নাম এবং ইংরেজি/বাংলা শিরোনাম আবশ্যক!');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingRule) {
        // PUT update existing rule
        const res = await fetch('/api/dictionary', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingRule.id, ...ruleFormData }),
        });
        const data = await res.json();
        if (data.success) {
          showToast(`✓ তাজবীদ নিয়ম "${ruleFormData.termArabic}" সফলভাবে আপডেট হয়েছে!`);
          handleCloseModal();
          await fetchEntries();
        } else {
          showToast(`ত্রুটি: ${data.error || 'আপডেট করতে ব্যর্থ হয়েছে'}`);
        }
      } else {
        // POST create new rule
        const res = await fetch('/api/dictionary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ruleFormData),
        });
        const data = await res.json();
        if (data.success) {
          showToast(`✓ নতুন তাজবীদ নিয়ম "${ruleFormData.termArabic}" সফলভাবে সংযুক্ত হয়েছে!`);
          handleCloseModal();
          await fetchEntries();
        } else {
          showToast(`ত্রুটি: ${data.error || 'সংরক্ষণ করতে ব্যর্থ হয়েছে'}`);
        }
      }
    } catch (err) {
      console.error('Failed to save Tajweed rule:', err);
      showToast('সার্ভার সংযোগে ত্রুটি দেখা দিয়েছে');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRule = (rule) => {
    setDeleteConfirmId(rule.id);
  };

  const confirmDeleteRule = async () => {
    if (!deleteConfirmId) return;
    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/dictionary?id=${encodeURIComponent(deleteConfirmId)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast('✓ তাজবীদ নিয়মটি তালিকা থেকে মুছে ফেলা হয়েছে');
        setDeleteConfirmId(null);
        await fetchEntries();
      } else {
        showToast(`ত্রুটি: ${data.error || 'ডিলিট করতে ব্যর্থ হয়েছে'}`);
      }
    } catch (err) {
      console.error('Failed to delete Tajweed rule:', err);
      showToast('ডিলিট করার সময় ত্রুটি হয়েছে');
    } finally {
      setIsSubmitting(false);
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

          {isTeacherOrAdmin && (
            <button
              type="button"
              className="btn-faculty-add-rule"
              onClick={handleOpenAddRule}
              id="btn-add-tajweed-rule"
            >
              <Icon name="plus" size={15} style={{ marginRight: 6 }} />
              <span>+ নতুন নিয়ম যোগ করুন</span>
            </button>
          )}
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
                  <div className="rule-card-footer-left">
                    <span className="rule-id-tag">REF #{entry.id}</span>
                  </div>

                  <div className="rule-card-footer-actions">
                    {isTeacherOrAdmin && (
                      <>
                        <button
                          type="button"
                          className="btn-tajweed-admin-edit"
                          onClick={() => handleOpenEditRule(entry)}
                          title="নিয়মটি সম্পাদনা করুন (Edit Rule)"
                          id={`btn-edit-rule-${entry.id}`}
                        >
                          <Icon name="edit" size={12} style={{ marginRight: 4 }} />
                          <span>এডিট</span>
                        </button>
                        <button
                          type="button"
                          className="btn-tajweed-admin-delete"
                          onClick={() => handleDeleteRule(entry)}
                          title="নিয়মটি মুছে ফেলুন (Delete Rule)"
                          id={`btn-delete-rule-${entry.id}`}
                        >
                          <Icon name="trash" size={12} style={{ marginRight: 4 }} />
                          <span>মুছুন</span>
                        </button>
                      </>
                    )}

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
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 6. Admin / Teacher Tajweed Rule Add & Edit Modal */}
      {isRuleModalOpen && (
        <div className="portal-modal-backdrop" onClick={handleCloseModal}>
          <div
            className="portal-modal-dialog tajweed-rule-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="portal-modal-header">
              <div className="portal-modal-header-info">
                <span className="modal-header-badge">
                  <Icon name="scholar" size={14} style={{ marginRight: 6 }} />
                  {currentUser?.role === 'admin' ? 'এডমিন কনসোল' : 'শিক্ষক প্যানেল'}
                </span>
                <h3 className="portal-modal-title">
                  {editingRule ? 'তাজবীদ নিয়ম সম্পাদনা (Edit Rule)' : 'নতুন তাজবীদ নিয়ম যোগ করুন (Add Rule)'}
                </h3>
              </div>
              <button
                type="button"
                className="portal-modal-close-btn"
                onClick={handleCloseModal}
                aria-label="Close modal"
              >
                <Icon name="x" size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveRule} className="tajweed-rule-form">
              <div className="tajweed-form-row">
                <div className="tajweed-form-group">
                  <label className="tajweed-form-label">ক্যাটাগরি (Category)</label>
                  <select
                    className="tajweed-form-select"
                    value={ruleFormData.category}
                    onChange={(e) => handleFormChange('category', e.target.value)}
                  >
                    <option value="noon_tanween">নূন সাকিন ও তানভীন (Noon & Tanween)</option>
                    <option value="makharij">মাখরাজ ও উচ্চারণ (Makharij)</option>
                    <option value="sifaat">সিফাত ও কলকলাহ (Sifaat & Qalqalah)</option>
                    <option value="meem_sakinah">মীম সাকিনার বিধান (Meem Sakinah)</option>
                    <option value="madd">মাদ ও ত্বলাক্বাহ (Madd Elongation)</option>
                    <option value="waqf">ওয়াকফ ও বিরতি চিহ্ন (Waqf Signs)</option>
                    <option value="classroom">ক্লাসরুম নির্দেশনা (Classroom)</option>
                  </select>
                </div>

                <div className="tajweed-form-group">
                  <label className="tajweed-form-label">উচ্চারণ ও ইংরেজি শিরোনাম (Transliteration)</label>
                  <input
                    type="text"
                    className="tajweed-form-input"
                    placeholder="e.g. Al-Ikhfa Al-Haqiqi"
                    value={ruleFormData.termTranslit}
                    onChange={(e) => handleFormChange('termTranslit', e.target.value)}
                  />
                </div>
              </div>

              <div className="tajweed-form-row">
                <div className="tajweed-form-group">
                  <label className="tajweed-form-label">আরবী পরিভাষা (Arabic Term)*</label>
                  <input
                    type="text"
                    dir="rtl"
                    className="tajweed-form-input tajweed-arabic-input"
                    placeholder="যেমন: الإِخْفَاءُ الحَقِيقِيُّ"
                    value={ruleFormData.termArabic}
                    onChange={(e) => handleFormChange('termArabic', e.target.value)}
                    required
                  />
                </div>

                <div className="tajweed-form-group">
                  <label className="tajweed-form-label">বাংলা/ইংরেজি শিরোনাম (Title/Meaning)*</label>
                  <input
                    type="text"
                    className="tajweed-form-input"
                    placeholder="যেমন: ইখফায়ে হাকিকী (True Concealment)"
                    value={ruleFormData.termEnglish}
                    onChange={(e) => handleFormChange('termEnglish', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="tajweed-form-group">
                <label className="tajweed-form-label">নিয়ম ও বিস্তারিত সংজ্ঞা (Definition &amp; Rules)</label>
                <textarea
                  className="tajweed-form-textarea"
                  rows={4}
                  placeholder="নিয়মের প্রয়োগ পদ্ধতি, হরফ সংখ্যা, গুন্নাহর পরিমাণ ও সতর্কতা লিখুন..."
                  value={ruleFormData.definition}
                  onChange={(e) => handleFormChange('definition', e.target.value)}
                />
              </div>

              <div className="tajweed-form-group">
                <label className="tajweed-form-label">কোরআনী উদাহরণ (Authentic Quranic Example)</label>
                <input
                  type="text"
                  dir="rtl"
                  className="tajweed-form-input tajweed-arabic-input"
                  placeholder="যেমন: مِن قَبْلِكُمْ ، كُنتُمْ خَيْرَ أُمَّةٍ"
                  value={ruleFormData.example}
                  onChange={(e) => handleFormChange('example', e.target.value)}
                />
              </div>

              <div className="tajweed-modal-footer">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="btn-modal-save-rule"
                  disabled={isSubmitting}
                  id="btn-save-tajweed-rule"
                >
                  {isSubmitting ? (
                    <>সংরক্ষণ করা হচ্ছে...</>
                  ) : (
                    <>
                      <Icon name="check" size={15} style={{ marginRight: 6 }} />
                      {editingRule ? 'আপডেট সংরক্ষণ করুন' : 'নতুন নিয়ম যুক্ত করুন'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="portal-modal-backdrop" onClick={() => setDeleteConfirmId(null)}>
          <div
            className="portal-modal-dialog delete-confirm-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-dialog-body">
              <div className="delete-dialog-icon">
                <Icon name="trash" size={32} color="#DC2626" />
              </div>
              <h3 className="delete-dialog-title">তাজবীদ নিয়মটি মুছে ফেলতে চান?</h3>
              <p className="delete-dialog-text">
                এই নিয়মটি ডিলিট করলে তা শিক্ষক ও শিক্ষার্থীদের তাজবীদ রেফারেন্স তালিকা থেকে স্থায়ীভাবে অপসারিত হবে।
              </p>
              <div className="delete-dialog-actions">
                <button
                  type="button"
                  className="btn-dialog-cancel"
                  onClick={() => setDeleteConfirmId(null)}
                  disabled={isSubmitting}
                >
                  না, বাতিল করুন
                </button>
                <button
                  type="button"
                  className="btn-dialog-confirm-delete"
                  onClick={confirmDeleteRule}
                  disabled={isSubmitting}
                  id="btn-confirm-delete-rule"
                >
                  {isSubmitting ? 'মুছে ফেলা হচ্ছে...' : 'হ্যাঁ, নিশ্চিতভাবে মুছুন'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
