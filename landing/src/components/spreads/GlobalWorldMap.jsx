import React, { useState } from 'react';
import { Icon } from '../Icons';
import { WORLD_MAP_PATH, GLOBAL_HUBS } from './WorldMapData';

export default function GlobalWorldMap({ rightPageView = 'map', onToggleView }) {
  const [selectedHub, setSelectedHub] = useState(GLOBAL_HUBS[0]); // default UK
  const [hoveredHub, setHoveredHub] = useState(null);

  const activeHub = hoveredHub || selectedHub;

  // Total summary tallies
  const totalStudents = GLOBAL_HUBS.reduce((acc, h) => acc + h.students, 0);
  const totalTeachers = GLOBAL_HUBS.reduce((acc, h) => acc + h.teachers, 0);
  const totalCircles = GLOBAL_HUBS.reduce((acc, h) => acc + h.circles, 0);

  return (
    <div className="global-world-map-wrapper fullpage-cartography">
      {/* Hero Maximized Map Stage */}
      <div className="cartographic-map-stage maximized fullpage">
        {/* 1. Integrated Floating Top Glass Header */}
        <div className="map-floating-top-hud">
          <div className="map-live-telemetry">
            <span className="live-pulse-badge">
              <span className="live-green-dot" />
              <span className="live-pulse-text">42 NATIONS ACTIVE</span>
            </span>
            <span className="map-stat-pill">
              <strong>{totalStudents.toLocaleString()}+</strong> Students · <strong>{totalTeachers}</strong> Scholars
            </span>
          </div>

          {onToggleView && (
            <div className="map-top-switch-pills">
              <button
                className={`map-switch-btn ${rightPageView === 'map' ? 'active' : ''}`}
                onClick={() => onToggleView('map')}
                title="World Map Mode"
              >
                <span>✦ World Map</span>
              </button>
              <button
                className={`map-switch-btn ${rightPageView === 'stories' ? 'active' : ''}`}
                onClick={() => onToggleView('stories')}
                title="Student Voices Mode"
              >
                <span>✦ Student Voices</span>
              </button>
            </div>
          )}
        </div>

        {/* 2. Celestial World Map SVG (viewBox tuned to populated continents, excluding Antarctic baseline) */}
        <svg
          viewBox="0 25 800 370"
          className="world-map-svg"
          aria-label="Global Student and Teacher Distribution Map"
        >
          <defs>
            {/* Rich deep ocean celestial gradient */}
            <radialGradient id="oceanGrad" cx="50%" cy="40%" r="80%">
              <stop offset="0%" stopColor="#0E483B" />
              <stop offset="45%" stopColor="#072B23" />
              <stop offset="85%" stopColor="#031A15" />
              <stop offset="100%" stopColor="#01100D" />
            </radialGradient>

            {/* Glowing gold filter for active pins and arcs */}
            <filter id="goldGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Radiant landmass gradient */}
            <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#256B5D" />
              <stop offset="45%" stopColor="#1B5549" />
              <stop offset="100%" stopColor="#124035" />
            </linearGradient>

            {/* Subtle drop shadow for continent landmass */}
            <filter id="landGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="rgba(255, 223, 133, 0.3)" />
            </filter>
          </defs>

          {/* Deep Ocean Celestial Background */}
          <rect x="0" y="25" width="800" height="370" fill="url(#oceanGrad)" />

          {/* Celestial Astrolabe Coordinate Grid */}
          <g className="map-graticules">
            {/* Arctic Circle */}
            <line x1="16" y1="75" x2="784" y2="75" className="graticule-line polar" />
            <text x="24" y="71" className="graticule-label">66.5° N</text>

            {/* Tropic of Cancer 23.5°N */}
            <line x1="16" y1="145" x2="784" y2="145" className="graticule-line tropic" />
            <text x="24" y="141" className="graticule-label">TROPIC OF CANCER 23.5° N</text>

            {/* Equator 0° */}
            <line x1="16" y1="220" x2="784" y2="220" className="graticule-line equator" />
            <text x="24" y="215" className="graticule-label equator-text">EQUATOR 0°</text>

            {/* Tropic of Capricorn 23.5°S */}
            <line x1="16" y1="295" x2="784" y2="295" className="graticule-line tropic" />
            <text x="24" y="291" className="graticule-label">TROPIC OF CAPRICORN 23.5° S</text>

            {/* Prime Meridian & Coordinates */}
            <line x1="395" y1="30" x2="395" y2="390" className="graticule-line meridian" />
            <text x="395" y="38" textAnchor="middle" className="graticule-label">PRIME MERIDIAN 0°</text>

            <line x1="200" y1="30" x2="200" y2="390" className="graticule-line" />
            <line x1="600" y1="30" x2="600" y2="390" className="graticule-line" />
          </g>

          {/* Highly Visible Continents Landmass */}
          <path
            d={WORLD_MAP_PATH}
            className="map-landmass"
            fill="url(#landGrad)"
            filter="url(#landGlow)"
          />

          {/* Radiating Golden Flight Arcs from Holy Sanctuaries (Makkah at 488, 172) */}
          <g className="connecting-arcs">
            {GLOBAL_HUBS.filter((h) => h.id !== 'sa').map((hub) => {
              const isActive = activeHub.id === hub.id;
              return (
                <path
                  key={`arc-${hub.id}`}
                  d={`M488,172 Q${(488 + hub.x) / 2},${Math.min(172, hub.y) - 45} ${hub.x},${hub.y}`}
                  className={`golden-arc ${isActive ? 'active-arc' : ''}`}
                />
              );
            })}
          </g>

          {/* Celestial Astrolabe / Compass Rose in South Pacific */}
          <g transform="translate(56, 355)" className="compass-rose" opacity="0.8">
            <circle cx="0" cy="0" r="14" fill="none" stroke="rgba(197, 164, 90, 0.4)" strokeWidth="1" strokeDasharray="2 3" />
            <circle cx="0" cy="0" r="10" fill="none" stroke="rgba(197, 164, 90, 0.6)" strokeWidth="0.8" />
            <polygon points="0,-12 2.5,-2.5 12,0 2.5,2.5 0,12 -2.5,2.5 -12,0 -2.5,-2.5" fill="rgba(197, 164, 90, 0.35)" />
            <polygon points="0,-12 0,0 -2.5,-2.5" fill="#FFE082" />
            <polygon points="12,0 0,0 2.5,-2.5" fill="#C5A45A" />
            <polygon points="0,12 0,0 2.5,2.5" fill="#FFE082" />
            <polygon points="-12,0 0,0 -2.5,2.5" fill="#C5A45A" />
            <circle cx="0" cy="0" r="2" fill="#FFE082" />
            <text x="0" y="-15" textAnchor="middle" fontSize="6.5" fill="#FFE082" fontWeight="bold">N</text>
          </g>

          {/* Interactive Global Hub Pins & Clean Micro-Pill Country Tags */}
          {GLOBAL_HUBS.map((hub) => {
            const isSelected = selectedHub.id === hub.id;
            const isHovered = hoveredHub && hoveredHub.id === hub.id;
            const isHighlighted = isSelected || isHovered;

            const shortLabel = hub.shortName || hub.name.split(' ')[0];
            const labelText = `${hub.flag} ${shortLabel}`;
            const labelWidth = shortLabel.length * 6.8 + 26;

            // In SVG, compute vertical tag offset directly in coordinates so CSS never overrides translateX
            const tagY = hub.y - (isHighlighted ? 15 : 12);

            return (
              <g
                key={hub.id}
                className={`hub-marker-group ${isHighlighted ? 'is-active' : ''}`}
                onClick={() => setSelectedHub(hub)}
                onMouseEnter={() => setHoveredHub(hub)}
                onMouseLeave={() => setHoveredHub(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Outer Pulsing Beacon Radar Ring */}
                <circle
                  cx={hub.x}
                  cy={hub.y}
                  r={isHighlighted ? 20 : 11}
                  className={`marker-pulse ${isHighlighted ? 'active-pulse' : ''}`}
                />

                {/* Secondary Glow Ring */}
                <circle
                  cx={hub.x}
                  cy={hub.y}
                  r={isHighlighted ? 10 : 6}
                  fill={isHighlighted ? 'rgba(255, 224, 130, 0.45)' : 'rgba(197, 164, 90, 0.3)'}
                />

                {/* Core Radiant Pin Node */}
                {hub.isScholarsHub ? (
                  /* Holy Sanctuaries Geometric Star Marker */
                  <g transform={`translate(${hub.x}, ${hub.y})`}>
                    <circle r={isHighlighted ? 7 : 5.5} fill="#FFDF85" filter="url(#goldGlow)" />
                    <polygon
                      points="0,-7 1.8,-1.8 7,0 1.8,1.8 0,7 -1.8,1.8 -7,0 -1.8,-1.8"
                      fill="#FFF9E6"
                      stroke="#C5A45A"
                      strokeWidth="0.8"
                    />
                    <circle r="2" fill="#04261F" />
                  </g>
                ) : (
                  <circle
                    cx={hub.x}
                    cy={hub.y}
                    r={isHighlighted ? 5.5 : 4.2}
                    fill={isHighlighted ? '#FFFFFF' : '#FFD566'}
                    stroke="#031713"
                    strokeWidth="1.8"
                    filter={isHighlighted ? 'url(#goldGlow)' : undefined}
                  />
                )}

                {/* High-Contrast Modern Micro-Pill Tag */}
                <g
                  transform={`translate(${hub.x}, ${tagY})`}
                  className={`hub-pill-tag-group ${isHighlighted ? 'is-active' : ''}`}
                >
                  <rect
                    x={-(labelWidth / 2)}
                    y="-9"
                    width={labelWidth}
                    height="16"
                    rx="8"
                    className={`hub-label-bg ${isHighlighted ? 'active' : ''}`}
                  />
                  <text
                    x="0"
                    y="1"
                    textAnchor="middle"
                    className={`hub-map-label ${isHighlighted ? 'active' : ''}`}
                  >
                    {labelText}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* 3. Consolidated Floating Glass Telemetry & Quick-Switch Dock */}
        <div className="map-floating-bottom-hud">
          {/* Tier A: Active Hub Detail Row */}
          <div className="hub-hud-header">
            <div className="hub-hud-brand">
              <span className="hub-hud-flag">{activeHub.flag}</span>
              <div className="hub-hud-info">
                <div className="hub-hud-name-row">
                  <h4 className="hub-hud-name">{activeHub.name}</h4>
                  <span className="hub-hud-tz">{activeHub.timezones}</span>
                </div>
                <span className="hub-hud-cities">{activeHub.cities}</span>
              </div>
            </div>

            <div className="hub-hud-stats-group">
              <div className="hud-stat-pill gold">
                <Icon name="book-open" size={13} color="#062A24" />
                <span className="hud-val">{activeHub.students}</span>
                <span className="hud-lbl">Students</span>
              </div>
              <div className="hud-stat-pill green">
                <Icon name="shield-check" size={13} color="#FFD566" />
                <span className="hud-val">{activeHub.teachers}</span>
                <span className="hud-lbl">Scholars</span>
              </div>
              <div className="hud-stat-pill parchment">
                <Icon name="sparkles" size={13} color="#0D4B3E" />
                <span className="hud-val">{activeHub.circles}</span>
                <span className="hud-lbl">Halqahs</span>
              </div>
            </div>

            <div className="hub-hud-surah">
              <span className="surah-kicker">FOCUS SURAHS</span>
              <span className="surah-text">{activeHub.surahFocus}</span>
            </div>
          </div>

          {/* Subtle Hairline Gold Divider */}
          <div className="hud-dock-divider" />

          {/* Tier B: Country Quick-Switch Dock */}
          <div className="map-integrated-country-dock">
            <span className="dock-label">HUBS:</span>
            <div className="country-pills-scroll">
              {GLOBAL_HUBS.map((hub) => (
                <button
                  key={hub.id}
                  className={`country-dock-pill ${selectedHub.id === hub.id ? 'active' : ''}`}
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
    </div>
  );
}
