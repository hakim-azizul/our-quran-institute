'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '../../components/Icons';
import PortalSidebar from '../../components/PortalSidebar';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAdminTab, setActiveAdminTab] = useState('courses'); // 'courses' | 'users'
  const [roleFilter, setRoleFilter] = useState('all');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // New Course Creation State (Admin-Only Provisioning)
  const [isNewCourseModalOpen, setIsNewCourseModalOpen] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseArabicTitle, setNewCourseArabicTitle] = useState('');
  const [newCourseLevel, setNewCourseLevel] = useState('Beginner to Intermediate');
  const [newCourseDuration, setNewCourseDuration] = useState('10 Weeks • 20 Lessons');
  const [newCourseTeacherId, setNewCourseTeacherId] = useState('QI-FAC-014');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);

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

  const handleApproveTeacher = async (userId) => {
    try {
      setFeedbackMsg('');
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'approve_teacher' }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedbackMsg(data.message);
        fetchAdminData();
      } else {
        alert(data.error || 'Failed to approve teacher.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectTeacher = async (userId) => {
    if (!window.confirm('Are you sure you want to reject this scholar application?')) return;
    try {
      setFeedbackMsg('');
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'reject_teacher' }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedbackMsg(data.message);
        fetchAdminData();
      } else {
        alert(data.error || 'Failed to reject teacher.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!newCourseTitle) return;
    setIsCreatingCourse(true);

    try {
      const teacherObj = usersList.find((u) => u.id === newCourseTeacherId);
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newCourseTitle,
          arabicTitle: newCourseArabicTitle,
          level: newCourseLevel,
          totalDuration: newCourseDuration,
          assignedTeacherId: newCourseTeacherId,
          teacherName: teacherObj ? teacherObj.name : 'Dr. Sheikh Ahmad Al-Azhari',
          description: newCourseDesc,
          modules: [
            {
              id: `mod-${Date.now()}-1`,
              moduleNumber: 1,
              title: 'Foundational Introduction & Orientation',
              arabicTitle: 'المُقَدِّمَةُ وَالتَّأْسِيسُ',
              description: 'Initial syllabus objectives, sacred intention (Niyyah), and course roadmap.',
              lessons: [
                {
                  id: `les-${Date.now()}-1`,
                  title: 'Lesson 1.1: Sacred Etiquette of Quran Recitation',
                  duration: '20 mins',
                  content: 'Adab with the Holy Quran and preparation of the heart.',
                  practiceText: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
                },
              ],
            },
          ],
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedbackMsg(`Successfully provisioned new course: "${data.course.title}"!`);
        setIsNewCourseModalOpen(false);
        setNewCourseTitle('');
        setNewCourseArabicTitle('');
        setNewCourseDesc('');
        fetchAdminData();
      } else {
        alert(data.error || 'Failed to create course.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreatingCourse(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="auth-page-wrapper" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: 'var(--color-green-primary)', fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: '700' }}>
          Verifying Database Admin Credentials...
        </p>
      </div>
    );
  }

  const filteredUsers = usersList.filter((u) => {
    if (roleFilter === 'all') return true;
    if (roleFilter === 'pending_teacher') {
      return (
        u.role === 'teacher' &&
        u.status !== 'Verified Scholar' &&
        u.status !== 'Active'
      );
    }
    return u.role === roleFilter;
  });

  const facultyTeachers = usersList.filter((u) => u.role === 'teacher');

  return (
    <div className="portal-layout-wrapper">
      {/* Sleek SaaS Sidebar */}
      <PortalSidebar
        user={adminUser}
        activeTab={activeAdminTab}
        onTabChange={(tabKey) => setActiveAdminTab(tabKey)}
        coursesCount={coursesList.length}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        onLogout={handleLogout}
        portalType="admin"
      />

      {/* Main Content Area */}
      <div className="portal-content-wrapper">
        {/* Top Header Bar */}
        <header className="portal-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => setIsMobileOpen(true)}
              className="portal-mobile-menu-btn"
              title="Open Navigation Menu"
            >
              ☰
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Admin Console</span>
              <span style={{ fontSize: '13px', color: 'var(--color-gold-deep)' }}>›</span>
              <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--color-green-deep)' }}>
                {activeAdminTab === 'courses' ? 'Course Provisioning & Curriculum' : 'Institute Database Records'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setIsNewCourseModalOpen(true)}
              className="btn-auth-submit"
              style={{ margin: 0, padding: '8px 16px', fontSize: '13px', width: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}
            >
              <span>➕ Provision Course</span>
            </button>
            <Link
              href="/dashboard"
              className="auth-nav-pill-btn"
              style={{ padding: '6px 14px' }}
            >
              <span>LMS Workspace →</span>
            </Link>
          </div>
        </header>

        {/* Admin Main Content */}
        <main style={{ padding: '24px 28px', flex: 1, overflowY: 'auto' }}>
          <div className="dashboard-wrapper">
          {/* Hero Banner */}
          <div className="dashboard-hero-card">
            <div className="dashboard-hero-user">
              <div className="dashboard-avatar" style={{ background: '#FEF3C7', borderColor: '#D4AF37' }}>
                👑
              </div>
              <div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="admin-security-pill">
                    🔒 Database-Provisioned Admin (Direct DB Only)
                  </span>
                  <span className="dashboard-user-badge">
                    Superuser Access
                  </span>
                </div>
                <h1 className="dashboard-user-name">
                  {adminUser?.name || 'Grand Mufti & Institute Administrator'}
                </h1>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  System ID: <strong style={{ color: 'var(--color-green-primary)' }}>{adminUser?.id || 'QI-ADM-001'}</strong> • Role: <strong style={{ color: '#C5A45A' }}>Admin Controller</strong>
                </p>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Curriculum Provisioning Tier
              </span>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#166534', background: '#DCFCE7', padding: '4px 12px', borderRadius: '8px' }}>
                ✓ Admin-Only Course Authoring
              </span>
            </div>
          </div>

          {feedbackMsg && (
            <div className="auth-alert-box auth-alert-success">
              <span>✅</span>
              <span>{feedbackMsg}</span>
            </div>
          )}

          {/* KPI Analytics Stats */}
          {stats && (
            <div className="dash-stat-row" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
              <div className="dash-stat-card">
                <div className="dash-stat-value">{coursesList.length}</div>
                <div className="dash-stat-label">Provisioned Courses</div>
              </div>
              <div className="dash-stat-card">
                <div className="dash-stat-value">{stats.totalStudents}</div>
                <div className="dash-stat-label">Enrolled Students</div>
              </div>
              <div className="dash-stat-card">
                <div className="dash-stat-value">{stats.totalTeachers}</div>
                <div className="dash-stat-label">Certified Scholars</div>
              </div>
              <div
                className="dash-stat-card"
                style={{
                  background: stats.pendingTeachers > 0 ? '#FEF3C7' : 'var(--bg-canvas-subtle)',
                  borderColor: stats.pendingTeachers > 0 ? '#F59E0B' : 'var(--border-light)',
                }}
              >
                <div
                  className="dash-stat-value"
                  style={{ color: stats.pendingTeachers > 0 ? '#B45309' : 'var(--color-green-primary)' }}
                >
                  {stats.pendingTeachers || 0}
                </div>
                <div className="dash-stat-label" style={{ color: stats.pendingTeachers > 0 ? '#92400E' : 'var(--text-muted)' }}>
                  ⏳ Pending Approvals
                </div>
              </div>
              <div className="dash-stat-card">
                <div className="dash-stat-value" style={{ color: '#C5A45A' }}>
                  {stats.totalActiveMistakeFlags || 0}
                </div>
                <div className="dash-stat-label">Active Recitation Slips</div>
              </div>
            </div>
          )}

          {/* TAB 1: Course Management (Admin-Only Provisioning) */}
          {activeAdminTab === 'courses' && (
            <div className="dash-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h3 className="dash-panel-title" style={{ margin: 0 }}>
                    <Icon name="book" size={20} color="#0D4A38" />
                    <span>Institute Academic Courses &amp; Modules</span>
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                    Courses can only be added and authorized from this Administrator portal.
                  </p>
                </div>

                <button
                  onClick={() => setIsNewCourseModalOpen(true)}
                  className="btn-auth-submit"
                  style={{ margin: 0, padding: '10px 18px', width: 'auto', display: 'flex', gap: '8px' }}
                >
                  <span>➕ Provision New Course</span>
                </button>
              </div>

              {/* Course Cards Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {coursesList.map((course) => (
                  <div
                    key={course.id}
                    style={{
                      background: 'var(--color-white)',
                      border: '1.5px solid var(--border-light)',
                      borderRadius: '16px',
                      padding: '24px',
                      boxShadow: 'var(--shadow-card)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '16px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--color-green-primary)', background: 'var(--color-green-light)', padding: '2px 8px', borderRadius: '4px' }}>
                          {course.id}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-gold-deep)' }}>
                          {course.level}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          • {course.totalDuration}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-green-deep)', margin: '0 0 4px 0' }}>
                        {course.title}
                      </h4>
                      <p style={{ fontFamily: 'var(--font-arabic)', fontSize: '18px', color: 'var(--color-gold-deep)', margin: '0 0 8px 0' }}>
                        {course.arabicTitle}
                      </p>

                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '680px', margin: 0 }}>
                        {course.description}
                      </p>

                      <div style={{ display: 'flex', gap: '12px', marginTop: '12px', fontSize: '12.5px' }}>
                        <span>
                          Lead Faculty: <strong style={{ color: 'var(--color-green-primary)' }}>{course.teacherName}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          Modules: <strong>{course.modules?.length || 0} Modules</strong>
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link
                        href="/dashboard"
                        className="btn-auth-submit"
                        style={{
                          margin: 0,
                          padding: '8px 16px',
                          fontSize: '12.5px',
                          textDecoration: 'none',
                          width: 'auto',
                        }}
                      >
                        Preview Curriculum →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Database User Records */}
          {activeAdminTab === 'users' && (
            <div className="dash-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                <h2 className="dash-panel-title" style={{ margin: 0 }}>
                  <Icon name="users" size={20} color="#0D4A38" />
                  <span>Institute Database Records</span>
                </h2>

                {/* Filter Tabs */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setRoleFilter('all')}
                    className="btn-table-action"
                    style={{
                      padding: '8px 16px',
                      fontSize: '13.5px',
                      fontWeight: '700',
                      background: roleFilter === 'all' ? 'var(--color-green-primary)' : 'var(--color-white)',
                      color: roleFilter === 'all' ? '#FFFFFF' : 'var(--text-body)',
                    }}
                  >
                    All ({usersList.length})
                  </button>
                  <button
                    onClick={() => setRoleFilter('student')}
                    className="btn-table-action"
                    style={{
                      padding: '8px 16px',
                      fontSize: '13.5px',
                      fontWeight: '700',
                      background: roleFilter === 'student' ? 'var(--color-green-primary)' : 'var(--color-white)',
                      color: roleFilter === 'student' ? '#FFFFFF' : 'var(--text-body)',
                    }}
                  >
                    Students ({usersList.filter((u) => u.role === 'student').length})
                  </button>
                  <button
                    onClick={() => setRoleFilter('teacher')}
                    className="btn-table-action"
                    style={{
                      padding: '8px 16px',
                      fontSize: '13.5px',
                      fontWeight: '700',
                      background: roleFilter === 'teacher' ? 'var(--color-green-primary)' : 'var(--color-white)',
                      color: roleFilter === 'teacher' ? '#FFFFFF' : 'var(--text-body)',
                    }}
                  >
                    Teachers ({usersList.filter((u) => u.role === 'teacher').length})
                  </button>
                  <button
                    onClick={() => setRoleFilter('pending_teacher')}
                    className="btn-table-action"
                    style={{
                      padding: '8px 16px',
                      fontSize: '13.5px',
                      background: roleFilter === 'pending_teacher' ? '#B45309' : '#FEF3C7',
                      color: roleFilter === 'pending_teacher' ? '#FFFFFF' : '#92400E',
                      borderColor: '#F59E0B',
                      fontWeight: '700',
                    }}
                  >
                    ⏳ Pending Approval (
                    {
                      usersList.filter(
                        (u) =>
                          u.role === 'teacher' &&
                          u.status !== 'Verified Scholar' &&
                          u.status !== 'Active'
                      ).length
                    }
                    )
                  </button>
                  <button
                    onClick={() => setRoleFilter('admin')}
                    className="btn-table-action"
                    style={{
                      padding: '8px 16px',
                      fontSize: '13.5px',
                      fontWeight: '700',
                      background: roleFilter === 'admin' ? 'var(--color-green-primary)' : 'var(--color-white)',
                      color: roleFilter === 'admin' ? '#FFFFFF' : 'var(--text-body)',
                    }}
                  >
                    Admins ({usersList.filter((u) => u.role === 'admin').length})
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Full Name &amp; Email</th>
                      <th>Role</th>
                      <th>Specialization / Target</th>
                      <th>Status</th>
                      <th>Security Origin</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id}>
                        <td style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: '14px', color: 'var(--color-green-primary)' }}>
                          {u.id}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '20px' }}>{u.avatar || '👤'}</span>
                            <div>
                              <strong style={{ display: 'block', fontSize: '15px', color: 'var(--text-main)' }}>{u.name}</strong>
                              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{u.email}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          {u.role === 'admin' && <span className="badge-role-admin">👑 Admin</span>}
                          {u.role === 'teacher' && <span className="badge-role-teacher">🕌 Scholar</span>}
                          {u.role === 'student' && <span className="badge-role-student">🎓 Student</span>}
                        </td>
                        <td style={{ fontSize: '13.5px', fontWeight: '500' }}>
                          {u.role === 'student' && (u.targetGoal || 'Hifz & Tajweed')}
                          {u.role === 'teacher' && (u.specialization || 'Tajweed & Qira’at')}
                          {u.role === 'admin' && (u.title || 'System Controller')}
                        </td>
                        <td>
                          {u.role === 'teacher' &&
                          u.status !== 'Verified Scholar' &&
                          u.status !== 'Active' ? (
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '4px 10px',
                                borderRadius: '999px',
                                fontSize: '12px',
                                fontWeight: '700',
                                background: '#FEF3C7',
                                color: '#92400E',
                                border: '1px solid #F59E0B',
                              }}
                            >
                              ⏳ Pending Admin Approval
                            </span>
                          ) : (
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '4px 10px',
                                borderRadius: '999px',
                                fontSize: '12px',
                                fontWeight: '700',
                                background: u.status === 'Suspended' ? '#FEF2F2' : '#DCFCE7',
                                color: u.status === 'Suspended' ? '#991B1B' : '#166534',
                              }}
                            >
                              ● {u.status || 'Active'}
                            </span>
                          )}
                        </td>
                        <td>
                          <span style={{ fontSize: '12.5px', color: u.role === 'admin' ? '#92400E' : 'var(--text-muted)' }}>
                            {u.role === 'admin' ? 'Direct Database File' : 'Registered / Seeded'}
                          </span>
                        </td>
                        <td>
                          {u.role === 'teacher' &&
                          u.status !== 'Verified Scholar' &&
                          u.status !== 'Active' ? (
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => handleApproveTeacher(u.id)}
                                style={{
                                  background: '#DCFCE7',
                                  border: '1.5px solid #166534',
                                  color: '#166534',
                                  padding: '6px 12px',
                                  borderRadius: '8px',
                                  fontSize: '12.5px',
                                  fontWeight: '700',
                                  cursor: 'pointer',
                                }}
                              >
                                ✓ Approve Scholar
                              </button>
                              <button
                                onClick={() => handleRejectTeacher(u.id)}
                                style={{
                                  background: '#FEF2F2',
                                  border: '1.5px solid #991B1B',
                                  color: '#991B1B',
                                  padding: '6px 10px',
                                  borderRadius: '8px',
                                  fontSize: '12.5px',
                                  fontWeight: '700',
                                  cursor: 'pointer',
                                }}
                                title="Reject Application"
                              >
                                ✕
                              </button>
                            </div>
                          ) : u.role !== 'admin' ? (
                            <button
                              onClick={() => handleToggleStatus(u.id)}
                              className="btn-table-action"
                            >
                              {u.status === 'Suspended' ? 'Re-activate' : 'Toggle Status'}
                            </button>
                          ) : (
                            <span style={{ fontSize: '12.5px', color: '#94A3B8' }}>Immutable</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODAL: Provision New Course (Admin Only) */}
      {isNewCourseModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(6, 42, 31, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
          onClick={() => setIsNewCourseModalOpen(false)}
        >
          <div
            style={{
              background: 'var(--color-white)',
              border: '2px solid var(--color-gold-primary)',
              borderRadius: '20px',
              maxWidth: '560px',
              width: '100%',
              padding: '28px',
              boxShadow: 'var(--shadow-elevated)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: '700', color: 'var(--color-green-primary)', marginBottom: '6px' }}>
              ➕ Provision New Quran Course
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '18px' }}>
              Create an official curriculum record and assign a certified Azhari scholar.
            </p>

            <form onSubmit={handleCreateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Course Title (English)</label>
                <input
                  type="text"
                  required
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  placeholder="e.g. Advanced Tajweed Rules & Waqf Mastery"
                  className="form-input form-input-noicon"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Arabic Title (العنوان بالعربية)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={newCourseArabicTitle}
                  onChange={(e) => setNewCourseArabicTitle(e.target.value)}
                  placeholder="مثال: دَوْرَةُ أَحْكَامِ التَّجْوِيدِ المُتَقَدِّمَةِ"
                  className="form-input form-input-noicon"
                />
              </div>

              <div className="form-row-two">
                <div className="form-group">
                  <label className="form-label">Level</label>
                  <select
                    value={newCourseLevel}
                    onChange={(e) => setNewCourseLevel(e.target.value)}
                    className="form-input form-select"
                  >
                    <option value="Beginner (Qaida & Letters)">Beginner (Qaida &amp; Letters)</option>
                    <option value="Beginner to Fluent">Beginner to Fluent</option>
                    <option value="Intermediate Tajweed">Intermediate Tajweed</option>
                    <option value="Advanced / Ijazah Track">Advanced / Ijazah Track</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Assigned Scholar / Faculty</label>
                  <select
                    value={newCourseTeacherId}
                    onChange={(e) => setNewCourseTeacherId(e.target.value)}
                    className="form-input form-select"
                  >
                    {facultyTeachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Estimated Duration</label>
                <input
                  type="text"
                  value={newCourseDuration}
                  onChange={(e) => setNewCourseDuration(e.target.value)}
                  placeholder="e.g. 12 Weeks • 24 Modules"
                  className="form-input form-input-noicon"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Course Description &amp; Objectives</label>
                <textarea
                  rows={3}
                  value={newCourseDesc}
                  onChange={(e) => setNewCourseDesc(e.target.value)}
                  placeholder="Detailed course scope, prerequisites, and learning outcomes..."
                  className="form-input form-input-noicon"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="submit"
                  disabled={isCreatingCourse}
                  className="btn-auth-submit"
                  style={{ margin: 0 }}
                >
                  {isCreatingCourse ? 'Provisioning Course...' : 'Authorize & Publish Course'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewCourseModalOpen(false)}
                  className="btn-table-action"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  </div>
  );
}
