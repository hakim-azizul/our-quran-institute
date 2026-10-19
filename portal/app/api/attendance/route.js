import { NextResponse } from 'next/server';
import { getSessionCookie } from '../../../lib/auth';
import {
  recordAttendance,
  getAttendanceForStudent,
  getAttendanceForTeacher,
  getInstituteAttendanceAnalytics,
} from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const session = getSessionCookie();
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId') || (session?.role === 'student' ? session.userId : null);
    const teacherId = searchParams.get('teacherId') || (session?.role === 'teacher' ? session.userId : null);
    const date = searchParams.get('date');
    const analytics = searchParams.get('analytics');

    if (analytics === 'true') {
      const data = getInstituteAttendanceAnalytics();
      return NextResponse.json({ success: true, analytics: data });
    }

    if (studentId) {
      const records = getAttendanceForStudent(studentId);
      return NextResponse.json({ success: true, attendance: records });
    }

    if (teacherId) {
      const records = getAttendanceForTeacher(teacherId, date);
      return NextResponse.json({ success: true, attendance: records });
    }

    const allAnalytics = getInstituteAttendanceAnalytics();
    return NextResponse.json({ success: true, ...allAnalytics });
  } catch (error) {
    console.error('Attendance GET error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch attendance.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = getSessionCookie();
    if (!session || (session.role !== 'teacher' && session.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Unauthorized: Only faculty scholars or administrators can record attendance.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { studentId, teacherId, status, date, note } = body;

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required.' }, { status: 400 });
    }

    const resolvedTeacherId = teacherId || session.userId;
    const record = recordAttendance({
      studentId,
      teacherId: resolvedTeacherId,
      status: status || 'present',
      date: date || new Date().toISOString().split('T')[0],
      note: note || '',
    });

    return NextResponse.json({
      success: true,
      message: `Marked ${record.studentName} as ${record.status.toUpperCase()}!`,
      record,
    });
  } catch (error) {
    console.error('Attendance POST error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to record attendance.' },
      { status: 500 }
    );
  }
}
