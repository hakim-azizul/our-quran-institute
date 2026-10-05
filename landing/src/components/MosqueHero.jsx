'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icons';

export default function MosqueHero({
  onOpenBooking,
  onExplorePrograms,
  onScrollDown
}) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef(null);

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

  return (
    <div className="mosque-hero-wrapper">
      {/* Hidden Audio Element for Quran Recitation */}
      <audio
        ref={audioRef}
        src="/assets/quran_recitation.mp3"
        preload="metadata"
      />

      {/* Main Curved Hero Banner Card */}
      <div className="mosque-hero-card">
        {/* Architectural Mosque Background */}
        <div
          className="mosque-hero-bg"
          style={{ backgroundImage: `url(/assets/mosque_hero_bg.jpg)` }}
        />

        {/* Ambient Gradient Overlays for optimal text legibility and cinematic atmosphere */}
        <div className="mosque-hero-overlay" />
        <div className="mosque-hero-top-vignette" />

        {/* Main Content Grid: Left Column Copy & CTAs, Right Column Arched Dome Inset */}
        <div className="mosque-hero-grid">
          {/* Left Column: Copy & Actions */}
          <div className="mosque-hero-left">
            {/* Pill Tag: Bismillah */}
            <div className="mosque-bismillah-pill">
              <span className="bismillah-ornament">✦</span>
              <span className="bismillah-text">Bismillahir Rahmanir Rahim</span>
              <span className="bismillah-arabic">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
            </div>

            {/* Main Headline (From Reference Image) */}
            <h1 className="mosque-hero-headline">
              A Peaceful Place to Pray,<br />
              <span className="headline-accent">Learn, and Belong.</span>
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
                className="btn-mosque-primary"
                onClick={onOpenBooking}
              >
                <span>Book Free Session</span>
                <div className="btn-icon-circle">
                  <Icon name="arrow-right" size={14} color="#062A24" />
                </div>
              </button>

              {/* Secondary Action Button: "Listen The Quran" (From Reference Image) */}
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

            {/* "Book your free session scroll down" indicator (Instruction from Reference Image Arrow) */}
            <div
              className="mosque-scroll-prompt"
              onClick={onScrollDown || onExplorePrograms}
              role="button"
              tabIndex={0}
            >
              <div className="scroll-prompt-icon-ring">
                <Icon name="chevron-down" size={14} color="#C5A45A" />
              </div>
              <div className="scroll-prompt-text-group">
                <span className="scroll-prompt-main">Book your free session</span>
                <span className="scroll-prompt-sub">Scroll down to explore methodology &amp; programs</span>
              </div>
            </div>

            {/* Trust Badges Bar */}
            <div className="mosque-trust-chips">
              <div className="trust-chip">
                <span className="chip-bullet">✦</span>
                <span>Al-Azhar Certified Sanad</span>
              </div>
              <div className="trust-chip">
                <span className="chip-bullet">✦</span>
                <span>1-on-1 Live Mentorship</span>
              </div>
              <div className="trust-chip">
                <span className="chip-bullet">✦</span>
                <span>42+ Countries Active</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dome Interior Arched Inset Portal (From Reference Image) */}
          <div className="mosque-hero-right">
            <div className="dome-portal-container">
              {/* Decorative Arch Outlines */}
              <div className="dome-portal-contour-glow" />
              <div className="dome-portal-arch-outer">
                <div className="dome-portal-arch-inner">
                  {/* Mosque Dome Interior Photo */}
                  <img
                    src="/assets/mosque_dome_interior.jpg"
                    alt="Mosque Dome Interior Sanctuary"
                    className="dome-portal-img"
                  />
                  <div className="dome-portal-lighting" />
                  
                  {/* Floating Portal Info Tag */}
                  <div className="dome-portal-badge">
                    <span className="portal-badge-dot">●</span>
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
