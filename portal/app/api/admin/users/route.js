import { NextResponse } from 'next/server';
import { getSessionCookie } from '../../../../lib/auth';
import {
  getAllUsers,
  getInstituteStats,
  toggleUserStatus,
  approveTeacher,
  rejectTeacher,
  findUserById,
} from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = getSessionCookie();
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Access restricted to System Administrators only.' },
        { status: 403 }
      );
    }

    const stats = getInstituteStats();
    const users = getAllUsers();

    return NextResponse.json({
      success: true,
      stats,
      users,
      adminInfo: {
        id: session.userId,
        name: session.name,
        role: session.role,
      },
    });
  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json(
      { error: 'Internal server error while loading admin records.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const session = getSessionCookie();
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Access restricted to System Administrators only.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, action } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    if (action === 'approve_teacher') {
      const updatedUser = approveTeacher(userId);
      return NextResponse.json({
        success: true,
        message: `Successfully verified and approved scholar: ${updatedUser.name}! They may now access faculty tools.`,
        user: updatedUser,
      });
    }

    if (action === 'reject_teacher') {
      const updatedUser = rejectTeacher(userId);
      return NextResponse.json({
        success: true,
        message: `Scholar application for ${updatedUser.name} has been rejected.`,
        user: updatedUser,
      });
    }

    if (action === 'toggle_status') {
      const updatedUser = toggleUserStatus(userId);
      return NextResponse.json({
        success: true,
        message: `Updated status for ${updatedUser.name}`,
        user: updatedUser,
      });
    }

    return NextResponse.json({ error: 'Unsupported admin action.' }, { status: 400 });
  } catch (error) {
    console.error('Admin PATCH error:', error);
    return NextResponse.json(
      { error: error.message || 'Error updating user record.' },
      { status: 500 }
    );
  }
}
