'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DiamondOrnament, Icon } from './Icons';

export default function Navigation({
  onNavigate,
  activeSpread,
  onOpenBooking,
  onOpenLogin,
  currentPage = 'home'
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Our Vision', spread: 1 },
    { label: 'World Map', spread: 4 },
    { label: 'Journal', spread: 5 }
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

          {navLinks.map((link) => (
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
        </nav>

        {/* Right Actions */}
        <div className="nav-actions">
          {/* "Log in Button for exist users, students & teachers" (Annotated from Reference Image) */}
          <button
            type="button"
            className="nav-portal-login-btn"
            onClick={onOpenLogin}
            title="Log in for existing users, students & teachers"
          >
            <span className="login-dot">●</span>
            <span className="login-btn-text">Portal Login</span>
          </button>

          {/* Primary CTA: Book Free Session */}
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
              {/* Login Button for Existing Users in Mobile Drawer */}
              <button
                type="button"
                className="mobile-drawer-login-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenLogin) onOpenLogin();
                }}
              >
                <div className="drawer-login-icon">🔑</div>
                <div className="drawer-login-texts">
                  <span className="drawer-login-title">Student &amp; Teacher Portal Login</span>
                  <span className="drawer-login-sub">Access Zoom Classroom, LMS &amp; Hifz Tracker</span>
                </div>
              </button>

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
                <a
                  href="https://www.instagram.com/ourquraninstitute/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mobile-drawer-btn-highlight"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon name="instagram" size={16} color="#FF7A93" />
                  <span>Instagram (@ourquraninstitute)</span>
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
              <button
                className={`mobile-drawer-link ${activeSpread === 1 ? 'active' : ''}`}
                onClick={() => handleMobileNav(1)}
              >
                <span className="link-num">01</span>
                <span className="link-title">Our Vision</span>
              </button>
              <button
                className={`mobile-drawer-link ${activeSpread === 2 ? 'active' : ''}`}
                onClick={() => handleMobileNav(2)}
              >
                <span className="link-num">02</span>
                <span className="link-title">Our Courses</span>
              </button>
              <button
                className={`mobile-drawer-link ${activeSpread === 3 ? 'active' : ''}`}
                onClick={() => handleMobileNav(3)}
              >
                <span className="link-num">03</span>
                <span className="link-title">Faculty &amp; Mentors</span>
              </button>
              <button
                className={`mobile-drawer-link ${activeSpread === 4 ? 'active' : ''}`}
                onClick={() => handleMobileNav(4)}
              >
                <span className="link-num">04</span>
                <span className="link-title">World Map</span>
              </button>
              <button
                className={`mobile-drawer-link ${activeSpread === 5 ? 'active' : ''}`}
                onClick={() => handleMobileNav(5)}
              >
                <span className="link-num">05</span>
                <span className="link-title">Journal</span>
              </button>
              <button
                className={`mobile-drawer-link ${activeSpread === 6 ? 'active' : ''}`}
                onClick={() => handleMobileNav(6)}
              >
                <span className="link-num">06</span>
                <span className="link-title">Book Free Session</span>
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
