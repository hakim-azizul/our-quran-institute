'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from './Icons';
import {
  SPECIAL_10_JUZ_MILESTONES,
  TAJWEED_MICRO_BADGES,
  getStudentBadgePortfolio,
} from '../lib/badgeData';

export default function TeacherBadgeApprovalPanel({
  student,
  currentUser,
  onBadgeUpdated,
}) {
  const teacherName = currentUser?.name || 'Dr. Sheikh Ahmad Al-Azhari';
  const studentId = student?.studentId || student?.id || 'QI-STU-8842';
  const studentName = student?.studentName || student?.name || 'Tariq Al-Mansoor';
  const memorizedJuz = student?.memorizedJuz || 12;

  // Initial base portfolio
  const basePortfolio = getStudentBadgePortfolio(studentId, memorizedJuz);

  // Auto-generated pending suggestions queue (hybrid system)
  const [pendingQueue, setPendingQueue] = useState([
    {
      id: 'SPECIAL-10J',
      type: 'special_sanad',
      title: 'প্রথম ১০ পারা সমাপ্তি বিশেষ সনদ ও গোল্ড ক্রেস্ট',
      titleEn: '10-Juz Master Hafiz Crest & Sanad',
      category: '10-Juz Special Sanad',
      badgeIcon: 'award',
      color: '#D4AF37',
      triggerReason: 'পারা ১ থেকে ১০ সম্পূর্ণ হিফজ সফল সমাপ্তি ও গড় নির্ভুলতা ৯৬%',
      generatedDate: 'আজ দুপুর ১২:৩০',
      points: 1000,
    },
    {
      id: 'JUZ-11',
      type: 'juz',
      title: 'পারা ১১ সমাপ্তি ব্যাজ',
      titleEn: 'Juz 11 Milestone (Surah Hud)',
      category: 'Juz Progression',
      badgeIcon: 'book',
      color: '#0D4A38',
      triggerReason: 'সূরা হুদ (৫০-১২৩) সাম্প্রতিক রিভিশন ও সবক সফল শুনানি',
      generatedDate: 'গতকাল',
      points: 150,
    },
    {
      id: 'JUZ-12',
      type: 'juz',
      title: 'পারা ১২ সমাপ্তি ব্যাজ',
      titleEn: 'Juz 12 Milestone (Surah Yusuf)',
      category: 'Juz Progression',
      badgeIcon: 'book',
      color: '#0D4A38',
      triggerReason: 'সূরা ইউসুফ (আয়াত ১-২২) সাম্প্রতিক নতুন সবক নির্ভুল প্রদান',
      generatedDate: 'আজ সকাল ১০:১৫',
      points: 150,
    },
    {
      id: 'badge-qalqalah',
      type: 'tajweed',
      title: 'কলকলাহ ও ধ্বনি প্রতিধ্বনি পারদর্শী',
      titleEn: 'Qalqalah Echo Precision',
      category: 'Tajweed Micro-Skill',
      badgeIcon: 'award',
      color: '#B8860B',
      triggerReason: 'ক্বাফ, ত্বোয়া, বা, জিম, দাল হরফে স্বচ্ছ প্রতিধ্বনি প্রদর্শন',
      generatedDate: 'আজ সকাল ১০:৪৫',
      points: 150,
    },
    {
      id: 'badge-ghunnah',
      type: 'tajweed',
      title: 'নাসাধ্বনি ও গুন্নাহ মাধুর্য',
      titleEn: 'Ghunnah Melodic Control',
      category: 'Tajweed Micro-Skill',
      badgeIcon: 'volume-2',
      color: '#0D4A38',
      triggerReason: 'নূন ও মীম তাশদীদে যথাযথ ২ হরকত ওয়াজিব গুন্নাহ পালন',
      generatedDate: '৩ দিন পূর্বে',
      points: 150,
    },
  ]);

  // Approved badges list
  const [approvedBadges, setApprovedBadges] = useState(() => {
    // Start with already established badges
    const initialApproved = [
      {
        id: 'badge-noon-tanween',
        title: 'নূন সাকিন ও তানভীন পারদর্শী',
        category: 'Tajweed Micro-Skill',
        icon: 'disc',
        approvedBy: teacherName,
        approvedDate: '১৮ সেপ্টেম্বর ২০২৬',
        note: 'ইখফা ও ইদগামের নিয়ম নিখুঁতভাবে আদায় করেছে।',
      },
      {
        id: 'badge-makharij',
        title: 'মাখরাজ ও উচ্চারণ নির্ভুলতা',
        category: 'Tajweed Micro-Skill',
        icon: 'mic',
        approvedBy: teacherName,
        approvedDate: '২৫ সেপ্টেম্বর ২০২৬',
        note: '১৭টি মাখরাজের হরফ চমৎকারভাবে শনাক্ত ও তিলাওয়াত করেছে।',
      },
      {
        id: 'badge-madd-timing',
        title: 'মদ্দের পরিমাণ ও গতি নিয়ন্ত্রণ',
        category: 'Tajweed Micro-Skill',
        icon: 'trending-up',
        approvedBy: teacherName,
        approvedDate: '০২ অক্টোবর ২০২৬',
        note: 'মাদ আসলী ও মাদ লাযিমের হরকত পরিমাপ নির্ভুল।',
      },
      {
        id: 'JUZ-1',
        title: 'পারা ১ সমাপ্তি ব্যাজ (আলিফ লাম মীম)',
        category: 'Juz Progression',
        icon: 'award',
        approvedBy: teacherName,
        approvedDate: '১২ জুলাই ২০২৬',
        note: 'সূরা ফাতিহা ও সূরা বাকারার প্রথম অংশ সমাপ্ত।',
      },
      {
        id: 'JUZ-10',
        title: 'পারা ১০ সমাপ্তি ব্যাজ (ওয়া’লামু)',
        category: 'Juz Progression',
        icon: 'award',
        approvedBy: teacherName,
        approvedDate: '১০ অক্টোবর ২০২৬',
        note: 'প্রথম ১০ পারা হিফজ সম্পূর্ণ সম্পন্ন হয়েছে।',
      },
    ];
    return initialApproved;
  });

  // Direct award modal state
  const [isDirectAwardOpen, setIsDirectAwardOpen] = useState(false);
  const [selectedDirectBadge, setSelectedDirectBadge] = useState('badge-waqf');
  const [teacherDirectNote, setTeacherDirectNote] = useState('মাশাআল্লাহ! অত্যন্ত সুললিত কণ্ঠে তারতীলের সাথে তিলাওয়াত করেছে।');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // 1. Teacher approves an auto-generated badge
  const handleApprove = (item) => {
    const today = new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' });
    const newApproved = {
      id: item.id,
      title: item.title,
      category: item.category,
      icon: item.badgeIcon,
      approvedBy: teacherName,
      approvedDate: today,
      note: `স্বয়ংক্রিয় মানদণ্ড যাচাইপূর্বক শিক্ষক ${teacherName} কর্তৃক অনুমোদিত ও সত্যায়িত।`,
    };

    setApprovedBadges((prev) => [newApproved, ...prev]);
    setPendingQueue((prev) => prev.filter((p) => p.id !== item.id));
    showToast(`✓ "${item.title}" ব্যাজটি সফলভাবে অনুমোদন ও প্রদান করা হয়েছে!`);
    if (onBadgeUpdated) onBadgeUpdated();
  };

  // 2. Teacher rejects/declines an auto-generated badge
  const handleReject = (item) => {
    setPendingQueue((prev) => prev.filter((p) => p.id !== item.id));
    showToast(`প্রস্তাবনাটি স্থগিত করা হয়েছে: "${item.title}"`);
  };

  // 3. Teacher directly awards a chosen badge
  const handleDirectAward = (e) => {
    if (e) e.preventDefault();
    const today = new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' });

    let title = 'কাস্টম প্রাতিষ্ঠানিক সম্মাননা';
    let icon = 'award';
    let cat = 'Teacher Honor';

    const tajweedMatch = TAJWEED_MICRO_BADGES.find((b) => b.id === selectedDirectBadge);
    if (tajweedMatch) {
      title = tajweedMatch.nameBangla;
      icon = tajweedMatch.icon;
      cat = 'Tajweed Micro-Skill';
    } else if (selectedDirectBadge.startsWith('JUZ-')) {
      const juzNum = selectedDirectBadge.replace('JUZ-', '');
      title = `পারা ${juzNum} সমাপ্তি ব্যাজ`;
      icon = 'book';
      cat = 'Juz Progression';
    } else if (selectedDirectBadge === 'SPECIAL-10J') {
      title = '১০ পারা সমাপ্তি বিশেষ সনদ ও ক্রেস্ট';
      icon = 'award';
      cat = '10-Juz Special Sanad';
    }

    const newAward = {
      id: `${selectedDirectBadge}-${Date.now()}`,
      title,
      category: cat,
      icon,
      approvedBy: teacherName,
      approvedDate: today,
      note: teacherDirectNote,
    };

    setApprovedBadges((prev) => [newAward, ...prev]);
    setIsDirectAwardOpen(false);
    showToast(`✓ শিক্ষার্থীকে "${title}" ব্যাজ সরাসরি প্রদান করা হয়েছে!`);
    if (onBadgeUpdated) onBadgeUpdated();
  };

  // 4. Teacher revokes an approved badge
  const handleRevoke = (badgeId, title) => {
    if (!confirm(`আপনি কি "${title}" ব্যাজটি প্রত্যাহার করতে চান?`)) return;
    setApprovedBadges((prev) => prev.filter((b) => b.id !== badgeId));
    showToast(`ব্যাজ প্রত্যাহার করা হয়েছে: ${title}`);
    if (onBadgeUpdated) onBadgeUpdated();
  };

  return (
    <div className="teacher-badge-approval-panel">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="portal-toast-banner">
          <Icon name="check-circle" size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Banner & Hybrid System Explanation */}
      <div className="approval-hero-card">
        <div className="approval-hero-content">
          <div className="approval-badge-row">
            <span className="badge-hybrid-tag">
              <Icon name="zap" size={13} style={{ marginRight: 5 }} />
              HYBRID AUTO-GENERATION &amp; TEACHER APPROVAL
            </span>
            <span className="badge-student-target">শিক্ষার্থী: {studentName} ({studentId})</span>
          </div>

          <h2 className="approval-hero-title">
            হিফজ ও তাজবীদ ব্যাজ অনুমোদন প্যানেল
          </h2>
          <p className="approval-hero-sub">
            সিস্টেম শিক্ষার্থীর সবক, রিভিশন, মাখরাজ নির্ভুলতা ও পারা মাইলফলক অনুযায়ী স্বয়ংক্রিয়ভাবে ব্যাজ
            প্রস্তাব করে। শিক্ষক হিসেবে আপনি যাচাই করে এক ক্লিকে অনুমোদন দিতে পারেন অথবা সরাসরি যেকোনো ব্যাজ প্রদান করতে পারেন।
          </p>
        </div>

        <div className="approval-hero-actions">
          <button
            type="button"
            className="btn-open-direct-award"
            onClick={() => setIsDirectAwardOpen(true)}
            id="btn-teacher-award-badge"
          >
            <Icon name="plus" size={15} style={{ marginRight: 6 }} />
            <span>সরাসরি ব্যাজ প্রদান করুন</span>
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="approval-metrics-grid">
        <div className="approval-metric-card alert-gold">
          <div className="metric-icon-box gold">
            <Icon name="clock" size={22} color="#D4AF37" />
          </div>
          <div className="metric-details">
            <span className="metric-count">{pendingQueue.length} টি</span>
            <span className="metric-label">স্বয়ংক্রিয় অপেক্ষমাণ প্রস্তাবনা</span>
          </div>
        </div>

        <div className="approval-metric-card alert-emerald">
          <div className="metric-icon-box emerald">
            <Icon name="check-circle" size={22} color="#0D4A38" />
          </div>
          <div className="metric-details">
            <span className="metric-count">{approvedBadges.length} টি</span>
            <span className="metric-label">শিক্ষক কর্তৃক অনুমোদিত ব্যাজ</span>
          </div>
        </div>

        <div className="approval-metric-card alert-cert">
          <div className="metric-icon-box cert">
            <Icon name="award" size={22} color="#8C6819" />
          </div>
          <div className="metric-details">
            <span className="metric-count">১০ পারা সনদ</span>
            <span className="metric-label">
              {pendingQueue.some((p) => p.id === 'SPECIAL-10J')
                ? '⚡ শিক্ষকের স্বাক্ষরের অপেক্ষায়'
                : '✓ অনুমোদিত ও সনদপত্র অ্যাক্টিভ'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Section: Auto-Generated Pending Queue (অপেক্ষমাণ প্রস্তাবনা) */}
      <div className="approval-section-card pending-queue-section">
        <div className="approval-section-header">
          <div>
            <div className="approval-section-tag">PENDING AUTO-GENERATED QUEUE</div>
            <h3 className="approval-section-title">
              অপেক্ষমাণ প্রস্তাবিত ব্যাজ ({pendingQueue.length} টি)
            </h3>
            <p className="approval-section-sub">
              এই ব্যাজগুলো সিস্টেম শিক্ষার্থীর সাম্প্রতিক অর্জন বিশ্লেষণ করে প্রস্তাব করেছে। অনুমোদন দিলে তা শিক্ষার্থীর প্রোফাইল ও সনদে যুক্ত হবে।
            </p>
          </div>
        </div>

        {pendingQueue.length === 0 ? (
          <div className="approval-empty-queue">
            <Icon name="check-circle" size={32} color="#15803D" />
            <h4>কোনো অপেক্ষমাণ ব্যাজ প্রস্তাবনা নেই</h4>
            <p>সকল স্বয়ংক্রিয় প্রস্তাবিত ব্যাজ ইতিমধ্যে শিক্ষক কর্তৃক অনুমোদিত হয়েছে।</p>
          </div>
        ) : (
          <div className="pending-queue-grid">
            {pendingQueue.map((item) => (
              <div
                key={item.id}
                className={`pending-badge-card ${item.type === 'special_sanad' ? 'special-sanad-highlight' : ''}`}
              >
                <div className="pending-card-header">
                  <div className="pending-badge-icon" style={{ borderColor: item.color, color: item.color }}>
                    <Icon name={item.badgeIcon} size={22} />
                  </div>
                  <div className="pending-badge-meta">
                    <span className="pending-badge-type">{item.category}</span>
                    <span className="pending-badge-time">{item.generatedDate}</span>
                  </div>
                </div>

                <h4 className="pending-badge-title">{item.title}</h4>
                <span className="pending-badge-title-en">{item.titleEn}</span>

                <div className="pending-trigger-box">
                  <span className="trigger-label">স্বয়ংক্রিয় শনাক্তকরণের কারণ:</span>
                  <p className="trigger-text">{item.triggerReason}</p>
                </div>

                <div className="pending-card-actions">
                  <button
                    type="button"
                    className="btn-approve-badge"
                    onClick={() => handleApprove(item)}
                    id={`btn-approve-badge-${item.id}`}
                  >
                    <Icon name="check" size={14} style={{ marginRight: 5 }} />
                    অনুমোদন দিন
                  </button>
                  <button
                    type="button"
                    className="btn-reject-badge"
                    onClick={() => handleReject(item)}
                    id={`btn-reject-badge-${item.id}`}
                  >
                    <Icon name="x" size={14} style={{ marginRight: 4 }} />
                    বাতিল
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Section: Approved & Active Badges (অনুমোদিত ব্যাজ তালিকা) */}
      <div className="approval-section-card">
        <div className="approval-section-header">
          <div>
            <div className="approval-section-tag">APPROVED &amp; ACTIVE BADGES</div>
            <h3 className="approval-section-title">
              শিক্ষক কর্তৃক অনুমোদিত ও সক্রিয় ব্যাজ ({approvedBadges.length} টি)
            </h3>
            <p className="approval-section-sub">
              এই সম্মাননাগুলো শিক্ষার্থীর ড্যাশবোর্ড ও অফিসিয়াল ব্যাজ গ্যালারিতে দৃশ্যমান রয়েছে।
            </p>
          </div>
        </div>

        <div className="approved-badges-grid">
          {approvedBadges.map((badge) => (
            <div key={badge.id} className="approved-badge-card">
              <div className="approved-card-top">
                <span className="approved-badge-icon">
                  <Icon name={badge.icon || 'award'} size={18} color="#0D4A38" />
                </span>
                <span className="approved-cat-tag">{badge.category}</span>
              </div>

              <h4 className="approved-badge-title">{badge.title}</h4>
              <p className="approved-badge-note">"{badge.note}"</p>

              <div className="approved-card-footer">
                <div className="approved-signature">
                  <span className="endorser-name">অনুমোদনকারী: {badge.approvedBy}</span>
                  <span className="endorser-date">তারিখ: {badge.approvedDate}</span>
                </div>
                <button
                  type="button"
                  className="btn-revoke-badge"
                  onClick={() => handleRevoke(badge.id, badge.title)}
                  title="ব্যাজটি প্রত্যাহার করুন"
                >
                  <Icon name="trash" size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Direct Award Modal (সরাসরি ব্যাজ প্রদান) */}
      {isDirectAwardOpen && (
        <div className="portal-modal-backdrop" onClick={() => setIsDirectAwardOpen(false)}>
          <div
            className="portal-modal-dialog direct-award-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="portal-modal-header">
              <div className="portal-modal-header-info">
                <span className="modal-header-badge">শিক্ষক সরাসরি মূল্যায়ন</span>
                <h3 className="portal-modal-title">
                  {studentName}-কে সরাসরি ব্যাজ বা সনদ প্রদান
                </h3>
              </div>
              <button
                type="button"
                className="portal-modal-close-btn"
                onClick={() => setIsDirectAwardOpen(false)}
              >
                <Icon name="x" size={18} />
              </button>
            </div>

            <form onSubmit={handleDirectAward} className="direct-award-form">
              <div className="form-group">
                <label className="form-label">প্রদেয় ব্যাজ নির্বাচন করুন</label>
                <select
                  value={selectedDirectBadge}
                  onChange={(e) => setSelectedDirectBadge(e.target.value)}
                  className="form-input form-select"
                >
                  <optgroup label="বিশেষ হিফজ মাইলফলক ও সনদ">
                    <option value="SPECIAL-10J">১০ পারা হিফজ সমাপ্তি সনদ ও গোল্ড ক্রেস্ট</option>
                    <option value="SPECIAL-20J">২০ পারা হিফজ সমাপ্তি সনদ ও প্লাটিনাম ক্রেস্ট</option>
                    <option value="SPECIAL-30J">সম্পূর্ণ ৩০ পারা খতম ও গ্র্যান্ড সনদ</option>
                  </optgroup>
                  <optgroup label="তাজবীদ মাইক্রো-স্কিল ব্যাজ">
                    {TAJWEED_MICRO_BADGES.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nameBangla} ({b.nameArabic})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="একক পারা হিফজ ব্যাজ (Juz 1-30)">
                    {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
                      <option key={`JUZ-${num}`} value={`JUZ-${num}`}>
                        পারা {num} সমাপ্তি ব্যাজ
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">শিক্ষকের প্রশংসাসূচক মন্তব্য ও দোয়া</label>
                <textarea
                  rows={3}
                  value={teacherDirectNote}
                  onChange={(e) => setTeacherDirectNote(e.target.value)}
                  placeholder="যেমন: মাশাআল্লাহ! অত্যন্ত সুললিত কণ্ঠে তারতীলের সাথে তিলাওয়াত করেছে..."
                  className="form-input form-input-noicon"
                  required
                />
              </div>

              <div className="form-group">
                <span className="endorser-meta-text">
                  স্বাক্ষর ও অনুমোদনকারী: <strong>{teacherName}</strong> (প্রধান শিক্ষক ও পরীক্ষক)
                </span>
              </div>

              <div className="portal-modal-footer">
                <button
                  type="button"
                  className="btn-table-action"
                  onClick={() => setIsDirectAwardOpen(false)}
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="btn-dash-primary-gold"
                  id="btn-confirm-direct-award"
                >
                  <Icon name="award" size={15} style={{ marginRight: 6 }} />
                  ব্যাজ প্রদান করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
