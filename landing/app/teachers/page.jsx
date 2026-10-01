'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TEACHERS_DATA, TEACHER_CATEGORIES } from '../../src/data/teachersData';
import { Icon } from '../../src/components/Icons';
import BookingModal from '../../src/components/BookingModal';
import Navigation from '../../src/components/Navigation';

export default function TeachersPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState('');

  const filteredTeachers = TEACHERS_DATA.filter((teacher) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'sisters') return teacher.division === 'sisters' || teacher.category === 'sisters';
    return teacher.category === activeCategory;
  });

  const handleBookWithMentor = (mentorName) => {
    setSelectedMentor(`Session with ${mentorName}`);
    setIsBookingOpen(true);
  };

  return (
    <div className="dedicated-page-wrapper">
      {/* 1. Unified Shared Navigation */}
      <Navigation
        currentPage="teachers"
        onOpenBooking={() => handleBookWithMentor('Faculty Placement')}
      />

      {/* 2. Hero Section */}
      <section className="dedicated-hero">
        <div className="dedicated-hero-glow" />
        <div className="dedicated-hero-content">
          <div className="section-label">
            <div className="label-rule" />
            <span className="label-text">AUTHORITY · IJAZAH · PROPHETIC PEDAGOGY</span>
            <div className="label-rule" />
          </div>
          <h1 className="dedicated-hero-title">
            Our Esteemed Faculty &amp;<br />
            Al-Azhar Scholars
          </h1>
          <p className="dedicated-hero-desc">
            Knowledge is a living light passed from chest to chest. At Our Quran Institute, every student learns directly under certified scholars who hold connected chains of transmission (Sanad) back to the Prophet Muhammad ﷺ, embodying patient adab, academic rigor, and profound spiritual care.
          </p>

          {/* Quick Metrics Bar */}
          <div className="dedicated-metrics-bar">
            <div className="dedicated-metric">
              <span className="metric-number">100%</span>
              <span className="metric-caption">Sanad &amp; Degree Certified</span>
            </div>
            <div className="dedicated-metric-rule" />
            <div className="dedicated-metric">
              <span className="metric-number">Al-Azhar</span>
              <span className="metric-caption">Cairo Academic Lineage</span>
            </div>
            <div className="dedicated-metric-rule" />
            <div className="dedicated-metric">
              <span className="metric-number">1-on-1</span>
              <span className="metric-caption">Private Dedicated Lessons</span>
            </div>
            <div className="dedicated-metric-rule" />
            <div className="dedicated-metric">
              <span className="metric-number">Sisters</span>
              <span className="metric-caption">Dedicated Female Scholars</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Category Filter Controls */}
      <section className="dedicated-controls-bar">
        <div className="controls-inner">
          <div className="category-pills-row">
            {TEACHER_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`filter-pill-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="status-pill-warm">
            <Icon name="users" size={14} color="#FFDF85" />
            <span>120+ GLOBAL SCHOLARS ON FACULTY</span>
          </div>
        </div>
      </section>

      {/* 4. Faculty Profiles Grid */}
      <section className="dedicated-catalog-section">
        <div className="faculty-grid">
          {filteredTeachers.map((teacher) => (
            <div key={teacher.id} className="faculty-profile-card">
              {/* Top Banner & Avatar Header */}
              <div className="faculty-card-header">
                <div className="faculty-avatar-wrapper">
                  {teacher.image ? (
                    <img src={teacher.image} alt={teacher.name} className="faculty-avatar-img" />
                  ) : (
                    <div className="faculty-avatar-seal">
                      <span className="seal-initials">
                        {teacher.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                      </span>
                    </div>
                  )}
                  <span className="faculty-status-dot" title="Active on Faculty" />
                </div>

                <div className="faculty-identity-block">
                  <span className="faculty-arabic-honorific">{teacher.honorific}</span>
                  <h3 className="faculty-name">{teacher.name}</h3>
                  <span className="faculty-role-badge">{teacher.role}</span>
                  <span className="faculty-location">
                    <Icon name="compass" size={12} color="#C5A45A" />
                    <span>{teacher.location}</span>
                  </span>
                </div>
              </div>

              {/* Bio & Adab */}
              <p className="faculty-bio">{teacher.bio}</p>

              {/* Credentials & Sanad Box */}
              <div className="faculty-credentials-box">
                <div className="credential-row">
                  <Icon name="shield-check" size={15} color="#10B981" />
                  <div className="credential-text">
                    <strong className="credential-label">Academic Degree:</strong>
                    <span>{teacher.credentials}</span>
                  </div>
                </div>

                <div className="credential-row sanad-row">
                  <Icon name="sparkles" size={15} color="#FFDF85" />
                  <div className="credential-text">
                    <strong className="credential-label">Connected Chain (Sanad):</strong>
                    <span className="sanad-highlight">{teacher.sanad}</span>
                  </div>
                </div>

                <div className="credential-row">
                  <Icon name="clock" size={15} color="#60A5FA" />
                  <div className="credential-text">
                    <strong className="credential-label">Teaching Experience:</strong>
                    <span>{teacher.experience} &bull; {teacher.graduates}</span>
                  </div>
                </div>
              </div>

              {/* Specialties Tags */}
              <div className="faculty-specialties-wrap">
                <span className="specialties-title">AREAS OF SPECIALIZATION:</span>
                <div className="specialties-pills">
                  {teacher.specialties.map((spec, i) => (
                    <span key={i} className="specialty-pill">
                      ✦ {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="faculty-languages">
                <span className="lang-label">Languages:</span>
                <span className="lang-val">{teacher.languages}</span>
              </div>

              {/* Action Button */}
              <div className="faculty-card-footer">
                <button
                  className="btn-gold-pill faculty-book-btn"
                  onClick={() => handleBookWithMentor(teacher.name)}
                >
                  <span>Request Session with {teacher.name.split(' ')[0]}</span>
                  <Icon name="arrow-up-right" size={15} color="#062A24" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. The Scholarly Covenant & Adab Section */}
      <section className="dedicated-advisory-section">
        <div className="advisory-card">
          <div className="advisory-ornament">
            <Icon name="book-open" size={32} color="#FFDF85" />
          </div>
          <div className="advisory-copy">
            <span className="advisory-kicker">THE SCHOLAR-STUDENT COVENANT</span>
            <h3 className="advisory-title">Patience, Dignity, and Prophetic Gentleness</h3>
            <p className="advisory-desc">
              At Our Quran Institute, teachers are chosen not only for the height of their degrees and Sanad chains, but for the purity of their pedagogical adab. We cultivate confidence without humiliation, correction without frustration, and warmth that makes every session a sanctuary of peace.
            </p>
          </div>
          <div className="advisory-buttons">
            <button
              className="btn-gold-pill"
              onClick={() => handleBookWithMentor('Faculty Placement')}
            >
              <span>Match with a Mentor</span>
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
        initialCourse={selectedMentor}
      />
    </div>
  );
}
