import { NextResponse } from 'next/server';
import { getSessionCookie } from '../../../lib/auth';
import {
  getEnrollmentsForStudent,
  getEnrollmentsForTeacher,
  enrollStudentInCourse,
  unenrollStudentFromCourse,
  markLessonCompleted,
  updateEnrollmentNotes,
} from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const session = getSessionCookie();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');
    const studentId = searchParams.get('studentId');

    let enrollments = [];
    if (session.role === 'teacher' || teacherId) {
      enrollments = getEnrollmentsForTeacher(teacherId || session.userId);
    } else {
      enrollments = getEnrollmentsForStudent(studentId || session.userId);
    }

    return NextResponse.json({ success: true, enrollments });
  } catch (error) {
    console.error('Enrollments GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch enrollments.' }, { status: 500 });
  }
}

// Student enrolls in course with a teacher
export async function POST(request) {
  try {
    const session = getSessionCookie();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();
    const { courseId, teacherId } = body;

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required.' }, { status: 400 });
    }

    const studentId = session.role === 'student' ? session.userId : body.studentId;
    const enrollment = enrollStudentInCourse(studentId, courseId, teacherId);

    return NextResponse.json({ success: true, enrollment });
  } catch (error) {
    console.error('Enrollment POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to enroll.' }, { status: 500 });
  }
}

// Mark or toggle a lesson as completed, or update teacher notes
export async function PATCH(request) {
  try {
    const session = getSessionCookie();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();
    const { enrollmentId, lessonId, action, notes } = body;

    if (!enrollmentId) {
      return NextResponse.json({ error: 'Enrollment ID is required.' }, { status: 400 });
    }

    if (notes !== undefined) {
      const updated = updateEnrollmentNotes(enrollmentId, notes);
      return NextResponse.json({ success: true, enrollment: updated });
    }

    if (!lessonId) {
      return NextResponse.json({ error: 'Lesson ID is required.' }, { status: 400 });
    }

    const updated = markLessonCompleted(enrollmentId, lessonId, action || 'complete');
    return NextResponse.json({ success: true, enrollment: updated });
  } catch (error) {
    console.error('Lesson completion error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update enrollment.' }, { status: 500 });
  }
}

// Student can withdraw / unenroll from a course
export async function DELETE(request) {
  try {
    const session = getSessionCookie();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const studentId = session.role === 'student' ? session.userId : searchParams.get('studentId');

    const removed = unenrollStudentFromCourse(studentId, courseId);
    return NextResponse.json({ success: true, removed });
  } catch (error) {
    console.error('Enrollment DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Failed to unenroll.' }, { status: 500 });
  }
}
