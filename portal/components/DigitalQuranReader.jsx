'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Icon } from './Icons';
import {
  MUSHAF_SURAHS_DATA,
  MUSHAF_JUZ_DATA,
  getJuzByPage,
  getSurahByPage,
  getMushafPageImageUrl,
  getReciterAudioUrl,
} from '../lib/mushafData';
import { QURAN_SURAHS } from '../lib/quranData';

export default function DigitalQuranReader({ studentId = 'QI-STU-8842', onClose, initialPage = 1 }) {
  // Reading Mode: 'printed' (Genuine printed Madani Mushaf 604 pages) | 'digital' (Illuminated Uthmani text layout)
  const [readingMode, setReadingMode] = useState('printed');
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isTwoPageSpread, setIsTwoPageSpread] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1); // 1 = 100%, 1.15 = 115%, etc.
  const [paperTheme, setPaperTheme] = useState('parchment'); // 'parchment' | 'white' | 'night' | 'sepia'
  const [fontSize, setFontSize] = useState(28); // For digital calligraphy mode

  // Surah / Juz Index Drawer Modal
  const [isIndexOpen, setIsIndexOpen] = useState(false);
  const [indexTab, setIndexTab] = useState('surahs'); // 'surahs' | 'juz'
  const [indexSearchQuery, setIndexSearchQuery] = useState('');

  // Audio Recitation Player
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedReciter, setSelectedReciter] = useState('mishary');
  const audioRef = useRef(null);

  // Screen Time Reading Tracker
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [screenTimeStats, setScreenTimeStats] = useState({
    todayMinutes: 35,
    totalHours: '4.2',
    sessionsCount: 8,
  });
  const [toastMsg, setToastMsg] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mushafContainerRef = useRef(null);

  // Active Surah & Juz calculated from current page
  const currentJuz = getJuzByPage(currentPage);
  const currentSurah = getSurahByPage(currentPage);

  // Digital mode active surah data from dataset
  const digitalActiveSurah =
    QURAN_SURAHS.find((s) => s.number === currentSurah.number) || QURAN_SURAHS[0];

  // Stopwatch timer for Quran Tilawat
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSessionSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Periodic automatic sync of screen time every 60 seconds
  useEffect(() => {
    if (sessionSeconds > 0 && sessionSeconds % 60 === 0) {
      logSession(60, false);
    }
  }, [sessionSeconds]);

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

  const logSession = async (secondsToLog, showToast = true) => {
    try {
      const res = await fetch('/api/quran/screentime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          surahNumber: currentSurah.number,
          surahName: currentSurah.name,
          durationSeconds: secondsToLog,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setScreenTimeStats(data.stats);
        if (showToast) {
          setToastMsg(`Logged ${Math.round(secondsToLog / 60)} mins of Tilawat screen time!`);
          setTimeout(() => setToastMsg(''), 3000);
        }
      }
    } catch (err) {
      console.error('Failed to log screen time:', err);
    }
  };

  // Keyboard Navigation (Arrow Keys for turning pages)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // In Arabic/Quran reading (RTL):
      // Left Arrow = Next Page (turn forward)
      // Right Arrow = Previous Page (turn back)
      if (e.key === 'ArrowLeft') {
        handleNextPage();
      } else if (e.key === 'ArrowRight') {
        handlePrevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, isTwoPageSpread]);

  // Sync fullscreen state with native browser events (Esc key, F11, etc.)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Preload adjacent pages for seamless page turning
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const preloadNext = new Image();
      preloadNext.src = getMushafPageImageUrl(Math.min(604, currentPage + 1));
      const preloadPrev = new Image();
      preloadPrev.src = getMushafPageImageUrl(Math.max(1, currentPage - 1));
    }
  }, [currentPage]);

  // Page Turn Handlers
  const handleNextPage = () => {
    const step = isTwoPageSpread ? 2 : 1;
    setCurrentPage((p) => Math.min(604, p + step));
  };

  const handlePrevPage = () => {
    const step = isTwoPageSpread ? 2 : 1;
    setCurrentPage((p) => Math.max(1, p - step));
  };

  const handleJumpToPage = (target) => {
    const p = Math.max(1, Math.min(604, Number(target) || 1));
    setCurrentPage(p);
    setIsIndexOpen(false);
  };

  const handleJumpToSurah = (surahNum) => {
    const s = MUSHAF_SURAHS_DATA.find((x) => x.number === Number(surahNum));
    if (s) {
      setCurrentPage(s.startPage);
      setIsIndexOpen(false);
      setIsPlayingAudio(false);
    }
  };

  const handleJumpToJuz = (juzNum) => {
    const j = MUSHAF_JUZ_DATA.find((x) => x.number === Number(juzNum));
    if (j) {
      setCurrentPage(j.startPage);
      setIsIndexOpen(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mushafContainerRef.current?.requestFullscreen().catch((err) => {
        console.error('Fullscreen failed:', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
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
        console.log('Audio playback prevented:', err);
      });
    }
  };

  const formatTimer = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Filter Surahs & Juz in the Index modal
  const filteredSurahs = MUSHAF_SURAHS_DATA.filter((s) => {
    if (!indexSearchQuery) return true;
    const q = indexSearchQuery.trim().toLowerCase();
    return (
      s.number.toString() === q ||
      s.name.toLowerCase().includes(q) ||
      s.banglaName.includes(q) ||
      s.arabicName.includes(q) ||
      s.englishName.toLowerCase().includes(q)
    );
  });

  const filteredJuz = MUSHAF_JUZ_DATA.filter((j) => {
    if (!indexSearchQuery) return true;
    const q = indexSearchQuery.trim().toLowerCase();
    return (
      j.number.toString() === q ||
      j.nameBangla.includes(q) ||
      j.nameArabic.includes(q) ||
      j.nameEnglish.toLowerCase().includes(q)
    );
  });

  return (
    <div
      ref={mushafContainerRef}
      className={`genuine-mushaf-wrapper theme-${paperTheme} ${isFullscreen ? 'fullscreen-mode' : ''}`}
    >
      {/* =========================================================================
          TOP COMMAND TOOLBAR: MUSHAF HEADER, READING MODES & NAVIGATION
          ========================================================================= */}
      <header className="mushaf-top-header">
        <div className="mushaf-header-left">
          <div className="mushaf-brand-emblem">
            <span className="quran-calligraphy-icon">📖</span>
            <div>
              <div className="mushaf-title-row">
                <h1 className="mushaf-royal-title">المُصْحَفُ الشَّرِيف</h1>
                <span className="mushaf-madinah-badge">مَدِينَةُ مُنَوَّرَة</span>
              </div>
              <p className="mushaf-subtitle">
                জেনুইন কোরআন শরীফ • Madani Mushaf Reading Studio
              </p>
            </div>
          </div>
        </div>

        {/* Center: Mode Switcher (Printed Mushaf vs Illuminated Digital Text) */}
        <div className="mushaf-mode-switcher-wrap">
          <div className="mushaf-mode-pills">
            <button
              type="button"
              className={`mushaf-mode-btn ${readingMode === 'printed' ? 'active' : ''}`}
              onClick={() => setReadingMode('printed')}
              title="Official Printed Madani Mushaf (604 Pages)"
            >
              <Icon name="book" size={14} />
              <span>ছাপা কোরআন শরীফ (Printed Page)</span>
            </button>
            <button
              type="button"
              className={`mushaf-mode-btn ${readingMode === 'digital' ? 'active' : ''}`}
              onClick={() => setReadingMode('digital')}
              title="Illuminated Digital Calligraphy Text Layout"
            >
              <Icon name="book-open" size={14} />
              <span>ডিজিটাল ক্যালিগ্রাফি (Typeset)</span>
            </button>
          </div>
        </div>

        {/* Right: Live Reading Stopwatch & Controls */}
        <div className="mushaf-header-right">
          {/* Live Reading Screen Time Stopwatch */}
          <div className="mushaf-stopwatch-chip" title="Live Quran Tilawat Stopwatch">
            <span className="live-pulse-dot">●</span>
            <span className="stopwatch-label">তেলাওয়াত সময়:</span>
            <span className="stopwatch-digits">{formatTimer(sessionSeconds)}</span>
            <button
              type="button"
              className="btn-sync-tilawat"
              onClick={() => logSession(Math.max(60, sessionSeconds), true)}
              title="Save reading screen time"
            >
              <Icon name="save" size={12} />
              <span>Save</span>
            </button>
          </div>

          {/* Fullscreen Reading Mode Button */}
          <button
            type="button"
            className={`mushaf-icon-btn mushaf-fullscreen-btn ${isFullscreen ? 'active-fullscreen' : ''}`}
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen Reading Mode (Esc)' : 'Enter Fullscreen Reading Mode (পূর্ণ স্ক্রীন মোড)'}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            <Icon name={isFullscreen ? 'minimize' : 'maximize'} size={18} strokeWidth={2.2} />
          </button>

          {onClose && (
            <button
              type="button"
              className="mushaf-icon-btn mushaf-close-btn"
              onClick={onClose}
              title="Close Mushaf Studio"
            >
              <Icon name="x" size={16} />
            </button>
          )}
        </div>
      </header>

      {/* =========================================================================
          SECONDARY CONTROLS BAR: SURAH / JUZ NAV, AUDIO PLAYER & VIEW CONTROLS
          ========================================================================= */}
      <div className="mushaf-controls-bar">
        {/* Navigation Quick Jump Drawer Opener */}
        <div className="controls-left-cluster">
          <button
            type="button"
            className="btn-open-index"
            onClick={() => setIsIndexOpen(true)}
            title="Open Quran Surah & Juz Index"
          >
            <Icon name="list" size={15} style={{ marginRight: 6 }} />
            <span>সূরা ও পারার সূচিপত্র (Index)</span>
            <span className="index-current-indicator">
              সূরা {currentSurah.banglaName} • পারা {currentJuz.number}
            </span>
          </button>

          {/* Page Indicator & Direct Input */}
          <div className="page-direct-navigator">
            <span className="page-nav-label">পৃষ্ঠা:</span>
            <input
              type="number"
              min="1"
              max="604"
              value={currentPage}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val)) {
                  setCurrentPage(Math.max(1, Math.min(604, val)));
                }
              }}
              className="page-number-input"
            />
            <span className="page-total-label">/ ৬০৪</span>
          </div>
        </div>

        {/* Audio Tilawat Player */}
        <div className="controls-audio-cluster">
          <audio
            ref={audioRef}
            src={getReciterAudioUrl(currentSurah.number, selectedReciter)}
            onEnded={() => setIsPlayingAudio(false)}
          />
          <button
            type="button"
            className={`btn-mushaf-audio-play ${isPlayingAudio ? 'playing' : ''}`}
            onClick={toggleAudio}
            title="Listen to authentic audio recitation"
          >
            <Icon name={isPlayingAudio ? 'pause' : 'volume-2'} size={15} style={{ marginRight: 6 }} />
            <span>{isPlayingAudio ? 'বিরতি (Pause)' : `তেলাওয়াত শুনুন (সূরা ${currentSurah.number})`}</span>
          </button>

          <select
            value={selectedReciter}
            onChange={(e) => {
              setSelectedReciter(e.target.value);
              setIsPlayingAudio(false);
            }}
            className="mushaf-reciter-dropdown"
            title="Select Renowned Reciter"
          >
            <option value="mishary">ক্বারী মিশারী রাশিদ আল-আফাসী (Mishary Alafasy)</option>
            <option value="husary">শায়খ আল-হুসারী - তারতীল (Al-Husary Tartil)</option>
            <option value="basit">শায়খ আব্দুল বাসেত (Abdul Basit)</option>
          </select>
        </div>

        {/* Theme, Zoom & Display Settings */}
        <div className="controls-view-cluster">
          {/* Two-page spread toggle (only in printed mode on wide screens) */}
          {readingMode === 'printed' && (
            <button
              type="button"
              className={`btn-view-toggle ${isTwoPageSpread ? 'active' : ''}`}
              onClick={() => setIsTwoPageSpread(!isTwoPageSpread)}
              title="Toggle Two-Page Book Spread (কিতাব ভিউ)"
            >
              <Icon name="columns" size={14} style={{ marginRight: 4 }} />
              <span>{isTwoPageSpread ? 'একক পৃষ্ঠা' : 'দুই পৃষ্ঠা (কিতাব)'}</span>
            </button>
          )}

          {/* Paper Atmosphere Theme Selector */}
          <div className="paper-theme-picker">
            <button
              type="button"
              className={`theme-dot dot-parchment ${paperTheme === 'parchment' ? 'active' : ''}`}
              onClick={() => setPaperTheme('parchment')}
              title="আইভরি পাপাইরাস পেপার (Parchment)"
            />
            <button
              type="button"
              className={`theme-dot dot-white ${paperTheme === 'white' ? 'active' : ''}`}
              onClick={() => setPaperTheme('white')}
              title="পরিচ্ছন্ন সাদা পাতা (Clean White)"
            />
            <button
              type="button"
              className={`theme-dot dot-night ${paperTheme === 'night' ? 'active' : ''}`}
              onClick={() => setPaperTheme('night')}
              title="নাইট মোড - ডার্ক গ্রিন ও সোনালী (Holy Night)"
            />
            <button
              type="button"
              className={`theme-dot dot-sepia ${paperTheme === 'sepia' ? 'active' : ''}`}
              onClick={() => setPaperTheme('sepia')}
              title="উষ্ণ সেপিয়া পেপার (Warm Sepia)"
            />
          </div>

          {/* Zoom / Font Size Stepper */}
          {readingMode === 'printed' ? (
            <div className="zoom-stepper-box">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.85, z - 0.1))}
                title="Zoom Out"
              >
                -
              </button>
              <span onClick={() => setZoomLevel(1)} title="Reset Zoom">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.1))}
                title="Zoom In"
              >
                +
              </button>
            </div>
          ) : (
            <div className="zoom-stepper-box">
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
                onClick={() => setFontSize((f) => Math.min(46, f + 2))}
                title="Increase Font Size"
              >
                A+
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Screen Time Notification Toast */}
      {toastMsg && (
        <div className="mushaf-toast-banner">
          <Icon name="check-circle" size={15} color="#FFFFFF" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* =========================================================================
          MAIN MUSHAF READING STAGE
          ========================================================================= */}
      <main className="mushaf-reading-stage">
        {/* Left Side Page Turn Button (RTL: Flips Forward) */}
        <button
          type="button"
          className="mushaf-turn-button button-next"
          onClick={handleNextPage}
          disabled={currentPage >= 604}
          title="পরের পৃষ্ঠা (Next Page) • [Arrow Left]"
          aria-label="Next Page"
        >
          <span className="turn-arrow">‹</span>
          <span className="turn-label">পরের পৃষ্ঠা</span>
        </button>

        {/* Right Side Page Turn Button (RTL: Flips Backward) */}
        <button
          type="button"
          className="mushaf-turn-button button-prev"
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
          title="আগের পৃষ্ঠা (Previous Page) • [Arrow Right]"
          aria-label="Previous Page"
        >
          <span className="turn-arrow">›</span>
          <span className="turn-label">আগের পৃষ্ঠা</span>
        </button>

        {/* =====================================================================
            MODE 1: OFFICIAL PRINTED MADANI MUSHAF (604 PAGES HIGH RESOLUTION)
            ===================================================================== */}
        {readingMode === 'printed' ? (
          <div
            className={`mushaf-book-canvas ${isTwoPageSpread ? 'two-page-layout' : 'single-page-layout'}`}
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
          >
            {/* If Two-Page Spread is enabled and not at end, show right page (currentPage + 1 in RTL) */}
            {isTwoPageSpread && currentPage + 1 <= 604 && (
              <div className="mushaf-single-page right-page">
                {/* Traditional Page Header Margin */}
                <div className="mushaf-page-top-margin">
                  <span className="top-margin-surah">
                    سُورَةُ {getSurahByPage(currentPage + 1).arabicName}
                  </span>
                  <span className="top-margin-juz">
                    الجزء {getJuzByPage(currentPage + 1).number}
                  </span>
                </div>

                {/* Page Decorative Ornate Frame */}
                <div className="mushaf-illuminated-border">
                  <img
                    src={getMushafPageImageUrl(currentPage + 1)}
                    alt={`Quran Sharif Page ${currentPage + 1}`}
                    className="mushaf-page-image"
                    loading="eager"
                  />
                </div>

                {/* Bottom Page Number */}
                <div className="mushaf-page-bottom-margin">
                  <span className="page-num-medallion">{currentPage + 1}</span>
                </div>
              </div>
            )}

            {/* Primary Current Page */}
            <div className="mushaf-single-page left-page">
              {/* Traditional Page Header Margin */}
              <div className="mushaf-page-top-margin">
                <span className="top-margin-surah">
                  سُورَةُ {currentSurah.arabicName} ({currentSurah.banglaName})
                </span>
                <span className="top-margin-juz">
                  الجزء {currentJuz.number} ({currentJuz.nameBangla})
                </span>
              </div>

              {/* Page Decorative Ornate Frame */}
              <div className="mushaf-illuminated-border">
                <img
                  src={getMushafPageImageUrl(currentPage)}
                  alt={`Quran Sharif Page ${currentPage}`}
                  className="mushaf-page-image"
                  loading="eager"
                />
              </div>

              {/* Bottom Page Number */}
              <div className="mushaf-page-bottom-margin">
                <span className="page-num-medallion">{currentPage}</span>
              </div>
            </div>
          </div>
        ) : (
          /* =====================================================================
              MODE 2: ILLUMINATED DIGITAL MUSHAF (PURE FLOWING ARABIC CALLIGRAPHY)
              ===================================================================== */
          <div className="digital-mushaf-canvas">
            <div className="digital-mushaf-inner-frame">
              {/* Ornate Corner Arabesque Medallions */}
              <div className="corner-arabesque corner-tl">۞</div>
              <div className="corner-arabesque corner-tr">۞</div>
              <div className="corner-arabesque corner-bl">۞</div>
              <div className="corner-arabesque corner-br">۞</div>

              {/* Top Margin Info */}
              <div className="digital-mushaf-meta-bar">
                <div className="meta-juz-tag">
                  <span>الجزء {currentJuz.number}</span>
                  <span style={{ margin: '0 6px' }}>•</span>
                  <span>{currentJuz.nameBangla}</span>
                </div>
                <div className="meta-mushaf-brand">مُصْحَفُ المَدِينَةِ المُنَوَّرَةِ</div>
                <div className="meta-surah-tag">
                  <span>سُورَةُ {digitalActiveSurah.arabicName}</span>
                </div>
              </div>

              {/* Ornate Surah Title Cartouche (برواز السورة) */}
              <div className="surah-heading-cartouche">
                <div className="cartouche-gilded-box">
                  <div className="cartouche-side-ornament">۩</div>
                  <div className="cartouche-center">
                    <h2 className="cartouche-surah-name">سُورَةُ {digitalActiveSurah.arabicName}</h2>
                    <div className="cartouche-meta-row">
                      <span className="cartouche-badge">
                        {digitalActiveSurah.revelationType === 'Meccan' ? 'مَكِّيَّة (মাক্কী)' : 'مَدَنِيَّة (মাদানী)'}
                      </span>
                      <span>•</span>
                      <span className="cartouche-badge">
                        آيَاتُهَا {digitalActiveSurah.ayahCount} (আয়াত সংখ্যা {digitalActiveSurah.ayahCount})
                      </span>
                    </div>
                  </div>
                  <div className="cartouche-side-ornament">۩</div>
                </div>
              </div>

              {/* Centered Illuminated Bismillah (for all surahs except At-Tawbah) */}
              {digitalActiveSurah.number !== 9 && (
                <div className="bismillah-illuminated-banner">
                  <div className="bismillah-calligraphy-text">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </div>
                </div>
              )}

              {/* Pure Continuous Flowing Arabic Quran Text (NO translations between verses!) */}
              <div
                className="pure-arabic-flow-block"
                style={{ fontSize: `${fontSize}px`, lineHeight: `${fontSize * 2.1}px` }}
              >
                {digitalActiveSurah.ayahs.map((ayah) => (
                  <React.Fragment key={ayah.number}>
                    <span className="flowing-ayah-verse">
                      {ayah.textArabic}
                    </span>
                    {/* Traditional Ornate Ayah Stop Medallion */}
                    <span className="ayah-stop-medallion" title={`Ayah ${ayah.number}`}>
                      <span className="medallion-symbol">۝</span>
                      <span className="medallion-number">{ayah.number}</span>
                    </span>
                    {' '}
                  </React.Fragment>
                ))}
              </div>

              {/* Bottom Page Footer */}
              <div className="digital-mushaf-footer">
                <span>صفحة {currentPage}</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =========================================================================
          BOTTOM QUICK SLIDER & PAGE TURNER BAR
          ========================================================================= */}
      <footer className="mushaf-bottom-navigation-bar">
        <div className="bottom-bar-left">
          <button
            type="button"
            className="btn-quick-turn"
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
          >
            <Icon name="arrow-right" size={14} style={{ marginRight: 4 }} />
            <span>আগের পৃষ্ঠা</span>
          </button>
        </div>

        <div className="bottom-bar-center">
          <span className="slider-edge-label">পৃষ্ঠা ১</span>
          <input
            type="range"
            min="1"
            max="604"
            value={currentPage}
            onChange={(e) => setCurrentPage(parseInt(e.target.value, 10))}
            className="mushaf-page-slider"
            title="Drag to navigate through 604 pages of the Quran"
          />
          <span className="slider-edge-label">৬০৪</span>
        </div>

        <div className="bottom-bar-right">
          <button
            type="button"
            className="btn-quick-turn"
            onClick={handleNextPage}
            disabled={currentPage >= 604}
          >
            <span>পরের পৃষ্ঠা</span>
            <Icon name="arrow-left" size={14} style={{ marginLeft: 4 }} />
          </button>
        </div>
      </footer>

      {/* =========================================================================
          SURAH & JUZ INDEX DRAWER MODAL
          ========================================================================= */}
      {isIndexOpen && (
        <div className="mushaf-modal-backdrop" onClick={() => setIsIndexOpen(false)}>
          <div className="mushaf-index-modal-card" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="index-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="index-modal-gold-icon">📖</span>
                <div>
                  <h3 className="index-modal-title">কোরআন শরীফ সূচিপত্র (Noble Quran Index)</h3>
                  <p className="index-modal-sub">১১৪টি সূরা এবং ৩০টি পারার তালিকা থেকে সরাসরি পৃষ্ঠায় যান</p>
                </div>
              </div>
              <button
                type="button"
                className="btn-close-index-modal"
                onClick={() => setIsIndexOpen(false)}
              >
                <Icon name="x" size={18} />
              </button>
            </div>

            {/* Modal Tab Switcher (Surahs vs Juz) */}
            <div className="index-modal-tabs-row">
              <div className="index-tabs-pills">
                <button
                  type="button"
                  className={`index-tab-btn ${indexTab === 'surahs' ? 'active' : ''}`}
                  onClick={() => setIndexTab('surahs')}
                >
                  ১১৪টি সূরা (Surah Index)
                </button>
                <button
                  type="button"
                  className={`index-tab-btn ${indexTab === 'juz' ? 'active' : ''}`}
                  onClick={() => setIndexTab('juz')}
                >
                  ৩০টি পারা (Juz Index)
                </button>
              </div>

              {/* Search Box */}
              <div className="index-search-container">
                <span className="index-search-icon">
                  <Icon name="search" size={15} />
                </span>
                <input
                  type="text"
                  placeholder={indexTab === 'surahs' ? 'সূরা খুঁজুন (নাম বা নম্বর)...' : 'পারা খুঁজুন...'}
                  value={indexSearchQuery}
                  onChange={(e) => setIndexSearchQuery(e.target.value)}
                  className="index-search-input"
                  autoFocus
                />
              </div>
            </div>

            {/* Modal Content Grid */}
            <div className="index-modal-scroll-area">
              {indexTab === 'surahs' ? (
                <div className="surahs-grid-list">
                  {filteredSurahs.map((surah) => {
                    const isCurrent = surah.number === currentSurah.number;
                    return (
                      <div
                        key={surah.number}
                        className={`surah-index-card ${isCurrent ? 'active' : ''}`}
                        onClick={() => handleJumpToSurah(surah.number)}
                      >
                        <div className="surah-number-badge">{surah.number}</div>
                        <div className="surah-info-middle">
                          <div className="surah-primary-names">
                            <span className="surah-bangla-name">{surah.banglaName}</span>
                            <span className="surah-english-name">({surah.englishName})</span>
                          </div>
                          <div className="surah-meta-details">
                            <span className="revelation-tag">
                              {surah.revelationType === 'Meccan' ? 'মাক্কী' : 'মাদানী'}
                            </span>
                            <span>• {surah.ayahCount} আয়াত</span>
                            <span>• পারা {surah.juz}</span>
                          </div>
                        </div>
                        <div className="surah-arabic-end">
                          <div className="arabic-calligraphy-name">سُورَةُ {surah.arabicName}</div>
                          <span className="page-jump-chip">পৃষ্ঠা {surah.startPage}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="juz-grid-list">
                  {filteredJuz.map((juz) => {
                    const isCurrent = juz.number === currentJuz.number;
                    return (
                      <div
                        key={juz.number}
                        className={`juz-index-card ${isCurrent ? 'active' : ''}`}
                        onClick={() => handleJumpToJuz(juz.number)}
                      >
                        <div className="juz-number-badge">পারা {juz.number}</div>
                        <div className="juz-info-middle">
                          <div className="juz-bangla-title">{juz.nameBangla}</div>
                          <div className="juz-start-surah">শুরু: {juz.startSurah}</div>
                        </div>
                        <div className="juz-arabic-end">
                          <div className="juz-arabic-name">{juz.nameArabic}</div>
                          <span className="page-jump-chip">পৃষ্ঠা {juz.startPage}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
