'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navigation from '../../src/components/Navigation';
import BookingModal from '../../src/components/BookingModal';
import { Icon } from '../../src/components/Icons';

export default function AboutPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const values = [
    {
      title: 'Unbroken Sanad Heritage',
      desc: 'Every scholar at Our Quran Institute has received their Sanad through an unbroken oral chain extending across 14 centuries to the Messenger of Allah ﷺ.'
    },
    {
      title: 'Global Inclusivity',
      desc: 'Active students spanning 42+ countries across North America, Europe, the Middle East, and Asia find a unified spiritual home in our virtual halqas.'
    },
    {
      title: 'Gentle, Patient Adab',
      desc: 'Our teachers reflect the prophetic Sunnah of patience, gentleness, and wisdom — meeting children, adults, and new Muslims at their exact level.'
    },
    {
      title: 'Purity of Intention (Ikhlas)',
      desc: 'We cultivate the heart alongside the tongue, ensuring that memorization of the Quran becomes a source of inner peace and righteous action.'
    }
  ];

  return (
    <div className="dedicated-page-wrapper">
      <Navigation
        currentPage="about"
        onOpenBooking={() => setIsBookingOpen(true)}
      />

      <section className="dedicated-hero">
        <div className="dedicated-hero-glow" />
        <div className="dedicated-hero-content">
          <div className="section-label">
            <div className="label-rule" />
            <span className="label-text">OUR MISSION &amp; VISION</span>
            <div className="label-rule" />
          </div>
          <h1 className="dedicated-hero-title">
            A Peaceful Sanctuary to Pray,<br />
            Learn, and Belong
          </h1>
          <p className="dedicated-hero-desc">
            Our Quran Institute was founded to revive authentic classical Quranic education for modern lives worldwide — uniting dedicated students with certified scholars from Al-Azhar University.
          </p>
          <div className="dedicated-hero-actions">
            <button className="btn-gold-pill" onClick={() => setIsBookingOpen(true)}>
              <span>Join Our Global Sanctuary</span>
              <Icon name="arrow-right" size={15} color="#062A24" />
            </button>
            <Link href="/teachers" className="btn-cream-pill">
              <span>Meet the Scholars</span>
              <Icon name="users" size={15} color="#062A24" />
            </Link>
          </div>
        </div>
      </section>

      <section className="dedicated-content-section">
        <div className="dedicated-container">
          <div className="about-values-grid">
            {values.map((v, i) => (
              <div key={i} className="about-value-card">
                <span className="value-bullet">✦</span>
                <h3 className="value-title">{v.title}</h3>
                <p className="value-desc">{v.desc}</p>
              </div>
            ))}
          </div>

          <div className="about-stats-banner">
            <div className="about-stat-col">
              <span className="stat-big-num">42+</span>
              <span className="stat-sub-text">Countries Active</span>
            </div>
            <div className="stat-separator" />
            <div className="about-stat-col">
              <span className="stat-big-num">100%</span>
              <span className="stat-sub-text">Al-Azhar Certified</span>
            </div>
            <div className="stat-separator" />
            <div className="about-stat-col">
              <span className="stat-big-num">10</span>
              <span className="stat-sub-text">Recognized Qira’at</span>
            </div>
            <div className="stat-separator" />
            <div className="about-stat-col">
              <span className="stat-big-num">1-on-1</span>
              <span className="stat-sub-text">Personal Mentorship</span>
            </div>
          </div>
        </div>
      </section>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}
