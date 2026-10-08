'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from './Icons';
import TimezoneSelect, { ALL_TIMEZONES } from './TimezoneSelect';
import CustomDatePicker from './CustomDatePicker';
import CustomTimePicker from './CustomTimePicker';

export default function BookingModal({ isOpen, onClose, initialCourse = '' }) {
  const [formData, setFormData] = useState({
    fullName: '',
    whatsapp: '',
    email: '',
    currentAddress: '',
    preferredDate: '',
    preferredTime: '',
    timezone: 'UTC+0 (London, GMT)',
    course: initialCourse || ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Today's date in YYYY-MM-DD for min date
  const todayStr = new Date().toISOString().split('T')[0];

  // Sync initialCourse if provided or changed
  useEffect(() => {
    if (initialCourse) {
      setFormData((prev) => ({ ...prev, course: initialCourse }));
    }
  }, [initialCourse]);

  // Auto-detect user's local timezone if available
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && Intl && Intl.DateTimeFormat) {
        const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (userTz) {
          const parts = userTz.toLowerCase().split('/');
          const cityPart = parts[parts.length - 1].replace(/_/g, ' ');
          const found = ALL_TIMEZONES.find((tz) =>
            tz.cities.toLowerCase().includes(cityPart)
          );
          if (found) {
            setFormData((prev) => ({ ...prev, timezone: found.value }));
          }
        }
      }
    } catch (e) {
      // Keep default
    }
  }, []);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate instant reservation handling
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 500);
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      whatsapp: '',
      email: '',
      currentAddress: '',
      preferredDate: '',
      preferredTime: '',
      timezone: 'UTC+0 (London, GMT)',
      course: initialCourse || ''
    });
    setIsSubmitted(false);
  };

  // WhatsApp confirmation direct link
  const waMessage = encodeURIComponent(
    `Assalamu Alaikum! I would like to confirm my Free 1-on-1 Placement Session with Our Quran Institute.\n\n` +
    `• Name: ${formData.fullName}\n` +
    `• WhatsApp: ${formData.whatsapp}\n` +
    `• Email: ${formData.email}\n` +
    `• Location: ${formData.currentAddress}\n` +
    `• Date: ${formData.preferredDate || 'Flexible'}\n` +
    `• Time: ${formData.preferredTime || 'Flexible'}\n` +
    `• Timezone: ${formData.timezone}` +
    (formData.course ? `\n• Selected Program: ${formData.course}` : '')
  );
  const waUrl = `https://wa.me/201094714943?text=${waMessage}`;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card booking-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          ×
        </button>

        {!isSubmitted ? (
          <div className="modal-form-view">
            <div className="modal-header">
              <img src="/assets/logo_gold.png" alt="Our Quran Institute" className="modal-header-logo" />
              <div className="modal-header-text">
                <span className="modal-kicker">OUR QURAN INSTITUTE · COMPLIMENTARY TRIAL</span>
                <h3 className="modal-title">Book Your Free Session</h3>
                <p className="modal-header-desc">
                  Complimentary 30-min 1-on-1 diagnostic lesson • 100% Free
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="session-wireframe-form">
              {/* Row 1: [ Enter your name ] | [ Whatsapp no ] */}
              <div className="form-grid-row form-grid-2col">
                <div className="form-input-group">
                  <label htmlFor="modal-fullname" className="form-field-label">
                    Enter your name
                  </label>
                  <input
                    id="modal-fullname"
                    type="text"
                    name="fullName"
                    required
                    placeholder="Enter your name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="session-input"
                  />
                </div>

                <div className="form-input-group">
                  <label htmlFor="modal-whatsapp" className="form-field-label">
                    Whatsapp no
                  </label>
                  <input
                    id="modal-whatsapp"
                    type="tel"
                    name="whatsapp"
                    required
                    placeholder="Whatsapp with country code"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className="session-input"
                  />
                </div>
              </div>

              {/* Row 2: [ Email Address ] (Full width) */}
              <div className="form-grid-row form-grid-1col">
                <div className="form-input-group">
                  <label htmlFor="modal-email" className="form-field-label">
                    Email Address
                  </label>
                  <input
                    id="modal-email"
                    type="email"
                    name="email"
                    required
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    className="session-input"
                  />
                </div>
              </div>

              {/* Row 3: [ Current address ] (Full width) */}
              <div className="form-grid-row form-grid-1col">
                <div className="form-input-group">
                  <label htmlFor="modal-address" className="form-field-label">
                    Current address
                  </label>
                  <input
                    id="modal-address"
                    type="text"
                    name="currentAddress"
                    required
                    placeholder="City, State / Country"
                    value={formData.currentAddress}
                    onChange={handleChange}
                    className="session-input"
                  />
                </div>
              </div>

              {/* Row 4: [ Date select ] | [ Time select ] | [ Time zone select ] (3 columns) */}
              <div className="form-grid-row form-grid-3col">
                <div className="form-input-group">
                  <label htmlFor="modal-date" className="form-field-label">
                    Date select
                  </label>
                  <CustomDatePicker
                    id="modal-date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    minDate={todayStr}
                    placeholder="Select date"
                    required
                  />
                </div>

                <div className="form-input-group">
                  <label htmlFor="modal-time" className="form-field-label">
                    Time select
                  </label>
                  <CustomTimePicker
                    id="modal-time"
                    name="preferredTime"
                    required
                    value={formData.preferredTime}
                    onChange={handleChange}
                    placeholder="Select time slot"
                  />
                </div>

                <div className="form-input-group">
                  <label htmlFor="modal-timezone" className="form-field-label">
                    Time zone select
                  </label>
                  <TimezoneSelect
                    id="modal-timezone"
                    value={formData.timezone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Row 5: [ Submit button ] */}
              <div className="form-grid-row form-grid-submit">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-submit-session"
                >
                  {isSubmitting ? (
                    <span>Reserving your session...</span>
                  ) : (
                    <>
                      <span>Book Free Session Now</span>
                      <div className="btn-submit-icon">
                        <Icon name="arrow-right" size={13} color="#062820" />
                      </div>
                    </>
                  )}
                </button>
              </div>

              <span className="form-disclaimer" style={{ marginTop: '4px' }}>
                100% Free Trial • No Credit Card Required • Al-Azhar Certified Faculty
              </span>
            </form>
          </div>
        ) : (
          /* Success State matching BookFreeSessionSection */
          <div className="session-success-card">
            <div className="success-badge-icon">
              <Icon name="check" size={26} color="#FFFFFF" />
            </div>

            <h3 className="success-title">Alhamdulillah!</h3>
            <p className="success-subtitle">
              Your free session request has been registered.
            </p>

            <div className="success-details-box">
              <div className="detail-item">
                <span className="detail-label">Name:</span>
                <span className="detail-val">{formData.fullName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Date & Time:</span>
                <span className="detail-val">
                  {formData.preferredDate || 'Flexible'} • {formData.preferredTime || 'Flexible'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Timezone:</span>
                <span className="detail-val">{formData.timezone}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">WhatsApp:</span>
                <span className="detail-val">{formData.whatsapp}</span>
              </div>
              {formData.course && (
                <div className="detail-item">
                  <span className="detail-label">Program:</span>
                  <span className="detail-val">{formData.course}</span>
                </div>
              )}
            </div>

            <p className="success-callout">
              Our admissions team will contact you shortly to confirm your teacher assignment and send your meeting link.
            </p>

            <div className="success-actions">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa-confirm"
              >
                <Icon name="whatsapp" size={18} color="#FFFFFF" />
                <span>Confirm Instantly via WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  handleReset();
                  onClose();
                }}
                className="btn-book-another"
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
