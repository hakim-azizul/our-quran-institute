'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Lenis from 'lenis';
import Navigation from './components/Navigation';
import BookingModal from './components/BookingModal';
import { soundEngine } from './components/AudioEffects';
import { DiamondOrnament, Icon } from './components/Icons';

const ThreeBookCanvas = dynamic(() => import('./components/ThreeBookCanvas'), {
  ssr: false
});

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
import CourseShowcase from './components/CourseShowcase';

// Section IDs mapped to spread indices
const SECTION_IDS = [
  'section-hero',       // 0
  'section-method',     // 1
  'section-dailyflow',  // 2
  'section-retention',  // 3
  'section-progress',   // 4
  'section-mentors',    // 5
  'section-courses',    // 6
  'section-stories',    // 7
  'section-principles', // 8
  'section-enrollment'  // 9
];

export default function App() {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedCourseForBooking, setSelectedCourseForBooking] = useState('');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handleOpenBooking = (courseName = '') => {
    setSelectedCourseForBooking(courseName);
    setIsBookingOpen(true);
  };

  // Responsive Viewport Tracking
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.innerHeight : 900
  });

  // Mobile Single-Page Mode for Hero
  const [mobileSide, setMobileSide] = useState('left');

  // Opening book intro animation on first land / refresh (starts fully closed, then unfolds open)
  const [openIntroProgress, setOpenIntroProgress] = useState(0); // 0.0 (fully closed) to 1.0 (fully open)
  const [isOpeningIntro, setIsOpeningIntro] = useState(true);

  const lenisRef = useRef(null);

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

  // Scale for Hero Book
  const navHeight = isMobile ? 66 : 74;
  const desktopScale = Math.min(
    (viewport.width - (isTablet ? 36 : 56)) / 1280,
    (viewport.height - navHeight - 110) / 876,
    1.0
  );

  const mobileAvailableW = isPortraitTablet
    ? Math.min(640, viewport.width - 48)
    : viewport.width - 24;
  const mobileScale = Math.min(
    mobileAvailableW / 640,
    1.0
  );

  // Dynamic measurement of hero content on mobile to collapse phantom transform scale space
  const heroSpreadRef = useRef(null);
  const [mobileHeroHeight, setMobileHeroHeight] = useState(1010);

  useEffect(() => {
    if (!isMobile) return;
    const el = heroSpreadRef.current;
    if (!el) return;
    const updateHeight = () => {
      const h = el.offsetHeight;
      if (h > 0) setMobileHeroHeight(h);
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isMobile, mobileSide, isOpeningIntro]);

  const mobileExtraSpace = isMobile
    ? Math.round(mobileHeroHeight * (1 - mobileScale))
    : 0;

  // On page land / refresh: fully closed book rests centered, then smoothly unfolds open into Spread 0
  useEffect(() => {
    if (isMobile) {
      setIsOpeningIntro(false);
      setOpenIntroProgress(1);
      return;
    }
    let startTime = null;
    const closedHoldDuration = 600;
    const openingDuration = 1800;
    let animId;

    const timer = setTimeout(() => {
      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const raw = Math.min(1, elapsed / openingDuration);
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

  // Instantly finish intro if user scrolls early
  useEffect(() => {
    const handleScrollEarly = () => {
      if (window.scrollY > 25 && isOpeningIntro) {
        setOpenIntroProgress(1);
        setIsOpeningIntro(false);
      }
    };
    window.addEventListener('scroll', handleScrollEarly, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollEarly);
  }, [isOpeningIntro]);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: isMobile ? 1.2 : 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.2
    });
    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const animId = requestAnimationFrame(raf);

    lenis.on('scroll', (e) => {
      setScrollVelocity(e.velocity || 0);
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      const heroH = window.innerHeight || 800;
      setScrollProgress(Math.min(3, scrollY / heroH));

      // Active Section Detection
      const checkPosition = scrollY + 240;
      let curr = 0;
      SECTION_IDS.forEach((id, idx) => {
        const el = document.getElementById(id);
        if (el) {
          if (checkPosition >= el.offsetTop) {
            curr = idx;
          }
        }
      });
      setActiveSection(curr);
    });

    return () => {
      cancelAnimationFrame(animId);
      lenis.destroy();
    };
  }, [isMobile]);

  // Smooth scroll to a specific section by index (0..8)
  const scrollToSection = useCallback((targetIndex) => {
    if (targetIndex < 0 || targetIndex >= SECTION_IDS.length) return;
    const targetId = SECTION_IDS[targetIndex];
    const elem = document.getElementById(targetId);
    if (!elem) return;

    soundEngine.playPageTurn('forward');

    if (lenisRef.current) {
      lenisRef.current.scrollTo(elem, {
        offset: targetIndex === 0 ? 0 : -84,
        duration: isMobile ? 1.2 : 1.7
      });
    } else {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isMobile]);

  // Direct URL hash deep linking support on mount (e.g. #section-stories, #section-enrollment)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashId = window.location.hash.replace('#', '');
      const idx = SECTION_IDS.indexOf(hashId);
      if (idx !== -1) {
        setIsOpeningIntro(false);
        setOpenIntroProgress(1);
        setTimeout(() => {
          scrollToSection(idx);
        }, 600);
      }
    }
  }, [scrollToSection]);

  // Keyboard navigation & modal shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isBookingOpen) setIsBookingOpen(false);
        if (isVideoModalOpen) setIsVideoModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBookingOpen, isVideoModalOpen]);

  // Vertical glassmorphism sections specification
  const SECTIONS = [
    {
      id: 'section-method',
      index: 1,
      title: 'Methodology & Pathway',
      kicker: 'CORE PATHWAY',
      glowColor: 'amber',
      component: (
        <Spread1_Pathway
          onNext={() => scrollToSection(2)}
        />
      )
    },
    {
      id: 'section-dailyflow',
      index: 2,
      title: '15-Minute Daily Habit',
      kicker: 'DAILY FLOW',
      glowColor: 'emerald',
      component: (
        <Spread2_DailyLesson
          onNext={() => scrollToSection(3)}
        />
      )
    },
    {
      id: 'section-retention',
      index: 3,
      title: 'Spaced Repetition Sanctuary',
      kicker: 'RETENTION SCIENCE',
      glowColor: 'amber',
      component: (
        <Spread3_Revision
          onNext={() => scrollToSection(4)}
        />
      )
    },
    {
      id: 'section-progress',
      index: 4,
      title: 'Effort & Progress Tracking',
      kicker: 'MEASURABLE MILESTONES',
      glowColor: 'emerald',
      component: (
        <Spread4_Progress
          onNext={() => scrollToSection(5)}
        />
      )
    },
    {
      id: 'section-mentors',
      index: 5,
      title: 'Lead Mentorship & Guidance',
      kicker: 'SANAD SCHOLARS',
      glowColor: 'amber',
      component: (
        <Spread5_Teacher
          onNext={() => scrollToSection(6)}
          onOpenBooking={() => handleOpenBooking()}
        />
      )
    },
    {
      id: 'section-courses',
      index: 6,
      title: 'Academic Programs & Sacred Disciplines',
      kicker: 'CERTIFIED CURRICULUM',
      glowColor: 'emerald',
      component: (
        <CourseShowcase
          onOpenBooking={handleOpenBooking}
          onSelectCourse={(c) => handleOpenBooking(c.title)}
        />
      )
    },
    {
      id: 'section-stories',
      index: 7,
      title: 'Global Sanctuary & Worldwide Map',
      kicker: '42 COUNTRIES ACTIVE',
      glowColor: 'emerald',
      component: (
        <Spread6_Stories
          onNext={() => scrollToSection(8)}
        />
      )
    },
    {
      id: 'section-principles',
      index: 8,
      title: 'Our Vision & Core Principles',
      kicker: 'OUR VISION',
      glowColor: 'amber',
      component: (
        <Spread7_Principles
          onNext={() => scrollToSection(9)}
        />
      )
    },
    {
      id: 'section-enrollment',
      index: 9,
      title: 'The Sacred Call & Complimentary Session',
      kicker: 'RESERVE SESSION',
      glowColor: 'gold',
      component: (
        <Spread8_Closing
          onOpenBooking={() => handleOpenBooking()}
          onNavigate={(idx) => scrollToSection(idx)}
        />
      )
    }
  ];

  return (
    <div className={`vertical-landing-root ${isMobile ? 'is-mobile-device' : ''}`}>
      {/* 1. Three.js Ambient Particle & Lighting Canvas (Fixed Background) */}
      <ThreeBookCanvas
        spreadIndex={activeSection}
        scrollProgress={scrollProgress}
        scrollVelocity={scrollVelocity}
        isOpeningIntro={isOpeningIntro}
        openIntroProgress={openIntroProgress}
      />

      {/* 2. Sticky Glassmorphism Header Navigation */}
      <Navigation
        activeSpread={activeSection}
        onNavigate={(idx) => scrollToSection(idx)}
        onOpenBooking={() => setIsBookingOpen(true)}
      />

      {/* 3. Hero Section (Kept intact with opening book presentation) */}
      <section id="section-hero" className="landing-hero-section">
        {/* Ambient Top Glow for Hero */}
        <div className="section-ambient-glow glow-amber hero-top-glow" />

        {/* Dynamic Scale Book Stage */}
        <div
          className={`book-scale-viewport ${isMobile ? 'is-mobile-viewport' : ''}`}
          style={{
            transform: `scale(${isMobile ? mobileScale : desktopScale})`,
            transformOrigin: 'top center',
            ...(isMobile ? {
              marginBottom: `${-mobileExtraSpace + 20}px`
            } : {})
          }}
        >
          <div
            className={`book-spread-3d-wrapper ${isMobile ? 'mobile-single-page-wrapper' : ''} ${
              isOpeningIntro ? 'is-turning' : ''
            }`}
          >
            {isOpeningIntro ? (
              /* INITIAL OPENING SEQUENCE: Fully closed book unfolds open into Spread 0 */
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
                {/* Desk Shadow */}
                <div
                  className="closed-book-desk-shadow"
                  style={{ opacity: Math.max(0, 1 - openIntroProgress * 1.5) }}
                />

                {/* Leather Spine */}
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

                {/* Left Base Page: Spread 0 Left */}
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
                  <Spread0_Hero
                    side="left"
                    isWriting={!isOpeningIntro}
                    onNext={() => scrollToSection(1)}
                    onOpenBooking={() => setIsBookingOpen(true)}
                    onWatchVideo={() => setIsVideoModalOpen(true)}
                  />
                  {isMobile && (
                    <div
                      className="under-page-shadow"
                      style={{ opacity: (1 - openIntroProgress) * 0.75 }}
                    />
                  )}
                </div>

                {/* Right Base Page: Spread 0 Right */}
                {!isMobile && (
                  <div className="spread-half-base spread-half-right">
                    <Spread0_Hero
                      side="right"
                      isWriting={!isOpeningIntro}
                      onNext={() => scrollToSection(1)}
                      onOpenBooking={() => setIsBookingOpen(true)}
                      onWatchVideo={() => setIsVideoModalOpen(true)}
                    />
                    <div
                      className="under-page-shadow"
                      style={{ opacity: (1 - openIntroProgress) * 0.75 }}
                    />
                  </div>
                )}

                {/* Gilded Block Edge */}
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

                {/* Central Gutter */}
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

                {/* Front Leather Cover Unfolding */}
                <div
                  className="book-front-cover-leaf"
                  style={{
                    transform: `rotateY(${-openIntroProgress * 180}deg) rotateZ(${
                      Math.sin(openIntroProgress * Math.PI) * -3.5
                    }deg) translateZ(${Math.sin(openIntroProgress * Math.PI) * 44}px)`
                  }}
                >
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
                        opacity:
                          Math.sin(openIntroProgress * Math.PI) * 0.75 +
                          (1 - openIntroProgress) * 0.15
                      }}
                    />
                  </div>

                  <div className="cover-face cover-face-back">
                    <Spread0_Hero
                      side="left"
                      isWriting={false}
                      onNext={() => scrollToSection(1)}
                      onOpenBooking={() => setIsBookingOpen(true)}
                      onWatchVideo={() => setIsVideoModalOpen(true)}
                    />
                    <div
                      className="cover-lighting"
                      style={{ opacity: Math.max(0, (1 - openIntroProgress) * 0.65) }}
                    />
                  </div>
                </div>
              </div>
            ) : isMobile ? (
              <div ref={heroSpreadRef} className="mobile-hero-spread-wrapper">
                <Spread0_Hero
                  side="both"
                  isWriting={true}
                  onNext={() => scrollToSection(1)}
                  onOpenBooking={() => setIsBookingOpen(true)}
                  onWatchVideo={() => setIsVideoModalOpen(true)}
                />
              </div>
            ) : (
              <Spread0_Hero
                side="both"
                isWriting={true}
                onNext={() => scrollToSection(1)}
                onOpenBooking={() => setIsBookingOpen(true)}
                onWatchVideo={() => setIsVideoModalOpen(true)}
              />
            )}
          </div>
        </div>

        {/* Scroll Down Prompt Indicator */}
        <div className="hero-scroll-indicator" onClick={() => scrollToSection(1)}>
          <span className="scroll-indicator-text">Explore the Methodology</span>
          <div className="scroll-mouse-icon">
            <div className="scroll-mouse-wheel" />
          </div>
        </div>
      </section>

      {/* 4. Vertical Glassmorphism Sections (As in reference image) */}
      <main className="landing-vertical-flow">
        {SECTIONS.map((sec) => (
          <section
            key={sec.id}
            id={sec.id}
            className="landing-vertical-section"
            data-section-index={sec.index}
          >
            <div className="section-glass-container">
              {/* Atmospheric Ambient Glows behind the Glass Card */}
              <div className={`section-ambient-glow glow-${sec.glowColor}`} />
              <div className="section-ambient-glow glow-emerald" />

              {/* The Glassmorphic Section Card */}
              <div className="section-glass-card">
                {sec.component}
              </div>
            </div>
          </section>
        ))}
      </main>

      {/* 5. Floating Quick Action Button (Bottom Right) */}
      {activeSection > 0 && (
        <div className="floating-quick-dock">
          <button
            className="floating-action-pill"
            onClick={() => handleOpenBooking()}
            title="Book Free Assessment"
          >
            <DiamondOrnament size={18} diamondSize={10} centerColor="#062A24" borderColor="#C5A45A" />
            <span>Book Free Session</span>
            <Icon name="arrow-up-right" size={14} color="#062A24" />
          </button>
          <a
            href="https://wa.me/201094714943"
            target="_blank"
            rel="noopener noreferrer"
            className="floating-top-btn floating-whatsapp-btn"
            title="Chat on WhatsApp (+20 10 94714943)"
            aria-label="Chat on WhatsApp (+20 10 94714943)"
          >
            <Icon name="whatsapp" size={22} color="#25D366" />
          </a>
        </div>
      )}

      {/* 6. Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialCourse={selectedCourseForBooking}
      />

      {/* 7. Video Preview Modal */}
      {isVideoModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsVideoModalOpen(false)}>
          <div className="modal-card video-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setIsVideoModalOpen(false)}
              aria-label="Close modal"
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
