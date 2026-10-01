import React from 'react';
import { Icon } from '../Icons';
import CalligraphyWritingStage from '../CalligraphyWritingStage';

export default function Spread0_Hero({
  onNext,
  onOpenBooking,
  onWatchVideo,
  side = 'both',
  isWriting = true
}) {
  const writeClass = isWriting ? 'ink-write-active' : '';

  const leftContent = (
    <div className={`spread-page spread-page-left opening-page ${writeClass}`}>
      <div className="hero-copy">
        {/* Kicker */}
        <div className="kicker-group">
          <div className="kicker-rule" />
          <span className="kicker-label">A COMPLETE ONLINE ISLAMIC LEARNING JOURNEY</span>
        </div>

        {/* Title */}
        <h1 className="hero-title">
          Open the book.<br />
          Begin a journey<br />
          that stays with<br />
          you.
        </h1>

        {/* Description */}
        <p className="hero-description">
          Our Quran Institute brings structured Quran memorization (Hifz), Tajweed mastery, Quranic Arabic, and authentic Islamic Studies under the patient 1-on-1 guidance of certified scholars from Al-Azhar.
        </p>

        {/* Hero Actions */}
        <div className="hero-actions">
          <button className="btn-gold-pill" onClick={onOpenBooking}>
            <span>Book Assessment</span>
            <Icon name="arrow-right" size={15} color="#062A24" />
          </button>
          <button className="btn-cream-pill" onClick={onNext}>
            <span>Explore Programs</span>
            <Icon name="book-open" size={15} color="#062A24" />
          </button>
        </div>
      </div>

      {/* Trust Signals */}
      <div className="trust-signals">
        <div className="trust-divider" />
        <div className="trust-details">
          <div className="trust-pill"><span>Al-Azhar Scholars</span></div>
          <div className="trust-pill"><span>1-on-1 Live Mentorship</span></div>
          <div className="trust-pill"><span>Connected Sanad Chains</span></div>
        </div>
      </div>
    </div>
  );

  const rightContent = (
    <div className={`spread-page spread-page-right illustrated-page ${writeClass}`}>
      <div
        className="book-still-life"
        style={{ backgroundImage: `url(/assets/hero_stand_book.png)` }}
      >
        {/* Image Veil from Figma */}
        <div className="image-veil" />

        {/* Gold Glint from Figma */}
        <div className="gold-glint" />

        {/* Realistic Calligraphy Writing on the Open Antique Book Pages */}
        <CalligraphyWritingStage isWriting={isWriting} />

        {/* Promise Card from Figma: "01 One page at a time" */}
        <div className="promise-card">
          <div className="day-marker">
            <span className="day-number">01</span>
          </div>
          <div className="promise-copy">
            <h4 className="promise-title">One page at a time</h4>
            <p className="promise-description">
              A steady method shaped around your pace and responsibilities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (side === 'left') return leftContent;
  if (side === 'right') return rightContent;

  return (
    <div className={`book-spread hero-spread ${writeClass}`}>
      <div className="book-page-edge" />
      <div className="book-center-gutter" />
      {leftContent}
      {rightContent}
    </div>
  );
}

