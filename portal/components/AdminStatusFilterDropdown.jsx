'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icons';

export default function AdminStatusFilterDropdown({
  value = 'all',
  onChange,
  usersList = [],
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Compute live counts
  const allCount = usersList.length;
  const activeCount = usersList.filter(
    (u) => u.status === 'Active' || u.status === 'Verified Scholar' || u.status === 'Enrolled'
  ).length;
  const pendingCount = usersList.filter(
    (u) => u.status?.toLowerCase().includes('pending')
  ).length;
  const suspendedCount = usersList.filter(
    (u) => u.status === 'Suspended'
  ).length;

  const STATUS_OPTIONS = [
    {
      id: 'all',
      label: 'All Statuses',
      description: 'Entire institute cohort',
      count: allCount,
      dotColor: '#0D4A38',
      iconName: 'users',
    },
    {
      id: 'active',
      label: 'Active / Verified',
      description: 'Scholars & enrolled students',
      count: activeCount,
      dotColor: '#10B981',
      iconName: 'check-circle',
    },
    {
      id: 'pending',
      label: 'Pending Approval',
      description: 'Awaiting admin verification',
      count: pendingCount,
      dotColor: '#F59E0B',
      iconName: 'clock',
    },
    {
      id: 'suspended',
      label: 'Suspended',
      description: 'Deactivated accounts',
      count: suspendedCount,
      dotColor: '#EF4444',
      iconName: 'alert-triangle',
    },
  ];

  const currentOption = STATUS_OPTIONS.find((opt) => opt.id === value) || STATUS_OPTIONS[0];

  return (
    <div className="status-dropdown-container" ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="status-dropdown-trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          borderRadius: '10px',
          border: isOpen ? '1.5px solid #0D4A38' : '1.5px solid #CBD5E1',
          background: '#FFFFFF',
          color: '#1E293B',
          fontSize: '13px',
          fontWeight: '600',
          cursor: 'pointer',
          outline: 'none',
          boxShadow: isOpen ? '0 0 0 3px rgba(13, 74, 56, 0.1)' : '0 1px 2px rgba(0,0,0,0.03)',
          transition: 'all 0.15s ease',
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: currentOption.dotColor,
            flexShrink: 0,
            boxShadow: `0 0 0 2px ${currentOption.dotColor}22`,
          }}
        />

        <span style={{ color: '#0F172A', fontWeight: '700' }}>
          {currentOption.label}
        </span>

        <span
          style={{
            fontSize: '11px',
            fontWeight: '700',
            color: '#0D4A38',
            background: 'var(--color-green-light)',
            padding: '2px 7px',
            borderRadius: '999px',
            border: '1px solid var(--color-green-mint)',
          }}
        >
          {currentOption.count}
        </span>

        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            color: '#64748B',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            marginLeft: '2px',
          }}
        >
          <Icon name="chevron-down" size={14} />
        </span>
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div
          className="status-dropdown-popover"
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            minWidth: '260px',
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            boxShadow: '0 16px 36px rgba(13, 74, 56, 0.15), 0 0 0 1px rgba(13, 74, 56, 0.08)',
            zIndex: 70,
            overflow: 'hidden',
            padding: '6px',
            animation: 'fadeInModal 0.18s ease-out',
          }}
        >
          {/* Popover Header */}
          <div
            style={{
              padding: '8px 12px 6px',
              fontSize: '10px',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              color: '#64748B',
              borderBottom: '1px solid #F1F5F9',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>Filter Cohort by Status</span>
            <span>Total: {allCount}</span>
          </div>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {STATUS_OPTIONS.map((opt) => {
              const isSelected = value === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.id);
                    setIsOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: isSelected ? '#F0FDF4' : 'transparent',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                    transition: 'all 0.12s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = '#F8FAF9';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '7px',
                        background: `${opt.dotColor}14`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: opt.dotColor,
                        flexShrink: 0,
                      }}
                    >
                      <Icon name={opt.iconName} size={14} color={opt.dotColor} />
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: '13px',
                          fontWeight: isSelected ? '800' : '600',
                          color: isSelected ? '#0D4A38' : '#1E293B',
                        }}
                      >
                        {opt.label}
                      </div>
                      <div style={{ fontSize: '10.5px', color: '#64748B', marginTop: '1px' }}>
                        {opt.description}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '2px 7px',
                        borderRadius: '999px',
                        background: isSelected ? 'var(--color-green-light)' : '#F1F5F9',
                        color: isSelected ? '#0D4A38' : '#64748B',
                        border: isSelected ? '1px solid var(--color-green-mint)' : '1px solid transparent',
                      }}
                    >
                      {opt.count}
                    </span>

                    {isSelected && (
                      <span style={{ color: '#10B981', display: 'flex', alignItems: 'center' }}>
                        <Icon name="check" size={15} />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
