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
        { label: 'W3', period: 'Week 3', date: 'Aug 29', pages: 9, accuracy: 91, status: 'Madd Rules Mastered' },
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
        { label: 'Aug', period: 'Aug 2026', date: 'Aug', pages: 42, accuracy: 92, status: 'Juz 5 Exam Passed' },
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

  // Chart Dimensions & Scales
  const svgWidth = 800;
  const svgHeight = 310;
  const paddingLeft = 55;
  const paddingRight = 55;
  const paddingTop = 35;
  const paddingBottom = 45;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Max Pages for Bar Scale
  const maxPages = timeframe === 'weekly' ? (isSecondStudent ? 20 : 25) : (isSecondStudent ? 60 : 75);
  // Accuracy Min/Max for Line Scale
  const minAcc = 70;
  const maxAcc = 100;

  // Coordinate calculations
  const numPoints = activeDataset.length;
  const stepX = chartWidth / numPoints;
  const barWidth = Math.min(38, stepX * 0.55);

  const points = activeDataset.map((d, i) => {
    const x = paddingLeft + i * stepX + stepX / 2;
    const barHeight = (d.pages / maxPages) * chartHeight;
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

  // Polyline coordinates for line chart
  const polylinePoints = points.map((p) => `${p.x},${p.lineY}`).join(' ');

  // SVG Area path under the line
  const areaPath = `M ${points[0].x},${paddingTop + chartHeight} L ${points
    .map((p) => `${p.x},${p.lineY}`)
    .join(' L ')} L ${points[points.length - 1].x},${paddingTop + chartHeight} Z`;

  // Summary Metrics
  const avgPages = Math.round(
    activeDataset.reduce((sum, d) => sum + d.pages, 0) / activeDataset.length
  );
  const avgAccuracy = (
    activeDataset.reduce((sum, d) => sum + d.accuracy, 0) / activeDataset.length
  ).toFixed(1);

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : points[points.length - 1];

  return (
    <div
      className="student-progress-combo-chart-card"
      style={{
        background: 'var(--color-white)',
        border: '1.5px solid var(--border-light)',
        borderRadius: '16px',
        padding: '24px 28px',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginTop: '20px',
      }}
    >
      {/* Chart Top Header & Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--color-green-surface)',
                border: '1px solid var(--color-gold-border)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-green-primary)',
              }}
            >
              <Icon name="activity" size={17} />
            </span>
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '22px',
                fontWeight: '700',
                color: 'var(--color-green-deep)',
                margin: 0,
              }}
            >
              Weekly Progress &amp; Accuracy
            </h3>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Track weekly pages read (bars) and Tajweed accuracy score (line).
          </p>
        </div>

        {/* Legend & Filter Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {/* Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '3px',
                  background: 'linear-gradient(180deg, #2E8B6D 0%, #0D4A38 100%)',
                  display: 'inline-block',
                }}
              />
              <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>Pages Read (Bar)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: '12px',
                  height: '3px',
                  background: '#C5A45A',
                  borderRadius: '2px',
                  display: 'inline-block',
                  position: 'relative',
                }}
              />
              <span style={{ fontWeight: '600', color: 'var(--color-gold-deep)' }}>Tajweed Accuracy % (Line)</span>
            </div>
          </div>

          {/* Timeframe Toggle Buttons */}
          <div
            style={{
              display: 'inline-flex',
              background: 'var(--bg-canvas)',
              borderRadius: '8px',
              padding: '3px',
              border: '1px solid var(--border-light)',
            }}
          >
            <button
              type="button"
              onClick={() => setTimeframe('weekly')}
              style={{
                border: 'none',
                background: timeframe === 'weekly' ? 'var(--color-green-primary)' : 'transparent',
                color: timeframe === 'weekly' ? '#FFFFFF' : 'var(--text-muted)',
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '12px',
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
                background: timeframe === 'monthly' ? 'var(--color-green-primary)' : 'transparent',
                color: timeframe === 'monthly' ? '#FFFFFF' : 'var(--text-muted)',
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '12px',
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

      {/* SVG Combo Chart Visualization */}
      <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ width: '100%', height: 'auto', display: 'block', minWidth: '600px' }}
        >
          <defs>
            {/* Bar Emerald Gradient */}
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2E8B6D" />
              <stop offset="100%" stopColor="#0D4A38" />
            </linearGradient>

            {/* Hovered Bar Gradient */}
            <linearGradient id="barGradientHover" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#15664F" />
            </linearGradient>

            {/* Line Gold Area Glow */}
            <linearGradient id="goldAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C5A45A" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#C5A45A" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Background Horizontal Grid Lines & Left Y-Axis (Pages) */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = paddingTop + chartHeight * (1 - ratio);
            const valPages = Math.round(maxPages * ratio);
            const valAcc = Math.round(minAcc + (maxAcc - minAcc) * ratio);

            return (
              <g key={idx}>
                {/* Grid Line */}
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                {/* Left Y-Axis Label (Pages) */}
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fontWeight="600"
                  fill="var(--text-muted)"
                >
                  {valPages}p
                </text>
                {/* Right Y-Axis Label (Accuracy %) */}
                <text
                  x={svgWidth - paddingRight + 10}
                  y={y + 4}
                  textAnchor="start"
                  fontSize="11"
                  fontWeight="600"
                  fill="#9F7C35"
                >
                  {valAcc}%
                </text>
              </g>
            );
          })}

          {/* Area fill under the Line */}
          <path d={areaPath} fill="url(#goldAreaGradient)" />

          {/* Render Bars (Pages Memorized) */}
          {points.map((p) => {
            const isHovered = hoveredIndex === p.index;

            return (
              <g
                key={`bar-${p.index}`}
                onMouseEnter={() => setHoveredIndex(p.index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Vertical hover guide strip */}
                {isHovered && (
                  <rect
                    x={p.x - stepX / 2}
                    y={paddingTop}
                    width={stepX}
                    height={chartHeight}
                    fill="rgba(13, 74, 56, 0.04)"
                    rx="4"
                  />
                )}

                {/* Bar */}
                <rect
                  x={p.barX}
                  y={p.barY}
                  width={p.barWidth}
                  height={p.barHeight}
                  fill={isHovered ? 'url(#barGradientHover)' : 'url(#barGradient)'}
                  rx="6"
                  ry="6"
                  style={{
                    transition: 'all 0.2s ease',
                    filter: isHovered ? 'drop-shadow(0 4px 8px rgba(13, 74, 56, 0.25))' : 'none',
                  }}
                />

                {/* Page number badge over bar */}
                <text
                  x={p.x}
                  y={p.barY - 8}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="700"
                  fill={isHovered ? 'var(--color-green-primary)' : 'var(--text-muted)'}
                >
                  {p.pages}p
                </text>

                {/* X-Axis Period Label */}
                <text
                  x={p.x}
                  y={paddingTop + chartHeight + 20}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight={isHovered ? '800' : '600'}
                  fill={isHovered ? 'var(--color-green-primary)' : 'var(--text-main)'}
                >
                  {p.label}
                </text>

                <text
                  x={p.x}
                  y={paddingTop + chartHeight + 34}
                  textAnchor="middle"
                  fontSize="10"
                  fill="var(--text-dim)"
                >
                  {p.date}
                </text>
              </g>
            );
          })}

          {/* Render Line (Tajweed Accuracy %) */}
          <polyline
            points={polylinePoints}
            fill="none"
            stroke="#D4AF37"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: 'drop-shadow(0 2px 6px rgba(197, 164, 90, 0.45))' }}
          />

          {/* Render Line Data Point Dots */}
          {points.map((p) => {
            const isHovered = hoveredIndex === p.index;

            return (
              <g
                key={`point-${p.index}`}
                onMouseEnter={() => setHoveredIndex(p.index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Outer Glow Ring on Hover */}
                {isHovered && (
                  <circle
                    cx={p.x}
                    cy={p.lineY}
                    r="10"
                    fill="rgba(212, 175, 55, 0.25)"
                  />
                )}

                {/* Point Node */}
                <circle
                  cx={p.x}
                  cy={p.lineY}
                  r={isHovered ? '6.5' : '4.5'}
                  fill="#FFFFFF"
                  stroke="#C5A45A"
                  strokeWidth={isHovered ? '3.5' : '2.5'}
                  style={{ transition: 'all 0.15s ease' }}
                />

                {/* Accuracy percentage pill on hover */}
                {isHovered && (
                  <g>
                    <rect
                      x={p.x - 22}
                      y={p.lineY - 26}
                      width="44"
                      height="18"
                      rx="4"
                      fill="#9F7C35"
                    />
                    <text
                      x={p.x}
                      y={p.lineY - 13}
                      textAnchor="middle"
                      fontSize="10.5"
                      fontWeight="800"
                      fill="#FFFFFF"
                    >
                      {p.accuracy}%
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating / Active Data Inspection Strip */}
      <div
        style={{
          background: 'var(--color-green-surface)',
          border: '1px solid var(--color-gold-border)',
          borderRadius: '12px',
          padding: '14px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'var(--color-green-primary)',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: '700',
            }}
          >
            {activePoint.period}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px' }}>
            <span>
              <strong>Read:</strong>{' '}
              <span style={{ color: 'var(--color-green-primary)', fontWeight: '800' }}>
                {activePoint.pages} Pages
              </span>
            </span>
            <span>•</span>
            <span>
              <strong>Accuracy:</strong>{' '}
              <span style={{ color: 'var(--color-gold-deep)', fontWeight: '800' }}>
                {activePoint.accuracy}%
              </span>
            </span>
            <span>•</span>
            <span style={{ color: 'var(--text-muted)' }}>
              Rating: <strong>{activePoint.status}</strong>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
          <span>
            Weekly Average: <strong style={{ color: 'var(--color-green-primary)' }}>{avgPages} pages</strong>
          </span>
          <span>•</span>
          <span>
            Avg Accuracy: <strong style={{ color: 'var(--color-gold-deep)' }}>{avgAccuracy}%</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
