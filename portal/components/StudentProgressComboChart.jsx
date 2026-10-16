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
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Dynamic datasets based on student
  const isSecondStudent = studentId === 'QI-STU-7721' || memorizedJuz < 10;

  const weeklyData = isSecondStudent
    ? [
        { label: 'W1', period: 'Week 1', date: 'Aug 15', pages: 8, accuracy: 88, status: 'Good Retention' },
        { label: 'W2', period: 'Week 2', date: 'Aug 22', pages: 10, accuracy: 89, status: 'Good Progress' },
        { label: 'W3', period: 'Week 3', date: 'Aug 29', pages: 9, accuracy: 91, status: 'Madd Mastered' },
        { label: 'W4', period: 'Week 4', date: 'Sep 05', pages: 12, accuracy: 92, status: 'Consistent Pace' },
        { label: 'W5', period: 'Week 5', date: 'Sep 12', pages: 11, accuracy: 90, status: 'Revision Focus' },
        { label: 'W6', period: 'Week 6', date: 'Sep 19', pages: 14, accuracy: 93, status: 'Surah Completed' },
        { label: 'W7', period: 'Week 7', date: 'Sep 26', pages: 13, accuracy: 94, status: 'Punctual & Fluent' },
        { label: 'W8', period: 'Week 8', date: 'Oct 03 (Current)', pages: 15, accuracy: 95, status: 'Mumtaz Recitation' },
      ]
    : [
        { label: 'W1', period: 'Week 1', date: 'Aug 15', pages: 12, accuracy: 91, status: 'Smooth Progression' },
        { label: 'W2', period: 'Week 2', date: 'Aug 22', pages: 15, accuracy: 93, status: 'Ghunnah Precision' },
        { label: 'W3', period: 'Week 3', date: 'Aug 29', pages: 14, accuracy: 94, status: 'Sabqi Cleared' },
        { label: 'W4', period: 'Week 4', date: 'Sep 05', pages: 18, accuracy: 95, status: 'Excellent Cadence' },
        { label: 'W5', period: 'Week 5', date: 'Sep 12', pages: 16, accuracy: 95, status: '100% Punctual' },
        { label: 'W6', period: 'Week 6', date: 'Sep 19', pages: 20, accuracy: 97, status: 'Surah Yusuf Milestone' },
        { label: 'W7', period: 'Week 7', date: 'Sep 26', pages: 17, accuracy: 96, status: 'Tajweed Mastery' },
        { label: 'W8', period: 'Week 8', date: 'Oct 03 (Current)', pages: 22, accuracy: 98, status: 'Mumtaz (Top Scholar Grade)' },
      ];

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

  // Proportional SVG canvas dimensions
  const svgWidth = 760;
  const svgHeight = 205;
  const paddingLeft = 46;
  const paddingRight = 46;
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
  // Substantial, refined bar width (occupies ~38% of step width, eliminating isolated needle look)
  const barWidth = Math.round(Math.min(32, Math.max(26, stepX * 0.38)));

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

      // Smooth C1-continuous control points
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

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : points[points.length - 1];

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
              Memorization volume (solid gold pillars) overlaid with Tajweed pronunciation accuracy (smooth emerald spline).
            </p>
          </div>
        </div>

        {/* Legend & Filter Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {/* Legend with ONLY solid colors */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
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
              <span style={{ fontWeight: '600', color: '#334155' }}>Pages Memorized</span>
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
              <span style={{ fontWeight: '600', color: '#0D4A38' }}>Accuracy % (Spline)</span>
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

      {/* SVG Combo Chart Visualization with Guide Tracks & Smooth Spline */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          overflowX: 'auto',
          background: '#FFFFFF',
          borderRadius: '10px',
        }}
      >
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '225px' }}
        >
          {/* Background Horizontal Grid Lines & Dual Y-Axes */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = paddingTop + chartHeight * (1 - ratio);
            const valPages = Math.round(maxPages * ratio);
            const valAcc = Math.round(minAcc + (maxAcc - minAcc) * ratio);

            return (
              <g key={`grid-${idx}`}>
                {/* Horizontal Solid Grid Line */}
                <line
                  x1={paddingLeft - 6}
                  y1={y}
                  x2={svgWidth - paddingRight + 6}
                  y2={y}
                  stroke="#F1F5F9"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                {/* Left Y-Axis Label (Pages Memorized) */}
                <text
                  x={paddingLeft - 10}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize="10"
                  fontWeight="600"
                  fill="#94A3B8"
                >
                  {valPages}p
                </text>
                {/* Right Y-Axis Label (Accuracy %) */}
                <text
                  x={svgWidth - paddingRight + 10}
                  y={y + 3.5}
                  textAnchor="start"
                  fontSize="10"
                  fontWeight="700"
                  fill="#0D4A38"
                >
                  {valAcc}%
                </text>
              </g>
            );
          })}

          {/* Column Guide Tracks (Grounds empty space with deliberate executive pillars) */}
          {points.map((p) => {
            const isHovered = hoveredIndex === p.index;

            return (
              <g
                key={`track-${p.index}`}
                onMouseEnter={() => setHoveredIndex(p.index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Subtle Pillar Track */}
                <rect
                  x={p.barX - 2}
                  y={paddingTop}
                  width={p.barWidth + 4}
                  height={chartHeight}
                  fill={isHovered ? '#FDF8EC' : '#F8FAFC'}
                  stroke={isHovered ? '#EEDFB8' : '#F1F5F9'}
                  strokeWidth="1"
                  rx="6"
                  ry="6"
                />

                {/* Solid Golden Progress Bar */}
                <rect
                  x={p.barX}
                  y={p.barY}
                  width={p.barWidth}
                  height={p.barHeight}
                  fill={isHovered ? '#B8860B' : '#D4AF37'}
                  rx="5"
                  ry="5"
                />

                {/* Page Number Label - Placed INSIDE the bar to completely eliminate collision with the line */}
                {p.barHeight >= 22 ? (
                  <text
                    x={p.x}
                    y={p.barY + 14}
                    textAnchor="middle"
                    fontSize="10"
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
                  y={paddingTop + chartHeight + 15}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight={isHovered ? '800' : '600'}
                  fill={isHovered ? '#0D4A38' : '#334155'}
                >
                  {p.label}
                </text>

                <text
                  x={p.x}
                  y={paddingTop + chartHeight + 27}
                  textAnchor="middle"
                  fontSize="9.5"
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
                {/* Node Outer Ring & Center */}
                <circle
                  cx={p.x}
                  cy={p.lineY}
                  r={isHovered ? '6' : '4'}
                  fill={isHovered ? '#0D4A38' : '#FFFFFF'}
                  stroke={isHovered ? '#D4AF37' : '#0D4A38'}
                  strokeWidth={isHovered ? '2.5' : '2'}
                />

                {/* Floating Precision Tooltip Badge on Hover */}
                {isHovered && (
                  <g>
                    <rect
                      x={p.x - 30}
                      y={p.lineY - 26}
                      width="60"
                      height="18"
                      rx="4"
                      fill="#0D4A38"
                      stroke="#D4AF37"
                      strokeWidth="1"
                    />
                    <text
                      x={p.x}
                      y={p.lineY - 13}
                      textAnchor="middle"
                      fontSize="10"
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

      {/* Smart Space KPI Matrix - Balanced 4-Card Executive Row (Solid Colors Only) */}
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
            Date: <strong style={{ color: '#0D4A38' }}>{activePoint.date}</strong>
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

