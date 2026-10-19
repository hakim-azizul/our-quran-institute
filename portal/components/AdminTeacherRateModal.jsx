'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icons';

export default function AdminTeacherRateModal({
  isOpen = false,
  onClose,
  teacher = null,
  month = 'October 2026',
  onRateUpdated,
}) {
  const [mounted, setMounted] = useState(false);
  const [rateInput, setRateInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (teacher) {
      setRateInput(String(teacher.ratePerClass || 35));
      setFeedbackMsg('');
      setErrorMsg('');
    }
  }, [teacher, isOpen]);

  if (!isOpen || !teacher) return null;

  const currentRate = Number(teacher.ratePerClass || 35);
  const parsedNewRate = parseFloat(rateInput);
  const isValidRate = !isNaN(parsedNewRate) && parsedNewRate > 0;
  const effectiveNewRate = isValidRate ? parsedNewRate : currentRate;

  const completedClasses = teacher.totalClassesTaught || (teacher.id === 'QI-FAC-014' ? 34 : teacher.id === 'QI-FAC-028' ? 28 : 19);
  const bonus = teacher.bonus || (teacher.id === 'QI-FAC-014' ? 50 : 0);

  // Live Cumulative Calculations
  const currentBase = completedClasses * currentRate;
  const currentTotal = currentBase + bonus;

  const recalculatedBase = completedClasses * effectiveNewRate;
  const recalculatedTotal = recalculatedBase + bonus;
  const totalDifference = recalculatedTotal - currentTotal;
  const percentageChange = currentTotal > 0 ? ((totalDifference / currentTotal) * 100).toFixed(1) : 0;

  const PRESETS = [
    { label: '$25 / Class', rate: 25, tier: 'Junior Scholar' },
    { label: '$30 / Class', rate: 30, tier: 'Standard Qari' },
    { label: '$35 / Class', rate: 35, tier: 'Senior Sanad' },
    { label: '$40 / Class', rate: 40, tier: 'Master Faculty' },
    { label: '$45 / Class', rate: 45, tier: 'Qira’at Specialist' },
    { label: '$50 / Class', rate: 50, tier: 'Executive Shaykh' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidRate) {
      setErrorMsg('Please enter a valid compensation rate greater than $0.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');
      setFeedbackMsg('');

      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'set_teacher_rate',
          teacherId: teacher.id,
          newRate: effectiveNewRate,
          month: month,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFeedbackMsg(data.message || `Rate updated to $${effectiveNewRate.toFixed(2)}/class successfully!`);
        if (onRateUpdated) {
          onRateUpdated({
            teacherId: teacher.id,
            newRate: effectiveNewRate,
            updatedUser: data.user,
            updatedSalary: data.salary,
          });
        }
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setErrorMsg(data.error || 'Failed to update teacher rate.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error while saving faculty rate.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <div
      className="admin-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 24, 18, 0.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeInModal 0.2s ease-out',
      }}
    >
      <div
        className="admin-rate-modal-box"
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(13, 74, 56, 0.12)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'scaleInModal 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: '#0D4A38',
            borderBottom: '2px solid #D4AF37',
            padding: '24px 28px',
            color: '#FFFFFF',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(212, 175, 55, 0.16)',
                  border: '1.5px solid rgba(212, 175, 55, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D4AF37',
                  flexShrink: 0,
                }}
              >
                <Icon name="credit-card" size={24} />
              </div>
              <div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    color: '#D4AF37',
                    display: 'block',
                    marginBottom: '2px',
                  }}
                >
                  Admin Compensation Control
                </span>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '20px',
                    fontFamily: 'var(--font-cormorant), Georgia, serif',
                    fontWeight: '700',
                    color: '#FFFFFF',
                  }}
                >
                  Set Per-Class Honorarium
                </h2>
                <div style={{ fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.8)', marginTop: '2px' }}>
                  Target: <strong>{teacher.name}</strong> ({teacher.id})
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: 'none',
                color: '#FFFFFF',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              aria-label="Close modal"
            >
              <Icon name="x" size={16} />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <form onSubmit={handleSubmit} style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Teacher Profile Summary Card */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              background: '#F8FAF9',
              borderRadius: '12px',
              border: '1px solid #E5E9E7',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Active Billing Cycle
              </div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#0D4A38' }}>
                {month}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Successful Classes
              </div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#0D4A38',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  justifyContent: 'flex-end',
                }}
              >
                <Icon name="check-circle" size={14} color="#10B981" />
                <span>{completedClasses} Completed</span>
              </div>
            </div>
          </div>

          {/* Quick Rate Presets */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12.5px',
                fontWeight: '700',
                color: '#1F2937',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Select Standard Academic Rate Tier
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
              }}
            >
              {PRESETS.map((p) => {
                const isSelected = effectiveNewRate === p.rate;
                return (
                  <button
                    key={p.rate}
                    type="button"
                    onClick={() => setRateInput(String(p.rate))}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '10px',
                      border: isSelected ? '2px solid #0D4A38' : '1.5px solid #E5E7EB',
                      background: isSelected ? '#F0FDF4' : '#FFFFFF',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 2px 6px rgba(13, 74, 56, 0.12)' : 'none',
                    }}
                  >
                    <div style={{ fontSize: '14px', fontWeight: '800', color: isSelected ? '#0D4A38' : '#1F2937' }}>
                      {p.label}
                    </div>
                    <div style={{ fontSize: '10.5px', color: isSelected ? '#15803D' : '#6B7280', marginTop: '2px' }}>
                      {p.tier}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Input */}
          <div>
            <label
              htmlFor="custom-rate-input"
              style={{
                display: 'block',
                fontSize: '12.5px',
                fontWeight: '700',
                color: '#1F2937',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Or Enter Custom Per-Class Price ($)
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '16px',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#0D4A38',
                }}
              >
                $
              </span>
              <input
                id="custom-rate-input"
                type="number"
                step="0.5"
                min="5"
                max="250"
                value={rateInput}
                onChange={(e) => setRateInput(e.target.value)}
                placeholder="e.g. 40.00"
                style={{
                  width: '100%',
                  padding: '12px 140px 12px 34px',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#0D4A38',
                  borderRadius: '10px',
                  border: '1.5px solid #D1D5DB',
                  outline: 'none',
                  background: '#FFFFFF',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
                }}
                required
              />
              <span
                style={{
                  position: 'absolute',
                  right: '16px',
                  fontSize: '12.5px',
                  fontWeight: '600',
                  color: '#6B7280',
                  pointerEvents: 'none',
                }}
              >
                / Class Session
              </span>
            </div>
          </div>

          {/* Real-Time Cumulative Salary Calculator */}
          <div
            style={{
              padding: '16px 20px',
              borderRadius: '14px',
              background: '#F8FAF9',
              border: '1.5px solid #D1E5DE',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px',
                borderBottom: '1px dashed #C3DDD4',
                paddingBottom: '8px',
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#0D4A38' }}>
                Cumulative Payroll Recalculation
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: totalDifference >= 0 ? '#DCFCE7' : '#FEE2E2',
                  color: totalDifference >= 0 ? '#15803D' : '#B91C1C',
                }}
              >
                {totalDifference >= 0 ? `+${percentageChange}% Payout` : `${percentageChange}% Payout`}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#374151' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Successful Classes Completed:</span>
                <strong>{completedClasses} Sessions</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Per-Class Honorarium:</span>
                <span>
                  <span style={{ textDecoration: effectiveNewRate !== currentRate ? 'line-through' : 'none', color: '#9CA3AF', marginRight: '6px' }}>
                    ${currentRate.toFixed(2)}
                  </span>
                  <strong style={{ color: '#0D4A38', fontSize: '14px' }}>
                    ${effectiveNewRate.toFixed(2)} / class
                  </strong>
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Recalculated Base Salary:</span>
                <strong>${recalculatedBase.toFixed(2)}</strong>
              </div>

              {bonus > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#D97706' }}>
                  <span>Faculty Performance Bonus:</span>
                  <strong>+${bonus.toFixed(2)}</strong>
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginTop: '8px',
                  paddingTop: '10px',
                  borderTop: '1.5px solid #D1E5DE',
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#0D4A38' }}>
                  New Total Cumulative Payable:
                </span>
                <span style={{ fontSize: '20px', fontWeight: '800', color: '#0D4A38' }}>
                  ${recalculatedTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Messages */}
          {errorMsg && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: '#FEE2E2',
                border: '1px solid #FCA5A5',
                color: '#991B1B',
                fontSize: '12.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Icon name="alert-triangle" size={15} color="#991B1B" />
              <span>{errorMsg}</span>
            </div>
          )}

          {feedbackMsg && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: '#DCFCE7',
                border: '1px solid #86EFAC',
                color: '#166534',
                fontSize: '12.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Icon name="check-circle" size={15} color="#166534" />
              <span>{feedbackMsg}</span>
            </div>
          )}

          {/* Modal Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '12px',
              marginTop: '4px',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: '1px solid #D1D5DB',
                background: '#FFFFFF',
                color: '#4B5563',
                fontSize: '13.5px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !isValidRate}
              style={{
                padding: '10px 24px',
                borderRadius: '10px',
                border: '1px solid #D4AF37',
                background: '#0D4A38',
                color: '#FFFFFF',
                fontSize: '13.5px',
                fontWeight: '700',
                cursor: isSubmitting || !isValidRate ? 'not-allowed' : 'pointer',
                opacity: isSubmitting || !isValidRate ? 0.6 : 1,
                boxShadow: '0 4px 12px rgba(13, 74, 56, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {isSubmitting ? (
                <>
                  <Icon name="loader" size={16} />
                  <span>Recalculating...</span>
                </>
              ) : (
                <>
                  <Icon name="check-circle" size={16} />
                  <span>Save &amp; Recalculate Payroll</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
}
