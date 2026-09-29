import React, { useState, useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import ThreeBookCanvas from './components/ThreeBookCanvas';
import Navigation from './components/Navigation';
import BookingModal from './components/BookingModal';
import BookControls from './components/BookControls';
import { soundEngine } from './components/AudioEffects';
import { DiamondOrnament, Icon } from './components/Icons';

// Spreads
import Spread0_Hero from './components/spreads/Spread0_Hero';
import Spread1_Pathway from './components/spreads/Spread1_Pathway';
import Spread2_DailyLesson from './components/spreads/Spread2_DailyLesson';
import Spread3_Revision from './components/spreads/Spread3_Revision';
import Spread4_Progress from './components/spreads/Spread4_Progress';
import Spread5_Teacher from './components/spreads/Spread5_Teacher';
import Spread6_Stories from './components/spreads/Spread6_Stories';
import Spread7_Principles from './components/spreads/Spread7_Principles';
import Spread8_Closing from './components/spreads/Spread8_Closing';

// Ample scroll travel distance per spread for slow, majestic, authentic page turning
const SPREAD_SCROLL_DISTANCE = 1100;

// Spread chapter names and page identifiers
const SPREAD_INFO = [
  { num: '00', title: 'Open the Book', left: 'Intention & Call', right: 'Sacred Stand' },
  { num: '01', title: 'Core Pathway', left: 'Gentle Route', right: '3-Step Method' },
  { num: '02', title: '15-Min Flow', left: 'Daily Habit', right: 'Interactive Surah' },
  { num: '03', title: 'Sanctuary', left: 'Decay Curve', right: 'Revision Room' },
  { num: '04', title: 'Consistency', left: 'Effort Metrics', right: 'Live Retention' },
  { num: '05', title: 'Lead Mentor', left: 'Ustadh Azizul', right: 'Guidance & Adab' },
  { num: '06', title: 'Global Sanctuary', left: "Dr. Sarah's Journey", right: 'Worldwide Map' },
  { num: '07', title: 'Sacred Covenant', left: 'Core Philosophy', right: '04 Pillars' },
  { num: '08', title: 'Enrollment', left: 'The Sacred Call', right: 'Reserve Session' }
];

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0); // continuous 0.0 to 8.0
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Responsive Viewport Tracking
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.innerHeight : 900
  });

  // Mobile Single-Page Mode: Active Page ('left' | 'right')
  const [mobileSide, setMobileSide] = useState('left');
  const [isMobileFlipping, setIsMobileFlipping] = useState(false);
  const [mobileFlipDir, setMobileFlipDir] = useState('next'); // 'next' | 'prev'
  const targetSideRef = useRef('left');

  // Touch gesture tracking for mobile & tablet swipe
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });

  // Opening book intro animation on first land / refresh (starts fully closed, then unfolds open)
  const [openIntroProgress, setOpenIntroProgress] = useState(0); // 0.0 (fully closed) to 1.0 (fully open)
  const [isOpeningIntro, setIsOpeningIntro] = useState(true);

  const lenisRef = useRef(null);
  const totalSpreads = 9;

  // Viewport resize and orientation listener
  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Responsive Viewport Categorization
  // Portrait tablets (e.g. iPad 768x1024, iPad Air 820x1180) have ample height but narrower width.
  // Rendering single-page volume at ~0.98 scale creates a majestic, readable manuscript layout.
  // When rotated to landscape (1024x768), it automatically presents the 2-page spread.
  const isPortraitTablet =
    viewport.width >= 640 &&
    viewport.width < 1024 &&
    viewport.height > viewport.width;

  const isShortScreen = viewport.height < 540;
  const isMobile = viewport.width < 640 || isPortraitTablet || isShortScreen;
  const isTabletLandscape =
    viewport.width >= 640 &&
    viewport.width < 1180 &&
    viewport.height <= viewport.width;
  const isTablet = isPortraitTablet || isTabletLandscape;

  // Dynamically calculated scale to guarantee 0 overflow and generous margin on any display
  const navHeight = isMobile ? 66 : 74;
  const bottomDockReserved = isTablet ? 90 : 86;
  const desktopScale = Math.min(
    (viewport.width - (isTablet ? 36 : 56)) / 1280,
    (viewport.height - navHeight - bottomDockReserved) / 876,
    1.0
  );

  // Mobile single-page scale: 640px base width, with margin for mobile nav & controls
  const mobileControlH = 88;
  const mobileAvailableW = isPortraitTablet
    ? Math.min(640, viewport.width - 48)
    : viewport.width - 24;
  const mobileAvailableH = viewport.height - navHeight - mobileControlH - 24;
  const mobileScale = Math.min(
    mobileAvailableW / 640,
    mobileAvailableH / 876
  );

  // On page land / refresh: fully closed book rests centered, then smoothly unfolds open into Spread 0
  useEffect(() => {
    let startTime = null;
    const closedHoldDuration = 700; // Hold on closed book so user sees the closed volume
    const openingDuration = 2000; // 2.0s majestic, physical 3D opening
    let animId;

    const timer = setTimeout(() => {
      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const raw = Math.min(1, elapsed / openingDuration);
        // Luxurious cubic ease-in-out
        const eased = raw < 0.5
          ? 4 * raw * raw * raw
          : 1 - Math.pow(-2 * raw + 2, 3) / 2;
        setOpenIntroProgress(eased);

        if (raw < 1) {
          animId = requestAnimationFrame(step);
        } else {
          setIsOpeningIntro(false);
        }
      }
      animId = requestAnimationFrame(step);
    }, closedHoldDuration);

    return () => {
      clearTimeout(timer);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  // Initialize Lenis with slow, ultra-smooth luxury momentum
  useEffect(() => {
    const lenis = new Lenis({
      duration: isMobile ? 1.6 : 2.2, // Snappier on mobile touch, majestic on desktop
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.55,
      touchMultiplier: 1.15
    });
    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const animId = requestAnimationFrame(raf);

    lenis.on('scroll', (e) => {
      setScrollVelocity(e.velocity || 0);

      // Compute exact spread progress based on window scroll
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      const rawProgress = scrollY / SPREAD_SCROLL_DISTANCE;
      const clamped = Math.max(0, Math.min(totalSpreads - 1, rawProgress));
      setScrollProgress(clamped);
    });

    return () => {
      cancelAnimationFrame(animId);
      lenis.destroy();
    };
  }, [totalSpreads, isMobile]);

  // Derived spread states
  const baseSpread = Math.floor(scrollProgress);
  const turnFraction = scrollProgress - baseSpread;
  const nextSpread = Math.min(totalSpreads - 1, baseSpread + 1);
  const currentSpread = Math.round(scrollProgress);

  // Reset mobile side to left whenever spread index changes
  const prevSpreadRef = useRef(currentSpread);
  useEffect(() => {
    if (prevSpreadRef.current !== currentSpread) {
      setMobileSide('left');
      prevSpreadRef.current = currentSpread;
    }
  }, [currentSpread]);

  // Active turning leaf calculation
  const isActivelyTurning =
    !isOpeningIntro &&
    baseSpread < totalSpreads - 1 &&
    turnFraction > 0.005 &&
    turnFraction < 0.995;

  // Smooth cosine easing for natural physical leaf weight and deceleration
  const easedTurn = 0.5 - 0.5 * Math.cos(turnFraction * Math.PI);
  const baseAngle = -easedTurn * 180; // 0 to -180 deg

  // Natural paper flex physics (Seamless continuous unbroken sheet):
  const sinP = Math.sin(turnFraction * Math.PI);
  const leafTranslateZ = sinP * (isMobile ? 28 : 46);
  const leafCurlZ = sinP * (turnFraction < 0.5 ? -4.5 : -2.0);
  const leafBowX = sinP * 3.5;
  const leafSkewY = sinP * (1 - turnFraction * 1.5) * 3.8;
  const leafScaleX = 1 - sinP * 0.045;

  // Keep book vertically centered without downward drift into bottom controls
  const slowDownShift = 0;
  const turnDip = isActivelyTurning ? Math.sin(turnFraction * Math.PI) * (isMobile ? 4 : 8) : 0;

  // Dark spread detection
  const isDarkSpread = (idx) => idx === 3 || idx === 8;

  // Smooth scroll to a specific spread
  const scrollToSpread = useCallback(
    (targetSpread) => {
      if (targetSpread < 0 || targetSpread >= totalSpreads) return;
      const targetScrollY = targetSpread * SPREAD_SCROLL_DISTANCE;

      if (lenisRef.current) {
        lenisRef.current.scrollTo(targetScrollY, {
          duration: isMobile ? 1.5 : 2.2
        });
      }
    },
    [totalSpreads, isMobile]
  );

  const handleNext = useCallback(() => {
    if (isMobile && mobileSide === 'left') {
      // On mobile: first turn to right page
      handleToggleMobileSide('right');
      return;
    }
    if (currentSpread < totalSpreads - 1) {
      soundEngine.playPageTurn('forward');
      if (isMobile) {
        setMobileSide('left');
      }
      scrollToSpread(currentSpread + 1);
    }
  }, [currentSpread, totalSpreads, scrollToSpread, isMobile, mobileSide]);

  const handlePrev = useCallback(() => {
    if (isMobile && mobileSide === 'right') {
      // On mobile: flip back to left page
      handleToggleMobileSide('left');
      return;
    }
    if (currentSpread > 0) {
      soundEngine.playPageTurn('backward');
      if (isMobile) {
        setMobileSide('right');
      }
      scrollToSpread(currentSpread - 1);
    }
  }, [currentSpread, scrollToSpread, isMobile, mobileSide]);

  // Mobile page switcher handler with 3D animation
  const handleToggleMobileSide = (targetSide) => {
    if (mobileSide === targetSide || isMobileFlipping) return;
    const dir = targetSide === 'right' ? 'next' : 'prev';
    setMobileFlipDir(dir);
    targetSideRef.current = targetSide;
    setIsMobileFlipping(true);
    soundEngine.playPageTurn(dir === 'next' ? 'forward' : 'backward');

    setTimeout(() => {
      setMobileSide(targetSide);
      setTimeout(() => {
        setIsMobileFlipping(false);
      }, 200);
    }, 200);
  };

  // Mobile & Tablet Touch Swipe Handling
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
  };

  const handleTouchEnd = (e) => {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const dt = Date.now() - touchStartRef.current.time;

    // Detect horizontal swipe on any touch screen (horizontal delta > vertical delta * 1.2, distance > 35px, time < 650ms)
    if (Math.abs(dx) > Math.abs(dy) * 1.2 && Math.abs(dx) > 35 && dt < 650) {
      if (dx < 0) {
        // Swiped left (advance forward)
        handleNext();
      } else {
        // Swiped right (retreat backward)
        handlePrev();
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isBookingOpen) setIsBookingOpen(false);
        if (isVideoModalOpen) setIsVideoModalOpen(false);
        return;
      }
      if (isBookingOpen || isVideoModalOpen) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, isBookingOpen, isVideoModalOpen]);

  // Render spread content with optional side prop ('left' | 'right' | 'both')
  const renderSpread = (index, side = 'both') => {
    switch (index) {
      case 0:
        return (
          <Spread0_Hero
            side={side}
            isWriting={!isOpeningIntro}
            onNext={handleNext}
            onOpenBooking={() => setIsBookingOpen(true)}
            onWatchVideo={() => setIsVideoModalOpen(true)}
          />
        );
      case 1:
        return <Spread1_Pathway side={side} onNext={handleNext} />;
      case 2:
        return <Spread2_DailyLesson side={side} onNext={handleNext} />;
      case 3:
        return <Spread3_Revision side={side} onNext={handleNext} />;
      case 4:
        return <Spread4_Progress side={side} onNext={handleNext} />;
      case 5:
        return (
          <Spread5_Teacher
            side={side}
            onNext={handleNext}
            onOpenBooking={() => setIsBookingOpen(true)}
          />
        );
      case 6:
        return <Spread6_Stories side={side} onNext={handleNext} />;
      case 7:
        return <Spread7_Principles side={side} onNext={handleNext} />;
      case 8:
        return (
          <Spread8_Closing
            side={side}
            onOpenBooking={() => setIsBookingOpen(true)}
            onNavigate={(idx) => scrollToSpread(idx)}
          />
        );
      default:
        return null;
    }
  };

  const currentInfo = SPREAD_INFO[currentSpread] || SPREAD_INFO[0];
  const spreadTitles = SPREAD_INFO.map((s) => s.title);

  return (
    <div className={`scroll-story-viewport ${isMobile ? 'is-mobile-device' : ''}`}>
      {/* 1. Three.js 3D WebGL Canvas Layer (Fixed Background: Hardcover, gold corners, silk ribbon, dust motes) */}
      <ThreeBookCanvas
        spreadIndex={currentSpread}
        scrollProgress={scrollProgress}
        scrollVelocity={scrollVelocity}
        isOpeningIntro={isOpeningIntro}
        openIntroProgress={openIntroProgress}
      />

      {/* 2. Top Sticky Navigation */}
      <Navigation
        activeSpread={currentSpread}
        onNavigate={(idx) => scrollToSpread(idx)}
        onOpenBooking={() => setIsBookingOpen(true)}
      />

      {/* 3. Sticky Book Viewport Stage */}
      <div
        className="sticky-book-stage"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Mobile Page Switcher Bar */}
        {isMobile && !isOpeningIntro && (
          <div className="mobile-page-control-bar">
            <div className="mobile-chapter-info">
              <span className="mobile-chapter-tag">CH {currentInfo.num}</span>
              <span className="mobile-chapter-title">{currentInfo.title}</span>
            </div>

            <div className="mobile-page-pill-switcher">
              <button
                className={`mobile-pill-btn ${mobileSide === 'left' ? 'active' : ''}`}
                onClick={() => handleToggleMobileSide('left')}
              >
                <span>✦ I · {currentInfo.left}</span>
              </button>
              <button
                className={`mobile-pill-btn ${mobileSide === 'right' ? 'active' : ''}`}
                onClick={() => handleToggleMobileSide('right')}
              >
                <span>✦ II · {currentInfo.right}</span>
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Scale Container */}
        <div
          className={`book-scale-viewport ${isMobile ? 'is-mobile-viewport' : ''}`}
          style={{
            transform: `scale(${isMobile ? mobileScale : desktopScale})`,
            transformOrigin: 'center center'
          }}
        >
          <div
            className={`book-spread-3d-wrapper ${isMobile ? 'mobile-single-page-wrapper' : ''} ${
              isActivelyTurning || isOpeningIntro || isMobileFlipping ? 'is-turning' : ''
            }`}
            style={{
              transform: `translateY(${slowDownShift + turnDip}px)`
            }}
          >
            {isOpeningIntro ? (
              /* INITIAL OPENING SEQUENCE: Fully closed book centered, then unfolds open into Spread 0 */
              <div
                className={`book-spread turning-spread-stage initial-opening-stage ${
                  isMobile ? 'mobile-book-spread' : ''
                }`}
                style={{
                  transform: isMobile
                    ? `translateX(${-160 * (1 - openIntroProgress)}px)`
                    : `translateX(${-320 * (1 - openIntroProgress)}px)`
                }}
              >
                {/* Realistic deep cast shadow underneath the closed book */}
                <div
                  className="closed-book-desk-shadow"
                  style={{ opacity: Math.max(0, 1 - openIntroProgress * 1.5) }}
                />

                {/* Rounded 3D leather spine on the left edge of the closed book */}
                <div
                  className="closed-book-spine"
                  style={{ opacity: Math.max(0, 1 - openIntroProgress * 2.5) }}
                >
                  <div className="spine-rib" />
                  <div className="spine-rib" />
                  <div className="spine-rib" />
                  <div className="spine-rib" />
                  <div className="spine-rib" />
                </div>

                {/* Left Base Page: Spread 0 Left (waiting underneath the unfolding cover) */}
                <div
                  className="spread-half-base spread-half-left"
                  style={{
                    opacity: isMobile
                      ? 1
                      : openIntroProgress < 0.75
                      ? 0
                      : Math.min(1, (openIntroProgress - 0.75) / 0.25)
                  }}
                >
                  {renderSpread(0, 'left')}
                  {isMobile && (
                    <div
                      className="under-page-shadow"
                      style={{
                        opacity: (1 - openIntroProgress) * 0.75
                      }}
                    />
                  )}
                </div>

                {/* Right Base Page: Spread 0 Right (revealed underneath front cover on desktop) */}
                {!isMobile && (
                  <div className="spread-half-base spread-half-right">
                    {renderSpread(0, 'right')}
                    <div
                      className="under-page-shadow"
                      style={{
                        opacity: (1 - openIntroProgress) * 0.75
                      }}
                    />
                  </div>
                )}

                {/* Closed book paper block thickness (visible while book is closed/opening) */}
                {openIntroProgress < 0.95 && (
                  <div
                    className="closed-book-gilded-block"
                    style={{
                      opacity: Math.max(0, 1 - openIntroProgress * 1.1)
                    }}
                  >
                    <div className="gilded-block-right" />
                    <div className="gilded-block-top" />
                    <div className="gilded-block-bottom" />
                    <div className="closed-ribbon-bookmark" />
                  </div>
                )}

                {/* Center Spine Gutter & Page Edge (desktop) */}
                {!isMobile && (
                  <>
                    <div
                      className="book-page-edge"
                      style={{ opacity: openIntroProgress }}
                    />
                    <div
                      className="book-center-gutter"
                      style={{ opacity: openIntroProgress }}
                    />
                  </>
                )}

                {/* The Opening Leather Front Cover */}
                <div
                  className="book-front-cover-leaf"
                  style={{
                    transform: `rotateY(${-openIntroProgress * 180}deg) rotateZ(${
                      Math.sin(openIntroProgress * Math.PI) * -3.5
                    }deg) translateZ(${Math.sin(openIntroProgress * Math.PI) * 44}px)`
                  }}
                >
                  {/* Front Face: Emerald Leather & Gold Embossing */}
                  <div className="cover-face cover-face-front">
                    <div className="cover-gold-border" />
                    <div className="cover-gold-corner top-left" />
                    <div className="cover-gold-corner top-right" />
                    <div className="cover-gold-corner bottom-left" />
                    <div className="cover-gold-corner bottom-right" />

                    <div className="cover-inscription">
                      <img
                        src="/assets/logo_gold.png"
                        alt="Our Quran Institute Seal"
                        className="cover-seal-emblem"
                      />
                      <h1 className="cover-title">OUR QURAN INSTITUTE</h1>
                      <div className="cover-arabic-calligraphy">حِفْظُ القُرْآنِ الكَرِيم</div>
                      <div className="cover-rule" />
                      <p className="cover-subtitle">
                        A Sacred Pathway from Intention to Lifelong Recall
                      </p>
                    </div>

                    <div
                      className="cover-lighting"
                      style={{
                        opacity: Math.sin(openIntroProgress * Math.PI) * 0.75 + (1 - openIntroProgress) * 0.15
                      }}
                    />
                  </div>

                  {/* Back Face: Hero Left Page (Unfolds from 90deg to 180deg onto the desk) */}
                  <div className="cover-face cover-face-back">
                    {renderSpread(0, 'left')}
                    <div
                      className="cover-lighting"
                      style={{ opacity: Math.max(0, (1 - openIntroProgress) * 0.65) }}
                    />
                  </div>
                </div>
              </div>
            ) : !isActivelyTurning && !isMobileFlipping ? (
              /* STATIC RESTING SPREAD: 100% crisp, interactive */
              isMobile ? (
                <div className={`book-spread mobile-book-spread ${isDarkSpread(currentSpread) ? 'dark-spread' : ''}`}>
                  <div className="book-page-edge mobile-edge" />
                  <div className="lifted-corner mobile-lifted-corner" onClick={handleNext} title="Turn page" />
                  {renderSpread(currentSpread, mobileSide)}
                </div>
              ) : (
                renderSpread(currentSpread, 'both')
              )
            ) : isMobileFlipping && isMobile ? (
              /* MOBILE SMOOTH 3D FLIP ANIMATION (BUTTON/GESTURE FLIP) */
              <div
                className={`book-spread mobile-book-spread turning-spread-stage ${
                  isDarkSpread(currentSpread) ? 'dark-spread' : ''
                }`}
              >
                {/* Destination page waiting underneath */}
                <div className="spread-half-base mobile-base-page">
                  {renderSpread(currentSpread, targetSideRef.current)}
                </div>

                {/* Animated flipping leaf */}
                <div
                  className={`turning-leaf-sheet mobile-turning-leaf mobile-flip-${mobileFlipDir}`}
                >
                  <div className="leaf-face leaf-face-front">
                    {renderSpread(currentSpread, mobileSide)}
                    <div className="leaf-cylinder-lighting dynamic-flip" />
                  </div>
                  <div className="leaf-face leaf-face-back">
                    {renderSpread(currentSpread, targetSideRef.current)}
                    <div className="leaf-cylinder-lighting dynamic-flip" />
                  </div>
                </div>
              </div>
            ) : isMobile ? (
              /* MOBILE 3D SCROLL PAGE TURN */
              <div
                className={`book-spread mobile-book-spread turning-spread-stage ${
                  isDarkSpread(baseSpread) ? 'dark-spread' : ''
                }`}
              >
                <div className="spread-half-base mobile-base-page">
                  {renderSpread(nextSpread, 'left')}
                </div>

                <div
                  className="turning-leaf-sheet mobile-turning-leaf"
                  style={{
                    transform: `rotateY(${baseAngle}deg) rotateZ(${leafCurlZ}deg) translateZ(${leafTranslateZ}px)`
                  }}
                >
                  <div className="leaf-face leaf-face-front">
                    {renderSpread(baseSpread, mobileSide)}
                    <div
                      className="leaf-cylinder-lighting"
                      style={{ opacity: Math.sin(turnFraction * Math.PI) }}
                    />
                  </div>
                  <div className="leaf-face leaf-face-back">
                    {renderSpread(nextSpread, 'left')}
                    <div
                      className="leaf-cylinder-lighting"
                      style={{ opacity: Math.sin(turnFraction * Math.PI) }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* DESKTOP/TABLET ACTIVE 3D BI-FOLD PAGE TURN */
              <div
                className={`book-spread turning-spread-stage ${
                  isDarkSpread(baseSpread) ? 'dark-spread-left' : ''
                } ${isDarkSpread(nextSpread) ? 'dark-spread-right' : ''}`}
              >
                {/* Stationary Left Base Page (Spread baseSpread Left) */}
                <div
                  className={`spread-half-base spread-half-left ${
                    isDarkSpread(baseSpread) ? 'dark-spread' : ''
                  }`}
                >
                  {renderSpread(baseSpread, 'left')}
                  <div
                    className="left-base-shadow"
                    style={{
                      opacity:
                        turnFraction > 0.35
                          ? Math.sin(((turnFraction - 0.35) / 0.65) * Math.PI * 0.5) * 0.42
                          : 0
                    }}
                  />
                </div>

                {/* Stationary Right Base Page (Spread nextSpread Right, revealed from underneath) */}
                <div
                  className={`spread-half-base spread-half-right ${
                    isDarkSpread(nextSpread) ? 'dark-spread' : ''
                  }`}
                >
                  {renderSpread(nextSpread, 'right')}
                  <div
                    className="under-page-shadow"
                    style={{
                      opacity:
                        turnFraction < 0.65
                          ? Math.sin((1 - turnFraction / 0.65) * Math.PI * 0.5) * 0.45
                          : 0
                    }}
                  />
                </div>

                {/* Central Spine Gutter & Page Edge */}
                <div className="book-page-edge" />
                <div className="book-center-gutter" />

                {/* The Active Turning Leaf */}
                <div
                  className="turning-leaf-sheet"
                  style={{
                    transform: `rotateY(${baseAngle}deg) rotateZ(${leafCurlZ}deg) rotateX(${leafBowX}deg) skewY(${leafSkewY}deg) translateZ(${leafTranslateZ}px) scaleX(${leafScaleX})`
                  }}
                >
                  {/* Front Face: current spread right page */}
                  <div
                    className={`leaf-face leaf-face-front ${
                      isDarkSpread(baseSpread) ? 'dark-leaf' : ''
                    }`}
                  >
                    {renderSpread(baseSpread, 'right')}
                    <div
                      className="leaf-cylinder-lighting"
                      style={{
                        opacity: Math.sin(turnFraction * Math.PI),
                        background: `linear-gradient(
                          to right,
                          rgba(6, 42, 36, 0.4) 0%,
                          rgba(6, 42, 36, 0.12) ${Math.max(0, (1 - turnFraction * 0.85) * 100 - 24)}%,
                          rgba(255, 255, 255, 0.3) ${(1 - turnFraction * 0.85) * 100}%,
                          rgba(6, 42, 36, 0.15) ${Math.min(100, (1 - turnFraction * 0.85) * 100 + 20)}%,
                          rgba(6, 42, 36, 0.35) 100%
                        )`
                      }}
                    />
                    <div
                      className="leaf-corner-curl-sheen"
                      style={{
                        opacity: Math.sin(turnFraction * Math.PI) * 0.75
                      }}
                    />
                  </div>

                  {/* Back Face: next spread left page */}
                  <div
                    className={`leaf-face leaf-face-back ${
                      isDarkSpread(nextSpread) ? 'dark-leaf' : ''
                    }`}
                  >
                    {renderSpread(nextSpread, 'left')}
                    <div
                      className="leaf-cylinder-lighting"
                      style={{
                        opacity: Math.sin(turnFraction * Math.PI),
                        background: `linear-gradient(
                          to left,
                          rgba(6, 42, 36, 0.4) 0%,
                          rgba(6, 42, 36, 0.12) ${Math.max(0, (0.15 + turnFraction * 0.85) * 100 - 24)}%,
                          rgba(255, 255, 255, 0.3) ${(0.15 + turnFraction * 0.85) * 100}%,
                          rgba(6, 42, 36, 0.15) ${Math.min(100, (0.15 + turnFraction * 0.85) * 100 + 20)}%,
                          rgba(6, 42, 36, 0.35) 100%
                        )`
                      }}
                    />
                    <div
                      className="leaf-corner-curl-sheen back-sheen"
                      style={{
                        opacity: Math.sin(turnFraction * Math.PI) * 0.75
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Bottom Quick Navigation */}
        {isMobile && !isOpeningIntro && (
          <div className="mobile-bottom-scrubber">
            <button
              className="mobile-nav-pill-btn prev"
              onClick={handlePrev}
              disabled={currentSpread === 0 && mobileSide === 'left'}
              aria-label="Previous Page"
            >
              <Icon name="arrow-left" size={13} color="currentColor" />
              <span>Prev</span>
            </button>

            <div className="mobile-chapter-dots-badge">
              <span className="mobile-chapter-num">
                {currentInfo.num} <span className="mobile-part-indicator">({mobileSide === 'left' ? 'I' : 'II'})</span>
              </span>
              <div className="mobile-dots-track">
                {SPREAD_INFO.map((s, idx) => (
                  <button
                    key={idx}
                    className={`mobile-dot ${idx === currentSpread ? 'active' : ''}`}
                    onClick={() => {
                      setMobileSide('left');
                      scrollToSpread(idx);
                    }}
                    title={s.title}
                  />
                ))}
              </div>
            </div>

            <button
              className="mobile-nav-pill-btn next"
              onClick={handleNext}
              disabled={currentSpread === totalSpreads - 1 && mobileSide === 'right'}
              aria-label="Next Page"
            >
              <span>{mobileSide === 'left' ? 'Part II' : 'Next'}</span>
              <Icon name="arrow-right" size={13} color="currentColor" />
            </button>
          </div>
        )}

        {/* Desktop / Tablet Bottom BookControls */}
        {!isMobile && !isOpeningIntro && (
          <div className="desktop-controls-wrapper">
            <BookControls
              currentSpread={currentSpread}
              totalSpreads={totalSpreads}
              spreadTitles={spreadTitles}
              onPrev={handlePrev}
              onNext={handleNext}
              onGoToSpread={scrollToSpread}
            />
          </div>
        )}
      </div>

      {/* 4. Top-to-Bottom Scroll Track Height */}
      <div
        className="scroll-track-spacer"
        style={{
          height: `${
            (totalSpreads - 1) * SPREAD_SCROLL_DISTANCE +
            (typeof window !== 'undefined' ? window.innerHeight : 900)
          }px`
        }}
      />

      {/* 5. Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      {/* 6. Video Preview Modal */}
      {isVideoModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsVideoModalOpen(false)}>
          <div className="modal-card video-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setIsVideoModalOpen(false)}
            >
              ×
            </button>
            <div className="video-player-container">
              <div
                className="video-poster-box"
                style={{ backgroundImage: `url(/assets/hero_book.jpg)` }}
              >
                <div className="video-overlay-tint" />
                <div className="video-play-pulse">
                  <div className="play-triangle" />
                </div>
                <div className="video-caption-box">
                  <span className="video-kicker">METHODOLOGY PREVIEW</span>
                  <h4 className="video-title">The Hifz Journey Flow Explained</h4>
                  <p className="video-desc">
                    A calm 3-minute walk-through of the spaced recall engine, daily rhythm, and mentor relationship.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
