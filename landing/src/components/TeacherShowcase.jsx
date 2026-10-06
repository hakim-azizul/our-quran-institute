'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from './Icons';
import { MALE_TEACHERS_DATA, MALE_TEACHER_CATEGORIES } from '../data/teachersData';

export default function TeacherShowcase({ onOpenBooking, onSelectTeacher }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const trackRef = useRef(null);
  const animFrameRef = useRef(null);
  const resumeTimeoutRef = useRef(null);

  const filteredTeachers = activeCategory === 'all'
    ? MALE_TEACHERS_DATA
    : MALE_TEACHERS_DATA.filter((t) => t.category === activeCategory);

  // Repeat items for seamless horizontal loop
  const displayItems = activeCategory === 'all'
    ? [...filteredTeachers, ...filteredTeachers, ...filteredTeachers]
    : [...filteredTeachers, ...filteredTeachers, ...filteredTeachers];

  // Smooth continuous horizontal scrolling animation
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let lastTime = performance.now();
    const speed = 0.5; // pixels per frame

    const step = (timestamp) => {
      const delta = Math.min(32, timestamp - lastTime);
      lastTime = timestamp;

      if (!isPaused && !isDragging && el) {
        el.scrollLeft += speed * (delta / 16.67);

        // Infinite wrap logic
        const singleSetWidth = el.scrollWidth / 3;
        if (el.scrollLeft >= singleSetWidth * 2) {
          el.scrollLeft -= singleSetWidth;
        }
      }

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, [isPaused, isDragging, activeCategory]);

  const handleManualScroll = (offset) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: offset, behavior: 'smooth' });
    setIsPaused(true);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => setIsPaused(false), 5000);
  };

  // Mouse drag handling
  const handleMouseDown = (e) => {
    const el = trackRef.current;
    if (!el) return;
    setIsDragging(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeftState(el.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const el = trackRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5;
    el.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTeacherBooking = (teacher) => {
    if (onSelectTeacher) onSelectTeacher(teacher);
    if (onOpenBooking) onOpenBooking(`Session with ${teacher.name}`);
  };

  return (
    <div className="charity-courses-section teacher-showcase-section" id="teachers-section">
      {/* 1. Centered Header */}
      <div className="charity-courses-header">
        <div className="charity-kicker-pill teacher-kicker-pill">
          <span className="kicker-green-dot" style={{ color: '#C5A45A' }}>●</span>
          <span className="kicker-pill-text">Lead Scholars &amp; Mentors</span>
        </div>

        <h2 className="charity-courses-title">
          Guidance That Listens<br />
          <span className="title-serif-highlight">Before It Corrects</span>
        </h2>

        <p className="charity-courses-subtitle">
          Learn 1-on-1 with certified male scholars from Al-Azhar who nurture confidence, cultivate beautiful Tajweed, and embody deep patience.
        </p>

        {/* Filter Categories and Navigation Arrows */}
        <div className="charity-controls-bar">
          <div className="charity-filter-pills">
            {MALE_TEACHER_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`charity-filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={(e) => {
                  setActiveCategory(cat.id);
                  if (trackRef.current) trackRef.current.scrollLeft = 0;
                  try {
                    e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                  } catch (err) {}
                }}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="charity-nav-arrows">
            <button
              type="button"
              className="charity-arrow-btn"
              onClick={() => handleManualScroll(-380)}
              aria-label="Scroll left"
              title="Previous Mentor"
            >
              <Icon name="chevron-left" size={16} color="#062A24" />
            </button>
            <button
              type="button"
              className="charity-arrow-btn"
              onClick={() => handleManualScroll(380)}
              aria-label="Scroll right"
              title="Next Mentor"
            >
              <Icon name="chevron-right" size={16} color="#062A24" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Horizontal Scrolling Carousel Track */}
      <div
        className="charity-carousel-viewport"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          if (!isDragging) setIsPaused(false);
        }}
      >
        <div
          ref={trackRef}
          className={`charity-cards-track ${isDragging ? 'is-dragging' : ''}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {displayItems.map((teacher, idx) => (
            <div
              key={`${teacher.id}-${idx}`}
              className="charity-course-card teacher-card-item"
            >
              {/* Card Image with Rounded Corners */}
              <div className="card-image-box teacher-image-box">
                <img
                  src={teacher.image || '/assets/teacher_portrait.jpg'}
                  alt={teacher.name}
                  className="card-cover-photo teacher-cover-photo"
                  loading="lazy"
                />
                <div className="card-badge-overlay teacher-badge-overlay">
                  <span>✦ {teacher.badge || 'Certified Sanad'}</span>
                </div>
              </div>

              {/* Card Content Body */}
              <div className="card-content-body">
                {/* Category Tag Pill */}
                <div className="card-category-pill teacher-category-pill">
                  <span>{teacher.categoryLabel || 'AL-AZHAR SCHOLAR'}</span>
                </div>

                {/* Arabic Honorific */}
                <span className="teacher-arabic-honorific">
                  {teacher.honorific}
                </span>

                {/* Teacher Name */}
                <h3 className="card-course-title teacher-name-title" title={teacher.name}>
                  {teacher.name}
                </h3>

                {/* Role / Description Subtext */}
                <p className="card-course-desc teacher-role-desc">
                  {teacher.role}
                </p>

                {/* Progress / Sanad Transmission Bar */}
                <div className="card-progress-section">
                  <div className="card-progress-bar-bg">
                    <div
                      className="card-progress-bar-fill teacher-progress-fill"
                      style={{ width: `${teacher.progressPercent || 95}%` }}
                    >
                      <div className="progress-fill-glow-dot" />
                    </div>
                  </div>
                </div>

                {/* Stats Row with Dots */}
                <div className="card-stats-row">
                  <div className="card-stat-item">
                    <span className="stat-dot" style={{ color: '#C5A45A' }}>●</span>
                    <span className="stat-label">{teacher.stat1 || '12+ Yrs Exp'}</span>
                  </div>
                  <div className="card-stat-item">
                    <span className="stat-dot" style={{ color: '#10B981' }}>●</span>
                    <span className="stat-label">{teacher.stat2 || 'Sanad Verified'}</span>
                  </div>
                </div>

                {/* CTA Button: Book 1-on-1 with Mentor */}
                <button
                  type="button"
                  className="card-enroll-btn teacher-book-btn"
                  onClick={() => handleTeacherBooking(teacher)}
                >
                  <span>Book with Mentor</span>
                  <div className="enroll-btn-icon">
                    <Icon name="arrow-right" size={13} color="#FFFFFF" />
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Bottom Faculty Hub Link */}
      <div className="charity-courses-footer">
        <Link href="/teachers" className="charity-view-all-link">
          <span>Explore All 120+ Al-Azhar Scholars &amp; Faculty Directory</span>
          <Icon name="arrow-up-right" size={14} color="#062A24" />
        </Link>
      </div>
    </div>
  );
}
