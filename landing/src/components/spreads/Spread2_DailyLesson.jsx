import React, { useState } from 'react';
import { Icon } from '../Icons';

export default function Spread2_DailyLesson({ onNext, side = 'both' }) {
  const [completedSteps, setCompletedSteps] = useState([true, false, false, false]);

  const toggleStep = (index) => {
    const updated = [...completedSteps];
    updated[index] = !updated[index];
    setCompletedSteps(updated);
  };

  const progressPercent = Math.round(
    (completedSteps.filter(Boolean).length / completedSteps.length) * 100
  );

  const leftContent = (
    <div className="spread-page spread-page-left lesson-explanation">
      <div className="lesson-copy">
        <div className="section-label">
          <div className="label-rule" />
          <span className="label-text">DAILY RHYTHM</span>
        </div>

        <h2 className="spread-heading">
          Everything you need<br />
          for today, on one<br />
          quiet page.
        </h2>

        <p className="spread-desc">
          No overwhelming dashboards. Just one quiet, intentional workspace designed for deep focus and barakah.
        </p>
      </div>

      <div className="lesson-benefits">
        <div className="benefit-item">
          <div className="benefit-badge">
            <Icon name="audio-lines" size={21} color="#FFDF85" />
          </div>
          <div className="benefit-copy">
            <h4 className="benefit-title">Audio Flow</h4>
            <p className="benefit-desc">Pure reciter audio with instant loop & speed controls.</p>
          </div>
        </div>

        <div className="benefit-item">
          <div className="benefit-badge">
            <Icon name="repeat-2" size={21} color="#FFDF85" />
          </div>
          <div className="benefit-copy">
            <h4 className="benefit-title">Micro-Loops</h4>
            <p className="benefit-desc">Bite-sized verse sets to lock muscle memory naturally.</p>
          </div>
        </div>

        <div className="benefit-item">
          <div className="benefit-badge">
            <Icon name="timer" size={21} color="#FFDF85" />
          </div>
          <div className="benefit-copy">
            <h4 className="benefit-title">15-Min Habit</h4>
            <p className="benefit-desc">Sustainable daily portions that protect against fatigue.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const rightContent = (
    <div className="spread-page spread-page-right lesson-workspace">
      <div className="daily-lesson-card">
        <div className="lesson-card-header">
          <div className="lesson-header-text">
            <span className="lesson-kicker">TODAY'S PRACTICE</span>
            <h3 className="lesson-title">Surah Al-Mulk: 1-5</h3>
          </div>
          <div className="lesson-status-badge">
            <span>ACTIVE</span>
          </div>
        </div>

        <div className="progress-summary">
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progressPercent}%`, transition: 'width 0.4s ease' }}
            />
          </div>
          <span className="progress-value">{progressPercent}%</span>
        </div>

        <div
          className={`lesson-step-row ${completedSteps[0] ? 'active' : ''}`}
          onClick={() => toggleStep(0)}
          style={{ cursor: 'pointer' }}
        >
          <div className={`step-check-badge ${completedSteps[0] ? 'completed' : ''}`}>
            <Icon name="check" size={18} color={completedSteps[0] ? '#FFDF85' : 'rgba(243, 233, 211, 0.45)'} />
          </div>
          <div className="step-info">
            <h4 className="step-row-title">Recite Ayah 1-3 with Ustadha</h4>
            <span className="step-row-detail">Pronunciation verified • 0 hesitations</span>
          </div>
          <span className="step-row-time">4m</span>
        </div>

        <div
          className={`lesson-step-row ${completedSteps[1] ? 'active' : ''}`}
          onClick={() => toggleStep(1)}
          style={{ cursor: 'pointer' }}
        >
          <div className={`step-check-badge ${completedSteps[1] ? 'completed' : ''}`}>
            <Icon name="book-open" size={18} color={completedSteps[1] ? '#FFDF85' : 'rgba(243, 233, 211, 0.45)'} />
          </div>
          <div className="step-info">
            <h4 className="step-row-title">Explore vocabulary & tafsir</h4>
            <span className="step-row-detail">Key root words: تَبَارَكَ • الْمُلْكُ</span>
          </div>
          <span className="step-row-time">5m</span>
        </div>

        <div
          className={`lesson-step-row ${completedSteps[2] ? 'active' : ''}`}
          onClick={() => toggleStep(2)}
          style={{ cursor: 'pointer' }}
        >
          <div className={`step-check-badge ${completedSteps[2] ? 'completed' : ''}`}>
            <Icon name="link-2" size={18} color={completedSteps[2] ? '#FFDF85' : 'rgba(243, 233, 211, 0.45)'} />
          </div>
          <div className="step-info">
            <h4 className="step-row-title">Connect verses into rhythm</h4>
            <span className="step-row-detail">Recite seamlessly without pausing</span>
          </div>
          <span className="step-row-time">3m</span>
        </div>

        <div
          className={`lesson-step-row ${completedSteps[3] ? 'active' : ''}`}
          onClick={() => toggleStep(3)}
          style={{ cursor: 'pointer' }}
        >
          <div className={`step-check-badge ${completedSteps[3] ? 'completed' : ''}`}>
            <Icon name="mic" size={18} color={completedSteps[3] ? '#FFDF85' : 'rgba(243, 233, 211, 0.45)'} />
          </div>
          <div className="step-info">
            <h4 className="step-row-title">Record active recall test</h4>
            <span className="step-row-detail">Instant audio memory self-diagnostic</span>
          </div>
          <span className="step-row-time">3m</span>
        </div>

        <div className="lesson-footer">
          <span className="encouragement-text">Consistency over intensity.</span>
          <button className="continue-lesson-btn" onClick={onNext}>
            <span>Continue</span>
            <Icon name="arrow-right" size={15} color="#C5A45A" />
          </button>
        </div>
      </div>

      <div className="page-number-tag">02</div>
    </div>
  );

  if (side === 'left') return leftContent;
  if (side === 'right') return rightContent;

  return (
    <div className="book-spread">
      <div className="book-page-edge" />
      <div className="book-center-gutter" />
      <div className="lifted-corner" onClick={onNext} title="Turn page" />
      {leftContent}
      {rightContent}
    </div>
  );
}
