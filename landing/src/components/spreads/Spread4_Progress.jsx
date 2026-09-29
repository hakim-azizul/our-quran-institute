import React from 'react';
import { Icon } from '../Icons';

export default function Spread4_Progress({ onNext, side = 'both' }) {
  const chartDays = [
    { day: 'M', height: 38, isGold: false },
    { day: 'T', height: 54, isGold: false },
    { day: 'W', height: 72, isGold: false },
    { day: 'T', height: 46, isGold: false },
    { day: 'F', height: 84, isGold: false },
    { day: 'S', height: 68, isGold: false },
    { day: 'S', height: 92, isGold: true }
  ];

  const leftContent = (
    <div className="spread-page spread-page-left progress-overview">
      {/* Section label */}
      <div className="section-label">
        <div className="label-rule" />
        <span className="label-text">PROGRESS TRACKING</span>
      </div>

      {/* Overview heading */}
      <div className="overview-heading">
        <div className="heading-copy">
          <h2 className="overview-title">See effort become<br />consistency.</h2>
          <p className="overview-desc">
            Quiet, meaningful metrics that honor your effort and celebrate steady growth.
          </p>
        </div>
        <div className="status-pill-dark">
          <span>LIVE DATA</span>
        </div>
      </div>

      {/* 3 Metrics */}
      <div className="metrics-row">
        <div className="metric-box">
          <span className="metric-value">24</span>
          <span className="metric-label">Surahs Mastered</span>
          <span className="metric-note">Full retention verified</span>
        </div>
        <div className="metric-box">
          <span className="metric-value">94%</span>
          <span className="metric-label">Retention Score</span>
          <span className="metric-note">Interval verified</span>
        </div>
        <div className="metric-box">
          <span className="metric-value">142</span>
          <span className="metric-label">Day Streak</span>
          <span className="metric-note">Unbroken connection</span>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="weekly-chart-card">
        <div className="chart-heading">
          <span className="chart-title">WEEKLY CONSISTENCY</span>
          <span className="chart-summary">7.4 hrs logged</span>
        </div>
        <div className="chart-bars">
          {chartDays.map((item, idx) => (
            <div key={idx} className="chart-day-col">
              <div
                className={`chart-bar ${item.isGold ? 'gold-bar' : ''}`}
                style={{ height: `${item.height}px` }}
                title={`${item.day}: ${item.height} min`}
              />
              <span className="chart-day-label">{item.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const rightContent = (
    <div className="spread-page spread-page-right progress-insight">
      {/* Insight card */}
      <div className="insight-card">
        <div className="insight-header">
          <div className="insight-label-group">
            <Icon name="sparkles" size={19} color="#C5A45A" />
            <span className="insight-kicker">MILESTONE INSIGHT</span>
          </div>
          <span className="insight-date">THIS WEEK</span>
        </div>
        <h3 className="insight-title">Your recall latency dropped by 38%.</h3>
        <p className="insight-desc">
          Surah Al-Kahf verses 1-20 are now locked into long-term memory with zero hesitations.
        </p>
        <div className="insight-divider" />
        <button className="insight-action-btn" onClick={onNext}>
          <span>View detailed breakdown</span>
          <Icon name="arrow-right" size={15} color="#C5A45A" />
        </button>
      </div>

      {/* Milestones list */}
      <div className="milestones-container">
        <span className="milestones-header-title">RECENT MILESTONES</span>

        {/* Milestone 1 */}
        <div className="milestone-row">
          <div className="milestone-badge">
            <Icon name="award" size={17} color="#0D4B3E" />
          </div>
          <span className="milestone-text">Juz' Amma Completion Verified</span>
          <span className="milestone-status">COMPLETED</span>
        </div>

        {/* Milestone 2 */}
        <div className="milestone-row">
          <div className="milestone-badge">
            <Icon name="message-circle-check" size={17} color="#0D4B3E" />
          </div>
          <span className="milestone-text">Monthly Ustadha Assessment</span>
          <span className="milestone-status">PASSED</span>
        </div>

        {/* Milestone 3 */}
        <div className="milestone-row">
          <div className="milestone-badge">
            <Icon name="trending-up" size={17} color="#0D4B3E" />
          </div>
          <span className="milestone-text">100-Day Consistency Shield</span>
          <span className="milestone-status">ACHIEVED</span>
        </div>
      </div>

      {/* Page number */}
      <div className="page-number-tag">04</div>
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
