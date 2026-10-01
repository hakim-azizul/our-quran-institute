import React, { useState, useEffect, useRef } from 'react';

/**
 * CalligraphyWritingStage
 * Realistic Arabic calligraphy handwriting animation inscribed directly onto
 * the antique book pages resting on the emerald velvet reading stand.
 *
 * Uses mathematically exact homography projection matrices to align with the
 * physical book pages in hero_stand_book.png (640x876).
 *
 * The reed pen (qalam) is held naturally at a 50° frontend angle, matching the hand
 * of an authentic Islamic calligrapher writing from the front/bottom-right.
 */

// Right Page Homography (160x260 -> physical page bounds in 640x876)
const RIGHT_PAGE_MATRIX =
  'matrix3d(0.332138, -0.164368, 0, -0.000535, -0.091387, 0.688426, 0, -0.000064, 0, 0, 1, 0, 362.000000, 350.000000, 0, 1.000000)';

// Left Page Homography (160x260 -> physical page bounds in 640x876)
const LEFT_PAGE_MATRIX =
  'matrix3d(0.737633, 0.179754, 0, 0.000585, 0.054862, 0.752864, 0, -0.000070, 0, 0, 1, 0, 186.000000, 354.000000, 0, 1.000000)';

// 3x3 Projective Homography Matrices for Screen-Space Pen Tracking
const RIGHT_H = [
  0.33213769, -0.09138691, 362.0,
  -0.16436841, 0.68842576, 350.0,
  -0.00053494, -0.00006441, 1.0
];

const LEFT_H = [
  0.73763283, 0.05486182, 186.0,
  0.17975356, 0.75286353, 354.0,
  0.00058501, -0.00007044, 1.0
];

function projectPoint(H, u, v) {
  const x = H[0] * u + H[1] * v + H[2];
  const y = H[3] * u + H[4] * v + H[5];
  const w = H[6] * u + H[7] * v + H[8];
  return { x: x / w, y: y / w };
}

// Classical Arabic Poetry on Education & Seeking Knowledge (Diwan Imam Al-Shafi'i)
// Right Page: The Noble Stature of Learning vs Ignorance
const RIGHT_PAGE_LINES = [
  {
    id: 'r-bismillah',
    text: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    isGold: true,
    fontSize: 16,
    yPos: 32,
    duration: 1800,
    startU: 138,
    endU: 22,
    translation: 'In the name of Allah, Most Gracious, Most Merciful'
  },
  {
    id: 'r-v1',
    text: 'تَعَلَّمْ فَلَيْسَ الْمَرْءُ يُولَدُ عَالِمًا',
    isGold: false,
    fontSize: 17.5,
    yPos: 76,
    duration: 1850,
    startU: 148,
    endU: 12,
    translation: 'Learn! For no person is born a scholar'
  },
  {
    id: 'r-v2',
    text: 'وَلَيْسَ أَخُو عِلْمٍ كَمَنْ هُوَ جَاهِلُ',
    isGold: false,
    fontSize: 17.5,
    yPos: 120,
    duration: 1850,
    startU: 148,
    endU: 14,
    translation: 'And the one with knowledge is not like the ignorant'
  },
  {
    id: 'r-v3',
    text: 'وَإِنَّ كَبِيرَ الْقَوْمِ لَا عِلْمَ عِنْدَهُ ۝',
    isGold: false,
    fontSize: 17.5,
    yPos: 164,
    duration: 1900,
    startU: 148,
    endU: 12,
    translation: 'Even the leader of a people who has no knowledge'
  },
  {
    id: 'r-v4',
    text: 'صَغِيرٌ إِذَا الْتَفَّتْ عَلَيْهِ الْمَحَافِلُ',
    isGold: false,
    fontSize: 17.5,
    yPos: 208,
    duration: 1900,
    startU: 148,
    endU: 12,
    translation: 'Is small when gatherings surround him'
  }
];

// Left Page: The Six Pillars of Attaining Sacred Knowledge
// Lines 2 and 4 use authentic calligraphic kashida (tatweel) so all verses align perfectly
// along both margins, matching the balanced presentation of the right page
const LEFT_PAGE_LINES = [
  {
    id: 'l-v5',
    text: 'أَخِي لَنْ تَنَالَ الْعِلْمَ إِلَّا بِسِتَّةٍ',
    isGold: false,
    fontSize: 17.5,
    yPos: 34,
    duration: 1850,
    startU: 148,
    endU: 12,
    translation: 'My brother, you will never attain knowledge except by six:'
  },
  {
    id: 'l-v6',
    text: 'سَـأُنْبِـئُـكَ عَـنْ تَـفْـصِـيلِـهَـا بِـبَـيَـانِ',
    isGold: false,
    fontSize: 17.5,
    yPos: 78,
    duration: 1850,
    startU: 148,
    endU: 12,
    translation: 'I shall inform you of their details with clarity:'
  },
  {
    id: 'l-v7',
    text: 'ذَكَاءٌ وَحِرْصٌ وَاجْتِهَادٌ وَبُلْغَةٌ',
    isGold: false,
    fontSize: 17.5,
    yPos: 122,
    duration: 1900,
    startU: 148,
    endU: 12,
    translation: 'Intelligence, eagerness, perseverance, and sustenance,'
  },
  {
    id: 'l-v8',
    text: 'وَصُـحْـبَـةُ أُسْـتَـاذٍ وَطُـولِ زَمَـانِ',
    isGold: false,
    fontSize: 17.5,
    yPos: 166,
    duration: 1900,
    startU: 148,
    endU: 12,
    translation: 'Companionship of a mentor (Ustadh), and length of time.'
  },
  {
    id: 'l-rosette',
    text: '✦  ۞  ✦',
    isGold: true,
    fontSize: 15,
    yPos: 210,
    duration: 1250,
    startU: 104,
    endU: 56,
    isRosette: true
  }
];

export default function CalligraphyWritingStage({ isWriting = true }) {
  const [activeStep, setActiveStep] = useState(0);
  const [lineProgress, setLineProgress] = useState(0); // 0.0 to 1.0

  // Pen state in 640x876 container screen coordinates
  const initialPoint = projectPoint(RIGHT_H, 138, 32);
  const [penState, setPenState] = useState({
    screenX: initialPoint.x,
    screenY: initialPoint.y,
    isWriting: true,
    angle: 50, // 50° frontend calligrapher tilt
    inkGlow: 1,
    opacity: 1
  });
  const [isCompleted, setIsCompleted] = useState(false);

  const animRef = useRef(null);
  const stepStartRef = useRef(0);
  const currentStepRef = useRef(0);

  // Responsive scale tracker so calligraphy lines and pen map 1:1 onto physical book pages on all devices
  const stageRef = useRef(null);
  const [stageScale, setStageScale] = useState({ x: 1, y: 1 });

  useEffect(() => {
    const el = stageRef.current?.parentElement;
    if (!el) return;

    const updateScale = () => {
      const w = el.offsetWidth || 640;
      const h = el.offsetHeight || 876;
      if (w > 0 && h > 0) {
        setStageScale({
          x: w / 640,
          y: h / 876
        });
      }
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(el);
    window.addEventListener('resize', updateScale);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  const handleRestart = () => {
    currentStepRef.current = 0;
    setActiveStep(0);
    setLineProgress(0);
    setIsCompleted(false);
    stepStartRef.current = performance.now();
    const p0 = projectPoint(RIGHT_H, 138, 32);
    setPenState({
      screenX: p0.x,
      screenY: p0.y,
      isWriting: true,
      angle: 50,
      inkGlow: 1,
      opacity: 1
    });
  };

  useEffect(() => {
    if (!isWriting) return;

    stepStartRef.current = performance.now();
    currentStepRef.current = 0;

    function frame(time) {
      if (!stepStartRef.current) stepStartRef.current = time;
      const now = time;
      const stepIdx = currentStepRef.current;
      const isRightPage = stepIdx < RIGHT_PAGE_LINES.length;
      const stepConfig = isRightPage
        ? RIGHT_PAGE_LINES[stepIdx]
        : LEFT_PAGE_LINES[stepIdx - RIGHT_PAGE_LINES.length];

      if (!stepConfig) {
        // All verses inscribed — rest pen gracefully at bottom-right
        setIsCompleted(true);
        setPenState((prev) => ({
          ...prev,
          isWriting: false,
          opacity: 0.2,
          angle: 48
        }));

        // Loop after an appreciation rest
        const loopTimer = setTimeout(() => {
          handleRestart();
        }, 7000);

        return () => clearTimeout(loopTimer);
      }

      const elapsed = now - stepStartRef.current;
      const duration = stepConfig.duration;
      const pauseBetweenLines = 380;

      const currentH = isRightPage ? RIGHT_H : LEFT_H;
      const startU = stepConfig.startU !== undefined ? stepConfig.startU : 148;
      const endU = stepConfig.endU !== undefined ? stepConfig.endU : 12;

      if (elapsed < duration) {
        // Active writing of current verse line
        const p = Math.min(1, elapsed / duration);
        // Organic calligraphy velocity curve (slows naturally at ligatures)
        const organicP = 0.5 - 0.5 * Math.cos(p * Math.PI);
        setLineProgress(organicP);

        // Pen moves from right (startU) to left (endU) across the Arabic script
        const currentU = startU - organicP * (startU - endU);
        // Micro-pressure vertical modulation for chiseled nib stroke variation
        const penWobbleV = Math.sin(p * Math.PI * 14) * 1.2 + Math.cos(p * Math.PI * 20) * 0.6;
        const currentV = stepConfig.yPos + penWobbleV;

        // Project onto physical book page coordinates in 640x876
        const screenPt = projectPoint(currentH, currentU, currentV);

        // Pen angle maintained around ~50° frontend side with organic writing breath
        const currentAngle = 50 + Math.sin(p * Math.PI * 10) * 2.5;

        setPenState({
          screenX: screenPt.x,
          screenY: screenPt.y,
          isWriting: true,
          angle: currentAngle,
          inkGlow: 0.8 + Math.sin(p * Math.PI * 8) * 0.2,
          opacity: 1
        });

        animRef.current = requestAnimationFrame(frame);
      } else if (elapsed < duration + pauseBetweenLines) {
        // Pen lifted, traveling gracefully to start of next line
        setLineProgress(1);
        const pauseProgress = (elapsed - duration) / pauseBetweenLines;

        const nextStep = stepIdx + 1;
        const nextIsRight = nextStep < RIGHT_PAGE_LINES.length;
        const nextConfig = nextIsRight
          ? RIGHT_PAGE_LINES[nextStep]
          : LEFT_PAGE_LINES[nextStep - RIGHT_PAGE_LINES.length];

        if (nextConfig) {
          const fromPt = projectPoint(currentH, endU, stepConfig.yPos);
          const nextH = nextIsRight ? RIGHT_H : LEFT_H;
          const nextStartU = nextConfig.startU !== undefined ? nextConfig.startU : 148;
          const toPt = projectPoint(nextH, nextStartU, nextConfig.yPos);

          // Smooth lifted arc glide
          const liftHeight = 14 * Math.sin(pauseProgress * Math.PI);
          const screenX = fromPt.x + (toPt.x - fromPt.x) * pauseProgress;
          const screenY = fromPt.y + (toPt.y - fromPt.y) * pauseProgress - liftHeight;

          // Subtle tilt during airborne transition
          const currentAngle = 48 + Math.sin(pauseProgress * Math.PI) * 4;

          setPenState({
            screenX,
            screenY,
            isWriting: false,
            angle: currentAngle,
            inkGlow: 0.15,
            opacity: 0.95
          });
        }

        animRef.current = requestAnimationFrame(frame);
      } else {
        // Advance to next verse line
        currentStepRef.current++;
        setActiveStep(currentStepRef.current);
        stepStartRef.current = performance.now();
        animRef.current = requestAnimationFrame(frame);
      }
    }

    animRef.current = requestAnimationFrame(frame);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isWriting]);

  return (
    <div
      ref={stageRef}
      className={`calligraphy-stage-wrapper ${isCompleted ? 'is-completed' : ''}`}
      onClick={handleRestart}
      title="Click to replay calligraphy inscription"
      style={{
        width: '640px',
        height: '876px',
        position: 'absolute',
        left: 0,
        top: 0,
        transformOrigin: '0 0',
        transform: `scale(${stageScale.x}, ${stageScale.y})`,
        pointerEvents: 'none'
      }}
    >
      {/* 1. RIGHT PAGE PERSPECTIVE PLANE (Opening Page - Part I) */}
      <div
        className="calligraphy-page-plane right-plane"
        style={{
          transform: RIGHT_PAGE_MATRIX,
          transformOrigin: '0 0'
        }}
      >
        <div className="calligraphy-page-inner">
          {RIGHT_PAGE_LINES.map((line, idx) => {
            const isCompletedLine = activeStep > idx;
            const isCurrentLine = activeStep === idx;
            const revealPct = isCompletedLine ? 100 : isCurrentLine ? lineProgress * 100 : 0;

            return (
              <div
                key={line.id}
                className={`calligraphy-line ${line.isGold ? 'gold-ink' : 'black-ink'} ${
                  isCurrentLine ? 'is-currently-writing' : ''
                }`}
                style={{
                  top: `${line.yPos - line.fontSize * 0.65}px`,
                  fontSize: `${line.fontSize}px`,
                  clipPath: `polygon(${Math.max(0, 100 - revealPct * 1.04)}% 0%, 100% 0%, 100% 100%, ${Math.max(
                    0,
                    100 - revealPct * 1.04
                  )}% 100%)`,
                  WebkitClipPath: `polygon(${Math.max(0, 100 - revealPct * 1.04)}% 0%, 100% 0%, 100% 100%, ${Math.max(
                    0,
                    100 - revealPct * 1.04
                  )}% 100%)`
                }}
              >
                <span className="calligraphy-arabic-text">{line.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. LEFT PAGE PERSPECTIVE PLANE (Continuation Page - Part II) */}
      <div
        className="calligraphy-page-plane left-plane"
        style={{
          transform: LEFT_PAGE_MATRIX,
          transformOrigin: '0 0'
        }}
      >
        <div className="calligraphy-page-inner">
          {LEFT_PAGE_LINES.map((line, idx) => {
            const globalIdx = RIGHT_PAGE_LINES.length + idx;
            const isCompletedLine = activeStep > globalIdx;
            const isCurrentLine = activeStep === globalIdx;
            const revealPct = isCompletedLine ? 100 : isCurrentLine ? lineProgress * 100 : 0;

            return (
              <div
                key={line.id}
                className={`calligraphy-line ${line.isGold ? 'gold-ink' : 'black-ink'} ${
                  line.isRosette ? 'rosette-line' : ''
                } ${isCurrentLine ? 'is-currently-writing' : ''}`}
                style={{
                  top: `${line.yPos - line.fontSize * 0.65}px`,
                  fontSize: `${line.fontSize}px`,
                  clipPath: `polygon(${Math.max(0, 100 - revealPct * 1.04)}% 0%, 100% 0%, 100% 100%, ${Math.max(
                    0,
                    100 - revealPct * 1.04
                  )}% 100%)`,
                  WebkitClipPath: `polygon(${Math.max(0, 100 - revealPct * 1.04)}% 0%, 100% 0%, 100% 100%, ${Math.max(
                    0,
                    100 - revealPct * 1.04
                  )}% 100%)`
                }}
              >
                <span className="calligraphy-arabic-text">{line.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. REED PEN (QALAM) STYLUS ASSEMBLY
          Rendered in un-distorted 640x876 coordinates so the barrel and nib retain
          authentic proportions, tilted at 50° frontend side towards the calligrapher.
      */}
      <ReedPenStylus
        screenX={penState.screenX}
        screenY={penState.screenY}
        angle={penState.angle}
        isWriting={penState.isWriting}
        inkGlow={penState.inkGlow}
        opacity={penState.opacity}
      />
    </div>
  );
}

/**
 * ReedPenStylus Component
 * Authentic handcrafted Islamic Calligraphy Qalam (reed pen)
 * Features warm natural wood grain, polished brass ferrule, hand-cut split chisel nib,
 * wet ink bead, and realistic contact shadow onto parchment paper.
 */
function ReedPenStylus({ screenX, screenY, angle, isWriting, inkGlow, opacity = 1 }) {
  return (
    <div
      className={`qalam-pen-assembly ${isWriting ? 'pen-contact' : 'pen-airborne'}`}
      style={{
        left: `${screenX}px`,
        top: `${screenY}px`,
        transform: `translate(-15px, -73.5px) rotate(${angle}deg)`,
        opacity
      }}
    >
      {/* 1. Soft contact shadow cast onto paper */}
      <div
        className="qalam-shadow"
        style={{
          transform: `translate(10px, 44px) scale(${isWriting ? 1 : 1.25}) rotate(${angle * 0.4}deg)`,
          opacity: isWriting ? 0.45 : 0.22
        }}
      />

      {/* 2. SVG Craft of the Qalam (Reed Pen) */}
      <svg
        className="qalam-svg"
        width="32"
        height="82"
        viewBox="0 0 34 85"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Bamboo / Reed Wood Grain Gradient */}
          <linearGradient id="qalamWood" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4A2F1B" />
            <stop offset="25%" stopColor="#8C5C35" />
            <stop offset="55%" stopColor="#B37C4B" />
            <stop offset="85%" stopColor="#8C5C35" />
            <stop offset="100%" stopColor="#3E2514" />
          </linearGradient>

          {/* Brass Ferrule Gradient */}
          <linearGradient id="qalamBrass" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7E6023" />
            <stop offset="35%" stopColor="#E2C26D" />
            <stop offset="65%" stopColor="#F9DF92" />
            <stop offset="100%" stopColor="#6C511B" />
          </linearGradient>

          {/* Dark Walnut / Gall Nut Ink at Nib Tip */}
          <linearGradient id="qalamInk" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#B37C4B" stopOpacity="0" />
            <stop offset="45%" stopColor="#0F241F" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#081814" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Slender Turned Reed Barrel */}
        <path
          d="M13 0 L21 0 L20 46 L14 46 Z"
          fill="url(#qalamWood)"
        />

        {/* Polished Brass Ring Band */}
        <rect
          x="13.5"
          y="42"
          width="7"
          height="4.5"
          rx="0.5"
          fill="url(#qalamBrass)"
        />

        {/* Hand-Cut Tapered Chisel Nib (Jalam) */}
        <path
          d="M14 46.5 L20 46.5 L18 72 L13.5 74 L14 46.5 Z"
          fill="url(#qalamWood)"
        />

        {/* Rich Black-Emerald Ink Coating on Nib */}
        <path
          d="M14.5 56 L19.5 56 L18 72 L13.5 74 Z"
          fill="url(#qalamInk)"
        />

        {/* Chisel Nib Slit & Ink Channel */}
        <line
          x1="16.5"
          y1="54"
          x2="15.8"
          y2="73.5"
          stroke="#05100C"
          strokeWidth="0.8"
        />

        {/* Breather Hole */}
        <circle
          cx="16.5"
          cy="54"
          r="0.8"
          fill="#05100C"
        />

        {/* Nib Tip Gold Highlight */}
        <polygon
          points="13.5,74 15,73 18,72 17,73.2 13.8,74.5"
          fill="#C5A45A"
          opacity="0.8"
        />
      </svg>

      {/* 3. Wet Ink Bead & Sacred Golden Micro-Glint right at the tip of the pen */}
      {isWriting && (
        <div
          className="qalam-ink-bead"
          style={{
            transform: 'translate(13.5px, 72.5px)',
            opacity: inkGlow
          }}
        />
      )}
    </div>
  );
}
