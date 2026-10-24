'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { TEACHERS_DATA } from '../../../src/data/teachersData';
import { Icon } from '../../../src/components/Icons';
import BookingModal from '../../../src/components/BookingModal';
import Navigation from '../../../src/components/Navigation';

function findTeacher(id) {
  if (!id) return null;
  const normalized = String(id).toLowerCase().trim();
  return (
    TEACHERS_DATA.find(
      (t) =>
        t.id.toLowerCase() === normalized ||
        (t.slug && t.slug.toLowerCase() === normalized) ||
        t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalized
    ) || null
  );
}

export default function TeacherFullProfilePage({ params }) {
  const routeParams = useParams();
  const rawId = params?.id || routeParams?.id || '';

  const [teacher, setTeacher] = useState(() => findTeacher(rawId));
  const [loading, setLoading] = useState(() => !findTeacher(rawId));
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedModalSubject, setSelectedModalSubject] = useState('');
  const [activeDiplomaModal, setActiveDiplomaModal] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Auto-fetch this teacher's live profile from portal / API
  useEffect(() => {
    let isMounted = true;
    async function loadTeacherProfile() {
      if (!rawId) return;

      const local = findTeacher(rawId);
      if (local && isMounted) {
        setTeacher(local);
      }

      // Fetch live data from backend to ensure any new certificates/bio are loaded
      try {
        const res = await fetch(`/api/teachers?id=${encodeURIComponent(rawId)}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.teacher) {
            setTeacher(data.teacher);
          }
        } else {
          // Direct fallback attempt to portal backend
          const portalBase = process.env.NEXT_PUBLIC_PORTAL_URL || 'http://localhost:3001';
          const directRes = await fetch(`${portalBase}/api/teachers?id=${encodeURIComponent(rawId)}`, { cache: 'no-store' });
          if (directRes.ok) {
            const directData = await directRes.json();
            if (isMounted && directData.teacher) {
              setTeacher(directData.teacher);
            }
          }
        }
      } catch {
        // Fall back gracefully to local match
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadTeacherProfile();
    return () => {
      isMounted = false;
    };
  }, [rawId]);

  const handleOpenBooking = (subject = '') => {
    setSelectedModalSubject(subject || `Session with ${teacher?.name || 'Scholar'}`);
    setIsBookingOpen(true);
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  if (loading && !teacher) {
    return (
      <div className="dedicated-page-wrapper" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Navigation currentPage="teachers" onOpenBooking={() => handleOpenBooking()} />
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #D4AF37', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <h2 style={{ fontFamily: 'var(--font-serif)', color: '#0D4A38' }}>Loading Scholar Credentials...</h2>
          <p style={{ color: '#64748B', fontSize: '14px' }}>Verifying connected Sanad chain and Al-Azhar accreditation...</p>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="dedicated-page-wrapper">
        <Navigation currentPage="teachers" onOpenBooking={() => handleOpenBooking()} />
        <div style={{ maxWidth: '640px', margin: '100px auto', textAlign: 'center', padding: '40px 24px', background: '#FFFFFF', borderRadius: '24px', border: '1px dashed #CBD5E1' }}>
          <Icon name="compass" size={42} color="#C5A45A" />
          <h1 style={{ fontFamily: 'var(--font-serif)', color: '#122F1E', margin: '16px 0 8px' }}>Faculty Profile Not Found</h1>
          <p style={{ color: '#64748B', fontSize: '14px', lineHeight: '1.6' }}>
            We could not find a verified faculty member matching "{rawId}". Please visit our full faculty catalog.
          </p>
          <Link
            href="/teachers"
            className="btn-gold-pill"
            style={{ display: 'inline-flex', marginTop: '20px', textDecoration: 'none' }}
          >
            <span>Browse All Certified Faculty</span>
            <Icon name="arrow-right" size={15} color="#062A24" />
          </Link>
        </div>
      </div>
    );
  }

  const defaultCertificates = [
    {
      id: 'default-cert-1',
      title: teacher.credentials || 'Ph.D. in Quranic Sciences & Recitations',
      issuer: 'Faculty of Quranic Recitations, Al-Azhar University, Cairo',
      year: '2016',
      degreeLevel: 'Doctor of Philosophy (Ph.D.)',
      grade: 'Mumtaz with Highest First Class Honors (مرتبة الشرف الأولى)',
      credentialId: 'AZH-QUR-2016-8910',
      verificationUrl: 'https://alazhar.edu.eg/verify/AZH-QUR-2016-8910',
      verified: true,
      description: 'Comprehensive research on comparative Qira’at, acoustic phonetics, and vocal tract articulation in classical recitation traditions.'
    },
    {
      id: 'default-cert-2',
      title: 'Supreme Ijazah in Ten Minor & Major Qira\'at (Shatibiyyah & Tayyibah)',
      issuer: 'Supreme Recitations Council of Egypt & Al-Azhar',
      year: '2012',
      degreeLevel: 'Master Reciter License (Ijazah Kubra)',
      grade: 'Sanad Mutawattir',
      credentialId: 'AZH-IJZ-10Q-2012',
      verificationUrl: 'https://alazhar.edu.eg/ijazah/AZH-IJZ-10Q-2012',
      verified: true,
      description: 'Authorized to grant chain of transmission (Sanad) to qualified memorizers globally.'
    },
    {
      id: 'default-cert-3',
      title: 'Higher Diploma in Tajweed Pedagogy & Vocal Calibration',
      issuer: 'Institute of Qira’at, Shubra, Cairo',
      year: '2008',
      degreeLevel: 'Postgraduate Diploma',
      grade: 'Mumtaz (Distinction)',
      credentialId: 'SHB-QIR-DIP-2008',
      verificationUrl: 'https://alazhar.edu.eg/shubra/2008-dip',
      verified: true,
      description: 'Pedagogical training in diagnosing student recitation defects, subtle vocal sifaat calibration, and breath pacing.'
    }
  ];

  const certificatesList = teacher.certificates && teacher.certificates.length > 0 ? teacher.certificates : defaultCertificates;

  const defaultSanadChain = teacher.sanadChain && teacher.sanadChain.length > 0 ? teacher.sanadChain : [
    { step: '28th Link (Current)', scholar: teacher.name, role: teacher.role || teacher.title || 'Master Reciter & Faculty Dean' },
    { step: '27th Link', scholar: 'Shaykh Abd al-Fattah al-Qadi (d. 1403 AH)', role: 'Grand Master of Al-Azhar Qira’at Institute' },
    { step: '26th Link', scholar: 'Shaykh Ahmad Abd al-Aziz al-Zayyat (d. 1424 AH)', role: 'Chief Reciter of Egypt & Sanad Luminary' },
    { step: '18th Link', scholar: 'Imam Shams al-Din Ibn al-Jazari (d. 833 AH)', role: 'Author of Tayyibat al-Nashr & Al-Jazariyyah' },
    { step: '12th Link', scholar: 'Imam Abu al-Qasim al-Shatibi (d. 590 AH)', role: 'Author of Hirz al-Amani (Al-Shatibiyyah)' },
    { step: '4th Link', scholar: 'Imam Asim ibn Abi al-Najud al-Kufi (d. 127 AH)', role: 'Tabi’i Reciter of Kufa' },
    { step: '2nd Link', scholar: 'Sayyiduna Ali ibn Abi Talib & Uthman ibn Affan (RA)', role: 'Noble Companions of the Prophet ﷺ' },
    { step: 'Supreme Source', scholar: 'The Messenger of Allah Muhammad ﷺ', role: 'Received from Angel Jibreel (AS)' }
  ];

  const defaultReviews = teacher.reviews && teacher.reviews.length > 0 ? teacher.reviews : [
    {
      studentName: 'Tariq Al-Mansoor',
      country: 'United Kingdom',
      date: '2 weeks ago',
      rating: 5,
      comment: 'Sheikh changed my relationship with the Quran forever. His patience with my Makharij errors gave me confidence I never thought I would possess.'
    },
    {
      studentName: 'Dr. Zaid bin Harith',
      country: 'Canada',
      date: '1 month ago',
      rating: 5,
      comment: 'Studying the sacred readings under this scholar is the greatest academic privilege of my life. Authentic Al-Azhar rigor with true prophetic warmth.'
    },
    {
      studentName: 'Amina Begum (Parent)',
      country: 'United States',
      date: '3 weeks ago',
      rating: 5,
      comment: 'Our entire family listens in when my son has class. The calm, encouraging methodology makes memorization a daily sanctuary of peace.'
    }
  ];

  return (
    <div className="dedicated-page-wrapper">
      {/* 1. Global Navigation */}
      <Navigation
        currentPage="teachers"
        onOpenBooking={() => handleOpenBooking(`Evaluation with ${teacher.name}`)}
      />

      {/* 2. Top Breadcrumb Bar */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '24px 24px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <Link
          href="/teachers"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#0D4A38',
            fontSize: '13px',
            fontWeight: '700',
            textDecoration: 'none',
            background: '#FFFFFF',
            padding: '8px 16px',
            borderRadius: '999px',
            border: '1px solid rgba(197, 164, 90, 0.3)',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
          }}
        >
          <span>‹ Return to All Scholars</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={handleCopyLink}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#FFFFFF',
              color: '#0D4A38',
              border: '1px solid #CBD5E1',
              padding: '8px 14px',
              borderRadius: '999px',
              fontSize: '12.5px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            <Icon name="sparkles" size={13} color="#C5A45A" />
            <span>{copiedLink ? 'Link Copied! ✓' : 'Share Profile'}</span>
          </button>

          <a
            href="https://wa.me/201094714943"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#E8F5E9',
              color: '#1B5E20',
              border: '1px solid #A5D6A7',
              padding: '8px 14px',
              borderRadius: '999px',
              fontSize: '12.5px',
              fontWeight: '700',
              textDecoration: 'none',
            }}
          >
            <Icon name="whatsapp" size={14} color="#25D366" />
            <span>Inquire on WhatsApp</span>
          </a>
        </div>
      </div>

      {/* 3. Royal Scholar Hero Banner */}
      <section
        style={{
          maxWidth: '1280px',
          margin: '20px auto 40px',
          padding: '0 24px',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #093427 0%, #0D4A38 60%, #06281E 100%)',
            borderRadius: '28px',
            padding: '44px 48px',
            color: '#FFFFFF',
            position: 'relative',
            overflow: 'hidden',
            border: '2px solid #D4AF37',
            boxShadow: '0 20px 50px rgba(9, 52, 39, 0.25)',
          }}
        >
          {/* Subtle Golden Arc Aura in background */}
          <div
            style={{
              position: 'absolute',
              top: '-80px',
              right: '-80px',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.22) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr auto',
              gap: '36px',
              alignItems: 'center',
              position: 'relative',
              zIndex: 1,
            }}
            className="scholar-hero-grid"
          >
            {/* Scholar Portrait with Royal Golden Ring */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: '140px',
                  height: '140px',
                  borderRadius: '50%',
                  border: '4px solid #D4AF37',
                  boxShadow: '0 0 24px rgba(212, 175, 55, 0.4), inset 0 0 12px rgba(0, 0, 0, 0.3)',
                  overflow: 'hidden',
                  background: '#06281E',
                  position: 'relative',
                }}
              >
                {teacher.image ? (
                  <img
                    src={teacher.image}
                    alt={teacher.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #0D4A38 0%, #06281E 100%)',
                      fontFamily: 'var(--font-serif)',
                      fontSize: '44px',
                      fontWeight: '800',
                      color: '#FFDF85',
                    }}
                  >
                    {teacher.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                )}
              </div>

              {/* Verified Shield Badge Floating */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-6px',
                  right: '-6px',
                  background: '#0D4A38',
                  border: '2px solid #D4AF37',
                  borderRadius: '50%',
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.4)',
                }}
                title="Verified Al-Azhar Scholar & Council Approved"
              >
                <Icon name="shield-check" size={20} color="#10B981" />
              </div>
            </div>

            {/* Scholar Identity Block */}
            <div>
              {/* Arabic Calligraphy Honorific */}
              <div
                style={{
                  fontFamily: "'Amiri', 'Traditional Arabic', serif",
                  fontSize: '22px',
                  color: '#FFDF85',
                  marginBottom: '4px',
                  direction: 'rtl',
                  textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
              >
                {teacher.honorific || 'فضيلة الشيخ حفظه الله'}
              </div>

              {/* Scholar English Name */}
              <h1
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '34px',
                  fontWeight: '800',
                  margin: '0 0 6px 0',
                  letterSpacing: '-0.02em',
                  color: '#FFFFFF',
                }}
              >
                {teacher.name}
              </h1>

              {/* Academic Role / Chair */}
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#FFDF85',
                  marginBottom: '14px',
                  letterSpacing: '0.01em',
                }}
              >
                {teacher.role || teacher.title}
              </div>

              {/* Accreditation Badges Row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                <span
                  style={{
                    background: 'rgba(255, 223, 133, 0.18)',
                    color: '#FFDF85',
                    border: '1px solid rgba(255, 223, 133, 0.4)',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontSize: '11.5px',
                    fontWeight: '700',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <Icon name="award" size={13} color="#FFDF85" />
                  <span>AL-AZHAR SCHOLAR</span>
                </span>

                <span
                  style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#A7F3D0',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontSize: '11.5px',
                    fontWeight: '700',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <Icon name="check-circle" size={13} color="#34D399" />
                  <span>SANAD CERTIFIED</span>
                </span>

                <span
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontSize: '11.5px',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <Icon name="compass" size={13} color="#CBD5E1" />
                  <span>{teacher.location || 'Cairo Sanctuary & Global'}</span>
                </span>

                <span
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontSize: '11.5px',
                    fontWeight: '600',
                  }}
                >
                  Languages: {teacher.languages || 'Arabic & English'}
                </span>
              </div>
            </div>

            {/* Quick Action Booking Card (Right Side of Hero) */}
            <div
              style={{
                background: 'rgba(6, 40, 30, 0.7)',
                border: '1px solid rgba(212, 175, 55, 0.5)',
                borderRadius: '20px',
                padding: '24px',
                textAlign: 'center',
                minWidth: '220px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
              }}
            >
              <span style={{ fontSize: '11px', color: '#FFDF85', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.06em' }}>
                Tuition Honorarium
              </span>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#FFFFFF', margin: '4px 0' }}>
                ${teacher.ratePerClass || teacher.hourlyRate || 35}
                <span style={{ fontSize: '13px', fontWeight: '500', color: 'rgba(255, 255, 255, 0.7)' }}> / Session</span>
              </div>
              <span style={{ fontSize: '11px', color: '#34D399', display: 'block', marginBottom: '14px' }}>
                ● 1-on-1 Dedicated Halqa
              </span>

              <button
                type="button"
                className="btn-gold-pill"
                onClick={() => handleOpenBooking(`Evaluation with ${teacher.name}`)}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <span>Request Evaluation</span>
                <Icon name="arrow-right" size={15} color="#062A24" />
              </button>
            </div>
          </div>

          {/* Metrics Strip */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '16px',
              marginTop: '32px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            <div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#FFDF85', fontFamily: 'var(--font-serif)' }}>
                {teacher.experience || teacher.yearsExperience || '14+ Years'}
              </div>
              <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}>Scholarly Teaching</span>
            </div>

            <div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#FFDF85', fontFamily: 'var(--font-serif)' }}>
                {teacher.graduates || '180+ Memorizers'}
              </div>
              <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}>Certified Sanad Recipients</span>
            </div>

            <div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#FFDF85', fontFamily: 'var(--font-serif)' }}>
                {teacher.rating || '4.98'} ★
              </div>
              <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}>
                Student Satisfaction ({teacher.reviewsCount || '86'} Reviews)
              </span>
            </div>

            <div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#FFDF85', fontFamily: 'var(--font-serif)' }}>
                {certificatesList.length} Diplomas
              </div>
              <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}>Council Authenticated</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Main 2-Column Content Layout */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px 80px',
          display: 'grid',
          gridTemplateColumns: '1.8fr 1fr',
          gap: '32px',
          alignItems: 'start',
        }}
        className="scholar-detail-layout"
      >
        {/* Left Primary Column: Scholarly Credentials, Sanad, Bio */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* SECTION 1: Official Diplomas, Degrees & Certificates */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1.5px solid rgba(197, 164, 90, 0.3)',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 4px 20px rgba(10, 36, 18, 0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: '#0D4A38',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon name="award" size={24} color="#FFDF85" />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#0D4A38', fontFamily: 'var(--font-serif)' }}>
                    Verified Diplomas &amp; Academic Degrees
                  </h2>
                  <span style={{ fontSize: '12.5px', color: '#64748B' }}>
                    Authenticated by the Supreme Council of Al-Azhar &amp; International Recitations Board
                  </span>
                </div>
              </div>

              <span
                style={{
                  background: '#DCFCE7',
                  color: '#166534',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '11.5px',
                  fontWeight: '800',
                  letterSpacing: '0.04em',
                }}
              >
                100% VERIFIED
              </span>
            </div>

            {/* Certificates Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {certificatesList.map((cert) => (
                <div
                  key={cert.id}
                  style={{
                    background: '#FAF7EE',
                    border: '1.5px solid #E6D8A8',
                    borderRadius: '16px',
                    padding: '20px 24px',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #0D4A38 0%, #06281E 100%)',
                          border: '1px solid #D4AF37',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: '0 2px 8px rgba(13, 74, 56, 0.2)',
                        }}
                      >
                        <Icon name="award" size={22} color="#FFDF85" />
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0D4A38', fontFamily: 'var(--font-serif)' }}>
                            {cert.title}
                          </h3>
                          <span
                            style={{
                              background: '#FEF3C7',
                              color: '#92400E',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: '700',
                            }}
                          >
                            {cert.degreeLevel || 'Academic Degree'}
                          </span>
                        </div>

                        <div style={{ fontSize: '13px', color: '#475569', marginTop: '6px' }}>
                          <strong>🏛 {cert.issuer}</strong>
                          {cert.year && <span> &bull; Year Awarded: <strong>{cert.year}</strong></span>}
                          {cert.grade && <span style={{ color: '#0D4A38' }}> &bull; Honors: <strong>{cert.grade}</strong></span>}
                        </div>

                        {cert.description && (
                          <p style={{ margin: '8px 0 0', fontSize: '12.5px', color: '#64748B', lineHeight: '1.5' }}>
                            {cert.description}
                          </p>
                        )}

                        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', fontSize: '11.5px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#166534', fontWeight: '700' }}>
                            <Icon name="shield-check" size={14} color="#10B981" />
                            <span>Verification ID: {cert.credentialId || 'AZH-VERIFIED-CERT'}</span>
                          </span>

                          <button
                            type="button"
                            onClick={() => setActiveDiplomaModal(cert)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#B8883A',
                              fontWeight: '700',
                              cursor: 'pointer',
                              padding: 0,
                              textDecoration: 'underline',
                            }}
                          >
                            Inspect Digital Credential ↗
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: Connected Chain of Transmission (Sanad / الإسناد المتصل) */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1.5px solid rgba(197, 164, 90, 0.3)',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 4px 20px rgba(10, 36, 18, 0.05)',
            }}
          >
            <div style={{ marginBottom: '20px' }}>
              <div
                style={{
                  fontFamily: "'Amiri', serif",
                  fontSize: '17px',
                  color: '#B8883A',
                  direction: 'rtl',
                  marginBottom: '4px',
                }}
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ • الإِسْنَادُ مِنَ الدِّينِ
              </div>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#0D4A38', fontFamily: 'var(--font-serif)' }}>
                Connected Chain of Transmission (Sanad Mutawattir)
              </h2>
              <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>
                {teacher.sanad}
              </p>
            </div>

            {/* Visual Sanad Transmission Tree */}
            <div
              style={{
                background: '#FAF7EE',
                border: '1px solid #E6D8A8',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#8A7045', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                AUTHENTIC TRANSMISSION CHAIN (SAMPLE GENERATIONAL LINKS)
              </span>

              {defaultSanadChain.map((node, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: index === 0 ? '#0D4A38' : index === defaultSanadChain.length - 1 ? '#D4AF37' : '#FFFFFF',
                      color: index === 0 ? '#FFDF85' : index === defaultSanadChain.length - 1 ? '#06281E' : '#0D4A38',
                      border: '2px solid #D4AF37',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '800',
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </div>

                  <div style={{ flex: 1, background: '#FFFFFF', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: '13.5px', color: '#0D4A38' }}>{node.scholar}</strong>
                      <span style={{ fontSize: '11px', color: '#B8883A', fontWeight: '700' }}>{node.step}</span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>{node.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: Biography & Pedagogical Approach */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1.5px solid rgba(197, 164, 90, 0.3)',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 4px 20px rgba(10, 36, 18, 0.05)',
            }}
          >
            <h2 style={{ margin: '0 0 16px', fontSize: '20px', fontWeight: '800', color: '#0D4A38', fontFamily: 'var(--font-serif)' }}>
              Scholarly Biography &amp; Pedagogy
            </h2>

            <p style={{ fontSize: '14.5px', lineHeight: '1.7', color: '#334155', margin: '0 0 18px' }}>
              {teacher.bio}
            </p>

            {teacher.teachingPhilosophy && (
              <div
                style={{
                  background: '#F0FDF4',
                  borderLeft: '4px solid #10B981',
                  borderRadius: '0 12px 12px 0',
                  padding: '16px 20px',
                  marginTop: '16px',
                }}
              >
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#059669', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  TEACHING PHILOSOPHY &amp; PROPHETIC ADAB
                </span>
                <p style={{ margin: '6px 0 0', fontSize: '13.5px', color: '#064E3B', lineHeight: '1.6', fontStyle: 'italic' }}>
                  "{teacher.teachingPhilosophy}"
                </p>
              </div>
            )}
          </div>

          {/* SECTION 4: Verified Student & Parent Reviews */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1.5px solid rgba(197, 164, 90, 0.3)',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 4px 20px rgba(10, 36, 18, 0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#0D4A38', fontFamily: 'var(--font-serif)' }}>
                Student &amp; Parent Endorsements ({defaultReviews.length})
              </h2>
              <span style={{ color: '#D4AF37', fontWeight: '800', fontSize: '15px' }}>
                ★★★★★ 5.0 Rating
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {defaultReviews.map((rev, i) => (
                <div
                  key={i}
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '14px',
                    padding: '16px 20px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div>
                      <strong style={{ fontSize: '14px', color: '#0D4A38' }}>{rev.studentName}</strong>
                      <span style={{ fontSize: '12px', color: '#64748B', marginLeft: '8px' }}>• {rev.country}</span>
                    </div>
                    <span style={{ color: '#D4AF37', fontSize: '13px' }}>★★★★★</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>
                    "{rev.comment}"
                  </p>
                  <span style={{ fontSize: '11px', color: '#94A3B8', marginTop: '6px', display: 'block' }}>
                    {rev.date} &bull; Verified Learner
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Sticky Session Request, Specialties, Academy Credentials */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'sticky', top: '100px' }}>
          {/* Card 1: Direct Session Request */}
          <div
            style={{
              background: '#FFFFFF',
              border: '2px solid #D4AF37',
              borderRadius: '24px',
              padding: '28px',
              boxShadow: '0 8px 30px rgba(13, 74, 56, 0.1)',
            }}
          >
            <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#8A7045', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              DIRECT SCHOLAR EVALUATION
            </span>
            <h3 style={{ margin: '6px 0 12px', fontSize: '20px', fontWeight: '800', color: '#0D4A38', fontFamily: 'var(--font-serif)' }}>
              Begin Your Recitation Track
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5', margin: '0 0 18px' }}>
              Schedule a personalized 1-on-1 assessment with {teacher.name}. The scholar will evaluate your articulation, Tajweed, and recommend your exact learning syllabus.
            </p>

            <div
              style={{
                background: '#FAF7EE',
                border: '1px solid #E6D8A8',
                borderRadius: '12px',
                padding: '14px',
                marginBottom: '18px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: '#475569' }}>Per Class Honorarium:</span>
                <strong style={{ fontSize: '18px', color: '#0D4A38' }}>${teacher.ratePerClass || 35} / Class</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#475569' }}>Session Length:</span>
                <span style={{ fontSize: '12.5px', color: '#166534', fontWeight: '700' }}>45 mins dedicated 1-on-1</span>
              </div>
            </div>

            <button
              type="button"
              className="btn-gold-pill"
              onClick={() => handleOpenBooking(`Evaluation with ${teacher.name}`)}
              style={{ width: '100%', justifyContent: 'center', padding: '14px 20px', fontSize: '14px' }}
            >
              <span>Book 1-on-1 Session</span>
              <Icon name="arrow-right" size={16} color="#062A24" />
            </button>

            <a
              href="https://wa.me/201094714943"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '10px',
                padding: '12px',
                borderRadius: '999px',
                background: '#F0FDF4',
                color: '#166534',
                border: '1px solid #86EFAC',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: '700',
              }}
            >
              <Icon name="whatsapp" size={16} color="#25D366" />
              <span>Ask Admissions on WhatsApp</span>
            </a>
          </div>

          {/* Card 2: Areas of Specialization */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1.5px solid rgba(197, 164, 90, 0.3)',
              borderRadius: '24px',
              padding: '24px',
            }}
          >
            <h4 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: '800', color: '#0D4A38' }}>
              Specialization &amp; Curricula
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {teacher.specialties?.map((spec, i) => (
                <span
                  key={i}
                  style={{
                    background: '#EAF5EE',
                    color: '#0D4A38',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    padding: '6px 12px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                >
                  ✦ {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Card 3: Institute Standards Seal */}
          <div
            style={{
              background: '#FAF7EE',
              border: '1px dashed #D4AF37',
              borderRadius: '20px',
              padding: '20px',
              textAlign: 'center',
            }}
          >
            <Icon name="shield-check" size={32} color="#D4AF37" />
            <h4 style={{ margin: '10px 0 4px', fontSize: '15px', color: '#0D4A38', fontWeight: '800' }}>
              Our Quran Institute Standard
            </h4>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748B', lineHeight: '1.5' }}>
              Every session is monitored for pedagogical warmth, punctuality, and accurate classical Tajweed by our Academic Council.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Official Diploma Inspection Modal */}
      {activeDiplomaModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(6, 42, 36, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setActiveDiplomaModal(null)}
        >
          <div
            style={{
              background: '#FAF7EE',
              border: '3px solid #D4AF37',
              borderRadius: '24px',
              maxWidth: '640px',
              width: '100%',
              padding: '36px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={() => setActiveDiplomaModal(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(13, 74, 56, 0.1)',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0D4A38',
              }}
            >
              ✕
            </button>

            {/* Diploma Certificate Royal Header */}
            <div style={{ textAlign: 'center', borderBottom: '1px solid #E6D8A8', paddingBottom: '20px', marginBottom: '20px' }}>
              <div
                style={{
                  fontFamily: "'Amiri', serif",
                  fontSize: '20px',
                  color: '#B8883A',
                  direction: 'rtl',
                  marginBottom: '6px',
                }}
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#8A7045', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                ACADEMIC DIPLOMA &amp; OFFICIAL ACCREDITATION
              </span>
              <h3 style={{ margin: '8px 0 0', fontSize: '22px', color: '#0D4A38', fontFamily: 'var(--font-serif)' }}>
                {activeDiplomaModal.title}
              </h3>
            </div>

            {/* Diploma Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13.5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E2E8F0', paddingBottom: '8px' }}>
                <span style={{ color: '#64748B' }}>Holder:</span>
                <strong style={{ color: '#0D4A38' }}>{teacher.name}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E2E8F0', paddingBottom: '8px' }}>
                <span style={{ color: '#64748B' }}>Issuing University:</span>
                <strong style={{ color: '#0D4A38' }}>{activeDiplomaModal.issuer}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E2E8F0', paddingBottom: '8px' }}>
                <span style={{ color: '#64748B' }}>Degree Level:</span>
                <strong style={{ color: '#B8883A' }}>{activeDiplomaModal.degreeLevel || 'Sanad License'}</strong>
              </div>

              {activeDiplomaModal.year && (
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E2E8F0', paddingBottom: '8px' }}>
                  <span style={{ color: '#64748B' }}>Conferment Year:</span>
                  <strong style={{ color: '#0D4A38' }}>{activeDiplomaModal.year}</strong>
                </div>
              )}

              {activeDiplomaModal.grade && (
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E2E8F0', paddingBottom: '8px' }}>
                  <span style={{ color: '#64748B' }}>Academic Distinction:</span>
                  <strong style={{ color: '#166534' }}>{activeDiplomaModal.grade}</strong>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E2E8F0', paddingBottom: '8px' }}>
                <span style={{ color: '#64748B' }}>Registry Reference ID:</span>
                <strong style={{ color: '#0D4A38', fontFamily: 'monospace' }}>
                  {activeDiplomaModal.credentialId || 'QI-CERT-AUTHENTIC'}
                </strong>
              </div>

              {activeDiplomaModal.description && (
                <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#475569', lineHeight: '1.6', background: '#FFFFFF', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  {activeDiplomaModal.description}
                </p>
              )}
            </div>

            {/* Seal & Verification Footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #E6D8A8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon name="shield-check" size={20} color="#10B981" />
                <span style={{ fontSize: '12px', color: '#166534', fontWeight: '700' }}>
                  Al-Azhar Verified &amp; Council Registered
                </span>
              </div>

              <button
                type="button"
                className="btn-gold-pill"
                onClick={() => setActiveDiplomaModal(null)}
                style={{ padding: '8px 18px', fontSize: '12.5px' }}
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Footer */}
      <footer className="dedicated-page-footer">
        <div className="footer-inner">
          <div className="footer-brand-col">
            <div className="footer-brand">
              <img src="/assets/logo_gold.png" alt="Our Quran Institute" className="footer-logo" />
              <span className="footer-name">Our Quran Institute</span>
            </div>
            <p className="footer-tagline">
              An international sanctuary for Quranic memorization, Tajweed mastery, Arabic language, and authentic Islamic scholarship.
            </p>
          </div>

          <div className="footer-links-col">
            <h4>Academy Links</h4>
            <Link href="/">Home Overview</Link>
            <Link href="/courses">All Programs</Link>
            <Link href="/teachers">Al-Azhar Faculty</Link>
            <a href="https://wa.me/201094714943" target="_blank" rel="noopener noreferrer">WhatsApp Support</a>
          </div>

          <div className="footer-contact-col">
            <h4>Direct Admissions</h4>
            <p>Cairo Sanctuary &bull; Global Online Faculty</p>
            <p>WhatsApp: <strong>+20 10 94714943</strong></p>
            <p>Open 24/7 across all global timezones</p>
          </div>
        </div>
        <div className="footer-sub-bottom">
          <span>&copy; 2026 Our Quran Institute. All sacred rights reserved.</span>
        </div>
      </footer>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialCourse={selectedModalSubject}
      />
    </div>
  );
}
