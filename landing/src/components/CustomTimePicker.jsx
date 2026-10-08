'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';

// ============================================================================
// SIMPLE MODERN SVG VECTOR ICONS
// ============================================================================

export const ClockIcon = ({ size = 16, color = '#0E3827', accentColor = '#C5A45A', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15.5 13.5" stroke={accentColor} strokeWidth="2" />
  </svg>
);

export const SunriseIcon = ({ size = 14, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 2v6" />
    <path d="m4.93 10.93 3.54-3.54" />
    <path d="m19.07 10.93-3.54-3.54" />
    <path d="M2 18h20" />
    <path d="M20 22H4" />
    <path d="m16 18a4 4 0 0 0-8 0" />
  </svg>
);

export const SunIcon = ({ size = 14, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

export const MoonIcon = ({ size = 14, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

export const SparkleIcon = ({ size = 13, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="m12 3-1.9 6.1L4 11l6.1 1.9L12 19l1.9-6.1L20 11l-6.1-1.9z" />
  </svg>
);

export const CheckIcon = ({ size = 12, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const PeriodIcon = ({ type, size = 14, color = 'currentColor', className = '' }) => {
  switch (type) {
    case 'morning':
      return <SunriseIcon size={size} color={color} className={className} />;
    case 'afternoon':
      return <SunIcon size={size} color={color} className={className} />;
    case 'evening':
      return <MoonIcon size={size} color={color} className={className} />;
    case 'all':
    default:
      return <SparkleIcon size={size} color={color} className={className} />;
  }
};

// ============================================================================
// DATA DEFINITIONS (NO EMOJIS, CLEAN VECTOR REFERENCES)
// ============================================================================

export const TIME_GROUPS = [
  { key: 'all', label: 'All Slots', type: 'all' },
  { key: 'morning', label: 'Morning', type: 'morning', range: '07:00 AM – 11:30 AM' },
  { key: 'afternoon', label: 'Afternoon', type: 'afternoon', range: '12:00 PM – 05:30 PM' },
  { key: 'evening', label: 'Evening', type: 'evening', range: '06:00 PM – 11:30 PM' }
];

export const TIME_SLOTS = [
  // Morning (07:00 AM – 11:30 AM)
  { id: 'm1', group: 'morning', value: '07:00 AM - 07:30 AM', time: '07:00 AM – 07:30 AM', sublabel: 'Early Morning' },
  { id: 'm2', group: 'morning', value: '07:30 AM - 08:00 AM', time: '07:30 AM – 08:00 AM', sublabel: 'Morning Halqa' },
  { id: 'm3', group: 'morning', value: '08:00 AM - 08:30 AM', time: '08:00 AM – 08:30 AM', sublabel: 'Popular', isPopular: true },
  { id: 'm4', group: 'morning', value: '08:30 AM - 09:00 AM', time: '08:30 AM – 09:00 AM', sublabel: 'Morning Slot' },
  { id: 'm5', group: 'morning', value: '09:00 AM - 09:30 AM', time: '09:00 AM – 09:30 AM', sublabel: 'Morning Slot' },
  { id: 'm6', group: 'morning', value: '09:30 AM - 10:00 AM', time: '09:30 AM – 10:00 AM', sublabel: 'Morning Slot' },
  { id: 'm7', group: 'morning', value: '10:00 AM - 10:30 AM', time: '10:00 AM – 10:30 AM', sublabel: 'Mid Morning' },
  { id: 'm8', group: 'morning', value: '10:30 AM - 11:00 AM', time: '10:30 AM – 11:00 AM', sublabel: 'Mid Morning' },
  { id: 'm9', group: 'morning', value: '11:00 AM - 11:30 AM', time: '11:00 AM – 11:30 AM', sublabel: 'Pre-Dhuhr' },

  // Midday & Afternoon (12:00 PM – 05:30 PM)
  { id: 'a1', group: 'afternoon', value: '12:00 PM - 12:30 PM', time: '12:00 PM – 12:30 PM', sublabel: 'Midday' },
  { id: 'a2', group: 'afternoon', value: '12:30 PM - 01:00 PM', time: '12:30 PM – 01:00 PM', sublabel: 'Afternoon' },
  { id: 'a3', group: 'afternoon', value: '01:00 PM - 01:30 PM', time: '01:00 PM – 01:30 PM', sublabel: 'Afternoon' },
  { id: 'a4', group: 'afternoon', value: '01:30 PM - 02:00 PM', time: '01:30 PM – 02:00 PM', sublabel: 'Afternoon' },
  { id: 'a5', group: 'afternoon', value: '02:00 PM - 02:30 PM', time: '02:00 PM – 02:30 PM', sublabel: 'Popular', isPopular: true },
  { id: 'a6', group: 'afternoon', value: '02:30 PM - 03:00 PM', time: '02:30 PM – 03:00 PM', sublabel: 'Afternoon' },
  { id: 'a7', group: 'afternoon', value: '03:00 PM - 03:30 PM', time: '03:00 PM – 03:30 PM', sublabel: 'Afternoon' },
  { id: 'a8', group: 'afternoon', value: '03:30 PM - 04:00 PM', time: '03:30 PM – 04:00 PM', sublabel: 'Asr Time' },
  { id: 'a9', group: 'afternoon', value: '04:00 PM - 04:30 PM', time: '04:00 PM – 04:30 PM', sublabel: 'Late Afternoon' },
  { id: 'a10', group: 'afternoon', value: '04:30 PM - 05:00 PM', time: '04:30 PM – 05:00 PM', sublabel: 'Late Afternoon' },
  { id: 'a11', group: 'afternoon', value: '05:00 PM - 05:30 PM', time: '05:00 PM – 05:30 PM', sublabel: 'Pre-Maghrib' },

  // Evening & Night (06:00 PM – 11:30 PM)
  { id: 'e1', group: 'evening', value: '06:00 PM - 06:30 PM', time: '06:00 PM – 06:30 PM', sublabel: 'Evening' },
  { id: 'e2', group: 'evening', value: '06:30 PM - 07:00 PM', time: '06:30 PM – 07:00 PM', sublabel: 'Evening' },
  { id: 'e3', group: 'evening', value: '07:00 PM - 07:30 PM', time: '07:00 PM – 07:30 PM', sublabel: 'Popular', isPopular: true },
  { id: 'e4', group: 'evening', value: '07:30 PM - 08:00 PM', time: '07:30 PM – 08:00 PM', sublabel: 'Prime Slot', isPopular: true },
  { id: 'e5', group: 'evening', value: '08:00 PM - 08:30 PM', time: '08:00 PM – 08:30 PM', sublabel: 'Prime Slot', isPopular: true },
  { id: 'e6', group: 'evening', value: '08:30 PM - 09:00 PM', time: '08:30 PM – 09:00 PM', sublabel: 'Prime Slot' },
  { id: 'e7', group: 'evening', value: '09:00 PM - 09:30 PM', time: '09:00 PM – 09:30 PM', sublabel: 'Night Halqa' },
  { id: 'e8', group: 'evening', value: '09:30 PM - 10:00 PM', time: '09:30 PM – 10:00 PM', sublabel: 'Night Halqa' },
  { id: 'e9', group: 'evening', value: '10:00 PM - 10:30 PM', time: '10:00 PM – 10:30 PM', sublabel: 'Night' },
  { id: 'e10', group: 'evening', value: '10:30 PM - 11:00 PM', time: '10:30 PM – 11:00 PM', sublabel: 'Late Night' },
  { id: 'e11', group: 'evening', value: '11:00 PM - 11:30 PM', time: '11:00 PM – 11:30 PM', sublabel: 'Late Night' }
];

export default function CustomTimePicker({
  value = '',
  onChange,
  id = 'field-time',
  name = 'preferredTime',
  required = false,
  placeholder = 'Select time slot'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [activeGroup, setActiveGroup] = useState('all'); // 'all' | 'morning' | 'afternoon' | 'evening'
  const containerRef = useRef(null);
  const listRef = useRef(null);

  // Find active slot object
  const currentSlot = useMemo(() => {
    if (!value) return null;
    return TIME_SLOTS.find(
      (s) => s.value.toLowerCase() === value.toLowerCase() || s.time.toLowerCase() === value.toLowerCase()
    ) || null;
  }, [value]);

  // Outside click listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Escape key handler
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Dynamic upward vs downward placement calculation
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setOpenUpward(spaceBelow < 340 && spaceAbove > spaceBelow);
    }
  }, [isOpen]);

  // Filtered slots according to active tab
  const filteredSlots = useMemo(() => {
    if (activeGroup === 'all') return TIME_SLOTS;
    return TIME_SLOTS.filter((s) => s.group === activeGroup);
  }, [activeGroup]);

  // Grouped map for display
  const groupedSlots = useMemo(() => {
    if (activeGroup !== 'all') {
      const grp = TIME_GROUPS.find((g) => g.key === activeGroup);
      return [
        {
          groupKey: activeGroup,
          groupTitle: `${grp?.label || ''} (${grp?.range || ''})`,
          items: filteredSlots
        }
      ];
    }

    const map = {};
    TIME_SLOTS.forEach((slot) => {
      if (!map[slot.group]) {
        const grp = TIME_GROUPS.find((g) => g.key === slot.group);
        map[slot.group] = {
          groupKey: slot.group,
          groupTitle: `${grp?.label || ''} (${grp?.range || ''})`,
          items: []
        };
      }
      map[slot.group].items.push(slot);
    });
    return Object.values(map);
  }, [activeGroup, filteredSlots]);

  const handleSelectSlot = (slotValue) => {
    if (onChange) {
      onChange({ target: { name, value: slotValue } });
    }
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (onChange) {
      onChange({ target: { name, value: '' } });
    }
  };

  return (
    <div className="custom-time-wrapper" ref={containerRef}>
      {/* Hidden input for HTML form accessibility and validation */}
      <input
        type="text"
        id={id}
        name={name}
        value={value}
        required={required}
        readOnly
        tabIndex={-1}
        aria-hidden="true"
        style={{
          position: 'absolute',
          opacity: 0,
          pointerEvents: 'none',
          height: 0,
          width: 0,
          margin: 0,
          padding: 0,
          border: 'none'
        }}
      />

      {/* Trigger Button */}
      <button
        type="button"
        id={`${id}-trigger`}
        className={`custom-time-trigger ${isOpen ? 'is-open' : ''} ${value ? 'has-value' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <div className="time-trigger-left">
          <span className="time-trigger-icon">
            {currentSlot ? (
              <PeriodIcon
                type={currentSlot.group}
                size={16}
                color="#0E3827"
                className="time-svg-icon"
              />
            ) : (
              <ClockIcon
                size={16}
                color={isOpen ? '#0E3827' : '#557261'}
                accentColor="#C5A45A"
                className="time-svg-icon"
              />
            )}
          </span>
          <span className="time-trigger-text">
            {currentSlot ? (
              <span className="time-value-display">
                <span className="time-display-val">{currentSlot.value}</span>
                {currentSlot.sublabel && (
                  <span className="time-display-pill">{currentSlot.sublabel}</span>
                )}
              </span>
            ) : (
              <span className="time-placeholder">{placeholder}</span>
            )}
          </span>
        </div>

        <div className="time-trigger-right">
          {value ? (
            <span
              className="time-clear-btn"
              onClick={handleClear}
              title="Clear selected time"
            >
              ✕
            </span>
          ) : (
            <span className={`time-chevron-icon ${isOpen ? 'rotate' : ''}`}>▾</span>
          )}
        </div>
      </button>

      {/* Luxury Time Select Popup Dialog */}
      {isOpen && (
        <div
          className={`custom-time-popup ${openUpward ? 'open-upward' : ''}`}
          role="dialog"
          aria-modal="true"
          data-lenis-prevent="true"
        >
          {/* Header with Title and Modern Period Filter Tabs */}
          <div className="time-popup-header">
            <div className="time-popup-title-row">
              <div className="time-popup-title">
                <SparkleIcon size={13} color="#C5A45A" className="time-title-ornament" />
                <strong>Select Class Time</strong>
              </div>
              <span className="time-slots-count">
                {filteredSlots.length} Slots Available
              </span>
            </div>

            {/* Period Quick Filter Pills with Clean Modern Icons */}
            <div className="time-group-tabs-row" role="tablist">
              {TIME_GROUPS.map((grp) => {
                const isActive = activeGroup === grp.key;
                return (
                  <button
                    key={grp.key}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`time-tab-pill ${isActive ? 'is-active' : ''}`}
                    onClick={() => setActiveGroup(grp.key)}
                  >
                    <PeriodIcon
                      type={grp.type}
                      size={12}
                      color={isActive ? '#FFFDF8' : '#6A8274'}
                      className="tab-pill-icon"
                    />
                    <span className="tab-pill-label">{grp.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scrollable Slots Container */}
          <div className="time-slots-scroll-list" ref={listRef} data-lenis-prevent="true">
            {groupedSlots.map((grp) => (
              <div key={grp.groupKey} className="time-slots-section">
                <div className="time-section-heading">
                  <PeriodIcon type={grp.groupKey} size={13} color="#7A9184" />
                  <span>{grp.groupTitle}</span>
                </div>

                <div className="time-slots-grid">
                  {grp.items.map((slot) => {
                    const isSelected = value === slot.value || value === slot.time;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        className={`time-slot-card ${isSelected ? 'is-selected' : ''} ${slot.isPopular ? 'is-popular' : ''}`}
                        onClick={() => handleSelectSlot(slot.value)}
                      >
                        <div className="slot-card-left">
                          <div className={`slot-icon-disc ${isSelected ? 'is-active-disc' : ''}`}>
                            <PeriodIcon
                              type={slot.group}
                              size={13}
                              color={isSelected ? '#C5A45A' : '#4E6A5B'}
                            />
                          </div>
                          <div className="slot-text-stack">
                            <span className="slot-time-primary">{slot.time}</span>
                            {slot.sublabel && (
                              <span className="slot-sublabel">
                                {slot.sublabel}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="slot-card-right">
                          {isSelected ? (
                            <span className="slot-checked-pill">
                              <CheckIcon size={11} color="#FFFDF8" />
                              <span>Selected</span>
                            </span>
                          ) : (
                            <span className="slot-status-dot" title="Available slot">●</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Guidance Footer */}
          <div className="time-popup-footer">
            <div className="time-footer-note">
              <SparkleIcon size={11} color="#C5A45A" />
              <span>All sessions are 30-min 1-on-1 private classes</span>
            </div>
            {value && (
              <button
                type="button"
                className="time-footer-clear"
                onClick={handleClear}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
