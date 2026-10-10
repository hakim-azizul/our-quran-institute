import { NextResponse } from 'next/server';
import { getSessionCookie } from '../../../../lib/auth';
import {
  getMistakesForStudent,
  addStudentMistake,
  resolveStudentMistake,
  deleteStudentMistake,
} from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const session = getSessionCookie();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const requestedStudentId = searchParams.get('studentId') || session.userId;

    const mistakes = getMistakesForStudent(requestedStudentId);
    return NextResponse.json({ success: true, mistakes });
  } catch (error) {
    console.error('Mistakes GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch student mistake records.' }, { status: 500 });
  }
}

// Teacher adds a mistake flag on a specific Ayah/Word for a student
export async function POST(request) {
  try {
    const session = getSessionCookie();
    if (!session || (session.role !== 'teacher' && session.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Forbidden: Only certified Teachers and Admins can annotate recitation mistakes.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      studentId,
      surahNumber,
      ayahNumber,
      wordIndex,
      wordText,
      mistakeCategory,
      categoryLabel,
      severity,
      correctionNote,
    } = body;

    if (!studentId || !surahNumber || !ayahNumber) {
      return NextResponse.json(
        { error: 'Student ID, Surah number, and Ayah number are required.' },
        { status: 400 }
      );
    }

    const newMistake = addStudentMistake({
      studentId,
      teacherId: session.userId,
      surahNumber,
      ayahNumber,
      wordIndex,
      wordText,
      mistakeCategory,
      categoryLabel,
      severity,
      correctionNote,
    });

    return NextResponse.json({ success: true, mistake: newMistake });
  } catch (error) {
    console.error('Mistake POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to add mistake note.' }, { status: 500 });
  }
}

// Teacher resolves/clears a mistake after student corrects it
export async function PATCH(request) {
  try {
    const session = getSessionCookie();
    if (!session || (session.role !== 'teacher' && session.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Forbidden: Only certified Teachers can resolve or clear mistake flags.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { mistakeId, resolutionNote } = body;

    if (!mistakeId) {
      return NextResponse.json({ error: 'Mistake ID is required.' }, { status: 400 });
    }

    const resolved = resolveStudentMistake(mistakeId, session.userId, resolutionNote);
    return NextResponse.json({ success: true, mistake: resolved });
  } catch (error) {
    console.error('Mistake PATCH error:', error);
    return NextResponse.json({ error: error.message || 'Failed to resolve mistake.' }, { status: 500 });
  }
}

// Teacher deletes/withdraws a mistake flag completely
export async function DELETE(request) {
  try {
    const session = getSessionCookie();
    if (!session || (session.role !== 'teacher' && session.role !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const mistakeId = searchParams.get('id');

    if (!mistakeId) {
      return NextResponse.json({ error: 'Mistake ID is required.' }, { status: 400 });
    }

    const deleted = deleteStudentMistake(mistakeId);
    return NextResponse.json({ success: true, mistake: deleted });
  } catch (error) {
    console.error('Mistake DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete mistake.' }, { status: 500 });
  }
}
