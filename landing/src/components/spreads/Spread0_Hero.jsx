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
          <span className="kicker-label">A THOUGHTFUL PATH TO QURAN MEMORIZATION</span>
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
          Hifz Journey brings daily memorization, intelligent revision, and caring teacher guidance into one calm, consistent learning rhythm.
        </p>

        {/* Hero Actions */}
        <div className="hero-actions">
          <button className="btn-gold-pill" onClick={onOpenBooking}>
            <span>Start your assessment</span>
            <Icon name="arrow-right" size={17} color="#062A24" />
          </button>
          <button className="btn-cream-pill" onClick={onWatchVideo}>
            <span>See how it works</span>
            <Icon name="play" size={17} color="#062A24" />
          </button>
        </div>
      </div>

      {/* Trust Signals */}
      <div className="trust-signals">
        <div className="trust-divider" />
        <div className="trust-details">
          <div className="trust-pill"><span>7-day trial</span></div>
          <div className="trust-pill"><span>Teacher reviewed</span></div>
          <div className="trust-pill"><span>Built for consistency</span></div>
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

