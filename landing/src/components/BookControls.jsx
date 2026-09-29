import React from 'react';
import { Icon } from './Icons';

export default function BookControls({
  currentSpread,
  totalSpreads,
  spreadTitles,
  onPrev,
  onNext,
  onGoToSpread
}) {
  return (
    <div className="book-controls-bar">
      {/* Prev Button */}
      <button
        className={`book-nav-btn ${currentSpread === 0 ? 'disabled' : ''}`}
        onClick={onPrev}
        disabled={currentSpread === 0}
        aria-label="Previous Page"
      >
        <Icon name="arrow-left" size={18} color={currentSpread === 0 ? '#50665F' : '#062A24'} />
        <span className="btn-text">Previous</span>
      </button>

      {/* Center Spread Selector & Scrubber */}
      <div className="spread-indicator-container">
        <div className="spread-title-text">
          <span className="spread-number">
            Spread {String(currentSpread).padStart(2, '0')} / {String(totalSpreads - 1).padStart(2, '0')}
          </span>
          <span className="spread-divider">•</span>
          <span className="spread-name">{spreadTitles[currentSpread]}</span>
        </div>

        <div className="spread-dots">
          {Array.from({ length: totalSpreads }).map((_, idx) => (
            <button
              key={idx}
              className={`spread-dot ${idx === currentSpread ? 'active' : ''}`}
              onClick={() => onGoToSpread(idx)}
              title={`${idx}: ${spreadTitles[idx]}`}
              aria-label={`Go to spread ${idx}`}
            />
          ))}
        </div>
      </div>

      {/* Next Button */}
      <button
        className={`book-nav-btn ${currentSpread === totalSpreads - 1 ? 'disabled' : ''}`}
        onClick={onNext}
        disabled={currentSpread === totalSpreads - 1}
        aria-label="Next Page"
      >
        <span className="btn-text">Turn Page</span>
        <Icon name="arrow-right" size={18} color={currentSpread === totalSpreads - 1 ? '#50665F' : '#062A24'} />
      </button>
    </div>
  );
}
