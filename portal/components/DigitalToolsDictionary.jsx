'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icons';

export default function DigitalToolsDictionary({
  isOpen = false,
  onClose,
  onInsertTerm,
}) {
  const [mounted, setMounted] = useState(false);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const categories = [
    { id: 'all', label: 'All Terms', icon: 'book-open' },
    { id: 'makharij', label: 'Makharij (Articulation)', icon: 'mic' },
    { id: 'sifaat', label: 'Sifaat & Qalqalah', icon: 'award' },
    { id: 'noon_tanween', label: 'Noon & Tanween Rules', icon: 'disc' },
    { id: 'madd', label: 'Madd Rules (Elongation)', icon: 'trending-up' },
    { id: 'waqf', label: 'Waqf Signs (Pausing)', icon: 'alert-circle' },
    { id: 'classroom', label: 'Classroom Directives', icon: 'volume-2' },
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

  const handleCopy = (entry) => {
    const textToCopy = `${entry.termArabic} (${entry.termTranslit}) - ${entry.termEnglish || entry.definition}: ${entry.definition}`;
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedId(entry.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleInsert = (entry) => {
    if (onInsertTerm) {
      onInsertTerm(`${entry.termArabic} (${entry.termTranslit}) - ${entry.termEnglish || entry.definition}`);
      if (onClose) onClose();
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="dictionary-modal-backdrop" onClick={onClose}>
      <div className="dictionary-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="dictionary-modal-header">
          <div className="dictionary-header-left">
            <span className="dictionary-icon-badge">
              <Icon name="book-marked" size={20} />
            </span>
            <div>
              <h2 className="dictionary-modal-title">Digital Quranic &amp; Tajweed Dictionary</h2>
              <p className="dictionary-modal-subtitle">
                Quick In-Class Reference for Teachers &amp; Students
              </p>
            </div>
          </div>
          <button
            type="button"
            className="dictionary-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <Icon name="x" size={16} />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="dictionary-controls-bar">
          <div className="dictionary-search-box">
            <span className="search-icon">
              <Icon name="search" size={16} />
            </span>
            <input
              type="text"
              placeholder="Search by Arabic, English, or transliteration (e.g., Qalqalah, Madd, Waqf)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="dictionary-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <Icon name="x" size={12} />
              </button>
            )}
          </div>

          <div className="dictionary-category-chips">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`category-chip ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  {cat.icon && <Icon name={cat.icon} size={14} />}
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Body */}
        <div className="dictionary-modal-body">
          {loading ? (
            <div className="dictionary-loading-state">
              <span className="loading-spinner">
                <Icon name="clock" size={24} />
              </span>
              <p>Searching authentic Tajweed terminology...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="dictionary-empty-state">
              <span className="empty-icon">
                <Icon name="search" size={28} />
              </span>
              <p>No matching terminology found for "{searchQuery}".</p>
              <button
                type="button"
                className="reset-search-btn"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="dictionary-cards-grid">
              {entries.map((entry) => (
                <div key={entry.id} className="dictionary-card">
                  <div className="dictionary-card-top">
                    <span className="dictionary-term-arabic">{entry.termArabic}</span>
                    <span className="dictionary-category-badge">{entry.category.toUpperCase()}</span>
                  </div>

                  <div className="dictionary-card-names">
                    <span className="dictionary-term-translit">{entry.termTranslit}</span>
                    {entry.termEnglish && <span className="dictionary-term-translit" style={{ color: '#0D4A38' }}> • {entry.termEnglish}</span>}
                  </div>

                  <p className="dictionary-desc-english">{entry.definition}</p>

                  {entry.example && (
                    <div className="dictionary-example-box">
                      <span className="example-label">Example (مثال):</span>
                      <span className="example-text">{entry.example}</span>
                    </div>
                  )}

                  <div className="dictionary-card-actions">
                    <button
                      type="button"
                      className="btn-dict-copy"
                      onClick={() => handleCopy(entry)}
                    >
                      {copiedId === entry.id ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <Icon name="check-circle" size={12} /> Copied
                        </span>
                      ) : (
                        <>
                          <Icon name="copy" size={13} style={{ marginRight: 4 }} /> Copy Rule
                        </>
                      )}
                    </button>
                    {onInsertTerm && (
                      <button
                        type="button"
                        className="btn-dict-insert"
                        onClick={() => handleInsert(entry)}
                      >
                        <Icon name="edit" size={13} style={{ marginRight: 4 }} />
                        Insert to Feedback
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="dictionary-modal-footer">
          <span>Showing {entries.length} authentic Tajweed &amp; classroom terminology rules</span>
          <button type="button" className="btn-dict-done" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
