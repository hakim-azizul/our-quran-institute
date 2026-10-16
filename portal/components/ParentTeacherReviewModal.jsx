'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icons';

export default function ParentTeacherReviewModal({
  isOpen = false,
  onClose,
  teacherId = 'QI-FAC-014',
  teacherName = 'Dr. Sheikh Ahmad Al-Azhari',
  studentId = 'QI-STU-8842',
  onReviewSubmitted,
}) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  // Sub-category scores
  const [punctuality, setPunctuality] = useState(5);
  const [tajweedExcellence, setTajweedExcellence] = useState(5);
  const [patienceWithChild, setPatienceWithChild] = useState(5);
  const [tarbiyahFocus, setTarbiyahFocus] = useState(5);

  const [reviewText, setReviewText] = useState(
    'Alhamdulillah, Dr. Sheikh Ahmad Al-Azhari is an extraordinary mentor. His patient guidance has helped my son build great love and reverence for reciting the Holy Quran.'
  );
  const [selectedMonth, setSelectedMonth] = useState('October 2026');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setSuccessMsg('');

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId,
          studentId,
          rating,
          categories: {
            punctuality,
            tajweedExcellence,
            patienceWithChild,
            tarbiyahFocus,
          },
          reviewText,
          month: selectedMonth,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(data.message || 'Review submitted successfully!');
        if (onReviewSubmitted) onReviewSubmitted(data.review);
        setTimeout(() => {
          setSuccessMsg('');
          if (onClose) onClose();
        }, 1500);
      } else {
        alert(data.error || 'Failed to submit review.');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="review-modal-backdrop" onClick={onClose}>
      <div className="review-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="review-modal-header">
          <div className="header-badge-row">
            <span className="review-modal-icon">
              <Icon name="star" size={20} />
            </span>
            <div>
              <h2 className="review-modal-title">Parental Scholar Review &amp; Rating</h2>
              <p className="review-modal-subtitle">
                Guardian feedback on teacher pedagogy, punctuality, and character development
              </p>
            </div>
          </div>
          <button type="button" className="review-close-btn" onClick={onClose} aria-label="Close dialog">
            <Icon name="x" size={16} />
          </button>
        </div>

        {/* Scholar Banner */}
        <div className="review-scholar-banner">
          <div className="scholar-avatar-circle">
            <Icon name="scholar" size={24} />
          </div>
          <div className="scholar-text">
            <h3 className="scholar-name">{teacherName}</h3>
            <span className="scholar-tag">Certified Quran Teacher • Tajweed &amp; Qira’at</span>
          </div>
          <div className="verified-badge-shield">
            <Icon name="shield-check" size={14} style={{ marginRight: 6 }} /> Verified Teacher
          </div>
        </div>

        <form onSubmit={handleSubmit} className="review-modal-body">
          {/* Main 5-Star Overall Rating */}
          <div className="overall-rating-section">
            <label className="rating-section-label">Overall Instruction Rating:</label>
            <div className="stars-row">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  aria-label={`${star} Stars`}
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Icon
                    name="star"
                    size={22}
                    color={star <= (hoverRating || rating) ? '#D97706' : '#D1D5DB'}
                    fill={star <= (hoverRating || rating) ? '#D97706' : 'none'}
                  />
                </button>
              ))}
              <span className="rating-score-badge">{rating} / 5.0 Stars</span>
            </div>
          </div>

          {/* Sub-Category Sliders */}
          <div className="sub-categories-grid">
            <div className="sub-category-item">
              <div className="sub-cat-label-row">
                <span>Punctuality &amp; Timing:</span>
                <strong>{punctuality}/5</strong>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={punctuality}
                onChange={(e) => setPunctuality(Number(e.target.value))}
                className="sub-cat-slider"
              />
            </div>

            <div className="sub-category-item">
              <div className="sub-cat-label-row">
                <span>Tajweed &amp; Phonetics Quality:</span>
                <strong>{tajweedExcellence}/5</strong>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={tajweedExcellence}
                onChange={(e) => setTajweedExcellence(Number(e.target.value))}
                className="sub-cat-slider"
              />
            </div>

            <div className="sub-category-item">
              <div className="sub-cat-label-row">
                <span>Patience &amp; Child Engagement:</span>
                <strong>{patienceWithChild}/5</strong>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={patienceWithChild}
                onChange={(e) => setPatienceWithChild(Number(e.target.value))}
                className="sub-cat-slider"
              />
            </div>

            <div className="sub-category-item">
              <div className="sub-cat-label-row">
                <span>Tarbiyah &amp; Moral Character:</span>
                <strong>{tarbiyahFocus}/5</strong>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={tarbiyahFocus}
                onChange={(e) => setTarbiyahFocus(Number(e.target.value))}
                className="sub-cat-slider"
              />
            </div>
          </div>

          {/* Billing Cycle / Review Month */}
          <div className="form-group-row">
            <label htmlFor="review-month-select">Review Period:</label>
            <select
              id="review-month-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="review-month-select"
            >
              <option value="October 2026">October 2026 (Current Month)</option>
              <option value="September 2026">September 2026</option>
              <option value="Post-Specific Exam">After Quarterly Hifz Exam</option>
            </select>
          </div>

          {/* Written Feedback Comments */}
          <div className="form-group-row">
            <label htmlFor="review-comment-text">Written Feedback &amp; Commendations:</label>
            <textarea
              id="review-comment-text"
              rows={4}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="review-textarea"
              placeholder="Share how your child is progressing, teacher's dedication, or any suggestions..."
              required
            />
          </div>

          {successMsg && (
            <div className="review-success-toast">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Icon name="check-circle" size={16} /> {successMsg}
              </span>
            </div>
          )}

          {/* Footer Submit */}
          <div className="review-modal-footer">
            <button
              type="button"
              className="btn-review-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-review-submit"
            >
              <Icon name="star" size={15} style={{ marginRight: 6 }} />
              {isSubmitting ? 'Submitting Review...' : 'Submit Verified Parent Review'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
