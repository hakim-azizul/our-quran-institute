'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Lenis from 'lenis';
import Navigation from './components/Navigation';
import BookingModal from './components/BookingModal';
import LoginModal from './components/LoginModal';
import MosqueHero from './components/MosqueHero';
import BookFreeSessionSection from './components/BookFreeSessionSection';
import GlobalContactMapSection from './components/GlobalContactMapSection';
import LatestUpdatesSection from './components/LatestUpdatesSection';
import { soundEngine } from './components/AudioEffects';
import { DiamondOrnament, Icon } from './components/Icons';

const ThreeBookCanvas = dynamic(() => import('./components/ThreeBookCanvas'), {
  ssr: false
});

import SpiritualHomeSection from './components/SpiritualHomeSection';
import TeacherShowcase from './components/TeacherShowcase';
import Spread6_Stories from './components/spreads/Spread6_Stories';
import CourseShowcase from './components/CourseShowcase';

// Section IDs mapped to indices:
const SECTION_IDS = [
  'section-hero',           // 0 — Grand Mosque Sanctuary Hero
  'section-vision',         // 1 — Your Spiritual Home / Welcome to the Islamic Center
  'section-courses',        // 2 — Academic Programs & Sacred Disciplines
  'section-teachers',       // 3 — Lead Mentorship & Certified Al-Azhar Scholars
  'section-map',            // 4 — Global Sanctuary & Worldwide Map
  'section-latest-updates', // 5 — Latest Updates / Blog Journal
  'section-booking'         // 6 — Book / Reserve Your Free Session
];

export default function App() {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedCourseForBooking, setSelectedCourseForBooking] = useState('');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handleOpenBooking = (courseName = '') => {
    setSelectedCourseForBooking(courseName);
    const target = document.getElementById('section-booking') || document.getElementById('book-free-session');
    if (target) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, { offset: -90, duration: isMobile ? 1.2 : 1.7 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setIsBookingOpen(true);
    }
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
      id: 'section-vision',
      index: 1,
      title: 'Your Spiritual Home Guided by the Qur\'an and Sunnah',
      kicker: 'OUR VISION',
      glowColor: 'gold',
      component: (
        <SpiritualHomeSection
          onOpenBooking={() => handleOpenBooking()}
          onDiscoverMore={() => scrollToSection(2)}
        />
      )
    },
    {
      id: 'section-courses',
      index: 2,
      title: 'Academic Programs & Sacred Disciplines',
      kicker: 'OUR COURSES',
      glowColor: 'emerald',
      component: (
        <CourseShowcase
          onOpenBooking={handleOpenBooking}
          onSelectCourse={(c) => handleOpenBooking(c.title)}
        />
      )
    },
    {
      id: 'section-teachers',
      index: 3,
      title: 'Guidance That Listens Before It Corrects',
      kicker: 'CERTIFIED SCHOLARS & MENTORS',
      glowColor: 'amber',
      component: (
        <TeacherShowcase
          onOpenBooking={handleOpenBooking}
          onSelectTeacher={(t) => handleOpenBooking(`Session with ${t.name}`)}
        />
      )
    },
    {
      id: 'section-map',
      index: 4,
      title: 'Global Sanctuary & Worldwide Map',
      kicker: 'WORLD MAP • 42 COUNTRIES ACTIVE',
      glowColor: 'emerald',
      component: (
        <Spread6_Stories
          onNext={() => scrollToSection(5)}
        />
      )
    },
    {
      id: 'section-latest-updates',
      index: 5,
      title: 'Latest Updates from Our Islamic Center',
      kicker: 'INSTITUTE JOURNAL',
      glowColor: 'gold',
      isCustomCard: true,
      component: (
        <div className="section-standalone-wrap">
          <LatestUpdatesSection />
        </div>
      )
    },
    {
      id: 'section-booking',
      index: 6,
      title: 'Book / Reserve Your Free Session',
      kicker: 'FREE ASSESSMENT',
      glowColor: 'emerald',
      isCustomCard: true,
      component: (
        <div className="section-standalone-wrap">
          <BookFreeSessionSection initialCourse={selectedCourseForBooking} />
        </div>
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
        onOpenBooking={() => handleOpenBooking()}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      {/* 3. Hero Section - Grand Mosque Sanctuary */}
      <section id="section-hero" className="landing-mosque-hero-section">
        <MosqueHero
          onOpenBooking={() => handleOpenBooking()}
          onExplorePrograms={() => scrollToSection(1)}
          onScrollDown={() => scrollToSection(1)}
        />
      </section>

      {/* 4. Vertical Glassmorphism Sections */}
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

              {/* The Glassmorphic Section Card (or direct component if custom full-width card) */}
              {sec.isCustomCard ? (
                sec.component
              ) : (
                <div className="section-glass-card">
                  {sec.component}
                </div>
              )}
            </div>
          </section>
        ))}
      </main>

      {/* 5. Institute Main Footer */}
      <footer className="spread-footer institute-main-footer" id="section-footer">
        <div className="footer-brand" onClick={() => scrollToSection(0)} style={{ cursor: 'pointer' }}>
          <img src="/assets/logo_gold.png" alt="Our Quran Institute" className="footer-brand-logo" />
          <div className="footer-brand-text">
            <span className="footer-brand-name">Our Quran Institute</span>
            <span className="footer-brand-tagline">Authentic Al-Azhar Quranic Studies</span>
          </div>
        </div>

        <div className="footer-links">
          <Link href="/courses" className="footer-link">Programs</Link>
          <Link href="/teachers" className="footer-link">Faculty</Link>
          <Link href="/about" className="footer-link">About Us</Link>
          <button className="footer-link" onClick={() => scrollToSection(1)}>Our Vision</button>
          <button className="footer-link" onClick={() => scrollToSection(2)}>Our Courses</button>
          <button className="footer-link" onClick={() => scrollToSection(3)}>Faculty</button>
          <button className="footer-link" onClick={() => scrollToSection(4)}>World Map</button>
          <button className="footer-link" onClick={() => scrollToSection(5)}>Journal</button>
          <button className="footer-link" onClick={() => scrollToSection(6)}>Book Session</button>
        </div>

        <div className="footer-social-links">
          <a href="https://wa.me/201094714943" target="_blank" rel="noopener noreferrer" className="footer-social-btn" title="WhatsApp (+20 10 94714943)">
            <Icon name="whatsapp" size={15} />
          </a>
          <a href="https://youtube.com/@ourquraninstitute" target="_blank" rel="noopener noreferrer" className="footer-social-btn" title="YouTube">
            <Icon name="youtube" size={15} />
          </a>
          <a href="https://www.instagram.com/ourquraninstitute/" target="_blank" rel="noopener noreferrer" className="footer-social-btn" title="Instagram (@ourquraninstitute)">
            <Icon name="instagram" size={15} />
          </a>
          <a href="https://facebook.com/ourquraninstitute" target="_blank" rel="noopener noreferrer" className="footer-social-btn" title="Facebook">
            <Icon name="facebook" size={15} />
          </a>
        </div>

        <span className="footer-copyright">© 2026 Our Quran Institute • All Rights Reserved</span>
      </footer>

      {/* 5. Floating Quick Action Button (Bottom Right) */}
      {activeSection > 0 && (
        <div className="floating-quick-dock">
          {activeSection !== 6 && (
            <button
              className="floating-action-pill"
              onClick={() => handleOpenBooking()}
              title="Book Free Assessment"
            >
              <DiamondOrnament size={18} diamondSize={10} centerColor="#062A24" borderColor="#C5A45A" />
              <span>Book Free Session</span>
              <Icon name="arrow-up-right" size={14} color="#062A24" />
            </button>
          )}
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

      {/* 6b. Student & Teacher Portal Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
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
