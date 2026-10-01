import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../Icons';
import { WORLD_MAP_PATH, GLOBAL_HUBS } from './WorldMapData';

export default function GlobalWorldMap({ rightPageView = 'map', onToggleView }) {
  const [selectedHub, setSelectedHub] = useState(GLOBAL_HUBS[0]); // default UK
  const [hoveredHub, setHoveredHub] = useState(null);
  const pillsRowRef = useRef(null);

  const activeHub = hoveredHub || selectedHub;

  // Total summary tallies
  const totalStudents = GLOBAL_HUBS.reduce((acc, h) => acc + h.students, 0);
  const totalTeachers = GLOBAL_HUBS.reduce((acc, h) => acc + h.teachers, 0);

  // Smooth mouse-wheel horizontal scroll for regions dock
  useEffect(() => {
    const el = pillsRowRef.current;
    if (!el) return;
    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  // Smooth click & drag to scroll for mouse users
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - (pillsRowRef.current?.offsetLeft || 0);
    scrollLeftStart.current = pillsRowRef.current?.scrollLeft || 0;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || !pillsRowRef.current) return;
    e.preventDefault();
    const x = e.pageX - pillsRowRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    pillsRowRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  return (
    <div className="modern-world-map-container">
      {/* 1. Modern Clean Floating Top Header */}
      <div className="map-top-bar">
        <div className="map-telemetry-badge">
          <span className="live-dot-indicator" />
          <span className="live-badge-label">42 NATIONS ACTIVE</span>
          <span className="telemetry-separator">/</span>
          <span className="telemetry-summary">
            <strong>{totalStudents.toLocaleString()}+</strong> Students &bull; <strong>{totalTeachers}</strong> Scholars Worldwide
          </span>
        </div>

        {onToggleView && (
          <div className="map-view-pills">
            <button
              className={`view-pill-btn ${rightPageView === 'map' ? 'active' : ''}`}
              onClick={() => onToggleView('map')}
            >
              <span>✦ World Map</span>
            </button>
            <button
              className={`view-pill-btn ${rightPageView === 'stories' ? 'active' : ''}`}
              onClick={() => onToggleView('stories')}
            >
              <span>✦ Student Voices</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Modern Solid-Color World Map SVG (Expanded Viewport & Clean Vector Styling) */}
      <div className="map-svg-viewport">
        <svg
          viewBox="15 25 770 380"
          className="solid-world-map-svg"
          aria-label="Global Student and Mentor Distribution Map"
        >
          {/* Solid Ocean Background */}
          <rect x="15" y="25" width="770" height="380" rx="20" className="map-ocean-bg" />

          {/* Solid Continents Landmass (Clean, Sharp, Modern, Solid Color) */}
          <path
            d={WORLD_MAP_PATH}
            className="solid-map-landmass"
          />

          {/* Minimalist Solid Flight Arcs from Makkah (488, 172) */}
          <g className="solid-connecting-arcs">
            {GLOBAL_HUBS.filter((h) => h.id !== 'sa').map((hub) => {
              const isActive = activeHub.id === hub.id;
              return (
                <path
                  key={`arc-${hub.id}`}
                  d={`M488,172 Q${(488 + hub.x) / 2},${Math.min(172, hub.y) - 40} ${hub.x},${hub.y}`}
                  className={`solid-flight-arc ${isActive ? 'is-active' : ''}`}
                />
              );
            })}
          </g>

          {/* Interactive Global Hub Pins & Clean Solid Micro-Pills */}
          {GLOBAL_HUBS.map((hub) => {
            const isSelected = selectedHub.id === hub.id;
            const isHovered = hoveredHub && hoveredHub.id === hub.id;
            const isHighlighted = isSelected || isHovered;

            const shortLabel = hub.shortName || hub.name.split(' ')[0];
            const labelText = `${hub.flag} ${shortLabel}`;
            const labelWidth = shortLabel.length * 7.2 + 28;
            const tagY = hub.y - (isHighlighted ? 16 : 13);

            return (
              <g
                key={hub.id}
                className={`solid-hub-group ${isHighlighted ? 'active' : ''}`}
                onClick={() => setSelectedHub(hub)}
                onMouseEnter={() => setHoveredHub(hub)}
                onMouseLeave={() => setHoveredHub(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Clean Radar Ripple */}
                <circle
                  cx={hub.x}
                  cy={hub.y}
                  r={isHighlighted ? 18 : 10}
                  className={`solid-hub-radar ${isHighlighted ? 'radar-active' : ''}`}
                />

                {/* Inner Anchor Ring */}
                <circle
                  cx={hub.x}
                  cy={hub.y}
                  r={isHighlighted ? 8 : 5}
                  className="solid-hub-ring"
                />

                {/* Solid Pin Node */}
                {hub.isScholarsHub ? (
                  /* Holy Sanctuaries Star Node */
                  <g transform={`translate(${hub.x}, ${hub.y})`}>
                    <circle r={isHighlighted ? 6.5 : 5} fill="#FFDF85" />
                    <polygon
                      points="0,-6 1.6,-1.6 6,0 1.6,1.6 0,6 -1.6,1.6 -6,0 -1.6,-1.6"
                      fill="#FFFFFF"
                      stroke="#C5A45A"
                      strokeWidth="0.8"
                    />
                    <circle r="1.8" fill="#061814" />
                  </g>
                ) : (
                  <circle
                    cx={hub.x}
                    cy={hub.y}
                    r={isHighlighted ? 5.5 : 4}
                    fill={isHighlighted ? '#FFFFFF' : '#FFDF85'}
                    stroke="#061814"
                    strokeWidth="1.6"
                  />
                )}

                {/* Solid Modern High-Contrast Pill Tag */}
                <g transform={`translate(${hub.x}, ${tagY})`} className="solid-hub-tag">
                  <rect
                    x={-(labelWidth / 2)}
                    y="-9"
                    width={labelWidth}
                    height="18"
                    rx="9"
                    className={`solid-tag-rect ${isHighlighted ? 'active' : ''}`}
                  />
                  <text
                    x="0"
                    y="2.5"
                    textAnchor="middle"
                    className={`solid-tag-text ${isHighlighted ? 'active' : ''}`}
                  >
                    {labelText}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 3. Modern Clean Telemetry & Quick-Switch Hub Dock */}
      <div className="map-bottom-dock">
        {/* Active Selected Hub Card */}
        <div className="active-hub-card">
          <div className="active-hub-header">
            <span className="active-hub-flag">{activeHub.flag}</span>
            <div className="active-hub-meta">
              <div className="active-hub-name-row">
                <h4 className="active-hub-name">{activeHub.name}</h4>
                <span className="active-hub-tz">{activeHub.timezones}</span>
              </div>
              <span className="active-hub-cities">{activeHub.cities}</span>
            </div>
          </div>

          <div className="active-hub-metrics">
            <div className="hub-metric-pill">
              <Icon name="book-open" size={13} color="#C5A45A" />
              <span className="metric-val">{activeHub.students}</span>
              <span className="metric-lbl">Students</span>
            </div>
            <div className="hub-metric-pill">
              <Icon name="shield-check" size={13} color="#10B981" />
              <span className="metric-val">{activeHub.teachers}</span>
              <span className="metric-lbl">Scholars</span>
            </div>
            <div className="hub-metric-pill">
              <Icon name="sparkles" size={13} color="#FFDF85" />
              <span className="metric-val">{activeHub.circles}</span>
              <span className="metric-lbl">Halqahs</span>
            </div>
          </div>

          <div className="active-hub-focus">
            <span className="focus-label">FOCUS:</span>
            <span className="focus-text">{activeHub.surahFocus}</span>
          </div>
        </div>

        {/* Quick Country Hubs Switcher Bar (Invisible Scrollbar) */}
        <div className="country-hubs-switcher">
          <div className="switcher-label-group">
            <span className="switcher-title">SELECT REGION:</span>
          </div>

          <div
            ref={pillsRowRef}
            className="switcher-pills-row"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {GLOBAL_HUBS.map((hub) => (
              <button
                key={hub.id}
                className={`hub-switch-pill ${selectedHub.id === hub.id ? 'is-selected' : ''}`}
                onClick={() => setSelectedHub(hub)}
              >
                <span className="pill-flag">{hub.flag}</span>
                <span className="pill-name">{hub.shortName || hub.name.split(' ')[0]}</span>
                <span className="pill-count">{hub.students}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
