'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TEACHERS_DATA, TEACHER_CATEGORIES } from '../../src/data/teachersData';
import { Icon } from '../../src/components/Icons';
import BookingModal from '../../src/components/BookingModal';
import Navigation from '../../src/components/Navigation';

export default function TeachersPage() {
  const [teachersList, setTeachersList] = useState(TEACHERS_DATA);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState('');
  const [isLoadingLive, setIsLoadingLive] = useState(true);

  const itemsPerPage = 6;

  // Auto-fetch faculty from the live API (synced with Portal DB)
  useEffect(() => {
    let isMounted = true;
    async function fetchLiveFaculty() {
      try {
        // Try local landing API route first (which proxies portal or falls back)
        const res = await fetch('/api/teachers?all=true', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.teachers && data.teachers.length > 0) {
            setTeachersList(data.teachers);
          }
        }
      } catch (err) {
        // Direct attempt to portal dev server port 3001 if available
        try {
          const portalBase = process.env.NEXT_PUBLIC_PORTAL_URL || 'http://localhost:3001';
          const directRes = await fetch(`${portalBase}/api/teachers?all=true`, { cache: 'no-store' });
          if (directRes.ok) {
            const directData = await directRes.json();
            if (isMounted && directData.teachers && directData.teachers.length > 0) {
              setTeachersList(directData.teachers);
            }
          }
        } catch {
          // Keep initial fallback TEACHERS_DATA
        }
      } finally {
        if (isMounted) setIsLoadingLive(false);
      }
    }

    fetchLiveFaculty();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter teachers by category and search query
  const filteredTeachers = teachersList.filter((teacher) => {
    const matchesCategory =
      activeCategory === 'all'
        ? true
        : activeCategory === 'sisters'
        ? teacher.division === 'sisters' || teacher.category === 'sisters'
        : teacher.category === activeCategory;

    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase().trim();
    const nameMatch = teacher.name?.toLowerCase().includes(q);
    const titleMatch = (teacher.role || teacher.title)?.toLowerCase().includes(q);
    const credMatch = teacher.credentials?.toLowerCase().includes(q);
    const sanadMatch = teacher.sanad?.toLowerCase().includes(q);
    const specMatch = teacher.specialties?.some((s) => s.toLowerCase().includes(q));
    const locationMatch = teacher.location?.toLowerCase().includes(q);

    return nameMatch || titleMatch || credMatch || sanadMatch || specMatch || locationMatch;
  });

  // Pagination calculation
  const totalItems = filteredTeachers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const paginatedTeachers = filteredTeachers.slice(startIndex, startIndex + itemsPerPage);

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleBookWithMentor = (mentorName) => {
    setSelectedMentor(`Session with ${mentorName}`);
    setIsBookingOpen(true);
  };

  const scrollToTopCatalog = () => {
    if (typeof window !== 'undefined') {
      const el = document.getElementById('faculty-catalog-view');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      scrollToTopCatalog();
    }
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

      {/* 3. Filter & Search Controls Bar */}
      <section className="dedicated-controls-bar" id="faculty-catalog-view">
        <div className="controls-inner" style={{ flexDirection: 'column', gap: '16px' }}>
          {/* Top Row: Search Input and Status Pill */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '12px' }}>
            {/* Search Input Box */}
            <div
              style={{
                position: 'relative',
                minWidth: '280px',
                flex: '1',
                maxWidth: '460px',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }}
              >
                <Icon name="compass" size={15} color="#C5A45A" />
              </div>
              <input
                type="text"
                placeholder="Search scholars by name, university, or specialization..."
                value={searchQuery}
                onChange={handleSearchChange}
                style={{
                  width: '100%',
                  padding: '11px 16px 11px 40px',
                  background: '#FFFFFF',
                  border: '1.5px solid rgba(197, 164, 90, 0.35)',
                  borderRadius: '999px',
                  fontSize: '13px',
                  color: '#122F1E',
                  outline: 'none',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    fontSize: '14px',
                    color: '#64748B',
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="status-pill-warm" style={{ margin: 0 }}>
              <Icon name="users" size={14} color="#FFDF85" />
              <span>
                {isLoadingLive ? 'SYNCING GLOBAL FACULTY...' : `${totalItems} CERTIFIED SCHOLARS ON FACULTY`}
              </span>
            </div>
          </div>

          {/* Bottom Row: Category Filter Pills */}
          <div className="category-pills-row" style={{ width: '100%' }}>
            {TEACHER_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`filter-pill-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat.id)}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Faculty Profiles Grid with Pagination */}
      <section className="dedicated-catalog-section">
        {paginatedTeachers.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1px dashed #CBD5E1',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            <Icon name="compass" size={36} color="#C5A45A" />
            <h3 style={{ margin: '14px 0 6px', fontSize: '18px', color: '#122F1E' }}>No Scholars Found</h3>
            <p style={{ margin: 0, fontSize: '13.5px', color: '#64748B' }}>
              No faculty match your search for "{searchQuery}". Try searching for another name or choose "All Faculty".
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              style={{
                marginTop: '16px',
                background: '#0D4A38',
                color: '#FFDF85',
                border: '1px solid #D4AF37',
                padding: '8px 18px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="faculty-grid">
              {paginatedTeachers.map((teacher) => {
                const profileSlug = teacher.slug || teacher.id;
                const certCount = teacher.certificates?.length || 2;

                return (
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
                        <span className="faculty-status-dot" title="Active Verified Faculty" />
                      </div>

                      <div className="faculty-identity-block">
                        <span className="faculty-arabic-honorific">{teacher.honorific}</span>
                        <h3 className="faculty-name">{teacher.name}</h3>
                        <span className="faculty-role-badge">{teacher.role || teacher.title}</span>
                        <span className="faculty-location">
                          <Icon name="compass" size={12} color="#C5A45A" />
                          <span>{teacher.location}</span>
                        </span>
                      </div>
                    </div>

                    {/* Bio & Adab */}
                    <p className="faculty-bio">
                      {teacher.bio?.length > 180 ? `${teacher.bio.substring(0, 180)}...` : teacher.bio}
                    </p>

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
                          <span>{teacher.experience || teacher.yearsExperience} &bull; {teacher.graduates || '180+ Graduates'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Verified Diplomas & Certificates Pill */}
                    <div
                      style={{
                        background: '#FAF7EE',
                        border: '1px solid #E6D8A8',
                        borderRadius: '8px',
                        padding: '6px 10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '11.5px',
                        color: '#0D4A38',
                        fontWeight: '600',
                      }}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Icon name="award" size={14} color="#D4AF37" />
                        <span>{certCount} Verified Diplomas &amp; Accreditations</span>
                      </span>
                      <span style={{ fontSize: '10.5px', color: '#166534', background: '#DCFCE7', padding: '2px 6px', borderRadius: '4px' }}>
                        AUTHENTICATED
                      </span>
                    </div>

                    {/* Specialties Tags */}
                    <div className="faculty-specialties-wrap">
                      <span className="specialties-title">AREAS OF SPECIALIZATION:</span>
                      <div className="specialties-pills">
                        {teacher.specialties?.slice(0, 4).map((spec, i) => (
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

                    {/* Action Buttons: View Full Profile & Request Session */}
                    <div
                      className="faculty-card-footer"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1.2fr',
                        gap: '10px',
                        alignItems: 'center',
                      }}
                    >
                      {/* 1. Full Page Profile Button (Requested by User) */}
                      <Link
                        href={`/teachers/${profileSlug}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          background: '#FFFFFF',
                          color: '#0D4A38',
                          border: '1.5px solid #0D4A38',
                          borderRadius: '999px',
                          padding: '10px 14px',
                          fontSize: '12.5px',
                          fontWeight: '700',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease',
                          textAlign: 'center',
                          boxShadow: '0 1px 4px rgba(13, 74, 56, 0.08)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#0D4A38';
                          e.currentTarget.style.color = '#FFDF85';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#FFFFFF';
                          e.currentTarget.style.color = '#0D4A38';
                        }}
                      >
                        <Icon name="award" size={14} />
                        <span>Full Profile</span>
                      </Link>

                      {/* 2. Request Session with Mentor */}
                      <button
                        className="btn-gold-pill faculty-book-btn"
                        onClick={() => handleBookWithMentor(teacher.name)}
                        style={{ margin: 0 }}
                      >
                        <span>Request Session</span>
                        <Icon name="arrow-up-right" size={14} color="#062A24" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px',
                  marginTop: '40px',
                  padding: '20px 24px',
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1.5px solid rgba(197, 164, 90, 0.3)',
                  boxShadow: '0 4px 16px rgba(10, 36, 18, 0.06)',
                }}
              >
                {/* Count summary */}
                <div style={{ fontSize: '13.5px', color: '#4D6652', fontWeight: '600' }}>
                  Showing <strong style={{ color: '#0D4A38' }}>{startIndex + 1}</strong>–
                  <strong style={{ color: '#0D4A38' }}>
                    {Math.min(startIndex + itemsPerPage, totalItems)}
                  </strong>{' '}
                  of <strong style={{ color: '#0D4A38' }}>{totalItems}</strong> Certified Scholars
                </div>

                {/* Page Buttons Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Previous Page Button */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(safeCurrentPage - 1)}
                    disabled={safeCurrentPage === 1}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: safeCurrentPage === 1 ? '#F1F5F9' : '#FFFFFF',
                      color: safeCurrentPage === 1 ? '#94A3B8' : '#0D4A38',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      padding: '7px 12px',
                      fontSize: '12.5px',
                      fontWeight: '700',
                      cursor: safeCurrentPage === 1 ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span>‹ Prev</span>
                  </button>

                  {/* Numbered Page Buttons */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                    const isActive = p === safeCurrentPage;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handlePageChange(p)}
                        style={{
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '8px',
                          background: isActive ? '#0D4A38' : '#FFFFFF',
                          color: isActive ? '#FFDF85' : '#0D4A38',
                          border: isActive ? '1.5px solid #D4AF37' : '1px solid #CBD5E1',
                          fontWeight: isActive ? '800' : '600',
                          fontSize: '13.5px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: isActive ? '0 2px 8px rgba(13, 74, 56, 0.25)' : 'none',
                        }}
                      >
                        {p}
                      </button>
                    );
                  })}

                  {/* Next Page Button */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(safeCurrentPage + 1)}
                    disabled={safeCurrentPage === totalPages}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: safeCurrentPage === totalPages ? '#F1F5F9' : '#FFFFFF',
                      color: safeCurrentPage === totalPages ? '#94A3B8' : '#0D4A38',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      padding: '7px 12px',
                      fontSize: '12.5px',
                      fontWeight: '700',
                      cursor: safeCurrentPage === totalPages ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span>Next ›</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
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
