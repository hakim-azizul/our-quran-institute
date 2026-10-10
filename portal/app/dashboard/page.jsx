'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '../../components/Icons';
import CourseCurriculumViewer from '../../components/CourseCurriculumViewer';
import InteractiveQuranAnnotator from '../../components/InteractiveQuranAnnotator';
import CourseQuizEngine from '../../components/CourseQuizEngine';
import CourseEnrollmentCatalog from '../../components/CourseEnrollmentCatalog';
import UserProfilePanel from '../../components/UserProfilePanel';
import PortalSidebar from '../../components/PortalSidebar';
import TeacherStudentDossier from '../../components/TeacherStudentDossier';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // LMS Data States
  const [coursesList, setCoursesList] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('QI-CRS-001');
  const [course, setCourse] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [studentsList, setStudentsList] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('QI-STU-8842');

  // Dashboard Sub-navigation Tabs: 'catalog' | 'curriculum' | 'quran' | 'overview' | 'quiz' | 'profile'
  const [activeTab, setActiveTab] = useState('curriculum');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Quiz launcher state
  const [activeQuizModuleId, setActiveQuizModuleId] = useState(null);

  // Initial Auth & Data Load
  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();

      let currentUserObj = null;
      if (data.authenticated && data.user) {
        currentUserObj = data.user;
        setUser(data.user);
      } else {
        // Fallback demo student
        currentUserObj = {
          id: 'QI-STU-8842',
          name: 'Tariq Al-Mansoor',
          email: 'tariq.student@quraninstitute.org',
          role: 'student',
          tajweedLevel: 'Intermediate',
          targetGoal: 'Full Hifz & Tajweed Mastery',
          mentor: 'Dr. Sheikh Ahmad Al-Azhari',
          nextSession: 'Today at 6:30 PM (in 45 mins)',
          memorizedJuz: 12,
          totalJuz: 30,
          avatar: '🎓',
        };
        setUser(currentUserObj);
      }

      // Fetch courses & available teachers
      const cRes = await fetch('/api/courses');
      const cData = await cRes.json();
      let activeCourse = null;
      if (cData.success && cData.courses?.length > 0) {
        setCoursesList(cData.courses);
        activeCourse = cData.courses.find((c) => c.id === selectedCourseId) || cData.courses[0];
        setCourse(activeCourse);
      }
      if (cData.success && cData.teachers?.length > 0) {
        setTeachers(cData.teachers);
      }

      // Fetch enrollments
      const eRes = await fetch('/api/enrollments');
      const eData = await eRes.json();
      if (eData.success && eData.enrollments) {
        if (currentUserObj.role === 'student') {
          // Check if this student is enrolled in the primary course
          const activeEnrollment = eData.enrollments.find(
            (enr) =>
              enr.studentId === currentUserObj.id &&
              (primaryCourse ? enr.courseId === primaryCourse.id : true)
          );

          if (activeEnrollment) {
            setEnrollment(activeEnrollment);
            // Default to curriculum tab if currently on catalog
            setActiveTab((prev) => (prev === 'catalog' ? 'curriculum' : prev));
          } else {
            setEnrollment(null);
            // If student is not enrolled, route to course catalog tab by default
            setActiveTab((prev) =>
              prev === 'curriculum' || prev === 'quran' || prev === 'quiz' ? 'catalog' : prev
            );
          }
        } else {
          // For teacher: populate assigned student list with enriched enrollment analytics
          setStudentsList(eData.enrollments || []);
          if (eData.enrollments?.[0]?.studentId) {
            setSelectedStudentId(eData.enrollments[0].studentId);
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
    router.push('/login');
  };

  const handleLaunchQuiz = (quizId, moduleId) => {
    setActiveQuizModuleId(moduleId);
    setActiveTab('quiz');
  };

  const handleEnrollSuccess = (newEnrollment) => {
    setEnrollment(newEnrollment);
    setActiveTab('curriculum');
    fetchDashboardData();
  };

  const handleUnenrollSuccess = () => {
    setEnrollment(null);
    setActiveTab('catalog');
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="auth-page-wrapper" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: 'var(--color-green-primary)', fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: '700' }}>
          Loading your sanctuary learning workspace...
        </p>
      </div>
    );
  }

  const isStudent = user?.role === 'student';
  const isTeacher = user?.role === 'teacher';
  const isAdmin = user?.role === 'admin';
  const isEnrolled = isStudent ? !!enrollment : true;
  const isTeacherPending =
    isTeacher && user?.status !== 'Verified Scholar' && user?.status !== 'Active';

  return (
    <div className="portal-layout-wrapper">
      {/* Sleek SaaS Sidebar */}
      <PortalSidebar
        user={user}
        activeTab={activeTab}
        onTabChange={(tabKey) => setActiveTab(tabKey)}
        enrollment={enrollment}
        coursesCount={coursesList.length}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        onLogout={handleLogout}
        portalType="dashboard"
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
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Sanctuary LMS</span>
              <span style={{ fontSize: '13px', color: 'var(--color-gold-deep)' }}>›</span>
              <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--color-green-deep)' }}>
                {isTeacherPending
                  ? 'Faculty Verification in Progress'
                  : activeTab === 'curriculum'
                  ? 'Course Syllabus & Modules'
                  : activeTab === 'quran'
                  ? 'Interactive Quran & Mistake Marker'
                  : activeTab === 'quiz'
                  ? 'Quizzes & Tajweed Exams'
                  : activeTab === 'overview'
                  ? isTeacher
                    ? 'Student Roster & Analytics'
                    : 'Academic Milestones & Progress'
                  : activeTab === 'catalog'
                  ? 'Course Catalog & Enrollment'
                  : isTeacher
                  ? 'Scholar Profile'
                  : 'My Student Profile'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isAdmin && (
              <Link
                href="/admin"
                className="auth-nav-pill-btn"
                style={{ background: '#FEF3C7', borderColor: '#F59E0B', color: '#92400E', padding: '6px 14px' }}
              >
                <span>👑 Admin Console</span>
              </Link>
            )}

            {isEnrolled && !isTeacherPending && (
              <button
                onClick={() => alert(`Launching 1-on-1 Sanctuary Classroom with ${enrollment?.teacherName || 'your scholar'}...`)}
                className="btn-auth-submit"
                style={{ margin: 0, padding: '8px 16px', fontSize: '13px', width: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}
              >
                <Icon name="video" size={14} color="#FFDF85" />
                <span>Live Room</span>
              </button>
            )}
          </div>
        </header>

        {/* Dashboard Main Content */}
        <main style={{ padding: '24px 28px', flex: 1, overflowY: 'auto' }}>
          <div className="dashboard-wrapper">
          {/* Top User Greeting & Status Banner */}
          <div className="dashboard-hero-card">
            <div className="dashboard-hero-user">
              <div className="dashboard-avatar">{user.avatar || (isTeacher ? '🕌' : '🎓')}</div>
              <div>
                <span className="dashboard-user-badge">
                  <Icon name="sparkles" size={12} color="#0D4A38" />
                  {isStudent
                    ? isEnrolled
                      ? 'Enrolled Student — Hifz & Tajweed'
                      : 'Registered Student — Awaiting Course Enrollment'
                    : isTeacher
                    ? isTeacherPending
                      ? '⏳ Faculty Scholar — Pending Administrative Approval'
                      : 'Certified Al-Azhar Scholar & Faculty'
                    : 'System Administrator'}
                </span>
                <h1 className="dashboard-user-name">{user.name}</h1>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Institute ID: <strong style={{ color: 'var(--color-green-primary)' }}>{user.id}</strong> • {user.email}
                  {isStudent && enrollment && (
                    <> • Assigned Scholar: <strong style={{ color: 'var(--color-gold-deep)' }}>{enrollment.teacherName}</strong></>
                  )}
                  {isTeacherPending && (
                    <> • Status: <strong style={{ color: '#B45309' }}>Awaiting Admin Verification</strong></>
                  )}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {isTeacherPending ? (
                <button
                  onClick={fetchDashboardData}
                  className="btn-auth-submit"
                  style={{
                    margin: 0,
                    padding: '10px 18px',
                    fontSize: '13px',
                    background: '#FEF3C7',
                    borderColor: '#F59E0B',
                    color: '#92400E',
                    width: 'auto',
                  }}
                >
                  <span>🔄 Check Status</span>
                </button>
              ) : isStudent && !isEnrolled ? (
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="btn-auth-submit"
                  style={{
                    margin: 0,
                    padding: '12px 20px',
                    display: 'flex',
                    gap: '8px',
                    width: 'auto',
                    background: 'linear-gradient(135deg, #C5A45A, #A68337)',
                    color: '#FFFFFF',
                  }}
                >
                  <span>✨</span>
                  <span>Browse Course &amp; Choose Teacher</span>
                </button>
              ) : (
                <button
                  onClick={() => alert(`Launching 1-on-1 Sanctuary Classroom with ${enrollment?.teacherName || 'your scholar'}...`)}
                  className="btn-auth-submit"
                  style={{ margin: 0, padding: '12px 20px', display: 'flex', gap: '8px', width: 'auto' }}
                >
                  <Icon name="video" size={16} color="#FFDF85" />
                  <span>Launch Live Room</span>
                </button>
              )}
            </div>
          </div>

          {/* IF TEACHER IS PENDING APPROVAL: DISPLAY LOCKED DASHBOARD PANEL */}
          {isTeacherPending ? (
            <div
              className="dash-panel"
              style={{
                border: '2px solid #F59E0B',
                background: 'linear-gradient(180deg, #FFFDF8 0%, #FFFFFF 100%)',
                padding: '40px 32px',
                textAlign: 'center',
                boxShadow: '0 12px 30px rgba(245, 158, 11, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: '#FEF3C7',
                  color: '#B45309',
                  fontSize: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #F59E0B',
                }}
              >
                ⏳
              </div>

              <div>
                <h2
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '26px',
                    fontWeight: '800',
                    color: '#92400E',
                    margin: '0 0 8px 0',
                  }}
                >
                  Scholar Account Pending Administrative Approval
                </h2>
                <p
                  style={{
                    fontSize: '14.5px',
                    color: 'var(--text-body)',
                    maxWidth: '680px',
                    margin: '0 auto',
                    lineHeight: '1.6',
                  }}
                >
                  Assalamu Alaikum, <strong>{user.name}</strong>. Your faculty scholar application has been received and is currently under review by the Academic Council. To ensure authentic Quranic Sanad transmission, all teaching tools, curriculum authoring, student assignments, and the interactive Quran mistake annotator remain locked until verified by an Administrator.
                </p>
              </div>

              {/* Submitted Credentials Card */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '560px',
                  background: '#FFFFFF',
                  border: '1.5px solid var(--border-light)',
                  borderRadius: '14px',
                  padding: '20px 24px',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  fontSize: '13px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Assigned Faculty ID:</span>
                  <strong style={{ color: 'var(--color-green-primary)' }}>{user.id}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Sanad Certification:</span>
                  <strong>{user.sanadCertification || 'Submitted for Verification'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Specialization:</span>
                  <strong>{user.specialization || 'Tajweed & Qira’at'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Recitation Riwayah:</span>
                  <strong>{user.qiraat || 'Hafs ‘an ‘Asim'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Approval Status:</span>
                  <span
                    style={{
                      background: '#FEF3C7',
                      color: '#B45309',
                      padding: '3px 10px',
                      borderRadius: '999px',
                      fontWeight: '800',
                      border: '1px solid #F59E0B',
                      fontSize: '11.5px',
                    }}
                  >
                    ⏳ Awaiting Admin Approval
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '8px' }}>
                <button
                  onClick={fetchDashboardData}
                  className="btn-auth-submit"
                  style={{ width: 'auto', padding: '12px 26px', fontSize: '14px' }}
                >
                  <span>🔄 Check Verification Status</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="btn-table-action"
                  style={{
                    padding: '12px 22px',
                    fontSize: '13.5px',
                    background: '#FEF2F2',
                    borderColor: '#F87171',
                    color: '#991B1B',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* DYNAMIC CONTENT AREA (DRIVEN BY SIDEBAR NAVIGATION ACROSS ALL PROFILES) */}

              {/* 1. COURSE CATALOG VIEW */}
              {activeTab === 'catalog' && (
                <CourseEnrollmentCatalog
                  course={course}
                  courses={coursesList}
                  teachers={teachers}
                  currentUser={user}
                  onSelectCourse={(c) => {
                    setCourse(c);
                    setSelectedCourseId(c.id);
                  }}
                  onEnrollSuccess={handleEnrollSuccess}
                />
              )}

              {/* 2. COURSE SYLLABUS & MODULES VIEW */}
              {activeTab === 'curriculum' && (
                <>
                  {isStudent && !isEnrolled && (
                    <div
                      style={{
                        background: 'var(--color-gold-light)',
                        border: '1.5px solid var(--color-gold-primary)',
                        borderRadius: '14px',
                        padding: '16px 20px',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '24px' }}>🌟</span>
                        <div>
                          <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-green-deep)' }}>
                            Course Curriculum Preview Mode
                          </div>
                          <div style={{ fontSize: '13px', color: 'var(--text-body)' }}>
                            Explore our structured syllabus and Tajweed lessons. Select your verified scholar to submit recitations and start 1-on-1 sessions.
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('catalog')}
                        className="btn-auth-submit"
                        style={{ margin: 0, padding: '10px 20px', fontSize: '13.5px', width: 'auto' }}
                      >
                        <span>Browse Scholars &amp; Enroll →</span>
                      </button>
                    </div>
                  )}
                  <CourseCurriculumViewer
                    course={course}
                    courses={coursesList}
                    enrollment={enrollment}
                    currentUser={user}
                    studentsList={studentsList}
                    selectedStudentId={selectedStudentId}
                    onSelectStudent={(sId) => setSelectedStudentId(sId)}
                    onSelectCourse={(c) => {
                      setCourse(c);
                      setSelectedCourseId(c.id);
                    }}
                    onLaunchQuiz={handleLaunchQuiz}
                    onRefreshEnrollment={fetchDashboardData}
                    onCourseUpdated={fetchDashboardData}
                  />
                </>
              )}

              {/* 3. INTERACTIVE QURAN & MISTAKE MARKER VIEW */}
              {activeTab === 'quran' && (
                <>
                  {isStudent && !isEnrolled && (
                    <div
                      style={{
                        background: 'var(--color-green-surface)',
                        border: '1.5px solid rgba(13, 74, 56, 0.2)',
                        borderRadius: '14px',
                        padding: '16px 20px',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '24px' }}>📖</span>
                        <div>
                          <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-green-primary)' }}>
                            Interactive Quran Practice &amp; Tajweed Engine
                          </div>
                          <div style={{ fontSize: '13px', color: 'var(--text-body)' }}>
                            You can read and listen to the Holy Quran below. Once enrolled with an Al-Azhar scholar, your instructor will record live mistake flags and audio correction notes.
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('catalog')}
                        className="btn-auth-submit"
                        style={{ margin: 0, padding: '10px 20px', fontSize: '13.5px', width: 'auto' }}
                      >
                        <span>Enroll with Scholar →</span>
                      </button>
                    </div>
                  )}
                  <InteractiveQuranAnnotator
                    currentUser={user}
                    studentsList={studentsList}
                    selectedStudentId={selectedStudentId}
                    onSelectStudent={setSelectedStudentId}
                  />
                </>
              )}

              {/* 4. QUIZ & EXAM ASSESSMENT ENGINE */}
              {activeTab === 'quiz' && (
                activeQuizModuleId ? (
                  <CourseQuizEngine
                    moduleId={activeQuizModuleId}
                    enrollmentId={enrollment?.id || 'QI-ENR-01'}
                    onClose={() => setActiveTab('curriculum')}
                    onQuizCompleted={fetchDashboardData}
                  />
                ) : (
                  <div className="dash-panel" style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <span style={{ fontSize: '48px', display: 'block', marginBottom: '14px' }}>📝</span>
                    <h3 className="dash-panel-title" style={{ justifyContent: 'center', fontSize: '20px' }}>
                      Quizzes &amp; Tajweed Assessment Engine
                    </h3>
                    <p style={{ maxWidth: '540px', margin: '0 auto 20px auto', fontSize: '14px', color: 'var(--text-body)' }}>
                      {isEnrolled
                        ? 'Take your module quizzes to test your Tajweed rules and pronunciation. Quizzes are unlocked sequentially as you complete lessons.'
                        : 'Enroll in a course to take verified assessments and earn Sanad accreditation.'}
                    </p>
                    <button
                      onClick={() => setActiveTab(isEnrolled ? 'curriculum' : 'catalog')}
                      className="btn-auth-submit"
                      style={{ width: 'auto', margin: '0 auto', padding: '12px 24px', fontSize: '14px' }}
                    >
                      <span>{isEnrolled ? 'Open Course Syllabus to Start Quiz' : 'Browse Course Catalog'}</span>
                    </button>
                  </div>
                )
              )}

              {/* 5. ACADEMIC PROGRESS & MILESTONES OVERVIEW */}
              {activeTab === 'overview' && (
                isTeacher ? (
                  <TeacherStudentDossier
                    currentUser={user}
                    studentsList={studentsList}
                    course={course}
                    selectedStudentId={selectedStudentId}
                    onSelectStudent={(sId) => setSelectedStudentId(sId)}
                    onOpenQuranForStudent={(sId) => {
                      setSelectedStudentId(sId);
                      setActiveTab('quran');
                    }}
                    onRefreshData={fetchDashboardData}
                  />
                ) : isEnrolled ? (
                  <div className="dashboard-grid">
                    <div className="dash-panel">
                      <h2 className="dash-panel-title">
                        <Icon name="award" size={18} color="#0D4A38" />
                        <span>Curriculum &amp; Hifz Analytics</span>
                      </h2>

                <div className="dash-stat-row">
                  {isStudent && (
                    <>
                      <div className="dash-stat-card">
                        <div className="dash-stat-value">{enrollment?.progressPercent || 0}%</div>
                        <div className="dash-stat-label">Course Completed</div>
                      </div>
                      <div className="dash-stat-card">
                        <div className="dash-stat-value">{user.memorizedJuz || 12} / 30</div>
                        <div className="dash-stat-label">Juz Memorized</div>
                      </div>
                      <div className="dash-stat-card">
                        <div className="dash-stat-value">98.4%</div>
                        <div className="dash-stat-label">Tajweed Accuracy</div>
                      </div>
                    </>
                  )}
                </div>

                <div
                  style={{
                    background: 'var(--color-green-surface)',
                    border: '1px solid rgba(13, 74, 56, 0.15)',
                    borderRadius: '12px',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                      Enrolled Flagship Course
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-green-primary)' }}>
                      {course?.title || 'How to Read the Holy Quran'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                      Assigned Lead Scholar
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>
                      {enrollment?.teacherName || course?.teacherName || 'Dr. Sheikh Ahmad Al-Azhari'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                      Completed Quizzes &amp; Assessments
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#166534' }}>
                      {enrollment?.completedQuizzes?.length || 0} Passed with Distinction
                    </span>
                  </div>
                </div>
              </div>

              {/* Next Live Session Panel */}
              <div className="dash-panel">
                <h2 className="dash-panel-title">
                  <Icon name="clock" size={18} color="#0D4A38" />
                  <span>Next 1-on-1 Sanctuary Session</span>
                </h2>

                <div
                  style={{
                    background: 'var(--color-gold-light)',
                    border: '1.5px solid var(--color-gold-primary)',
                    borderRadius: '14px',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700', color: 'var(--color-gold-deep)' }}>
                      Private Classroom
                    </span>
                    <span style={{ background: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: '700' }}>
                      ● Scheduled Today
                    </span>
                  </div>

                  <p style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-green-deep)', margin: 0 }}>
                    {user.nextSession || 'Today at 6:30 PM (in 45 mins)'}
                  </p>

                  <p style={{ fontSize: '12.5px', color: 'var(--text-body)', lineHeight: '1.4', margin: 0 }}>
                    Agenda: Live recitation of Surah Al-Fatiha with revision on Ayah 7 Madd Lazim duration.
                  </p>

                  <button
                    onClick={() => alert(`Launching Zoom 1-on-1 Video Classroom with ${enrollment?.teacherName || 'your scholar'}...`)}
                    className="btn-auth-submit"
                    style={{ margin: 0, padding: '10px 14px', fontSize: '13px' }}
                  >
                    <Icon name="video" size={15} color="#FFDF85" />
                    <span>Enter Live Classroom</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="dash-panel" style={{ padding: '36px 30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'var(--color-gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                  📊
                </div>
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--color-green-deep)', margin: 0 }}>
                    Academic Milestones &amp; Onboarding Journey
                  </h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: 'var(--text-muted)' }}>
                    Complete these 4 foundational milestones to begin your 1-on-1 Sanctuary Hifz recitation.
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px', marginTop: '24px' }}>
                <div style={{ background: '#F0FDF4', border: '1.5px solid #86EFAC', borderRadius: '14px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: '#166534', background: '#DCFCE7', padding: '3px 10px', borderRadius: '999px' }}>Step 1: COMPLETED</span>
                    <span style={{ fontSize: '18px' }}>✅</span>
                  </div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#166534', fontWeight: '700' }}>Student Account Creation</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#14532D' }}>Profile registered with verified email and student sanctuary identity.</p>
                </div>

                <div style={{ background: 'var(--color-gold-light)', border: '1.5px solid var(--color-gold-primary)', borderRadius: '14px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-gold-deep)', background: '#FEF3C7', padding: '3px 10px', borderRadius: '999px' }}>Step 2: IN PROGRESS</span>
                    <span style={{ fontSize: '18px' }}>👉</span>
                  </div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: 'var(--color-gold-deep)', fontWeight: '700' }}>Course &amp; Scholar Selection</h4>
                  <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--text-body)' }}>Choose your flagship curriculum and certified Al-Azhar lead scholar.</p>
                  <button
                    onClick={() => setActiveTab('catalog')}
                    className="btn-auth-submit"
                    style={{ margin: 0, padding: '8px 16px', fontSize: '12.5px', width: '100%' }}
                  >
                    Choose Course &amp; Scholar →
                  </button>
                </div>

                <div style={{ background: 'var(--bg-canvas-subtle)', border: '1.5px solid var(--border-light)', borderRadius: '14px', padding: '20px', opacity: 0.85 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', background: '#E2E8F0', padding: '3px 10px', borderRadius: '999px' }}>Step 3: UPCOMING</span>
                    <span style={{ fontSize: '18px' }}>⏳</span>
                  </div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: 'var(--text-main)', fontWeight: '700' }}>Diagnostic Session</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Initial live 1-on-1 diagnostic evaluation with your assigned scholar.</p>
                </div>

                <div style={{ background: 'var(--bg-canvas-subtle)', border: '1.5px solid var(--border-light)', borderRadius: '14px', padding: '20px', opacity: 0.85 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', background: '#E2E8F0', padding: '3px 10px', borderRadius: '999px' }}>Step 4: UPCOMING</span>
                    <span style={{ fontSize: '18px' }}>🎓</span>
                  </div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: 'var(--text-main)', fontWeight: '700' }}>Sanad Accreditation</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Continuous mistake tracking until full Tajweed Ijazah certification.</p>
                </div>
              </div>
            </div>
          )
        )}

          {/* 6. PROFILE TAB (Available for both Enrolled & Non-Enrolled Students and Teachers) */}
          {activeTab === 'profile' && (
            <UserProfilePanel
              user={user}
              enrollment={enrollment}
              course={course}
              onProfileUpdated={(updatedUser) => setUser(updatedUser)}
              onUnenrollSuccess={handleUnenrollSuccess}
              onNavigateToCatalog={() => setActiveTab('catalog')}
            />
          )}
            </>
          )}
        </div>
      </main>
    </div>
  </div>
  );
}
