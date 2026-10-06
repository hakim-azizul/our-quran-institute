'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Icon } from './Icons';

// Pre-generated static specs for 16 Noor ambient floating light motes
const NOOR_PARTICLES = [
  { id: 1, left: '12%', top: '78%', size: 4, delay: '0s', duration: '9s', opacity: 0.65 },
  { id: 2, left: '24%', top: '65%', size: 6, delay: '1.8s', duration: '12s', opacity: 0.75 },
  { id: 3, left: '38%', top: '82%', size: 5, delay: '3.4s', duration: '10s', opacity: 0.6 },
  { id: 4, left: '52%', top: '72%', size: 7, delay: '0.8s', duration: '13s', opacity: 0.8 },
  { id: 5, left: '68%', top: '85%', size: 4, delay: '2.5s', duration: '11s', opacity: 0.7 },
  { id: 6, left: '79%', top: '68%', size: 5, delay: '4.2s', duration: '14s', opacity: 0.85 },
  { id: 7, left: '88%', top: '75%', size: 6, delay: '1.2s', duration: '10s', opacity: 0.65 },
  { id: 8, left: '18%', top: '45%', size: 5, delay: '5.1s', duration: '12s', opacity: 0.7 },
  { id: 9, left: '31%', top: '55%', size: 4, delay: '2.9s', duration: '11s', opacity: 0.6 },
  { id: 10, left: '46%', top: '40%', size: 6, delay: '0.4s', duration: '15s', opacity: 0.75 },
  { id: 11, left: '62%', top: '50%', size: 5, delay: '3.8s', duration: '12s', opacity: 0.8 },
  { id: 12, left: '74%', top: '42%', size: 7, delay: '1.5s', duration: '13s', opacity: 0.85 },
  { id: 13, left: '84%', top: '52%', size: 4, delay: '4.7s', duration: '9s', opacity: 0.6 },
  { id: 14, left: '15%', top: '28%', size: 5, delay: '6.0s', duration: '14s', opacity: 0.7 },
  { id: 15, left: '58%', top: '30%', size: 6, delay: '2.1s', duration: '11s', opacity: 0.8 },
  { id: 16, left: '92%', top: '35%', size: 5, delay: '3.3s', duration: '13s', opacity: 0.75 }
];

export default function MosqueHero({
  onOpenBooking,
  onExplorePrograms,
  onScrollDown
}) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef(null);
  const cardRef = useRef(null);

  // Audio time & state synchronization
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (audio.duration) {
        setAudioProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlayingAudio(false);
      setAudioProgress(0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const toggleQuranAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch((e) => {
        console.warn('Audio playback error:', e);
      });
    }
  };

  // Smooth mouse-tracking parallax variables
  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty('--mouse-px', `${x * 16}px`);
    card.style.setProperty('--mouse-py', `${y * 12}px`);
    card.style.setProperty('--mouse-inv-px', `${-x * 18}px`);
    card.style.setProperty('--mouse-inv-py', `${-y * 14}px`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--mouse-px', '0px');
    card.style.setProperty('--mouse-py', '0px');
    card.style.setProperty('--mouse-inv-px', '0px');
    card.style.setProperty('--mouse-inv-py', '0px');
  }, []);

  return (
    <div className="mosque-hero-wrapper">
      {/* Hidden Audio Element for Quran Recitation */}
      <audio
        ref={audioRef}
        src="/assets/quran_recitation.mp3"
        preload="metadata"
      />

      {/* Main Curved Hero Banner Card with Parallax & Atmosphere */}
      <div
        ref={cardRef}
        className="mosque-hero-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Architectural Mosque Background with Parallax */}
        <div
          className="mosque-hero-bg animated-hero-parallax-bg"
          style={{ backgroundImage: `url(/assets/mosque_hero_bg.jpg)` }}
        />

        {/* Ambient Noor Sunbeam Shimmer Overlay */}
        <div className="mosque-noor-sweep-overlay" />

        {/* Floating Sacred Noor Golden Particles */}
        <div className="mosque-noor-particles-deck" aria-hidden="true">
          {NOOR_PARTICLES.map((p) => (
            <span
              key={p.id}
              className="noor-particle"
              style={{
                left: p.left,
                top: p.top,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDelay: p.delay,
                animationDuration: p.duration,
                opacity: p.opacity
              }}
            />
          ))}
        </div>

        {/* Vignette Gradients for Text Contrast */}
        <div className="mosque-hero-overlay" />
        <div className="mosque-hero-top-vignette" />

        {/* Main Content Grid: Left Column Copy & CTAs, Right Column Arched Dome Inset */}
        <div className="mosque-hero-grid">
          {/* Left Column: Copy & Actions */}
          <div className="mosque-hero-left">
            {/* Pill Tag: Bismillah with Animated Golden Star */}
            <div className="mosque-bismillah-pill animated-bismillah-pill">
              <span className="bismillah-ornament spinning-star">✦</span>
              <span className="bismillah-text">Bismillahir Rahmanir Rahim</span>
              <span className="bismillah-arabic">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
            </div>

            {/* Main Headline with Liquid Gold Shimmer */}
            <h1 className="mosque-hero-headline">
              A Peaceful Place to Pray,<br />
              <span className="headline-accent gold-shimmer-text">Learn, and Belong.</span>
            </h1>

            {/* Description Subtext */}
            <p className="mosque-hero-description">
              Our Quran Institute brings structured Quran memorization (Hifz), Tajweed mastery, Quranic Arabic, and authentic Islamic Studies under the patient 1-on-1 guidance of certified scholars from Al-Azhar.
            </p>

            {/* Action Buttons Row */}
            <div className="mosque-hero-actions">
              {/* Primary Action Button: "Discover More / Book Free Session" */}
              <button
                type="button"
                className="btn-mosque-primary btn-primary-pulsing"
                onClick={onOpenBooking}
              >
                <span>Book Free Session</span>
                <div className="btn-icon-circle">
                  <Icon name="arrow-right" size={14} color="#062A24" />
                </div>
              </button>

              {/* Secondary Action Button: "Listen The Quran" with Soundwave Ripple Rings */}
              <div className="btn-secondary-wrapper">
                {isPlayingAudio && (
                  <>
                    <span className="audio-ripple-ring ring-1" />
                    <span className="audio-ripple-ring ring-2" />
                  </>
                )}
                <button
                  type="button"
                  className={`btn-mosque-secondary ${isPlayingAudio ? 'is-playing' : ''}`}
                  onClick={toggleQuranAudio}
                  title={isPlayingAudio ? 'Pause Recitation' : 'Play Surah Al-Fatiha'}
                >
                  <div className="play-icon-disc">
                    {isPlayingAudio ? (
                      <span className="pause-bars-icon">❚❚</span>
                    ) : (
                      <span className="play-triangle-icon">▶</span>
                    )}
                  </div>
                  <div className="btn-listen-text-group">
                    <span className="btn-listen-title">
                      {isPlayingAudio ? 'Reciting Surah Al-Fatiha' : 'Listen The Quran'}
                    </span>
                    {isPlayingAudio && (
                      <span className="btn-listen-sub">Sheikh Mishary Alafasy</span>
                    )}
                  </div>

                  {/* Animated Equalizer Sound Bars when playing */}
                  {isPlayingAudio && (
                    <div className="audio-equalizer">
                      <span className="bar bar-1" />
                      <span className="bar bar-2" />
                      <span className="bar bar-3" />
                      <span className="bar bar-4" />
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Trust Badges Bar with subtle sheen */}
            <div className="mosque-trust-chips">
              <div className="trust-chip animated-chip">
                <span className="chip-bullet">✦</span>
                <span>Al-Azhar Certified Sanad</span>
              </div>
              <div className="trust-chip animated-chip">
                <span className="chip-bullet">✦</span>
                <span>1-on-1 Live Mentorship</span>
              </div>
              <div className="trust-chip animated-chip">
                <span className="chip-bullet">✦</span>
                <span>42+ Countries Active</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dome Interior Arched Inset Portal with Levitation & Rotating Islamic Star Halo */}
          <div className="mosque-hero-right animated-portal-column">
            <div className="dome-portal-container animated-arch-levitate">
              
              {/* Sacred Rotating Islamic 8-Pointed Star Geometric Mandala Halo */}
              <div className="portal-mandala-halo" aria-hidden="true">
                <svg
                  className="rotating-islamic-star"
                  viewBox="0 0 400 400"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="200" cy="200" r="185" stroke="#C5A45A" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />
                  <circle cx="200" cy="200" r="150" stroke="#9CB882" strokeWidth="1.2" opacity="0.3" />
                  <circle cx="200" cy="200" r="115" stroke="#FFDF85" strokeWidth="1" strokeDasharray="2 4" opacity="0.35" />
                  {/* Square 1 */}
                  <rect x="75" y="75" width="250" height="250" stroke="#C5A45A" strokeWidth="1.2" opacity="0.3" />
                  {/* Square 2 (Rotated 45deg to form 8-point star) */}
                  <rect x="75" y="75" width="250" height="250" stroke="#FFDF85" strokeWidth="1.2" transform="rotate(45 200 200)" opacity="0.35" />
                  {/* Diamond 3 (Rotated 22.5deg) */}
                  <rect x="95" y="95" width="210" height="210" stroke="#9CB882" strokeWidth="0.8" transform="rotate(22.5 200 200)" opacity="0.25" />
                  <rect x="95" y="95" width="210" height="210" stroke="#9CB882" strokeWidth="0.8" transform="rotate(67.5 200 200)" opacity="0.25" />
                  {/* Central radiant rays */}
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                    <line
                      key={deg}
                      x1="200"
                      y1="20"
                      x2="200"
                      y2="55"
                      stroke="#FFDF85"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      transform={`rotate(${deg} 200 200)`}
                      opacity="0.5"
                    />
                  ))}
                </svg>
              </div>

              {/* Ambient Glowing Aura */}
              <div className="dome-portal-contour-glow pulsing-contour-glow" />

              {/* Arched Frame with Dynamic Shimmer Border */}
              <div className="dome-portal-arch-outer radiant-arch-frame">
                <div className="dome-portal-arch-inner">
                  {/* Mosque Dome Interior Photo */}
                  <img
                    src="/assets/mosque_dome_interior.jpg"
                    alt="Mosque Dome Interior Sanctuary"
                    className="dome-portal-img"
                  />
                  <div className="dome-portal-lighting" />
                  
                  {/* Floating Portal Info Tag with Active Beacon */}
                  <div className="dome-portal-badge">
                    <span className="portal-badge-beacon">
                      <span className="beacon-ping" />
                      <span className="beacon-core" />
                    </span>
                    <span className="portal-badge-text">Sacred Sanctuary Halqa</span>
                  </div>
                </div>
              </div>

              {/* Decorative Arch Callout */}
              <div className="dome-portal-caption">
                <span className="portal-caption-title">Live 1-on-1 Halqas</span>
                <span className="portal-caption-desc">Private instruction connected to authentic Isnad chains</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
