'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const CalendarGlyph = ({ isSelected = false }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke={isSelected ? '#0E3827' : '#557261'}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="cal-svg-icon"
  >
    <rect x="3" y="4" width="18" height="18" rx="3.5" ry="3.5" />
    <line x1="16" y1="2" x2="16" y2="6" stroke="#C5A45A" strokeWidth="2" />
    <line x1="8" y1="2" x2="8" y2="6" stroke="#C5A45A" strokeWidth="2" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <circle cx="8" cy="14" r="1.1" fill={isSelected ? '#0E3827' : '#557261'} stroke="none" />
    <circle cx="12" cy="14" r="1.1" fill={isSelected ? '#0E3827' : '#557261'} stroke="none" />
    <circle cx="16" cy="14" r="1.1" fill={isSelected ? '#0E3827' : '#557261'} stroke="none" />
    <circle cx="8" cy="18" r="1.1" fill={isSelected ? '#0E3827' : '#557261'} stroke="none" />
    <circle cx="12" cy="18" r="1.1" fill={isSelected ? '#0E3827' : '#557261'} stroke="none" />
    <circle cx="16" cy="18" r="1.1" fill="#C5A45A" stroke="none" />
  </svg>
);

export default function CustomDatePicker({
  value,
  onChange,
  id = 'field-date',
  name = 'preferredDate',
  minDate = null,
  required = false,
  placeholder = 'Select preferred date'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef = useRef(null);

  // Today reference
  const today = useMemo(() => new Date(), []);
  const todayY = today.getFullYear();
  const todayM = today.getMonth();
  const todayD = today.getDate();
  const todayFormatted = `${todayY}-${String(todayM + 1).padStart(2, '0')}-${String(todayD).padStart(2, '0')}`;

  // Parse initial selected date or default to current month/year
  const initialYear = value ? parseInt(value.split('-')[0], 10) : todayY;
  const initialMonth = value ? parseInt(value.split('-')[1], 10) - 1 : todayM;

  const [currentYear, setCurrentYear] = useState(initialYear);
  const [currentMonth, setCurrentMonth] = useState(initialMonth);

  // Keep month view in sync if value changes externally
  useEffect(() => {
    if (value) {
      const parts = value.split('-');
      if (parts.length === 3) {
        setCurrentYear(parseInt(parts[0], 10));
        setCurrentMonth(parseInt(parts[1], 10) - 1);
      }
    }
  }, [value]);

  // Close calendar on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Detect upward vs downward placement when opening
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setOpenUpward(spaceBelow < 320 && spaceAbove > spaceBelow);
    }
  }, [isOpen]);

  // Minimum date parsing
  const minDateObj = useMemo(() => {
    const dStr = minDate || todayFormatted;
    const parts = dStr.split('-');
    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  }, [minDate, todayFormatted]);

  // Month navigation
  const prevMonth = () => {
    if (isPrevMonthDisabled) return;
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  // Check if previous month is entirely in the past
  const isPrevMonthDisabled = useMemo(() => {
    const firstOfCurrentView = new Date(currentYear, currentMonth, 1);
    const firstOfMinMonth = new Date(minDateObj.getFullYear(), minDateObj.getMonth(), 1);
    return firstOfCurrentView <= firstOfMinMonth;
  }, [currentYear, currentMonth, minDateObj]);

  // Calendar days grid calculation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
    const daysInCurrMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days = [];

    // Previous month trailing days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevM = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevY = currentMonth === 0 ? currentYear - 1 : currentYear;
      days.push({
        day: dayNum,
        month: prevM,
        year: prevY,
        isCurrentMonth: false,
        isPast: true
      });
    }

    // Current month days
    for (let d = 1; d <= daysInCurrMonth; d++) {
      const dateObj = new Date(currentYear, currentMonth, d);
      // Reset hours for accurate date comparison
      dateObj.setHours(0, 0, 0, 0);
      const minCopy = new Date(minDateObj);
      minCopy.setHours(0, 0, 0, 0);

      const isPast = dateObj < minCopy;
      const isToday = currentYear === todayY && currentMonth === todayM && d === todayD;
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isSelected = value === dateString;

      days.push({
        day: d,
        month: currentMonth,
        year: currentYear,
        dateString,
        isCurrentMonth: true,
        isPast,
        isToday,
        isSelected,
        isFriday: new Date(currentYear, currentMonth, d).getDay() === 5
      });
    }

    // Next month leading days (fill 35 or 42 grid cells)
    const totalCells = days.length <= 35 ? 35 : 42;
    const remaining = totalCells - days.length;
    for (let j = 1; j <= remaining; j++) {
      const nextM = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextY = currentMonth === 11 ? currentYear + 1 : currentYear;
      days.push({
        day: j,
        month: nextM,
        year: nextY,
        isCurrentMonth: false,
        isPast: false
      });
    }

    return days;
  }, [currentYear, currentMonth, minDateObj, todayY, todayM, todayD, value]);

  // Select a date
  const handleSelectDate = (dateString) => {
    onChange({ target: { name, value: dateString } });
    setIsOpen(false);
  };

  // Quick shortcuts
  const selectToday = () => {
    handleSelectDate(todayFormatted);
    setCurrentYear(todayY);
    setCurrentMonth(todayM);
  };

  const selectTomorrow = () => {
    const tm = new Date(today);
    tm.setDate(today.getDate() + 1);
    const tmStr = `${tm.getFullYear()}-${String(tm.getMonth() + 1).padStart(2, '0')}-${String(tm.getDate()).padStart(2, '0')}`;
    handleSelectDate(tmStr);
    setCurrentYear(tm.getFullYear());
    setCurrentMonth(tm.getMonth());
  };

  const selectNextWeekend = () => {
    const target = new Date(today);
    // Find next Saturday (day 6)
    const dayOfWeek = target.getDay();
    const daysUntilSat = (6 - dayOfWeek + 7) % 7 || 7;
    target.setDate(target.getDate() + daysUntilSat);
    const dateStr = `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, '0')}-${String(target.getDate()).padStart(2, '0')}`;
    handleSelectDate(dateStr);
    setCurrentYear(target.getFullYear());
    setCurrentMonth(target.getMonth());
  };

  // Display label formatting
  const displayLabel = useMemo(() => {
    if (!value) return null;
    try {
      const parts = value.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        return d.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      }
    } catch (e) {
      return value;
    }
    return value;
  }, [value]);

  return (
    <div className="custom-calendar-wrapper" ref={containerRef} data-lenis-prevent="true">
      {/* Hidden input to ensure native form submission and validation compatibility */}
      <input
        type="hidden"
        id={id}
        name={name}
        value={value || ''}
        required={required}
      />

      {/* Main Trigger Button */}
      <button
        type="button"
        id={`${id}-trigger`}
        className={`custom-calendar-trigger ${isOpen ? 'is-open' : ''} ${value ? 'has-value' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <div className="cal-trigger-left">
          <span className="cal-trigger-icon">
            <CalendarGlyph isSelected={Boolean(value)} />
          </span>
          <span className="cal-trigger-text">
            {displayLabel || <span className="cal-placeholder">{placeholder}</span>}
          </span>
        </div>
        <div className="cal-trigger-right">
          {value ? (
            <span
              className="cal-clear-btn"
              onClick={(e) => {
                e.stopPropagation();
                onChange({ target: { name, value: '' } });
              }}
              title="Clear date"
            >
              ✕
            </span>
          ) : (
            <span className={`cal-chevron-icon ${isOpen ? 'rotate' : ''}`}>▾</span>
          )}
        </div>
      </button>

      {/* Luxury Calendar Dropdown Dialog */}
      {isOpen && (
        <div
          className={`custom-calendar-popup ${openUpward ? 'open-upward' : ''}`}
          role="dialog"
          aria-modal="true"
          data-lenis-prevent="true"
        >
          {/* Calendar Header with Month/Year Navigation */}
          <div className="cal-popup-header">
            <button
              type="button"
              className="cal-nav-btn prev-btn"
              onClick={prevMonth}
              disabled={isPrevMonthDisabled}
              title="Previous Month"
            >
              ‹
            </button>

            <div className="cal-month-year-title">
              <strong className="cal-month-name">{MONTH_NAMES[currentMonth]}</strong>
              <span className="cal-year-num">{currentYear}</span>
            </div>

            <button
              type="button"
              className="cal-nav-btn next-btn"
              onClick={nextMonth}
              title="Next Month"
            >
              ›
            </button>
          </div>

          {/* Quick Date Shortcut Pills */}
          <div className="cal-quick-shortcuts">
            <button type="button" className="cal-quick-pill" onClick={selectToday}>
              ✦ Today
            </button>
            <button type="button" className="cal-quick-pill" onClick={selectTomorrow}>
              Tomorrow
            </button>
            <button type="button" className="cal-quick-pill" onClick={selectNextWeekend}>
              Weekend (Sat)
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="cal-weekdays-row">
            {DAY_NAMES.map((d, idx) => (
              <span
                key={d}
                className={`cal-weekday-label ${idx === 5 ? 'is-friday' : ''}`}
                title={idx === 5 ? "Jumu'ah / Friday" : undefined}
              >
                {d}
              </span>
            ))}
          </div>

          {/* Calendar Month Grid */}
          <div className="cal-days-grid">
            {calendarDays.map((item, index) => {
              if (!item.isCurrentMonth) {
                return (
                  <div key={`empty-${index}`} className="cal-day-cell is-outside-month">
                    <span>{item.day}</span>
                  </div>
                );
              }

              return (
                <button
                  type="button"
                  key={item.dateString}
                  disabled={item.isPast}
                  className={`cal-day-cell ${item.isSelected ? 'is-selected' : ''} ${item.isToday ? 'is-today' : ''} ${item.isPast ? 'is-past' : ''} ${item.isFriday ? 'is-friday' : ''}`}
                  onClick={() => handleSelectDate(item.dateString)}
                  title={item.isToday ? `Today (${item.dateString})` : item.dateString}
                >
                  <span className="cal-day-number">{item.day}</span>
                  {item.isToday && !item.isSelected && <span className="cal-today-dot" />}
                </button>
              );
            })}
          </div>

          {/* Calendar Footer Bar */}
          <div className="cal-popup-footer">
            <span className="cal-footer-note">✦ Select any convenient diagnostic date</span>
            {value && (
              <button
                type="button"
                className="cal-footer-clear-btn"
                onClick={() => {
                  onChange({ target: { name, value: '' } });
                }}
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
