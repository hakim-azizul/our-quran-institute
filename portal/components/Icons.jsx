'use client';

import React from 'react';

export function Icon({
  name,
  size = 18,
  color = 'currentColor',
  fill = 'none',
  strokeWidth = 1.75,
  className = '',
  style = {},
}) {
  const props = {
    width: size,
    height: size,
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    fill,
    className,
    style: { display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style },
  };

  switch (name) {
    // ==========================================
    // BOOKS & SCRIPTURE
    // ==========================================
    case 'book':
    case 'book-open':
    case 'quran':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      );

    case 'book-marked':
    case 'surah':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <path d="M10 2v8l3-2.5 3 2.5V2" />
        </svg>
      );

    // ==========================================
    // USERS, SCHOLARS, ROLES
    // ==========================================
    case 'user':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );

    case 'users':
    case 'user-group':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );

    case 'student':
    case 'graduation-cap':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" />
        </svg>
      );

    case 'teacher':
    case 'scholar':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="m4 6 8-4 8 4" />
          <path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2" />
          <path d="M14 22v-4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v4" />
          <path d="M18 5v17" />
          <path d="M6 5v17" />
          <circle cx="12" cy="11" r="2" />
        </svg>
      );

    case 'parent':
    case 'family':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-1.5a3.5 3.5 0 0 0-3.5-3.5h-.5" />
          <circle cx="18" cy="10" r="2.5" />
        </svg>
      );

    case 'admin':
    case 'shield-user':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          <circle cx="12" cy="10" r="2.5" />
          <path d="M8.5 16.5a3.5 3.5 0 0 1 7 0" />
        </svg>
      );

    case 'user-check':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <polyline points="16 11 18 13 22 9" />
        </svg>
      );

    case 'user-x':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="17" x2="22" y1="8" y2="13" />
          <line x1="22" x2="17" y1="8" y2="13" />
        </svg>
      );

    // ==========================================
    // METRICS, ANALYTICS & MONITORING
    // ==========================================
    case 'chart':
    case 'bar-chart':
    case 'analytics':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <line x1="12" x2="12" y1="20" y2="10" />
          <line x1="18" x2="18" y1="20" y2="4" />
          <line x1="6" x2="6" y1="20" y2="16" />
        </svg>
      );

    case 'trending-up':
    case 'progress':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      );

    case 'activity':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      );

    // ==========================================
    // TIME, CALENDAR & SESSIONS
    // ==========================================
    case 'calendar':
    case 'calendar-days':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
      );

    case 'clock':
    case 'time':
    case 'attendance':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );

    case 'stopwatch':
    case 'timer':
    case 'screentime':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <circle cx="12" cy="14" r="8" />
          <line x1="12" x2="12" y1="2" y2="5" />
          <line x1="10" x2="14" y1="2" y2="2" />
          <polyline points="12 10 12 14 15 14" />
        </svg>
      );

    // ==========================================
    // FINANCES, INVOICES & SALARIES
    // ==========================================
    case 'dollar':
    case 'dollar-sign':
    case 'currency':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <line x1="12" x2="12" y1="2" y2="22" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );

    case 'credit-card':
    case 'payment':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <line x1="2" x2="22" y1="10" y2="10" />
          <line x1="6" x2="10" y1="15" y2="15" />
        </svg>
      );

    case 'wallet':
    case 'salary':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
          <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
        </svg>
      );

    case 'receipt':
    case 'invoice':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />
          <line x1="8" x2="16" y1="7" y2="7" />
          <line x1="8" x2="16" y1="11" y2="11" />
          <line x1="8" x2="12" y1="15" y2="15" />
        </svg>
      );

    // ==========================================
    // STATUS, REVIEWS & RATINGS
    // ==========================================
    case 'check':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );

    case 'check-circle':
    case 'check-circle-2':
    case 'present':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <polyline points="16 9 10.5 14.5 8 12" />
        </svg>
      );

    case 'x':
    case 'close':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <line x1="18" x2="6" y1="6" y2="18" />
          <line x1="6" x2="18" y1="6" y2="18" />
        </svg>
      );

    case 'x-circle':
    case 'absent':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" x2="9" y1="9" y2="15" />
          <line x1="9" x2="15" y1="9" y2="15" />
        </svg>
      );

    case 'alert-circle':
    case 'late':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" x2="12" y1="8" y2="12" />
          <line x1="12" x2="12.01" y1="16" y2="16" />
        </svg>
      );

    case 'shield':
    case 'shield-check':
    case 'verified':
    case 'excused':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      );

    case 'star':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );

    case 'award':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      );

    case 'sparkles':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
          <path d="M5 3v4" />
          <path d="M19 17v4" />
        </svg>
      );

    // ==========================================
    // TOOLS, ACTIONS & UTILITIES
    // ==========================================
    case 'zap':
    case 'lightning':
    case 'action':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );

    case 'flag':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <line x1="4" y1="22" x2="4" y2="15" />
        </svg>
      );

    case 'search':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" x2="16.65" y1="21" y2="16.65" />
        </svg>
      );

    case 'repeat':
    case 'refresh-cw':
    case 'revision':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M21 2v6h-6" />
          <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
          <path d="M3 22v-6h6" />
          <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
        </svg>
      );

    case 'edit':
    case 'edit-3':
    case 'pen':
    case 'pen-tool':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      );

    case 'link':
    case 'link-2':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M9 17H7A5 5 0 0 1 7 7h2" />
          <path d="M15 7h2a5 5 0 1 1 0 10h-2" />
          <line x1="8" x2="16" y1="12" y2="12" />
        </svg>
      );

    case 'printer':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <polyline points="6 9 6 2 18 2 18 9" />
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <rect width="12" height="8" x="6" y="14" />
        </svg>
      );

    case 'copy':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
      );

    case 'save':
    case 'disc':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </svg>
      );

    case 'plus':
    case 'add':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <line x1="12" x2="12" y1="5" y2="19" />
          <line x1="5" x2="19" y1="12" y2="12" />
        </svg>
      );

    case 'trash':
    case 'trash-2':
    case 'delete':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="10" x2="10" y1="11" y2="17" />
          <line x1="14" x2="14" y1="11" y2="17" />
        </svg>
      );

    case 'info':
    case 'help-circle':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" x2="12" y1="16" y2="12" />
          <line x1="12" x2="12.01" y1="8" y2="8" />
        </svg>
      );

    case 'filter':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
      );

    case 'volume-2':
    case 'audio':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      );

    case 'mic':
    case 'makharij':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </svg>
      );

    case 'play':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <polygon points="6 3 20 12 6 21 6 3" />
        </svg>
      );

    case 'pause':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <rect width="4" height="16" x="6" y="4" />
          <rect width="4" height="16" x="14" y="4" />
        </svg>
      );

    case 'heart':
    case 'tarbiyah':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      );

    case 'mosque':
    case 'masjid':
    case 'islamic':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M12 2c-.5 1-1.5 2-2 3.5C8.8 8 10 10 12 11c2-1 3.2-3 2-5.5C13.5 4 12.5 3 12 2z" />
          <path d="M5 11a7 7 0 0 1 14 0v10H5V11z" />
          <path d="M10 21v-4a2 2 0 0 1 4 0v4" />
          <path d="M2 13v8" />
          <path d="M22 13v8" />
        </svg>
      );

    case 'settings':
    case 'gear':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );

    case 'bell':
    case 'notification':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      );

    case 'megaphone':
    case 'broadcast':
    case 'announcement':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="m3 11 18-5v12L3 13v-2z" />
          <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
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

    case 'logout':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" x2="9" y1="12" y2="12" />
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

    case 'chevron-right':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      );

    case 'chevron-down':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <polyline points="6 9 12 15 18 9" />
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

    case 'menu':
    case 'hamburger':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      );

    default:
      return null;
  }
}
