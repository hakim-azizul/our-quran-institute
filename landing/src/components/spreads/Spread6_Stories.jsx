import React, { useState } from 'react';
import { DiamondOrnament, Icon } from '../Icons';
import GlobalWorldMap from './GlobalWorldMap';

export default function Spread6_Stories({ onNext, side = 'both' }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [rightPageView, setRightPageView] = useState('map'); // 'map' | 'stories'

  const leftContent = (
    <div className="spread-page spread-page-left stories-left-page">
      {/* Header */}
      <div className="stories-header">
        <div className="stories-copy">
          <div className="section-label">
            <div className="label-rule" />
            <span className="label-text">STORIES OF DEVOTION</span>
          </div>
          <h2 className="stories-title">
            Different lives.<br />
            One steady practice.
          </h2>
          <p className="stories-desc">
            Real stories of busy schedules, family barakah, and steady memorization across 38 countries.
          </p>
        </div>
        <DiamondOrnament size={44} diamondSize={24} centerColor="#0D4B3E" borderColor="#C5A45A" />
      </div>

      {/* Featured Deep-Dive Story: Dr. Sarah Mansoor */}
      <div className="featured-journey-card">
        {/* Corner gold ornaments */}
        <div className="card-gold-corner top-left" />
        <div className="card-gold-corner top-right" />

        {/* Author Header */}
        <div className="journey-card-header">
          <div className="journey-author-profile">
            <div className="journey-avatar-wrapper">
              <img
                src="/assets/student_sarah.jpg"
                alt="Dr. Sarah Mansoor"
                className="journey-avatar-img"
              />
              <span className="avatar-verified-badge" title="Verified Hifz Student">
                <Icon name="check" size={10} color="#062A24" />
              </span>
            </div>
            <div className="journey-author-info">
              <div className="author-name-row">
                <h3 className="journey-author-name">Dr. Sarah Mansoor</h3>
                <span className="story-stars">★★★★★</span>
              </div>
              <span className="journey-author-role">Pediatrician &amp; Hifz Student · London, UK</span>
            </div>
          </div>
          <div className="journey-milestone-chip">
            <Icon name="award" size={13} color="#9F7C35" />
            <span>18 Ajza' Memorized</span>
          </div>
        </div>

        {/* Story Title & Quote */}
        <div className="journey-quote-block">
          <h4 className="journey-case-headline">
            “Balancing 80-Hour Hospital Shifts with Daily Surah Retention”
          </h4>
          <p className="journey-quote-text">
            The 15-minute daily structure fit seamlessly into my medical residency. I never thought Hifz was possible with grueling hospital shifts until this method gave me sustainable barakah.
          </p>
        </div>

        {/* 3-Column Habit Dashboard */}
        <div className="journey-habit-grid">
          <div className="habit-stat-box">
            <span className="habit-label">DAILY TIME</span>
            <span className="habit-value">15–20 min</span>
            <span className="habit-sub">Before morning rounds</span>
          </div>
          <div className="habit-stat-box">
            <span className="habit-label">RETENTION</span>
            <span className="habit-value">99.2%</span>
            <span className="habit-sub">Spaced review score</span>
          </div>
          <div className="habit-stat-box">
            <span className="habit-label">CONSISTENCY</span>
            <span className="habit-value">420 Days</span>
            <span className="habit-sub">Unbroken daily rhythm</span>
          </div>
        </div>

        {/* Mentor Endorsement Quote */}
        <div className="mentor-callout-note">
          <span className="mentor-note-tag">Ustadh's Observation</span>
          <p className="mentor-note-text">
            “Sarah's discipline with 5-verse spaced review before morning rounds exemplifies true intentionality over haste.”
          </p>
        </div>

        {/* Audio Recitation Snippet */}
        <div
          className={`recitation-audio-bar ${isPlayingAudio ? 'is-playing' : ''}`}
          onClick={() => setIsPlayingAudio(!isPlayingAudio)}
          role="button"
          tabIndex={0}
        >
          <div className="recitation-play-circle">
            <Icon name={isPlayingAudio ? 'audio-lines' : 'play'} size={13} color="#062A24" />
          </div>
          <div className="recitation-meta">
            <span className="recitation-title">Sarah's recitation: Surah Maryam (1–15)</span>
            <div className="recitation-wave-track">
              {[40, 65, 85, 45, 95, 70, 30, 80, 100, 60, 45, 90, 75, 50, 85, 60, 95, 40, 70, 55, 80, 45].map((h, i) => (
                <span
                  key={i}
                  className="wave-bar"
                  style={{
                    height: `${isPlayingAudio ? Math.max(20, (h * Math.sin((i + 1) * 0.8) + 100) % 100) : h * 0.65}%`,
                    animationDelay: `${i * 0.05}s`
                  }}
                />
              ))}
            </div>
          </div>
          <span className="recitation-duration">0:42 / 2:18</span>
        </div>
      </div>

      {/* Community Proof Strip */}
      <div className="stories-community-strip">
        <div className="community-avatars-stack">
          <img src="/assets/student_sarah.jpg" alt="Student" className="mini-stack-avatar" />
          <img src="/assets/student_tariq.jpg" alt="Student" className="mini-stack-avatar" />
          <img src="/assets/student_zaynab.jpg" alt="Student" className="mini-stack-avatar" />
          <div className="mini-stack-more">+1.4k</div>
        </div>
        <p className="community-strip-text">
          Join <strong>1,400+ active students</strong> across 38 countries maintaining a 94% retention streak.
        </p>
      </div>
    </div>
  );

  const rightContent = (
    <div className={`spread-page spread-page-right stories-right-page ${rightPageView === 'map' ? 'full-map-mode' : ''}`}>
      {/* Top View Mode Switcher Pill - shown when in stories mode */}
      {rightPageView === 'stories' && (
        <div className="stories-view-switch-bar">
          <div className="view-switch-pills">
            <button
              className="view-switch-btn"
              onClick={() => setRightPageView('map')}
            >
              <span>✦ World Map (42 Countries)</span>
            </button>
            <button
              className="view-switch-btn active"
              onClick={() => setRightPageView('stories')}
            >
              <span>✦ Student Voices</span>
            </button>
          </div>
        </div>
      )}

      {rightPageView === 'map' ? (
        <GlobalWorldMap rightPageView={rightPageView} onToggleView={setRightPageView} />
      ) : (
        <div className="stories-right-stack">
          {/* Story 2: Tariq Rahim (Emerald Card) */}
          <div className="journey-card-compact emerald-card">
            <div className="compact-card-header">
              <div className="journey-author-profile">
                <div className="journey-avatar-wrapper">
                  <img
                    src="/assets/student_tariq.jpg"
                    alt="Tariq Rahim"
                    className="journey-avatar-img"
                  />
                  <span className="avatar-verified-badge gold" title="Verified Student">
                    <Icon name="check" size={10} color="#062A24" />
                  </span>
                </div>
                <div className="journey-author-info">
                  <div className="author-name-row">
                    <h3 className="journey-author-name light">Tariq Rahim</h3>
                    <span className="story-stars gold-stars">★★★★★</span>
                  </div>
                  <span className="journey-author-role light">Software Architect · Toronto, Canada</span>
                </div>
              </div>
              <div className="journey-milestone-chip gold-chip">
                <Icon name="sparkles" size={12} color="#C5A45A" />
                <span>14 Ajza' Memorized</span>
              </div>
            </div>

            <div className="compact-story-body">
              <h5 className="compact-case-title light">“The Cognitive Architecture of Spaced Hifz”</h5>
              <p className="compact-quote-text light">
                “The spaced repetition review engine eliminated all the cognitive anxiety of forgetting. It treats memorization like a living neural garden rather than brute-force cramming.”
              </p>
            </div>

            <div className="compact-routine-pill dark-pill">
              <Icon name="timer" size={12} color="#C5A45A" />
              <span>Rhythm: Morning coffee + 20 min review before standup</span>
            </div>
          </div>

          {/* Story 3: Zaynab Nour (Parchment Card) */}
          <div className="journey-card-compact cream-card">
            <div className="compact-card-header">
              <div className="journey-author-profile">
                <div className="journey-avatar-wrapper">
                  <img
                    src="/assets/student_zaynab.jpg"
                    alt="Zaynab Nour"
                    className="journey-avatar-img"
                  />
                  <span className="avatar-verified-badge" title="Verified Student">
                    <Icon name="check" size={10} color="#062A24" />
                  </span>
                </div>
                <div className="journey-author-info">
                  <div className="author-name-row">
                    <h3 className="journey-author-name">Zaynab Nour</h3>
                    <span className="story-stars">★★★★★</span>
                  </div>
                  <span className="journey-author-role">Educator &amp; Mother · Melbourne, AU</span>
                </div>
              </div>
              <div className="journey-milestone-chip">
                <Icon name="award" size={12} color="#9F7C35" />
                <span>Full Quran (Hafidha)</span>
              </div>
            </div>

            <div className="compact-story-body">
              <h5 className="compact-case-title">“Memorizing Alongside My Children”</h5>
              <p className="compact-quote-text">
                “Starting as an adult with three young children felt daunting. My mentor taught me that 10 mindful minutes with presence is worth hours of distracted recitation.”
              </p>
            </div>

            <div className="compact-routine-pill light-pill">
              <Icon name="book-open" size={12} color="#0D4B3E" />
              <span>Rhythm: Reciting 1 page with children at bedtime</span>
            </div>
          </div>

          {/* Global Impact Summary Bar */}
          <div className="global-practice-metrics-bar">
            <div className="global-metric-item">
              <span className="global-metric-num">42</span>
              <span className="global-metric-label">Countries</span>
            </div>
            <div className="global-metric-divider" />
            <div className="global-metric-item">
              <span className="global-metric-num">1.8M</span>
              <span className="global-metric-label">Verses Revised</span>
            </div>
            <div className="global-metric-divider" />
            <div className="global-metric-item">
              <span className="global-metric-num">98.4%</span>
              <span className="global-metric-label">Retention Rate</span>
            </div>
            <div className="global-metric-divider" />
            <div className="global-metric-item">
              <span className="global-metric-num">320+</span>
              <span className="global-metric-label">Huffadh Certified</span>
            </div>
          </div>
        </div>
      )}

      {/* Page number */}
      <div className="page-number-tag">06</div>
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
