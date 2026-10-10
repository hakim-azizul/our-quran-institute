'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from './Icons';

export default function AuthNavbar() {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <header className="auth-header">
      {/* Brand logo & title */}
      <Link href="/" className="auth-brand">
        <img
          src="/assets/logo_gold.png"
          alt="Our Quran Institute"
          className="auth-logo-img"
        />
        <div className="auth-brand-info">
          <span className="auth-brand-title">Our Quran Institute</span>
          <span className="auth-brand-subtitle">Sanctuary Learning Portal</span>
        </div>
      </Link>

      {/* Navigation action buttons */}
      <div className="auth-nav-actions">
        {/* Link back to Main Landing Page (Configurable across separate domains) */}
        <a
          href={process.env.NEXT_PUBLIC_LANDING_URL || 'http://localhost:3000'}
          target="_blank"
          rel="noopener noreferrer"
          className="auth-nav-link"
          title="Return to the Institute public landing page"
        >
          ← Return to Institute Website
        </a>

        {/* Page Switcher */}
        {isLoginPage ? (
          <Link href="/register" className="auth-nav-pill-btn">
            <span>Create New Account</span>
            <Icon name="arrow-right" size={14} color="currentColor" />
          </Link>
        ) : (
          <Link href="/login" className="auth-nav-pill-btn">
            <span>Sign In to Portal</span>
            <Icon name="arrow-right" size={14} color="currentColor" />
          </Link>
        )}
      </div>
    </header>
  );
}
