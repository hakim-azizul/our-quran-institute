'use client';

import React, { useState } from 'react';
import { Icon } from './Icons';

export default function SpiritualHomeSection({ onOpenBooking, onDiscoverMore }) {
  const [activeTab, setActiveTab] = useState('mission'); // 'mission' | 'vision'

  return (
    <div className="spiritual-home-section" aria-label="Our Spiritual Home and Vision">
      {/* Background Soft Organic Waves */}
      <div className="spiritual-home-bg-decor" aria-hidden="true">
        <div className="spiritual-glow-left" />
        <div className="spiritual-glow-right" />
        <div className="spiritual-curve-backdrop" />
      </div>

      <div className="spiritual-home-container">
        {/* Left Column: Multi-Cusped Islamic Arches & Scholar Portrait Composite */}
        <div className="spiritual-arches-stage">
          <div className="spiritual-arches-composition">
            {/* 1. Realistic Palm Leaves peeking from the bottom left */}
            <div className="spiritual-palm-leaves-wrap" aria-hidden="true">
              <img
                src="/assets/palm_leaves.png"
                alt=""
                className="spiritual-palm-leaves-img"
                loading="lazy"
              />
            </div>

            {/* 2. Large 10-Lobed Islamic Polylobed Arch Frame with Mosque Courtyard */}
            <div className="large-scalloped-arch-frame">
              <svg
                viewBox="0 0 500 580"
                className="large-arch-svg"
                preserveAspectRatio="xMidYMid meet"
                aria-label="Islamic Mosque Courtyard Sanctuary Arches"
              >
                <defs>
                  {/* Volumetric Drop Shadow for the Main Arch */}
                  <filter id="largeArchVolumetricShadow" x="-15%" y="-15%" width="135%" height="135%">
                    <feDropShadow dx="0" dy="16" stdDeviation="22" floodColor="#0A2C1D" floodOpacity="0.18" />
                  </filter>

                  {/* Inner Image Clipping Path */}
                  <clipPath id="largeArchInnerClip">
                    <path d="
                      M 250,56
                      C 264,66 296,80 324,118
                      C 336,136 352,130 368,154
                      C 388,182 402,204 398,236
                      C 394,250 406,258 418,272
                      C 436,293 436,315 420,338
                      C 408,356 394,360 386,380
                      C 376,408 358,432 336,448
                      C 320,460 306,462 290,478
                      C 274,494 260,508 250,514
                      C 240,508 226,494 210,478
                      C 194,462 180,460 164,448
                      C 142,432 124,408 114,380
                      C 106,360 92,356 80,338
                      C 64,315 64,293 82,272
                      C 94,258 106,250 102,236
                      C 98,204 112,182 132,154
                      C 148,130 164,136 176,118
                      C 204,80 236,66 250,56 Z
                    " />
                  </clipPath>
                </defs>

                {/* Outer Border: Vibrant Leaf Green Border matching reference */}
                <path
                  d="
                    M 250,38
                    C 264,48 298,62 328,104
                    C 342,124 358,118 376,142
                    C 398,172 414,196 410,232
                    C 406,248 420,256 434,272
                    C 454,295 454,320 436,346
                    C 422,366 406,370 398,392
                    C 386,424 366,450 342,468
                    C 324,482 308,484 290,502
                    C 272,520 258,536 250,542
                    C 242,536 228,520 210,502
                    C 192,484 176,482 158,468
                    C 134,450 114,424 102,392
                    C 94,370 78,366 64,346
                    C 46,320 46,295 66,272
                    C 80,256 94,248 90,232
                    C 86,196 102,172 124,142
                    C 142,118 158,124 172,104
                    C 202,62 236,48 250,38 Z
                  "
                  fill="#78A52F"
                  filter="url(#largeArchVolumetricShadow)"
                />

                {/* Inner Clipped Sandstone Mosque Courtyard Image */}
                <g clipPath="url(#largeArchInnerClip)">
                  <image
                    href="/assets/mosque_courtyard_arches.jpg"
                    x="0"
                    y="0"
                    width="500"
                    height="580"
                    preserveAspectRatio="xMidYMid slice"
                  />
                  {/* Warm amber sunlight atmospheric tint */}
                  <rect
                    x="0"
                    y="0"
                    width="500"
                    height="580"
                    fill="rgba(212, 175, 55, 0.04)"
                  />
                </g>
              </svg>
            </div>

            {/* 3. Smaller Overlapping Scalloped Arch Frame with Scholar Portrait */}
            <div className="scholar-scalloped-overlay-frame">
              <svg
                viewBox="0 0 500 580"
                className="scholar-arch-svg"
                preserveAspectRatio="xMidYMid meet"
                aria-label="Al-Azhar Certified Scholar Mentor Portrait"
              >
                <defs>
                  <filter id="scholarArchShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="12" stdDeviation="18" floodColor="#0A2C1D" floodOpacity="0.26" />
                  </filter>
                  <clipPath id="scholarArchInnerClip">
                    <path d="
                      M 250,56
                      C 264,66 296,80 324,118
                      C 336,136 352,130 368,154
                      C 388,182 402,204 398,236
                      C 394,250 406,258 418,272
                      C 436,293 436,315 420,338
                      C 408,356 394,360 386,380
                      C 376,408 358,432 336,448
                      C 320,460 306,462 290,478
                      C 274,494 260,508 250,514
                      C 240,508 226,494 210,478
                      C 194,462 180,460 164,448
                      C 142,432 124,408 114,380
                      C 106,360 92,356 80,338
                      C 64,315 64,293 82,272
                      C 94,258 106,250 102,236
                      C 98,204 112,182 132,154
                      C 148,130 164,136 176,118
                      C 204,80 236,66 250,56 Z
                    " />
                  </clipPath>
                </defs>

                {/* Thick Pure White Border & Drop Shadow matching reference */}
                <path
                  d="
                    M 250,38
                    C 264,48 298,62 328,104
                    C 342,124 358,118 376,142
                    C 398,172 414,196 410,232
                    C 406,248 420,256 434,272
                    C 454,295 454,320 436,346
                    C 422,366 406,370 398,392
                    C 386,424 366,450 342,468
                    C 324,482 308,484 290,502
                    C 272,520 258,536 250,542
                    C 242,536 228,520 210,502
                    C 192,484 176,482 158,468
                    C 134,450 114,424 102,392
                    C 94,370 78,366 64,346
                    C 46,320 46,295 66,272
                    C 80,256 94,248 90,232
                    C 86,196 102,172 124,142
                    C 142,118 158,124 172,104
                    C 202,62 236,48 250,38 Z
                  "
                  fill="#FFFFFF"
                  stroke="#E8F1D8"
                  strokeWidth="3"
                  filter="url(#scholarArchShadow)"
                />

                {/* Scholar Image Clipped Inside Arch */}
                <g clipPath="url(#scholarArchInnerClip)">
                  <image
                    href="/assets/sheikh_scholar_portrait.jpg"
                    x="-20"
                    y="-15"
                    width="540"
                    height="595"
                    preserveAspectRatio="xMidYMid slice"
                  />
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Typography, Vision Tabs, Bracket Quote Box, CTA */}
        <div className="spiritual-copy-column">
          {/* 1. Header Kicker Pill matching reference */}
          <div className="spiritual-welcome-badge">
            <span className="welcome-badge-dot">●</span>
            <span className="welcome-badge-text">Welcome to the islamic center</span>
          </div>

          {/* 2. Main Editorial Serif Heading matching reference */}
          <h2 className="spiritual-main-title">
            Your Spiritual Home Guided<br className="desktop-br" />
            by the Qur'an and Sunnah
          </h2>

          {/* 3. Concise, Lower-Text Narrative */}
          <p className="spiritual-lead-desc">
            Guided by certified Al-Azhar scholars, Our Quran Institute nurtures authentic recitation,
            tajweed precision, and deep spiritual connection — rooted in living Isnad chains
            and compassionate 1-on-1 mentorship.
          </p>

          {/* 4. Interactive Tabs: Our Mission | Our Vision */}
          <div className="spiritual-tabs-row" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'mission'}
              className={`spiritual-tab-btn tab-mission ${activeTab === 'mission' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('mission')}
            >
              <span>Our Mission</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'vision'}
              className={`spiritual-tab-btn tab-vision ${activeTab === 'vision' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('vision')}
            >
              <span>Our Vision</span>
            </button>
          </div>

          {/* 5. Sanctuary Card matching Course & Feature Cards */}
          <div className="spiritual-quote-box-wrap">
            <div className="spiritual-sanctuary-card">
              {/* Card Header */}
              <div className="spiritual-card-header">
                <div className="spiritual-card-tag-pill">
                  <span>{activeTab === 'mission' ? '✦ SACRED MISSION' : '✦ SACRED VISION'}</span>
                </div>
                <div className="spiritual-card-badge">
                  <span className="card-badge-dot">●</span>
                  <span>{activeTab === 'mission' ? 'Al-Azhar Verified Sanad' : '42 Nations Connected'}</span>
                </div>
              </div>

              {/* Card Title & Content */}
              <div className="spiritual-card-body">
                <h3 className="spiritual-card-title">
                  {activeTab === 'mission'
                    ? 'Authentic Quranic Transmission & Steadfast Hifz'
                    : 'Illuminating Every Household Through the Qur\'an'}
                </h3>

                <p className="spiritual-card-desc">
                  {activeTab === 'mission'
                    ? "To empower seekers of all ages worldwide to recite, understand, and memorize the Holy Qur'an with verified Al-Azhar Sanad transmission, tajweed mastery, and steadfast daily consistency."
                    : "To build a global community of grounded souls and confident Huffaz, where sacred Quranic literacy illuminates every household through excellence, reverence, and lifelong barakah."}
                </p>

                {/* 3 Pillar Feature Bullets */}
                <div className="spiritual-card-pillars">
                  {activeTab === 'mission' ? (
                    <>
                      <div className="card-pillar-item">
                        <span className="pillar-check">✦</span>
                        <span>1-on-1 Al-Azhar Scholars</span>
                      </div>
                      <div className="card-pillar-item">
                        <span className="pillar-check">✦</span>
                        <span>Tajweed Precision</span>
                      </div>
                      <div className="card-pillar-item">
                        <span className="pillar-check">✦</span>
                        <span>Daily Live Halqas</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="card-pillar-item">
                        <span className="pillar-check">✦</span>
                        <span>Confident Global Huffaz</span>
                      </div>
                      <div className="card-pillar-item">
                        <span className="pillar-check">✦</span>
                        <span>Living Prophetic Akhlaq</span>
                      </div>
                      <div className="card-pillar-item">
                        <span className="pillar-check">✦</span>
                        <span>Lifelong Barakah</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Card Progress / Transmission Footer matching Course Cards */}
                <div className="spiritual-card-footer">
                  <div className="card-progress-section">
                    <div className="card-progress-bar-bg">
                      <div
                        className="card-progress-bar-fill"
                        style={{ width: activeTab === 'mission' ? '88%' : '94%' }}
                      >
                        <div className="progress-fill-glow-dot" />
                      </div>
                    </div>
                  </div>
                  <div className="spiritual-card-meta">
                    <span className="meta-text">
                      {activeTab === 'mission'
                        ? 'Connected directly to unbroken prophetic Isnad chains'
                        : 'Over 1,714+ students and families learning worldwide'}
                    </span>
                    <span className="meta-stat">
                      {activeTab === 'mission' ? '100% Sanad' : '42 Nations'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 6. Discover More CTA Button */}
          <div className="spiritual-cta-row">
            <button
              type="button"
              className="spiritual-discover-btn"
              onClick={onDiscoverMore || onOpenBooking}
            >
              <span className="discover-btn-label">Discover More</span>
              <span className="discover-btn-arrow-circle">
                <Icon name="arrow-up-right" size={14} color="#0A2E20" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
