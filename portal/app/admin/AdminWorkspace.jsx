'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '../../components/Icons';
import PortalSidebar from '../../components/PortalSidebar';
import AdminTeacherAssignModal from '../../components/AdminTeacherAssignModal';
import InvoicePrintModal from '../../components/InvoicePrintModal';
import AdminTeacherRateModal from '../../components/AdminTeacherRateModal';
import AdminTeacherClassesLedgerModal from '../../components/AdminTeacherClassesLedgerModal';
import AdminNewCourseModal from '../../components/AdminNewCourseModal';
import AdminCourseCurriculumModal from '../../components/AdminCourseCurriculumModal';
import AdminStatusFilterDropdown from '../../components/AdminStatusFilterDropdown';
import AdminAnalyticsCharts from '../../components/AdminAnalyticsCharts';
import AdminProvisionUserModal from '../../components/AdminProvisionUserModal';

const mapAdminSlug = (slug) => {
  if (!slug) return 'analytics';
  const s = slug.toLowerCase();
  if (s === 'analytics' || s === 'monitoring') return 'analytics';
  if (s === 'users' || s === 'roles' || s === 'faculty') return 'users';
  if (s === 'finances' || s === 'finance' || s === 'billing') return 'finances';
  if (s === 'courses' || s === 'curriculum') return 'courses';
  if (s === 'settings' || s === 'broadcast') return 'settings';
  return s;
};

export default function AdminWorkspace({ initialTab }) {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [financialAnalytics, setFinancialAnalytics] = useState(null);
  const [attendanceAnalytics, setAttendanceAnalytics] = useState(null);
  const [systemSettings, setSystemSettings] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Admin Tab: 'analytics' | 'users' | 'finances' | 'courses' | 'settings'
  const resolvedTab = mapAdminSlug(initialTab);
  const [activeAdminTab, setActiveAdminTab] = useState(resolvedTab);
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveAdminTab(mapAdminSlug(initialTab));
    }
  }, [initialTab]);

  const handleAdminTabChange = (tabKey) => {
    const targetUrl = `/admin/${tabKey}`;
    if (typeof window !== 'undefined' && window.location.pathname !== targetUrl) {
      window.history.pushState({ tab: tabKey }, '', targetUrl);
    }
    setActiveAdminTab(tabKey);
  };

  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        const tabSlug = path.replace('/admin/', '').replace('/admin', '');
        const mapped = mapAdminSlug(tabSlug) || 'analytics';
        setActiveAdminTab(mapped);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Modals state
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [selectedStudentForAssign, setSelectedStudentForAssign] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Teacher Rate Adjustment & Classes Ledger Modal State
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [selectedTeacherForRate, setSelectedTeacherForRate] = useState(null);
  const [isClassesModalOpen, setIsClassesModalOpen] = useState(false);
  const [selectedTeacherForClasses, setSelectedTeacherForClasses] = useState(null);

  // Curriculum Management Modals & Filters
  const [isNewCourseModalOpen, setIsNewCourseModalOpen] = useState(false);
  const [isCurriculumModalOpen, setIsCurriculumModalOpen] = useState(false);
  const [selectedCourseForCurriculum, setSelectedCourseForCurriculum] = useState(null);
  const [courseSearchQuery, setCourseSearchQuery] = useState('');
  const [courseCategoryFilter, setCourseCategoryFilter] = useState('all');
  const [expandedCourseModulesId, setExpandedCourseModulesId] = useState(null);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseArabicTitle, setNewCourseArabicTitle] = useState('');
  const [newCourseLevel, setNewCourseLevel] = useState('Beginner to Intermediate');
  const [newCourseDuration, setNewCourseDuration] = useState('10 Weeks • 20 Lessons');
  const [newCourseTeacherId, setNewCourseTeacherId] = useState('QI-FAC-014');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);

  // Broadcast Announcement State
  const [annTitle, setAnnTitle] = useState('');
  const [annArabicTitle, setAnnArabicTitle] = useState('');
  const [annMessage, setAnnMessage] = useState('');
  const [annAudience, setAnnAudience] = useState('all');
  const [annPriority, setAnnPriority] = useState('normal');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // System Settings State
  const [settingsForm, setSettingsForm] = useState({
    instituteName: '',
    academicYear: '',
    defaultLanguage: 'bn',
    timezone: '',
    contactEmail: '',
    contactPhone: '',
    tuitionFeeStandard: 65,
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const fetchAdminData = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();

      if (!res.ok) {
        router.push('/login');
        return;
      }

      setAdminUser(data.adminInfo);
      setStats(data.stats);
      setUsersList(data.users || []);
      setFinancialAnalytics(data.financialAnalytics);
      setAttendanceAnalytics(data.attendanceAnalytics);
      setSystemSettings(data.systemSettings);
      setAnnouncements(data.announcements || []);

      if (data.systemSettings) {
        setSettingsForm({
          instituteName: data.systemSettings.instituteName || '',
          academicYear: data.systemSettings.academicYear || '',
          defaultLanguage: data.systemSettings.defaultLanguage || 'bn',
          timezone: data.systemSettings.timezone || '',
          contactEmail: data.systemSettings.contactEmail || '',
          contactPhone: data.systemSettings.contactPhone || '',
          tuitionFeeStandard: data.systemSettings.tuitionFeeStandard || 65,
        });
      }

      // Also fetch courses
      const cRes = await fetch('/api/courses');
      const cData = await cRes.json();
      if (cData.success) {
        setCoursesList(cData.courses || []);
      }
    } catch (err) {
      console.error(err);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleApproveUser = async (userId) => {
    try {
      setFeedbackMsg('');
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'approve_user' }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedbackMsg(data.message);
        fetchAdminData();
      } else {
        alert(data.error || 'Failed to approve user.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectUser = async (userId) => {
    if (!window.confirm('Are you sure you want to reject this account application?')) return;
    try {
      setFeedbackMsg('');
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'reject_user' }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedbackMsg(data.message);
        fetchAdminData();
      } else {
        alert(data.error || 'Failed to reject user.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      setFeedbackMsg('');
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'toggle_status' }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedbackMsg(data.message);
        fetchAdminData();
      } else {
        alert(data.error || 'Failed to update status.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangeUserRole = async (userId, newRole) => {
    if (!confirm(`Are you sure you want to change this account's role to ${newRole === 'teacher' ? 'Faculty Scholar' : 'Student'}?`)) return;
    try {
      setFeedbackMsg('');
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newRole, action: 'change_role' }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedbackMsg(data.message);
        fetchAdminData();
      } else {
        alert(data.error || 'Failed to update user role.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveSalary = async (salaryId) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ salaryId, action: 'approve_salary' }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedbackMsg(data.message);
        fetchAdminData();
      } else {
        alert(data.error || 'Failed to approve salary.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDisburseSalary = async (salaryId) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ salaryId, action: 'disburse_salary' }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedbackMsg(data.message);
        fetchAdminData();
      } else {
        alert(data.error || 'Failed to disburse salary.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkInvoicePaid = async (invoiceId) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId, action: 'mark_invoice_paid' }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedbackMsg(data.message);
        fetchAdminData();
      } else {
        alert(data.error || 'Failed to update invoice.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBroadcastAnnouncement = async (e) => {
    e.preventDefault();
    if (!annTitle || !annMessage) {
      alert('Please enter both title and message.');
      return;
    }
    try {
      setIsBroadcasting(true);
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: annTitle,
          arabicTitle: annArabicTitle,
          message: annMessage,
          targetAudience: annAudience,
          priority: annPriority,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedbackMsg(data.message);
        setAnnTitle('');
        setAnnArabicTitle('');
        setAnnMessage('');
        fetchAdminData();
      } else {
        alert(data.error || 'Failed to dispatch broadcast.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleDeleteAnnouncement = async (annId) => {
    try {
      const res = await fetch(`/api/admin/users?id=${encodeURIComponent(annId)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setFeedbackMsg(data.message);
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      setIsSavingSettings(true);
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_settings', settings: settingsForm }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedbackMsg(data.message);
        fetchAdminData();
      } else {
        alert(data.error || 'Failed to update settings.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (err) {
      console.error(err);
      router.push('/login');
    }
  };

  // Filter users
  const filteredUsers = usersList.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (statusFilter !== 'all') {
      if (statusFilter === 'pending' && !u.status?.toLowerCase().includes('pending')) return false;
      if (statusFilter === 'active' && u.status !== 'Active' && u.status !== 'Verified Scholar' && u.status !== 'Enrolled') return false;
      if (statusFilter === 'suspended' && u.status !== 'Suspended') return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      return (
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.id?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const studentsList = usersList.filter((u) => u.role === 'student');
  const verifiedTeachersList = usersList.filter((u) => u.role === 'teacher');

  if (loading) {
    return (
      <div className="portal-loading-container">
        <div className="portal-spinner"></div>
        <p className="portal-loading-text">
          Authenticating Superuser Credentials &amp; Loading Institute Database...
        </p>
      </div>
    );
  }

  return (
    <div className="portal-layout-wrapper">
      <PortalSidebar
        user={adminUser || { name: 'Director Al-Mansoor', role: 'admin' }}
        activeTab={activeAdminTab}
        onTabChange={handleAdminTabChange}
        coursesCount={coursesList.length}
        pendingUsersCount={stats?.pendingUsersTotal || 0}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        onLogout={handleLogout}
        portalType="admin"
      />

      <div className="portal-content-wrapper">
        {/* Top Navbar */}
        <header className="portal-topbar">
          <div className="portal-topbar-left">
            <button
              type="button"
              className="portal-mobile-menu-trigger"
              onClick={() => setIsMobileOpen(true)}
              aria-label="Toggle Navigation Menu"
            >
              <Icon name="menu" size={20} />
            </button>
            <div className="portal-breadcrumbs">
              <span className="crumb-root">Institute Administration</span>
              <span className="crumb-sep">/</span>
              <span className="crumb-current">
                {activeAdminTab === 'analytics'
                  ? 'Central Monitoring & Analytics'
                  : activeAdminTab === 'users'
                  ? 'User & Role Management'
                  : activeAdminTab === 'finances'
                  ? 'Financial Oversight & Audit'
                  : activeAdminTab === 'courses'
                  ? 'Courses & Modules'
                  : 'System Settings & Global Announcements'}
              </span>
            </div>
          </div>

          <div className="portal-topbar-right">
            <span className="admin-status-pill">
              <Icon name="shield" size={14} style={{ marginRight: 6 }} /> Directorial Mode • Global Authority
            </span>
            <Link
              href="/dashboard"
              className="btn-switch-workspace"
              title="Inspect learning environment as scholar or learner"
            >
              <Icon name="student" size={14} style={{ marginRight: 6 }} /> Switch to LMS
            </Link>
          </div>
        </header>

        {/* Feedback Message */}
        {feedbackMsg && (
          <div className="admin-toast-banner">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Icon name="check-circle" size={15} /> {feedbackMsg}
            </span>
            <button type="button" onClick={() => setFeedbackMsg('')} aria-label="Close message">
              <Icon name="x" size={14} />
            </button>
          </div>
        )}

        {/* Tab Content */}
        <main className="portal-content-body">
          <div key={activeAdminTab} className="portal-tab-transition-container">
            {/* ==========================================================
              TAB 1: CENTRAL MONITORING & ANALYTICS
              ========================================================== */}
          {activeAdminTab === 'analytics' && (
            <div className="admin-analytics-view">
              <div className="view-intro-banner">
                <div>
                  <h1 className="view-title">Central Monitoring &amp; Institutional Analytics</h1>
                  <p className="view-subtitle">
                    Real-time platform statistics for active students, faculty scholars, parents, and institutional attendance rate.
                  </p>
                </div>
                <div className="banner-actions">
                  <button
                    type="button"
                    className="btn-primary-action"
                    onClick={() => handleAdminTabChange('users')}
                  >
                    <Icon name="users" size={15} style={{ marginRight: 6 }} /> Manage Users &amp; Roles
                  </button>
                  <button
                    type="button"
                    className="btn-secondary-action"
                    onClick={() => setIsAssignModalOpen(true)}
                  >
                    <Icon name="link" size={15} style={{ marginRight: 6 }} /> Pair Student with Scholar
                  </button>
                </div>
              </div>

              {/* High-Impact Analytics KPI Grid */}
              <div className="admin-metrics-grid">
                <div className="admin-stat-card">
                  <div className="stat-card-icon" style={{ background: '#EBF5F0', color: '#0D4A38' }}>
                    <Icon name="student" size={22} />
                  </div>
                  <div className="stat-card-details">
                    <span className="stat-card-label">Active Students</span>
                    <span className="stat-card-number">{stats?.totalStudents || 4}</span>
                    <span className="stat-card-sub">Enrolled in 1-on-1 Hifz programs</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-card-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>
                    <Icon name="scholar" size={22} />
                  </div>
                  <div className="stat-card-details">
                    <span className="stat-card-label">Verified Faculty Scholars</span>
                    <span className="stat-card-number">{stats?.totalTeachers || 2}</span>
                    <span className="stat-card-sub">
                      {stats?.pendingTeachers ? `${stats.pendingTeachers} application pending review` : 'All certified'}
                    </span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-card-icon" style={{ background: '#EEF2FF', color: '#4F46E5' }}>
                    <Icon name="parent" size={22} />
                  </div>
                  <div className="stat-card-details">
                    <span className="stat-card-label">Active Parents</span>
                    <span className="stat-card-number">{stats?.totalParents || 3}</span>
                    <span className="stat-card-sub">Tracking child daily progress</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-card-icon" style={{ background: '#FDF2F8', color: '#DB2777' }}>
                    <Icon name="book-open" size={22} />
                  </div>
                  <div className="stat-card-details">
                    <span className="stat-card-label">Total Memorized Juz</span>
                    <span className="stat-card-number">{stats?.totalMemorizedJuz || 46}</span>
                    <span className="stat-card-sub">Across all student rosters</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-card-icon" style={{ background: '#ECFDF5', color: '#059669' }}>
                    <Icon name="clock" size={22} />
                  </div>
                  <div className="stat-card-details">
                    <span className="stat-card-label">Overall Attendance Rate</span>
                    <span className="stat-card-number">{stats?.attendanceRate || 96}%</span>
                    <span className="stat-card-sub">Daily attendance consistency</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-card-icon" style={{ background: '#FFFBEB', color: '#B45309' }}>
                    <Icon name="wallet" size={22} />
                  </div>
                  <div className="stat-card-details">
                    <span className="stat-card-label">Monthly Collections ($)</span>
                    <span className="stat-card-number">${financialAnalytics?.totalRevenue || 140}</span>
                    <span className="stat-card-sub">${financialAnalytics?.pendingTuition || 55} pending collection</span>
                  </div>
                </div>
              </div>

              {/* Visual Data Analytics & Strategic Performance Charts */}
              <AdminAnalyticsCharts
                stats={stats}
                financialAnalytics={financialAnalytics}
                attendanceAnalytics={attendanceAnalytics}
                usersList={usersList}
              />

              {/* Attendance Analytics & Progress Report Overview */}
              <div className="analytics-double-row">
                {/* Attendance Analytics Card */}
                <div className="analytics-card">
                  <div className="card-header-row">
                    <div>
                      <h3 className="card-heading">Attendance Analytics</h3>
                      <p className="card-subheading">Institute-wide daily attendance rate and live logs</p>
                    </div>
                    <span className="rate-badge-pill">
                      {attendanceAnalytics?.rate || 96}% Overall Rate
                    </span>
                  </div>

                  <div className="attendance-breakdown-bar">
                    <div className="bar-segment present" style={{ width: '85%' }} title="Present (85%)"></div>
                    <div className="bar-segment late" style={{ width: '10%' }} title="Late (10%)"></div>
                    <div className="bar-segment absent" style={{ width: '5%' }} title="Absent (5%)"></div>
                  </div>

                  <div className="attendance-stats-legend">
                    <div className="legend-stat">
                      <span className="legend-color-box present"></span>
                      <span>Present: <strong>{attendanceAnalytics?.present || 5}</strong></span>
                    </div>
                    <div className="legend-stat">
                      <span className="legend-color-box late"></span>
                      <span>Late: <strong>{attendanceAnalytics?.late || 1}</strong></span>
                    </div>
                    <div className="legend-stat">
                      <span className="legend-color-box absent"></span>
                      <span>Absent: <strong>{attendanceAnalytics?.absent || 0}</strong></span>
                    </div>
                  </div>

                  <div className="recent-attendance-table">
                    <span className="table-caption">Recent Real-Time Attendance Submissions:</span>
                    {attendanceAnalytics?.recentRecords?.slice(0, 5).map((rec) => (
                      <div key={rec.id} className="rec-att-row">
                        <span className="rec-student">
                          <Icon name="student" size={14} style={{ marginRight: 4 }} /> {rec.studentName}
                        </span>
                        <span className="rec-teacher">with {rec.teacherName}</span>
                        <span className={`rec-status-tag status-${rec.status}`}>{rec.status}</span>
                        <span className="rec-time">{new Date(rec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress Report Overview */}
                <div className="analytics-card">
                  <div className="card-header-row">
                    <div>
                      <h3 className="card-heading">Hifz Progress &amp; Milestone Overview</h3>
                      <p className="card-subheading">Top student progression and active recitation status</p>
                    </div>
                    <span className="milestone-badge-pill">
                      {stats?.totalActiveMistakeFlags || 3} Active Flagged Verses
                    </span>
                  </div>

                  <div className="student-progress-bars-list">
                    {studentsList.map((stu) => {
                      const percent = Math.round(((stu.memorizedJuz || 0) / (stu.totalJuz || 30)) * 100);
                      return (
                        <div key={stu.id} className="stu-progress-item">
                          <div className="stu-prog-top">
                            <span className="stu-prog-name">{stu.name}</span>
                            <span className="stu-prog-mentor">Mentor: {stu.mentor || 'Assigned Scholar'}</span>
                            <span className="stu-prog-pct">{percent}% ({stu.memorizedJuz || 0}/30 Juz)</span>
                          </div>
                          <div className="stu-prog-track">
                            <div className="stu-prog-fill" style={{ width: `${percent}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="analytics-quick-actions">
                    <button
                      type="button"
                      className="btn-quick-pairing"
                      onClick={() => setIsAssignModalOpen(true)}
                    >
                      <Icon name="link" size={14} style={{ marginRight: 6 }} />
                      <span>Assign or Change Teacher Pairing</span>
                    </button>
                    <button
                      type="button"
                      className="btn-quick-invoices"
                      onClick={() => setIsInvoiceModalOpen(true)}
                    >
                      <Icon name="receipt" size={14} style={{ marginRight: 6 }} />
                      <span>View Financial Ledger &amp; Receipts</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================================
              TAB 2: USERS & ROLE MANAGEMENT
              ========================================================== */}
          {activeAdminTab === 'users' && (
            <div className="admin-users-view">
              <div className="view-intro-banner">
                <div>
                  <h1 className="view-title">User &amp; Role Management</h1>
                  <p className="view-subtitle">
                    Approve teacher, student, and guardian accounts, change roles, and assign faculty mentors.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn-primary-action"
                    style={{ background: '#0D4A38', borderColor: '#D4AF37' }}
                    onClick={() => setIsProvisionModalOpen(true)}
                  >
                    <Icon name="user-plus" size={14} style={{ marginRight: 6 }} />
                    <span>Provision User (Assign Role)</span>
                  </button>
                  <button
                    type="button"
                    className="btn-primary-action"
                    onClick={() => setIsAssignModalOpen(true)}
                  >
                    <Icon name="link" size={14} style={{ marginRight: 6 }} />
                    <span>Assign Faculty Mentor</span>
                  </button>
                </div>
              </div>

              {/* Filters Toolbar */}
              <div className="users-filter-toolbar">
                <div className="role-filter-pills">
                  <button
                    type="button"
                    className={`filter-pill ${roleFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setRoleFilter('all')}
                  >
                    All Accounts ({usersList.length})
                  </button>
                  <button
                    type="button"
                    className={`filter-pill ${roleFilter === 'teacher' ? 'active' : ''}`}
                    onClick={() => setRoleFilter('teacher')}
                  >
                    Teachers / Scholars ({usersList.filter((u) => u.role === 'teacher').length})
                    {stats?.pendingTeachers > 0 && (
                      <span className="filter-count-badge warning">{stats.pendingTeachers}</span>
                    )}
                  </button>
                  <button
                    type="button"
                    className={`filter-pill ${roleFilter === 'student' ? 'active' : ''}`}
                    onClick={() => setRoleFilter('student')}
                  >
                    Students ({usersList.filter((u) => u.role === 'student').length})
                  </button>
                  <button
                    type="button"
                    className={`filter-pill ${roleFilter === 'admin' ? 'active' : ''}`}
                    onClick={() => setRoleFilter('admin')}
                  >
                    Admins ({usersList.filter((u) => u.role === 'admin').length})
                  </button>
                </div>

                <div className="search-status-controls" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="admin-users-search-box" style={{ position: 'relative', minWidth: '240px' }}>
                    <span
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--color-green-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        pointerEvents: 'none',
                      }}
                    >
                      <Icon name="search" size={14} />
                    </span>
                    <input
                      type="text"
                      placeholder="Search by name, ID, or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="users-search-input"
                      style={{
                        padding: '8px 32px 8px 34px',
                        borderRadius: '10px',
                        border: '1.5px solid var(--border-light)',
                        fontSize: '13px',
                        width: '100%',
                        outline: 'none',
                        background: '#FFFFFF',
                        transition: 'all 0.2s ease',
                      }}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: '#F1F5F9',
                          border: 'none',
                          borderRadius: '50%',
                          width: '18px',
                          height: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#64748B',
                          cursor: 'pointer',
                        }}
                        title="Clear search query"
                      >
                        <Icon name="x" size={11} />
                      </button>
                    )}
                  </div>

                  <AdminStatusFilterDropdown
                    value={statusFilter}
                    onChange={(newStatus) => setStatusFilter(newStatus)}
                    usersList={usersList}
                  />
                </div>
              </div>

              {/* Users Table */}
              <div className="admin-table-card">
                <div className="table-responsive">
                  <table className="admin-users-table">
                    <thead>
                      <tr>
                        <th>User Profile</th>
                        <th>Role &amp; ID</th>
                        <th>Academic Allocation</th>
                        <th>Status</th>
                        <th>Registered Date</th>
                        <th style={{ textAlign: 'right' }}>Administrative Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => {
                        const isPending = user.status?.toLowerCase().includes('pending');
                        return (
                          <tr key={user.id} className={isPending ? 'pending-row' : ''}>
                            <td>
                              <div className="user-profile-cell">
                                <span className="user-table-avatar">
                                  <Icon
                                    name={
                                      user.role === 'teacher'
                                        ? 'scholar'
                                        : user.role === 'parent'
                                        ? 'parent'
                                        : user.role === 'admin'
                                        ? 'admin'
                                        : 'student'
                                    }
                                    size={16}
                                  />
                                </span>
                                <div>
                                  <span className="user-table-name">{user.name}</span>
                                  <span className="user-table-email">{user.email}</span>
                                </div>
                              </div>
                            </td>

                            <td>
                              <span className={`role-badge role-${user.role}`}>
                                {user.role.toUpperCase()}
                              </span>
                              <span className="user-id-code">{user.id}</span>
                            </td>

                            <td>
                              {user.role === 'student' ? (
                                <div className="allocation-info">
                                  <span>Mentor: <strong>{user.mentor || 'Unassigned'}</strong></span>
                                  <span className="sub">Hifz: Para {user.memorizedJuz || 0}/30</span>
                                </div>
                              ) : user.role === 'teacher' ? (
                                <div className="allocation-info">
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span>Rate: <strong>${user.ratePerClass || user.hourlyRate || 35}/class</strong></span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedTeacherForRate(user);
                                        setIsRateModalOpen(true);
                                      }}
                                      title="Set per-class rate & recalculate"
                                      style={{
                                        background: '#F0FDF4',
                                        border: '1px solid #BBF7D0',
                                        borderRadius: '5px',
                                        padding: '1px 5px',
                                        fontSize: '10.5px',
                                        fontWeight: '700',
                                        color: '#15803D',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '2px',
                                      }}
                                    >
                                      <Icon name="pencil" size={10} color="#15803D" />
                                      <span>Set</span>
                                    </button>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedTeacherForClasses(user);
                                        setIsClassesModalOpen(true);
                                      }}
                                      title="Inspect successful completed classes"
                                      style={{
                                        background: '#F8FAF9',
                                        border: '1px solid #CBD5E1',
                                        borderRadius: '6px',
                                        padding: '1px 6px',
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        color: '#0D4A38',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                      }}
                                    >
                                      <Icon name="check-circle" size={11} color="#10B981" />
                                      <span><strong>{user.totalClassesTaught || 34}</strong> Successful Classes</span>
                                    </button>
                                    <span className="sub">• {user.studentsCount || 0} Students</span>
                                  </div>
                                </div>
                              ) : user.role === 'parent' ? (
                                <div className="allocation-info">
                                  <span>Children: <strong>{user.childrenIds?.length || 1} Enrolled</strong></span>
                                  <span className="sub">{user.phone || '+880 1711-000000'}</span>
                                </div>
                              ) : (
                                <span className="sub">System Director</span>
                              )}
                            </td>

                            <td>
                              <span className={`status-badge-pill status-${user.status?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
                                {user.status}
                              </span>
                            </td>

                            <td>
                              <span className="date-cell">
                                {new Date(user.registeredAt || Date.now()).toLocaleDateString()}
                              </span>
                            </td>

                            <td style={{ textAlign: 'right' }}>
                              <div className="table-actions-cluster">
                                {isPending && (
                                  <button
                                    type="button"
                                    className="btn-action-approve"
                                    onClick={() => handleApproveUser(user.id)}
                                    title="Verify credentials and grant access"
                                  >
                                    <Icon name="check-circle" size={14} style={{ marginRight: 4 }} /> Approve
                                  </button>
                                )}

                                {user.role === 'student' && (
                                  <button
                                    type="button"
                                    className="btn-action-assign"
                                    onClick={() => {
                                      setSelectedStudentForAssign(user.id);
                                      setIsAssignModalOpen(true);
                                    }}
                                    title="Assign / Reassign Scholar"
                                  >
                                    <Icon name="link" size={14} style={{ marginRight: 4 }} /> Pair Scholar
                                  </button>
                                )}

                                {user.role === 'teacher' && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedTeacherForClasses(user);
                                        setIsClassesModalOpen(true);
                                      }}
                                      title="Inspect verified classes taken by this scholar"
                                      style={{
                                        padding: '5px 9px',
                                        borderRadius: '7px',
                                        fontSize: '11.5px',
                                        fontWeight: '600',
                                        border: '1px solid #10B981',
                                        background: '#ECFDF5',
                                        color: '#047857',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                      }}
                                    >
                                      <Icon name="book-open" size={12} color="#047857" />
                                      <span>Classes ({user.totalClassesTaught || 34})</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedTeacherForRate(user);
                                        setIsRateModalOpen(true);
                                      }}
                                      title="Set per-class price and recalculate cumulative salary"
                                      style={{
                                        padding: '5px 9px',
                                        borderRadius: '7px',
                                        fontSize: '11.5px',
                                        fontWeight: '600',
                                        border: '1px solid #0D4A38',
                                        background: '#F0FDF4',
                                        color: '#0D4A38',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                      }}
                                    >
                                      <Icon name="credit-card" size={12} color="#0D4A38" />
                                      <span>Set Rate</span>
                                    </button>
                                  </>
                                )}

                                {user.role !== 'admin' && (
                                  <>
                                    <button
                                      type="button"
                                      className="btn-action-assign"
                                      style={{
                                        fontSize: '11px',
                                        padding: '4px 8px',
                                        background: user.role === 'teacher' ? '#EFF6FF' : '#F0FDF4',
                                        color: user.role === 'teacher' ? '#1D4ED8' : '#166534',
                                        borderColor: user.role === 'teacher' ? '#93C5FD' : '#86EFAC',
                                      }}
                                      onClick={() => handleChangeUserRole(user.id, user.role === 'teacher' ? 'student' : 'teacher')}
                                      title={`Assign / change role to ${user.role === 'teacher' ? 'Student' : 'Scholar'}`}
                                    >
                                      <Icon name="refresh-cw" size={11} style={{ marginRight: 3 }} />
                                      <span>Make {user.role === 'teacher' ? 'Student' : 'Scholar'}</span>
                                    </button>

                                    <button
                                      type="button"
                                      className="btn-action-toggle"
                                      onClick={() => handleToggleStatus(user.id)}
                                      title={user.status === 'Suspended' ? 'Reactivate' : 'Suspend'}
                                    >
                                      {user.status === 'Suspended' ? 'Reactivate' : 'Suspend'}
                                    </button>

                                    {isPending && (
                                      <button
                                        type="button"
                                        className="btn-action-reject"
                                        onClick={() => handleRejectUser(user.id)}
                                        title="Reject application"
                                      >
                                        Reject
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================================
              TAB 3: FINANCIAL OVERSIGHT & AUDIT
              ========================================================== */}
          {activeAdminTab === 'finances' && (
            <div className="admin-finances-view">
              <div className="view-intro-banner">
                <div>
                  <h1 className="view-title">Financial Oversight &amp; Audit</h1>
                  <p className="view-subtitle">
                    Track institute transactions, tuition collections, and faculty salary billing and disbursement approvals.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-primary-action"
                  onClick={() => setIsInvoiceModalOpen(true)}
                >
                  <Icon name="receipt" size={15} style={{ marginRight: 6 }} /> Open Full Invoice Registry
                </button>
              </div>

              {/* Financial KPI Cards */}
              <div className="financial-kpi-grid">
                <div className="fin-kpi-card">
                  <span className="fin-kpi-icon" style={{ background: '#EBF5F0', color: '#0D4A38' }}>
                    <Icon name="dollar-sign" size={20} />
                  </span>
                  <div>
                    <span className="fin-kpi-label">Total Fee Collections</span>
                    <span className="fin-kpi-val">${financialAnalytics?.totalRevenue || 140}.00</span>
                    <span className="fin-kpi-sub">From student tuition invoices</span>
                  </div>
                </div>

                <div className="fin-kpi-card">
                  <span className="fin-kpi-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>
                    <Icon name="clock" size={20} />
                  </span>
                  <div>
                    <span className="fin-kpi-label">Pending Tuition Due</span>
                    <span className="fin-kpi-val">${financialAnalytics?.pendingTuition || 55}.00</span>
                    <span className="fin-kpi-sub">Across unpaid student accounts</span>
                  </div>
                </div>

                <div className="fin-kpi-card">
                  <span className="fin-kpi-icon" style={{ background: '#EEF2FF', color: '#4F46E5' }}>
                    <Icon name="scholar" size={20} />
                  </span>
                  <div>
                    <span className="fin-kpi-label">Teacher Payroll Obligations</span>
                    <span className="fin-kpi-val">${financialAnalytics?.totalPayroll || 1940}.00</span>
                    <span className="fin-kpi-sub">Calculated for completed monthly class sessions</span>
                  </div>
                </div>

                <div className="fin-kpi-card highlight">
                  <span className="fin-kpi-icon" style={{ background: '#0D4A38', color: '#FFDF85' }}>
                    <Icon name="shield-check" size={20} />
                  </span>
                  <div>
                    <span className="fin-kpi-label">Audited Invoices Count</span>
                    <span className="fin-kpi-val">{financialAnalytics?.totalInvoicesCount || 4} Invoices</span>
                    <span className="fin-kpi-sub">100% Verified against bKash / Cards</span>
                  </div>
                </div>
              </div>

              {/* Faculty Salary Approval Ledger */}
              <div className="admin-table-card" style={{ marginBottom: '24px' }}>
                <div className="table-card-top-row">
                  <div>
                    <h3 className="card-heading">Faculty Monthly Salary &amp; Billing Approval</h3>
                    <p className="card-subheading">Track completed classes, per-class compensation rates, and authorize disbursements.</p>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="admin-users-table">
                    <thead>
                      <tr>
                        <th>Faculty Scholar</th>
                        <th>Billing Cycle</th>
                        <th>Rate / Class</th>
                        <th>Classes Completed</th>
                        <th>Base Salary</th>
                        <th>Bonus</th>
                        <th>Total Payable</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Admin Approval</th>
                      </tr>
                    </thead>
                    <tbody>
                      {financialAnalytics?.salaries?.map((sal) => (
                        <tr key={sal.id}>
                          <td>
                            <strong>{sal.teacherName}</strong>
                            <span className="sub">{sal.teacherId}</span>
                          </td>
                          <td>{sal.month}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <strong style={{ color: '#0D4A38', fontSize: '13.5px' }}>
                                ${(sal.ratePerClass || sal.hourlyRate || 35).toFixed(2)}
                              </strong>
                              <span style={{ fontSize: '11px', color: '#64748B' }}>/class</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const teacherObj = usersList.find((u) => u.id === sal.teacherId) || {
                                    id: sal.teacherId,
                                    name: sal.teacherName,
                                    ratePerClass: sal.ratePerClass || 35,
                                    totalClassesTaught: sal.totalClassesTaught || sal.sessionsCount || 34,
                                    bonus: sal.bonus || 0,
                                  };
                                  setSelectedTeacherForRate(teacherObj);
                                  setIsRateModalOpen(true);
                                }}
                                title="Set per-class rate & recalculate cumulative payroll"
                                style={{
                                  background: '#F0FDF4',
                                  border: '1px solid #BBF7D0',
                                  borderRadius: '5px',
                                  padding: '1px 5px',
                                  fontSize: '10.5px',
                                  fontWeight: '700',
                                  color: '#15803D',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '2px',
                                }}
                              >
                                <Icon name="pencil" size={10} color="#15803D" />
                                <span>Set</span>
                              </button>
                            </div>
                          </td>
                          <td>
                            <button
                              type="button"
                              onClick={() => {
                                const teacherObj = usersList.find((u) => u.id === sal.teacherId) || {
                                  id: sal.teacherId,
                                  name: sal.teacherName,
                                  ratePerClass: sal.ratePerClass || 35,
                                  totalClassesTaught: sal.totalClassesTaught || sal.sessionsCount || 34,
                                };
                                setSelectedTeacherForClasses(teacherObj);
                                setIsClassesModalOpen(true);
                              }}
                              title="Inspect verified class sessions ledger"
                              style={{
                                background: '#F8FAF9',
                                border: '1px solid #CBD5E1',
                                borderRadius: '7px',
                                padding: '3px 7px',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              <Icon name="check-circle" size={12} color="#10B981" />
                              <strong style={{ color: '#0F172A', fontSize: '12px' }}>
                                {sal.totalClassesTaught || sal.sessionsCount || 0} classes
                              </strong>
                              <span style={{ fontSize: '10.5px', color: '#0D4A38', fontWeight: '700', textDecoration: 'underline' }}>
                                Inspect
                              </span>
                            </button>
                          </td>
                          <td>${sal.calculatedSalary.toFixed(2)}</td>
                          <td>+${sal.bonus.toFixed(2)}</td>
                          <td>
                            <span className="total-payable-val">${sal.totalPayable.toFixed(2)}</span>
                          </td>
                          <td>
                            <span className={`status-badge-pill status-${sal.status?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
                              {sal.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {sal.status === 'Pending Approval' ? (
                              <button
                                type="button"
                                className="btn-approve-salary-action"
                                onClick={() => handleApproveSalary(sal.id)}
                              >
                                <Icon name="check-circle" size={13} style={{ marginRight: 4 }} />
                                <span>Approve Payout</span>
                              </button>
                            ) : sal.status === 'Approved' ? (
                              <button
                                type="button"
                                className="btn-disburse-salary-action"
                                onClick={() => handleDisburseSalary(sal.id)}
                              >
                                <Icon name="credit-card" size={14} style={{ marginRight: 4 }} />
                                <span>Mark Disbursed</span>
                              </button>
                            ) : (
                              <span className="salary-cleared-tag">
                                <Icon name="check-circle" size={12} style={{ marginRight: 4 }} />
                                <span>Disbursed</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Student Tuition Fee Collections Ledger */}
              <div className="admin-table-card">
                <div className="table-card-top-row">
                  <div>
                    <h3 className="card-heading">Student Tuition Fee Collections Ledger</h3>
                    <p className="card-subheading">Comprehensive log of invoices, receipts, and payment status.</p>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="admin-users-table">
                    <thead>
                      <tr>
                        <th>Invoice ID</th>
                        <th>Student &amp; Guardian</th>
                        <th>Month</th>
                        <th>Amount (USD / BDT)</th>
                        <th>Payment Status</th>
                        <th>Transaction ID</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {financialAnalytics?.invoices?.map((inv) => (
                        <tr key={inv.id}>
                          <td>
                            <strong>{inv.id}</strong>
                            <span className="sub">Due: {inv.dueDate}</span>
                          </td>
                          <td>
                            <strong>{inv.studentName}</strong>
                            <span className="sub">Guardian: {inv.parentName}</span>
                          </td>
                          <td>{inv.month}</td>
                          <td>
                            <strong>${inv.amount.toFixed(2)}</strong>
                            <span className="sub">BDT {inv.amountBDT || Math.round(inv.amount * 115)}</span>
                          </td>
                          <td>
                            <span className={`status-badge-pill status-${inv.status?.toLowerCase()}`}>
                              {inv.status}
                            </span>
                          </td>
                          <td>
                            <span className="tx-code">{inv.transactionId || 'Unpaid'}</span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {inv.status !== 'Paid' ? (
                              <button
                                type="button"
                                className="btn-mark-paid-action"
                                onClick={() => handleMarkInvoicePaid(inv.id)}
                              >
                                <Icon name="check-circle" size={13} style={{ marginRight: 4 }} />
                                <span>Mark Paid</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="btn-view-receipt-action"
                                onClick={() => setIsInvoiceModalOpen(true)}
                              >
                                <Icon name="receipt" size={13} style={{ marginRight: 4 }} />
                                <span>Receipt</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================================
              TAB 4: COURSES & CURRICULUM
              ========================================================== */}
          {activeAdminTab === 'courses' && (() => {
            const totalModulesCount = coursesList.reduce((sum, c) => sum + (c.modules?.length || 0), 0);
            const totalLessonsCount = coursesList.reduce(
              (sum, c) => sum + (c.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0),
              0
            );

            const filteredCourses = coursesList.filter((c) => {
              const q = courseSearchQuery.toLowerCase().trim();
              const matchesSearch =
                !q ||
                c.title?.toLowerCase().includes(q) ||
                c.arabicTitle?.toLowerCase().includes(q) ||
                c.teacherName?.toLowerCase().includes(q) ||
                c.description?.toLowerCase().includes(q);
              const matchesCategory =
                courseCategoryFilter === 'all' ||
                (courseCategoryFilter === 'quran' &&
                  (c.category === 'quran' || c.category === 'tajweed' || c.id === 'QI-CRS-001')) ||
                (courseCategoryFilter === 'arabic' &&
                  (c.category === 'arabic' || c.id === 'QI-CRS-002'));
              return matchesSearch && matchesCategory;
            });

            return (
              <div className="admin-courses-view">
                {/* View Intro Banner */}
                <div className="view-intro-banner">
                  <div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        color: 'var(--color-gold-primary)',
                        display: 'block',
                        marginBottom: '3px',
                      }}
                    >
                      إِدَارَةُ المَنَاهِجِ الدِّرَاسِيَّةِ وَالمَسَارَاتِ التَّعْلِيمِيَّةِ
                    </span>
                    <h1 className="view-title">Curriculum &amp; Course Management</h1>
                    <p className="view-subtitle">
                      Author, structure, and supervise Quranic memorization, Tajweed, and Classical Arabic curricula.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-primary-action"
                    onClick={() => setIsNewCourseModalOpen(true)}
                  >
                    <Icon name="plus" size={15} style={{ marginRight: 6 }} />
                    <span>Author New Course</span>
                  </button>
                </div>

                {/* Top Metrics Cards */}
                <div className="courses-stats-grid">
                  <div className="courses-stat-card">
                    <div className="courses-stat-icon">
                      <Icon name="book-open" size={22} />
                    </div>
                    <div>
                      <div className="courses-stat-val">{coursesList.length} Tracks</div>
                      <div className="courses-stat-label">Academic Courses</div>
                    </div>
                  </div>

                  <div className="courses-stat-card">
                    <div className="courses-stat-icon">
                      <Icon name="file-text" size={22} />
                    </div>
                    <div>
                      <div className="courses-stat-val">{totalModulesCount} Modules</div>
                      <div className="courses-stat-label">Curriculum Modules</div>
                    </div>
                  </div>

                  <div className="courses-stat-card">
                    <div className="courses-stat-icon">
                      <Icon name="check-circle" size={22} color="#10B981" />
                    </div>
                    <div>
                      <div className="courses-stat-val">{totalLessonsCount} Lessons</div>
                      <div className="courses-stat-label">Instructional Units</div>
                    </div>
                  </div>

                  <div className="courses-stat-card">
                    <div className="courses-stat-icon">
                      <Icon name="users" size={22} />
                    </div>
                    <div>
                      <div className="courses-stat-val">{verifiedTeachersList.length} Mentors</div>
                      <div className="courses-stat-label">Assigned Scholars</div>
                    </div>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="courses-filter-bar">
                  <div className="courses-filter-search">
                    <span className="courses-search-icon">
                      <Icon name="search" size={15} />
                    </span>
                    <input
                      type="text"
                      placeholder="Search courses by title, Arabic name, or scholar..."
                      value={courseSearchQuery}
                      onChange={(e) => setCourseSearchQuery(e.target.value)}
                      className="courses-search-input"
                    />
                    {courseSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setCourseSearchQuery('')}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: '#94A3B8',
                          cursor: 'pointer',
                        }}
                      >
                        <Icon name="x" size={13} />
                      </button>
                    )}
                  </div>

                  <div className="courses-filter-pills">
                    {[
                      { id: 'all', label: 'All Courses' },
                      { id: 'quran', label: 'Holy Quran & Tajweed' },
                      { id: 'arabic', label: 'Classical Arabic' },
                    ].map((f) => {
                      const active = courseCategoryFilter === f.id;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setCourseCategoryFilter(f.id)}
                          className={`courses-filter-pill-btn ${active ? 'active' : ''}`}
                        >
                          {f.label}
                        </button>
                      );
                    })}
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: 'var(--color-green-deep)',
                        background: 'var(--color-green-light)',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        border: '1px solid var(--color-green-mint)',
                        marginLeft: '4px',
                      }}
                    >
                      {filteredCourses.length} {filteredCourses.length === 1 ? 'Course' : 'Courses'}
                    </span>
                  </div>
                </div>

                {/* Courses Cards Grid */}
                {filteredCourses.length === 0 ? (
                  <div
                    style={{
                      padding: '60px 20px',
                      textAlign: 'center',
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1px solid var(--border-light)',
                    }}
                  >
                    <Icon name="inbox" size={36} color="#94A3B8" />
                    <h3 style={{ margin: '10px 0 4px 0', fontSize: '16px', color: '#1E293B' }}>
                      No Courses Found
                    </h3>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
                      No academic courses matched your search query. Try clearing the filter.
                    </p>
                  </div>
                ) : (
                  <div className="courses-cards-grid">
                    {filteredCourses.map((course) => {
                      const isQuran =
                        course.category === 'quran' ||
                        course.category === 'tajweed' ||
                        course.id === 'QI-CRS-001';
                      const isModulesExpanded = expandedCourseModulesId === course.id;
                      const courseLessonsCount =
                        course.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0;

                      return (
                        <div key={course.id} className="admin-course-card">
                          {/* Banner */}
                          <div className="course-card-banner">
                            <img
                              src="/assets/hero_stand_book.png"
                              alt="Course Stand"
                              className="course-card-banner-bg"
                            />
                            <div className="course-card-top">
                              <span className="course-category-badge">
                                <Icon name="book-open" size={11} style={{ marginRight: 4 }} />
                                {isQuran ? 'Holy Quran & Tajweed' : 'Classical Arabic'}
                              </span>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <span className="course-level-badge">{course.level}</span>
                                <span className="course-status-badge">
                                  <span
                                    style={{
                                      width: 6,
                                      height: 6,
                                      borderRadius: '50%',
                                      backgroundColor: '#10B981',
                                      display: 'inline-block',
                                    }}
                                  />
                                  <span>{course.status || 'Published'}</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Body */}
                          <div className="course-card-body">
                            <h3 className="course-title">{course.title}</h3>
                            {course.arabicTitle && (
                              <span dir="rtl" className="course-arabic-title">
                                {course.arabicTitle}
                              </span>
                            )}
                            <p className="course-desc">{course.description}</p>

                            {/* Specs Grid */}
                            <div className="course-specs-grid">
                              <div className="course-spec-item">
                                <div className="course-spec-icon">
                                  <Icon name="users" size={15} />
                                </div>
                                <div className="course-spec-text">
                                  <span className="course-spec-label">Faculty Scholar</span>
                                  <span className="course-spec-val">{course.teacherName}</span>
                                </div>
                              </div>

                              <div className="course-spec-item">
                                <div className="course-spec-icon">
                                  <Icon name="clock" size={15} />
                                </div>
                                <div className="course-spec-text">
                                  <span className="course-spec-label">Scope &amp; Duration</span>
                                  <span className="course-spec-val">
                                    {course.totalDuration || '10 Weeks'}
                                  </span>
                                </div>
                              </div>

                              <div className="course-spec-item">
                                <div className="course-spec-icon">
                                  <Icon name="file-text" size={15} />
                                </div>
                                <div className="course-spec-text">
                                  <span className="course-spec-label">Curriculum Units</span>
                                  <span className="course-spec-val">
                                    {course.modules?.length || 0} Modules • {courseLessonsCount} Lessons
                                  </span>
                                </div>
                              </div>

                              <div className="course-spec-item">
                                <div className="course-spec-icon">
                                  <Icon name="award" size={15} />
                                </div>
                                <div className="course-spec-text">
                                  <span className="course-spec-label">Passing Threshold</span>
                                  <span className="course-spec-val">
                                    {course.passingGrade || 80}% Standard
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Modules Accordion */}
                            {course.modules && course.modules.length > 0 && (
                              <div className="course-modules-accordion">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedCourseModulesId(isModulesExpanded ? null : course.id)
                                  }
                                  className="course-modules-toggle-btn"
                                >
                                  <span>
                                    Inspect Curriculum Modules ({course.modules.length})
                                  </span>
                                  <Icon
                                    name={isModulesExpanded ? 'chevron-up' : 'chevron-down'}
                                    size={15}
                                  />
                                </button>

                                {isModulesExpanded && (
                                  <div className="course-modules-preview-list">
                                    {course.modules.map((m, idx) => (
                                      <div key={m.id || idx} className="course-module-preview-item">
                                        <div
                                          style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            overflow: 'hidden',
                                          }}
                                        >
                                          <span className="course-module-num">M{m.moduleNumber || idx + 1}:</span>
                                          <span
                                            style={{
                                              whiteSpace: 'nowrap',
                                              overflow: 'hidden',
                                              textOverflow: 'ellipsis',
                                              fontWeight: '600',
                                            }}
                                          >
                                            {m.title}
                                          </span>
                                        </div>
                                        <span
                                          style={{
                                            fontSize: '11px',
                                            color: '#64748B',
                                            whiteSpace: 'nowrap',
                                          }}
                                        >
                                          {m.lessons?.length || 0} lessons
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Actions Bar */}
                            <div className="course-actions-bar">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCourseForCurriculum(course);
                                  setIsCurriculumModalOpen(true);
                                }}
                                className="btn-course-action-inspect"
                              >
                                <Icon name="book-open" size={14} />
                                <span>Inspect Full Syllabus</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedStudentForAssign(null);
                                  setIsAssignModalOpen(true);
                                }}
                                title="Assign or reassign faculty scholar"
                                style={{
                                  padding: '9px 12px',
                                  borderRadius: '10px',
                                  border: '1px solid #CBD5E1',
                                  background: '#FFFFFF',
                                  color: '#334155',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                <Icon name="link" size={13} />
                                <span>Scholar</span>
                              </button>

                              <Link
                                href={`/dashboard`}
                                className="btn-course-action-lms"
                                title="Preview course in student LMS"
                              >
                                <span>LMS Preview</span>
                                <Icon name="arrow-right" size={13} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}

          {/* ==========================================================
              TAB 5: SYSTEM SETTINGS & GLOBAL NOTIFICATIONS
              ========================================================== */}
          {activeAdminTab === 'settings' && (
            <div className="admin-settings-view">
              <div className="view-intro-banner">
                <div>
                  <h1 className="view-title">Platform Global Settings &amp; Notifications</h1>
                  <p className="view-subtitle">
                    Manage platform global configuration, default language, and announcements.
                  </p>
                </div>
              </div>

              <div className="settings-double-grid">
                {/* Global Settings Form */}
                <form onSubmit={handleSaveSettings} className="settings-card">
                  <div className="settings-card-header">
                    <span className="settings-icon">
                      <Icon name="settings" size={20} />
                    </span>
                    <div>
                      <h3 className="card-heading">Platform Global Configuration</h3>
                      <p className="card-subheading">Update institute metadata, session year, and default language.</p>
                    </div>
                  </div>

                  <div className="settings-form-body">
                    <div className="form-group-item">
                      <label>Institute Name</label>
                      <input
                        type="text"
                        value={settingsForm.instituteName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, instituteName: e.target.value })}
                        className="entry-input"
                        required
                      />
                    </div>

                    <div className="form-group-item">
                      <label>Academic Year / Session</label>
                      <input
                        type="text"
                        value={settingsForm.academicYear}
                        onChange={(e) => setSettingsForm({ ...settingsForm, academicYear: e.target.value })}
                        className="entry-input"
                        required
                      />
                    </div>

                    <div className="form-group-item">
                      <label>Default Interface Language</label>
                      <select
                        value={settingsForm.defaultLanguage}
                        onChange={(e) => setSettingsForm({ ...settingsForm, defaultLanguage: e.target.value })}
                        className="entry-select"
                      >
                        <option value="en">English (Default)</option>
                        <option value="ar">العربية (Arabic Classical)</option>
                      </select>
                    </div>

                    <div className="form-group-item">
                      <label>Institute Standard Monthly Tuition ($)</label>
                      <input
                        type="number"
                        value={settingsForm.tuitionFeeStandard}
                        onChange={(e) => setSettingsForm({ ...settingsForm, tuitionFeeStandard: Number(e.target.value) })}
                        className="entry-input"
                        required
                      />
                    </div>

                    <div className="form-group-item">
                      <label>Contact Phone</label>
                      <input
                        type="text"
                        value={settingsForm.contactPhone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                        className="entry-input"
                      />
                    </div>

                    <div className="form-group-item">
                      <label>Academic Support Email</label>
                      <input
                        type="email"
                        value={settingsForm.contactEmail}
                        onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                        className="entry-input"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSavingSettings}
                      className="btn-save-settings"
                    >
                      <Icon name="save" size={15} style={{ marginRight: 6 }} />
                      {isSavingSettings ? 'Saving Global Settings...' : 'Save Global Settings'}
                    </button>
                  </div>
                </form>

                {/* Broadcast Announcement Dispatcher */}
                <div className="settings-card">
                  <div className="settings-card-header">
                    <span className="settings-icon">
                      <Icon name="megaphone" size={20} />
                    </span>
                    <div>
                      <h3 className="card-heading">Broadcast Global Notification</h3>
                      <p className="card-subheading">Dispatch alerts to all Teachers, Students, and Parents.</p>
                    </div>
                  </div>

                  <form onSubmit={handleBroadcastAnnouncement} className="settings-form-body">
                    <div className="form-group-item">
                      <label>Announcement Subject</label>
                      <input
                        type="text"
                        value={annTitle}
                        onChange={(e) => setAnnTitle(e.target.value)}
                        className="entry-input"
                        placeholder="e.g. Quarterly Exam &amp; Parent-Teacher Conference"
                        required
                      />
                    </div>

                    <div className="form-group-item">
                      <label>Target Audience</label>
                      <select
                        value={annAudience}
                        onChange={(e) => setAnnAudience(e.target.value)}
                        className="entry-select"
                      >
                        <option value="all">Everyone (Teachers, Students &amp; Parents)</option>
                        <option value="teachers">Scholars &amp; Teachers Only</option>
                        <option value="parents">Parents / Guardians Only</option>
                        <option value="students">Students Only</option>
                      </select>
                    </div>

                    <div className="form-group-item">
                      <label>Priority Level</label>
                      <select
                        value={annPriority}
                        onChange={(e) => setAnnPriority(e.target.value)}
                        className="entry-select"
                      >
                        <option value="normal">Normal Information</option>
                        <option value="urgent">Urgent / High Priority</option>
                      </select>
                    </div>

                    <div className="form-group-item">
                      <label>Message Content</label>
                      <textarea
                        rows={3}
                        value={annMessage}
                        onChange={(e) => setAnnMessage(e.target.value)}
                        className="entry-textarea"
                        placeholder="Write announcement body..."
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isBroadcasting}
                      className="btn-dispatch-announcement"
                    >
                      <Icon name="megaphone" size={15} style={{ marginRight: 6 }} />
                      {isBroadcasting ? 'Dispatching...' : 'Broadcast Announcement'}
                    </button>
                  </form>

                  {/* Active Announcements List */}
                  <div className="announcements-archive-list">
                    <span className="archive-caption">Active Broadcast Notices:</span>
                    {announcements.map((ann) => (
                      <div key={ann.id} className="ann-item-row">
                        <div className="ann-item-text">
                          <div className="ann-item-header">
                            <span className="ann-title">{ann.title}</span>
                            <span className={`ann-priority-pill ${ann.priority}`}>{ann.priority}</span>
                          </div>
                          <p className="ann-msg">{ann.message}</p>
                          <span className="ann-meta">Target: {ann.targetAudience} • {ann.date}</span>
                        </div>
                        <button
                          type="button"
                          className="btn-delete-ann"
                          onClick={() => handleDeleteAnnouncement(ann.id)}
                          title="Remove broadcast"
                        >
                          <Icon name="trash" size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>
        </main>
      </div>

      {/* Teacher-Student Pairing Modal */}
      <AdminTeacherAssignModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        students={studentsList}
        teachers={verifiedTeachersList}
        initialStudentId={selectedStudentForAssign}
        onAssignmentComplete={fetchAdminData}
      />

      {/* Admin User Provisioning with Assigned Role Modal */}
      <AdminProvisionUserModal
        isOpen={isProvisionModalOpen}
        onClose={() => setIsProvisionModalOpen(false)}
        onUserProvisioned={fetchAdminData}
        teachers={verifiedTeachersList}
      />

      {/* Tuition Invoice & Receipt Modal */}
      <InvoicePrintModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        currentUser={adminUser}
      />

      {/* Teacher Per-Class Honorarium Rate & Cumulative Calculator Modal */}
      <AdminTeacherRateModal
        isOpen={isRateModalOpen}
        onClose={() => {
          setIsRateModalOpen(false);
          setSelectedTeacherForRate(null);
        }}
        teacher={selectedTeacherForRate}
        month="October 2026"
        onRateUpdated={() => {
          fetchAdminData();
        }}
      />

      {/* Teacher Successful Classes Audit Ledger Modal */}
      <AdminTeacherClassesLedgerModal
        isOpen={isClassesModalOpen}
        onClose={() => {
          setIsClassesModalOpen(false);
          setSelectedTeacherForClasses(null);
        }}
        teacher={selectedTeacherForClasses}
        month="October 2026"
        onOpenRateModal={(t) => {
          setSelectedTeacherForRate(t);
          setIsRateModalOpen(true);
        }}
      />

      {/* Author New Course Modal */}
      <AdminNewCourseModal
        isOpen={isNewCourseModalOpen}
        onClose={() => setIsNewCourseModalOpen(false)}
        teachers={verifiedTeachersList}
        onCourseCreated={(newCourse) => {
          fetchAdminData();
          setFeedbackMsg(`Academic course "${newCourse.title}" successfully created and published!`);
        }}
      />

      {/* Course Full Curriculum & Syllabus Inspector Modal */}
      <AdminCourseCurriculumModal
        isOpen={isCurriculumModalOpen}
        onClose={() => {
          setIsCurriculumModalOpen(false);
          setSelectedCourseForCurriculum(null);
        }}
        course={selectedCourseForCurriculum}
        onOpenAssignTeacher={() => {
          setIsCurriculumModalOpen(false);
          setIsAssignModalOpen(true);
        }}
      />
    </div>
  );
}
