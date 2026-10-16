'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from './Icons';

export default function TeacherSalaryDashboard({ teacherUser }) {
  const [salaryData, setSalaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('October 2026');

  useEffect(() => {
    fetchSalary();
  }, [teacherUser?.id, selectedMonth]);

  const fetchSalary = async () => {
    try {
      setLoading(true);
      const teacherId = teacherUser?.id || 'QI-FAC-014';
      const res = await fetch(`/api/finance?type=salary&teacherId=${encodeURIComponent(teacherId)}`);
      const data = await res.json();
      if (data.success) {
        setSalaryData(data.salary);
      }
    } catch (err) {
      console.error('Failed to load salary:', err);
    } finally {
      setLoading(false);
    }
  };

  // Realistic mock sessions breakdown for the active month
  const sessionsBreakdown = [
    {
      id: 'SES-01',
      date: '2026-10-16',
      time: '10:00 AM - 11:30 AM',
      studentName: 'Tariq Al-Mansoor',
      durationHours: 1.5,
      topic: 'Surah Yusuf (Ayahs 1-22) - Hifz & Tajweed Assessment',
      ratePerHour: salaryData?.hourlyRate || 30,
      amount: 45.0,
      status: 'Verified',
    },
    {
      id: 'SES-02',
      date: '2026-10-16',
      time: '11:45 AM - 01:15 PM',
      studentName: 'Maryam Al-Qasim',
      durationHours: 1.5,
      topic: 'Surah Al-Mumtahanah & Tajweed Evaluation',
      ratePerHour: salaryData?.hourlyRate || 30,
      amount: 45.0,
      status: 'Verified',
    },
    {
      id: 'SES-03',
      date: '2026-10-15',
      time: '10:00 AM - 11:30 AM',
      studentName: 'Tariq Al-Mansoor',
      durationHours: 1.5,
      topic: 'Surah Hud (Ayahs 80-115) - Makharij Precision',
      ratePerHour: salaryData?.hourlyRate || 30,
      amount: 45.0,
      status: 'Verified',
    },
    {
      id: 'SES-04',
      date: '2026-10-14',
      time: '10:00 AM - 11:30 AM',
      studentName: 'Tariq Al-Mansoor',
      durationHours: 1.5,
      topic: 'Para 11 Sabqi Revision & Stopping Signs (Waqf)',
      ratePerHour: salaryData?.hourlyRate || 30,
      amount: 45.0,
      status: 'Verified',
    },
    {
      id: 'SES-05',
      date: '2026-10-14',
      time: '11:45 AM - 01:15 PM',
      studentName: 'Maryam Al-Qasim',
      durationHours: 1.5,
      topic: 'Juz 27 Revision (Ar-Rahman to Al-Hadid)',
      ratePerHour: salaryData?.hourlyRate || 30,
      amount: 45.0,
      status: 'Verified',
    },
    {
      id: 'SES-06',
      date: '2026-10-13',
      time: '10:00 AM - 11:30 AM',
      studentName: 'Tariq Al-Mansoor',
      durationHours: 1.5,
      topic: 'Surah Yunus (Ayahs 60-109) - Madd Lazim Corrections',
      ratePerHour: salaryData?.hourlyRate || 30,
      amount: 45.0,
      status: 'Verified',
    },
  ];

  return (
    <div className="salary-dashboard-wrapper">
      {/* Top Banner */}
      <div className="salary-header-card">
        <div className="salary-header-content">
          <div className="salary-scholar-info">
            <span className="scholar-avatar">
              <Icon name="scholar" size={24} />
            </span>
            <div>
              <h2 className="salary-scholar-name">
                {teacherUser?.name || 'Dr. Sheikh Ahmad Al-Azhari'}
              </h2>
              <p className="salary-scholar-title">
                {teacherUser?.specialization || 'Tajweed & Quran Memorization'} • {teacherUser?.sanadCertification || 'Certified Teacher'}
              </p>
            </div>
          </div>

          <div className="salary-month-selector">
            <label htmlFor="salary-month-select" className="salary-month-label">
              Billing Cycle:
            </label>
            <select
              id="salary-month-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="salary-select-input"
            >
              <option value="October 2026">October 2026 (Current Cycle)</option>
              <option value="September 2026">September 2026 (Disbursed)</option>
              <option value="August 2026">August 2026 (Disbursed)</option>
            </select>
          </div>
        </div>

        {/* Payout Approval Banner */}
        <div className="salary-status-banner">
          <div className="status-banner-left">
            <span className="status-badge-icon">
              {salaryData?.status === 'Approved' || salaryData?.status === 'Disbursed' ? (
                <Icon name="shield-check" size={16} />
              ) : (
                <Icon name="clock" size={16} />
              )}
            </span>
            <div>
              <span className="status-banner-title">
                Payroll Status:
                <strong> {salaryData?.status || 'Approved & Verified'}</strong>
              </span>
              <span className="status-banner-sub">
                {salaryData?.status === 'Approved'
                  ? 'Approved by Dr. Ibrahim Al-Mansoor (Academic Director). Scheduled for direct deposit.'
                  : 'Currently accumulating teaching hours in real-time. Submitted for administrative review at month-end.'}
              </span>
            </div>
          </div>
          <div className="status-banner-right">
            <button
              type="button"
              className="btn-print-voucher"
              onClick={() => window.print()}
            >
              <Icon name="printer" size={14} style={{ marginRight: 6 }} />
              Print Faculty Voucher
            </button>
          </div>
        </div>
      </div>

      {/* KPI Financial Cards */}
      <div className="salary-metrics-grid">
        <div className="salary-metric-card">
          <div className="metric-icon-wrap" style={{ background: '#EBF5F0', color: '#0D4A38' }}>
            <Icon name="clock" size={22} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Total Teaching Hours</span>
            <span className="metric-value">{salaryData?.totalHoursTaught || '38.5'} hrs</span>
            <span className="metric-sub">Across 26 completed 1-on-1 sessions</span>
          </div>
        </div>

        <div className="salary-metric-card">
          <div className="metric-icon-wrap" style={{ background: '#FEF3C7', color: '#D97706' }}>
            <Icon name="dollar-sign" size={22} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Hourly Teaching Rate</span>
            <span className="metric-value">${salaryData?.hourlyRate || '30.00'}/hr</span>
            <span className="metric-sub">Senior Certified Teacher Rate</span>
          </div>
        </div>

        <div className="salary-metric-card">
          <div className="metric-icon-wrap" style={{ background: '#EEF2FF', color: '#4F46E5' }}>
            <Icon name="bar-chart" size={22} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Calculated Base Earnings</span>
            <span className="metric-value">
              ${salaryData?.calculatedSalary ? salaryData.calculatedSalary.toFixed(2) : '1,155.00'}
            </span>
            <span className="metric-sub">38.5 hrs × $30.00/hr accumulated</span>
          </div>
        </div>

        <div className="salary-metric-card highlight-card">
          <div className="metric-icon-wrap" style={{ background: '#0D4A38', color: '#FFDF85' }}>
            <Icon name="award" size={22} color="#FFDF85" />
          </div>
          <div className="metric-content">
            <span className="metric-label">Total Net Payable</span>
            <span className="metric-value highlight-value">
              ${salaryData?.totalPayable ? salaryData.totalPayable.toFixed(2) : '1,205.00'}
            </span>
            <span className="metric-sub" style={{ color: '#062A1F', fontWeight: 600 }}>
              Includes +$50.00 Mumtaz Retention Bonus
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
              Detailed breakdown of verified 1-on-1 recitation and Hifz sessions taught this billing period.
            </p>
          </div>
          <span className="ledger-count-pill">{sessionsBreakdown.length} Recent Logged Sessions</span>
        </div>

        <div className="salary-table-responsive">
          <table className="salary-table">
            <thead>
              <tr>
                <th>Date &amp; Time</th>
                <th>Student</th>
                <th>Session Curriculum / Surah</th>
                <th>Duration</th>
                <th>Hourly Rate</th>
                <th>Earnings</th>
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
                    <span className="session-duration-badge">{ses.durationHours} hrs</span>
                  </td>
                  <td>
                    <span className="rate-cell">${ses.ratePerHour}/hr</span>
                  </td>
                  <td>
                    <span className="amount-cell">${ses.amount.toFixed(2)}</span>
                  </td>
                  <td>
                    <span className="audit-badge-verified">
                      <Icon name="check-circle" size={12} style={{ marginRight: 4 }} />
                      {ses.status}
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
              <Icon name="info" size={14} /> Teaching hours are logged in real-time immediately upon class completion and attendance submission.
            </span>
          </div>
          <div className="footer-summary">
            <span>Period Total: <strong>${salaryData?.totalPayable || '1,205.00'}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
