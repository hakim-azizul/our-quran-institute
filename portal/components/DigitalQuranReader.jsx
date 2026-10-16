'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icons';
import { QURAN_SURAHS } from '../lib/quranData';
import SurahSearchSelect from './SurahSearchSelect';

export default function DigitalQuranReader({ studentId = 'QI-STU-8842', onClose }) {
  const [selectedSurahNumber, setSelectedSurahNumber] = useState(1);
  const [fontSize, setFontSize] = useState(26); // Arabic font size in px
  const [showTranslation, setShowTranslation] = useState(true);
  const [activeTabLang, setActiveTabLang] = useState('both'); // 'both' | 'bn' | 'en'

  // Screen Time Stopwatch Tracking
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [screenTimeStats, setScreenTimeStats] = useState({
    todayMinutes: 35,
    totalHours: '4.2',
    sessionsCount: 8,
  });
  const [toastMsg, setToastMsg] = useState('');

  // Audio Player State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedReciter, setSelectedReciter] = useState('mishary');
  const audioRef = useRef(null);

  // Active Surah data
  const activeSurah =
    QURAN_SURAHS.find((s) => s.number === Number(selectedSurahNumber)) || QURAN_SURAHS[0];

  // Screen Time Timer Hook
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSessionSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Fetch initial screen time stats
  useEffect(() => {
    fetchStats();
  }, [studentId]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/quran/screentime?studentId=${encodeURIComponent(studentId)}`);
      const data = await res.json();
      if (data.success && data.stats) {
        setScreenTimeStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load screen time stats:', err);
    }
  };

  // Periodic automatic sync of screen time every 60 seconds
  useEffect(() => {
    if (sessionSeconds > 0 && sessionSeconds % 60 === 0) {
      logSession(60, false);
    }
  }, [sessionSeconds]);

  const logSession = async (secondsToLog, showToast = true) => {
    try {
      const res = await fetch('/api/quran/screentime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          surahNumber: activeSurah.number,
          surahName: activeSurah.name,
          durationSeconds: secondsToLog,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setScreenTimeStats(data.stats);
        if (showToast) {
          setToastMsg(`Logged ${Math.round(secondsToLog / 60)} mins of Quran Screen Time!`);
          setTimeout(() => setToastMsg(''), 3000);
        }
      }
    } catch (err) {
      console.error('Failed to log screen time:', err);
    }
  };

  const formatTimer = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch((err) => {
        console.log('Audio autoplay prevented:', err);
      });
    }
  };

  // Authentic Quran Recitation CDN URLs (Sheikh Mishary & Sheikh Husary)
  const getAudioUrl = () => {
    const paddedSurah = String(activeSurah.number).padStart(3, '0');
    if (selectedReciter === 'mishary') {
      return `https://server8.mp3quran.net/afs/${paddedSurah}.mp3`;
    }
    return `https://server13.mp3quran.net/husr/${paddedSurah}.mp3`;
  };

  return (
    <div className="digital-quran-wrapper">
      {/* Top Header Bar */}
      <div className="digital-quran-header">
        <div className="header-left">
          <span className="quran-brand-icon">
            <Icon name="book-open" size={22} />
          </span>
          <div>
            <h2 className="quran-header-title">Built-in Digital Quran &amp; Recitation Studio</h2>
            <p className="quran-header-sub">
              Read the Noble Quran directly in the portal with live audio recitation and screen time tracking.
            </p>
          </div>
        </div>

        {/* Live Active Screen Time Stopwatch Box */}
        <div className="header-screen-time-box">
          <div className="screen-time-counter">
            <span className="pulse-indicator">●</span>
            <span className="counter-label">Reading Screen Time:</span>
            <span className="counter-digits">{formatTimer(sessionSeconds)}</span>
          </div>
          <button
            type="button"
            className="btn-sync-screen-time"
            onClick={() => logSession(Math.max(60, sessionSeconds), true)}
            title="Log current reading duration to database"
          >
            <Icon name="save" size={14} style={{ marginRight: 6 }} />
            Save Session
          </button>
        </div>

        {onClose && (
          <button type="button" className="quran-close-btn" onClick={onClose} aria-label="Close reader">
            <Icon name="x" size={16} />
          </button>
        )}
      </div>

      {/* Screen Time & Audio Controls Toolbar */}
      <div className="quran-toolbar">
        {/* Surah Selector with Search & 114 Surahs */}
        <div className="toolbar-item" style={{ position: 'relative' }}>
          <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
            Surah:
          </label>
          <SurahSearchSelect
            selectedSurahNumber={selectedSurahNumber}
            onSelectSurah={(num) => {
              setSelectedSurahNumber(num);
              setIsPlayingAudio(false);
            }}
            variant="toolbar"
          />
        </div>

        {/* Audio Recitation Player */}
        <div className="toolbar-item audio-player-controls">
          <audio
            ref={audioRef}
            src={getAudioUrl()}
            onEnded={() => setIsPlayingAudio(false)}
          />
          <button
            type="button"
            className={`btn-audio-play ${isPlayingAudio ? 'playing' : ''}`}
            onClick={toggleAudio}
          >
            {isPlayingAudio ? (
              <>
                <Icon name="pause" size={14} style={{ marginRight: 6 }} />
                Pause Recitation
              </>
            ) : (
              <>
                <Icon name="play" size={14} style={{ marginRight: 6 }} />
                Play Audio Recitation
              </>
            )}
          </button>

          <select
            value={selectedReciter}
            onChange={(e) => {
              setSelectedReciter(e.target.value);
              setIsPlayingAudio(false);
            }}
            className="reciter-select"
            title="Select Renowned Qari"
          >
            <option value="mishary">Qari Mishary Alafasy (العفاسي)</option>
            <option value="husary">Sheikh Al-Husary (الحصري - Tartil)</option>
          </select>
        </div>

        {/* Font Size & Translation Toggles */}
        <div className="toolbar-item view-toggles">
          <div className="font-size-stepper">
            <button
              type="button"
              onClick={() => setFontSize((f) => Math.max(20, f - 2))}
              title="Decrease Font Size"
            >
              A-
            </button>
            <span>{fontSize}px</span>
            <button
              type="button"
              onClick={() => setFontSize((f) => Math.min(42, f + 2))}
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          <button
            type="button"
            className={`btn-toggle-translation ${showTranslation ? 'active' : ''}`}
            onClick={() => setShowTranslation(!showTranslation)}
          >
            {showTranslation ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Icon name="check-circle" size={12} /> Translations ON
              </span>
            ) : (
              'Translations OFF'
            )}
          </button>
        </div>
      </div>

      {/* Screen Time Analytics Summary Strip */}
      <div className="screen-time-stats-strip">
        <div className="stat-strip-item">
          <span className="strip-icon">
            <Icon name="timer" size={16} />
          </span>
          <span>Today’s Screen Time: <strong>{screenTimeStats.todayMinutes} mins</strong></span>
        </div>
        <div className="stat-strip-item">
          <span className="strip-icon">
            <Icon name="bar-chart" size={16} />
          </span>
          <span>Total Reading Time: <strong>{screenTimeStats.totalHours} hrs</strong></span>
        </div>
        <div className="stat-strip-item">
          <span className="strip-icon">
            <Icon name="award" size={16} />
          </span>
          <span>Weekly Target: <strong>70% Achieved</strong> (Target: 5 hrs/week)</span>
        </div>
        {toastMsg && (
          <span className="toast-pill-msg" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icon name="check-circle" size={13} color="#FFFFFF" />
            <span>{toastMsg}</span>
          </span>
        )}
      </div>

      {/* Main Mushaf Quran Reader Canvas */}
      <div className="quran-mushaf-canvas">
        {/* Surah Title Banner */}
        <div className="mushaf-surah-banner">
          <div className="surah-banner-border">
            <span className="surah-ornament">۞</span>
            <h1 className="surah-arabic-title">{activeSurah.arabicName}</h1>
            <span className="surah-ornament">۞</span>
          </div>
          <div className="surah-banner-meta">
            <span>Surah {activeSurah.number} • {activeSurah.name} ({activeSurah.englishName})</span>
            <span>{activeSurah.revelationType} • {activeSurah.ayahCount} Ayahs</span>
          </div>
        </div>

        {/* Bismillah Header (Except for Surah 9 / In Fatihah it is verse 1) */}
        {activeSurah.bismillah && (
          <div className="bismillah-calligraphy-wrap">
            <span className="bismillah-text">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
          </div>
        )}

        {/* Ayahs Stream */}
        <div className="ayahs-stream-container">
          {activeSurah.ayahs.map((ayah) => (
            <div key={ayah.number} className="ayah-card-item">
              <div className="ayah-meta-row">
                <span className="ayah-index-badge">Ayah {ayah.number}</span>
                <button
                  type="button"
                  className="btn-repeat-ayah"
                  onClick={() => alert(`Listening to Ayah ${ayah.number}`)}
                >
                  <Icon name="volume-2" size={13} style={{ marginRight: 4 }} />
                  <span>Repeat Verse</span>
                </button>
              </div>

              {/* Uthmani Arabic Text */}
              <div
                className="ayah-arabic-text"
                style={{ fontSize: `${fontSize}px`, lineHeight: `${fontSize * 1.85}px` }}
              >
                {ayah.textArabic}
                <span className="ayah-end-symbol">
                  ۝<span className="ayah-symbol-num">{ayah.number}</span>
                </span>
              </div>

              {/* English Translation */}
              {showTranslation && (
                <div className="ayah-translations-box">
                  <p className="ayah-english-trans">
                    <span className="trans-lang-tag">EN:</span> {ayah.textEnglish}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
