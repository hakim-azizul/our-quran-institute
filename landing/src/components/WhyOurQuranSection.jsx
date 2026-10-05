'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from './Icons';

export default function WhyOurQuranSection() {
  const features = [
    {
      id: 'faculty',
      title: 'Al-Azhar Faculty & Scholars',
      description: '1-on-1 private mentorship under certified scholars holding authentic Sanad chains linked back to the Prophet ﷺ.',
      image: '/assets/features/feature_scholars.jpg',
      link: '/teachers',
      linkText: 'Meet Scholars',
      kicker: 'SANAD SCHOLARSHIP'
    },
    {
      id: 'hifz',
      title: 'Structured Hifz & Retention',
      description: 'Classical Quran memorization enhanced with modern spaced-repetition science for lifelong, effortless recall.',
      image: '/assets/features/feature_quran.jpg',
      link: '/courses',
      linkText: 'Explore Programs',
      kicker: 'SACRED DISCIPLINES'
    },
    {
      id: 'methodology',
      title: '15-Min Daily Methodology',
      description: 'A sustainable micro-learning habit designed for busy schedules, school routines, and working professionals.',
      image: '/assets/features/feature_youth.jpg',
      link: '/methodology',
      linkText: 'Learn Method',
      kicker: 'DAILY HABIT FLOW'
    },
    {
      id: 'community',
      title: 'Global Islamic Sanctuary',
      description: 'A unified international brotherhood and sisterhood serving active students across 42+ countries with live halqas.',
      image: '/assets/features/feature_community.jpg',
      link: '/about',
      linkText: 'Our Sanctuary',
      kicker: '42+ COUNTRIES'
    }
  ];

  return (
    <section className="why-quran-outer-section" id="section-why-us">
      {/* Hidden SVG Definitions for Islamic Pointed Mihrab Arch Clipping */}
      <svg width="0" height="0" className="svg-clip-defs" style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <clipPath id="islamicMihrabArch" clipPathUnits="objectBoundingBox">
            <path d="M 0.5,0.01 C 0.58,0.12 0.88,0.22 0.97,0.44 C 1,0.52 1,0.85 0.95,0.94 C 0.9,1 0.1,1 0.05,0.94 C 0,0.85 0,0.52 0.03,0.44 C 0.12,0.22 0.42,0.12 0.5,0.01 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="why-quran-container">
        {/* Main Curved Green Container Card */}
        <div className="why-quran-card">
          {/* Subtle Mosque Minaret & Courtyard Skyline Silhouette Backdrop */}
          <div className="why-quran-mosque-silhouette" />
          <div className="why-quran-lighting-overlay" />

          {/* Header Row: Title & Pill on Left, Explanatory Subtext on Right */}
          <div className="why-quran-header-row">
            <div className="why-quran-header-left">
              <div className="why-quran-kicker-pill">
                <span className="why-kicker-dot">●</span>
                <span className="why-kicker-text">Why Our Quran</span>
              </div>
              <h2 className="why-quran-title">
                Our Programs &amp; Services
              </h2>
            </div>

            <div className="why-quran-header-right">
              <p className="why-quran-subtext">
                We offer a wide range of structured programs to strengthen faith, master Quranic recitation, serve the global community, and inspire the next generation.
              </p>
            </div>
          </div>

          {/* 4 Islamic Pointed Arched Cards Grid */}
          <div className="why-quran-cards-grid">
            {features.map((item) => (
              <div
                key={item.id}
                className="why-feature-card"
              >
                {/* Arched Photo Frame (Pointed Islamic Arch with Gold / Lime Border) */}
                <div className="feature-arch-wrapper">
                  <div className="feature-arch-contour">
                    <div className="feature-arch-inner">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="feature-arch-img"
                        loading="lazy"
                      />
                      <div className="feature-arch-tint" />
                    </div>
                  </div>
                </div>

                {/* Card Title in Serif Font */}
                <h3 className="feature-card-title">
                  {item.title}
                </h3>

                {/* Card Description */}
                <p className="feature-card-desc">
                  {item.description}
                </p>

                {/* Round Lime Arrow Button Linking to Separate Page */}
                <Link
                  href={item.link}
                  className="feature-round-arrow-btn"
                  title={`Explore ${item.title}`}
                  aria-label={`Go to ${item.title} page`}
                >
                  <Icon name="arrow-up-right" size={17} color="#062A24" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
