import { NextResponse } from 'next/server';
import { getSessionCookie } from '../../../../lib/auth';
import { findUserById, updateUserProfile } from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = getSessionCookie();
    if (!session || !session.userId) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const user = findUserById(session.userId);
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const { password: _, ...userSafe } = user;
    return NextResponse.json({ authenticated: true, user: userSafe });
  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const session = getSessionCookie();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();
    const updatedUser = updateUserProfile(session.userId, body);
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update profile.' }, { status: 500 });
  }
}
