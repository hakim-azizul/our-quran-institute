import { NextResponse } from 'next/server';
import { getSessionCookie } from '../../../lib/auth';
import {
  getAllInvoices,
  getInvoicesForUser,
  markInvoicePaid,
  getAllTeacherSalaries,
  getTeacherSalary,
  getFinancialAnalytics,
} from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const session = getSessionCookie();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'invoices' | 'salary' | 'analytics'

    // If teacher requesting salary
    if (session?.role === 'teacher' || type === 'salary') {
      const teacherId = searchParams.get('teacherId') || session?.userId;
      const salary = getTeacherSalary(teacherId);
      const allSalaries = session?.role === 'admin' ? getAllTeacherSalaries() : [];
      return NextResponse.json({ success: true, salary, allSalaries });
    }

    // If admin requesting analytics
    if (session?.role === 'admin' && type === 'analytics') {
      const analytics = getFinancialAnalytics();
      return NextResponse.json({ success: true, analytics });
    }

    // Default: fetch invoices for current user (parent or student or admin)
    if (session?.role === 'admin') {
      const allInvoices = getAllInvoices();
      return NextResponse.json({ success: true, invoices: allInvoices });
    }

    if (session) {
      const userInvoices = getInvoicesForUser(session.userId, session.role);
      return NextResponse.json({ success: true, invoices: userInvoices });
    }

    // Fallback demo for parent
    const demoInvoices = getInvoicesForUser('QI-PAR-101', 'parent');
    return NextResponse.json({ success: true, invoices: demoInvoices });
  } catch (error) {
    console.error('Finance GET error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch financial records.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = getSessionCookie();
    const body = await request.json();
    const { action, invoiceId, paymentMethod, transactionId } = body;

    if (action === 'pay_invoice') {
      if (!invoiceId) {
        return NextResponse.json({ error: 'Invoice ID is required.' }, { status: 400 });
      }

      const updated = markInvoicePaid(
        invoiceId,
        paymentMethod || 'bKash Merchant Pay',
        transactionId
      );

      return NextResponse.json({
        success: true,
        message: `Payment of $${updated.amount} successfully processed for invoice ${updated.id}!`,
        invoice: updated,
      });
    }

    return NextResponse.json({ error: 'Unsupported financial action.' }, { status: 400 });
  } catch (error) {
    console.error('Finance POST error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment processing error.' },
      { status: 500 }
    );
  }
}
