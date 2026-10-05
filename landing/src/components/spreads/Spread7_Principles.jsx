import React from 'react';
import { DiamondOrnament, Icon } from '../Icons';

export default function Spread7_Principles({ onNext, side = 'both' }) {
  const principles = [
    {
      num: '01',
      arabic: 'AR-RIFQ · الرِّفْق',
      icon: 'gauge',
      title: 'Sustainable Pacing',
      desc: 'Micro-portions calibrated to your cognitive bandwidth. Protecting against mental fatigue and cultivating lasting spiritual joy.',
      pill: '⏱️ 15–20 Mins Daily Habit'
    },
    {
      num: '02',
      arabic: 'AT-TADABBUR · التَّدَبُّر',
      icon: 'layers-3',
      title: 'Deep Context & Roots',
      desc: 'Understanding root words, linguistic nuances, and historical context to anchor every ayah permanently into heart and mind.',
      pill: '🌱 Meaning Before Reciting'
    },
    {
      num: '03',
      arabic: 'AS-SUHBAH · الصُّحْبَة',
      icon: 'user-round-check',
      title: 'Empathetic Mentors',
      desc: 'Sanad-certified scholars who prioritize your spiritual wellbeing, pronunciation ease, and emotional confidence with gentle patience.',
      pill: '🤝 1-on-1 Gentle Guidance'
    },
    {
      num: '04',
      arabic: 'AD-DAWAM · الدَّوَام',
      icon: 'heart-handshake',
      title: 'Enduring Habit Engine',
      desc: 'A lifelong spaced-retention methodology and global community that ensures what is memorized remains effortless decades later.',
      pill: '🔄 Spaced Recall Retention'
    }
  ];

  const leftContent = (
    <div className="spread-page spread-page-left principles-left-page">
      {/* Header */}
      <div className="principles-left-header">
        <div className="principles-header-top-row">
          <div className="section-label">
            <div className="label-rule" />
            <span className="label-text">OUR VISION</span>
          </div>
          <DiamondOrnament size={36} diamondSize={20} centerColor="#062A24" borderColor="#C5A45A" />
        </div>

        <h2 className="spread-heading principles-main-title">
          A disciplined method,<br />
          held with gentleness.
        </h2>

        <p className="spread-desc principles-main-desc">
          We reject the culture of burnout, fear, and fatigue. Sacred memorization was never meant to be a grueling test of endurance—it was meant to be lived, cherished, and preserved for eternity.
        </p>
      </div>

      {/* Illuminated Quranic Calligraphy Card */}
      <div className="quran-ayah-illuminated-card">
        <div className="card-gold-corner top-left" />
        <div className="card-gold-corner top-right" />
        <div className="card-gold-corner bottom-left" />
        <div className="card-gold-corner bottom-right" />

        <div className="ayah-card-top-row">
          <div className="ayah-surah-badge">
            <Icon name="sparkles" size={13} color="#C5A45A" />
            <span>SURAH AL-QAMAR · 54:17</span>
          </div>
          <span className="ayah-ornament-tag">۝ آيَةُ التَّيْسِيرِ</span>
        </div>

        <div className="quranic-calligraphy-text" dir="rtl">
          وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ
        </div>

        <p className="ayah-translation-text">
          “And We have certainly made the Quran easy for remembrance, so is there any who will remember?”
        </p>

        <div className="ayah-annotation-pill">
          <span className="pill-dot" />
          <span>The Divine Promise: Facilitation is built into the Quran’s very design. Our pedagogy honors this truth.</span>
        </div>
      </div>

      {/* Comparison: Conventional Pressure vs. Our Gentle Rigor */}
      <div className="philosophy-contrast-box">
        <div className="contrast-col conventional">
          <div className="contrast-col-header">
            <span className="contrast-badge-icon bad">✕</span>
            <span className="contrast-col-title">Conventional Strain</span>
          </div>
          <ul className="contrast-list">
            <li>Whole-page cramming &amp; cognitive burnout</li>
            <li>Punitive feedback causing recitation anxiety</li>
            <li>65%+ mid-journey abandonment rate</li>
          </ul>
        </div>

        <div className="contrast-col-divider" />

        <div className="contrast-col institute">
          <div className="contrast-col-header">
            <span className="contrast-badge-icon good">✓</span>
            <span className="contrast-col-title">Our Gentle Rigor</span>
          </div>
          <ul className="contrast-list">
            <li>3–5 verses daily calibrated micro-habit</li>
            <li>Empathetic scholar companionship &amp; adab</li>
            <li>99.2% lifetime retention score</li>
          </ul>
        </div>
      </div>

      {/* Founder's Covenant Bar */}
      <div className="founder-covenant-bar">
        <img
          src="/assets/logo_gold.png"
          alt="Institute Seal"
          className="founder-seal-img"
        />
        <div className="founder-quote-content">
          <p className="founder-quote-text">
            “We do not measure your success by raw speed, but by the stillness and tranquility of your heart when you stand in prayer.”
          </p>
          <div className="founder-signature-row">
            <span className="founder-name">Kazi Tayoubur Rahman</span>
            <span className="founder-role">Lead Qari &amp; Ijazah Holder</span>
          </div>
        </div>
      </div>
    </div>
  );

  const rightContent = (
    <div className="spread-page spread-page-right principles-right-page">
      {/* Right Header */}
      <div className="principles-right-header">
        <div className="principles-header-top-row">
          <div className="section-label">
            <div className="label-rule" />
            <span className="label-text">PEDAGOGICAL PILLARS · 04 ANCHORS</span>
          </div>
          <DiamondOrnament size={36} diamondSize={20} centerColor="#062A24" borderColor="#C5A45A" />
        </div>
        <h3 className="principles-subheading">
          Four anchors that protect your journey from exhaustion.
        </h3>
        <p className="principles-subdesc">
          Every daily lesson, revision cycle, and mentor interaction is engineered around these four non-negotiable pillars:
        </p>
      </div>

      {/* 4 Pillar Cards (2x2 Grid) */}
      <div className="principles-grid">
        {principles.map((item, idx) => (
          <div key={idx} className="principle-pillar-card">
            <div className="pillar-card-top">
              <div className="principle-card-icon">
                <Icon name={item.icon} size={17} color="#C5A45A" />
              </div>
              <div className="pillar-badge-group">
                <span className="pillar-num-tag">{item.num}</span>
                <span className="pillar-arabic-text">{item.arabic}</span>
              </div>
            </div>

            <div className="principle-card-content">
              <h4 className="principle-title">{item.title}</h4>
              <p className="principle-desc">{item.desc}</p>
            </div>

            <div className="pillar-practice-pill">
              <span>{item.pill}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Student Sanctuary Guarantee Banner */}
      <div className="student-guarantee-banner">
        <div className="guarantee-header-row">
          <div className="guarantee-badge">
            <Icon name="shield-check" size={16} color="#C5A45A" />
            <span className="guarantee-title">THE STUDENT SANCTUARY GUARANTEE</span>
          </div>
          <span className="guarantee-tagline">Compassion Over Coercion</span>
        </div>

        <div className="guarantee-points-grid">
          <div className="guarantee-point-item">
            <span className="point-check-glyph">✦</span>
            <div className="point-text-block">
              <strong>Zero-Burnout Pacing:</strong>
              <span>Adjust or pause your daily verses anytime without shame or guilt.</span>
            </div>
          </div>

          <div className="guarantee-point-item">
            <span className="point-check-glyph">✦</span>
            <div className="point-text-block">
              <strong>Empathetic Continuity:</strong>
              <span>Life &amp; work happen; your mentor patiently reserves your exact schedule.</span>
            </div>
          </div>

          <div className="guarantee-point-item">
            <span className="point-check-glyph">✦</span>
            <div className="point-text-block">
              <strong>Lifelong Revision Circles:</strong>
              <span>Free alumni weekly revision circles after completing your first Juz'.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Page number */}
      <div className="page-number-tag">07</div>
    </div>
  );

  if (side === 'left') return leftContent;
  if (side === 'right') return rightContent;

  return (
    <div className="book-spread">
      <div className="book-page-edge" />
      <div className="book-center-gutter" />
      <div className="lifted-corner" onClick={onNext} title="Turn page" />
      {leftContent}
      {rightContent}
    </div>
  );
}
