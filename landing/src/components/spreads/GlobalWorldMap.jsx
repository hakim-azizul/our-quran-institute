import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../Icons';
import { WORLD_MAP_PATH, GLOBAL_HUBS } from './WorldMapData';

export default function GlobalWorldMap({ rightPageView = 'map', onToggleView }) {
  const [selectedHub, setSelectedHub] = useState(GLOBAL_HUBS[0]); // default UK
  const [hoveredHub, setHoveredHub] = useState(null);
  const pillsRowRef = useRef(null);
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
          {/* SVG Definitions for Luxury Golden Force / Light Beams & Glows */}
          <defs>
            {/* Luminous Golden Beam Gradient from Egypt */}
            <linearGradient id="goldBeamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C5A45A" stopOpacity="0.25" />
              <stop offset="40%" stopColor="#FFDF85" stopOpacity="0.9" />
              <stop offset="85%" stopColor="#FFF6D1" stopOpacity="1" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
            </linearGradient>

            {/* Golden Bloom Glow Filter */}
            <filter id="goldBeamBloom" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="5.5" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Egypt Radial Aura Beacon */}
            <radialGradient id="egyptRadialAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFE082" stopOpacity="0.9" />
              <stop offset="35%" stopColor="#D4AF37" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#D4AF37" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
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
                  const isActive = activeHub.id === hub.id;
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
                      const isActive = activeHub.id === hub.id;
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
                className={`solid-hub-group ${hub.isScholarsHub ? 'is-scholars-hub' : ''} ${isHighlighted ? 'active' : ''}`}
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
                    <circle r={isHighlighted ? 7.5 : 5.8} fill="#FFDF85" filter="drop-shadow(0 0 6px rgba(255, 223, 133, 0.9))" />
                    <polygon
                      points="0,-7 2,-2 7,0 2,2 0,7 -2,2 -7,0 -2,-2"
                      fill="#FFFFFF"
                      stroke="#C5A45A"
                      strokeWidth="0.8"
                    />
                    <circle r="2" fill="#061814" />
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
