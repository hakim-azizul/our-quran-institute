'use client';

import React from 'react';

export function Icon({ name, size = 18, color = 'currentColor', className = '' }) {
  const props = {
    width: size,
    height: size,
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    fill: 'none',
    className,
  };

  switch (name) {
    case 'book':
    case 'book-open':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      );
    case 'users':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'user':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case 'parent':
    case 'family':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M9 12h.01M15 12h.01" />
          <path d="M10 16c.5.5 1.2.8 2 .8s1.5-.3 2-.8" />
          <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 5 6.3" />
          <path d="M12 3v3" />
        </svg>
      );
    case 'lock':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );
    case 'mail':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      );
    case 'phone':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case 'arrow-right':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      );
    case 'arrow-left':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
      );
    case 'award':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      );
    case 'shield':
    case 'shield-check':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case 'eye':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'eye-off':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
          <line x1="2" x2="22" y1="2" y2="22" />
        </svg>
      );
    case 'check':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      );
    case 'sparkles':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
        </svg>
      );
    case 'logout':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" x2="9" y1="12" y2="12" />
        </svg>
      );
    case 'video':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="m22 8-6 4 6 4V8Z" />
          <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
        </svg>
      );
    case 'clock':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    default:
      return null;
  }
}
