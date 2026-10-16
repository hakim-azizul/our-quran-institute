'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icons';

export default function TeacherSalaryDashboard({ teacherUser }) {
  const [isMounted, setIsMounted] = useState(false);
  const [salaryData, setSalaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('October 2026');
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [isCycleDropdownOpen, setIsCycleDropdownOpen] = useState(false);
  const cycleDropdownRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (cycleDropdownRef.current && !cycleDropdownRef.current.contains(event.target)) {
        setIsCycleDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const billingCycles = [
    {
      id: 'cycle-oct-2026',
      month: 'October 2026',
      label: 'October 2026',
      status: 'Current Cycle',
      statusType: 'current',
      classesCount: 34,
      amount: '$1,240.00',
      description: '34 Classes Completed • Payout Authorized',
    },
    {
      id: 'cycle-sep-2026',
      month: 'September 2026',
      label: 'September 2026',
      status: 'Disbursed',
      statusType: 'disbursed',
      classesCount: 32,
      amount: '$1,170.00',
      description: '32 Classes Completed • Direct Deposit Sent',
    },
    {
      id: 'cycle-aug-2026',
      month: 'August 2026',
      label: 'August 2026',
      status: 'Disbursed',
      statusType: 'disbursed',
      classesCount: 30,
      amount: '$1,100.00',
      description: '30 Classes Completed • Direct Deposit Sent',
    },
  ];

  const activeCycle =
    billingCycles.find((c) => c.month === selectedMonth) || billingCycles[0];

  useEffect(() => {
    fetchSalary();
  }, [teacherUser?.id, selectedMonth]);

  const fetchSalary = async () => {
    try {
      setLoading(true);
      const teacherId = teacherUser?.id || 'QI-FAC-014';
      const res = await fetch(
        `/api/finance?type=salary&teacherId=${encodeURIComponent(teacherId)}&month=${encodeURIComponent(selectedMonth)}`
      );
      const data = await res.json();
      if (data.success && data.salary) {
        setSalaryData(data.salary);
      }
    } catch (err) {
      console.error('Failed to load salary:', err);
    } finally {
      setLoading(false);
    }
  };

  const ratePerClass = salaryData?.ratePerClass || teacherUser?.ratePerClass || 35.0;
  const totalClassesTaught = salaryData?.totalClassesTaught || salaryData?.sessionsCount || 34;
  const calculatedSalary =
    salaryData?.calculatedSalary !== undefined
      ? salaryData.calculatedSalary
      : totalClassesTaught * ratePerClass;
  const bonus = salaryData?.bonus || 0;
  const totalPayable =
    salaryData?.totalPayable !== undefined
      ? salaryData.totalPayable
      : calculatedSalary + bonus;
  const status = salaryData?.status || 'Approved';

  // Realistic mock sessions breakdown for the active month using the per-class rate
  const fallbackSessions = [
    {
      id: 'CLS-OCT-01',
      date: '2026-10-16',
      time: '10:00 AM - 10:50 AM',
      studentName: 'Tariq Al-Mansoor',
      courseTitle: 'Memorization & Recitation (Hifz) with Tajweed',
      topic: 'Surah Yusuf (Ayahs 1-22) - Hifz & Tajweed Assessment',
      classType: '1-on-1 Quran Recitation',
      ratePerClass: ratePerClass,
      amount: ratePerClass,
      status: 'Verified',
    },
    {
      id: 'CLS-OCT-02',
      date: '2026-10-16',
      time: '11:15 AM - 12:05 PM',
      studentName: 'Maryam Al-Qasim',
      courseTitle: 'Memorization & Recitation (Hifz) with Tajweed',
      topic: 'Surah Al-Mumtahanah & Tajweed Evaluation',
      classType: '1-on-1 Tajweed Assessment',
      ratePerClass: ratePerClass,
      amount: ratePerClass,
      status: 'Verified',
    },
    {
      id: 'CLS-OCT-03',
      date: '2026-10-15',
      time: '10:00 AM - 10:50 AM',
      studentName: 'Tariq Al-Mansoor',
      courseTitle: 'Memorization & Recitation (Hifz) with Tajweed',
      topic: 'Surah Hud (Ayahs 80-115) - Makharij Precision',
      classType: '1-on-1 Hifz Memorization',
      ratePerClass: ratePerClass,
      amount: ratePerClass,
      status: 'Verified',
    },
    {
      id: 'CLS-OCT-04',
      date: '2026-10-15',
      time: '04:00 PM - 04:50 PM',
      studentName: 'Zaid Bin Khalid',
      courseTitle: 'Memorization & Recitation (Hifz) with Tajweed',
      topic: 'Surah Al-Baqarah (Ayat al-Kursi) - Stopping Signs & Waqf',
      classType: '1-on-1 Quran Recitation',
      ratePerClass: ratePerClass,
      amount: ratePerClass,
      status: 'Verified',
    },
    {
      id: 'CLS-OCT-05',
      date: '2026-10-14',
      time: '10:00 AM - 10:50 AM',
      studentName: 'Tariq Al-Mansoor',
      courseTitle: 'Memorization & Recitation (Hifz) with Tajweed',
      topic: 'Para 11 Sabqi Revision & Stopping Signs (Waqf)',
      classType: '1-on-1 Sabqi Revision',
      ratePerClass: ratePerClass,
      amount: ratePerClass,
      status: 'Verified',
    },
    {
      id: 'CLS-OCT-06',
      date: '2026-10-14',
      time: '11:15 AM - 12:05 PM',
      studentName: 'Maryam Al-Qasim',
      courseTitle: 'Memorization & Recitation (Hifz) with Tajweed',
      topic: 'Juz 27 Revision (Ar-Rahman to Al-Hadid)',
      classType: '1-on-1 Hifz Revision',
      ratePerClass: ratePerClass,
      amount: ratePerClass,
      status: 'Verified',
    },
    {
      id: 'CLS-OCT-07',
      date: '2026-10-13',
      time: '10:00 AM - 10:50 AM',
      studentName: 'Tariq Al-Mansoor',
      courseTitle: 'Memorization & Recitation (Hifz) with Tajweed',
      topic: 'Surah Yunus (Ayahs 60-109) - Madd Lazim Corrections',
      classType: '1-on-1 Tajweed & Recitation',
      ratePerClass: ratePerClass,
      amount: ratePerClass,
      status: 'Verified',
    },
    {
      id: 'CLS-OCT-08',
      date: '2026-10-12',
      time: '04:00 PM - 04:50 PM',
      studentName: 'Zaid Bin Khalid',
      courseTitle: 'Memorization & Recitation (Hifz) with Tajweed',
      topic: 'Noorani Qaida & Basic Makharij Articulation Points',
      classType: '1-on-1 Qaida & Tajweed Foundation',
      ratePerClass: ratePerClass,
      amount: ratePerClass,
      status: 'Verified',
    },
  ];

  const sessionsBreakdown =
    salaryData?.classesList && salaryData.classesList.length > 0
      ? salaryData.classesList
      : fallbackSessions;

  return (
    <div className="salary-dashboard-wrapper">
      {/* Top Header Card */}
      <div className="salary-header-card">
        <div className="salary-header-content">
          <div className="salary-scholar-info">
            <span className="scholar-avatar">
              <Icon name="scholar" size={26} />
            </span>
            <div>
              <h2 className="salary-scholar-name">
                {teacherUser?.name || salaryData?.teacherName || 'Dr. Sheikh Ahmad Al-Azhari'}
              </h2>
              <p className="salary-scholar-title">
                {teacherUser?.specialization || 'Tajweed & Quran Memorization'} •{' '}
                {teacherUser?.sanadCertification || 'Verified Faculty Scholar'}
              </p>
            </div>
          </div>

          <div className="salary-month-selector" ref={cycleDropdownRef}>
            {/* Native hidden fallback for screen readers and automated testing */}
            <label htmlFor="salary-month-select" className="sr-only">
              Select Faculty Billing Cycle:
            </label>
            <select
              id="salary-month-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="sr-only"
              aria-hidden="true"
              tabIndex={-1}
            >
              <option value="October 2026">October 2026 (Current Cycle)</option>
              <option value="September 2026">September 2026 (Disbursed)</option>
              <option value="August 2026">August 2026 (Disbursed)</option>
            </select>

            {/* Premium Interactive Dropdown Button */}
            <button
              type="button"
              className={`cycle-trigger-btn ${isCycleDropdownOpen ? 'open' : ''}`}
              onClick={() => setIsCycleDropdownOpen(!isCycleDropdownOpen)}
              aria-haspopup="listbox"
              aria-expanded={isCycleDropdownOpen}
              title="Click to switch faculty billing cycle"
            >
              <div className="cycle-btn-calendar-icon">
                <Icon name="calendar" size={17} />
              </div>

              <div className="cycle-btn-text-wrap">
                <span className="cycle-btn-sub-label">BILLING CYCLE</span>
                <div className="cycle-btn-main-row">
                  <span className="cycle-btn-month-name">{activeCycle.label}</span>
                  <span className={`cycle-status-pill ${activeCycle.statusType}`}>
                    {activeCycle.statusType === 'current' ? (
                      <>
                        <span className="pulse-indicator"></span> Current
                      </>
                    ) : (
                      <>
                        <Icon name="check-circle" size={11} style={{ marginRight: 2 }} /> Disbursed
                      </>
                    )}
                  </span>
                </div>
              </div>

              <Icon
                name="chevron-down"
                size={15}
                className={`cycle-chevron-icon ${isCycleDropdownOpen ? 'open' : ''}`}
              />
            </button>

            {/* Custom Popover Dropdown Menu */}
            {isCycleDropdownOpen && (
              <div className="cycle-dropdown-menu" role="listbox">
                <div className="cycle-dropdown-header">
                  <span className="cycle-dropdown-header-title">Faculty Billing Cycles</span>
                  <span className="cycle-dropdown-header-badge">Per-Class Basis</span>
                </div>

                <div className="cycle-dropdown-list">
                  {billingCycles.map((cycle) => {
                    const isSelected = selectedMonth === cycle.month;
                    return (
                      <button
                        key={cycle.id}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        className={`cycle-dropdown-item ${isSelected ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedMonth(cycle.month);
                          setIsCycleDropdownOpen(false);
                        }}
                      >
                        <div className="cycle-item-left">
                          <div className="cycle-item-title-row">
                            <span className="cycle-item-month">{cycle.label}</span>
                            <span className={`cycle-status-pill ${cycle.statusType}`}>
                              {cycle.statusType === 'current' ? (
                                <>
                                  <span className="pulse-indicator"></span> Current
                                </>
                              ) : (
                                <>
                                  <Icon name="check-circle" size={10} style={{ marginRight: 2 }} /> Disbursed
                                </>
                              )}
                            </span>
                          </div>
                          <span className="cycle-item-sub">{cycle.description}</span>
                        </div>

                        <div className="cycle-item-right">
                          {isSelected && (
                            <span className="cycle-item-check">
                              <Icon name="check" size={16} />
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="cycle-dropdown-footer">
                  <Icon name="info" size={12} />
                  <span>Real-time teaching log verified per completed class</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payout Approval Banner */}
        <div className="salary-status-banner">
          <div className="status-banner-left">
            <span className="status-badge-icon">
              {status === 'Approved' || status === 'Disbursed' ? (
                <Icon name="shield-check" size={18} />
              ) : (
                <Icon name="clock" size={18} />
              )}
            </span>
            <div>
              <span className="status-banner-title">
                Payroll Status: <strong>{status}</strong>
                <span className="payroll-model-tag">Per-Class Compensation Model</span>
              </span>
              <span className="status-banner-sub">
                {status === 'Approved'
                  ? `Approved for ${totalClassesTaught} verified class sessions by Dr. Ibrahim Al-Mansoor (Academic Director). Scheduled for direct deposit.`
                  : status === 'Disbursed'
                  ? `Disbursed successfully to faculty bank account on record. Thank you for your dedicated Quran teaching.`
                  : `Currently accumulating completed class sessions in real-time ($${ratePerClass.toFixed(2)}/class). Submitted for monthly audit.`}
              </span>
            </div>
          </div>
          <div className="status-banner-right">
            <button
              type="button"
              className="btn-print-voucher"
              onClick={() => setIsVoucherModalOpen(true)}
            >
              <Icon name="printer" size={14} style={{ marginRight: 6 }} />
              Print Faculty Voucher
            </button>
          </div>
        </div>
      </div>

      {/* KPI Financial Cards (Per-Class Model) */}
      <div className="salary-metrics-grid">
        <div className="salary-metric-card">
          <div className="metric-icon-wrap" style={{ background: '#EBF5F0', color: '#0D4A38' }}>
            <Icon name="book-open" size={22} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Total Completed Classes</span>
            <span className="metric-value">{totalClassesTaught} Classes</span>
            <span className="metric-sub">Verified 1-on-1 Quran &amp; Tajweed sessions</span>
          </div>
        </div>

        <div className="salary-metric-card">
          <div className="metric-icon-wrap" style={{ background: '#FEF3C7', color: '#D97706' }}>
            <Icon name="dollar-sign" size={22} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Rate Per Class</span>
            <span className="metric-value">${ratePerClass.toFixed(2)} / class</span>
            <span className="metric-sub">Institute Contracted Class Honorarium</span>
          </div>
        </div>

        <div className="salary-metric-card">
          <div className="metric-icon-wrap" style={{ background: '#EEF2FF', color: '#4F46E5' }}>
            <Icon name="bar-chart" size={22} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Base Class Earnings</span>
            <span className="metric-value">${calculatedSalary.toFixed(2)}</span>
            <span className="metric-sub">
              {totalClassesTaught} classes × ${ratePerClass.toFixed(2)}/class
            </span>
          </div>
        </div>

        <div className="salary-metric-card highlight-card">
          <div className="metric-icon-wrap" style={{ background: '#0D4A38', color: '#FFDF85' }}>
            <Icon name="award" size={22} color="#FFDF85" />
          </div>
          <div className="metric-content">
            <span className="metric-label">Total Net Payable</span>
            <span className="metric-value highlight-value">${totalPayable.toFixed(2)}</span>
            <span className="metric-sub" style={{ color: '#062A1F', fontWeight: 600 }}>
              {bonus > 0 ? `Includes +$${bonus.toFixed(2)} Mumtaz Retention Bonus` : 'Direct Deposit Authorized'}
            </span>
          </div>
        </div>
      </div>

      {/* Class Sessions Ledger Table */}
      <div className="salary-table-card">
        <div className="table-card-header">
          <div>
            <h3 className="table-card-title">Completed Class Sessions Ledger ({selectedMonth})</h3>
            <p className="table-card-subtitle">
              Detailed breakdown of verified 1-on-1 recitation, Hifz, and Tajweed classes taught this billing period (${ratePerClass.toFixed(2)}/class).
            </p>
          </div>
          <span className="ledger-count-pill">{totalClassesTaught} Total Classes Completed</span>
        </div>

        <div className="salary-table-responsive">
          <table className="salary-table">
            <thead>
              <tr>
                <th>Date &amp; Time</th>
                <th>Student</th>
                <th>Session Curriculum / Surah</th>
                <th>Class Type</th>
                <th>Rate / Class</th>
                <th>Amount Earned</th>
                <th>Audit Status</th>
              </tr>
            </thead>
            <tbody>
              {sessionsBreakdown.map((ses) => (
                <tr key={ses.id}>
                  <td>
                    <div className="session-date-cell">
                      <span className="session-date">{ses.date}</span>
                      <span className="session-time">{ses.time}</span>
                    </div>
                  </td>
                  <td>
                    <span className="student-name-cell">
                      <Icon name="student" size={14} style={{ marginRight: 4 }} /> {ses.studentName}
                    </span>
                  </td>
                  <td>
                    <span className="session-topic-cell">{ses.topic}</span>
                  </td>
                  <td>
                    <span className="session-type-badge">
                      {ses.classType || '1-on-1 Quran Class'}
                    </span>
                  </td>
                  <td>
                    <span className="rate-cell">${(ses.ratePerClass || ratePerClass).toFixed(2)} / class</span>
                  </td>
                  <td>
                    <span className="amount-cell">${(ses.amount || ratePerClass).toFixed(2)}</span>
                  </td>
                  <td>
                    <span className="audit-badge-verified">
                      <Icon name="check-circle" size={12} style={{ marginRight: 4 }} />
                      {ses.status || 'Verified'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-card-footer">
          <div className="footer-notes">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Icon name="info" size={14} /> Class compensation is calculated strictly per completed session upon student recitation evaluation.
            </span>
          </div>
          <div className="footer-summary">
            <span>
              Period Total ({totalClassesTaught} Classes): <strong>${totalPayable.toFixed(2)}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Printable Faculty Voucher Modal */}
      {isVoucherModalOpen && isMounted && createPortal(
        <div className="voucher-modal-backdrop" onClick={() => setIsVoucherModalOpen(false)}>
          <div
            className="voucher-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="voucher-modal-top-actions">
              <span className="voucher-modal-title">
                <Icon name="receipt" size={16} style={{ marginRight: 6 }} /> Official Faculty Remuneration Voucher
              </span>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  className="btn-print-action-trigger"
                  onClick={() => window.print()}
                >
                  <Icon name="printer" size={14} style={{ marginRight: 6 }} /> Print / Save PDF
                </button>
                <button
                  type="button"
                  className="btn-voucher-close"
                  onClick={() => setIsVoucherModalOpen(false)}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="printable-voucher-card" id="printable-salary-voucher">
              {/* Institute Header */}
              <div className="voucher-header">
                <div className="voucher-brand">
                  <div className="voucher-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
                  <h1 className="voucher-institute-title">OUR QURAN INSTITUTE</h1>
                  <span className="voucher-institute-subtitle">
                    Department of Academic Affairs &amp; Faculty Disbursement
                  </span>
                  <span className="voucher-accreditation">
                    Sanad Certified Faculty • Al-Azhar &amp; Madinah Connected Chains
                  </span>
                </div>
                <div className="voucher-meta-box">
                  <span className="voucher-badge-type">FACULTY PAYSLIP</span>
                  <span className="voucher-ref">Ref: VCH-202610-014</span>
                  <span className="voucher-date">Date: October 16, 2026</span>
                  <span className="voucher-cycle">Cycle: <strong>{selectedMonth}</strong></span>
                </div>
              </div>

              {/* Scholar and Model Overview */}
              <div className="voucher-info-grid">
                <div className="voucher-info-block">
                  <span className="voucher-info-label">FACULTY SCHOLAR</span>
                  <span className="voucher-scholar-name">
                    {teacherUser?.name || salaryData?.teacherName || 'Dr. Sheikh Ahmad Al-Azhari'}
                  </span>
                  <span className="voucher-info-detail">
                    Faculty ID: <strong>{teacherUser?.id || salaryData?.teacherId || 'QI-FAC-014'}</strong>
                  </span>
                  <span className="voucher-info-detail">
                    Specialization: {teacherUser?.specialization || 'Tajweed & Quran Memorization'}
                  </span>
                  <span className="voucher-info-detail">
                    Sanad: {teacherUser?.sanadCertification || '10 Qira’at Mutawatirah'}
                  </span>
                </div>

                <div className="voucher-info-block highlight-block">
                  <span className="voucher-info-label">COMPENSATION MODEL</span>
                  <span className="voucher-model-name">Per-Class Remuneration Model</span>
                  <span className="voucher-info-detail">
                    Contracted Rate: <strong>${ratePerClass.toFixed(2)} / Class Session</strong>
                  </span>
                  <span className="voucher-info-detail">
                    Completed &amp; Audited Classes: <strong>{totalClassesTaught} Classes</strong>
                  </span>
                  <span className="voucher-info-detail">
                    Disbursement Status: <strong style={{ color: '#047857' }}>{status}</strong>
                  </span>
                </div>
              </div>

              {/* Remuneration Breakdown Table */}
              <div className="voucher-table-wrapper">
                <table className="voucher-table">
                  <thead>
                    <tr>
                      <th>Remuneration Description</th>
                      <th>Contract Basis</th>
                      <th style={{ textAlign: 'center' }}>Completed Units</th>
                      <th style={{ textAlign: 'right' }}>Total Payable</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>1-on-1 Quran Live Class Session Instruction</strong>
                        <div style={{ fontSize: '11.5px', color: '#6B7280' }}>
                          Verified recitation assessments, Tajweed pronunciation &amp; Hifz tracking
                        </div>
                      </td>
                      <td>${ratePerClass.toFixed(2)} per class</td>
                      <td style={{ textAlign: 'center' }}><strong>{totalClassesTaught} classes</strong></td>
                      <td style={{ textAlign: 'right', fontWeight: '700' }}>${calculatedSalary.toFixed(2)}</td>
                    </tr>
                    {bonus > 0 && (
                      <tr>
                        <td>
                          <strong>Mumtaz Faculty Excellence &amp; Retention Bonus</strong>
                          <div style={{ fontSize: '11.5px', color: '#6B7280' }}>
                            Awarded for 100% student punctuality, zero cancellations &amp; high retention
                          </div>
                        </td>
                        <td>Incentive Bonus</td>
                        <td style={{ textAlign: 'center' }}>1 Cycle</td>
                        <td style={{ textAlign: 'right', fontWeight: '700', color: '#047857' }}>
                          +${bonus.toFixed(2)}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td>
                        <strong>Institutional Statutory Withholdings &amp; Admin Fees</strong>
                        <div style={{ fontSize: '11.5px', color: '#6B7280' }}>
                          Institute covers platform, LMS, and video hosting costs in full
                        </div>
                      </td>
                      <td>Waived (0%)</td>
                      <td style={{ textAlign: 'center' }}>—</td>
                      <td style={{ textAlign: 'right', fontWeight: '700' }}>$0.00</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="voucher-total-row">
                      <td colSpan={3}>
                        <span style={{ fontSize: '15px', fontWeight: '800' }}>
                          TOTAL AUTHORIZED DISBURSEMENT:
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="voucher-grand-total">${totalPayable.toFixed(2)} USD</span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Signatures & Verification Seal */}
              <div className="voucher-footer">
                <div className="voucher-signature-box">
                  <div className="voucher-signature-line">
                    <span className="signature-font">Ibrahim Al-Mansoor</span>
                  </div>
                  <span className="signatory-name">Dr. Sheikh Ibrahim Al-Mansoor</span>
                  <span className="signatory-title">Academic Director, Our Quran Institute</span>
                </div>

                <div className="voucher-seal-box">
                  <div className="official-stamp-seal">
                    <Icon name="shield-check" size={24} color="#0D4A38" />
                    <span>AUDITED &amp; APPROVED</span>
                    <small>OUR QURAN INSTITUTE</small>
                  </div>
                </div>

                <div className="voucher-signature-box">
                  <div className="voucher-signature-line">
                    <span className="signature-font">Ahmad Al-Azhari</span>
                  </div>
                  <span className="signatory-name">{teacherUser?.name || 'Dr. Sheikh Ahmad Al-Azhari'}</span>
                  <span className="signatory-title">Faculty Scholar Signature</span>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
