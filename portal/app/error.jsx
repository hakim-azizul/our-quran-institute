'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '../components/Icons';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('Portal Application Error:', error);
  }, [error]);

  return (
    <div className="auth-page-wrapper" style={{ justifyContent: 'center', alignItems: 'center', padding: '24px' }}>
      <div className="auth-ambient-glow" />
      <div className="auth-trellis-bg" />

      <div
        className="auth-card"
        style={{
          maxWidth: '520px',
          textAlign: 'center',
          border: '1.5px solid var(--color-gold-primary)',
          boxShadow: 'var(--shadow-elevated)',
        }}
      >
        <div style={{ fontSize: '42px', marginBottom: '14px' }}>🕌</div>

        <div className="auth-card-badge" style={{ background: '#FEF2F2', borderColor: '#FCA5A5', color: '#991B1B' }}>
          <span>Session Notice</span>
        </div>

        <h2 className="auth-card-title" style={{ fontSize: '24px', marginBottom: '10px' }}>
          Something went wrong
        </h2>

        <p className="auth-card-subtitle" style={{ marginBottom: '24px', fontSize: '13.5px' }}>
          An unexpected issue occurred while rendering this page. You can retry the action or return to the Sanctuary login.
        </p>

        {error?.message && (
          <div
            style={{
              padding: '10px 14px',
              background: '#FFFBEB',
              border: '1px solid #FCD34D',
              borderRadius: '10px',
              fontSize: '12px',
              color: '#92400E',
              fontFamily: 'monospace',
              textAlign: 'left',
              marginBottom: '20px',
              wordBreak: 'break-word',
            }}
          >
            {error.message}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => reset()}
            className="btn-auth-submit"
            style={{ margin: 0, padding: '10px 20px', width: 'auto' }}
          >
            <span>Try Again</span>
          </button>

          <Link
            href="/login"
            className="auth-nav-pill-btn"
            style={{ display: 'inline-flex', alignItems: 'center' }}
          >
            <span>Return to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
