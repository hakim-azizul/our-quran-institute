import { NextResponse } from 'next/server';
import { getSessionCookie } from '../../../../lib/auth';
import {
  recordQuranReadingSession,
  getQuranScreenTimeStats,
} from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const session = getSessionCookie();
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId') || (session?.role === 'student' ? session.userId : 'QI-STU-8842');

    const stats = getQuranScreenTimeStats(studentId);
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error('Screen time GET error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch screen time stats.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = getSessionCookie();
    const body = await request.json();
    const { studentId, surahNumber, surahName, durationSeconds } = body;

    const resolvedStudentId = studentId || (session?.role === 'student' ? session.userId : 'QI-STU-8842');
    const sessionRecord = recordQuranReadingSession({
      studentId: resolvedStudentId,
      surahNumber,
      surahName,
      durationSeconds,
    });

    const updatedStats = getQuranScreenTimeStats(resolvedStudentId);

    return NextResponse.json({
      success: true,
      message: `Logged ${Math.round(sessionRecord.durationSeconds / 60)} minutes of Quran reading!`,
      session: sessionRecord,
      stats: updatedStats,
    });
  } catch (error) {
    console.error('Screen time POST error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to log screen time session.' },
      { status: 500 }
    );
  }
}
