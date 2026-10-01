'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { COURSES_DATA, COURSE_CATEGORIES } from '../../src/data/coursesData';
import { Icon } from '../../src/components/Icons';
import BookingModal from '../../src/components/BookingModal';
import Navigation from '../../src/components/Navigation';

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [expandedSyllabusId, setExpandedSyllabusId] = useState(null);

  const filteredCourses = COURSES_DATA.filter((course) => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenBooking = (courseTitle) => {
    setSelectedCourse(courseTitle);
    setIsBookingOpen(true);
  };

  const toggleSyllabus = (id) => {
    setExpandedSyllabusId(expandedSyllabusId === id ? null : id);
  };

  return (
    <div className="dedicated-page-wrapper">
      {/* 1. Unified Shared Navigation */}
      <Navigation
        currentPage="courses"
        onOpenBooking={() => handleOpenBooking('General Course Placement')}
      />

      {/* 2. Hero Section */}
      <section className="dedicated-hero">
        <div className="dedicated-hero-glow" />
        <div className="dedicated-hero-content">
          <div className="section-label">
            <div className="label-rule" />
            <span className="label-text">AL-AZHAR SCHOLASTIC CURRICULUM</span>
            <div className="label-rule" />
          </div>
          <h1 className="dedicated-hero-title">
            Academic Programs &amp;<br />
            Sacred Disciplines
          </h1>
          <p className="dedicated-hero-desc">
            Personalized 1-on-1 tracks guided by certified scholars and Ijazah holders. Whether you seek full Quran memorization with connected Sanad, pristine Tajweed, Quranic Arabic comprehension, or foundational reading for children — your sacred journey begins here.
          </p>

          {/* Quick Metrics Bar */}
          <div className="dedicated-metrics-bar">
            <div className="dedicated-metric">
              <span className="metric-number">06</span>
              <span className="metric-caption">Core Disciplines</span>
            </div>
            <div className="dedicated-metric-rule" />
            <div className="dedicated-metric">
              <span className="metric-number">100%</span>
              <span className="metric-caption">1-on-1 Scholar Mentorship</span>
            </div>
            <div className="dedicated-metric-rule" />
            <div className="dedicated-metric">
              <span className="metric-number">42+</span>
              <span className="metric-caption">Nations Represented</span>
            </div>
            <div className="dedicated-metric-rule" />
            <div className="dedicated-metric">
              <span className="metric-number">Connected</span>
              <span className="metric-caption">Al-Azhar Sanad Chains</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Filter and Search Controls */}
      <section className="dedicated-controls-bar">
        <div className="controls-inner">
          <div className="category-pills-row">
            {COURSE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`filter-pill-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="search-input-wrapper">
            <Icon name="search" size={15} color="#C5A45A" />
            <input
              type="text"
              placeholder="Search courses, topics, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="course-search-field"
            />
            {searchQuery && (
              <button className="search-clear-btn" onClick={() => setSearchQuery('')}>
                ×
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 4. Course Cards Catalog */}
      <section className="dedicated-catalog-section">
        <div className="catalog-grid">
          {filteredCourses.length === 0 ? (
            <div className="no-results-box">
              <Icon name="search" size={32} color="#C5A45A" />
              <h3>No programs match your search</h3>
              <p>Try resetting the filter or searching for another keyword like &quot;Hifz&quot;, &quot;Arabic&quot;, or &quot;Tajweed&quot;.</p>
              <button className="btn-gold-pill" onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}>
                <span>Reset Filters</span>
              </button>
            </div>
          ) : (
            filteredCourses.map((course) => {
              const isSyllabusOpen = expandedSyllabusId === course.id;

              return (
                <div key={course.id} className="catalog-course-card">
                  {/* Card Header Banner */}
                  <div className="catalog-card-header">
                    <span
                      className="catalog-badge"
                      style={{
                        backgroundColor: course.badgeColor,
                        color: '#06261F',
                        borderColor: course.badgeColor,
                        fontWeight: 700
                      }}
                    >
                      ✦ {course.badge}
                    </span>
                    <span className="catalog-category-tag">{course.categoryLabel}</span>
                  </div>

                  {/* Title Block */}
                  <div className="catalog-title-group">
                    <span className="catalog-arabic-calligraphy">{course.arabicTitle}</span>
                    <h2 className="catalog-title">{course.title}</h2>
                  </div>

                  <p className="catalog-description">{course.description}</p>

                  {/* Meta Specs Bar */}
                  <div className="catalog-specs-grid">
                    <div className="spec-item">
                      <span className="spec-label">Format:</span>
                      <strong className="spec-value">{course.format}</strong>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Duration:</span>
                      <strong className="spec-value">{course.duration}</strong>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Weekly Pace:</span>
                      <strong className="spec-value">{course.hoursPerWeek}</strong>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Certification:</span>
                      <strong className="spec-value spec-gold">{course.certification}</strong>
                    </div>
                  </div>

                  {/* Program Highlights */}
                  <div className="catalog-highlights">
                    <span className="highlights-header">KEY CAPABILITIES YOU WILL DEVELOP:</span>
                    <ul className="highlights-checklist">
                      {course.highlights.map((h, i) => (
                        <li key={i}>
                          <span className="bullet-gold">✓</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Expandable Detailed Syllabus */}
                  {isSyllabusOpen && (
                    <div className="catalog-syllabus-drawer">
                      <span className="drawer-title">CURRICULUM PHASES &amp; MILESTONES:</span>
                      <div className="syllabus-timeline">
                        {course.curriculum.map((item, idx) => (
                          <div key={idx} className="timeline-node">
                            <div className="node-marker">{idx + 1}</div>
                            <div className="node-content">
                              <h4 className="node-phase">{item.phase}</h4>
                              <p className="node-focus">{item.focus}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="syllabus-audience">
                        <strong>Target Audience:</strong> {course.targetAudience}
                      </div>
                    </div>
                  )}

                  {/* Card Actions */}
                  <div className="catalog-card-footer">
                    <button
                      className="btn-gold-pill catalog-enroll-btn"
                      onClick={() => handleOpenBooking(course.title)}
                    >
                      <span>Book Free Placement Trial</span>
                      <Icon name="arrow-up-right" size={15} color="#062A24" />
                    </button>

                    <button
                      className="catalog-syllabus-toggle-btn"
                      onClick={() => toggleSyllabus(course.id)}
                    >
                      <span>{isSyllabusOpen ? 'Hide Full Syllabus' : 'View Full Syllabus'}</span>
                      <Icon name={isSyllabusOpen ? 'chevron-up' : 'chevron-down'} size={14} color="#FFDF85" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* 5. Comprehensive Advisory / Assessment Banner */}
      <section className="dedicated-advisory-section">
        <div className="advisory-card">
          <div className="advisory-ornament">
            <Icon name="shield-check" size={32} color="#FFDF85" />
          </div>
          <div className="advisory-copy">
            <span className="advisory-kicker">PERSONALIZED SCHOLAR ASSESSMENT</span>
            <h3 className="advisory-title">Need Guidance Choosing Your Program?</h3>
            <p className="advisory-desc">
              Every seeker’s background is distinct. Book a private 20-minute diagnostic session with one of our senior Al-Azhar scholars. We will listen to your recitation, assess your goals, and design a customized daily study rhythm tailored to your work and family life.
            </p>
          </div>
          <div className="advisory-buttons">
            <button
              className="btn-gold-pill"
              onClick={() => handleOpenBooking('Custom Diagnostic Assessment')}
            >
              <span>Book Placement Session</span>
              <Icon name="arrow-right" size={16} color="#062A24" />
            </button>
            <a
              href="https://wa.me/201094714943"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cream-pill"
            >
              <Icon name="whatsapp" size={16} color="#25D366" />
              <span>Inquire on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="dedicated-page-footer">
        <div className="footer-inner">
          <div className="footer-brand-col">
            <div className="footer-brand">
              <img src="/assets/logo_gold.png" alt="Our Quran Institute" className="footer-logo" />
              <span className="footer-name">Our Quran Institute</span>
            </div>
            <p className="footer-tagline">
              An international sanctuary for Quranic memorization, Tajweed mastery, Arabic language, and authentic Islamic scholarship.
            </p>
          </div>

          <div className="footer-links-col">
            <h4>Academy Links</h4>
            <Link href="/">Book Overview</Link>
            <Link href="/courses">All Programs</Link>
            <Link href="/teachers">Al-Azhar Faculty</Link>
            <a href="https://wa.me/201094714943" target="_blank" rel="noopener noreferrer">WhatsApp Support</a>
          </div>

          <div className="footer-contact-col">
            <h4>Direct Admissions</h4>
            <p>Cairo Sanctuary &bull; Global Online Faculty</p>
            <p>WhatsApp: <strong>+20 10 94714943</strong></p>
            <p>Open 24/7 across all global timezones</p>
          </div>
        </div>
        <div className="footer-sub-bottom">
          <span>&copy; 2026 Our Quran Institute. All sacred rights reserved.</span>
        </div>
      </footer>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialCourse={selectedCourse}
      />
    </div>
  );
}
