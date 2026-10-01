import React, { useState } from 'react';
import { DiamondOrnament, Icon } from './Icons';

export default function BookingModal({ isOpen, onClose, initialCourse = '' }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    timezone: 'UTC+0 (London)',
    course: initialCourse || 'hifz',
    experience: 'beginner'
  });

  // Sync if initialCourse changes
  React.useEffect(() => {
    if (initialCourse) {
      setFormData((prev) => ({ ...prev, course: initialCourse }));
    }
  }, [initialCourse]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
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
            <h3 className="modal-success-title">Your Free Assessment is Reserved</h3>
            <p className="modal-success-desc">
              Barakallahu feekum, <strong>{formData.name || 'Seeker'}</strong>. We have received your enrollment request for <strong>{formData.course || 'your selected program'}</strong>. Our admissions dean and scholarly mentorship team will connect with you via email (<strong>{formData.email}</strong>) and WhatsApp within 24 hours.
            </p>
            <div className="modal-success-whatsapp-note">
              <span>Need immediate assistance?</span>
              <a
                href="https://wa.me/201094714943"
                target="_blank"
                rel="noopener noreferrer"
                className="modal-whatsapp-link"
              >
                <Icon name="whatsapp" size={15} color="#25D366" />
                <span>Message Admissions on WhatsApp: +20 10 94714943</span>
              </a>
            </div>
            <button className="btn-gold-pill" onClick={onClose} style={{ marginTop: '20px' }}>
              <span>Return to Institute</span>
            </button>
          </div>
        ) : (
          <div className="modal-form-view">
            <div className="modal-header">
              <img src="/assets/logo_gold.png" alt="Our Quran Institute" className="modal-header-logo" />
              <div>
                <span className="modal-kicker">OUR QURAN INSTITUTE · COMPLIMENTARY TRIAL</span>
                <h3 className="modal-title">Book 1-on-1 Scholar Session</h3>
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

              <div className="form-row">
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

                <div className="form-group">
                  <label className="form-label">WhatsApp Number (Optional)</label>
                  <input
                    type="tel"
                    placeholder="+1 ... or +44 ..."
                    className="form-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Select Program of Study</label>
                  <select
                    className="form-select"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  >
                    <option value="Full Quran Memorization (Hifz & Itqan)">Full Quran Memorization (Hifz &amp; Itqan)</option>
                    <option value="Tajweed Mastery & Theoretical Phonetics">Tajweed Mastery &amp; Phonetics</option>
                    <option value="Quranic & Classical Arabic (Fusha)">Quranic &amp; Classical Arabic (Fusha)</option>
                    <option value="Comprehensive Islamic Studies (Ulum al-Din)">Comprehensive Islamic Studies</option>
                    <option value="Noorani Qaida & Reading for Kids/Beginners">Noorani Qaida &amp; Reading for Kids/Beginners</option>
                    <option value="Ten Qira'at Specialization & Sanad">Ten Qira'at Specialization (Al-Azhar Sanad)</option>
                    <option value="General Diagnostic & Placement Assessment">General Placement Assessment</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Your Timezone</label>
                  <select
                    className="form-select"
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  >
                    <option value="UTC+0 (London)">UTC+0 (London, Dublin)</option>
                    <option value="UTC-5 (New York)">UTC-5 (New York, Toronto)</option>
                    <option value="UTC-8 (Los Angeles)">UTC-8 (San Francisco, Vancouver)</option>
                    <option value="UTC+1 (Europe)">UTC+1 (Paris, Berlin, Amsterdam)</option>
                    <option value="UTC+2 (Cairo)">UTC+2 (Cairo, Alexandria)</option>
                    <option value="UTC+3 (Riyadh, Makkah)">UTC+3 (Makkah, Riyadh, Istanbul)</option>
                    <option value="UTC+4 (Dubai)">UTC+4 (Dubai, Abu Dhabi)</option>
                    <option value="UTC+8 (Singapore)">UTC+8 (Singapore, KL, Perth)</option>
                    <option value="UTC+10 (Sydney)">UTC+10 (Sydney, Melbourne)</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn-gold-pill w-full" style={{ marginTop: '12px' }}>
                <span>Confirm Complimentary Session</span>
                <Icon name="arrow-right" size={17} color="#062A24" />
              </button>

              <span className="form-disclaimer">
                100% Free Trial • No Credit Card Required • Al-Azhar Certified Faculty
              </span>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
