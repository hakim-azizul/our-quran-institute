'use client';

import React from 'react';
import Link from 'next/link';
import DigitalQuranReader from '../../components/DigitalQuranReader';
import { Icon } from '../../components/Icons';

export default function QuranStandalonePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#08281F' }}>
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 24px',
          background: '#0D4A38',
          borderBottom: '2px solid #D4AF37',
        }}
      >
        <Link
          href="/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#FFDF85',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '13.5px',
          }}
        >
          <Icon name="arrow-left" size={16} color="#FFDF85" />
          <span>ড্যাশবোর্ডে ফিরুন (Back to Dashboard)</span>
        </Link>

        <div style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600 }}>
          <span>Our Quran Institute • আল-কুরআনুল কারীম</span>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '0 16px' }}>
        <DigitalQuranReader />
      </div>
    </div>
  );
}
