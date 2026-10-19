import { NextResponse } from 'next/server';
import { getSessionCookie } from '../../../lib/auth';
import { getAllCourses, createCourse, getAllTeachers } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const courses = getAllCourses();
    const teachers = getAllTeachers();
    return NextResponse.json({ success: true, courses, teachers });
  } catch (error) {
    console.error('Courses GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch courses.' }, { status: 500 });
  }
}

// Only Admin can add a new course
export async function POST(request) {
  try {
    const session = getSessionCookie();
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Only Institute Administrators can create and provision new courses.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    if (!body.title) {
      return NextResponse.json({ error: 'Course title is required.' }, { status: 400 });
    }

    const newCourse = createCourse(body, session.userId);
    return NextResponse.json({ success: true, course: newCourse });
  } catch (error) {
    console.error('Course creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create course.' }, { status: 500 });
  }
}
