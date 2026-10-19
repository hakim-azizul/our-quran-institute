import { NextResponse } from 'next/server';
import { getSessionCookie } from '../../../lib/auth';
import {
  recordDailyProgress,
  getDailyProgressForStudent,
  getDailyProgressForTeacher,
  findUserById,
} from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const session = getSessionCookie();
    const { searchParams } = new URL(request.url);
    let studentId = searchParams.get('studentId');
    const teacherId = searchParams.get('teacherId');

    // If student or parent requesting without query param
    if (!studentId && session?.role === 'student') {
      studentId = session.userId;
    } else if (!studentId && session?.role === 'parent') {
      const parent = findUserById(session.userId);
      studentId = parent?.childrenIds?.[0] || 'QI-STU-8842';
    }

    if (studentId) {
      const logs = getDailyProgressForStudent(studentId);
      return NextResponse.json({ success: true, progressLogs: logs });
    }

    if (teacherId || session?.role === 'teacher') {
      const tId = teacherId || session.userId;
      const logs = getDailyProgressForTeacher(tId);
      return NextResponse.json({ success: true, progressLogs: logs });
    }

    return NextResponse.json({ success: true, progressLogs: [] });
  } catch (error) {
    console.error('Progress GET error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch progress logs.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = getSessionCookie();
    if (!session || (session.role !== 'teacher' && session.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Unauthorized: Only faculty scholars or administrators can log daily progress.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { studentId, teacherId, date, sabaq, sabqi, manzil, tarbiyah, teacherFeedback } = body;

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required.' }, { status: 400 });
    }

    const resolvedTeacherId = teacherId || session.userId;
    const entry = recordDailyProgress({
      studentId,
      teacherId: resolvedTeacherId,
      date,
      sabaq,
      sabqi,
      manzil,
      tarbiyah,
      teacherFeedback,
    });

    return NextResponse.json({
      success: true,
      message: `Daily Sabaq & Tarbiyah record logged successfully for ${entry.studentName}!`,
      entry,
    });
  } catch (error) {
    console.error('Progress POST error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to record daily progress.' },
      { status: 500 }
    );
  }
}
