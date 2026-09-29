import React, { useState } from 'react';
import { DiamondOrnament, Icon } from './Icons';

export default function BookingModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    timezone: 'UTC+0 (London)',
    goal: 'memorization',
    experience: 'beginner'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // Auto close after success
    }, 2500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          ×
        </button>

        {submitted ? (
          <div className="modal-success-view">
            <img src="/assets/logo_gold.png" alt="Our Quran Institute" className="modal-success-logo" />
            <h3 className="modal-success-title">Your Session is Reserved</h3>
            <p className="modal-success-desc">
              Barakallahu feekum, <strong>{formData.name || 'Seeker'}</strong>. We have sent your onboarding diagnostic invite to <strong>{formData.email || 'your email'}</strong>. Ustadh Azizul Hakim and the mentorship team look forward to meeting you.
            </p>
            <button className="btn-gold-pill" onClick={onClose} style={{ marginTop: '20px' }}>
              <span>Return to Book</span>
            </button>
          </div>
        ) : (
          <div className="modal-form-view">
            <div className="modal-header">
              <img src="/assets/logo_gold.png" alt="Our Quran Institute" className="modal-header-logo" />
              <div>
                <span className="modal-kicker">COMPLIMENTARY ASSESSMENT</span>
                <h3 className="modal-title">Book Your 1-on-1 Session</h3>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="booking-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maryam Al-Hassan"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="you@domain.com"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Primary Intention</label>
                  <select
                    className="form-select"
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  >
                    <option value="memorization">Hifz / Memorization</option>
                    <option value="tajweed">Tajweed & Fluency</option>
                    <option value="retention">Revision of Previous Juz</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Timezone</label>
                  <select
                    className="form-select"
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  >
                    <option value="UTC+0 (London)">UTC+0 (London, Dublin)</option>
                    <option value="UTC-5 (New York)">UTC-5 (New York, Toronto)</option>
                    <option value="UTC+3 (Riyadh, Istanbul)">UTC+3 (Makkah, Istanbul)</option>
                    <option value="UTC+4 (Dubai)">UTC+4 (Dubai)</option>
                    <option value="UTC+8 (Singapore)">UTC+8 (Singapore, KL)</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn-gold-pill w-full" style={{ marginTop: '12px' }}>
                <span>Confirm Free Trial Booking</span>
                <Icon name="arrow-right" size={17} color="#062A24" />
              </button>

              <span className="form-disclaimer">
                100% Free • No card required • Certified Ijazah mentors
              </span>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
