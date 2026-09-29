import React from 'react';
import { Icon } from '../Icons';

export default function Spread1_Pathway({ onNext, side = 'both' }) {
  const leftContent = (
    <div className="spread-page spread-page-left pathway-intro">
      <div className="intro-copy">
        <div className="section-label">
          <div className="label-rule" />
          <span className="label-text">THE SYSTEM</span>
        </div>

        <h2 className="spread-heading">
          A clear route from<br />
          first review to lasting<br />
          recall.
        </h2>

        <p className="spread-desc">
          Our method balances phonetics, meaning, and interval review so memory feels natural rather than forced.
        </p>

        <button className="btn-gold-pill" onClick={onNext}>
          <span>Discover the method</span>
          <Icon name="compass" size={17} color="#062A24" />
        </button>
      </div>

      <div className="method-note-box">
        <div className="method-marker" />
        <p className="method-note-text">
          Every lesson connects recitation technique directly with comprehension, anchoring memory in meaning.
        </p>
      </div>
    </div>
  );

  const rightContent = (
    <div className="spread-page spread-page-right pathway-sequence">
      <div className="sequence-heading">
        <span className="seq-title">4-STAGE METHODOLOGY</span>
        <span className="seq-duration">15 MIN / DAY</span>
      </div>
      <div className="seq-divider" />

      <div className="pathway-step">
        <div className="step-marker active">
          <Icon name="headphones" size={21} color="#C5A45A" />
        </div>
        <div className="step-copy">
          <span className="step-number">STEP 01</span>
          <h3 className="step-title">Listen & recite</h3>
          <p className="step-description">
            Imitate master reciters with precision tajweed and instant vocal verification.
          </p>
        </div>
      </div>

      <div className="pathway-step">
        <div className="step-marker">
          <Icon name="book-open" size={21} color="#0D4B3E" />
        </div>
        <div className="step-copy">
          <span className="step-number">STEP 02</span>
          <h3 className="step-title">Understand passage</h3>
          <p className="step-description">
            Unpack linguistic roots and spiritual themes of the assigned verses.
          </p>
        </div>
      </div>

      <div className="pathway-step">
        <div className="step-marker">
          <Icon name="mic" size={21} color="#0D4B3E" />
        </div>
        <div className="step-copy">
          <span className="step-number">STEP 03</span>
          <h3 className="step-title">Active recall test</h3>
          <p className="step-description">
            Test retrieval from memory without prompts to build strong neural recall.
          </p>
        </div>
      </div>

      <div className="pathway-step">
        <div className="step-marker">
          <Icon name="refresh-cw" size={21} color="#0D4B3E" />
        </div>
        <div className="step-copy">
          <span className="step-number">STEP 04</span>
          <h3 className="step-title">Scheduled retention</h3>
          <p className="step-description">
            Lock in learned ayahs through scientifically timed spaced repetition.
          </p>
        </div>
      </div>

      <div className="page-number-tag">01</div>
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
