import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="auth-page-wrapper" style={{ justifyContent: 'center', alignItems: 'center', padding: '24px' }}>
      <div className="auth-ambient-glow" />
      <div className="auth-trellis-bg" />

      <div
        className="auth-card"
        style={{
          maxWidth: '500px',
          textAlign: 'center',
          border: '1.5px solid var(--color-gold-primary)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>📖</div>

        <div className="auth-card-badge">
          <span>404 — Page Not Found</span>
        </div>

        <h1 className="auth-card-title" style={{ fontSize: '26px', marginBottom: '8px' }}>
          Sanctuary Page Not Found
        </h1>

        <p className="auth-card-subtitle" style={{ marginBottom: '24px', fontSize: '13.5px' }}>
          The portal route you are looking for does not exist or has been relocated.
        </p>

        <Link
          href="/login"
          className="btn-auth-submit"
          style={{ textDecoration: 'none', display: 'inline-flex', width: 'auto', padding: '12px 24px' }}
        >
          <span>Return to Portal Login</span>
        </Link>
      </div>
    </div>
  );
}
