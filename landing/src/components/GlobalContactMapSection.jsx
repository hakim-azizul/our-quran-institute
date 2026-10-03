'use client';

import React, { useState } from 'react';
import { WORLD_MAP_PATH, GLOBAL_HUBS } from './spreads/WorldMapData';
import { Icon } from './Icons';

export default function GlobalContactMapSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [activeHub, setActiveHub] = useState(GLOBAL_HUBS[2]); // Cairo default
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitted(false);
  };

  // WhatsApp quick link with inquiry
  const waInquiryUrl = `https://wa.me/201094714943?text=${encodeURIComponent(
    `Assalamu Alaikum! I sent an inquiry from Our Quran Institute website:\n\n• Name: ${formData.name}\n• Email: ${formData.email}\n• Subject: ${formData.subject}\n• Message: ${formData.message}`
  )}`;

  return (
    <section id="section-contact-map" className="contact-map-outer-wrap">
      <div className="contact-map-container">
        {/* Main Banner Card */}
        <div className="contact-map-banner-card">
          {/* Ambient Backdrop Overlay */}
          <div className="banner-backdrop-overlay" />

          {/* Cards Row: Left Forest Green Card + Right Vibrant Lime Card */}
          <div className="contact-map-cards-row">
            {/* 1. Left Card: Dark Forest Green with World Map Inset */}
            <div className="contact-info-card">
              {/* Badge Pill */}
              <div className="contact-badge-pill">
                <span className="badge-dot">●</span>
                <span className="badge-text">Contact With Us</span>
              </div>

              {/* Title from Reference */}
              <h2 className="contact-left-title">
                Feel Free to<br />
                Write us Anytime
              </h2>

              <p className="contact-left-desc">
                Our Al-Azhar instructors and academic advisors are available across 42 countries to guide your Quranic journey.
              </p>

              {/* The World Map Inset Card (Requested: "World map, But before blog section") */}
              <div className="world-map-inset-card">
                <div className="inset-map-header">
                  <div className="inset-map-title-group">
                    <span className="inset-map-kicker">GLOBAL NETWORK</span>
                    <h4 className="inset-map-heading">42 Countries Active</h4>
                  </div>
                  <span className="active-hub-badge">
                    <span>{activeHub.flag}</span>
                    <span>{activeHub.shortName}</span>
                  </span>
                </div>

                {/* SVG World Map */}
                <div className="inset-svg-map-wrap">
                  <svg
                    viewBox="0 0 800 440"
                    className="inset-world-svg"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Simplified World Continents Path */}
                    <path
                      d={WORLD_MAP_PATH}
                      fill="#C6DEC5"
                      stroke="#7BA983"
                      strokeWidth="1"
                    />

                    {/* Glowing Global Hub Pins */}
                    {GLOBAL_HUBS.map((hub) => {
                      const isSelected = activeHub.id === hub.id;
                      return (
                        <g
                          key={hub.id}
                          className={`map-hub-pin-group ${isSelected ? 'is-selected' : ''}`}
                          onClick={() => setActiveHub(hub)}
                          style={{ cursor: 'pointer' }}
                        >
                          {/* Animated Pulse Ring */}
                          <circle
                            cx={hub.x}
                            cy={hub.y}
                            r={isSelected ? 14 : 7}
                            className={`pulse-ring ${hub.isScholarsHub ? 'scholars-pulse' : ''}`}
                            fill={hub.isScholarsHub ? 'rgba(197, 164, 90, 0.35)' : 'rgba(56, 142, 60, 0.3)'}
                          />

                          {/* Solid Center Dot */}
                          <circle
                            cx={hub.x}
                            cy={hub.y}
                            r={isSelected ? 5.5 : 4}
                            fill={hub.isScholarsHub ? '#C5A45A' : '#2E7D32'}
                            stroke="#FFFFFF"
                            strokeWidth="1.5"
                          />
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Active Hub Info Pill & Quick Selector */}
                <div className="inset-hub-info-bar">
                  <div className="hub-stat-text">
                    <strong>{activeHub.name}:</strong> {activeHub.students} students • {activeHub.teachers} mentors
                  </div>

                  {/* Quick Hub Pills */}
                  <div className="quick-hubs-list">
                    {GLOBAL_HUBS.slice(0, 4).map((h) => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => setActiveHub(h)}
                        className={`btn-quick-hub ${activeHub.id === h.id ? 'active' : ''}`}
                      >
                        {h.flag} {h.shortName}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Right Card: Vibrant Lime Green Contact Form */}
            <div className="contact-form-card">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="lime-contact-form">
                  {/* Row 1: Your Name | Your Email (2 Columns) */}
                  <div className="lime-form-row lime-form-2col">
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="lime-input"
                    />
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleChange}
                      className="lime-input"
                    />
                  </div>

                  {/* Row 2: Subject (Full Width) */}
                  <div className="lime-form-row lime-form-1col">
                    <input
                      type="text"
                      name="subject"
                      required
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="lime-input"
                    />
                  </div>

                  {/* Row 3: Write a Message (Full Width Textarea) */}
                  <div className="lime-form-row lime-form-1col">
                    <textarea
                      name="message"
                      required
                      rows={4}
                      placeholder="Write a Message"
                      value={formData.message}
                      onChange={handleChange}
                      className="lime-textarea"
                    />
                  </div>

                    {/* Row 4: Submit Button with Arrow Circle */}
                    <div className="lime-form-row lime-form-submit">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-lime-submit"
                      >
                        <span>{isSubmitting ? 'Sending...' : 'Send Message Now'}</span>
                        <div className="submit-arrow-circle">
                          <Icon name="arrow-up-right" size={13} color="#0D2417" />
                        </div>
                      </button>
                    </div>
                </form>
              ) : (
                /* Form Submitted Confirmation State */
                <div className="lime-form-success">
                  <div className="lime-success-icon-disc">
                    <Icon name="check" size={24} color="#0D2417" />
                  </div>
                  <h3 className="lime-success-title">Message Received!</h3>
                  <p className="lime-success-text">
                    Thank you, <strong>{formData.name}</strong>. An academic advisor will reply to your message via email shortly.
                  </p>

                  <div className="lime-success-actions">
                    <a
                      href={waInquiryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-lime-whatsapp-followup"
                    >
                      <Icon name="whatsapp" size={16} color="#FFFFFF" />
                      <span>Chat Immediately on WhatsApp</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="btn-lime-send-another"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. Bottom Floating White Contact Bar (3 Columns matching reference) */}
          <div className="contact-bottom-floating-bar">
            {/* Column 1: Phone */}
            <div className="contact-detail-col">
              <div className="contact-icon-bubble">
                <span className="icon-emoji">📞</span>
              </div>
              <div className="contact-col-text">
                <a href="https://wa.me/201094714943" target="_blank" rel="noopener noreferrer" className="contact-link primary">
                  +20 10 94714943
                </a>
                <a href="tel:+18005557872" className="contact-link secondary">
                  +1 800 555 QURAN
                </a>
              </div>
            </div>

            <div className="contact-bar-separator" />

            {/* Column 2: Email & Web */}
            <div className="contact-detail-col">
              <div className="contact-icon-bubble">
                <span className="icon-emoji">🌐</span>
              </div>
              <div className="contact-col-text">
                <a href="mailto:admissions@ourquraninstitute.com" className="contact-link primary">
                  admissions@ourquraninstitute.com
                </a>
                <a href="https://ourquraninstitute.com" className="contact-link secondary">
                  www.ourquraninstitute.com
                </a>
              </div>
            </div>

            <div className="contact-bar-separator" />

            {/* Column 3: Location */}
            <div className="contact-detail-col">
              <div className="contact-icon-bubble">
                <span className="icon-emoji">📍</span>
              </div>
              <div className="contact-col-text">
                <span className="contact-text-item primary">
                  Al-Azhar University Campus, Cairo
                </span>
                <span className="contact-text-item secondary">
                  Global Virtual Academy • 42 Countries Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
