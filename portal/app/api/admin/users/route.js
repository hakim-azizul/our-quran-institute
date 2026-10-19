import { NextResponse } from 'next/server';
import { getSessionCookie } from '../../../../lib/auth';
import {
  getAllUsers,
  getInstituteStats,
  toggleUserStatus,
  approveUser,
  rejectUser,
  approveTeacher,
  rejectTeacher,
  assignTeacherToStudent,
  getFinancialAnalytics,
  approveTeacherSalary,
  disburseTeacherSalary,
  markInvoicePaid,
  getInstituteAttendanceAnalytics,
  getSystemSettings,
  updateSystemSettings,
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  findUserById,
  updateTeacherClassRate,
  getTeacherSuccessfulClassesData,
} from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const session = getSessionCookie();
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Access restricted to System Administrators only.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'teacher_classes') {
      const targetTeacherId = searchParams.get('teacherId');
      const month = searchParams.get('month') || 'October 2026';
      if (!targetTeacherId) {
        return NextResponse.json({ error: 'teacherId parameter is required.' }, { status: 400 });
      }
      const data = getTeacherSuccessfulClassesData(targetTeacherId, month);
      return NextResponse.json({ success: true, ...data });
    }

    const stats = getInstituteStats();
    const users = getAllUsers();
    const financialAnalytics = getFinancialAnalytics();
    const attendanceAnalytics = getInstituteAttendanceAnalytics();
    const systemSettings = getSystemSettings();
    const announcements = getAnnouncements('all');

    return NextResponse.json({
      success: true,
      stats,
      users,
      financialAnalytics,
      attendanceAnalytics,
      systemSettings,
      announcements,
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
    const { action, userId, studentId, teacherId, salaryId, invoiceId, paymentMethod, transactionId, settings } = body;

    // 1. Teacher & User Approval
    if (action === 'approve_user' || action === 'approve_teacher') {
      const targetId = userId || teacherId || studentId;
      if (!targetId) return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
      const updatedUser = approveUser(targetId);
      return NextResponse.json({
        success: true,
        message: `Successfully verified and approved ${updatedUser.role}: ${updatedUser.name}!`,
        user: updatedUser,
      });
    }

    // 2. Reject User
    if (action === 'reject_user' || action === 'reject_teacher') {
      const targetId = userId || teacherId || studentId;
      if (!targetId) return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
      const updatedUser = rejectUser(targetId);
      return NextResponse.json({
        success: true,
        message: `Application for ${updatedUser.name} has been rejected.`,
        user: updatedUser,
      });
    }

    // 3. Toggle Status (Active / Suspended)
    if (action === 'toggle_status') {
      if (!userId) return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
      const updatedUser = toggleUserStatus(userId);
      return NextResponse.json({
        success: true,
        message: `Updated status for ${updatedUser.name} to ${updatedUser.status}`,
        user: updatedUser,
      });
    }

    // 4. Teacher-Student Pairing Assignment
    if (action === 'assign_teacher') {
      if (!studentId || !teacherId) {
        return NextResponse.json({ error: 'Both studentId and teacherId are required.' }, { status: 400 });
      }
      const result = assignTeacherToStudent(studentId, teacherId);
      return NextResponse.json({
        success: true,
        message: `Successfully assigned scholar ${result.teacher.name} to student ${result.student.name}!`,
        student: result.student,
        teacher: result.teacher,
      });
    }

    // 5. Financial: Approve Teacher Salary
    if (action === 'approve_salary') {
      if (!salaryId) return NextResponse.json({ error: 'salaryId is required.' }, { status: 400 });
      const approvedSalary = approveTeacherSalary(salaryId, session.userId);
      return NextResponse.json({
        success: true,
        message: `Salary of $${approvedSalary.totalPayable} for ${approvedSalary.teacherName} approved!`,
        salary: approvedSalary,
      });
    }

    // 6. Financial: Disburse Teacher Salary
    if (action === 'disburse_salary') {
      if (!salaryId) return NextResponse.json({ error: 'salaryId is required.' }, { status: 400 });
      const disbursedSalary = disburseTeacherSalary(salaryId, session.userId);
      return NextResponse.json({
        success: true,
        message: `Salary of $${disbursedSalary.totalPayable} marked as disbursed to ${disbursedSalary.teacherName}!`,
        salary: disbursedSalary,
      });
    }

    // 7. Financial: Mark Student Tuition Invoice as Paid
    if (action === 'mark_invoice_paid') {
      if (!invoiceId) return NextResponse.json({ error: 'invoiceId is required.' }, { status: 400 });
      const paidInvoice = markInvoicePaid(invoiceId, paymentMethod || 'bKash / Card', transactionId);
      return NextResponse.json({
        success: true,
        message: `Tuition invoice ${paidInvoice.id} for ${paidInvoice.studentName} marked as Paid!`,
        invoice: paidInvoice,
      });
    }

    // 8. System Settings Update
    if (action === 'update_settings') {
      if (!settings || typeof settings !== 'object') {
        return NextResponse.json({ error: 'Settings object is required.' }, { status: 400 });
      }
      const updatedSettings = updateSystemSettings(settings);
      return NextResponse.json({
        success: true,
        message: 'System settings successfully updated.',
        settings: updatedSettings,
      });
    }

    // 9. Set Teacher Per-Class Honorarium Rate & Recalculate Cumulative Payroll
    if (action === 'set_teacher_rate' || action === 'update_teacher_rate') {
      const targetTeacherId = teacherId || userId;
      const { newRate, month } = body;
      if (!targetTeacherId || newRate === undefined) {
        return NextResponse.json({ error: 'Teacher ID and newRate are required.' }, { status: 400 });
      }
      const parsedRate = parseFloat(newRate);
      if (isNaN(parsedRate) || parsedRate <= 0) {
        return NextResponse.json({ error: 'Please enter a valid rate greater than $0.' }, { status: 400 });
      }

      const result = updateTeacherClassRate(targetTeacherId, parsedRate, month);
      return NextResponse.json({
        success: true,
        message: `Per-class rate for ${result.user.name} set to $${parsedRate.toFixed(2)}/class. Cumulative salary recalculated to $${result.salary?.totalPayable?.toFixed(2) || 0} (${result.salary?.totalClassesTaught || 0} classes × $${parsedRate.toFixed(2)}${result.salary?.bonus ? ` + $${result.salary.bonus} bonus` : ''}).`,
        user: result.user,
        salary: result.salary,
      });
    }

    return NextResponse.json({ error: 'Unsupported admin action.' }, { status: 400 });
  } catch (error) {
    console.error('Admin PATCH error:', error);
    return NextResponse.json(
      { error: error.message || 'Error executing administrative action.' },
      { status: 500 }
    );
  }
}

// Admin Broadcast Announcement Dispatch
export async function POST(request) {
  try {
    const session = getSessionCookie();
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Access restricted to System Administrators only.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, arabicTitle, message, targetAudience, priority } = body;

    if (!title || !message) {
      return NextResponse.json(
        { error: 'Title and message are required to broadcast an announcement.' },
        { status: 400 }
      );
    }

    const newAnnouncement = createAnnouncement({
      title,
      arabicTitle,
      message,
      targetAudience: targetAudience || 'all',
      priority: priority || 'normal',
      author: session.name || 'System Director',
    });

    return NextResponse.json({
      success: true,
      message: 'Global announcement broadcasted successfully to all platform dashboards!',
      announcement: newAnnouncement,
    });
  } catch (error) {
    console.error('Admin POST error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to dispatch broadcast announcement.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const session = getSessionCookie();
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Access restricted to System Administrators only.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Announcement ID is required.' }, { status: 400 });
    }

    const removed = deleteAnnouncement(id);
    return NextResponse.json({
      success: true,
      message: 'Announcement removed successfully.',
      announcement: removed,
    });
  } catch (error) {
    console.error('Admin DELETE error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to remove announcement.' },
      { status: 500 }
    );
  }
}
