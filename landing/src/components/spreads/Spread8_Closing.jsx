import React from 'react';
import Link from 'next/link';
import { DiamondOrnament, Icon } from '../Icons';

export default function Spread8_Closing({ onOpenBooking, onNavigate, side = 'both' }) {
  const leftContent = (
    <div className="spread-page spread-page-left invitation-page">
      <div className="invitation-content">
        <DiamondOrnament size={46} diamondSize={26.68} centerColor="#F3E9D3" borderColor="#C5A45A" />
        <h2 className="spread-heading light">
          Your next page<br />
          can begin today.
        </h2>
        <p className="spread-desc light">
          Take the first step towards a lifelong connection with the Book of Allah. Book a complimentary 1-on-1 diagnostic with our mentors.
        </p>
      </div>
      <p className="assurance-text">
        No commitment required. 100% free consultation & trial lesson.
      </p>
    </div>
  );

  const rightContent = (
    <div className="spread-page spread-page-right enrollment-card-page">
      <div className="enrollment-card">
        <div className="enrollment-card-header">
          <div className="card-header-titles">
            <span className="card-kicker">PERSONALIZED PLAN</span>
            <h3 className="card-title">Complimentary Session</h3>
          </div>
          <div className="duration-pill">
            <span>30 MIN</span>
          </div>
        </div>

        {/* 3 Perks with green checks */}
        <div className="included-items-list">
          <div className="included-item">
            <div className="included-check">
              <Icon name="check" size={13} color="#FFDF85" />
            </div>
            <span className="included-text">Comprehensive recitation &amp; tajweed diagnostic</span>
          </div>

          <div className="included-item">
            <div className="included-check">
              <Icon name="check" size={13} color="#FFDF85" />
            </div>
            <span className="included-text">Personalized memorization pacing recommendation</span>
          </div>

          <div className="included-item">
            <div className="included-check">
              <Icon name="check" size={13} color="#FFDF85" />
            </div>
            <span className="included-text">1-on-1 consultation with an Ijazah certified scholar</span>
          </div>
        </div>

        {/* CTA button */}
        <button className="btn-gold-pill w-full" onClick={onOpenBooking}>
          <span>Book your free session</span>
          <Icon name="arrow-right" size={17} color="#062A24" />
        </button>
      </div>

      {/* Social channels: YouTube, Facebook, WhatsApp */}
      <div className="closing-social-channels">
        <div className="social-channels-header">
          <span className="social-channels-rule" />
          <span className="social-channels-title">Direct Support &amp; Community</span>
          <span className="social-channels-rule" />
        </div>
        <div className="social-channel-pills">
          <a
            href="https://wa.me/201094714943"
            target="_blank"
            rel="noopener noreferrer"
            className="social-pill-btn whatsapp"
            title="Chat with Us on WhatsApp (+20 10 94714943)"
          >
            <span className="social-pill-icon whatsapp">
              <Icon name="whatsapp" size={16} />
            </span>
            <span className="social-pill-text">WhatsApp</span>
          </a>

          <a
            href="https://youtube.com/@ourquraninstitute"
            target="_blank"
            rel="noopener noreferrer"
            className="social-pill-btn youtube"
            title="Watch Recitations on YouTube"
          >
            <span className="social-pill-icon youtube">
              <Icon name="youtube" size={16} />
            </span>
            <span className="social-pill-text">YouTube</span>
          </a>

          <a
            href="https://facebook.com/ourquraninstitute"
            target="_blank"
            rel="noopener noreferrer"
            className="social-pill-btn facebook"
            title="Join Our Facebook Community"
          >
            <span className="social-pill-icon facebook">
              <Icon name="facebook" size={16} />
            </span>
            <span className="social-pill-text">Facebook</span>
          </a>
        </div>
      </div>

      {/* Page number */}
      <div className="page-number-tag gold">08</div>
    </div>
  );

  if (side === 'left') return leftContent;
  if (side === 'right') return rightContent;

  return (
    <div className="book-spread dark-spread">
      {/* Page edge & Center gutter & Lifted corner for dark spread */}
      <div className="book-page-edge dark-edge" />
      <div className="book-center-gutter dark-gutter" />
      <div className="lifted-corner dark-corner" title="Beginning of book" onClick={() => onNavigate(0)} />

      {/* Enrollment pages */}
      <div className="enrollment-pages-layout">
        <div className="enrollment-invitation-row">
          {leftContent}
          {rightContent}
        </div>

        {/* Spread Footer */}
        <footer className="spread-footer">
          <div className="footer-brand" onClick={() => onNavigate(0)} style={{ cursor: 'pointer' }}>
            <img src="/assets/logo_gold.png" alt="Our Quran Institute" className="footer-brand-logo" />
            <span className="footer-brand-name">Our Quran Institute</span>
          </div>

          <div className="footer-links">
            <Link href="/courses" className="footer-link">Programs</Link>
            <Link href="/teachers" className="footer-link">Faculty</Link>
            <button className="footer-link" onClick={() => onNavigate(1)}>Method</button>
            <button className="footer-link" onClick={() => onNavigate(5)}>Mentors</button>
            <button className="footer-link" onClick={() => onNavigate(6)}>Programs Showcase</button>
            <button className="footer-link" onClick={() => onNavigate(7)}>Global Map</button>
          </div>

          <div className="footer-social-links">
            <a href="https://wa.me/201094714943" target="_blank" rel="noopener noreferrer" className="footer-social-btn" title="WhatsApp (+20 10 94714943)">
              <Icon name="whatsapp" size={15} />
            </a>
            <a href="https://youtube.com/@ourquraninstitute" target="_blank" rel="noopener noreferrer" className="footer-social-btn" title="YouTube">
              <Icon name="youtube" size={15} />
            </a>
            <a href="https://facebook.com/ourquraninstitute" target="_blank" rel="noopener noreferrer" className="footer-social-btn" title="Facebook">
              <Icon name="facebook" size={15} />
            </a>
          </div>

          <span className="footer-copyright">© 2026 Hifz Journey</span>
        </footer>
      </div>
    </div>
  );
}
