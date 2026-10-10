'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from './Icons';

export default function PortalSidebar({
  user,
  activeTab,
  onTabChange,
  enrollment,
  coursesCount = 1,
  isMobileOpen = false,
  onCloseMobile,
  onLogout,
  portalType = 'dashboard', // 'dashboard' | 'admin'
}) {
  const isStudent = user?.role === 'student';
  const isTeacher = user?.role === 'teacher';
  const isAdmin = user?.role === 'admin';
  const isTeacherPending =
    isTeacher && user?.status !== 'Verified Scholar' && user?.status !== 'Active';
  const isEnrolled = isStudent ? !!enrollment : true;

  const handleItemClick = (tabKey) => {
    if (onTabChange) onTabChange(tabKey);
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
          />
          <div className="portal-brand-text">
            <span className="portal-brand-name">Our Quran Institute</span>
            <span className="portal-brand-tag">
              {portalType === 'admin'
                ? 'Admin Superuser Console'
                : 'Sanctuary Learning LMS'}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="portal-sidebar-nav">
          {/* ================= ADMIN CONSOLE SIDEBAR ================= */}
          {portalType === 'admin' ? (
            <>
              <div className="portal-nav-section-title">ADMINISTRATOR CONTROLS</div>

              <button
                type="button"
                onClick={() => handleItemClick('courses')}
                className={`portal-nav-item ${activeTab === 'courses' ? 'active' : ''}`}
              >
                <div className="portal-nav-item-content">
                  <span className="nav-icon">📚</span>
                  <span>Courses &amp; Curriculum</span>
                </div>
                <span className="portal-nav-badge">{coursesCount}</span>
              </button>

              <button
                type="button"
                onClick={() => handleItemClick('users')}
                className={`portal-nav-item ${activeTab === 'users' ? 'active' : ''}`}
              >
                <div className="portal-nav-item-content">
                  <span className="nav-icon">👥</span>
                  <span>Institute Database</span>
                </div>
              </button>

              <div className="portal-nav-section-title">PORTAL NAVIGATION</div>

              <Link
                href="/dashboard"
                className="portal-nav-item"
                style={{ color: 'var(--color-green-primary)', fontWeight: '700' }}
              >
                <div className="portal-nav-item-content">
                  <span className="nav-icon">🎓</span>
                  <span>Switch to LMS Workspace</span>
                </div>
                <span>→</span>
              </Link>

              <a
                href={process.env.NEXT_PUBLIC_LANDING_URL || 'http://localhost:3000'}
                target="_blank"
                rel="noopener noreferrer"
                className="portal-nav-item"
              >
                <div className="portal-nav-item-content">
                  <span className="nav-icon">🌐</span>
                  <span>Institute Website</span>
                </div>
                <span>↗</span>
              </a>
            </>
          ) : (
            /* ================= LMS DASHBOARD SIDEBAR (STUDENT / TEACHER / ADMIN) ================= */
            <>
              {/* --- TEACHER PENDING APPROVAL --- */}
              {isTeacher && isTeacherPending ? (
                <>
                  <div className="portal-nav-section-title" style={{ color: '#D97706' }}>
                    FACULTY STATUS (LOCKED)
                  </div>

                  <button
                    type="button"
                    onClick={() => handleItemClick('overview')}
                    className={`portal-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                    style={activeTab !== 'overview' ? { background: '#FEF3C7', borderColor: '#F59E0B', color: '#92400E' } : {}}
                  >
                    <div className="portal-nav-item-content">
                      <span className="nav-icon">⏳</span>
                      <span style={{ fontWeight: 700 }}>Awaiting Admin Approval</span>
                    </div>
                  </button>

                  <div className="portal-nav-section-title">SCHOLAR ACCOUNT</div>

                  <button
                    type="button"
                    onClick={() => handleItemClick('profile')}
                    className={`portal-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                  >
                    <div className="portal-nav-item-content">
                      <span className="nav-icon">👤</span>
                      <span>Faculty Scholar Profile</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleItemClick('catalog')}
                    className={`portal-nav-item ${activeTab === 'catalog' ? 'active' : ''}`}
                  >
                    <div className="portal-nav-item-content">
                      <span className="nav-icon">🌟</span>
                      <span>Institute Courses Catalog</span>
                    </div>
                    <span className="portal-nav-badge">{coursesCount}</span>
                  </button>

                  <div className="portal-nav-section-title">LOCKED INSTRUCTION TOOLS</div>

                  <div
                    className="portal-nav-item"
                    style={{ opacity: 0.5, cursor: 'not-allowed' }}
                    title="Faculty tools unlock once verified by Administrator"
                  >
                    <div className="portal-nav-item-content">
                      <span className="nav-icon">🔒</span>
                      <span>Course Modules Editor</span>
                    </div>
                    <span className="portal-nav-badge" style={{ background: '#FEE2E2', color: '#991B1B' }}>Locked</span>
                  </div>

                  <div
                    className="portal-nav-item"
                    style={{ opacity: 0.5, cursor: 'not-allowed' }}
                    title="Faculty tools unlock once verified by Administrator"
                  >
                    <div className="portal-nav-item-content">
                      <span className="nav-icon">🔒</span>
                      <span>Quran Mistake Annotator</span>
                    </div>
                    <span className="portal-nav-badge" style={{ background: '#FEE2E2', color: '#991B1B' }}>Locked</span>
                  </div>

                  <div
                    className="portal-nav-item"
                    style={{ opacity: 0.5, cursor: 'not-allowed' }}
                    title="Faculty tools unlock once verified by Administrator"
                  >
                    <div className="portal-nav-item-content">
                      <span className="nav-icon">🔒</span>
                      <span>Student Roster &amp; Analytics</span>
                    </div>
                    <span className="portal-nav-badge" style={{ background: '#FEE2E2', color: '#991B1B' }}>Locked</span>
                  </div>
                </>
              ) : isTeacher ? (
                /* --- TEACHER VERIFIED SCHOLAR --- */
                <>
                  <div className="portal-nav-section-title">FACULTY INSTRUCTION</div>

                  <button
                    type="button"
                    onClick={() => handleItemClick('curriculum')}
                    className={`portal-nav-item ${activeTab === 'curriculum' ? 'active' : ''}`}
                  >
                    <div className="portal-nav-item-content">
                      <span className="nav-icon">📚</span>
                      <span>Course Modules Editor</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleItemClick('quran')}
                    className={`portal-nav-item ${activeTab === 'quran' ? 'active' : ''}`}
                  >
                    <div className="portal-nav-item-content">
                      <span className="nav-icon">📖</span>
                      <span>Quran Mistake Annotator</span>
                    </div>
                    <span className="portal-nav-badge">Live</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleItemClick('overview')}
                    className={`portal-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                  >
                    <div className="portal-nav-item-content">
                      <span className="nav-icon">📊</span>
                      <span>Student Roster &amp; Analytics</span>
                    </div>
                  </button>

                  <div className="portal-nav-section-title">SCHOLAR ACCOUNT</div>

                  <button
                    type="button"
                    onClick={() => handleItemClick('catalog')}
                    className={`portal-nav-item ${activeTab === 'catalog' ? 'active' : ''}`}
                  >
                    <div className="portal-nav-item-content">
                      <span className="nav-icon">🌟</span>
                      <span>Institute Courses Catalog</span>
                    </div>
                    <span className="portal-nav-badge">{coursesCount}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleItemClick('profile')}
                    className={`portal-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                  >
                    <div className="portal-nav-item-content">
                      <span className="nav-icon">👤</span>
                      <span>Faculty Scholar Profile</span>
                    </div>
                  </button>
                </>
              ) : isStudent && !isEnrolled ? (
                /* --- STUDENT NOT ENROLLED YET --- */
                <>
                  <div className="portal-nav-section-title">COURSE ENROLLMENT</div>

                  <button
                    type="button"
                    onClick={() => handleItemClick('catalog')}
                    className={`portal-nav-item ${activeTab === 'catalog' ? 'active' : ''}`}
                  >
                    <div className="portal-nav-item-content">
                      <span className="nav-icon">🌟</span>
                      <span>Course Catalog &amp; Enroll</span>
                    </div>
                    <span className="portal-nav-badge">Select Scholar</span>
                  </button>

                  <div className="portal-nav-section-title">SANCTUARY LEARNING LMS</div>

                  <button
                    type="button"
                    onClick={() => handleItemClick('curriculum')}
                    className={`portal-nav-item ${activeTab === 'curriculum' ? 'active' : ''}`}
                  >
                    <div className="portal-nav-item-content">
                      <span className="nav-icon">📚</span>
                      <span>Course Syllabus &amp; Modules</span>
                    </div>
                    <span className="portal-nav-badge" style={{ fontSize: '11px' }}>Preview</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleItemClick('quran')}
                    className={`portal-nav-item ${activeTab === 'quran' ? 'active' : ''}`}
                  >
                    <div className="portal-nav-item-content">
                      <span className="nav-icon">📖</span>
                      <span>Interactive Quran &amp; Mistake Marker</span>
                    </div>
                    <span className="portal-nav-badge">Live</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleItemClick('overview')}
                    className={`portal-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                  >
                    <div className="portal-nav-item-content">
                      <span className="nav-icon">📊</span>
                      <span>Academic Progress &amp; Milestones</span>
                    </div>
                  </button>

                  <div className="portal-nav-section-title">STUDENT ACCOUNT</div>

                  <button
                    type="button"
                    onClick={() => handleItemClick('profile')}
                    className={`portal-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                  >
                    <div className="portal-nav-item-content">
                      <span className="nav-icon">👤</span>
                      <span>My Student Profile</span>
                    </div>
                  </button>
                </>
              ) : (
                /* --- ENROLLED STUDENT (OR ADMIN VISITING LMS) --- */
                <>
                  <div className="portal-nav-section-title">SANCTUARY LEARNING LMS</div>

                  <button
                    type="button"
                    onClick={() => handleItemClick('curriculum')}
                    className={`portal-nav-item ${activeTab === 'curriculum' ? 'active' : ''}`}
                  >
                    <div className="portal-nav-item-content">
                      <span className="nav-icon">📚</span>
                      <span>Course Syllabus &amp; Modules</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleItemClick('quran')}
                    className={`portal-nav-item ${activeTab === 'quran' ? 'active' : ''}`}
                  >
                    <div className="portal-nav-item-content">
                      <span className="nav-icon">📖</span>
                      <span>Interactive Quran &amp; Mistake Marker</span>
                    </div>
                    <span className="portal-nav-badge">Live</span>
                  </button>

                  {isStudent && (
                    <button
                      type="button"
                      onClick={() => handleItemClick('quiz')}
                      className={`portal-nav-item ${activeTab === 'quiz' ? 'active' : ''}`}
                    >
                      <div className="portal-nav-item-content">
                        <span className="nav-icon">📝</span>
                        <span>Quizzes &amp; Tajweed Exams</span>
                      </div>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleItemClick('overview')}
                    className={`portal-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                  >
                    <div className="portal-nav-item-content">
                      <span className="nav-icon">📊</span>
                      <span>Academic Progress &amp; Milestones</span>
                    </div>
                  </button>

                  <div className="portal-nav-section-title">
                    {isAdmin ? 'ADMINISTRATOR TOOLS' : 'STUDENT ACCOUNT'}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleItemClick('catalog')}
                    className={`portal-nav-item ${activeTab === 'catalog' ? 'active' : ''}`}
                  >
                    <div className="portal-nav-item-content">
                      <span className="nav-icon">🌟</span>
                      <span>{isAdmin ? 'Course Catalog' : 'Explore Course Catalog'}</span>
                    </div>
                    <span className="portal-nav-badge">{coursesCount}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleItemClick('profile')}
                    className={`portal-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                  >
                    <div className="portal-nav-item-content">
                      <span className="nav-icon">👤</span>
                      <span>{isAdmin ? 'Administrator Profile' : 'My Student Profile'}</span>
                    </div>
                  </button>

                  {isAdmin && (
                    <>
                      <div className="portal-nav-section-title">SYSTEM ADMINISTRATION</div>
                      <Link
                        href="/admin"
                        className="portal-nav-item"
                        style={{
                          background: '#FEF3C7',
                          borderColor: '#F59E0B',
                          color: '#92400E',
                          fontWeight: '700',
                        }}
                      >
                        <div className="portal-nav-item-content">
                          <span className="nav-icon">👑</span>
                          <span>Admin Console</span>
                        </div>
                        <span>→</span>
                      </Link>
                    </>
                  )}
                </>
              )}

              <div className="portal-nav-section-title">INSTITUTE LINKS</div>
              <a
                href={process.env.NEXT_PUBLIC_LANDING_URL || 'http://localhost:3000'}
                target="_blank"
                rel="noopener noreferrer"
                className="portal-nav-item"
              >
                <div className="portal-nav-item-content">
                  <span className="nav-icon">🌐</span>
                  <span>Institute Website</span>
                </div>
                <span>↗</span>
              </a>
            </>
          )}
        </nav>

        {/* Sidebar Footer with User Card & Sign Out */}
        <div className="portal-sidebar-footer">
          <div className="portal-user-card">
            <div className="portal-user-avatar">
              {user?.avatar || (isTeacher ? '🕌' : isAdmin ? '👑' : '🎓')}
            </div>
            <div className="portal-user-details">
              <span className="portal-user-name" title={user?.name}>
                {user?.name || 'Sanctuary Scholar'}
              </span>
              <span className="portal-user-role-badge">
                {isAdmin
                  ? 'Administrator'
                  : isTeacher
                  ? isTeacherPending
                    ? '⏳ Pending Approval'
                    : 'Verified Scholar'
                  : isEnrolled
                  ? 'Enrolled Student'
                  : 'Registered Student'}
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
