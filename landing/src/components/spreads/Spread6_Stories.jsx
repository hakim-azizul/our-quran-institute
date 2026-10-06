import React from 'react';
import GlobalWorldMap from './GlobalWorldMap';

export default function Spread6_Stories({ onNext }) {
  return (
    <div className="section-stories-container">
      {/* 1. Section Header */}
      <div className="stories-section-header">
        <div className="stories-header-left">
          <div className="section-label">
            <div className="label-rule" />
            <span className="label-text">GLOBAL FELLOWSHIP &bull; 42 COUNTRIES ACTIVE</span>
          </div>
          <h2 className="spread-heading">
            Global Sanctuary &amp;<br />
            Worldwide Corridors
          </h2>
          <p className="spread-desc">
            Live 1-on-1 recitation circles, sanad corridors, and scholarly guidance connecting students across 42 countries worldwide.
          </p>
        </div>
      </div>

      {/* 2. Main Content Stage: Full-Width Global World Map & Regional Hubs */}
      <div className="fullwidth-world-map-wrapper">
        <GlobalWorldMap />
      </div>
    </div>
  );
}
