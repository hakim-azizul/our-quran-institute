'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navigation from '../../src/components/Navigation';
import BookingModal from '../../src/components/BookingModal';
import { Icon } from '../../src/components/Icons';

export default function MethodologyPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const pillars = [
    {
      num: '01',
      title: '15-Minute Daily Micro-Habit',
      subtitle: 'CONSISTENCY OVER EXHAUSTION',
      description: 'The Prophet ﷺ taught that the most beloved deeds to Allah are those done consistently, even if small. We structure your Quran learning into a calm, focused 15-minute daily flow that fits naturally into work, university, or family life without mental fatigue.'
    },
    {
      num: '02',
      title: 'Spaced Repetition Science',
      subtitle: 'CLASSICAL 3-TIER RETENTION',
      description: 'Classical scholars preserved the Quran through rigorous revision cycles. We formalize this with spaced repetition: Sabaq (new verses), Sabqi (recent retention within the current Juz), and Manzil (continuous grand review of all previously memorized Surahs).'
    },
    {
      num: '03',
      title: '1-on-1 Sanad Mentorship',
      subtitle: 'AUTHENTIC ISNAD CHAINS',
      description: 'You never learn alone. Every student is paired with an Al-Azhar graduate who holds certified Sanad with an unbroken chain of transmission back to the Prophet Muhammad ﷺ, ensuring phonetic precision (Tajweed) and emotional encouragement.'
    },
    {
      num: '04',
      title: 'Measurable Effort Tracking',
      subtitle: 'CLEAR MILESTONES & REVISION LOGS',
      description: 'Track your daily Ayah counts, revision cycles, and Tajweed milestones through your digital student portal. Transparent parent updates and weekly scholarly feedback keep you continuously motivated.'
    }
  ];

  return (
    <div className="dedicated-page-wrapper">
      <Navigation
        currentPage="methodology"
        onOpenBooking={() => setIsBookingOpen(true)}
      />

      {/* Hero */}
      <section className="dedicated-hero">
        <div className="dedicated-hero-glow" />
        <div className="dedicated-hero-content">
          <div className="section-label">
            <div className="label-rule" />
            <span className="label-text">SACRED MEMORIZATION METHODOLOGY</span>
            <div className="label-rule" />
          </div>
          <h1 className="dedicated-hero-title">
            The Pathway from Intention<br />
            to Lifelong Recall
          </h1>
          <p className="dedicated-hero-desc">
            How ancient classical Hifz traditions and modern cognitive recall science combine to help you memorize, understand, and retain the Holy Quran with permanent confidence.
          </p>
          <div className="dedicated-hero-actions">
            <button className="btn-gold-pill" onClick={() => setIsBookingOpen(true)}>
              <span>Book Complimentary Assessment</span>
              <Icon name="arrow-right" size={15} color="#062A24" />
            </button>
            <Link href="/courses" className="btn-cream-pill">
              <span>Explore Programs</span>
              <Icon name="book-open" size={15} color="#062A24" />
            </Link>
          </div>
        </div>
      </section>

      {/* Main Pillars */}
      <section className="dedicated-content-section">
        <div className="dedicated-container">
          <div className="methodology-grid">
            {pillars.map((p) => (
              <div key={p.num} className="methodology-card">
                <span className="method-card-num">{p.num}</span>
                <span className="method-card-kicker">{p.subtitle}</span>
                <h3 className="method-card-title">{p.title}</h3>
                <p className="method-card-desc">{p.description}</p>
              </div>
            ))}
          </div>

          {/* Call to action */}
          <div className="methodology-cta-box">
            <h3 className="method-cta-title">Begin Your Sacred Journey Today</h3>
            <p className="method-cta-desc">
              Schedule a complimentary 1-on-1 placement session with an Al-Azhar scholar to assess your reading, set a personalized pace, and receive your tailored memorization roadmap.
            </p>
            <button className="btn-gold-pill" onClick={() => setIsBookingOpen(true)}>
              <span>Reserve Your Free Session</span>
              <Icon name="arrow-up-right" size={15} color="#062A24" />
            </button>
          </div>
        </div>
      </section>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialCourse="Quran Hifz Course"
      />
    </div>
  );
}
