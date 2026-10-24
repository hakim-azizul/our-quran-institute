'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Icon } from './Icons';

export default function PortalSidebar({
  user,
  activeTab,
  onTabChange,
  enrollment,
  course,
  coursesCount = 1,
  pendingUsersCount = 0,
  isMobileOpen = false,
  onCloseMobile,
  onLogout,
  portalType = 'dashboard', // 'dashboard' | 'admin'
}) {
  const router = useRouter();
  const pathname = usePathname();

  const isStudent = user?.role === 'student';
  const isTeacher = user?.role === 'teacher';
  const isParent = user?.role === 'parent';
  const isAdmin = user?.role === 'admin';
  const isTeacherPending =
    isTeacher && user?.status !== 'Verified Scholar' && user?.status !== 'Active';
  const isEnrolled = isStudent ? !!enrollment : true;

  const isQuranTrack = (() => {
    const target = course || enrollment;
    if (!target) return true;
    const cat = (target.category || target.courseCategory || '').toLowerCase();
    if (cat === 'quran' || cat === 'tajweed' || cat === 'hifz') return true;
    if (cat === 'arabic' || cat === 'islamic_studies') return false;
    const title = (target.title || target.courseTitle || '').toLowerCase();
    if (title.includes('arabic') && !title.includes('quran')) return false;
    return (
      title.includes('quran') ||
      title.includes('tajweed') ||
      title.includes('hifz') ||
      title.includes('mushaf') ||
      target.id === 'QI-CRS-001' ||
      target.courseId === 'QI-CRS-001'
    );
  })();

  const slugMap = {
    progress: '/dashboard/progress',
    digitalquran: '/dashboard/digital-quran',
    curriculum: '/dashboard/curriculum',
    quran: '/dashboard/quran',
    quiz: '/dashboard/quiz',
    achievements: '/dashboard/achievements',
    invoices: '/dashboard/invoices',
    dictionary: '/dashboard/dictionary',
    catalog: '/dashboard/catalog',
    profile: '/dashboard/profile',
    teacherdashboard: '/dashboard/teacher',
    actionboard: '/dashboard/action-board',
    salary: '/dashboard/salary',
    overview: '/dashboard/students',
    // Admin tabs
    analytics: '/admin/analytics',
    users: '/admin/users',
    finances: '/admin/finances',
    courses: '/admin/courses',
    settings: '/admin/settings',
  };

  const currentTab = (() => {
    if (activeTab) return activeTab;
    for (const [k, url] of Object.entries(slugMap)) {
      if (pathname === url || pathname?.startsWith(url)) return k;
    }
    return portalType === 'admin' ? 'analytics' : isTeacher ? 'teacherdashboard' : 'progress';
  })();

  const handleItemClick = (tabKey) => {
    if (onTabChange) {
      onTabChange(tabKey);
    } else {
      const targetUrl = slugMap[tabKey];
      if (targetUrl) {
        router.push(targetUrl);
      }
    }
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <div
        className={`portal-backdrop ${isMobileOpen ? 'mobile-open' : ''}`}
        onClick={onCloseMobile}
      />

      <aside className={`portal-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="portal-sidebar-brand">
          <img
            src="/assets/logo_gold.png"
            alt="Our Quran Institute"
            className="portal-sidebar-logo"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="portal-brand-text">
            <span className="portal-brand-name">Our Quran Institute</span>
            <span className="portal-brand-tag">
              {portalType === 'admin'
                ? 'Admin'
                : isTeacher
                ? 'Teacher Portal'
                : 'Student & Family Portal'}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="portal-sidebar-nav">
          {/* ================= ADMIN CONSOLE SIDEBAR ================= */}
          {portalType === 'admin' ? (
            <>
              <div className="portal-nav-section-title">ADMIN</div>

              <button
                type="button"
                onClick={() => handleItemClick('analytics')}
                className={`portal-nav-item ${currentTab === 'analytics' ? 'active' : ''}`}
              >
                <div className="portal-nav-item-content">
                  <span className="nav-icon"><Icon name="analytics" size={17} /></span>
                  <span>Analytics</span>
                </div>
                <span className="portal-nav-badge">Live</span>
              </button>

              <button
                type="button"
                onClick={() => handleItemClick('users')}
                className={`portal-nav-item ${currentTab === 'users' ? 'active' : ''}`}
              >
                <div className="portal-nav-item-content">
                  <span className="nav-icon"><Icon name="users" size={17} /></span>
                  <span>Users</span>
                </div>
                {pendingUsersCount > 0 && (
                  <span className="portal-nav-badge" style={{ background: '#F59E0B', color: '#FFF' }}>
                    {pendingUsersCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleItemClick('finances')}
                className={`portal-nav-item ${currentTab === 'finances' ? 'active' : ''}`}
              >
                <div className="portal-nav-item-content">
                  <span className="nav-icon"><Icon name="wallet" size={17} /></span>
                  <span>Finances</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleItemClick('courses')}
                className={`portal-nav-item ${currentTab === 'courses' ? 'active' : ''}`}
              >
                <div className="portal-nav-item-content">
                  <span className="nav-icon"><Icon name="book" size={17} /></span>
                  <span>Courses</span>
                </div>
                <span className="portal-nav-badge">{coursesCount}</span>
              </button>

              <button
                type="button"
                onClick={() => handleItemClick('settings')}
                className={`portal-nav-item ${currentTab === 'settings' ? 'active' : ''}`}
              >
                <div className="portal-nav-item-content">
                  <span className="nav-icon"><Icon name="settings" size={17} /></span>
                  <span>Settings</span>
                </div>
              </button>

              <div className="portal-nav-section-title">NAVIGATION</div>

              <Link
                href="/dashboard"
                className="portal-nav-item"
                style={{ color: 'var(--color-green-primary)', fontWeight: '700' }}
              >
                <div className="portal-nav-item-content">
                  <span className="nav-icon"><Icon name="student" size={17} color="var(--color-green-primary)" /></span>
                  <span>Student Portal</span>
                </div>
                <Icon name="arrow-right" size={13} color="var(--color-green-primary)" />
              </Link>
            </>
          ) : isTeacher ? (
            /* ================= TEACHER DASHBOARD SIDEBAR ================= */
            <>
              {isTeacherPending ? (
                <>
                  <div className="portal-nav-section-title" style={{ color: '#D97706' }}>
                    STATUS
                  </div>
                  <div className="portal-nav-item active" style={{ background: '#FEF3C7', color: '#92400E' }}>
                    <div className="portal-nav-item-content">
                      <span className="nav-icon"><Icon name="clock" size={17} color="#92400E" /></span>
                      <span style={{ fontWeight: 700 }}>Pending Approval</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="portal-nav-section-title">TEACHING</div>

                  <button
                    type="button"
                    onClick={() => handleItemClick('teacherdashboard')}
                    className={`portal-nav-item ${currentTab === 'teacherdashboard' ? 'active' : ''}`}
                  >
                    <div className="portal-nav-item-content">
                      <span className="nav-icon"><Icon name="dashboard" size={17} /></span>
                      <span>Dashboard</span>
                    </div>
                    <span className="portal-nav-badge" style={{ background: '#0D4A38', color: '#FFDF85' }}>
                      Overview
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleItemClick('actionboard')}
                    className={`portal-nav-item ${currentTab === 'actionboard' ? 'active' : ''}`}
                  >
                    <div className="portal-nav-item-content">
                      <span className="nav-icon"><Icon name="zap" size={17} /></span>
                      <span>Action Board</span>
                    </div>
                    <span className="portal-nav-badge" style={{ background: '#0D4A38', color: '#FFDF85' }}>
                      Daily
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleItemClick('overview')}
                    className={`portal-nav-item ${currentTab === 'overview' ? 'active' : ''}`}
                  >
                    <div className="portal-nav-item-content">
                      <span className="nav-icon"><Icon name="users" size={17} /></span>
                      <span>Students</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleItemClick('quran')}
                    className={`portal-nav-item ${currentTab === 'quran' ? 'active' : ''}`}
                    title={isQuranTrack ? 'Interactive Quran Recitation Mistake Annotator' : 'Available for Quran courses'}
                  >
                    <div className="portal-nav-item-content">
                      <span className="nav-icon"><Icon name="flag" size={17} /></span>
                      <span>Annotator</span>
                    </div>
                    {isQuranTrack && (
                      <span className="portal-nav-badge" style={{ background: 'var(--color-green-light)', color: 'var(--color-green-deep)', border: '1px solid var(--color-green-mint)' }}>
                        Quran
                      </span>
                    )}
                  </button>

                  <div className="portal-nav-section-title">FACULTY TOOLS</div>

                  <button
                    type="button"
                    onClick={() => handleItemClick('salary')}
                    className={`portal-nav-item ${currentTab === 'salary' ? 'active' : ''}`}
                  >
                    <div className="portal-nav-item-content">
                      <span className="nav-icon"><Icon name="wallet" size={17} /></span>
                      <span>Salary</span>
                    </div>
                    <span className="portal-nav-badge" style={{ background: '#EBF5F0', color: '#0D4A38' }}>
                      Live
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleItemClick('dictionary')}
                    className={`portal-nav-item ${currentTab === 'dictionary' ? 'active' : ''}`}
                  >
                    <div className="portal-nav-item-content">
                      <span className="nav-icon"><Icon name="book-marked" size={17} /></span>
                      <span>Tajweed Tools</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleItemClick('curriculum')}
                    className={`portal-nav-item ${currentTab === 'curriculum' ? 'active' : ''}`}
                  >
                    <div className="portal-nav-item-content">
                      <span className="nav-icon"><Icon name="edit" size={17} /></span>
                      <span>Curriculum</span>
                    </div>
                  </button>
                </>
              )}

              <div className="portal-nav-section-title">ACCOUNT</div>
              <button
                type="button"
                onClick={() => handleItemClick('profile')}
                className={`portal-nav-item ${currentTab === 'profile' ? 'active' : ''}`}
              >
                <div className="portal-nav-item-content">
                  <span className="nav-icon"><Icon name="scholar" size={17} /></span>
                  <span>Profile</span>
                </div>
              </button>
            </>
          ) : (
            /* ================= STUDENT & PARENT UNIFIED DASHBOARD SIDEBAR ================= */
            <>
              <div className="portal-nav-section-title">ACADEMICS</div>

              <button
                type="button"
                onClick={() => handleItemClick('progress')}
                className={`portal-nav-item ${currentTab === 'progress' ? 'active' : ''}`}
              >
                <div className="portal-nav-item-content">
                  <span className="nav-icon"><Icon name="trending-up" size={17} /></span>
                  <span>Progress</span>
                </div>
                <span className="portal-nav-badge" style={{ background: '#0D4A38', color: '#FFDF85' }}>
                  Live
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleItemClick('digitalquran')}
                className={`portal-nav-item ${currentTab === 'digitalquran' ? 'active' : ''}`}
                title="Genuine Quran Sharif & Mushaf Reading Studio"
              >
                <div className="portal-nav-item-content">
                  <span className="nav-icon"><Icon name="book-open" size={17} color="#D4AF37" /></span>
                  <span>Noble Quran (মুসহাফ)</span>
                </div>
                <span className="portal-nav-badge" style={{ background: '#0D4A38', color: '#FFDF85' }}>
                  Mushaf
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleItemClick('curriculum')}
                className={`portal-nav-item ${currentTab === 'curriculum' ? 'active' : ''}`}
              >
                <div className="portal-nav-item-content">
                  <span className="nav-icon"><Icon name="book-marked" size={17} /></span>
                  <span>Curriculum</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleItemClick('quran')}
                className={`portal-nav-item ${currentTab === 'quran' ? 'active' : ''}`}
                title={isQuranTrack ? 'Quran Recitation Mistake Slips' : 'Exclusive to Quran Recitation Courses'}
              >
                <div className="portal-nav-item-content">
                  <span className="nav-icon"><Icon name="flag" size={17} /></span>
                  <span>Mistakes</span>
                </div>
                <span
                  className="portal-nav-badge"
                  style={{
                    background: isQuranTrack ? 'var(--color-green-light)' : '#FEF3C7',
                    color: isQuranTrack ? 'var(--color-green-deep)' : '#92400E',
                    border: isQuranTrack ? '1px solid var(--color-green-mint)' : '1px solid #FCD34D',
                  }}
                >
                  {isQuranTrack ? 'Quran' : 'Quran Only'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleItemClick('quiz')}
                className={`portal-nav-item ${currentTab === 'quiz' ? 'active' : ''}`}
              >
                <div className="portal-nav-item-content">
                  <span className="nav-icon"><Icon name="award" size={17} /></span>
                  <span>Quizzes</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleItemClick('achievements')}
                className={`portal-nav-item ${currentTab === 'achievements' ? 'active' : ''}`}
                id="sidebar-nav-achievements"
              >
                <div className="portal-nav-item-content">
                  <span className="nav-icon"><Icon name="award" size={17} color="#D4AF37" /></span>
                  <span>Badges &amp; Sanad</span>
                </div>
                <span className="portal-nav-badge">
                  ১০-পারা সনদ
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleItemClick('dictionary')}
                className={`portal-nav-item ${currentTab === 'dictionary' ? 'active' : ''}`}
              >
                <div className="portal-nav-item-content">
                  <span className="nav-icon"><Icon name="book-marked" size={17} /></span>
                  <span>Tajweed Tools</span>
                </div>
              </button>

              <div className="portal-nav-section-title">FINANCES</div>

              <button
                type="button"
                onClick={() => handleItemClick('invoices')}
                className={`portal-nav-item ${currentTab === 'invoices' ? 'active' : ''}`}
              >
                <div className="portal-nav-item-content">
                  <span className="nav-icon"><Icon name="receipt" size={17} /></span>
                  <span>Invoices</span>
                </div>
              </button>

              <div className="portal-nav-section-title">ACCOUNT</div>

              <button
                type="button"
                onClick={() => handleItemClick('profile')}
                className={`portal-nav-item ${currentTab === 'profile' ? 'active' : ''}`}
              >
                <div className="portal-nav-item-content">
                  <span className="nav-icon"><Icon name={isParent ? 'parent' : 'student'} size={17} /></span>
                  <span>Profile</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleItemClick('catalog')}
                className={`portal-nav-item ${currentTab === 'catalog' ? 'active' : ''}`}
              >
                <div className="portal-nav-item-content">
                  <span className="nav-icon"><Icon name="sparkles" size={17} /></span>
                  <span>Courses</span>
                </div>
                <span className="portal-nav-badge">{coursesCount}</span>
              </button>

              <div className="portal-nav-section-title">EXTERNAL</div>
              <a
                href={process.env.NEXT_PUBLIC_LANDING_URL || 'http://localhost:3000'}
                target="_blank"
                rel="noopener noreferrer"
                className="portal-nav-item"
              >
                <div className="portal-nav-item-content">
                  <span className="nav-icon"><Icon name="mosque" size={17} /></span>
                  <span>Website</span>
                </div>
                <Icon name="arrow-right" size={13} color="var(--text-dim)" />
              </a>
            </>
          )}
        </nav>

        {/* Sidebar Footer with User Card & Sign Out */}
        <div className="portal-sidebar-footer">
          <div className="portal-user-card">
            <div className="portal-user-avatar">
              <Icon
                name={isAdmin ? 'shield-user' : isTeacher ? 'scholar' : isParent ? 'parent' : 'student'}
                size={20}
                color="var(--color-green-primary)"
              />
            </div>
            <div className="portal-user-details">
              <span className="portal-user-name" title={user?.name}>
                {user?.name || (isTeacher ? 'Teacher' : isParent ? 'Parent' : 'Student')}
              </span>
              <span className="portal-user-role-badge">
                {isAdmin
                  ? 'Admin'
                  : isTeacher
                  ? isTeacherPending
                    ? 'Pending'
                    : 'Teacher'
                  : isParent
                  ? 'Parent'
                  : isEnrolled
                  ? 'Active Student'
                  : 'Student'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="portal-btn-signout"
          >
            <Icon name="logout" size={14} color="#991B1B" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
