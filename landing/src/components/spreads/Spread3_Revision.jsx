import React from 'react';
import { Icon } from '../Icons';

export default function Spread3_Revision({ onNext, side = 'both' }) {
  const leftContent = (
    <div className="spread-page spread-page-left revision-system">
      <div className="revision-copy">
        {/* Section label */}
        <div className="section-label">
          <div className="label-rule" />
          <span className="label-text light">SPACED REPETITION ENGINE</span>
        </div>

        {/* Title */}
        <h2 className="spread-heading light">
          Remember longer<br />
          with reviews that<br />
          arrive at the right<br />
          time.
        </h2>

        {/* Description */}
        <p className="spread-desc light">
          Our adaptive engine recalculates your forgetting curve with every session, presenting verses just as recall begins to fade.
        </p>

        {/* Action */}
        <button className="btn-outline-gold" onClick={onNext}>
          <span>Explore retention science</span>
          <Icon name="rotate-cw" size={17} color="#FBF6E9" />
        </button>
      </div>

      {/* Revision principle */}
      <div className="revision-principle">
        <div className="principle-badge-gold">
          <Icon name="shield-check" size={21} color="#062A24" />
        </div>
        <div className="principle-text-group">
          <h4 className="principle-title light">Guaranteed Long-Term Recall</h4>
          <p className="principle-desc light">
            Mathematical intervals prevent retroactive interference and cognitive drift.
          </p>
        </div>
      </div>
    </div>
  );

  const rightContent = (
    <div className="spread-page spread-page-right revision-schedule">
      {/* Schedule header */}
      <div className="schedule-header">
        <div className="schedule-title-group">
          <span className="schedule-kicker">INTERVAL REVIEW TIMELINE</span>
          <h3 className="schedule-title light">Spaced Review Cycles</h3>
        </div>
        <span className="schedule-confidence">98% Retained</span>
      </div>

      {/* Intervals with connecting timeline */}
      <div className="intervals-container">
        <div className="intervals-line" />
        
        <div className="review-interval">
          <div className="review-ring">
            <span className="ring-day light">1</span>
          </div>
          <span className="ring-label light">Immediate</span>
        </div>

        <div className="review-interval">
          <div className="review-ring active">
            <span className="ring-day gold">3</span>
          </div>
          <span className="ring-label active">Consolidate</span>
        </div>

        <div className="review-interval">
          <div className="review-ring">
            <span className="ring-day light">7</span>
          </div>
          <span className="ring-label light">Weekly Check</span>
        </div>

        <div className="review-interval">
          <div className="review-ring">
            <span className="ring-day light">14</span>
          </div>
          <span className="ring-label light">Deep Lock</span>
        </div>
      </div>

      {/* Revision Queue Card */}
      <div className="revision-queue-card">
        <div className="queue-heading">
          <h4 className="queue-title light">Active Review Queue</h4>
          <span className="queue-count gold">3 surahs ready</span>
        </div>

        {/* Queue Item 1 */}
        <div className="queue-item">
          <div className="queue-dot gold" />
          <span className="queue-item-title light">Surah Al-Waqi'ah (Ayah 1-30)</span>
          <span className="queue-item-state light">Due Today</span>
          <span className="queue-item-time gold">12m</span>
        </div>

        {/* Queue Item 2 */}
        <div className="queue-item">
          <div className="queue-dot green" />
          <span className="queue-item-title light">Surah Ar-Rahman (Complete)</span>
          <span className="queue-item-state light">Tomorrow</span>
          <span className="queue-item-time gold">15m</span>
        </div>

        {/* Queue Item 3 */}
        <div className="queue-item">
          <div className="queue-dot green" />
          <span className="queue-item-title light">Surah Yasin (Ruku 1-2)</span>
          <span className="queue-item-state light">In 3 Days</span>
          <span className="queue-item-time gold">10m</span>
        </div>
      </div>

      {/* Page number */}
      <div className="page-number-tag gold">03</div>
    </div>
  );

  if (side === 'left') return leftContent;
  if (side === 'right') return rightContent;

  return (
    <div className="book-spread dark-spread">
      <div className="book-page-edge dark-edge" />
      <div className="book-center-gutter dark-gutter" />
      <div className="lifted-corner dark-corner" onClick={onNext} title="Turn page" />
      {leftContent}
      {rightContent}
    </div>
  );
}
