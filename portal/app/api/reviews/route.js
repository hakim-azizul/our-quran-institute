import { NextResponse } from 'next/server';
import { getSessionCookie } from '../../../lib/auth';
import {
  submitTeacherReview,
  getReviewsForTeacher,
  getAllReviews,
} from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');

    if (teacherId) {
      const teacherReviews = getReviewsForTeacher(teacherId);
      return NextResponse.json({ success: true, reviews: teacherReviews });
    }

    const all = getAllReviews();
    return NextResponse.json({ success: true, reviews: all });
  } catch (error) {
    console.error('Reviews GET error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch reviews.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = getSessionCookie();
    const body = await request.json();
    const { teacherId, parentId, studentId, rating, categories, reviewText, month } = body;

    if (!teacherId) {
      return NextResponse.json({ error: 'Teacher ID is required.' }, { status: 400 });
    }

    const resolvedParentId = parentId || (session?.role === 'parent' ? session.userId : 'QI-PAR-101');
    const newReview = submitTeacherReview({
      teacherId,
      parentId: resolvedParentId,
      studentId,
      rating: rating || 5,
      categories,
      reviewText,
      month: month || 'October 2026',
    });

    return NextResponse.json({
      success: true,
      message: `Your review and 5-star rating for ${newReview.teacherName} has been submitted!`,
      review: newReview,
    });
  } catch (error) {
    console.error('Reviews POST error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit review.' },
      { status: 500 }
    );
  }
}
