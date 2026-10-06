import React, { useState, useRef, useEffect } from 'react';
import { WORLD_MAP_PATH, GLOBAL_HUBS } from './WorldMapData';

export default function GlobalWorldMap({ rightPageView = 'map', onToggleView }) {
  const [selectedHub, setSelectedHub] = useState(null); // No country selected by default
  const [hoveredHub, setHoveredHub] = useState(null);
  const mapContainerRef = useRef(null);

  // Scroll detection: runs animation only one time per section visit
  const [isInView, setIsInView] = useState(false);
  const [animCycle, setAnimCycle] = useState(0);

  useEffect(() => {
    const el = mapContainerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            setAnimCycle((prev) => prev + 1); // Trigger fresh 1-time sequence on each visit
          } else {
            setIsInView(false);
          }
        });
      },
      {
        threshold: 0.25,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const activeHub = hoveredHub || selectedHub;

  // Total summary tallies
  const totalStudents = GLOBAL_HUBS.reduce((acc, h) => acc + h.students, 0);
  const totalTeachers = GLOBAL_HUBS.reduce((acc, h) => acc + h.teachers, 0);

  return (
    <div className="modern-world-map-container" ref={mapContainerRef}>
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
      </div>

      {/* 2. Modern Solid-Color World Map SVG (Expanded Viewport & Clean Vector Styling) */}
      <div className="map-svg-viewport">
        <svg
          viewBox="15 25 770 380"
          className="solid-world-map-svg"
          aria-label="Global Student and Mentor Distribution Map"
        >
          {/* SVG Definitions for Luxury Golden Force / Light Beams & Glows */}
          <defs>
            {/* Luminous Ocean Gradient */}
            <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F9FAF7" />
              <stop offset="100%" stopColor="#EDF5ED" />
            </linearGradient>

            {/* Luminous Golden Beam Gradient from Egypt */}
            <linearGradient id="goldBeamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C5A45A" stopOpacity="0.3" />
              <stop offset="40%" stopColor="#A87D24" stopOpacity="0.85" />
              <stop offset="85%" stopColor="#7A5812" stopOpacity="1" />
              <stop offset="100%" stopColor="#4A3408" stopOpacity="1" />
            </linearGradient>

            {/* Golden Bloom Glow Filter */}
            <filter id="goldBeamBloom" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="4.0" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Egypt Radial Aura Beacon */}
            <radialGradient id="egyptRadialAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#C5A45A" stopOpacity="0.45" />
              <stop offset="40%" stopColor="#C5A45A" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#C5A45A" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Solid Ocean Background */}
          <rect x="15" y="25" width="770" height="380" rx="20" className="map-ocean-bg" />

          {/* Solid Continents Landmass (Clean, Sharp, Modern, Solid Color) */}
          <path
            d={WORLD_MAP_PATH}
            className="solid-map-landmass"
          />

          {/* Egypt Scholar Sanctuary Waves & Halo */}
          {(() => {
            const scholarsHub = GLOBAL_HUBS.find((h) => h.isScholarsHub) || GLOBAL_HUBS.find((h) => h.id === 'eg') || GLOBAL_HUBS[0];
            return (
              <g className="egypt-sanctuary-radiation" pointerEvents="none">
                {/* Golden ambient aura */}
                <circle
                  cx={scholarsHub.x}
                  cy={scholarsHub.y}
                  r="32"
                  fill="url(#egyptRadialAura)"
                  className="egypt-ambient-aura"
                />
                {/* 3 Concentric ripples of golden light emanating across continents (runs 1 time per section visit) */}
                {isInView && (
                  <g key={`egypt-ripples-${animCycle}`}>
                    <circle cx={scholarsHub.x} cy={scholarsHub.y} className="egypt-ripple-wave ripple-1" />
                    <circle cx={scholarsHub.x} cy={scholarsHub.y} className="egypt-ripple-wave ripple-2" />
                    <circle cx={scholarsHub.x} cy={scholarsHub.y} className="egypt-ripple-wave ripple-3" />
                  </g>
                )}
              </g>
            );
          })()}

          {/* Golden Light Force Arcs & Animated Beams from Egypt to World Hubs */}
          {(() => {
            const scholarsHub = GLOBAL_HUBS.find((h) => h.isScholarsHub) || GLOBAL_HUBS.find((h) => h.id === 'eg') || GLOBAL_HUBS[0];
            // UAE ('ae') is excluded so it does not get golden beam highlight
            const destHubs = GLOBAL_HUBS.filter((h) => h.id !== scholarsHub.id && h.id !== 'ae');

            const HUB_TIMINGS = {
              eu: { dur: 2.0, delay: 0.2 },
              uk: { dur: 2.3, delay: 0.5 },
              us: { dur: 2.8, delay: 0.9 },
              ca: { dur: 3.1, delay: 1.3 },
              my: { dur: 2.6, delay: 1.1 },
              au: { dur: 3.4, delay: 1.6 }
            };

            return (
              <g className="golden-connecting-system">
                {/* Always-visible subtle resting cartographic filaments */}
                {destHubs.map((hub) => {
                  const isActive = activeHub?.id === hub.id;
                  const ox = scholarsHub.x;
                  const oy = scholarsHub.y;
                  const tx = hub.x;
                  const ty = hub.y;
                  const midX = (ox + tx) / 2;

                  let arch = 32;
                  if (hub.id === 'us') arch = 58;
                  else if (hub.id === 'ca') arch = 64;
                  else if (hub.id === 'uk') arch = 40;
                  else if (hub.id === 'eu') arch = 30;
                  else if (hub.id === 'my') arch = 26;
                  else if (hub.id === 'au') arch = 20;

                  const midY = Math.min(oy, ty) - arch;
                  const arcD = `M${ox},${oy} Q${midX},${midY} ${tx},${ty}`;

                  return (
                    <path
                      key={`golden-filament-${hub.id}`}
                      d={arcD}
                      className={`golden-arc-filament ${isActive ? 'is-active' : ''}`}
                    />
                  );
                })}

                {/* Animated light streams, photon comets & impact pulses (runs 1 time when scrolled into view) */}
                {isInView && (
                  <g key={`golden-anim-system-${animCycle}`} className="golden-dynamic-pulses">
                    {destHubs.map((hub) => {
                      const isActive = activeHub?.id === hub.id;
                      const ox = scholarsHub.x;
                      const oy = scholarsHub.y;
                      const tx = hub.x;
                      const ty = hub.y;
                      const midX = (ox + tx) / 2;

                      let arch = 32;
                      if (hub.id === 'us') arch = 58;
                      else if (hub.id === 'ca') arch = 64;
                      else if (hub.id === 'uk') arch = 40;
                      else if (hub.id === 'eu') arch = 30;
                      else if (hub.id === 'my') arch = 26;
                      else if (hub.id === 'au') arch = 20;

                      const midY = Math.min(oy, ty) - arch;
                      const arcD = `M${ox},${oy} Q${midX},${midY} ${tx},${ty}`;
                      const timing = HUB_TIMINGS[hub.id] || { dur: 2.6, delay: 0.5 };

                      return (
                        <g key={`golden-active-beam-${hub.id}`} className={`beam-group ${isActive ? 'is-active' : ''}`}>
                          {/* Layer 2: Radiant Golden Light Stream (Flows from Egypt outward once) */}
                          <path
                            d={arcD}
                            pathLength="100"
                            className={`golden-light-stream ${isActive ? 'is-active' : ''}`}
                            style={{
                              animationDuration: `${timing.dur}s`,
                              animationDelay: `${timing.delay}s`
                            }}
                          />

                          {/* Layer 3: Travelling Golden Light Force / Comet Head (Photon) - travels once then dissolves */}
                          <g pointerEvents="none" opacity="0">
                            <animate
                              attributeName="opacity"
                              values="0; 1; 1; 0"
                              keyTimes="0; 0.1; 0.9; 1"
                              dur={`${timing.dur}s`}
                              begin={`${timing.delay}s`}
                              fill="freeze"
                            />
                            <circle r={isActive ? 6 : 4} className="golden-photon-halo">
                              <animateMotion
                                path={arcD}
                                dur={`${timing.dur}s`}
                                begin={`${timing.delay}s`}
                                repeatCount="1"
                                fill="freeze"
                              />
                            </circle>
                            <circle r={isActive ? 3.5 : 2.4} className="golden-photon-core">
                              <animateMotion
                                path={arcD}
                                dur={`${timing.dur}s`}
                                begin={`${timing.delay}s`}
                                repeatCount="1"
                                fill="freeze"
                              />
                            </circle>
                          </g>

                          {/* Layer 4: Destination Country Impact Reception Wave - pulses once upon arrival */}
                          <circle
                            cx={hub.x}
                            cy={hub.y}
                            className="golden-dest-pulse"
                            pointerEvents="none"
                            style={{
                              animationDuration: '1.4s',
                              animationDelay: `${timing.delay + timing.dur * 0.82}s`
                            }}
                          />
                        </g>
                      );
                    })}
                  </g>
                )}
              </g>
            );
          })()}

          {/* Always-visible active highlighted beam when a hub is clicked or hovered */}
          {(() => {
            const scholarsHub = GLOBAL_HUBS.find((h) => h.isScholarsHub) || GLOBAL_HUBS.find((h) => h.id === 'eg') || GLOBAL_HUBS[0];
            if (activeHub && activeHub.id !== scholarsHub.id) {
              const ox = scholarsHub.x;
              const oy = scholarsHub.y;
              const tx = activeHub.x;
              const ty = activeHub.y;
              const midX = (ox + tx) / 2;
              let arch = 32;
              if (activeHub.id === 'us') arch = 58;
              else if (activeHub.id === 'ca') arch = 64;
              else if (activeHub.id === 'uk') arch = 40;
              else if (activeHub.id === 'eu') arch = 30;
              else if (activeHub.id === 'my') arch = 26;
              else if (activeHub.id === 'au') arch = 20;

              const midY = Math.min(oy, ty) - arch;
              const arcD = `M${ox},${oy} Q${midX},${midY} ${tx},${ty}`;

              return (
                <g className="highlighted-corridor-beam" pointerEvents="none">
                  {/* Outer Golden Glow */}
                  <path
                    d={arcD}
                    fill="none"
                    stroke="#C5A45A"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    opacity="0.65"
                    filter="url(#goldBeamBloom)"
                  />
                  {/* Inner Solid Luminous Line */}
                  <path
                    d={arcD}
                    fill="none"
                    stroke="#8C6718"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  {/* Destination Pulse Wave */}
                  <circle
                    cx={activeHub.x}
                    cy={activeHub.y}
                    r="18"
                    fill="none"
                    stroke="#8C6718"
                    strokeWidth="1.8"
                    className="active-corridor-pulse"
                  />
                </g>
              );
            }
            return null;
          })()}

          {/* Interactive Global Hub Pins & Clean Solid Micro-Pills */}
          {GLOBAL_HUBS.map((hub) => {
            const isSelected = selectedHub?.id === hub.id;
            const isHovered = hoveredHub && hoveredHub.id === hub.id;
            const isHighlighted = isSelected || isHovered;

            const shortLabel = hub.shortName || hub.name.split(' ')[0];
            const labelText = `${hub.flag} ${shortLabel}`;
            const labelWidth = shortLabel.length * 7.2 + 28;
            const tagY = hub.y - (isHighlighted ? 16 : 13);

            return (
              <g
                key={hub.id}
                className={`solid-hub-group ${hub.isScholarsHub ? 'is-scholars-hub' : ''} ${isHighlighted ? 'active' : ''}`}
                onClick={() => setSelectedHub((prev) => (prev?.id === hub.id ? null : hub))}
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
                    <circle r={isHighlighted ? 7.5 : 5.8} fill="#C5A45A" filter="drop-shadow(0 2px 6px rgba(140, 103, 24, 0.45))" />
                    <polygon
                      points="0,-7 2,-2 7,0 2,2 0,7 -2,2 -7,0 -2,-2"
                      fill="#FFFFFF"
                      stroke="#8C6F2D"
                      strokeWidth="0.8"
                    />
                    <circle r="2" fill="#122E1F" />
                  </g>
                ) : (
                  <circle
                    cx={hub.x}
                    cy={hub.y}
                    r={isHighlighted ? 5.5 : 4}
                    fill={isHighlighted ? '#122F1E' : '#C5A45A'}
                    stroke="#FFFFFF"
                    strokeWidth="1.8"
                    filter="drop-shadow(0 2px 4px rgba(10, 36, 18, 0.25))"
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
                    className={`solid-tag-rect ${hub.isScholarsHub ? 'scholars-tag-rect' : ''} ${isHighlighted ? 'active' : ''}`}
                  />
                  <text
                    x="0"
                    y="2.5"
                    textAnchor="middle"
                    className={`solid-tag-text ${hub.isScholarsHub ? 'scholars-tag-text' : ''} ${isHighlighted ? 'active' : ''}`}
                  >
                    {labelText}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 3. Interactive Hub Metrics & Country Count Deck Below Map */}
      <div className="map-hub-counts-section">
        <div className="hub-counts-header">
          <div className="hub-counts-title-group">
            <span className="hub-counts-kicker">REGIONAL TRANSMISSION HUBS</span>
            <h4 className="hub-counts-heading">Active Students &amp; Scholars Across Corridors</h4>
          </div>
          <span className="hub-counts-instruction">
            <span>✦ Click or hover any hub to highlight corridor on map</span>
          </span>
        </div>

        {/* Global Summary Metric Pills */}
        <div className="global-metrics-strip">
          <div className="global-metric-pill">
            <span className="metric-val">{totalStudents.toLocaleString()}+</span>
            <span className="metric-lbl">Active Students</span>
          </div>
          <div className="global-metric-pill">
            <span className="metric-val">{totalTeachers}+</span>
            <span className="metric-lbl">Al-Azhar Scholars</span>
          </div>
          <div className="global-metric-pill">
            <span className="metric-val">42</span>
            <span className="metric-lbl">Countries Active</span>
          </div>
          <div className="global-metric-pill">
            <span className="metric-val">100%</span>
            <span className="metric-lbl">Live 1-on-1 Sessions</span>
          </div>
        </div>

        {/* Regional Hub Cards Grid */}
        <div className="hub-cards-grid">
          {GLOBAL_HUBS.map((hub) => {
            const isSelected = selectedHub?.id === hub.id;
            const isHovered = hoveredHub && hoveredHub.id === hub.id;
            const isHighlighted = isSelected || isHovered;

            return (
              <div
                key={hub.id}
                className={`hub-count-card ${isHighlighted ? 'is-highlighted active' : ''} ${hub.isScholarsHub ? 'is-sanctuary-hub' : ''}`}
                onClick={() => setSelectedHub((prev) => (prev?.id === hub.id ? null : hub))}
                onMouseEnter={() => setHoveredHub(hub)}
                onMouseLeave={() => setHoveredHub(null)}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
              >
                <div className="hub-flag-name">
                  <span className="hub-card-flag">{hub.flag}</span>
                  <span className="hub-card-name">{hub.name.split('(')[0].trim()}</span>
                </div>

                <div className="hub-stat-right">
                  <span className="card-stat-count">{hub.students.toLocaleString()}+</span>
                  {hub.isScholarsHub ? (
                    <span className="hub-badge-sanctuary">Sanad Hub</span>
                  ) : (
                    <span className={`hub-live-pulse-dot ${isHighlighted ? 'active' : ''}`} title="Active Corridor" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Hub Spotlight Bar */}
        {activeHub && (
          <div className="selected-hub-spotlight-bar">
            <div className="spotlight-left">
              <span className="spotlight-pin-icon">{activeHub.flag}</span>
              <div className="spotlight-text-group">
                <div className="spotlight-title-row">
                  <strong className="spotlight-hub-title">{activeHub.name}</strong>
                  <span className="spotlight-sub-pill">{activeHub.students} Students Enrolled &bull; {activeHub.teachers} Al-Azhar Instructors</span>
                </div>
                <p className="spotlight-desc">
                  {activeHub.quote || `Comprehensive Quran recitation, memorization, and tajweed study circles with dedicated scheduling.`}
                </p>
              </div>
            </div>
            <div className="spotlight-right">
              <button
                type="button"
                className="spotlight-focus-btn"
                onClick={() => setSelectedHub(activeHub)}
              >
                <span>Corridor Active</span>
                <span className="spotlight-arrow">↗</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
