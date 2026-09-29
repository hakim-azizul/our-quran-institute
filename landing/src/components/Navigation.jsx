import React, { useState } from 'react';
import { DiamondOrnament, Icon } from './Icons';

export default function Navigation({
  onNavigate,
  activeSpread,
  onOpenBooking
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Method', spread: 1 },
    { label: 'Daily Flow', spread: 2 },
    { label: 'Retention', spread: 3 },
    { label: 'Progress', spread: 4 },
    { label: 'Mentors', spread: 5 },
    { label: 'Global Map', spread: 6 },
    { label: 'Principles', spread: 7 }
  ];

  const handleMobileNav = (spread) => {
    onNavigate(spread);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="nav-container sticky-nav">
        {/* Brand */}
        <div className="nav-brand" onClick={() => onNavigate(0)} style={{ cursor: 'pointer' }}>
          <img
            src="/assets/logo_gold.png"
            alt="Our Quran Institute Logo"
            className="nav-brand-logo"
          />
          <div className="nav-brand-text">
            <span className="brand-name">Our Quran Institute</span>
            <span className="brand-descriptor">HIFZ JOURNEY · A SACRED PATH</span>
          </div>
        </div>

        {/* Desktop Nav links */}
        <nav className="nav-links">
          {navLinks.map((link) => (
            <button
              key={link.spread}
              className={`nav-link ${activeSpread === link.spread ? 'active' : ''}`}
              onClick={() => onNavigate(link.spread)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="nav-actions">
          {/* Primary CTA */}
          <button className="nav-cta-btn" onClick={onOpenBooking}>
            <span className="nav-cta-text">Book a session</span>
            <Icon name="arrow-up-right" size={15} color="#FBF6E9" />
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
                <span className="drawer-title">Chapters of the Book</span>
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
              <button
                className={`mobile-drawer-link ${activeSpread === 0 ? 'active' : ''}`}
                onClick={() => handleMobileNav(0)}
              >
                <span className="link-num">00</span>
                <span className="link-title">Open the Book (Cover &amp; Hero)</span>
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
                <span className="link-title">The Sacred Call &amp; Enrollment</span>
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
