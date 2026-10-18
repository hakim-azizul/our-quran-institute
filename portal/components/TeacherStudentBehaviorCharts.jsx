'use client';

import React, { useState } from 'react';
import { Icon } from './Icons';

export default function TeacherStudentBehaviorCharts({
  student,
  mistakes = [],
  onOpenQuran,
}) {
  const [hoveredDayIndex, setHoveredDayIndex] = useState(null);
  const [hoveredWeekIndex, setHoveredWeekIndex] = useState(null);
  const [hoveredErrorIndex, setHoveredErrorIndex] = useState(null);
  const [hoveredVelocityWeek, setHoveredVelocityWeek] = useState(null);
  const [behaviorTimeframe, setBehaviorTimeframe] = useState('4w'); // '4w' | '8w'

  const studentName = student?.studentName || student?.name || 'Tariq Al-Mansoor';
  const studentId = student?.studentId || student?.id || 'QI-STU-8842';
  const courseTitle = student?.courseTitle || 'Quran Reading Foundation & Tajweed Mastery';
  const memorizedJuz = student?.memorizedJuz || 12;
  const streak = student?.attendanceStreak || 19;

  // =========================================================================
  // DATASET 1: WEEKLY PRACTICE RHYTHM & DISCIPLINE (DAILY MINUTES)
  // Shows whether the student practices daily or crams right before class
  // =========================================================================
  const weeklyPracticeData = [
    { day: 'Mon', fullDay: 'Monday', minutes: 50, target: 45, type: 'Regular Practice', focus: 'Surah Yusuf Ayahs 1–10 (Sabaq Drill)' },
    { day: 'Tue', fullDay: 'Tuesday', minutes: 45, target: 45, type: 'Target Met', focus: 'Makharij Drills & Ayahs 11–15' },
    { day: 'Wed', fullDay: 'Wednesday', minutes: 65, target: 45, type: 'High Focus', focus: 'Full Sabaq + Sabqi Juz 11 Review' },
    { day: 'Thu', fullDay: 'Thursday', minutes: 40, target: 45, type: 'Light Session', focus: 'Noon Sakinah & Idgham Practice' },
    { day: 'Fri', fullDay: 'Friday', minutes: 60, target: 45, type: 'High Focus', focus: 'Surah Al-Kahf Friday Recitation' },
    { day: 'Sat', fullDay: 'Saturday', minutes: 35, target: 45, type: 'Review Only', focus: 'Manzil Juz 1–3 Listening & Muraja’ah' },
    { day: 'Sun', fullDay: 'Sunday', minutes: 50, target: 45, type: 'Regular Practice', focus: 'Prep for 1-on-1 Class with Sheikh' },
  ];

  const totalWeeklyMinutes = weeklyPracticeData.reduce((acc, d) => acc + d.minutes, 0);
  const totalWeeklyHours = (totalWeeklyMinutes / 60).toFixed(1);
  const daysTargetMet = weeklyPracticeData.filter((d) => d.minutes >= d.target).length;

  // Chart dimensions for Practice Rhythm
  const pWidth = 520;
  const pHeight = 200;
  const pPadL = 40;
  const pPadR = 24;
  const pPadT = 24;
  const pPadB = 32;
  const pPlotW = pWidth - pPadL - pPadR;
  const pPlotH = pHeight - pPadT - pPadB;
  const maxMins = 80;

  const pStepX = pPlotW / weeklyPracticeData.length;
  const pBarW = 26;

  // Target 45 min line Y position
  const targetLineY = pPadT + (1 - 45 / maxMins) * pPlotH;

  // =========================================================================
  // DATASET 2: HIFZ RETENTION VELOCITY (SABAQ VS SABQI VS MANZIL)
  // Essential Islamic Quranic pedagogy metric tracking memorization balance
  // =========================================================================
  const hifzBalanceData = [
    {
      week: 'W1',
      period: 'Oct 1–7',
      sabaqPages: 4.5,
      sabqiPages: 12.0,
      manzilPages: 20.0,
      balanceScore: 'Optimal (1:3:5)',
      status: 'Healthy',
    },
    {
      week: 'W2',
      period: 'Oct 8–14',
      sabaqPages: 5.0,
      sabqiPages: 14.0,
      manzilPages: 22.5,
      balanceScore: 'Optimal (1:3:5)',
      status: 'Healthy',
    },
    {
      week: 'W3',
      period: 'Oct 15–21',
      sabaqPages: 5.5,
      sabqiPages: 11.5,
      manzilPages: 18.0,
      balanceScore: 'Low Manzil Flag',
      status: 'Attention',
    },
    {
      week: 'W4 (Current)',
      period: 'Oct 22–28',
      sabaqPages: 6.0,
      sabqiPages: 16.0,
      manzilPages: 26.0,
      balanceScore: 'Strong Revision',
      status: 'Exemplary',
    },
  ];

  const maxPages = 30;
  const bWidth = 520;
  const bHeight = 200;
  const bPadL = 40;
  const bPadR = 24;
  const bPadT = 24;
  const bPadB = 32;
  const bPlotW = bWidth - bPadL - bPadR;
  const bPlotH = bHeight - bPadT - bPadB;
  const bStepX = bPlotW / hifzBalanceData.length;
  const miniBarW = 12;

  // =========================================================================
  // DATASET 3: PHONETIC ERROR PROFILE & TAJWEED WEAKNESS CLASSIFICATION
  // Shows where the student needs behavioral drill interventions
  // =========================================================================
  const errorDistribution = [
    {
      id: 'makharij',
      label: 'Makharij (Articulation Points)',
      arabic: 'مَخَارِجُ الحُرُوف',
      count: 7,
      pct: 38,
      color: '#0D4A38',
      description: 'Throat letters [ع, ح] vs [ء, هـ] and Deep Tongue [ق, ك]',
      remedy: '3-minute vocal warmup drill at start of each lesson',
    },
    {
      id: 'madd',
      label: 'Madd Timing & Duration',
      arabic: 'أَحْكَامُ المَدّ',
      count: 5,
      pct: 26,
      color: '#D4AF37',
      description: 'Madd Munfasil (4 Harakat) clipped prematurely to 2 Harakat',
      remedy: 'Finger counting cadence during Sabaq recitation',
    },
    {
      id: 'noon-sakina',
      label: 'Noon Sakinah & Ghunnah',
      arabic: 'أَحْكَامُ النُّونِ وَالغُنَّة',
      count: 4,
      pct: 20,
      color: '#1D4ED8',
      description: 'Idgham with Ghunnah duration holds',
      remedy: 'Metronome timing practice on Surah Yusuf v.8–12',
    },
    {
      id: 'qalqalah',
      label: 'Qalqalah (Echo Vibration)',
      arabic: 'حُرُوفُ القَلْقَلَة',
      count: 2,
      pct: 11,
      color: '#D97706',
      description: 'Minor vowel coloring on Qubt Jad [ق ط ب ج د] Sukoon',
      remedy: 'Sharper abrupt vocal cord release drills',
    },
    {
      id: 'waqf',
      label: 'Waqf & Breathing Control',
      arabic: 'الوَقْفُ وَالابْتِدَاء',
      count: 1,
      pct: 5,
      color: '#059669',
      description: 'Stopping mid-sentence on connected Grammatical Idafa',
      remedy: 'Diaphragm breath distribution coaching',
    },
  ];

  const totalErrors = errorDistribution.reduce((acc, e) => acc + e.count, 0);

  // SVG Donut Calculations for Error Profile
  const dRadius = 78;
  const dStroke = 24;
  const dCircumference = 2 * Math.PI * dRadius;

  let accumulatedDonutPct = 0;
  const donutSlices = errorDistribution.map((item, idx) => {
    const strokeDasharray = `${(item.pct / 100) * dCircumference} ${dCircumference}`;
    const strokeDashoffset = -((accumulatedDonutPct / 100) * dCircumference);
    accumulatedDonutPct += item.pct;

    return {
      ...item,
      index: idx,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  // =========================================================================
  // DATASET 4: 8-WEEK RECITATION ACCURACY & FLUENCY TRAJECTORY (SPLINE)
  // Shows continuous progression towards Sanad & Mumtaz honor benchmark
  // =========================================================================
  const trajectoryData8w = [
    { week: 'W1', score: 88.5, grade: 'Jayyid', date: 'Sep 3', notes: 'Initial placement; Makharij hesitation' },
    { week: 'W2', score: 90.2, grade: 'Jayyid Jiddan', date: 'Sep 10', notes: 'Sanad baseline reached' },
    { week: 'W3', score: 92.0, grade: 'Jayyid Jiddan', date: 'Sep 17', notes: 'Steady tempo control' },
    { week: 'W4', score: 93.8, grade: 'Jayyid Jiddan', date: 'Sep 24', notes: 'Clear improvement in Madd timing' },
    { week: 'W5', score: 94.6, grade: 'Jayyid Jiddan', date: 'Oct 1', notes: 'Consistent daily practice reflected' },
    { week: 'W6', score: 96.0, grade: 'Mumtaz (Honor)', date: 'Oct 8', notes: 'Crossed 95% Mumtaz distinction' },
    { week: 'W7', score: 97.2, grade: 'Mumtaz (Honor)', date: 'Oct 15', notes: 'Excellent Ghunnah & vocal projection' },
    { week: 'W8', score: 98.4, grade: 'Mumtaz (Top Honor)', date: 'Oct 22', notes: 'Flawless Sabaq recitation in Surah Yusuf' },
  ];

  const trajectoryData4w = trajectoryData8w.slice(4);
  const activeTrajectory = behaviorTimeframe === '4w' ? trajectoryData4w : trajectoryData8w;

  const tWidth = 520;
  const tHeight = 200;
  const tPadL = 40;
  const tPadR = 24;
  const tPadT = 24;
  const tPadB = 32;
  const tPlotW = tWidth - tPadL - tPadR;
  const tPlotH = tHeight - tPadT - tPadB;

  const minScore = 85;
  const maxScore = 100;

  const tStepX = tPlotW / (activeTrajectory.length - 1);
  const tPoints = activeTrajectory.map((d, i) => {
    const tx = tPadL + i * tStepX;
    const ty = tPadT + (1 - (d.score - minScore) / (maxScore - minScore)) * tPlotH;
    return { ...d, index: i, tx, ty };
  });

  const tSplinePath = tPoints.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.tx} ${pt.ty}`;
    const prev = arr[i - 1];
    const cpx = prev.tx + (pt.tx - prev.tx) / 2;
    return `${acc} C ${cpx} ${prev.ty}, ${cpx} ${pt.ty}, ${pt.tx} ${pt.ty}`;
  }, '');

  // Benchmarks
  const sanadLineY = tPadT + (1 - (90 - minScore) / (maxScore - minScore)) * tPlotH;
  const mumtazLineY = tPadT + (1 - (95 - minScore) / (maxScore - minScore)) * tPlotH;

  return (
    <div className="teacher-behavior-charts-container">
      {/* 1. Header Banner & Diagnostics Readout */}
      <div className="behavior-header-card">
        <div className="behavior-header-info">
          <div className="teacher-card-badge-row">
            <span className="badge-tajweed-gold">
              <Icon name="analytics" size={13} style={{ marginRight: 5 }} />
              STUDENT BEHAVIORAL TELEMETRY
            </span>
            <span className="badge-tajweed-emerald">
              <Icon name="check-circle" size={12} style={{ marginRight: 4 }} />
              Active Practice Streak: {streak} Days
            </span>
            <span className="badge-tajweed-neutral">
              Candidate #{studentId}
            </span>
          </div>

          <h2 className="behavior-title">
            Learning Behavior &amp; Recitation Analytics for {studentName}
          </h2>
          <p className="behavior-sub">
            In-depth behavioral tracking analyzing daily practice consistency, Hifz retention velocity (Sabaq vs Sabqi vs Manzil), phonetic mistake tendencies, and multi-week fluency trajectory.
          </p>
        </div>

        {/* Behavioral Highlights Pills */}
        <div className="behavior-summary-metrics">
          <div className="behavior-kpi-pill">
            <span className="kpi-pill-label">Weekly Practice</span>
            <span className="kpi-pill-val">{totalWeeklyHours} hrs</span>
            <span className="kpi-pill-sub">{daysTargetMet}/7 Days Met Target</span>
          </div>

          <div className="behavior-kpi-pill">
            <span className="kpi-pill-label">Punctuality</span>
            <span className="kpi-pill-val" style={{ color: '#047857' }}>98.5%</span>
            <span className="kpi-pill-sub">On-Time Attendance</span>
          </div>

          <div className="behavior-kpi-pill">
            <span className="kpi-pill-label">Homework Turn-In</span>
            <span className="kpi-pill-val" style={{ color: '#B45309' }}>95.0%</span>
            <span className="kpi-pill-sub">Audio Recordings</span>
          </div>
        </div>
      </div>

      {/* 2. Charts Grid Row 1: Weekly Practice Rhythm + Hifz Retention Velocity */}
      <div className="behavior-charts-grid-two">
        {/* CHART 1: Practice Rhythm & Habit Bar Chart */}
        <div className="admin-chart-card">
          <div className="chart-card-header">
            <div>
              <span className="chart-card-tag bg-emerald-subtle text-green">
                PRACTICE HABIT &amp; RHYTHM
              </span>
              <h3 className="chart-card-title">Daily Practice Consistency (Mon–Sun)</h3>
              <p className="chart-card-desc">
                Monitors daily practice duration to detect healthy everyday routines vs last-minute cramming before class.
              </p>
            </div>
            <div className="chart-legend-box">
              <span className="legend-chip">
                <span className="legend-box-color bg-green-solid" /> Actual Practice
              </span>
              <span className="legend-chip">
                <span className="legend-box-color bg-gold-dashed" /> 45m Daily Target
              </span>
            </div>
          </div>

          <div className="chart-svg-container">
            <svg
              viewBox={`0 0 ${pWidth} ${pHeight}`}
              className="analytics-svg"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Gridlines */}
              {[0, 20, 40, 60, 80].map((val) => {
                const y = pPadT + (1 - val / maxMins) * pPlotH;
                return (
                  <g key={val}>
                    <line
                      x1={pPadL}
                      y1={y}
                      x2={pWidth - pPadR}
                      y2={y}
                      stroke="#E2E8F0"
                      strokeDasharray="2,2"
                      strokeWidth={1}
                    />
                    <text
                      x={pPadL - 8}
                      y={y + 3}
                      textAnchor="end"
                      fontSize="9"
                      fill="#64748B"
                      fontWeight="600"
                    >
                      {val}m
                    </text>
                  </g>
                );
              })}

              {/* Target 45 min Line */}
              <line
                x1={pPadL}
                y1={targetLineY}
                x2={pWidth - pPadR}
                y2={targetLineY}
                stroke="#B8860B"
                strokeWidth={1.5}
                strokeDasharray="4,4"
              />
              <text
                x={pWidth - pPadR + 4}
                y={targetLineY + 3}
                fontSize="8.5"
                fontWeight="700"
                fill="#B8860B"
              >
                Target
              </text>

              {/* Daily Practice Bars */}
              {weeklyPracticeData.map((d, idx) => {
                const cx = pPadL + idx * pStepX + pStepX / 2;
                const barH = (d.minutes / maxMins) * pPlotH;
                const barY = pPadT + (pPlotH - barH);
                const isHovered = hoveredDayIndex === idx;
                const met = d.minutes >= d.target;

                return (
                  <g
                    key={d.day}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredDayIndex(idx)}
                    onMouseLeave={() => setHoveredDayIndex(null)}
                  >
                    {/* Hover Glow Background */}
                    {isHovered && (
                      <rect
                        x={cx - pBarW / 2 - 4}
                        y={pPadT}
                        width={pBarW + 8}
                        height={pPlotH}
                        fill="#F1F5F9"
                        rx={4}
                      />
                    )}

                    <rect
                      x={cx - pBarW / 2}
                      y={barY}
                      width={pBarW}
                      height={barH}
                      fill={met ? '#0D4A38' : '#D4AF37'}
                      rx={3}
                      opacity={isHovered ? 1 : 0.9}
                      style={{ transition: 'all 0.15s ease' }}
                    />

                    {/* Gold cap when target is exceeded */}
                    {met && (
                      <rect
                        x={cx - pBarW / 2}
                        y={barY}
                        width={pBarW}
                        height={3}
                        fill="#D4AF37"
                        rx={1}
                      />
                    )}

                    {/* Minutes value above bar */}
                    <text
                      x={cx}
                      y={barY - 6}
                      textAnchor="middle"
                      fontSize="9.5"
                      fontWeight="700"
                      fill={isHovered ? '#0D4A38' : '#475569'}
                    >
                      {d.minutes}m
                    </text>

                    {/* Day Label */}
                    <text
                      x={cx}
                      y={pHeight - 12}
                      textAnchor="middle"
                      fontSize="10"
                      fill={isHovered ? '#0D4A38' : '#64748B'}
                      fontWeight={isHovered ? '800' : '600'}
                    >
                      {d.day}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="chart-footer-stat-bar">
            {hoveredDayIndex !== null ? (
              <div className="hover-readout-row">
                <span className="hover-month-pill">
                  {weeklyPracticeData[hoveredDayIndex].fullDay}: {weeklyPracticeData[hoveredDayIndex].minutes} mins
                </span>
                <span className="hover-detail-stat">
                  <strong>Focus:</strong> {weeklyPracticeData[hoveredDayIndex].focus}
                </span>
                <span className={weeklyPracticeData[hoveredDayIndex].minutes >= 45 ? 'growth-positive-badge' : 'growth-warning-badge'}>
                  {weeklyPracticeData[hoveredDayIndex].type}
                </span>
              </div>
            ) : (
              <div className="default-readout-row">
                <span>
                  <strong>Routine Evaluation:</strong> Highly disciplined daily practice rhythm (Averaging 46.4 min/day)
                </span>
                <span className="growth-positive-badge">✓ Habit Verified</span>
              </div>
            )}
          </div>
        </div>

        {/* CHART 2: Hifz Retention Equilibrium (Sabaq vs Sabqi vs Manzil) */}
        <div className="admin-chart-card">
          <div className="chart-card-header">
            <div>
              <span className="chart-card-tag bg-gold-subtle text-gold">
                HIFZ RETENTION EQUILIBRIUM
              </span>
              <h3 className="chart-card-title">Sabaq vs Sabqi vs Manzil Velocity</h3>
              <p className="chart-card-desc">
                Balances new memorization (Sabaq) with short-term (Sabqi) and long-term (Manzil) revision to prevent forgotten Juz.
              </p>
            </div>
            <div className="chart-legend-box">
              <span className="legend-chip">
                <span className="legend-box-color bg-green-solid" /> Sabaq (New)
              </span>
              <span className="legend-chip">
                <span className="legend-box-color bg-gold-solid" /> Sabqi (Recent)
              </span>
              <span className="legend-chip">
                <span className="legend-box-color bg-blue-solid" /> Manzil (Old)
              </span>
            </div>
          </div>

          <div className="chart-svg-container">
            <svg
              viewBox={`0 0 ${bWidth} ${bHeight}`}
              className="analytics-svg"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Gridlines */}
              {[0, 10, 20, 30].map((val) => {
                const y = bPadT + (1 - val / maxPages) * bPlotH;
                return (
                  <g key={val}>
                    <line
                      x1={bPadL}
                      y1={y}
                      x2={bWidth - bPadR}
                      y2={y}
                      stroke="#E2E8F0"
                      strokeDasharray="2,2"
                      strokeWidth={1}
                    />
                    <text
                      x={bPadL - 8}
                      y={y + 3}
                      textAnchor="end"
                      fontSize="9"
                      fill="#64748B"
                      fontWeight="600"
                    >
                      {val}p
                    </text>
                  </g>
                );
              })}

              {/* Grouped Bar Sets for each week */}
              {hifzBalanceData.map((d, idx) => {
                const cx = bPadL + idx * bStepX + bStepX / 2;
                const isHovered = hoveredVelocityWeek === idx;

                const sabaqH = (d.sabaqPages / maxPages) * bPlotH;
                const sabaqY = bPadT + (bPlotH - sabaqH);

                const sabqiH = (d.sabqiPages / maxPages) * bPlotH;
                const sabqiY = bPadT + (bPlotH - sabqiH);

                const manzilH = (d.manzilPages / maxPages) * bPlotH;
                const manzilY = bPadT + (bPlotH - manzilH);

                const startX = cx - (miniBarW * 3 + 4) / 2;

                return (
                  <g
                    key={d.week}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredVelocityWeek(idx)}
                    onMouseLeave={() => setHoveredVelocityWeek(null)}
                  >
                    {/* Sabaq Bar (Emerald) */}
                    <rect
                      x={startX}
                      y={sabaqY}
                      width={miniBarW}
                      height={sabaqH}
                      fill="#0D4A38"
                      rx={2}
                      opacity={isHovered ? 1 : 0.9}
                    />

                    {/* Sabqi Bar (Gold) */}
                    <rect
                      x={startX + miniBarW + 2}
                      y={sabqiY}
                      width={miniBarW}
                      height={sabqiH}
                      fill="#D4AF37"
                      rx={2}
                      opacity={isHovered ? 1 : 0.9}
                    />

                    {/* Manzil Bar (Navy/Teal) */}
                    <rect
                      x={startX + (miniBarW + 2) * 2}
                      y={manzilY}
                      width={miniBarW}
                      height={manzilH}
                      fill="#1D4ED8"
                      rx={2}
                      opacity={isHovered ? 1 : 0.9}
                    />

                    {/* Week Label */}
                    <text
                      x={cx}
                      y={bHeight - 12}
                      textAnchor="middle"
                      fontSize="9.5"
                      fill={isHovered ? '#0D4A38' : '#64748B'}
                      fontWeight={isHovered ? '800' : '600'}
                    >
                      {d.week}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="chart-footer-stat-bar">
            {hoveredVelocityWeek !== null ? (
              <div className="hover-readout-row">
                <span className="hover-month-pill">
                  {hifzBalanceData[hoveredVelocityWeek].period}
                </span>
                <span className="hover-detail-stat">
                  Sabaq: <strong>{hifzBalanceData[hoveredVelocityWeek].sabaqPages}p</strong> • Sabqi: <strong>{hifzBalanceData[hoveredVelocityWeek].sabqiPages}p</strong> • Manzil: <strong>{hifzBalanceData[hoveredVelocityWeek].manzilPages}p</strong>
                </span>
                <span className="growth-positive-badge">
                  {hifzBalanceData[hoveredVelocityWeek].balanceScore}
                </span>
              </div>
            ) : (
              <div className="default-readout-row">
                <span>
                  <strong>Pedagogical Ratio:</strong> 1 Sabaq Page : 3 Sabqi Pages : 5 Manzil Pages (Golden Standard)
                </span>
                <span className="growth-positive-badge">✓ Equilibrium Maintained</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Charts Grid Row 2: Phonetic Error Tendency Donut + 8-Week Precision Curve */}
      <div className="behavior-charts-grid-two" style={{ marginTop: 20 }}>
        {/* CHART 3: Phonetic Error Vulnerability (Donut & Remedial Action) */}
        <div className="admin-chart-card">
          <div className="chart-card-header">
            <div>
              <span className="chart-card-tag bg-blue-subtle text-blue">
                PHONETIC BEHAVIOR PROFILE
              </span>
              <h3 className="chart-card-title">Tajweed Mistake Classification</h3>
              <p className="chart-card-desc">
                Categorizes recurring recitation slips to guide scholar feedback and tailor targeted drill sessions.
              </p>
            </div>
            <span className="total-students-badge" style={{ background: '#EFF6FF', color: '#1E40AF', borderColor: '#BFDBFE' }}>
              {totalErrors} Flagged Patterns
            </span>
          </div>

          <div className="donut-chart-layout">
            {/* SVG Donut */}
            <div className="donut-svg-wrapper">
              <svg viewBox="0 0 200 200" className="donut-svg">
                {donutSlices.map((slice) => {
                  const isHovered = hoveredErrorIndex === slice.index;
                  return (
                    <circle
                      key={slice.id}
                      cx="100"
                      cy="100"
                      r={dRadius}
                      fill="transparent"
                      stroke={slice.color}
                      strokeWidth={isHovered ? dStroke + 5 : dStroke}
                      strokeDasharray={slice.strokeDasharray}
                      strokeDashoffset={slice.strokeDashoffset}
                      style={{
                        cursor: 'pointer',
                        transform: 'rotate(-90deg)',
                        transformOrigin: '50% 50%',
                        transition: 'stroke-width 0.15s ease',
                      }}
                      onMouseEnter={() => setHoveredErrorIndex(slice.index)}
                      onMouseLeave={() => setHoveredErrorIndex(null)}
                    />
                  );
                })}

                {/* Center Cutout */}
                <circle cx="100" cy="100" r={dRadius - dStroke / 2 - 10} fill="#FFFFFF" />
                <text
                  x="100"
                  y="96"
                  textAnchor="middle"
                  fontFamily="var(--font-serif)"
                  fontSize="20"
                  fontWeight="700"
                  fill="#0D4A38"
                >
                  {hoveredErrorIndex !== null
                    ? `${errorDistribution[hoveredErrorIndex].pct}%`
                    : `${totalErrors}`}
                </text>
                <text
                  x="100"
                  y="112"
                  textAnchor="middle"
                  fontSize="9.5"
                  fontWeight="700"
                  fill="#64748B"
                  letterSpacing="0.4px"
                >
                  {hoveredErrorIndex !== null
                    ? `${errorDistribution[hoveredErrorIndex].count} MISTAKES`
                    : 'TOTAL RECURRING'}
                </text>
              </svg>
            </div>

            {/* Error Breakdown Legend & Remedy */}
            <div className="donut-legend-column">
              {errorDistribution.map((item, idx) => {
                const isHovered = hoveredErrorIndex === idx;
                return (
                  <div
                    key={item.id}
                    className={`donut-legend-item ${isHovered ? 'active' : ''}`}
                    onMouseEnter={() => setHoveredErrorIndex(idx)}
                    onMouseLeave={() => setHoveredErrorIndex(null)}
                  >
                    <div className="legend-indicator-dot" style={{ background: item.color }} />
                    <div className="legend-item-info">
                      <div className="legend-item-name-row">
                        <span className="legend-item-title">{item.label}</span>
                        <span className="legend-item-pct">{item.pct}%</span>
                      </div>
                      <div className="legend-item-sub">
                        <span>{item.description}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="chart-footer-stat-bar">
            {hoveredErrorIndex !== null ? (
              <div className="hover-readout-row">
                <span className="hover-month-pill" style={{ background: errorDistribution[hoveredErrorIndex].color }}>
                  {errorDistribution[hoveredErrorIndex].label}
                </span>
                <span className="hover-detail-stat">
                  <strong>Recommended Remedy:</strong> {errorDistribution[hoveredErrorIndex].remedy}
                </span>
              </div>
            ) : (
              <div className="default-readout-row">
                <span>
                  <strong>Top Intervention Priority:</strong> Focus on throat exit points [ع / ح] in Surah Yusuf
                </span>
                {onOpenQuran && (
                  <button
                    type="button"
                    className="btn-table-action"
                    onClick={() => onOpenQuran(studentId)}
                    style={{ padding: '3px 9px', fontSize: '11px', fontWeight: '700' }}
                  >
                    Open Annotator Marker →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* CHART 4: 8-Week Recitation Precision Curve */}
        <div className="admin-chart-card">
          <div className="chart-card-header">
            <div>
              <span className="chart-card-tag bg-emerald-subtle text-emerald">
                LONGITUDINAL MASTERY
              </span>
              <h3 className="chart-card-title">Recitation Fluency &amp; Accuracy Curve</h3>
              <p className="chart-card-desc">
                Multi-week precision trajectory tracking advancement from baseline placement up to Mumtaz distinction.
              </p>
            </div>

            <div className="analytics-header-actions">
              <div className="btn-group-timeframe">
                <button
                  type="button"
                  className={`btn-time-pill ${behaviorTimeframe === '4w' ? 'active' : ''}`}
                  onClick={() => setBehaviorTimeframe('4w')}
                >
                  Last 4 Weeks
                </button>
                <button
                  type="button"
                  className={`btn-time-pill ${behaviorTimeframe === '8w' ? 'active' : ''}`}
                  onClick={() => setBehaviorTimeframe('8w')}
                >
                  8 Weeks
                </button>
              </div>
            </div>
          </div>

          <div className="chart-svg-container">
            <svg
              viewBox={`0 0 ${tWidth} ${tHeight}`}
              className="analytics-svg"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Gridlines */}
              {[85, 90, 95, 100].map((val) => {
                const y = tPadT + (1 - (val - minScore) / (maxScore - minScore)) * tPlotH;
                return (
                  <g key={val}>
                    <line
                      x1={tPadL}
                      y1={y}
                      x2={tWidth - tPadR}
                      y2={y}
                      stroke="#E2E8F0"
                      strokeDasharray="2,2"
                      strokeWidth={1}
                    />
                    <text
                      x={tPadL - 8}
                      y={y + 3}
                      textAnchor="end"
                      fontSize="9"
                      fill="#64748B"
                      fontWeight="600"
                    >
                      {val}%
                    </text>
                  </g>
                );
              })}

              {/* 90% Sanad Baseline */}
              <line
                x1={tPadL}
                y1={sanadLineY}
                x2={tWidth - tPadR}
                y2={sanadLineY}
                stroke="#64748B"
                strokeWidth={1}
                strokeDasharray="3,3"
              />
              <text
                x={tWidth - tPadR + 4}
                y={sanadLineY + 3}
                fontSize="8"
                fontWeight="700"
                fill="#64748B"
              >
                90% Sanad
              </text>

              {/* 95% Mumtaz Honor Line */}
              <line
                x1={tPadL}
                y1={mumtazLineY}
                x2={tWidth - tPadR}
                y2={mumtazLineY}
                stroke="#D4AF37"
                strokeWidth={1.5}
                strokeDasharray="4,4"
              />
              <text
                x={tWidth - tPadR + 4}
                y={mumtazLineY + 3}
                fontSize="8"
                fontWeight="700"
                fill="#B8860B"
              >
                95% Mumtaz
              </text>

              {/* Spline Curve */}
              <path
                d={tSplinePath}
                fill="none"
                stroke="#0D4A38"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {tPoints.map((pt) => {
                const isHovered = hoveredWeekIndex === pt.index;
                return (
                  <g key={pt.index}>
                    <circle
                      cx={pt.tx}
                      cy={pt.ty}
                      r={isHovered ? 6 : 4}
                      fill="#FFFFFF"
                      stroke="#0D4A38"
                      strokeWidth={isHovered ? 3 : 2}
                      style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                      onMouseEnter={() => setHoveredWeekIndex(pt.index)}
                      onMouseLeave={() => setHoveredWeekIndex(null)}
                    />
                    <text
                      x={pt.tx}
                      y={pt.ty - 8}
                      textAnchor="middle"
                      fontSize="9.5"
                      fontWeight="800"
                      fill="#0D4A38"
                    >
                      {pt.score}%
                    </text>
                    <text
                      x={pt.tx}
                      y={tHeight - 12}
                      textAnchor="middle"
                      fontSize="9.5"
                      fill={isHovered ? '#0D4A38' : '#64748B'}
                      fontWeight={isHovered ? '800' : '600'}
                    >
                      {pt.week}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="chart-footer-stat-bar">
            {hoveredWeekIndex !== null ? (
              <div className="hover-readout-row">
                <span className="hover-month-pill">
                  {activeTrajectory[hoveredWeekIndex].week} ({activeTrajectory[hoveredWeekIndex].date}): {activeTrajectory[hoveredWeekIndex].score}%
                </span>
                <span className="hover-detail-stat">
                  <strong>Scholar Assessment:</strong> {activeTrajectory[hoveredWeekIndex].notes}
                </span>
                <span className="growth-positive-badge">
                  {activeTrajectory[hoveredWeekIndex].grade}
                </span>
              </div>
            ) : (
              <div className="default-readout-row">
                <span>
                  <strong>Current Trajectory:</strong> +9.9% gain over 8 weeks • Consistent upward trajectory
                </span>
                <span className="growth-positive-badge">↑ Exceptional Growth</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Scholar Advisory & Remedial Action Blueprint */}
      <div className="behavior-advisory-card">
        <div className="advisory-icon-box">
          <Icon name="award" size={24} color="#D4AF37" />
        </div>
        <div className="advisory-text-box">
          <h4 className="advisory-title">Scholar Pedagogical Recommendation</h4>
          <p className="advisory-body">
            <strong>{studentName}</strong> demonstrates outstanding attendance diligence (<strong>{streak}-day daily streak</strong>) and exceptional Sabaq acquisition velocity. To maximize long-term retention ahead of next month&apos;s Sanad review, allocate <strong>15 minutes of each session to Manzil Juz 1–3</strong> to solidify older Juz and eliminate minor Madd clipping before advancing to Surah Ibrahim.
          </p>
        </div>
        <div className="advisory-actions">
          <button
            type="button"
            className="btn-dash-primary-gold"
            onClick={() => alert(`Opening Sabaq Plan for ${studentName}...`)}
            style={{ fontSize: '12.5px', padding: '9px 16px' }}
          >
            <Icon name="check-circle-2" size={14} style={{ marginRight: 5 }} />
            Approve Hifz Schedule
          </button>
        </div>
      </div>
    </div>
  );
}
