import React, { useState } from 'react';
import Link from 'next/link';
import { DiamondOrnament, Icon } from './Icons';

export default function Navigation({
  onNavigate,
  activeSpread,
  onOpenBooking,
  currentPage = 'home'
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Method', spread: 1 },
    { label: 'Daily Flow', spread: 2 },
    { label: 'Retention', spread: 3 },
    { label: 'Progress', spread: 4 },
    { label: 'Mentors', spread: 5 },
    { label: 'Global Map', spread: 6 },
    { label: 'Our Vision', spread: 7 }
  ];

  const handleMobileNav = (spread) => {
    if (onNavigate) {
      onNavigate(spread);
    } else {
      window.location.href = `/#section-${spread}`;
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="nav-container sticky-nav">
        {/* Brand */}
        <Link
          href="/"
          className="nav-brand"
          onClick={(e) => {
            if (onNavigate) {
              e.preventDefault();
              onNavigate(0);
            }
          }}
        >
          <img
            src="/assets/logo_gold.png"
            alt="Our Quran Institute Logo"
            className="nav-brand-logo"
          />
          <div className="nav-brand-text">
            <span className="brand-name">Our Quran Institute</span>
            <span className="brand-descriptor">A COMPLETE ONLINE ISLAMIC LEARNING JOURNEY</span>
          </div>
        </Link>

        {/* Desktop Nav links */}
        <nav className="nav-links">
          {/* Dedicated Course & Teacher Hub Links */}
          <Link
            href="/courses"
            className={`nav-link nav-highlight-link ${currentPage === 'courses' ? 'active' : ''}`}
          >
            <span>✦ Courses</span>
          </Link>
          <Link
            href="/teachers"
            className={`nav-link nav-highlight-link ${currentPage === 'teachers' ? 'active' : ''}`}
          >
            <span>✦ Faculty</span>
          </Link>

          <span className="nav-internal-separator">|</span>

          {navLinks.slice(0, 5).map((link) => (
            <button
              key={link.spread}
              className={`nav-link ${activeSpread === link.spread ? 'active' : ''}`}
              onClick={() => {
                if (onNavigate) {
                  onNavigate(link.spread);
                } else {
                  window.location.href = `/#section-${link.spread}`;
                }
              }}
            >
              {link.label}
            </button>
          ))}
          <button
            className={`nav-link ${activeSpread === 6 ? 'active' : ''}`}
            onClick={() => {
              if (onNavigate) {
                onNavigate(6);
              } else {
                window.location.href = `/#section-6`;
              }
            }}
          >
            Global Map
          </button>
        </nav>

        {/* Right Actions */}
        <div className="nav-actions">
          {/* WhatsApp Direct Link */}
          <a
            href="https://wa.me/201094714943"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-whatsapp-link"
            title="Chat with Admissions on WhatsApp"
          >
            <Icon name="whatsapp" size={15} color="#25D366" />
            <span className="nav-wa-text">+20 10 94714943</span>
          </a>

          {/* Primary CTA */}
          <button className="nav-cta-btn" onClick={onOpenBooking}>
            <span className="nav-cta-text desktop-cta-text">Book Free Session</span>
            <span className="nav-cta-text mobile-cta-text">Book Free</span>
            <Icon name="arrow-up-right" size={13} color="#FBF6E9" />
          </button>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            className={`mobile-menu-toggle ${mobileMenuOpen ? 'open' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-backdrop" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-nav-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div className="mobile-drawer-brand">
                <img src="/assets/logo_gold.png" alt="Logo" className="drawer-logo" />
                <span className="drawer-title">Our Quran Institute</span>
              </div>
              <button
                className="mobile-drawer-close"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                ×
              </button>
            </div>

            <div className="mobile-drawer-links">
              {/* Primary Pages Links */}
              <div className="mobile-drawer-primary-group">
                <Link
                  href="/courses"
                  className={`mobile-drawer-btn-highlight ${currentPage === 'courses' ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon name="book-open" size={16} color="#FFDF85" />
                  <span>Explore All Courses &amp; Programs</span>
                </Link>
                <Link
                  href="/teachers"
                  className={`mobile-drawer-btn-highlight ${currentPage === 'teachers' ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon name="users" size={16} color="#FFDF85" />
                  <span>Meet Al-Azhar Faculty &amp; Scholars</span>
                </Link>
                <a
                  href="https://wa.me/201094714943"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mobile-drawer-btn-highlight wa-drawer-btn"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon name="whatsapp" size={16} color="#25D366" />
                  <span>Chat Admissions (+20 10 94714943)</span>
                </a>
              </div>

              <div className="mobile-drawer-divider-label">
                <span>CHAPTERS &amp; CURRICULUM</span>
              </div>

              <button
                className={`mobile-drawer-link ${activeSpread === 0 ? 'active' : ''}`}
                onClick={() => handleMobileNav(0)}
              >
                <span className="link-num">00</span>
                <span className="link-title">Overview &amp; Welcome</span>
              </button>
              {navLinks.map((link) => (
                <button
                  key={link.spread}
                  className={`mobile-drawer-link ${activeSpread === link.spread ? 'active' : ''}`}
                  onClick={() => handleMobileNav(link.spread)}
                >
                  <span className="link-num">0{link.spread}</span>
                  <span className="link-title">{link.label}</span>
                </button>
              ))}
              <button
                className={`mobile-drawer-link ${activeSpread === 8 ? 'active' : ''}`}
                onClick={() => handleMobileNav(8)}
              >
                <span className="link-num">08</span>
                <span className="link-title">Enrollment &amp; Admissions</span>
              </button>
            </div>

            <div className="mobile-drawer-footer">
              <button
                className="btn-gold-pill drawer-cta"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
              >
                <span>Book 1-on-1 Consultation</span>
                <Icon name="arrow-right" size={16} color="#062A24" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
