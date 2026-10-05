import React, { useState } from 'react';
import { DiamondOrnament, Icon } from '../Icons';
import GlobalWorldMap from './GlobalWorldMap';

export default function Spread6_Stories({ onNext, side = 'both' }) {
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'stories'

  return (
    <div className="section-stories-container">
      {/* 1. Section Header */}
      <div className="stories-section-header">
        <div className="stories-header-left">
          <div className="section-label">
            <div className="label-rule" />
            <span className="label-text">GLOBAL FELLOWSHIP &bull; 42 COUNTRIES ACTIVE</span>
          </div>
          <h2 className="spread-heading">
            Different lives.<br />
            One steady practice.
          </h2>
          <p className="spread-desc">
            Real stories of busy schedules, family barakah, and steady memorization across 42 countries worldwide.
          </p>
        </div>

        <div className="stories-header-right">
          {/* View Mode Switcher */}
          <div className="stories-mode-switch-pills">
            <button
              className={`mode-pill ${viewMode === 'map' ? 'active' : ''}`}
              onClick={() => setViewMode('map')}
            >
              <Icon name="compass" size={14} color="currentColor" />
              <span>✦ Global World Map</span>
            </button>
            <button
              className={`mode-pill ${viewMode === 'stories' ? 'active' : ''}`}
              onClick={() => setViewMode('stories')}
            >
              <Icon name="sparkles" size={14} color="currentColor" />
              <span>✦ Student Voices</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Content Stage */}
      {viewMode === 'map' ? (
        /* FULL-WIDTH EXPANDED MODERN SOLID-COLOR WORLD MAP */
        <div className="fullwidth-world-map-wrapper">
          <GlobalWorldMap rightPageView={viewMode} />
        </div>
      ) : (
        /* FULL 3-COLUMN STUDENT VOICES GRID */
        <div className="stories-grid-container">
          {/* Story 1: Dr. Sarah Mansoor */}
          <div className="journey-card-compact emerald-card">
            <div className="compact-card-header">
              <div className="journey-author-profile">
                <div className="journey-avatar-wrapper">
                  <img
                    src="/assets/student_sarah.jpg"
                    alt="Dr. Sarah Mansoor"
                    className="journey-avatar-img"
                  />
                  <span className="avatar-verified-badge gold">
                    <Icon name="check" size={10} color="#062A24" />
                  </span>
                </div>
                <div className="journey-author-info">
                  <div className="author-name-row">
                    <h3 className="journey-author-name light">Dr. Sarah Mansoor</h3>
                    <span className="story-stars gold-stars">★★★★★</span>
                  </div>
                  <span className="journey-author-role light">Pediatrician &bull; London, UK</span>
                </div>
              </div>
              <div className="journey-milestone-chip gold-chip">
                <Icon name="award" size={12} color="#C5A45A" />
                <span>18 Ajza'</span>
              </div>
            </div>

            <div className="compact-story-body">
              <h5 className="compact-case-title light">“80-Hour Shifts to Daily Barakah”</h5>
              <p className="compact-quote-text light">
                “The 15-minute daily structure fit seamlessly into my medical residency. I never thought Hifz was possible until this method gave me steady recall.”
              </p>
            </div>

            <div className="compact-routine-pill dark-pill">
              <Icon name="timer" size={12} color="#C5A45A" />
              <span>Rhythm: 15 min review before morning hospital rounds</span>
            </div>
          </div>

          {/* Story 2: Tariq Rahim */}
          <div className="journey-card-compact emerald-card">
            <div className="compact-card-header">
              <div className="journey-author-profile">
                <div className="journey-avatar-wrapper">
                  <img
                    src="/assets/student_tariq.jpg"
                    alt="Tariq Rahim"
                    className="journey-avatar-img"
                  />
                  <span className="avatar-verified-badge gold">
                    <Icon name="check" size={10} color="#062A24" />
                  </span>
                </div>
                <div className="journey-author-info">
                  <div className="author-name-row">
                    <h3 className="journey-author-name light">Tariq Rahim</h3>
                    <span className="story-stars gold-stars">★★★★★</span>
                  </div>
                  <span className="journey-author-role light">Software Architect &bull; Toronto, Canada</span>
                </div>
              </div>
              <div className="journey-milestone-chip gold-chip">
                <Icon name="sparkles" size={12} color="#C5A45A" />
                <span>14 Ajza'</span>
              </div>
            </div>

            <div className="compact-story-body">
              <h5 className="compact-case-title light">“Cognitive Architecture of Spaced Hifz”</h5>
              <p className="compact-quote-text light">
                “The spaced review engine eliminated all the anxiety of forgetting. It treats memorization like a living neural garden rather than brute-force cramming.”
              </p>
            </div>

            <div className="compact-routine-pill dark-pill">
              <Icon name="timer" size={12} color="#C5A45A" />
              <span>Rhythm: Morning coffee + 20 min review before standup</span>
            </div>
          </div>

          {/* Story 3: Zaynab Nour */}
          <div className="journey-card-compact emerald-card">
            <div className="compact-card-header">
              <div className="journey-author-profile">
                <div className="journey-avatar-wrapper">
                  <img
                    src="/assets/student_zaynab.jpg"
                    alt="Zaynab Nour"
                    className="journey-avatar-img"
                  />
                  <span className="avatar-verified-badge gold">
                    <Icon name="check" size={10} color="#062A24" />
                  </span>
                </div>
                <div className="journey-author-info">
                  <div className="author-name-row">
                    <h3 className="journey-author-name light">Zaynab Nour</h3>
                    <span className="story-stars gold-stars">★★★★★</span>
                  </div>
                  <span className="journey-author-role light">Educator &amp; Mother &bull; Melbourne, AU</span>
                </div>
              </div>
              <div className="journey-milestone-chip gold-chip">
                <Icon name="award" size={12} color="#C5A45A" />
                <span>Full Quran (Hafidha)</span>
              </div>
            </div>

            <div className="compact-story-body">
              <h5 className="compact-case-title light">“Memorizing Alongside My Children”</h5>
              <p className="compact-quote-text light">
                “Starting as an adult with three young children felt daunting. My mentor taught me that 10 mindful minutes with presence is worth hours of distracted recitation.”
              </p>
            </div>

            <div className="compact-routine-pill dark-pill">
              <Icon name="book-open" size={12} color="#C5A45A" />
              <span>Rhythm: Reciting 1 page with children at bedtime</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
