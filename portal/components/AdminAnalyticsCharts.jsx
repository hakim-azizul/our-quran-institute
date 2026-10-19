'use client';

import React, { useState } from 'react';
import { Icon } from './Icons';

export default function AdminAnalyticsCharts({
  stats,
  financialAnalytics,
  attendanceAnalytics,
  usersList = [],
}) {
  const [hoveredGrowthIndex, setHoveredGrowthIndex] = useState(null);
  const [hoveredCourseIndex, setHoveredCourseIndex] = useState(null);
  const [hoveredFinanceIndex, setHoveredFinanceIndex] = useState(null);
  const [growthTimeframe, setGrowthTimeframe] = useState('6m'); // '6m' | '1y'

  // =========================================================================
  // DATASET 1: INSTITUTIONAL ENROLLMENT & SESSION VELOCITY (COMBO CHART)
  // =========================================================================
  const growthData6m = [
    { month: 'May', label: 'May 2026', enrollments: 14, sessions: 110, rate: '94%' },
    { month: 'Jun', label: 'Jun 2026', enrollments: 18, sessions: 132, rate: '95%' },
    { month: 'Jul', label: 'Jul 2026', enrollments: 22, sessions: 148, rate: '95%' },
    { month: 'Aug', label: 'Aug 2026', enrollments: 28, sessions: 164, rate: '96%' },
    { month: 'Sep', label: 'Sep 2026', enrollments: 34, sessions: 182, rate: '96%' },
    { month: 'Oct', label: 'Oct 2026', enrollments: 42, sessions: 198, rate: '97%' },
  ];

  const growthData1y = [
    { month: 'Nov', label: 'Nov 2025', enrollments: 8, sessions: 65, rate: '92%' },
    { month: 'Dec', label: 'Dec 2025', enrollments: 10, sessions: 78, rate: '93%' },
    { month: 'Jan', label: 'Jan 2026', enrollments: 12, sessions: 90, rate: '93%' },
    { month: 'Feb', label: 'Feb 2026', enrollments: 13, sessions: 98, rate: '94%' },
    { month: 'Mar', label: 'Mar 2026', enrollments: 14, sessions: 104, rate: '94%' },
    { month: 'Apr', label: 'Apr 2026', enrollments: 14, sessions: 108, rate: '94%' },
    { month: 'May', label: 'May 2026', enrollments: 14, sessions: 110, rate: '94%' },
    { month: 'Jun', label: 'Jun 2026', enrollments: 18, sessions: 132, rate: '95%' },
    { month: 'Jul', label: 'Jul 2026', enrollments: 22, sessions: 148, rate: '95%' },
    { month: 'Aug', label: 'Aug 2026', enrollments: 28, sessions: 164, rate: '96%' },
    { month: 'Sep', label: 'Sep 2026', enrollments: 34, sessions: 182, rate: '96%' },
    { month: 'Oct', label: 'Oct 2026', enrollments: 42, sessions: 198, rate: '97%' },
  ];

  const activeGrowthData = growthTimeframe === '6m' ? growthData6m : growthData1y;

  // Combo chart dimensions
  const cWidth = 560;
  const cHeight = 220;
  const cPadL = 44;
  const cPadR = 44;
  const cPadT = 28;
  const cPadB = 36;
  const plotW = cWidth - cPadL - cPadR;
  const plotH = cHeight - cPadT - cPadB;

  const maxEnroll = 50;
  const minSessions = 50;
  const maxSessions = 220;

  const nPoints = activeGrowthData.length;
  const stepX = plotW / nPoints;
  const barW = Math.round(Math.min(26, Math.max(14, stepX * 0.44)));

  const comboPoints = activeGrowthData.map((d, i) => {
    const cx = cPadL + i * stepX + stepX / 2;
    const barH = Math.max(6, (d.enrollments / maxEnroll) * plotH);
    const barY = cPadT + (plotH - barH);
    const lineY = cPadT + (1 - (d.sessions - minSessions) / (maxSessions - minSessions)) * plotH;

    return {
      ...d,
      index: i,
      cx,
      barX: cx - barW / 2,
      barY,
      barW,
      barH,
      lineY,
    };
  });

  // Generate smooth cubic bezier SVG path for the sessions trend line
  const splinePath = comboPoints.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.cx} ${pt.lineY}`;
    const prev = arr[i - 1];
    const cp1x = prev.cx + (pt.cx - prev.cx) / 2;
    const cp1y = prev.lineY;
    const cp2x = prev.cx + (pt.cx - prev.cx) / 2;
    const cp2y = pt.lineY;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pt.cx} ${pt.lineY}`;
  }, '');

  // =========================================================================
  // DATASET 2: COURSE TRACK & ENROLLMENT SHARE (DONUT CHART)
  // =========================================================================
  const coursesDistribution = [
    {
      id: 'hifz',
      title: 'Full Quran Hifz & Memorization',
      arabic: 'حِفْظُ القُرْآنِ الكَرِيم',
      studentsCount: 32,
      pct: 38,
      color: '#0D4A38',
      tuitionShare: '$2,080',
    },
    {
      id: 'tajweed-foundation',
      title: 'Tajweed Foundation & Recitation',
      arabic: 'أَسَاسِيَّاتُ التَّجْوِيد',
      studentsCount: 25,
      pct: 30,
      color: '#D4AF37',
      tuitionShare: '$1,625',
    },
    {
      id: 'makharij-advanced',
      title: 'Advanced Makharij & Sifaat',
      arabic: 'مَخَارِجُ الحُرُوفِ وَصِفَاتُهَا',
      studentsCount: 17,
      pct: 20,
      color: '#1D4ED8',
      tuitionShare: '$1,105',
    },
    {
      id: 'noorani-qaida',
      title: 'Noorani Qaida & Phonetics',
      arabic: 'القَاعِدَة النُّورَانِيَّة',
      studentsCount: 10,
      pct: 12,
      color: '#D97706',
      tuitionShare: '$650',
    },
  ];

  const totalCourseStudents = coursesDistribution.reduce((sum, c) => sum + c.studentsCount, 0);

  // SVG Donut Calculations
  const donutR = 82;
  const donutStroke = 26;
  const donutCircumference = 2 * Math.PI * donutR;

  let accumulatedDonutPct = 0;
  const donutSlices = coursesDistribution.map((item, idx) => {
    const strokeDasharray = `${(item.pct / 100) * donutCircumference} ${donutCircumference}`;
    const strokeDashoffset = -((accumulatedDonutPct / 100) * donutCircumference);
    accumulatedDonutPct += item.pct;

    return {
      ...item,
      index: idx,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  // =========================================================================
  // DATASET 3: WEEKLY RECITATION PRECISION BENCHMARK
  // =========================================================================
  const weeklyRecitationData = [
    { week: 'W1', period: 'Oct 1–7', accuracy: 91.2, mumtaz: 68, tests: 46 },
    { week: 'W2', period: 'Oct 8–14', accuracy: 93.6, mumtaz: 71, tests: 52 },
    { week: 'W3', period: 'Oct 15–21', accuracy: 95.1, mumtaz: 76, tests: 58 },
    { week: 'W4', period: 'Oct 22–28 (Peak)', accuracy: 96.8, mumtaz: 82, tests: 64 },
  ];

  const rWidth = 520;
  const rHeight = 180;
  const rPadL = 40;
  const rPadR = 30;
  const rPadT = 20;
  const rPadB = 30;
  const rPlotW = rWidth - rPadL - rPadR;
  const rPlotH = rHeight - rPadT - rPadB;

  const minR = 85;
  const maxR = 100;

  const rStepX = rPlotW / (weeklyRecitationData.length - 1);
  const rPoints = weeklyRecitationData.map((d, i) => {
    const rx = rPadL + i * rStepX;
    const ry = rPadT + (1 - (d.accuracy - minR) / (maxR - minR)) * rPlotH;
    return { ...d, rx, ry };
  });

  const rPath = rPoints.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.rx} ${pt.ry}`;
    const prev = arr[i - 1];
    const cpx = prev.rx + (pt.rx - prev.rx) / 2;
    return `${acc} C ${cpx} ${prev.ry}, ${cpx} ${pt.ry}, ${pt.rx} ${pt.ry}`;
  }, '');

  // Threshold 90% benchmark line
  const benchmarkY = rPadT + (1 - (90 - minR) / (maxR - minR)) * rPlotH;

  // =========================================================================
  // DATASET 4: FINANCIAL CASHFLOW (COLLECTIONS VS FACULTY PAYROLL)
  // =========================================================================
  const financeData = [
    {
      month: 'July 2026',
      short: 'Jul',
      revenue: 3450,
      payroll: 2420,
      reserve: 1030,
      efficiency: '92.5%',
    },
    {
      month: 'August 2026',
      short: 'Aug',
      revenue: 4120,
      payroll: 2890,
      reserve: 1230,
      efficiency: '93.8%',
    },
    {
      month: 'September 2026',
      short: 'Sep',
      revenue: 4680,
      payroll: 3210,
      reserve: 1470,
      efficiency: '95.4%',
    },
    {
      month: 'October 2026 (Current)',
      short: 'Oct',
      revenue: 5350,
      payroll: 3640,
      reserve: 1710,
      efficiency: '96.2%',
    },
  ];

  const maxFin = 6000;
  const fWidth = 520;
  const fHeight = 180;
  const fPadL = 46;
  const fPadR = 30;
  const fPadT = 20;
  const fPadB = 30;
  const fPlotW = fWidth - fPadL - fPadR;
  const fPlotH = fHeight - fPadT - fPadB;

  const fStepX = fPlotW / financeData.length;
  const fBarW = 18;

  return (
    <div className="admin-analytics-charts-section">
      {/* Section Header */}
      <div className="analytics-section-title-bar">
        <div>
          <div className="teacher-card-badge-row">
            <span className="badge-tajweed-gold">
              <Icon name="analytics" size={13} style={{ marginRight: 5 }} />
              EXECUTIVE TELEMETRY
            </span>
            <span className="badge-tajweed-emerald">Live Institutional Data</span>
            <span className="badge-tajweed-neutral">Academic Session 1447–1448 AH</span>
          </div>
          <h2 className="analytics-main-heading">
            Institutional Growth &amp; Academic Performance Charts
          </h2>
          <p className="analytics-main-sub">
            Multi-dimensional metrics tracking student enrollment velocity, faculty teaching volume, curriculum breakdown, and operating cashflow.
          </p>
        </div>

        <div className="analytics-header-actions">
          <div className="btn-group-timeframe">
            <button
              type="button"
              className={`btn-time-pill ${growthTimeframe === '6m' ? 'active' : ''}`}
              onClick={() => setGrowthTimeframe('6m')}
            >
              6 Months
            </button>
            <button
              type="button"
              className={`btn-time-pill ${growthTimeframe === '1y' ? 'active' : ''}`}
              onClick={() => setGrowthTimeframe('1y')}
            >
              12 Months
            </button>
          </div>
        </div>
      </div>

      {/* Grid Row 1: Combo Chart (Enrollment & Sessions) + Donut Chart (Course Distribution) */}
      <div className="analytics-charts-grid-two">
        {/* Chart 1: Combo Chart */}
        <div className="admin-chart-card">
          <div className="chart-card-header">
            <div>
              <span className="chart-card-tag bg-emerald-subtle text-green">ENROLLMENT &amp; SESSIONS</span>
              <h3 className="chart-card-title">Student Growth vs Faculty Teaching Volume</h3>
              <p className="chart-card-desc">
                Solid emerald pillars represent new student admissions; the gold spline represents verified 1-on-1 teaching sessions.
              </p>
            </div>
            <div className="chart-legend-box">
              <span className="legend-chip">
                <span className="legend-box-color bg-green-solid" /> New Students
              </span>
              <span className="legend-chip">
                <span className="legend-box-color bg-gold-solid" /> Classes Held
              </span>
            </div>
          </div>

          <div className="chart-svg-container">
            <svg
              viewBox={`0 0 ${cWidth} ${cHeight}`}
              className="analytics-svg"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Horizontal Reference Gridlines */}
              {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
                const y = cPadT + plotH * (1 - pct);
                const val = Math.round(maxEnroll * pct);
                return (
                  <g key={idx}>
                    <line
                      x1={cPadL}
                      y1={y}
                      x2={cWidth - cPadR}
                      y2={y}
                      stroke="#E2E8F0"
                      strokeDasharray={pct === 0 ? 'none' : '3,3'}
                      strokeWidth={1}
                    />
                    <text
                      x={cPadL - 8}
                      y={y + 3}
                      textAnchor="end"
                      fontSize="9.5"
                      fill="#64748B"
                      fontWeight="600"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Bar Pillars (New Student Admissions) */}
              {comboPoints.map((pt) => {
                const isHovered = hoveredGrowthIndex === pt.index;
                return (
                  <g
                    key={pt.index}
                    className="chart-bar-group"
                    onMouseEnter={() => setHoveredGrowthIndex(pt.index)}
                    onMouseLeave={() => setHoveredGrowthIndex(null)}
                  >
                    <rect
                      x={pt.barX}
                      y={pt.barY}
                      width={pt.barW}
                      height={pt.barH}
                      fill="#0D4A38"
                      rx={3}
                      className="svg-pillar-rect"
                      style={{
                        transition: 'opacity 0.15s ease',
                        opacity: isHovered ? 1 : 0.9,
                      }}
                    />
                    {/* Gold Cap Accent */}
                    <rect
                      x={pt.barX}
                      y={pt.barY}
                      width={pt.barW}
                      height={3}
                      fill="#D4AF37"
                      rx={1}
                    />
                    {/* Month Label */}
                    <text
                      x={pt.cx}
                      y={cHeight - 12}
                      textAnchor="middle"
                      fontSize="10"
                      fill={isHovered ? '#0D4A38' : '#64748B'}
                      fontWeight={isHovered ? '800' : '600'}
                    >
                      {pt.month}
                    </text>
                  </g>
                );
              })}

              {/* Sessions Trendline Spline */}
              <path
                d={splinePath}
                fill="none"
                stroke="#D4AF37"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Line Data Dots */}
              {comboPoints.map((pt) => {
                const isHovered = hoveredGrowthIndex === pt.index;
                return (
                  <g key={`dot-${pt.index}`}>
                    <circle
                      cx={pt.cx}
                      cy={pt.lineY}
                      r={isHovered ? 6 : 4}
                      fill="#FFFFFF"
                      stroke="#B8860B"
                      strokeWidth={isHovered ? 3 : 2}
                      style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                      onMouseEnter={() => setHoveredGrowthIndex(pt.index)}
                      onMouseLeave={() => setHoveredGrowthIndex(null)}
                    />
                    {isHovered && (
                      <text
                        x={pt.cx}
                        y={pt.lineY - 9}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="800"
                        fill="#0D4A38"
                      >
                        {pt.sessions}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Interactive Month Hover Inspection Card */}
          <div className="chart-footer-stat-bar">
            {hoveredGrowthIndex !== null ? (
              <div className="hover-readout-row">
                <span className="hover-month-pill">
                  {activeGrowthData[hoveredGrowthIndex].label}
                </span>
                <span className="hover-detail-stat">
                  Admissions: <strong>+{activeGrowthData[hoveredGrowthIndex].enrollments}</strong>
                </span>
                <span className="hover-detail-stat">
                  Classes Held: <strong>{activeGrowthData[hoveredGrowthIndex].sessions}</strong>
                </span>
                <span className="hover-detail-stat">
                  Attendance: <strong>{activeGrowthData[hoveredGrowthIndex].rate}</strong>
                </span>
              </div>
            ) : (
              <div className="default-readout-row">
                <span>
                  <strong>Overall Net Velocity:</strong> +42 Admissions in October • 198 Classes Completed
                </span>
                <span className="growth-positive-badge">↑ +28.4% YoY Growth</span>
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Course Distribution Donut */}
        <div className="admin-chart-card">
          <div className="chart-card-header">
            <div>
              <span className="chart-card-tag bg-gold-subtle text-gold">CURRICULUM BREAKDOWN</span>
              <h3 className="chart-card-title">Enrollment &amp; Program Share</h3>
              <p className="chart-card-desc">
                Proportion of active students enrolled across the four core Quranic instructional disciplines.
              </p>
            </div>
            <span className="total-students-badge">
              {totalCourseStudents} Active Learners
            </span>
          </div>

          <div className="donut-chart-layout">
            {/* SVG Donut */}
            <div className="donut-svg-wrapper">
              <svg viewBox="0 0 220 220" className="donut-svg">
                {donutSlices.map((slice) => {
                  const isHovered = hoveredCourseIndex === slice.index;
                  return (
                    <circle
                      key={slice.id}
                      cx="110"
                      cy="110"
                      r={donutR}
                      fill="transparent"
                      stroke={slice.color}
                      strokeWidth={isHovered ? donutStroke + 6 : donutStroke}
                      strokeDasharray={slice.strokeDasharray}
                      strokeDashoffset={slice.strokeDashoffset}
                      style={{
                        cursor: 'pointer',
                        transform: 'rotate(-90deg)',
                        transformOrigin: '50% 50%',
                        transition: 'stroke-width 0.15s ease',
                      }}
                      onMouseEnter={() => setHoveredCourseIndex(slice.index)}
                      onMouseLeave={() => setHoveredCourseIndex(null)}
                    />
                  );
                })}

                {/* Center Cutout Readout */}
                <circle cx="110" cy="110" r={donutR - donutStroke / 2 - 12} fill="#FFFFFF" />
                <text
                  x="110"
                  y="104"
                  textAnchor="middle"
                  fontFamily="var(--font-serif)"
                  fontSize="22"
                  fontWeight="700"
                  fill="#0D4A38"
                >
                  {hoveredCourseIndex !== null
                    ? `${coursesDistribution[hoveredCourseIndex].pct}%`
                    : `${totalCourseStudents}`}
                </text>
                <text
                  x="110"
                  y="122"
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="700"
                  fill="#64748B"
                  letterSpacing="0.4px"
                >
                  {hoveredCourseIndex !== null
                    ? `${coursesDistribution[hoveredCourseIndex].studentsCount} Students`
                    : 'TOTAL LEARNERS'}
                </text>
              </svg>
            </div>

            {/* Donut Legend */}
            <div className="donut-legend-column">
              {coursesDistribution.map((item, idx) => {
                const isHovered = hoveredCourseIndex === idx;
                return (
                  <div
                    key={item.id}
                    className={`donut-legend-item ${isHovered ? 'active' : ''}`}
                    onMouseEnter={() => setHoveredCourseIndex(idx)}
                    onMouseLeave={() => setHoveredCourseIndex(null)}
                  >
                    <div className="legend-indicator-dot" style={{ background: item.color }} />
                    <div className="legend-item-info">
                      <div className="legend-item-name-row">
                        <span className="legend-item-title">{item.title}</span>
                        <span className="legend-item-pct">{item.pct}%</span>
                      </div>
                      <div className="legend-item-sub">
                        <span>{item.studentsCount} Students</span>
                        <span>•</span>
                        <span>Tuition Yield: {item.tuitionShare}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Grid Row 2: Recitation Quality Benchmark + Financial Cashflow */}
      <div className="analytics-charts-grid-two" style={{ marginTop: 20 }}>
        {/* Chart 3: Weekly Recitation Quality Benchmark */}
        <div className="admin-chart-card">
          <div className="chart-card-header">
            <div>
              <span className="chart-card-tag bg-blue-subtle text-blue">ACADEMIC STANDARDS</span>
              <h3 className="chart-card-title">Recitation Quality &amp; Accuracy Curve</h3>
              <p className="chart-card-desc">
                Weekly phonetics precision rate across all student Sabaq submissions vs the 90% Sanad benchmark line.
              </p>
            </div>
            <div className="chart-legend-box">
              <span className="legend-chip">
                <span className="legend-box-color bg-green-solid" /> Student Accuracy
              </span>
              <span className="legend-chip">
                <span className="legend-box-color bg-gold-dashed" /> 90% Benchmark
              </span>
            </div>
          </div>

          <div className="chart-svg-container">
            <svg
              viewBox={`0 0 ${rWidth} ${rHeight}`}
              className="analytics-svg"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Gridlines */}
              {[85, 90, 95, 100].map((val) => {
                const y = rPadT + (1 - (val - minR) / (maxR - minR)) * rPlotH;
                return (
                  <g key={val}>
                    <line
                      x1={rPadL}
                      y1={y}
                      x2={rWidth - rPadR}
                      y2={y}
                      stroke="#E2E8F0"
                      strokeDasharray="2,2"
                      strokeWidth={1}
                    />
                    <text
                      x={rPadL - 8}
                      y={y + 3}
                      textAnchor="end"
                      fontSize="9.5"
                      fill="#64748B"
                      fontWeight="600"
                    >
                      {val}%
                    </text>
                  </g>
                );
              })}

              {/* 90% Benchmark Reference Line */}
              <line
                x1={rPadL}
                y1={benchmarkY}
                x2={rWidth - rPadR}
                y2={benchmarkY}
                stroke="#B8860B"
                strokeWidth={1.5}
                strokeDasharray="4,4"
              />
              <text
                x={rWidth - rPadR + 4}
                y={benchmarkY + 3}
                fontSize="8.5"
                fontWeight="700"
                fill="#B8860B"
              >
                Sanad Min
              </text>

              {/* Spline Path */}
              <path
                d={rPath}
                fill="none"
                stroke="#0D4A38"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {rPoints.map((pt, idx) => (
                <g key={idx}>
                  <circle
                    cx={pt.rx}
                    cy={pt.ry}
                    r={5}
                    fill="#FFFFFF"
                    stroke="#0D4A38"
                    strokeWidth={2.5}
                  />
                  <text
                    x={pt.rx}
                    y={pt.ry - 8}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="800"
                    fill="#0D4A38"
                  >
                    {pt.accuracy}%
                  </text>
                  <text
                    x={pt.rx}
                    y={rHeight - 10}
                    textAnchor="middle"
                    fontSize="9.5"
                    fill="#64748B"
                    fontWeight="600"
                  >
                    {pt.week}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="chart-footer-stat-bar">
            <div className="quality-breakdown-row">
              <span className="grade-chip grade-chip-mumtaz">
                Mumtaz: <strong>76% (Top Honor)</strong>
              </span>
              <span className="grade-chip grade-chip-jayyid">
                Jayyid Jiddan: <strong>18% (Very Good)</strong>
              </span>
              <span className="grade-chip grade-chip-revision">
                Revision Flagged: <strong>6%</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Chart 4: Monthly Financial Flow (Tuition vs Payroll) */}
        <div className="admin-chart-card">
          <div className="chart-card-header">
            <div>
              <span className="chart-card-tag bg-emerald-subtle text-emerald">FINANCIAL TELEMETRY</span>
              <h3 className="chart-card-title">Tuition Collected vs Faculty Payroll</h3>
              <p className="chart-card-desc">
                Comparison of collected student tuition (emerald) against disbursed scholar payroll (gold) by month.
              </p>
            </div>
            <div className="chart-legend-box">
              <span className="legend-chip">
                <span className="legend-box-color bg-green-solid" /> Tuition Collected
              </span>
              <span className="legend-chip">
                <span className="legend-box-color bg-gold-solid" /> Faculty Payroll
              </span>
            </div>
          </div>

          <div className="chart-svg-container">
            <svg
              viewBox={`0 0 ${fWidth} ${fHeight}`}
              className="analytics-svg"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Gridlines */}
              {[0, 2000, 4000, 6000].map((val) => {
                const y = fPadT + (1 - val / maxFin) * fPlotH;
                return (
                  <g key={val}>
                    <line
                      x1={fPadL}
                      y1={y}
                      x2={fWidth - fPadR}
                      y2={y}
                      stroke="#E2E8F0"
                      strokeDasharray="2,2"
                      strokeWidth={1}
                    />
                    <text
                      x={fPadL - 8}
                      y={y + 3}
                      textAnchor="end"
                      fontSize="9"
                      fill="#64748B"
                      fontWeight="600"
                    >
                      ${val / 1000}k
                    </text>
                  </g>
                );
              })}

              {/* Bar Pairs */}
              {financeData.map((item, idx) => {
                const centerX = fPadL + idx * fStepX + fStepX / 2;
                const revH = (item.revenue / maxFin) * fPlotH;
                const revY = fPadT + (fPlotH - revH);

                const payH = (item.payroll / maxFin) * fPlotH;
                const payY = fPadT + (fPlotH - payH);

                const isHovered = hoveredFinanceIndex === idx;

                return (
                  <g
                    key={idx}
                    onMouseEnter={() => setHoveredFinanceIndex(idx)}
                    onMouseLeave={() => setHoveredFinanceIndex(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Revenue Bar (Emerald) */}
                    <rect
                      x={centerX - fBarW - 2}
                      y={revY}
                      width={fBarW}
                      height={revH}
                      fill="#15664F"
                      rx={2}
                      opacity={isHovered ? 1 : 0.9}
                    />
                    {/* Payroll Bar (Gold) */}
                    <rect
                      x={centerX + 2}
                      y={payY}
                      width={fBarW}
                      height={payH}
                      fill="#B8860B"
                      rx={2}
                      opacity={isHovered ? 1 : 0.9}
                    />
                    {/* Month Label */}
                    <text
                      x={centerX}
                      y={fHeight - 10}
                      textAnchor="middle"
                      fontSize="10"
                      fill={isHovered ? '#0D4A38' : '#64748B'}
                      fontWeight={isHovered ? '800' : '600'}
                    >
                      {item.short}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="chart-footer-stat-bar">
            {hoveredFinanceIndex !== null ? (
              <div className="hover-readout-row">
                <span className="hover-month-pill">
                  {financeData[hoveredFinanceIndex].month}
                </span>
                <span className="hover-detail-stat">
                  Collected: <strong>${financeData[hoveredFinanceIndex].revenue}</strong>
                </span>
                <span className="hover-detail-stat">
                  Payroll: <strong>${financeData[hoveredFinanceIndex].payroll}</strong>
                </span>
                <span className="growth-positive-badge">
                  +${financeData[hoveredFinanceIndex].reserve} Surplus
                </span>
              </div>
            ) : (
              <div className="default-readout-row">
                <span>
                  <strong>October Position:</strong> $5,350 Collected vs $3,640 Disbursed
                </span>
                <span className="growth-positive-badge">+$1,710 Monthly Reserve</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
