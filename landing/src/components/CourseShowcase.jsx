import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from './Icons';
import { COURSES_DATA, COURSE_CATEGORIES } from '../data/coursesData';

export default function CourseShowcase({ onOpenBooking, onSelectCourse }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);

  const scrollTrackRef = useRef(null);
  const animFrameRef = useRef(null);
  const pauseTimeoutRef = useRef(null);

  const filteredCourses = activeCategory === 'all'
    ? COURSES_DATA
    : COURSES_DATA.filter((c) => c.category === activeCategory);

  // Duplicate items for continuous seamless right-to-left loop when showing all
  const displayItems = activeCategory === 'all'
    ? [...filteredCourses, ...filteredCourses]
    : filteredCourses;

  // Continuous auto-scroll from right to left
  useEffect(() => {
    const el = scrollTrackRef.current;
    if (!el) return;

    let lastTimestamp = performance.now();
    const speed = 0.55; // Pixels per frame (fluid, comfortable reading pace)

    const step = (timestamp) => {
      const delta = Math.min(32, timestamp - lastTimestamp);
      lastTimestamp = timestamp;

      if (!isPaused && !isDragging && el) {
        el.scrollLeft += speed * (delta / 16.67);

        // Halfway wrap for infinite seamless loop
        if (activeCategory === 'all') {
          const halfScroll = el.scrollWidth / 2;
          if (el.scrollLeft >= halfScroll) {
            el.scrollLeft -= halfScroll;
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, [isPaused, isDragging, activeCategory]);

  const handleManualScroll = (offset) => {
    const el = scrollTrackRef.current;
    if (!el) return;
    el.scrollBy({ left: offset, behavior: 'smooth' });
    setIsPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => setIsPaused(false), 4500);
  };

  // Mouse drag & scroll
  const handleMouseDown = (e) => {
    const el = scrollTrackRef.current;
    if (!el) return;
    setIsDragging(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollStart(el.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const el = scrollTrackRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5;
    el.scrollLeft = scrollStart - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleEnrollClick = (course) => {
    if (onSelectCourse) onSelectCourse(course);
    if (onOpenBooking) onOpenBooking(course.title);
  };

  const toggleExpand = (courseId) => {
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
    setIsPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => setIsPaused(false), 6000);
  };

  return (
    <div className="course-showcase-section" id="courses-section">
      {/* 1. Header */}
      <div className="course-showcase-header">
        <div className="section-label">
          <div className="label-rule" />
          <span className="label-text">ACADEMIC DISCIPLINES · AL-AZHAR ACCREDITED</span>
        </div>
        <h2 className="spread-heading">
          Explore our certified<br />
          Quran &amp; Islamic programs.
        </h2>
        <p className="spread-desc">
          Structured 1-on-1 learning paths designed for adults, youth, and children worldwide — from foundational Arabic and kids Quran to authentic Akida and classical language mastery.
        </p>

        {/* Category Pills & Carousel Controls */}
        <div className="course-filter-control-row">
          <div className="course-category-filter-row">
            {COURSE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`course-filter-pill ${activeCategory === cat.id ? 'is-active' : ''}`}
                onClick={() => {
                  setActiveCategory(cat.id);
                  if (scrollTrackRef.current) scrollTrackRef.current.scrollLeft = 0;
                }}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Interactive Right-to-Left Scroll Status & Manual Navigation */}
          <div className="course-carousel-hud">
            <button
              className={`carousel-status-indicator ${isPaused ? 'is-paused' : 'is-scrolling'}`}
              onClick={() => setIsPaused(!isPaused)}
              title={isPaused ? 'Click to resume auto-scroll' : 'Click to pause auto-scroll'}
            >
              <span className="hud-dot" />
              <span>{isPaused ? 'Paused (Click to Play)' : 'Scrolling R ➔ L (Hover to Pause)'}</span>
            </button>

            <div className="carousel-nav-buttons">
              <button
                className="carousel-btn prev-btn"
                onClick={() => handleManualScroll(-390)}
                aria-label="Scroll right"
                title="Scroll Right"
              >
                <Icon name="chevron-left" size={16} color="#FFDF85" />
              </button>
              <button
                className="carousel-btn next-btn"
                onClick={() => handleManualScroll(390)}
                aria-label="Scroll left"
                title="Scroll Left"
              >
                <Icon name="chevron-right" size={16} color="#FFDF85" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Horizontal Right-to-Left Course Stream */}
      <div
        className="course-horizontal-stream-wrapper"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          if (!isDragging) setIsPaused(false);
        }}
      >
        <div
          ref={scrollTrackRef}
          className={`course-horizontal-track ${isDragging ? 'is-dragging' : ''}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {displayItems.map((course, idx) => {
            const isExpanded = expandedCourseId === course.id;

            return (
              <div
                key={`${course.id}-${idx}`}
                className={`institute-course-card stream-card ${isExpanded ? 'is-expanded' : ''}`}
              >
                {/* Card Top Meta */}
                <div className="course-card-top">
                  <span
                    className="course-badge"
                    style={{
                      backgroundColor: course.badgeColor,
                      color: '#06261F',
                      borderColor: course.badgeColor,
                      fontWeight: 700
                    }}
                  >
                    ✦ {course.badge}
                  </span>
                  <span className="course-level-tag">{course.level}</span>
                </div>

                {/* Title & Arabic Honorific */}
                <div className="course-card-title-group">
                  <span className="course-arabic-title">{course.arabicTitle}</span>
                  <h3 className="course-card-title">{course.title}</h3>
                </div>

                <p className="course-card-short-desc">{course.shortDesc}</p>

                {/* Key Metadata Pills */}
                <div className="course-meta-dock">
                  <div className="course-meta-item">
                    <Icon name="clock" size={13} color="#FFDF85" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="course-meta-item">
                    <Icon name="calendar-check" size={13} color="#10B981" />
                    <span>{course.hoursPerWeek}</span>
                  </div>
                  <div className="course-meta-item">
                    <Icon name="shield-check" size={13} color="#FFDF85" />
                    <span>1-on-1 Scholar</span>
                  </div>
                </div>

                {/* Highlights List */}
                <div className="course-highlights-box">
                  <span className="highlights-title">CURRICULUM HIGHLIGHTS:</span>
                  <ul className="highlights-list">
                    {course.highlights.slice(0, 3).map((item, hIdx) => (
                      <li key={hIdx}>
                        <span className="check-bullet">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Expandable Curriculum Outline */}
                {isExpanded && (
                  <div className="course-curriculum-expanded">
                    <span className="curriculum-preview-title">SYLLABUS PHASES:</span>
                    <div className="curriculum-phases-list">
                      {course.curriculum.map((c, cIdx) => (
                        <div key={cIdx} className="curriculum-phase-row">
                          <span className="phase-num">0{cIdx + 1}</span>
                          <div className="phase-text-block">
                            <strong className="phase-name">{c.phase}</strong>
                            <span className="phase-focus">{c.focus}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Card Footer Actions */}
                <div className="course-card-actions">
                  <button
                    className="btn-gold-pill course-enroll-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEnrollClick(course);
                    }}
                  >
                    <span>Book Free Trial</span>
                    <Icon name="arrow-up-right" size={14} color="#062A24" />
                  </button>

                  <button
                    className="course-details-toggle-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(course.id);
                    }}
                  >
                    <span>{isExpanded ? 'Hide' : 'Outline'}</span>
                    <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} size={13} color="#FFDF85" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Bottom Institute Navigation Link */}
      <div className="course-showcase-footer-dock">
        <div className="course-advisory-callout">
          <div className="callout-icon-box">
            <Icon name="sparkles" size={20} color="#FFDF85" />
          </div>
          <div className="callout-text">
            <h4>Not sure which track matches your goals or level?</h4>
            <p>Our senior Al-Azhar scholars provide a free 20-minute diagnostic session to assess your recitation, Arabic vocabulary, and craft your personalized roadmap.</p>
          </div>
          <button className="btn-cream-pill" onClick={() => onOpenBooking('Free Placement Assessment')}>
            <span>Book Assessment</span>
            <Icon name="arrow-right" size={15} color="#062A24" />
          </button>
        </div>

        <div className="view-all-courses-row">
          <Link href="/courses" className="link-all-courses">
            <span>Explore Complete 6 Programs &amp; Full Syllabi</span>
            <Icon name="arrow-up-right" size={15} color="currentColor" />
          </Link>
          <span className="divider-dot">&bull;</span>
          <Link href="/teachers" className="link-all-courses">
            <span>Meet Our Faculty &amp; Al-Azhar Scholars</span>
            <Icon name="users" size={15} color="currentColor" />
          </Link>
        </div>
      </div>
    </div>
  );
}
