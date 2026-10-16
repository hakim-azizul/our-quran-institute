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

  // Compact, executive chart dimensions (reduced height for better proportion)
  const svgWidth = 760;
  const svgHeight = 195;
  const paddingLeft = 44;
  const paddingRight = 44;
  const paddingTop = 24;
  const paddingBottom = 32;

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
  const barWidth = 18; // Sleek, refined bar width (not oversized)

  const points = activeDataset.map((d, i) => {
    const x = paddingLeft + i * stepX + stepX / 2;
    const barHeight = Math.max(4, (d.pages / maxPages) * chartHeight);
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
        background: '#FFFFFF',
        border: '1.5px solid #E6DEC9',
        borderRadius: '14px',
        padding: '16px 20px',
        boxShadow: '0 2px 8px rgba(13, 74, 56, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginTop: '16px',
      }}
    >
      {/* Chart Top Header & Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '7px',
              background: '#FDF8EC',
              border: '1.5px solid #D4AF37',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#B8860B',
            }}
          >
            <Icon name="activity" size={15} />
          </span>
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '17px',
                fontWeight: '700',
                color: '#0D4A38',
                margin: 0,
                lineHeight: '1.2',
              }}
            >
              Weekly Memorization &amp; Accuracy
            </h3>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>
              Pages memorized (solid gold bars) and Tajweed recitation score (solid emerald line).
            </p>
          </div>
        </div>

        {/* Legend & Filter Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {/* Legend with ONLY solid colors */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11.5px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span
                style={{
                  width: '12px',
                  height: '10px',
                  borderRadius: '2px',
                  background: '#D4AF37',
                  display: 'inline-block',
                }}
              />
              <span style={{ fontWeight: '600', color: '#1E293B' }}>Pages Read (Bar)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span
                style={{
                  width: '14px',
                  height: '3px',
                  background: '#0D4A38',
                  borderRadius: '2px',
                  display: 'inline-block',
                }}
              />
              <span style={{ fontWeight: '600', color: '#0D4A38' }}>Accuracy % (Line)</span>
            </div>
          </div>

          {/* Timeframe Toggle Buttons (Solid Gold active styling) */}
          <div
            style={{
              display: 'inline-flex',
              background: '#F8FAFC',
              borderRadius: '7px',
              padding: '2px',
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
                padding: '4px 10px',
                borderRadius: '5px',
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
                padding: '4px 10px',
                borderRadius: '5px',
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

      {/* SVG Combo Chart Visualization - Compact & Solid Golden */}
      <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '210px' }}
        >
          {/* Background Horizontal Grid Lines & Y-Axis */}
          {[0, 0.33, 0.66, 1].map((ratio, idx) => {
            const y = paddingTop + chartHeight * (1 - ratio);
            const valPages = Math.round(maxPages * ratio);
            const valAcc = Math.round(minAcc + (maxAcc - minAcc) * ratio);

            return (
              <g key={idx}>
                {/* Clean Solid Grid Line */}
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="#F1F5F9"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                {/* Left Y-Axis Label (Pages) */}
                <text
                  x={paddingLeft - 8}
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
                  x={svgWidth - paddingRight + 8}
                  y={y + 3.5}
                  textAnchor="start"
                  fontSize="10"
                  fontWeight="600"
                  fill="#0D4A38"
                >
                  {valAcc}%
                </text>
              </g>
            );
          })}

          {/* Render Bars (Pages Memorized - Pure Solid Gold) */}
          {points.map((p) => {
            const isHovered = hoveredIndex === p.index;

            return (
              <g
                key={`bar-${p.index}`}
                onMouseEnter={() => setHoveredIndex(p.index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Vertical hover strip */}
                {isHovered && (
                  <rect
                    x={p.x - stepX / 2}
                    y={paddingTop}
                    width={stepX}
                    height={chartHeight}
                    fill="#FDF8EC"
                    rx="4"
                  />
                )}

                {/* Bar (SOLID GOLDEN: #D4AF37, on hover: #B8860B) */}
                <rect
                  x={p.barX}
                  y={p.barY}
                  width={p.barWidth}
                  height={p.barHeight}
                  fill={isHovered ? '#B8860B' : '#D4AF37'}
                  rx="4"
                  ry="4"
                />

                {/* Page number badge over bar */}
                <text
                  x={p.x}
                  y={p.barY - 5}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="700"
                  fill={isHovered ? '#B8860B' : '#8C6819'}
                >
                  {p.pages}p
                </text>

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
                  y={paddingTop + chartHeight + 26}
                  textAnchor="middle"
                  fontSize="9.5"
                  fill="#94A3B8"
                >
                  {p.date}
                </text>
              </g>
            );
          })}

          {/* Render Line (Tajweed Accuracy % - Pure Solid Deep Emerald #0D4A38) */}
          <polyline
            points={polylinePoints}
            fill="none"
            stroke="#0D4A38"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Render Line Data Point Dots (Solid Colors: #D4AF37 and #FFFFFF) */}
          {points.map((p) => {
            const isHovered = hoveredIndex === p.index;

            return (
              <g
                key={`point-${p.index}`}
                onMouseEnter={() => setHoveredIndex(p.index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Point Node */}
                <circle
                  cx={p.x}
                  cy={p.lineY}
                  r={isHovered ? '5.5' : '3.8'}
                  fill={isHovered ? '#0D4A38' : '#FFFFFF'}
                  stroke={isHovered ? '#D4AF37' : '#0D4A38'}
                  strokeWidth="2"
                />

                {/* Compact Accuracy tooltip on hover */}
                {isHovered && (
                  <g>
                    <rect
                      x={p.x - 24}
                      y={p.lineY - 22}
                      width="48"
                      height="16"
                      rx="4"
                      fill="#0D4A38"
                    />
                    <text
                      x={p.x}
                      y={p.lineY - 10}
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

      {/* Sleek, Compact Footer Metric Strip (Solid Colors Only) */}
      <div
        style={{
          background: '#FAF8F3',
          border: '1px solid #EEDFB8',
          borderRadius: '8px',
          padding: '8px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          fontSize: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '4px',
              background: '#D4AF37',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: '700',
            }}
          >
            {activePoint.period}
          </span>
          <span style={{ color: '#475569' }}>
            Read: <strong style={{ color: '#B8860B' }}>{activePoint.pages} Pages</strong>
          </span>
          <span style={{ color: '#CBD5E1' }}>•</span>
          <span style={{ color: '#475569' }}>
            Tajweed Accuracy: <strong style={{ color: '#0D4A38' }}>{activePoint.accuracy}%</strong>
          </span>
          <span style={{ color: '#CBD5E1' }}>•</span>
          <span style={{ color: '#64748B' }}>
            Rating: <strong style={{ color: '#1E293B' }}>{activePoint.status}</strong>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11.5px', color: '#64748B' }}>
          <span>
            Period Average: <strong style={{ color: '#B8860B' }}>{avgPages} pages</strong>
          </span>
          <span style={{ color: '#CBD5E1' }}>•</span>
          <span>
            Avg Accuracy: <strong style={{ color: '#0D4A38' }}>{avgAccuracy}%</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
