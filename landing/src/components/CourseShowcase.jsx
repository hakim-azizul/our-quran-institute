'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from './Icons';
import { COURSES_DATA, COURSE_CATEGORIES } from '../data/coursesData';

export default function CourseShowcase({ onOpenBooking, onSelectCourse }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const trackRef = useRef(null);
  const animFrameRef = useRef(null);
  const resumeTimeoutRef = useRef(null);

  const filteredCourses = activeCategory === 'all'
    ? COURSES_DATA
    : COURSES_DATA.filter((c) => c.category === activeCategory);

  // Repeat items for seamless horizontal loop
  const displayItems = activeCategory === 'all'
    ? [...filteredCourses, ...filteredCourses, ...filteredCourses]
    : [...filteredCourses, ...filteredCourses];

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
        const singleSetWidth = el.scrollWidth / (activeCategory === 'all' ? 3 : 2);
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

  const handleCourseEnroll = (course) => {
    if (onSelectCourse) onSelectCourse(course);
    if (onOpenBooking) onOpenBooking(course.title);
  };

  return (
    <div className="charity-courses-section" id="courses-section">
      {/* 1. Centered Header (Matching Reference Design: "Empowering Lives Through...") */}
      <div className="charity-courses-header">
        <div className="charity-kicker-pill">
          <span className="kicker-green-dot">●</span>
          <span className="kicker-pill-text">Our Courses</span>
        </div>

        <h2 className="charity-courses-title">
          Empowering Lives Through<br />
          <span className="title-serif-highlight">Sacred Quranic Education</span>
        </h2>

        <p className="charity-courses-subtitle">
          Structured 1-on-1 journeys designed for all ages worldwide — guided with patience by certified scholars from Al-Azhar.
        </p>

        {/* Filter Categories and Navigation Arrows */}
        <div className="charity-controls-bar">
          <div className="charity-filter-pills">
            {COURSE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`charity-filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(cat.id);
                  if (trackRef.current) trackRef.current.scrollLeft = 0;
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
              title="Previous Course"
            >
              <Icon name="chevron-left" size={16} color="#062A24" />
            </button>
            <button
              type="button"
              className="charity-arrow-btn"
              onClick={() => handleManualScroll(380)}
              aria-label="Scroll right"
              title="Next Course"
            >
              <Icon name="chevron-right" size={16} color="#062A24" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Horizontal Scrolling Carousel Track (Continuous Animation + Pause on Hover) */}
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
          {displayItems.map((course, idx) => (
            <div
              key={`${course.id}-${idx}`}
              className="charity-course-card"
            >
              {/* Card Image with Rounded Corners */}
              <div className="card-image-box">
                <img
                  src={course.image}
                  alt={course.title}
                  className="card-cover-photo"
                  loading="lazy"
                />
                <div className="card-badge-overlay">
                  <span>✦ {course.badge}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="card-content-body">
                {/* Category Tag Pill */}
                <div className="card-category-pill">
                  <span>{course.categoryLabel}</span>
                </div>

                {/* Course Title */}
                <h3 className="card-course-title" title={course.title}>
                  {course.title}
                </h3>

                {/* Subtitle / Description */}
                <p className="card-course-desc">
                  {course.shortDesc}
                </p>

                {/* Progress Metric Bar (From Reference Image) */}
                <div className="card-progress-section">
                  <div className="card-progress-bar-bg">
                    <div
                      className="card-progress-bar-fill"
                      style={{ width: `${course.progressPercent}%` }}
                    >
                      <div className="progress-fill-glow-dot" />
                    </div>
                  </div>
                </div>

                {/* Stats Row with Dots (From Reference Image: Raised / Goal equivalent) */}
                <div className="card-stats-row">
                  <div className="card-stat-item">
                    <span className="stat-dot">●</span>
                    <span className="stat-label">{course.stat1}</span>
                  </div>
                  <div className="card-stat-item">
                    <span className="stat-dot">●</span>
                    <span className="stat-label">{course.stat2}</span>
                  </div>
                </div>

                {/* Dark Emerald Pill CTA Button (From Reference Image: "Donate Now" -> "Enroll Now") */}
                <button
                  type="button"
                  className="card-enroll-btn"
                  onClick={() => handleCourseEnroll(course)}
                >
                  <span>Enroll Now</span>
                  <div className="enroll-btn-icon">
                    <Icon name="arrow-right" size={13} color="#FFFFFF" />
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Bottom Hub Link */}
      <div className="charity-courses-footer">
        <Link href="/courses" className="charity-view-all-link">
          <span>View All Detailed Curriculum &amp; Syllabi</span>
          <Icon name="arrow-up-right" size={14} color="#062A24" />
        </Link>
      </div>
    </div>
  );
}
