'use client';

import React, { useState } from 'react';
import { Icon } from './Icons';

export default function BookFreeSessionSection({ initialCourse = '' }) {
  const [formData, setFormData] = useState({
    fullName: '',
    whatsapp: '',
    email: '',
    currentAddress: '',
    preferredDate: '',
    preferredTime: '',
    timezone: 'UTC+0 (London, GMT)'
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Today's date in YYYY-MM-DD for min date
  const todayStr = new Date().toISOString().split('T')[0];

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
    }, 600);
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      whatsapp: '',
      email: '',
      currentAddress: '',
      preferredDate: '',
      preferredTime: '',
      timezone: 'UTC+0 (London, GMT)'
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
    `• Timezone: ${formData.timezone}`
  );
  const waUrl = `https://wa.me/201094714943?text=${waMessage}`;

  // Smooth symmetrical 12-lobed Islamic cartouche medallion path
  const medallionPath =
    "M 200 14 " +
    "C 223.9 3.9, 251.1 14.5, 262 38 " +
    "C 289.1 33.2, 317.3 49.9, 326 76 " +
    "C 352.8 74.2, 377.4 93.5, 382 120 " +
    "C 377.4 146.5, 352.8 165.8, 326 164 " +
    "C 317.3 190.1, 289.1 206.8, 262 202 " +
    "C 251.1 225.5, 223.9 236.1, 200 226 " +
    "C 176.1 236.1, 148.9 225.5, 138 202 " +
    "C 110.9 206.8, 82.7 190.1, 74 164 " +
    "C 47.2 165.8, 22.6 146.5, 18 120 " +
    "C 22.6 93.5, 47.2 74.2, 74 76 " +
    "C 82.7 49.9, 110.9 33.2, 138 38 " +
    "C 148.9 14.5, 176.1 3.9, 200 14 Z";

  return (
    <section id="book-free-session" className="book-session-outer-wrap">
      <div className="book-session-container">
        {/* Main Light Sage Card matching template */}
        <div className="book-session-card">
          {/* Subtle Islamic Trellis Watermark */}
          <div className="book-session-trellis-bg" />

          {/* Mosque Skyline Graphic at Bottom-Left */}
          <div className="book-session-mosque-silhouette">
            <img
              src="/assets/mosque_hill_silhouette.svg"
              alt="Mosque Skyline Silhouette"
              className="mosque-silhouette-svg"
            />
          </div>

          <div className="book-session-content-grid">
            {/* Left Column: Pill, Title, Subtitle, Scalloped Medallion */}
            <div className="book-session-left">
              {/* Badge Pill (From Reference Image: Help & Donate -> Free Assessment) */}
              <div className="session-badge-pill">
                <span className="badge-pill-dot">●</span>
                <span className="badge-pill-text">Free Assessment</span>
              </div>

              {/* Heading */}
              <h2 className="session-left-headline">
                Book / Reserve<br />
                <span className="headline-highlight">Your Free Session</span>
              </h2>

              {/* Subtext */}
              <p className="session-left-description">
                Experience our dedicated 1-on-1 personalized Quran guidance with a certified Al-Azhar instructor. Assess your recitation, select your pace, and receive your tailored learning roadmap.
              </p>

              {/* Scalloped Islamic Medallion with Mosque Interior Photo */}
              <div className="session-medallion-container">
                <div className="medallion-frame-wrapper">
                  <svg
                    viewBox="0 0 400 240"
                    className="medallion-svg"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <clipPath id="sessionMedallionClip">
                        <path d={medallionPath} />
                      </clipPath>
                    </defs>

                    {/* Subtle outer glow / shadow contour */}
                    <path
                      d={medallionPath}
                      fill="#C5A45A"
                      opacity="0.16"
                      transform="translate(200, 120) scale(1.025) translate(-200, -120)"
                    />

                    {/* Mosque Interior Clipped Image */}
                    <g clipPath="url(#sessionMedallionClip)">
                      <image
                        href="/assets/mosque_dome_interior.jpg"
                        x="0"
                        y="-30"
                        width="400"
                        height="300"
                        preserveAspectRatio="xMidYMid slice"
                      />
                    </g>

                    {/* Golden / Brass Ornamental Border Stroke */}
                    <path
                      d={medallionPath}
                      fill="none"
                      stroke="#C5A45A"
                      strokeWidth="2.5"
                      strokeOpacity="0.95"
                    />

                    {/* Delicate Inner Golden Fillet Accent */}
                    <path
                      d={medallionPath}
                      fill="none"
                      stroke="#FFDF85"
                      strokeWidth="0.85"
                      strokeOpacity="0.75"
                      transform="translate(200, 120) scale(0.965) translate(-200, -120)"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Right Column: Floating White Form Card matching exact Wireframe */}
            <div className="book-session-right">
              <div className="session-form-card">
                {!isSubmitted ? (
                  <>
                    <div className="form-card-header">
                      <h3 className="form-card-title">Book Your Free Session</h3>
                      <p className="form-card-subtitle">
                        Complimentary 30-min 1-on-1 diagnostic lesson • 100% Free
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="session-wireframe-form">
                      {/* Row 1: [ Enter your name ] | [ Whatsapp no ] */}
                      <div className="form-grid-row form-grid-2col">
                        <div className="form-input-group">
                          <label htmlFor="field-fullname" className="form-field-label">
                            Enter your name
                          </label>
                          <input
                            id="field-fullname"
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
                          <label htmlFor="field-whatsapp" className="form-field-label">
                            Whatsapp no
                          </label>
                          <input
                            id="field-whatsapp"
                            type="tel"
                            name="whatsapp"
                            required
                            placeholder="Whatsapp no (with country code)"
                            value={formData.whatsapp}
                            onChange={handleChange}
                            className="session-input"
                          />
                        </div>
                      </div>

                      {/* Row 2: [ email ] (Full width) */}
                      <div className="form-grid-row form-grid-1col">
                        <div className="form-input-group">
                          <label htmlFor="field-email" className="form-field-label">
                            email
                          </label>
                          <input
                            id="field-email"
                            type="email"
                            name="email"
                            required
                            placeholder="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="session-input"
                          />
                        </div>
                      </div>

                      {/* Row 3: [ Current address ] (Full width) */}
                      <div className="form-grid-row form-grid-1col">
                        <div className="form-input-group">
                          <label htmlFor="field-address" className="form-field-label">
                            Current address
                          </label>
                          <input
                            id="field-address"
                            type="text"
                            name="currentAddress"
                            required
                            placeholder="Current address (City, State / Country)"
                            value={formData.currentAddress}
                            onChange={handleChange}
                            className="session-input"
                          />
                        </div>
                      </div>

                      {/* Row 4: [ Date select ] | [ Time select ] | [ Time zone select ] (3 columns) */}
                      <div className="form-grid-row form-grid-3col">
                        <div className="form-input-group">
                          <label htmlFor="field-date" className="form-field-label">
                            Date select
                          </label>
                          <input
                            id="field-date"
                            type="date"
                            name="preferredDate"
                            min={todayStr}
                            required
                            value={formData.preferredDate}
                            onChange={handleChange}
                            className="session-input date-input"
                          />
                        </div>

                        <div className="form-input-group">
                          <label htmlFor="field-time" className="form-field-label">
                            Time select
                          </label>
                          <select
                            id="field-time"
                            name="preferredTime"
                            required
                            value={formData.preferredTime}
                            onChange={handleChange}
                            className="session-select"
                          >
                            <option value="">Time select</option>
                            <option value="08:00 AM - 10:00 AM">08:00 AM - 10:00 AM (Morning)</option>
                            <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM (Midday)</option>
                            <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM (Afternoon)</option>
                            <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM (Late Day)</option>
                            <option value="06:00 PM - 08:00 PM">06:00 PM - 08:00 PM (Evening)</option>
                            <option value="08:00 PM - 10:00 PM">08:00 PM - 10:00 PM (Night)</option>
                          </select>
                        </div>

                        <div className="form-input-group">
                          <label htmlFor="field-timezone" className="form-field-label">
                            Time zone select
                          </label>
                          <select
                            id="field-timezone"
                            name="timezone"
                            required
                            value={formData.timezone}
                            onChange={handleChange}
                            className="session-select"
                          >
                            <option value="UTC-8 (US/Canada PST)">UTC-8 (US/Canada PST)</option>
                            <option value="UTC-7 (US/Canada MST)">UTC-7 (US/Canada MST)</option>
                            <option value="UTC-6 (US/Canada CST)">UTC-6 (US/Canada CST)</option>
                            <option value="UTC-5 (US/Canada EST)">UTC-5 (US/Canada EST)</option>
                            <option value="UTC+0 (London, GMT)">UTC+0 (London, GMT)</option>
                            <option value="UTC+1 (Paris, Berlin, CET)">UTC+1 (Paris, Berlin, CET)</option>
                            <option value="UTC+2 (Cairo, CAT)">UTC+2 (Cairo, CAT)</option>
                            <option value="UTC+3 (Makkah, Riyadh, AST)">UTC+3 (Makkah, Riyadh, AST)</option>
                            <option value="UTC+4 (Dubai, GST)">UTC+4 (Dubai, GST)</option>
                            <option value="UTC+5 (Pakistan, PKT)">UTC+5 (Pakistan, PKT)</option>
                            <option value="UTC+5:30 (India, IST)">UTC+5:30 (India, IST)</option>
                            <option value="UTC+6 (Bangladesh, BST)">UTC+6 (Bangladesh, BST)</option>
                            <option value="UTC+7 (Jakarta, WIB)">UTC+7 (Jakarta, WIB)</option>
                            <option value="UTC+8 (Singapore / KL)">UTC+8 (Singapore / KL)</option>
                            <option value="UTC+10 (Sydney, AEST)">UTC+10 (Sydney, AEST)</option>
                          </select>
                        </div>
                      </div>

                      {/* Row 5: [ Submit button ] (Full width lime green pill button) */}
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
                                <Icon name="arrow-right" size={15} color="#FFFFFF" />
                              </div>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  /* Success State with WhatsApp Instant Confirmation */
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
                          {formData.preferredDate || 'Flexible'} • {formData.preferredTime}
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
                        onClick={handleReset}
                        className="btn-book-another"
                      >
                        Book Another Session
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
