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
import TeacherActionBoard from '../../components/TeacherActionBoard';
import TeacherSalaryDashboard from '../../components/TeacherSalaryDashboard';
import DigitalToolsDictionary from '../../components/DigitalToolsDictionary';
import StudentParentProgressView from '../../components/StudentParentProgressView';
import DigitalQuranReader from '../../components/DigitalQuranReader';
import ParentTeacherReviewModal from '../../components/ParentTeacherReviewModal';
import TuitionInvoicesPageView from '../../components/TuitionInvoicesPageView';
import TeacherDashboard from '../../components/TeacherDashboard';
import TajweedToolsPageView from '../../components/TajweedToolsPageView';

const mapSlugToTab = (slug) => {
  if (!slug) return null;
  const s = slug.toLowerCase();
  if (s === 'teacherdashboard' || s === 'teacher' || s === 'teacher-dashboard' || s === 'instructor') return 'teacherdashboard';
  if (s === 'progress' || s === 'hifz') return 'progress';
  if (s === 'digital-quran' || s === 'digitalquran' || s === 'quran-studio') return 'digitalquran';
  if (s === 'curriculum' || s === 'syllabus' || s === 'modules') return 'curriculum';
  if (s === 'mistakes' || s === 'quran' || s === 'annotator') return 'quran';
  if (s === 'quiz' || s === 'quizzes' || s === 'exams') return 'quiz';
  if (s === 'action-board' || s === 'actionboard' || s === 'attendance') return 'actionboard';
  if (s === 'salary' || s === 'billing' || s === 'earnings') return 'salary';
  if (s === 'students' || s === 'overview' || s === 'roster') return 'overview';
  if (s === 'catalog' || s === 'courses') return 'catalog';
  if (s === 'profile' || s === 'account') return 'profile';
  if (s === 'reviews' || s === 'review') return 'reviews';
  if (s === 'invoices' || s === 'invoice') return 'invoices';
  if (s === 'dictionary' || s === 'tools' || s === 'tajweed-tools' || s === 'tajweed') return 'dictionary';
  return s;
};

const mapTabToUrl = (tabKey) => {
  const reverseSlugMap = {
    teacherdashboard: '/dashboard/teacher',
    progress: '/dashboard/progress',
    digitalquran: '/dashboard/digital-quran',
    curriculum: '/dashboard/curriculum',
    quran: '/dashboard/quran',
    quiz: '/dashboard/quiz',
    actionboard: '/dashboard/action-board',
    salary: '/dashboard/salary',
    overview: '/dashboard/students',
    catalog: '/dashboard/catalog',
    profile: '/dashboard/profile',
    reviews: '/dashboard/reviews',
    invoices: '/dashboard/invoices',
    dictionary: '/dashboard/dictionary',
  };
  return reverseSlugMap[tabKey] || `/dashboard/${tabKey}`;
};

export default function DashboardWorkspace({ initialTab }) {
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

  // Navigation tab initialized from route
  const resolvedInitialTab = mapSlugToTab(initialTab) || 'progress';
  const [activeTab, setActiveTab] = useState(resolvedInitialTab);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Quiz launcher state
  const [activeQuizModuleId, setActiveQuizModuleId] = useState(null);

  // Modals state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(resolvedInitialTab === 'reviews');
  const [reviewTeacherInfo, setReviewTeacherInfo] = useState({
    id: 'QI-FAC-014',
    name: 'Dr. Sheikh Ahmad Al-Azhari',
    studentId: 'QI-STU-8842',
  });

  // Keep activeTab in sync if initialTab prop changes
  useEffect(() => {
    if (initialTab) {
      const mapped = mapSlugToTab(initialTab);
      if (mapped) {
        setActiveTab(mapped);
        if (mapped === 'reviews') setIsReviewModalOpen(true);
      }
    }
  }, [initialTab]);

  // Support browser back/forward buttons smoothly without page reload
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        const tabSlug = path.replace('/dashboard/', '').replace('/dashboard', '');
        const mapped = mapSlugToTab(tabSlug) || 'progress';
        setActiveTab(mapped);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Initial Auth & Data Load
  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();

      let currentUserObj = null;
      if (data.authenticated && data.user) {
        currentUserObj = data.user;
        setUser(data.user);

        // If user is teacher and no explicit tab requested, default to teacherdashboard
        if (currentUserObj.role === 'teacher' && !initialTab) {
          setActiveTab('teacherdashboard');
        }
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
          assignedTeacherId: 'QI-FAC-014',
          nextSession: 'Today at 6:30 PM (in 45 mins)',
          memorizedJuz: 12,
          totalJuz: 30,
          avatar: 'student',
        };
        setUser(currentUserObj);
      }

      // 1. Fetch courses
      const cRes = await fetch('/api/courses');
      const cData = await cRes.json();
      let activeCourse = null;
      if (cData.success && cData.courses) {
        setCoursesList(cData.courses);
        setTeachers(cData.teachers || []);
        activeCourse = cData.courses.find((c) => c.id === selectedCourseId) || cData.courses[0];
        setCourse(activeCourse);
      }

      // 2. Fetch student enrollments or teacher assignments
      const eRes = await fetch('/api/enrollments');
      const eData = await eRes.json();
      if (eData.success && eData.enrollments) {
        if (currentUserObj.role === 'student') {
          const activeEnrollment = eData.enrollments.find(
            (enr) =>
              enr.studentId === currentUserObj.id &&
              (activeCourse ? enr.courseId === activeCourse.id : true)
          );

          if (activeEnrollment) {
            setEnrollment(activeEnrollment);
          } else {
            setEnrollment(null);
          }
        } else {
          // For teacher or admin: populate assigned student list
          setStudentsList(eData.enrollments || []);
          if (eData.enrollments?.[0]?.studentId) {
            setSelectedStudentId(eData.enrollments[0].studentId);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
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

  const handleTabChange = (tabKey) => {
    const targetUrl = mapTabToUrl(tabKey);
    if (typeof window !== 'undefined' && window.location.pathname !== targetUrl) {
      window.history.pushState({ tab: tabKey }, '', targetUrl);
    }
    if (tabKey === 'reviews') {
      setIsReviewModalOpen(true);
    } else {
      setActiveTab(tabKey);
    }
  };

  const handleLaunchQuiz = (quizId, moduleId) => {
    setActiveQuizModuleId(moduleId);
    handleTabChange('quiz');
  };

  const handleEnrollSuccess = (newEnrollment) => {
    setEnrollment(newEnrollment);
    handleTabChange('curriculum');
    fetchDashboardData();
  };

  const handleUnenrollSuccess = () => {
    setEnrollment(null);
    handleTabChange('catalog');
    fetchDashboardData();
  };

  const handleOpenReviewModal = (teacherId, teacherName, studentId) => {
    setReviewTeacherInfo({
      id: teacherId || 'QI-FAC-014',
      name: teacherName || 'Dr. Sheikh Ahmad Al-Azhari',
      studentId: studentId || 'QI-STU-8842',
    });
    setIsReviewModalOpen(true);
  };

  if (loading) {
    return (
      <div className="auth-page-wrapper" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="portal-spinner"></div>
        <p
          style={{
            color: 'var(--color-green-primary)',
            fontFamily: 'var(--font-serif)',
            fontSize: '20px',
            fontWeight: '700',
            marginTop: '16px',
          }}
        >
          Loading your dashboard...
        </p>
      </div>
    );
  }

  const isStudent = user?.role === 'student';
  const isTeacher = user?.role === 'teacher';
  const isParent = user?.role === 'parent';
  const isAdmin = user?.role === 'admin';

  return (
    <div className="portal-layout-wrapper">
      {/* Dynamic Portal Sidebar */}
      <PortalSidebar
        user={user}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        enrollment={enrollment}
        course={course}
        coursesCount={coursesList.length}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        onLogout={handleLogout}
        portalType="dashboard"
      />

      <div className="portal-content-wrapper">
        {/* Top Header Bar */}
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
              <span className="crumb-root">Portal</span>
              <span className="crumb-sep">/</span>
              <span className="crumb-current">
                {activeTab === 'teacherdashboard'
                  ? 'Teacher Dashboard'
                  : activeTab === 'actionboard'
                  ? 'Attendance & Lessons'
                  : activeTab === 'progress'
                  ? 'Progress'
                  : activeTab === 'digitalquran'
                  ? 'Quran Reader'
                  : activeTab === 'salary'
                  ? 'Salary & Payroll'
                  : activeTab === 'overview'
                  ? 'Student Roster'
                  : activeTab === 'curriculum'
                  ? 'Curriculum'
                  : activeTab === 'quran'
                  ? 'Mistake Marker'
                  : activeTab === 'quiz'
                  ? 'Quizzes & Exams'
                  : activeTab === 'invoices'
                  ? 'Invoices'
                  : activeTab === 'dictionary'
                  ? 'Tajweed Tools'
                  : activeTab === 'catalog'
                  ? 'Courses'
                  : 'Profile & Settings'}
              </span>
            </div>
          </div>

          <div className="portal-topbar-right">
            {isTeacher && (
              <button
                type="button"
                className="btn-quick-top-action"
                onClick={() => handleTabChange('dictionary')}
              >
                <Icon name="book-marked" size={15} style={{ marginRight: 6 }} />
                Digital Dictionary
              </button>
            )}

            {(isStudent || isParent) && (
              <button
                type="button"
                className="btn-quick-top-action"
                onClick={() => handleTabChange('invoices')}
              >
                <Icon name="receipt" size={15} style={{ marginRight: 6 }} />
                Tuition Invoices
              </button>
            )}

            {isAdmin && (
              <Link href="/admin/analytics" className="admin-status-pill">
                <Icon name="shield-user" size={14} style={{ marginRight: 6 }} />
                Superuser Admin Console →
              </Link>
            )}
          </div>
        </header>

        {/* Main Content Body */}
        <main className="portal-content-body">
          <div key={activeTab} className="portal-tab-transition-container">
            {/* TEACHER WORKSPACE */}
          {isTeacher && (
            <>
              {activeTab === 'teacherdashboard' && (
                <TeacherDashboard
                  currentUser={user}
                  studentsList={studentsList}
                  coursesList={coursesList}
                  course={course}
                  onNavigateTab={handleTabChange}
                  onSelectStudent={(stuId) => setSelectedStudentId(stuId)}
                  onOpenQuranForStudent={(stuId) => {
                    setSelectedStudentId(stuId);
                    handleTabChange('quran');
                  }}
                  onRefreshData={fetchDashboardData}
                />
              )}

              {activeTab === 'actionboard' && (
                <TeacherActionBoard
                  teacherUser={user}
                  studentsList={studentsList}
                  course={course}
                  selectedStudentId={selectedStudentId}
                  onSelectStudent={(stuId) => setSelectedStudentId(stuId)}
                  onOpenQuranForStudent={(stuId) => {
                    setSelectedStudentId(stuId);
                    handleTabChange('quran');
                  }}
                />
              )}

              {activeTab === 'salary' && (
                <TeacherSalaryDashboard teacherUser={user} />
              )}

              {activeTab === 'overview' && (
                <TeacherStudentDossier
                  currentUser={user}
                  studentsList={studentsList}
                  course={course}
                  selectedStudentId={selectedStudentId}
                  onSelectStudent={(stuId) => setSelectedStudentId(stuId)}
                  onOpenQuranForStudent={(stuId) => {
                    setSelectedStudentId(stuId);
                    handleTabChange('quran');
                  }}
                  onRefreshData={fetchDashboardData}
                />
              )}

              {activeTab === 'quran' && (
                <InteractiveQuranAnnotator
                  currentUser={user}
                  selectedStudentId={selectedStudentId}
                  initialStudentId={selectedStudentId}
                  studentsList={studentsList.map((s) => ({
                    id: s.studentId || s.id,
                    studentId: s.studentId || s.id,
                    name: s.studentName || s.name,
                    courseId: s.courseId,
                    courseTitle: s.courseTitle || 'Quran Reading Foundation & Tajweed Mastery',
                    activeMistakesCount: s.activeMistakesCount || 0,
                    resolvedMistakesCount: s.resolvedMistakesCount || 0,
                  }))}
                  onSelectStudent={(stuId) => setSelectedStudentId(stuId)}
                  course={course}
                  coursesList={coursesList}
                />
              )}

              {activeTab === 'curriculum' && course && (
                <CourseCurriculumViewer
                  course={course}
                  enrollment={enrollment}
                  currentUser={user}
                  onCourseUpdated={fetchDashboardData}
                  onLaunchQuiz={handleLaunchQuiz}
                  onOpenReviewModal={handleOpenReviewModal}
                />
              )}

              {activeTab === 'progress' && (
                <StudentParentProgressView
                  currentUser={user}
                  onOpenReviewModal={handleOpenReviewModal}
                  onOpenDigitalQuran={() => handleTabChange('digitalquran')}
                  onOpenInvoiceModal={() => handleTabChange('invoices')}
                />
              )}

              {activeTab === 'digitalquran' && (
                <DigitalQuranReader
                  studentId={selectedStudentId || 'QI-STU-8842'}
                  onClose={() => handleTabChange('actionboard')}
                />
              )}
            </>
          )}

          {/* STUDENT & PARENT / GUARDIAN UNIFIED WORKSPACE */}
          {(isStudent || isParent) && (
            <>
              {(activeTab === 'progress' || activeTab === 'overview') && (
                <StudentParentProgressView
                  currentUser={user}
                  onOpenReviewModal={handleOpenReviewModal}
                  onOpenDigitalQuran={() => handleTabChange('digitalquran')}
                  onOpenInvoiceModal={() => handleTabChange('invoices')}
                />
              )}

              {activeTab === 'digitalquran' && (
                <DigitalQuranReader
                  studentId={isParent ? (selectedStudentId || 'QI-STU-8842') : (user?.id || 'QI-STU-8842')}
                  onClose={() => handleTabChange('progress')}
                />
              )}

              {activeTab === 'curriculum' && course && (
                <CourseCurriculumViewer
                  course={course}
                  enrollment={enrollment}
                  currentUser={user}
                  onCourseUpdated={fetchDashboardData}
                  onLaunchQuiz={handleLaunchQuiz}
                  onOpenReviewModal={handleOpenReviewModal}
                />
              )}

              {activeTab === 'quran' && (
                <InteractiveQuranAnnotator
                  currentUser={user}
                  selectedStudentId={isParent ? (selectedStudentId || 'QI-STU-8842') : (user?.id || 'QI-STU-8842')}
                  initialStudentId={isParent ? (selectedStudentId || 'QI-STU-8842') : (user?.id || 'QI-STU-8842')}
                  studentsList={
                    isParent
                      ? [
                          { id: 'QI-STU-8842', studentId: 'QI-STU-8842', name: 'Tariq Al-Mansoor (Child)', courseId: 'QI-CRS-001', courseTitle: 'Quran Reading Foundation & Tajweed Mastery' },
                          { id: 'QI-STU-7721', studentId: 'QI-STU-7721', name: 'Zaid bin Harith (Child)', courseId: 'QI-CRS-001', courseTitle: 'Quran Reading Foundation & Tajweed Mastery' },
                        ]
                      : [{ id: user?.id || 'QI-STU-8842', studentId: user?.id || 'QI-STU-8842', name: user?.name || 'Tariq Al-Mansoor', courseId: course?.id || 'QI-CRS-001', courseTitle: course?.title || 'Quran Reading Foundation & Tajweed Mastery' }]
                  }
                  onSelectStudent={(stuId) => setSelectedStudentId(stuId)}
                  course={course}
                  coursesList={coursesList}
                />
              )}

              {activeTab === 'quiz' && (
                <CourseQuizEngine
                  course={course}
                  enrollment={enrollment}
                  activeModuleId={activeQuizModuleId}
                  onQuizSubmitted={fetchDashboardData}
                  onBackToCurriculum={() => handleTabChange('curriculum')}
                />
              )}

              {activeTab === 'catalog' && (
                <CourseEnrollmentCatalog
                  course={course || coursesList[0]}
                  courses={coursesList}
                  coursesList={coursesList}
                  teachers={teachers}
                  currentUser={user}
                  currentEnrollment={enrollment}
                  onSelectCourse={(c) => {
                    setCourse(c);
                    setSelectedCourseId(c.id);
                  }}
                  onEnrollSuccess={handleEnrollSuccess}
                />
              )}
            </>
          )}

          {/* TUITION & INVOICES TAB (Dedicated Page View - Not a modal) */}
          {activeTab === 'invoices' && (
            <TuitionInvoicesPageView currentUser={user} />
          )}

          {/* TAJWEED TOOLS TAB (Dedicated Page View - Not a modal) */}
          {activeTab === 'dictionary' && (
            <TajweedToolsPageView
              currentUser={user}
              onNavigateTab={handleTabChange}
            />
          )}

          {/* PROFILE TAB (Available for all roles) */}
          {activeTab === 'profile' && (
            <UserProfilePanel
              user={user}
              enrollment={enrollment}
              course={course}
              onProfileUpdated={(updatedUser) => setUser(updatedUser)}
              onUnenrollSuccess={handleUnenrollSuccess}
              onNavigateToCatalog={() => handleTabChange('catalog')}
            />
          )}
          </div>
        </main>
      </div>

      {/* Global Modals */}
      <ParentTeacherReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          if (activeTab === 'reviews') handleTabChange('progress');
        }}
        teacherId={reviewTeacherInfo.id}
        teacherName={reviewTeacherInfo.name}
        studentId={reviewTeacherInfo.studentId}
        onReviewSubmitted={() => {
          fetchDashboardData();
        }}
      />
    </div>
  );
}
