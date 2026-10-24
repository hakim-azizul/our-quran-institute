'use client';

import React, { useState } from 'react';
import { Icon } from './Icons';

export default function StudentProgressComboChart({
  studentName = 'Tariq Al-Mansoor',
  studentId = 'QI-STU-8842',
  memorizedJuz = 12,
  progressLogs = [],
}) {
  const [timeframe, setTimeframe] = useState('weekly'); // 'weekly' | 'monthly'
  const [selectedCalendarWeek, setSelectedCalendarWeek] = useState('2026-W43'); // ISO format e.g. '2026-W43'
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [pieMode, setPieMode] = useState('curriculum'); // 'curriculum' | 'quality'
  const [hoveredSlice, setHoveredSlice] = useState(null);

  // Dynamic datasets based on student
  const isSecondStudent = studentId === 'QI-STU-7721' || memorizedJuz < 10;

  // Comprehensive Academic Calendar Weeks for Term 2026 (Centered around October 2026)
  const ACADEMIC_WEEKS = [
    { iso: '2026-W34', weekNum: 34, label: 'W34', period: 'Week 34', date: 'Aug 17', dateRange: 'Aug 17 – Aug 23, 2026', dateRangeBn: '১৭ – ২৩ আগস্ট, ২০২৬', pages: isSecondStudent ? 8 : 12, accuracy: 91, status: 'Smooth Progression', sabaq: 'Surah Al-Anbiya (Ayahs 1–25)', sabqi: 'Juz 8 (4p)', manzil: 'Juz 1–3 Cycle' },
    { iso: '2026-W35', weekNum: 35, label: 'W35', period: 'Week 35', date: 'Aug 24', dateRange: 'Aug 24 – Aug 30, 2026', dateRangeBn: '২৪ – ৩০ আগস্ট, ২০২৬', pages: isSecondStudent ? 9 : 14, accuracy: 92, status: 'Ghunnah Precision', sabaq: 'Surah Al-Anbiya (Ayahs 26–55)', sabqi: 'Juz 8–9 (6p)', manzil: 'Juz 1–4 Cycle' },
    { iso: '2026-W36', weekNum: 36, label: 'W36', period: 'Week 36', date: 'Aug 31', dateRange: 'Aug 31 – Sep 06, 2026', dateRangeBn: '৩১ আগস্ট – ০৬ সেপ্টেম্বর, ২০২৬', pages: isSecondStudent ? 10 : 15, accuracy: 93, status: 'Sabqi Cleared', sabaq: 'Surah Al-Hajj (Ayahs 1–24)', sabqi: 'Juz 9 (6p)', manzil: 'Juz 1–4 Cycle' },
    { iso: '2026-W37', weekNum: 37, label: 'W37', period: 'Week 37', date: 'Sep 07', dateRange: 'Sep 07 – Sep 13, 2026', dateRangeBn: '০৭ – ১৩ সেপ্টেম্বর, ২০২৬', pages: isSecondStudent ? 11 : 16, accuracy: 94, status: 'Madd Rules Mastered', sabaq: 'Surah Al-Hajj (Ayahs 25–55)', sabqi: 'Juz 9–10 (7p)', manzil: 'Juz 1–5 Cycle' },
    { iso: '2026-W38', weekNum: 38, label: 'W38', period: 'Week 38', date: 'Sep 14', dateRange: 'Sep 14 – Sep 20, 2026', dateRangeBn: '১৪ – ২০ সেপ্টেম্বর, ২০২৬', pages: isSecondStudent ? 12 : 18, accuracy: 95, status: 'Excellent Cadence', sabaq: 'Surah Al-Mu\'minun (Ayahs 1–35)', sabqi: 'Juz 10 (8p)', manzil: 'Juz 1–5 Cycle' },
    { iso: '2026-W39', weekNum: 39, label: 'W39', period: 'Week 39', date: 'Sep 21', dateRange: 'Sep 21 – Sep 27, 2026', dateRangeBn: '২১ – ২৭ সেপ্টেম্বর, ২০২৬', pages: isSecondStudent ? 13 : 17, accuracy: 95, status: '100% Punctual', sabaq: 'Surah Al-Mu\'minun (Ayahs 36–75)', sabqi: 'Juz 10–11 (8p)', manzil: 'Juz 1–6 Cycle' },
    { iso: '2026-W40', weekNum: 40, label: 'W40', period: 'Week 40', date: 'Sep 28', dateRange: 'Sep 28 – Oct 04, 2026', dateRangeBn: '২৮ সেপ্টেম্বর – ০৪ অক্টোবর, ২০২৬', pages: isSecondStudent ? 14 : 19, accuracy: 96, status: 'Tajweed Mastery', sabaq: 'Surah An-Nur (Ayahs 1–30)', sabqi: 'Juz 11 (8p)', manzil: 'Juz 1–6 Cycle' },
    { iso: '2026-W41', weekNum: 41, label: 'W41', period: 'Week 41', date: 'Oct 05', dateRange: 'Oct 05 – Oct 11, 2026', dateRangeBn: '০৫ – ১১ অক্টোবর, ২০২৬', pages: isSecondStudent ? 14 : 20, accuracy: 97, status: 'Juz 11 Passed Exam', sabaq: 'Surah An-Nur (Ayahs 31–64)', sabqi: 'Juz 11 Cleared', manzil: 'Juz 1–6 Cycle' },
    { iso: '2026-W42', weekNum: 42, label: 'W42', period: 'Week 42', date: 'Oct 12', dateRange: 'Oct 12 – Oct 18, 2026', dateRangeBn: '১২ – ১৮ অক্টোবর, ২০২৬', pages: isSecondStudent ? 15 : 21, accuracy: 97, status: 'Surah Yusuf Milestone', sabaq: 'Surah Yusuf (Ayahs 1–25)', sabqi: 'Juz 11 (8p)', manzil: 'Juz 1–6 Cycle' },
    { iso: '2026-W43', weekNum: 43, label: 'W43 (Current)', period: 'Week 43 (Current)', date: 'Oct 19', dateRange: 'Oct 19 – Oct 25, 2026', dateRangeBn: '১৯ – ২৫ অক্টোবর, ২০২৬ (চলতি সপ্তাহ)', pages: isSecondStudent ? 15 : 22, accuracy: 98, status: 'Mumtaz (Top Scholar Grade)', sabaq: 'Surah Yusuf (Ayahs 26–52)', sabqi: 'Juz 11–12 (9p)', manzil: 'Juz 1–6 Cycle' },
    { iso: '2026-W44', weekNum: 44, label: 'W44', period: 'Week 44', date: 'Oct 26', dateRange: 'Oct 26 – Nov 01, 2026', dateRangeBn: '২৬ অক্টোবর – ০১ নভেম্বর, ২০২৬', pages: isSecondStudent ? 16 : 22, accuracy: 98, status: 'Upcoming Target', sabaq: 'Surah Yusuf (Ayahs 53–79)', sabqi: 'Juz 12 (9p)', manzil: 'Juz 1–7 Cycle' },
  ];

  // Helper to parse arbitrary ISO week string (e.g. '2026-W42')
  const getCustomWeekInfo = (isoStr) => {
    const existing = ACADEMIC_WEEKS.find((w) => w.iso === isoStr);
    if (existing) return existing;

    const match = isoStr.match(/^(\d{4})-W(\d{2})$/);
    if (!match) return ACADEMIC_WEEKS[ACADEMIC_WEEKS.length - 2];

    const year = parseInt(match[1], 10);
    const weekNum = parseInt(match[2], 10);

    const simple = new Date(year, 0, 1 + (weekNum - 1) * 7);
    const dayOfWeek = simple.getDay();
    const ISOweekStart = simple;
    if (dayOfWeek <= 4) {
      ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    } else {
      ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    }
    const ISOweekEnd = new Date(ISOweekStart);
    ISOweekEnd.setDate(ISOweekStart.getDate() + 6);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const sDate = `${ISOweekStart.getDate().toString().padStart(2, '0')} ${monthNames[ISOweekStart.getMonth()]}`;
    const eDate = `${ISOweekEnd.getDate().toString().padStart(2, '0')} ${monthNames[ISOweekEnd.getMonth()]}, ${year}`;

    return {
      iso: isoStr,
      weekNum,
      label: `W${weekNum}`,
      period: `Week ${weekNum}`,
      date: sDate,
      dateRange: `${sDate} – ${eDate}`,
      dateRangeBn: `সপ্তাহ ${weekNum} (${year})`,
      pages: isSecondStudent ? Math.min(18, 8 + (weekNum % 8)) : Math.min(24, 12 + (weekNum % 10)),
      accuracy: 90 + (weekNum % 9),
      status: 'Hafiz Cadence Active',
      sabaq: `Weekly Sabaq Unit ${weekNum}`,
      sabqi: `Juz Revision Pace`,
      manzil: `Regular Manzil Cycle`,
    };
  };

  const selectedWeekObj = getCustomWeekInfo(selectedCalendarWeek);

  // Build rolling 8-week window displayed on the bar chart that includes the selected calendar week
  const selectedIdxInList = ACADEMIC_WEEKS.findIndex((w) => w.iso === selectedCalendarWeek);
  const endIdx = selectedIdxInList !== -1 ? Math.min(ACADEMIC_WEEKS.length, Math.max(8, selectedIdxInList + 1)) : ACADEMIC_WEEKS.length;
  const startIdx = Math.max(0, endIdx - 8);
  const weeklyData = ACADEMIC_WEEKS.slice(startIdx, endIdx).map((w) => ({
    ...w,
    isSelected: w.iso === selectedCalendarWeek,
  }));

  const monthlyData = isSecondStudent
    ? [
        { label: 'May', period: 'May 2026', date: 'May', pages: 30, accuracy: 87, status: 'Foundation' },
        { label: 'Jun', period: 'Jun 2026', date: 'Jun', pages: 34, accuracy: 89, status: 'Juz 4 Cleared' },
        { label: 'Jul', period: 'Jul 2026', date: 'Jul', pages: 38, accuracy: 91, status: 'Accelerating' },
        { label: 'Aug', period: 'Aug 2026', date: 'Aug', pages: 42, accuracy: 92, status: 'Juz 5 Exam' },
        { label: 'Sep', period: 'Sep 2026', date: 'Sep', pages: 46, accuracy: 94, status: 'Strong Retention' },
        { label: 'Oct', period: 'Oct 2026', date: 'Current', pages: 50, accuracy: 95, status: 'Juz 6 In Progress' },
      ]
    : [
        { label: 'May', period: 'May 2026', date: 'May', pages: 42, accuracy: 91, status: 'Consistent' },
        { label: 'Jun', period: 'Jun 2026', date: 'Jun', pages: 48, accuracy: 93, status: 'Juz 9 Passed' },
        { label: 'Jul', period: 'Jul 2026', date: 'Jul', pages: 52, accuracy: 94, status: 'Juz 10 Passed' },
        { label: 'Aug', period: 'Aug 2026', date: 'Aug', pages: 58, accuracy: 95, status: 'Juz 11 Cleared' },
        { label: 'Sep', period: 'Sep 2026', date: 'Sep', pages: 62, accuracy: 96, status: 'Surah Yusuf Started' },
        { label: 'Oct', period: 'Oct 2026', date: 'Current', pages: 68, accuracy: 98, status: 'Mumtaz (Para 12)' },
      ];

  const activeDataset = timeframe === 'weekly' ? weeklyData : monthlyData;

  // Proportional SVG canvas dimensions for Left Combo Chart
  const svgWidth = 520;
  const svgHeight = 205;
  const paddingLeft = 40;
  const paddingRight = 40;
  const paddingTop = 26;
  const paddingBottom = 34;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Max Pages for Bar Scale
  const maxPages = timeframe === 'weekly' ? (isSecondStudent ? 20 : 25) : (isSecondStudent ? 60 : 75);
  // Accuracy Min/Max for Line Scale
  const minAcc = 70;
  const maxAcc = 100;

  // Coordinate calculations with smartly proportioned bar width
  const numPoints = activeDataset.length;
  const stepX = chartWidth / numPoints;
  const barWidth = Math.round(Math.min(26, Math.max(20, stepX * 0.44)));

  const points = activeDataset.map((d, i) => {
    const x = paddingLeft + i * stepX + stepX / 2;
    const barHeight = Math.max(6, (d.pages / maxPages) * chartHeight);
    const barY = paddingTop + (chartHeight - barHeight);
    const lineY = paddingTop + (1 - (d.accuracy - minAcc) / (maxAcc - minAcc)) * chartHeight;

    return {
      ...d,
      index: i,
      x,
      barX: x - barWidth / 2,
      barY,
      barWidth,
      barHeight,
      lineY,
    };
  });

  // Generate ultra-smooth cubic Bezier spline path for the Tajweed accuracy line
  function getCurvedPath(pts) {
    if (!pts || pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x},${pts[0].lineY}`;

    let d = `M ${pts[0].x.toFixed(1)},${pts[0].lineY.toFixed(1)}`;

    for (let i = 0; i < pts.length - 1; i++) {
      const pPrev = i > 0 ? pts[i - 1] : pts[i];
      const pCurr = pts[i];
      const pNext = pts[i + 1];
      const pNextNext = i + 2 < pts.length ? pts[i + 2] : pNext;

      const cp1x = pCurr.x + (pNext.x - pPrev.x) / 5.5;
      const cp1y = pCurr.lineY + (pNext.lineY - pPrev.lineY) / 5.5;

      const cp2x = pNext.x - (pNextNext.x - pCurr.x) / 5.5;
      const cp2y = pNext.lineY - (pNextNext.lineY - pCurr.lineY) / 5.5;

      d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${pNext.x.toFixed(1)},${pNext.lineY.toFixed(1)}`;
    }
    return d;
  }

  const smoothLinePath = getCurvedPath(points);

  // Summary Metrics
  const totalPages = activeDataset.reduce((sum, d) => sum + d.pages, 0);
  const avgPages = Math.round(totalPages / activeDataset.length);
  const avgAccuracy = (
    activeDataset.reduce((sum, d) => sum + d.accuracy, 0) / activeDataset.length
  ).toFixed(1);

  const activePoint =
    hoveredIndex !== null
      ? points[hoveredIndex]
      : timeframe === 'weekly'
      ? points.find((p) => p.isSelected) || points[points.length - 1]
      : points[points.length - 1];

  // =========================================================================
  // PIE / DONUT CHART DATASETS (Curriculum Focus vs Recitation Quality)
  // =========================================================================
  const curriculumSlices = isSecondStudent
    ? [
        {
          id: 'sabaq',
          label: 'Sabaq (New Lesson)',
          shortLabel: 'Sabaq',
          percent: 40,
          hours: '12.0h',
          desc: 'Daily new Ayahs memorization',
          color: '#D4AF37', // Solid Bright Gold
          lightBg: '#FDF8EC',
        },
        {
          id: 'sabqi',
          label: 'Sabqi (Recent Revision)',
          shortLabel: 'Sabqi',
          percent: 25,
          hours: '7.5h',
          desc: 'Para 4–5 continuous review',
          color: '#0D4A38', // Solid Emerald Green
          lightBg: '#EBF5F0',
        },
        {
          id: 'manzil',
          label: 'Manzil (All-Juz Cycle)',
          shortLabel: 'Manzil',
          percent: 15,
          hours: '4.5h',
          desc: 'Para 1–3 long-term retention',
          color: '#15664F', // Solid Forest Accent
          lightBg: '#F0F7F4',
        },
        {
          id: 'tajweed',
          label: 'Tajweed & Makharij',
          shortLabel: 'Tajweed',
          percent: 20,
          hours: '6.0h',
          desc: 'Heavy letters & Qalqalah drills',
          color: '#9F7C35', // Antique Gold / Bronze
          lightBg: '#F8F4EA',
        },
      ]
    : [
        {
          id: 'sabaq',
          label: 'Sabaq (New Lesson)',
          shortLabel: 'Sabaq',
          percent: 35,
          hours: '12.0h',
          desc: 'Surah Yusuf (Juz 12) memorization',
          color: '#D4AF37', // Solid Bright Gold
          lightBg: '#FDF8EC',
        },
        {
          id: 'sabqi',
          label: 'Sabqi (Recent Revision)',
          shortLabel: 'Sabqi',
          percent: 30,
          hours: '10.5h',
          desc: 'Recent 5 Juz (Juz 7–11) polish',
          color: '#0D4A38', // Solid Emerald Green
          lightBg: '#EBF5F0',
        },
        {
          id: 'manzil',
          label: 'Manzil (All-Juz Cycle)',
          shortLabel: 'Manzil',
          percent: 22,
          hours: '7.5h',
          desc: 'Juz 1–6 cumulative cycle',
          color: '#15664F', // Solid Forest Accent
          lightBg: '#F0F7F4',
        },
        {
          id: 'tajweed',
          label: 'Tajweed & Makharij',
          shortLabel: 'Tajweed',
          percent: 13,
          hours: '4.5h',
          desc: 'Madd Lazim & Sifaat rules',
          color: '#9F7C35', // Antique Gold / Bronze
          lightBg: '#F8F4EA',
        },
      ];

  const qualitySlices = [
    {
      id: 'mumtaz',
      label: 'Mumtaz (Flawless Recitation)',
      shortLabel: 'Mumtaz',
      percent: 72,
      hours: '24.5h',
      desc: 'Top scholar grade • 0 major slips',
      color: '#0D4A38', // Solid Emerald
      lightBg: '#EBF5F0',
    },
    {
      id: 'jayyid',
      label: 'Jayyid Jiddan (Proficient)',
      shortLabel: 'Jayyid',
      percent: 20,
      hours: '7.0h',
      desc: 'Minor breath & pacing guidance',
      color: '#D4AF37', // Solid Gold
      lightBg: '#FDF8EC',
    },
    {
      id: 'needs_work',
      label: 'Review Focus (Active Annotations)',
      shortLabel: 'Revision',
      percent: 8,
      hours: '3.0h',
      desc: 'Ayah slips flagged by Ustadh',
      color: '#9F7C35', // Bronze / Warm Accent
      lightBg: '#F8F4EA',
    },
  ];

  const currentPieSlices = pieMode === 'curriculum' ? curriculumSlices : qualitySlices;

  // Donut Geometry Parameters
  const donutCx = 90;
  const donutCy = 90;
  const donutOuterR = 70;
  const donutInnerR = 45;

  let cumulativeAngle = -Math.PI / 2;
  const computedSlices = currentPieSlices.map((slice, idx) => {
    const sliceAngle = (slice.percent / 100) * 2 * Math.PI;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + sliceAngle;
    cumulativeAngle = endAngle;

    return {
      ...slice,
      index: idx,
      startAngle,
      endAngle,
    };
  });

  // Calculate SVG arc path with optional hover expansion
  function getDonutSlicePath(cx, cy, innerR, outerR, startAngle, endAngle) {
    const x1 = cx + outerR * Math.cos(startAngle);
    const y1 = cy + outerR * Math.sin(startAngle);
    const x2 = cx + outerR * Math.cos(endAngle);
    const y2 = cy + outerR * Math.sin(endAngle);
    const x3 = cx + innerR * Math.cos(endAngle);
    const y3 = cy + innerR * Math.sin(endAngle);
    const x4 = cx + innerR * Math.cos(startAngle);
    const y4 = cy + innerR * Math.sin(startAngle);

    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

    return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} L ${x3.toFixed(2)} ${y3.toFixed(2)} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4.toFixed(2)} ${y4.toFixed(2)} Z`;
  }

  const activeSliceItem =
    hoveredSlice !== null ? computedSlices[hoveredSlice] : null;

  return (
    <div
      className="student-progress-combo-chart-card"
      style={{
        background: '#FFFFFF',
        border: '1.5px solid #E6DEC9',
        borderRadius: '16px',
        padding: '20px 22px',
        boxShadow: '0 4px 16px rgba(13, 74, 56, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginTop: '16px',
      }}
    >
      <style>{`
        .combo-analytics-split-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.48fr) minmax(0, 1fr);
          gap: 16px;
          align-items: stretch;
        }
        @media (max-width: 1040px) {
          .combo-analytics-split-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Top Header & Executive Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          paddingBottom: '12px',
          borderBottom: '1px solid #F1EAD8',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#FDF8EC',
              border: '1.5px solid #D4AF37',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#B8860B',
              flexShrink: 0,
            }}
          >
            <Icon name="activity" size={17} />
          </span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#0D4A38',
                  margin: 0,
                  lineHeight: '1.2',
                }}
              >
                Weekly Memorization &amp; Accuracy
              </h3>
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: '700',
                  color: '#0D4A38',
                  background: '#E8F5E9',
                  border: '1px solid #C8E6C9',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.4px',
                }}
              >
                Live Analytics
              </span>
            </div>
            <p style={{ fontSize: '12.5px', color: '#64748B', margin: '3px 0 0' }}>
              Memorization volume (solid gold pillars) &amp; Tajweed accuracy (emerald spline) with curriculum focus allocation.
            </p>
          </div>
        </div>

        {/* Legend & Filter Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {/* Legend with solid colors */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '12px',
              background: '#FAF8F3',
              padding: '5px 12px',
              borderRadius: '8px',
              border: '1px solid #EEDFB8',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: '12px',
                  height: '10px',
                  borderRadius: '3px',
                  background: '#D4AF37',
                  display: 'inline-block',
                }}
              />
              <span style={{ fontWeight: '600', color: '#334155' }}>Pages</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: '16px',
                  height: '3.5px',
                  background: '#0D4A38',
                  borderRadius: '2px',
                  display: 'inline-block',
                }}
              />
              <span style={{ fontWeight: '600', color: '#0D4A38' }}>Accuracy %</span>
            </div>
          </div>

          {/* Timeframe Toggle Buttons (Solid Gold active styling) */}
          <div
            style={{
              display: 'inline-flex',
              background: '#F8FAFC',
              borderRadius: '8px',
              padding: '3px',
              border: '1px solid #E2E8F0',
            }}
          >
            <button
              type="button"
              onClick={() => setTimeframe('weekly')}
              style={{
                border: 'none',
                background: timeframe === 'weekly' ? '#D4AF37' : 'transparent',
                color: timeframe === 'weekly' ? '#FFFFFF' : '#64748B',
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '11.5px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              8 Weeks
            </button>
            <button
              type="button"
              onClick={() => setTimeframe('monthly')}
              style={{
                border: 'none',
                background: timeframe === 'monthly' ? '#D4AF37' : 'transparent',
                color: timeframe === 'monthly' ? '#FFFFFF' : '#64748B',
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '11.5px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              6 Months
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Calendar Week Selector Toolbar */}
      {timeframe === 'weekly' && (
        <div
          style={{
            background: '#FAF8F3',
            border: '1.5px solid #EEDFB8',
            borderRadius: '12px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  background: '#FDF8EC',
                  border: '1px solid #D4AF37',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#B8860B',
                }}
              >
                <Icon name="calendar" size={14} />
              </span>
              <span style={{ fontSize: '12.5px', fontWeight: '800', color: '#0D4A38' }}>
                ক্যালেন্ডার সপ্তাহ (Calendar Week):
              </span>
            </div>

            {/* Stepper Navigation */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <button
                type="button"
                title="Previous Calendar Week"
                onClick={() => {
                  const curIdx = ACADEMIC_WEEKS.findIndex((w) => w.iso === selectedCalendarWeek);
                  if (curIdx > 0) {
                    setSelectedCalendarWeek(ACADEMIC_WEEKS[curIdx - 1].iso);
                  }
                }}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  border: '1px solid #D4AF37',
                  background: '#FFFFFF',
                  color: '#0D4A38',
                  fontWeight: '800',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ◀
              </button>
              <button
                type="button"
                title="Next Calendar Week"
                onClick={() => {
                  const curIdx = ACADEMIC_WEEKS.findIndex((w) => w.iso === selectedCalendarWeek);
                  if (curIdx !== -1 && curIdx < ACADEMIC_WEEKS.length - 1) {
                    setSelectedCalendarWeek(ACADEMIC_WEEKS[curIdx + 1].iso);
                  }
                }}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  border: '1px solid #D4AF37',
                  background: '#FFFFFF',
                  color: '#0D4A38',
                  fontWeight: '800',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ▶
              </button>
            </div>

            {/* HTML5 Native Calendar Week Picker */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="week"
                id="calendar-week-picker"
                value={selectedCalendarWeek}
                onChange={(e) => {
                  if (e.target.value) {
                    setSelectedCalendarWeek(e.target.value);
                    if (timeframe !== 'weekly') setTimeframe('weekly');
                  }
                }}
                title="Click to pick calendar week from calendar"
                style={{
                  padding: '4px 8px',
                  fontSize: '12px',
                  fontWeight: '700',
                  borderRadius: '6px',
                  border: '1.5px solid #D4AF37',
                  background: '#FFFFFF',
                  color: '#0D4A38',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              />
            </div>

            {/* Academic Weeks Dropdown */}
            <select
              value={selectedCalendarWeek}
              onChange={(e) => {
                setSelectedCalendarWeek(e.target.value);
                if (timeframe !== 'weekly') setTimeframe('weekly');
              }}
              style={{
                padding: '5px 10px',
                fontSize: '12px',
                fontWeight: '700',
                borderRadius: '6px',
                border: '1.5px solid #D4AF37',
                background: '#FFFFFF',
                color: '#0D4A38',
                cursor: 'pointer',
                outline: 'none',
                maxWidth: '260px',
              }}
            >
              {ACADEMIC_WEEKS.map((w) => (
                <option key={w.iso} value={w.iso}>
                  {w.dateRange} ({w.label})
                </option>
              ))}
            </select>

            {/* Quick "This Week" Button */}
            <button
              type="button"
              onClick={() => {
                setSelectedCalendarWeek('2026-W43');
                if (timeframe !== 'weekly') setTimeframe('weekly');
              }}
              style={{
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: '800',
                borderRadius: '6px',
                border: selectedCalendarWeek === '2026-W43' ? '1.5px solid #0D4A38' : '1px solid #CBD5E1',
                background: selectedCalendarWeek === '2026-W43' ? '#0D4A38' : '#FFFFFF',
                color: selectedCalendarWeek === '2026-W43' ? '#FFFFFF' : '#475569',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              চলতি সপ্তাহ
            </button>
          </div>

          {/* Selected Week Badge & Date Range Display */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '8px',
                background: '#E8F5E9',
                border: '1px solid #A5D6A7',
                fontSize: '11.5px',
                fontWeight: '700',
                color: '#1B5E20',
              }}
            >
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#2E7D32', display: 'inline-block' }} />
              <span>সপ্তাহ {selectedWeekObj.weekNum}: <strong>{selectedWeekObj.dateRangeBn || selectedWeekObj.dateRange}</strong></span>
            </span>
          </div>
        </div>
      )}

      {/* =====================================================================
          TWO-COLUMN EXECUTIVE ANALYTICS: COMBO CHART + PIE / DONUT BREAKDOWN
          ===================================================================== */}
      <div className="combo-analytics-split-grid">
        {/* LEFT COLUMN: Weekly Memorization Pillars & Tajweed Accuracy Spline */}
        <div
          style={{
            background: '#FAF8F3',
            border: '1px solid #EEDFB8',
            borderRadius: '12px',
            padding: '12px 14px 10px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Subheader */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#D4AF37' }} />
              <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#0D4A38', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Volume &amp; Tajweed Trajectory
              </span>
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#8C6819',
                background: '#FDF8EC',
                padding: '2px 8px',
                borderRadius: '6px',
                border: '1px solid #EEDFB8',
              }}
            >
              Period Avg: {avgPages} p/wk • {avgAccuracy}% Acc
            </span>
          </div>

          {/* Left Chart SVG Container */}
          <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '210px' }}
            >
              {/* Background Horizontal Grid Lines & Dual Y-Axes */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const y = paddingTop + chartHeight * (1 - ratio);
                const valPages = Math.round(maxPages * ratio);
                const valAcc = Math.round(minAcc + (maxAcc - minAcc) * ratio);

                return (
                  <g key={`grid-${idx}`}>
                    <line
                      x1={paddingLeft - 4}
                      y1={y}
                      x2={svgWidth - paddingRight + 4}
                      y2={y}
                      stroke="#F1EAD8"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                    {/* Left Y-Axis Label (Pages Memorized) */}
                    <text
                      x={paddingLeft - 8}
                      y={y + 3.5}
                      textAnchor="end"
                      fontSize="9.5"
                      fontWeight="600"
                      fill="#94A3B8"
                    >
                      {valPages}p
                    </text>
                    {/* Right Y-Axis Label (Accuracy %) */}
                    <text
                      x={svgWidth - paddingRight + 8}
                      y={y + 3.5}
                      textAnchor="start"
                      fontSize="9.5"
                      fontWeight="700"
                      fill="#0D4A38"
                    >
                      {valAcc}%
                    </text>
                  </g>
                );
              })}

              {/* Column Guide Tracks and Golden Pillars */}
              {points.map((p) => {
                const isHovered = hoveredIndex === p.index;

                return (
                  <g
                    key={`track-${p.index}`}
                    onClick={() => {
                      if (p.iso) setSelectedCalendarWeek(p.iso);
                    }}
                    onMouseEnter={() => setHoveredIndex(p.index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Active Selection Badge above Pillar */}
                    {p.isSelected && (
                      <g>
                        <rect
                          x={p.x - 22}
                          y={paddingTop - 16}
                          width="44"
                          height="13"
                          rx="4"
                          fill="#B8860B"
                        />
                        <text
                          x={p.x}
                          y={paddingTop - 6}
                          textAnchor="middle"
                          fontSize="7.5"
                          fontWeight="900"
                          fill="#FFFFFF"
                          letterSpacing="0.4"
                        >
                          ACTIVE
                        </text>
                      </g>
                    )}

                    {/* Pillar Guide Track */}
                    <rect
                      x={p.barX - 2}
                      y={paddingTop}
                      width={p.barWidth + 4}
                      height={chartHeight}
                      fill={p.isSelected ? '#FFF8E1' : isHovered ? '#FDF8EC' : '#FFFFFF'}
                      stroke={p.isSelected ? '#B8860B' : isHovered ? '#D4AF37' : '#F1EAD8'}
                      strokeWidth={p.isSelected ? '2' : '1'}
                      rx="5"
                      ry="5"
                    />

                    {/* Solid Golden Progress Bar */}
                    <rect
                      x={p.barX}
                      y={p.barY}
                      width={p.barWidth}
                      height={p.barHeight}
                      fill={p.isSelected ? '#B8860B' : isHovered ? '#D4AF37' : '#D4AF37'}
                      rx="4"
                      ry="4"
                    />

                    {/* Page Number Label */}
                    {p.barHeight >= 22 ? (
                      <text
                        x={p.x}
                        y={p.barY + 13}
                        textAnchor="middle"
                        fontSize="9.5"
                        fontWeight="800"
                        fill="#FFFFFF"
                      >
                        {p.pages}p
                      </text>
                    ) : (
                      <text
                        x={p.x}
                        y={p.barY - 5}
                        textAnchor="middle"
                        fontSize="9.5"
                        fontWeight="700"
                        fill={isHovered ? '#B8860B' : '#8C6819'}
                      >
                        {p.pages}p
                      </text>
                    )}

                    {/* X-Axis Period Label */}
                    <text
                      x={p.x}
                      y={paddingTop + chartHeight + 14}
                      textAnchor="middle"
                      fontSize="10.5"
                      fontWeight={isHovered ? '800' : '600'}
                      fill={isHovered ? '#0D4A38' : '#334155'}
                    >
                      {p.label}
                    </text>

                    <text
                      x={p.x}
                      y={paddingTop + chartHeight + 26}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight={isHovered ? '600' : '400'}
                      fill={isHovered ? '#B8860B' : '#94A3B8'}
                    >
                      {p.date}
                    </text>
                  </g>
                );
              })}

              {/* Smooth Cubic Spline Curve for Tajweed Accuracy */}
              <path
                d={smoothLinePath}
                fill="none"
                stroke="#0D4A38"
                strokeWidth="2.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Line Data Point Dots & Interactive Hover Badges */}
              {points.map((p) => {
                const isHovered = hoveredIndex === p.index;

                return (
                  <g
                    key={`point-${p.index}`}
                    onMouseEnter={() => setHoveredIndex(p.index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle
                      cx={p.x}
                      cy={p.lineY}
                      r={isHovered ? '5.5' : '3.5'}
                      fill={isHovered ? '#0D4A38' : '#FFFFFF'}
                      stroke={isHovered ? '#D4AF37' : '#0D4A38'}
                      strokeWidth={isHovered ? '2.5' : '2'}
                    />

                    {/* Precision Tooltip Badge on Hover */}
                    {isHovered && (
                      <g>
                        <rect
                          x={p.x - 28}
                          y={p.lineY - 24}
                          width="56"
                          height="18"
                          rx="4"
                          fill="#0D4A38"
                          stroke="#D4AF37"
                          strokeWidth="1"
                        />
                        <text
                          x={p.x}
                          y={p.lineY - 12}
                          textAnchor="middle"
                          fontSize="9.5"
                          fontWeight="800"
                          fill="#FFFFFF"
                        >
                          {p.accuracy}% Acc
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Donut / Pie Chart (Curriculum Focus Allocation) */}
        <div
          style={{
            background: '#FAF8F3',
            border: '1px solid #EEDFB8',
            borderRadius: '12px',
            padding: '12px 14px 10px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '8px',
          }}
        >
          {/* Header of Donut Section with Tab Switcher */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '5px',
                  background: '#FDF8EC',
                  border: '1px solid #D4AF37',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#B8860B',
                }}
              >
                <Icon name="pie-chart" size={12} />
              </span>
              <div>
                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: '700',
                    color: '#0D4A38',
                    textTransform: 'uppercase',
                    letterSpacing: '0.4px',
                    display: 'block',
                    lineHeight: '1.2',
                  }}
                >
                  Curriculum Effort Split
                </span>
                <span style={{ fontSize: '10px', color: '#64748B' }}>
                  {hoveredIndex !== null ? `Focus on ${activePoint.period}` : 'Weekly Hifz allocation'}
                </span>
              </div>
            </div>

            {/* Toggle between Curriculum and Quality Breakdown */}
            <div
              style={{
                display: 'inline-flex',
                background: '#FFFFFF',
                borderRadius: '6px',
                padding: '2px',
                border: '1px solid #EEDFB8',
              }}
            >
              <button
                type="button"
                onClick={() => setPieMode('curriculum')}
                style={{
                  border: 'none',
                  background: pieMode === 'curriculum' ? '#0D4A38' : 'transparent',
                  color: pieMode === 'curriculum' ? '#FFFFFF' : '#64748B',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Curriculum
              </button>
              <button
                type="button"
                onClick={() => setPieMode('quality')}
                style={{
                  border: 'none',
                  background: pieMode === 'quality' ? '#0D4A38' : 'transparent',
                  color: pieMode === 'quality' ? '#FFFFFF' : '#64748B',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Quality
              </button>
            </div>
          </div>

          {/* Donut Chart Visual & Dynamic Center Readout */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '4px 0',
            }}
          >
            <div style={{ position: 'relative', width: '135px', height: '135px', flexShrink: 0 }}>
              <svg viewBox="0 0 180 180" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                {computedSlices.map((slice) => {
                  const isHovered = hoveredSlice === slice.index;
                  const currentOuterR = isHovered ? donutOuterR + 4 : donutOuterR;
                  const currentInnerR = isHovered ? donutInnerR - 2 : donutInnerR;

                  return (
                    <g
                      key={`slice-${slice.id}`}
                      onMouseEnter={() => setHoveredSlice(slice.index)}
                      onMouseLeave={() => setHoveredSlice(null)}
                      style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                    >
                      <path
                        d={getDonutSlicePath(
                          donutCx,
                          donutCy,
                          currentInnerR,
                          currentOuterR,
                          slice.startAngle,
                          slice.endAngle
                        )}
                        fill={slice.color}
                        stroke="#FAF8F3"
                        strokeWidth="2.5"
                        style={{
                          filter: isHovered ? 'drop-shadow(0 2px 6px rgba(13,74,56,0.25))' : 'none',
                        }}
                      />
                    </g>
                  );
                })}

                {/* Central Readout in Donut Hole */}
                <g pointerEvents="none">
                  {activeSliceItem ? (
                    <>
                      <text
                        x={donutCx}
                        y={donutCy - 11}
                        textAnchor="middle"
                        fontSize="8.5"
                        fontWeight="800"
                        fill={activeSliceItem.color}
                        letterSpacing="0.4"
                      >
                        {activeSliceItem.shortLabel.toUpperCase()}
                      </text>
                      <text
                        x={donutCx}
                        y={donutCy + 7}
                        textAnchor="middle"
                        fontSize="18"
                        fontWeight="900"
                        fill="#0D4A38"
                      >
                        {activeSliceItem.percent}%
                      </text>
                      <text
                        x={donutCx}
                        y={donutCy + 19}
                        textAnchor="middle"
                        fontSize="8.5"
                        fontWeight="700"
                        fill="#64748B"
                      >
                        {activeSliceItem.hours}
                      </text>
                    </>
                  ) : (
                    <>
                      <text
                        x={donutCx}
                        y={donutCy - 11}
                        textAnchor="middle"
                        fontSize="8.5"
                        fontWeight="700"
                        fill="#8C6819"
                        letterSpacing="0.4"
                      >
                        {pieMode === 'curriculum' ? 'TOTAL LOAD' : 'ACCURACY'}
                      </text>
                      <text
                        x={donutCx}
                        y={donutCy + 7}
                        textAnchor="middle"
                        fontSize="17"
                        fontWeight="900"
                        fill="#0D4A38"
                      >
                        {pieMode === 'curriculum' ? '34.5h' : `${activePoint.accuracy}%`}
                      </text>
                      <text
                        x={donutCx}
                        y={donutCy + 19}
                        textAnchor="middle"
                        fontSize="8.5"
                        fontWeight="700"
                        fill="#15664F"
                      >
                        {pieMode === 'curriculum' ? '100% Target' : 'Mumtaz Tier'}
                      </text>
                    </>
                  )}
                </g>
              </svg>
            </div>

            {/* Compact Legend alongside Donut */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                flex: 1,
                minWidth: '130px',
              }}
            >
              {computedSlices.map((slice) => {
                const isHovered = hoveredSlice === slice.index;

                return (
                  <div
                    key={`legend-${slice.id}`}
                    onMouseEnter={() => setHoveredSlice(slice.index)}
                    onMouseLeave={() => setHoveredSlice(null)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      background: isHovered ? slice.lightBg : '#FFFFFF',
                      border: `1px solid ${isHovered ? slice.color : '#F1EAD8'}`,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '2.5px',
                          background: slice.color,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: isHovered ? '800' : '600',
                          color: isHovered ? '#0D4A38' : '#334155',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        title={slice.desc}
                      >
                        {slice.shortLabel}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '800',
                          color: slice.color,
                        }}
                      >
                        {slice.percent}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Calendar Week Syllabus & Target Dossier */}
      {timeframe === 'weekly' && (
        <div
          style={{
            background: 'linear-gradient(135deg, #FAF7EE 0%, #FFFFFF 100%)',
            border: '1.5px solid #D4AF37',
            borderRadius: '12px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            boxShadow: '0 2px 8px rgba(13, 74, 56, 0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#0D4A38',
                color: '#D4AF37',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon name="book" size={16} />
            </span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#0D4A38' }}>
                  সাপ্তাহিক রুটিন ও সিলেবাস: {selectedWeekObj.dateRangeBn || selectedWeekObj.dateRange}
                </span>
                <span style={{ fontSize: '11px', fontWeight: '700', padding: '1px 6px', borderRadius: '4px', background: '#D4AF37', color: '#FFFFFF' }}>
                  {selectedWeekObj.period}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginTop: '4px', fontSize: '12px' }}>
                <span style={{ color: '#1E293B' }}>
                  <strong style={{ color: '#B8860B' }}>নতুন পড়া (Sabaq):</strong> {selectedWeekObj.sabaq}
                </span>
                <span style={{ color: '#1E293B' }}>
                  <strong style={{ color: '#0D4A38' }}>নৈশ পড়া (Sabqi):</strong> {selectedWeekObj.sabqi}
                </span>
                <span style={{ color: '#1E293B' }}>
                  <strong style={{ color: '#15664F' }}>আমোল পারা (Manzil):</strong> {selectedWeekObj.manzil}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#0D4A38' }}>
                {selectedWeekObj.pages} Pages • {selectedWeekObj.accuracy}%
              </div>
              <div style={{ fontSize: '10.5px', fontWeight: '600', color: '#8C6819' }}>
                {selectedWeekObj.status}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SMART SPACE KPI MATRIX — BALANCED 4-CARD EXECUTIVE ROW
          ===================================================================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '10px',
        }}
      >
        {/* Card 1: Active Focus Period */}
        <div
          style={{
            background: '#FAF8F3',
            border: '1px solid #EEDFB8',
            borderRadius: '10px',
            padding: '10px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '10px', fontWeight: '700', color: '#8C6819', textTransform: 'uppercase' }}>
              Selected Period
            </span>
            <span
              style={{
                fontSize: '9.5px',
                fontWeight: '700',
                background: '#D4AF37',
                color: '#FFFFFF',
                padding: '1px 6px',
                borderRadius: '4px',
              }}
            >
              {activePoint.label}
            </span>
          </div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#1E293B' }}>
            {activePoint.period}
          </div>
          <div style={{ fontSize: '11px', color: '#64748B' }}>
            Date: <strong style={{ color: '#0D4A38' }}>{activePoint.dateRange || activePoint.date}</strong>
          </div>
        </div>

        {/* Card 2: Memorization Volume */}
        <div
          style={{
            background: '#FAF8F3',
            border: '1px solid #EEDFB8',
            borderRadius: '10px',
            padding: '10px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
          }}
        >
          <span style={{ fontSize: '10px', fontWeight: '700', color: '#8C6819', textTransform: 'uppercase' }}>
            Pages Memorized
          </span>
          <div style={{ fontSize: '16px', fontWeight: '800', color: '#B8860B' }}>
            {activePoint.pages} Pages
          </div>
          <div style={{ fontSize: '11px', color: '#64748B' }}>
            Period Avg: <strong style={{ color: '#1E293B' }}>{avgPages} p/wk</strong>
          </div>
        </div>

        {/* Card 3: Tajweed Recitation Score */}
        <div
          style={{
            background: '#FAF8F3',
            border: '1px solid #EEDFB8',
            borderRadius: '10px',
            padding: '10px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
          }}
        >
          <span style={{ fontSize: '10px', fontWeight: '700', color: '#0D4A38', textTransform: 'uppercase' }}>
            Tajweed Accuracy
          </span>
          <div style={{ fontSize: '16px', fontWeight: '800', color: '#0D4A38' }}>
            {activePoint.accuracy}%
          </div>
          <div style={{ fontSize: '11px', color: '#64748B' }}>
            Avg Accuracy: <strong style={{ color: '#0D4A38' }}>{avgAccuracy}%</strong>
          </div>
        </div>

        {/* Card 4: Qualitative Status / Standing */}
        <div
          style={{
            background: '#FAF8F3',
            border: '1px solid #EEDFB8',
            borderRadius: '10px',
            padding: '10px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
          }}
        >
          <span style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>
            Academic Rating
          </span>
          <div
            style={{
              fontSize: '13px',
              fontWeight: '700',
              color: '#0D4A38',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            title={activePoint.status}
          >
            {activePoint.status}
          </div>
          <div style={{ fontSize: '11px', color: '#64748B' }}>
            Cadence: <strong style={{ color: '#B8860B' }}>Hafiz Track</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
