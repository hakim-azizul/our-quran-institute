import React from 'react';
import { Icon } from '../Icons';

export default function Spread5_Teacher({ onNext, onOpenBooking, side = 'both' }) {
  const leftContent = (
    <div className="spread-page spread-page-left teacher-portrait-page">
      <div className="teacher-portrait-card">
        <div
          className="teacher-portrait-image"
          style={{ backgroundImage: `url(/assets/teacher_portrait.jpg)` }}
        >
          <div className="portrait-gradient" />
          <div className="teacher-identity">
            <h3 className="teacher-name">Kazi Tayoubur Rahman</h3>
            <span className="teacher-role">LEAD QURAN MENTOR & IJAZAH HOLDER</span>
          </div>
        </div>
      </div>
    </div>
  );

  const rightContent = (
    <div className="spread-page spread-page-right teacher-support-page">
      <div className="support-copy">
        {/* Section label */}
        <div className="section-label">
          <div className="label-rule" />
          <span className="label-text">PERSONAL MENTORSHIP</span>
        </div>

        {/* Title */}
        <h2 className="spread-heading">
          Guidance that listens<br />
          before it corrects.
        </h2>

        {/* Description */}
        <p className="spread-desc">
          Learn 1-on-1 with certified scholars who nurture confidence, cultivate beautiful tajweed, and meet you with deep patience.
        </p>

        {/* Support features */}
        <div className="support-features-list">
          {/* Feature 1 */}
          <div className="support-feature-row">
            <div className="feature-icon-badge">
              <Icon name="message-square-more" size={18} color="#FFDF85" />
            </div>
            <div className="feature-copy">
              <h4 className="feature-title">1-on-1 Dedicated Mentorship</h4>
              <p className="feature-desc">Weekly private live sessions tailored specifically to your learning pace.</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="support-feature-row">
            <div className="feature-icon-badge">
              <Icon name="calendar-check" size={18} color="#FFDF85" />
            </div>
            <div className="feature-copy">
              <h4 className="feature-title">Flexible Global Scheduling</h4>
              <p className="feature-desc">Morning, evening, or weekend slots across all major global time zones.</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="support-feature-row">
            <div className="feature-icon-badge">
              <Icon name="circle-help" size={18} color="#FFDF85" />
            </div>
            <div className="feature-copy">
              <h4 className="feature-title">Anytime Voice Note Support</h4>
              <p className="feature-desc">Send quick voice notes between classes for instant pronunciation validation.</p>
            </div>
          </div>
        </div>

        {/* Support actions */}
        <div className="support-action-row">
          <button className="btn-gold-pill" onClick={onOpenBooking}>
            <span>Meet our teachers</span>
            <Icon name="users" size={17} color="#062A24" />
          </button>
          <div className="status-pill-warm">
            <span>120+ MENTORS</span>
          </div>
        </div>
      </div>

      {/* Page number */}
      <div className="page-number-tag">05</div>
    </div>
  );

  if (side === 'left') return leftContent;
  if (side === 'right') return rightContent;

  return (
    <div className="book-spread">
      <div className="book-page-edge" />
      <div className="book-center-gutter" />
      <div className="lifted-corner" onClick={onNext} title="Turn page" />
      {leftContent}
      {rightContent}
    </div>
  );
}
