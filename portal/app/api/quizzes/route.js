import { NextResponse } from 'next/server';
import { getSessionCookie } from '../../../lib/auth';
import { getQuizByModuleId, submitQuizAnswers } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');

    if (!moduleId) {
      return NextResponse.json({ error: 'Module ID is required.' }, { status: 400 });
    }

    const quiz = getQuizByModuleId(moduleId);
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found for this module.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, quiz });
  } catch (error) {
    console.error('Quiz GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch quiz.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = getSessionCookie();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();
    const { enrollmentId, quizId, answers } = body;

    if (!enrollmentId || !quizId || !answers) {
      return NextResponse.json(
        { error: 'Enrollment ID, Quiz ID, and answers array are required.' },
        { status: 400 }
      );
    }

    const result = submitQuizAnswers(enrollmentId, quizId, answers);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Quiz POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit quiz.' }, { status: 500 });
  }
}
