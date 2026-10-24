import { NextResponse } from 'next/server';
import { getPublicTeachersList, getTeacherByIdOrSlug, updateUserProfile, getAllTeachers } from '../../../lib/db';
import { getSessionCookie } from '../../../lib/auth';

export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || searchParams.get('slug');

    if (id) {
      const teacher = getTeacherByIdOrSlug(id);
      if (!teacher) {
        return NextResponse.json(
          { success: false, error: 'Teacher not found' },
          { status: 404, headers: corsHeaders }
        );
      }
      return NextResponse.json(
        { success: true, teacher },
        { status: 200, headers: corsHeaders }
      );
    }

    const category = searchParams.get('category') || 'all';
    const search = searchParams.get('search') || '';
    const page = searchParams.get('page') || 1;
    const limit = searchParams.get('limit') || 6;
    const all = searchParams.get('all') === 'true';

    if (all) {
      const allTeachersList = getAllTeachers();
      return NextResponse.json(
        { success: true, teachers: allTeachersList, total: allTeachersList.length },
        { status: 200, headers: corsHeaders }
      );
    }

    const result = getPublicTeachersList({ category, search, page, limit });

    return NextResponse.json(
      { success: true, ...result },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Teachers API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function PATCH(request) {
  try {
    const session = getSessionCookie();
    const body = await request.json();
    const targetUserId = body.userId || (session && session.userId);

    if (!targetUserId) {
      return NextResponse.json(
        { error: 'Unauthorized or target user not specified' },
        { status: 401, headers: corsHeaders }
      );
    }

    const updatedUser = updateUserProfile(targetUserId, body);
    return NextResponse.json(
      { success: true, user: updatedUser },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Teacher profile update error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update teacher profile' },
      { status: 500, headers: corsHeaders }
    );
  }
}
