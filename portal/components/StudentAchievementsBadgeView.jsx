'use client';

import React, { useState } from 'react';
import { Icon } from './Icons';
import {
  SPECIAL_10_JUZ_MILESTONES,
  TAJWEED_MICRO_BADGES,
  getStudentBadgePortfolio,
} from '../lib/badgeData';

export default function StudentAchievementsBadgeView({
  currentUser,
  studentId = 'QI-STU-8842',
  onNavigateTab,
}) {
  const isTeacherOrAdmin = currentUser?.role === 'teacher' || currentUser?.role === 'admin';
  const memorizedJuz = currentUser?.memorizedJuz || 12;

  // Portfolio dataset
  const [portfolio, setPortfolio] = useState(() =>
    getStudentBadgePortfolio(studentId, memorizedJuz)
  );
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'juz' | 'special' | 'tajweed'
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [activeBadgeModal, setActiveBadgeModal] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Teacher endorsement toggle for micro-badges
  const handleToggleEndorsement = (badgeId) => {
    if (!isTeacherOrAdmin) return;
    setPortfolio((prev) => {
      const updatedTajweed = prev.tajweedBadges.map((b) => {
        if (b.id === badgeId) {
          const nextState = !b.isUnlocked;
          return {
            ...b,
            isUnlocked: nextState,
            unlockedDate: nextState
              ? new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
              : null,
            endorsedBy: nextState ? currentUser?.name || 'Faculty Mentor' : null,
          };
        }
        return b;
      });
      const unlockedCount = updatedTajweed.filter((b) => b.isUnlocked).length;
      return {
        ...prev,
        tajweedBadges: updatedTajweed,
        totalBadgesEarned: prev.juzBadges.filter((b) => b.isUnlocked).length + unlockedCount + (prev.has10JuzCertificate ? 1 : 0),
      };
    });
    showToast('✓ শিক্ষকের অনুমোদন ও ব্যাজ স্ট্যাটাস আপডেট হয়েছে!');
  };

  const handlePrintCertificate = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="student-achievements-view">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="portal-toast-banner">
          <Icon name="check-circle" size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Banner & Gamified Scorecard */}
      <section className="achievements-hero-card">
        <div className="achievements-hero-main">
          <div className="achievements-badge-row">
            <span className="badge-gold-crest">
              <Icon name="award" size={14} style={{ marginRight: 6 }} />
              হিফজুল কুরআন গেমিফাইড সম্মাননা
            </span>
            <span className="badge-emerald-crest">পারা সমাপ্তি ও তাজবীদ স্বীকৃতি</span>
            {isTeacherOrAdmin && (
              <span className="badge-faculty-tag">
                <Icon name="scholar" size={12} style={{ marginRight: 4 }} />
                শিক্ষক মূল্যায়ন মোড
              </span>
            )}
          </div>

          <h1 className="achievements-title">
            কোরআন হিফজ ও তাজবীদ ব্যাজ গ্যালারি
          </h1>
          <p className="achievements-subtitle">
            প্রতিটি পারা সমাপ্তিতে অর্জিত ব্যাজ, প্রতি ১০ পারা হিফজে বিশেষ সম্মাননা ও সনদ, এবং
            তাজবীদের সূক্ষ্ম নিয়মাবলীতে পারদর্শিতার প্রাতিষ্ঠানিক স্বীকৃতি।
          </p>

          <div className="achievements-filter-tabs">
            <button
              type="button"
              className={`filter-tab-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              <Icon name="layers" size={14} />
              <span>সকল সম্মাননা ({portfolio.totalPossibleBadges})</span>
            </button>
            <button
              type="button"
              className={`filter-tab-btn ${activeFilter === 'juz' ? 'active' : ''}`}
              onClick={() => setActiveFilter('juz')}
            >
              <Icon name="book" size={14} />
              <span>পারা ব্যাজ (৩০টি)</span>
            </button>
            <button
              type="button"
              className={`filter-tab-btn ${activeFilter === 'special' ? 'active' : ''}`}
              onClick={() => setActiveFilter('special')}
            >
              <Icon name="award" size={14} />
              <span>১০-পারা সনদ ({SPECIAL_10_JUZ_MILESTONES.length}টি)</span>
            </button>
            <button
              type="button"
              className={`filter-tab-btn ${activeFilter === 'tajweed' ? 'active' : ''}`}
              onClick={() => setActiveFilter('tajweed')}
            >
              <Icon name="disc" size={14} />
              <span>তাজবীদ মাইক্রো-ব্যাজ ({TAJWEED_MICRO_BADGES.length}টি)</span>
            </button>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="achievements-stats-pillar">
          <div className="badge-stat-box gold-border">
            <div className="stat-icon-circle gold">
              <Icon name="award" size={20} color="#D4AF37" />
            </div>
            <div className="stat-info">
              <span className="stat-val">{portfolio.totalBadgesEarned} / {portfolio.totalPossibleBadges}</span>
              <span className="stat-lbl">মোট অর্জিত ব্যাজ</span>
            </div>
          </div>

          <div className="badge-stat-box emerald-border">
            <div className="stat-icon-circle emerald">
              <Icon name="star" size={20} color="#0D4A38" />
            </div>
            <div className="stat-info">
              <span className="stat-val">{portfolio.memorizedJuz} পারা</span>
              <span className="stat-lbl">সম্পন্ন হিফজ</span>
            </div>
          </div>

          <div className="badge-stat-box cert-highlight">
            <div className="stat-icon-circle cert">
              <Icon name="book-marked" size={20} color="#0D4A38" />
            </div>
            <div className="stat-info">
              <span className="stat-val">১টি সনদ প্রাপ্ত</span>
              <button
                type="button"
                className="btn-stat-sanad-link"
                onClick={() => setSelectedCertificate(portfolio.activeCertificate)}
              >
                📜 সনদ দেখুন →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Special 10-Juz Milestone Sanad Showcase */}
      {(activeFilter === 'all' || activeFilter === 'special') && (
        <section className="achievements-section-card sanad-feature-section">
          <div className="section-title-bar">
            <div>
              <div className="section-badge-tag">MAJOR MILESTONES &amp; SANAD</div>
              <h2 className="section-heading">প্রতি ১০ পারা সমাপ্তি বিশেষ ব্যাজ ও হিফজ সনদ</h2>
              <p className="section-subtext">
                প্রতি ১০টি পবিত্র পারা হিফজ সফলভাবে সম্পন্ন হলে শিক্ষার্থীকে ইনস্টিটিউট থেকে বিশেষ ক্রেস্ট
                ও ডাউনলোডযোগ্য সনদপত্র প্রদান করা হয়।
              </p>
            </div>
          </div>

          <div className="special-milestones-grid">
            {portfolio.specialMilestones.map((milestone) => (
              <div
                key={milestone.id}
                className={`milestone-card ${milestone.isAchieved ? 'achieved' : 'in-progress'}`}
              >
                <div className="milestone-card-header">
                  <div className="milestone-crest-icon">
                    <Icon name={milestone.badgeIcon} size={28} />
                  </div>
                  <div className="milestone-badge-tier">
                    <span className="tier-tag">{milestone.tier}</span>
                    <span className="juz-tag">{milestone.juzThreshold} পারা মাইলফলক</span>
                  </div>
                </div>

                <h3 className="milestone-title">{milestone.title}</h3>
                <h4 className="milestone-title-en">{milestone.titleEn}</h4>
                <p className="milestone-desc">{milestone.desc}</p>

                <div className="milestone-progress-bar-wrap">
                  <div className="progress-info-row">
                    <span>অগ্রগতি</span>
                    <strong>{milestone.currentProgressJuz} / {milestone.totalTargetJuz} পারা</strong>
                  </div>
                  <div className="milestone-progress-track">
                    <div
                      className="milestone-progress-fill"
                      style={{
                        width: `${Math.min(100, (milestone.currentProgressJuz / milestone.totalTargetJuz) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="milestone-footer">
                  {milestone.isAchieved ? (
                    <div className="milestone-achieved-actions">
                      <span className="status-pill-achieved">
                        <Icon name="check-circle" size={14} style={{ marginRight: 4 }} />
                        সম্পন্ন ও পরীক্ষিত
                      </span>
                      <button
                        type="button"
                        className="btn-view-sanad"
                        onClick={() => setSelectedCertificate(milestone.certificate)}
                        id={`btn-view-sanad-${milestone.id}`}
                      >
                        <Icon name="award" size={15} style={{ marginRight: 6 }} />
                        ছোট সনদপত্র দেখুন (View Certificate)
                      </button>
                    </div>
                  ) : (
                    <div className="milestone-locked-actions">
                      <span className="status-pill-locked">
                        <Icon name="lock" size={14} style={{ marginRight: 4 }} />
                        চলমান সাধনা ({milestone.juzThreshold - portfolio.memorizedJuz} পারা অবশিষ্ট)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Single Juz Badges (Juz 1 to 30) */}
      {(activeFilter === 'all' || activeFilter === 'juz') && (
        <section className="achievements-section-card">
          <div className="section-title-bar">
            <div>
              <div className="section-badge-tag">JUZ-BY-JUZ PROGRESSION</div>
              <h2 className="section-heading">৩০ পারা হিফজ ব্যাজ গ্যালারি</h2>
              <p className="section-subtext">
                প্রতিটি পারা উস্তাদের নিকট সম্পূর্ণ নির্ভুলভাবে শুনিয়ে সম্পন্ন করার পর এই ব্যাজগুলো আনলক হয়।
              </p>
            </div>
            <div className="juz-counter-pill">
              {portfolio.memorizedJuz} / 30 পারা সম্পন্ন ({Math.round((portfolio.memorizedJuz / 30) * 100)}%)
            </div>
          </div>

          <div className="juz-badges-grid">
            {portfolio.juzBadges.map((badge) => {
              const stateClass = badge.isUnlocked
                ? 'badge-unlocked'
                : badge.isInProgress
                ? 'badge-in-progress'
                : 'badge-locked';

              return (
                <div
                  key={badge.juzNumber}
                  className={`juz-badge-card ${stateClass}`}
                  onClick={() => setActiveBadgeModal(badge)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="juz-badge-top">
                    <span className="juz-num-indicator">পারা {badge.juzNumber}</span>
                    <span className="juz-icon-bubble">
                      <Icon name={badge.icon} size={16} />
                    </span>
                  </div>

                  <div className="juz-badge-arabic">{badge.nameArabic}</div>
                  <div className="juz-badge-bangla">{badge.nameBangla}</div>
                  <div className="juz-badge-surah">{badge.startSurah}</div>

                  <div className="juz-badge-footer">
                    {badge.isUnlocked ? (
                      <span className="juz-badge-status-unlocked">
                        ✓ সম্পন্ন ({badge.unlockedDate})
                      </span>
                    ) : badge.isInProgress ? (
                      <span className="juz-badge-status-current">
                        ⚡ চলমান পাঠ
                      </span>
                    ) : (
                      <span className="juz-badge-status-locked">
                        🔒 লকড
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. Tajweed Micro-Badges (Micro-skills Mastery) */}
      {(activeFilter === 'all' || activeFilter === 'tajweed') && (
        <section className="achievements-section-card tajweed-badges-section">
          <div className="section-title-bar">
            <div>
              <div className="section-badge-tag">TAJWEED MICRO-SKILLS MASTERY</div>
              <h2 className="section-heading">তাজবীদ পারদর্শিতা মাইক্রো-ব্যাজ</h2>
              <p className="section-subtext">
                নূন সাকিন, মাখরাজ, কলকলাহ, গুন্নাহ, ওয়াকফ ও মদ্দের সূক্ষ্ম নিয়মাবলীতে সম্পূর্ণ
                নির্ভুলতার জন্য উস্তাদ কর্তৃক প্রদত্ত বিশেষ স্কিল ব্যাজ।
              </p>
            </div>
            {isTeacherOrAdmin && (
              <span className="teacher-hint-pill">
                💡 শিক্ষক হিসেবে আপনি যেকোনো ব্যাজ অনুমোদন বা প্রত্যাহার করতে পারবেন
              </span>
            )}
          </div>

          <div className="tajweed-micro-grid">
            {portfolio.tajweedBadges.map((badge) => (
              <div
                key={badge.id}
                className={`tajweed-micro-card ${badge.isUnlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="micro-card-header">
                  <div className="micro-badge-icon" style={{ borderColor: badge.color, color: badge.color }}>
                    <Icon name={badge.icon} size={22} />
                  </div>
                  <span className="micro-cat-tag">{badge.category}</span>
                </div>

                <div className="micro-arabic-name">{badge.nameArabic}</div>
                <h3 className="micro-bangla-name">{badge.nameBangla}</h3>
                <h4 className="micro-english-name">{badge.nameEnglish}</h4>

                <p className="micro-summary">{badge.rulesSummary}</p>

                <div className="micro-card-footer">
                  <div className="micro-status-info">
                    {badge.isUnlocked ? (
                      <>
                        <span className="micro-status-unlocked">
                          <Icon name="check-circle" size={13} style={{ marginRight: 4 }} />
                          উত্তীর্ণ ({badge.unlockedDate})
                        </span>
                        {badge.endorsedBy && (
                          <span className="micro-endorser">সত্যায়ক: {badge.endorsedBy}</span>
                        )}
                      </>
                    ) : (
                      <span className="micro-status-locked">
                        <Icon name="clock" size={13} style={{ marginRight: 4 }} />
                        প্রশিক্ষণাধীন
                      </span>
                    )}
                  </div>

                  {isTeacherOrAdmin && (
                    <button
                      type="button"
                      className={`btn-teacher-endorse ${badge.isUnlocked ? 'revoke' : 'grant'}`}
                      onClick={() => handleToggleEndorsement(badge.id)}
                    >
                      {badge.isUnlocked ? 'প্রত্যাহার' : '✓ অনুমোদন দিন'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Authentic Royal 10-Juz Mini Certificate Modal (ছোট হিফজ সনদপত্র) */}
      {selectedCertificate && (
        <div className="portal-modal-backdrop" onClick={() => setSelectedCertificate(null)}>
          <div
            className="certificate-modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cert-modal-controls no-print">
              <div className="cert-modal-header-left">
                <span className="cert-official-pill">
                  <Icon name="award" size={14} style={{ marginRight: 5 }} />
                  অফিসিয়াল হিফজ সনদপত্র
                </span>
                <span className="cert-id-tag">ID: {selectedCertificate.id}</span>
              </div>
              <div className="cert-modal-actions">
                <button
                  type="button"
                  className="btn-cert-print"
                  onClick={handlePrintCertificate}
                  id="btn-print-certificate"
                >
                  <Icon name="printer" size={14} style={{ marginRight: 5 }} />
                  প্রিন্ট / PDF সংরক্ষণ
                </button>
                <button
                  type="button"
                  className="btn-cert-close"
                  onClick={() => setSelectedCertificate(null)}
                  aria-label="Close certificate"
                >
                  <Icon name="x" size={18} />
                </button>
              </div>
            </div>

            {/* The Certificate Canvas */}
            <div className="authentic-certificate-canvas">
              {/* Double Ornate Gilded Border */}
              <div className="cert-outer-border">
                <div className="cert-inner-border">
                  {/* Decorative Corner Ornaments */}
                  <div className="cert-corner corner-tl">❖</div>
                  <div className="cert-corner corner-tr">❖</div>
                  <div className="cert-corner corner-bl">❖</div>
                  <div className="cert-corner corner-br">❖</div>

                  {/* Header: Bismillah */}
                  <div className="cert-bismillah">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </div>

                  {/* Institute Brand */}
                  <div className="cert-brand-row">
                    <img
                      src="/assets/logo_gold.png"
                      alt="Our Quran Institute"
                      className="cert-logo"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="cert-institution-titles">
                      <h2 className="cert-inst-arabic">مَعْهَدُ القُرْآنِ الكَرِيم</h2>
                      <h1 className="cert-inst-english">OUR QURAN INSTITUTE</h1>
                      <span className="cert-inst-tag">FACULTY OF HIFZ &amp; QIRA’AT</span>
                    </div>
                  </div>

                  <div className="cert-divider-line" />

                  {/* Certificate Title */}
                  <div className="cert-title-section">
                    <h3 className="cert-title-arabic">{selectedCertificate.titleArabic}</h3>
                    <h2 className="cert-title-bangla">{selectedCertificate.titleBangla}</h2>
                    <span className="cert-title-sub">{selectedCertificate.titleEnglish}</span>
                  </div>

                  {/* Certificate Body Text */}
                  <div className="cert-body-content">
                    <p className="cert-preamble">
                      এই মর্মে প্রত্যয়ন করা যাচ্ছে যে, Our Quran Institute-এর নিয়মিত শিক্ষার্থী—
                    </p>

                    <div className="cert-recipient-name">
                      তারিক মাহমুদ (Tariq Al-Mansoor)
                    </div>

                    <div className="cert-student-meta">
                      রেজিস্ট্রেশন নং: <strong>QI-STU-8842</strong> • সেশন: <strong>২০২৬ শিক্ষাবর্ষ</strong>
                    </div>

                    <p className="cert-main-paragraph">
                      পবিত্র কোরআনুল কারীমের <strong>{selectedCertificate.juzRange}</strong> সম্পূর্ণ তাজবীদ,
                      সহীহ মাখরাজ ও তারতীলের সাথে মুখস্থ (হিফজ) সমাপ্ত করেছেন এবং সংশ্লিষ্ট উস্তাদমণ্ডলীর
                      সম্মুখে যথাযথ শুনানির মাধ্যমে সন্তোষজনক ফলাফল অর্জন করেছেন।
                    </p>

                    <div className="cert-standing-badge">
                      শিক্ষাগত গ্রেড: <strong>{selectedCertificate.standing}</strong>
                    </div>
                  </div>

                  {/* Signatures & Seal Section */}
                  <div className="cert-signatures-row">
                    <div className="cert-signature-col">
                      <div className="signature-line" />
                      <span className="signature-name">{selectedCertificate.mentor}</span>
                      <span className="signature-title">প্রধান হিফজ প্রশিক্ষক (Senior Mentor)</span>
                    </div>

                    <div className="cert-seal-col">
                      <div className="cert-official-seal">
                        <div className="seal-inner">
                          <Icon name="award" size={24} color="#D4AF37" />
                          <span className="seal-text-top">OUR QURAN INST.</span>
                          <span className="seal-text-mid">VERIFIED</span>
                          <span className="seal-text-bot">OFFICIAL SANAD</span>
                        </div>
                      </div>
                      <span className="cert-issue-date">তারিখ: {selectedCertificate.date}</span>
                    </div>

                    <div className="cert-signature-col">
                      <div className="signature-line" />
                      <span className="signature-name">Dr. Sheikh Ahmad Al-Azhari</span>
                      <span className="signature-title">একাডেমিক ডিন ও মুহতামিম</span>
                    </div>
                  </div>

                  {/* Verification Footer */}
                  <div className="cert-footer-verify">
                    ইনস্টিটিউট যাচাইকরণ কোড: <code>{selectedCertificate.verificationHash}</code> • ourquraninstitute.org/verify
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Juz Badge Detail Modal */}
      {activeBadgeModal && (
        <div className="portal-modal-backdrop" onClick={() => setActiveBadgeModal(null)}>
          <div className="portal-modal-dialog juz-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="portal-modal-header">
              <div className="portal-modal-header-info">
                <span className="modal-header-badge">পারা {activeBadgeModal.juzNumber} সম্মাননা</span>
                <h3 className="portal-modal-title">{activeBadgeModal.nameBangla} ({activeBadgeModal.nameArabic})</h3>
              </div>
              <button
                type="button"
                className="portal-modal-close-btn"
                onClick={() => setActiveBadgeModal(null)}
              >
                <Icon name="x" size={18} />
              </button>
            </div>

            <div className="juz-detail-body">
              <div className="juz-detail-icon-box">
                <Icon name={activeBadgeModal.icon} size={36} color="#0D4A38" />
              </div>
              <div className="juz-detail-meta-list">
                <div className="meta-row">
                  <span>আরবী নাম:</span>
                  <strong className="arabic-font">{activeBadgeModal.nameArabic}</strong>
                </div>
                <div className="meta-row">
                  <span>সূরা ও আয়াত শুরু:</span>
                  <strong>{activeBadgeModal.startSurah}</strong>
                </div>
                <div className="meta-row">
                  <span>মুসহাফ পৃষ্ঠা:</span>
                  <strong>পৃষ্ঠা {activeBadgeModal.startPage}</strong>
                </div>
                <div className="meta-row">
                  <span>স্ট্যাটাস:</span>
                  <strong>
                    {activeBadgeModal.isUnlocked
                      ? `সম্পন্ন (${activeBadgeModal.unlockedDate})`
                      : activeBadgeModal.isInProgress
                      ? 'বর্তমানে অধ্যয়নাধীন'
                      : 'অপেক্ষমাণ'}
                  </strong>
                </div>
              </div>
            </div>

            <div className="portal-modal-footer">
              <button
                type="button"
                className="btn-dash-primary-gold"
                onClick={() => setActiveBadgeModal(null)}
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
