import { NextResponse } from 'next/server';
import { getDictionaryEntries } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';
    const search = searchParams.get('search') || '';

    const entries = getDictionaryEntries(category, search);
    return NextResponse.json({ success: true, entries, count: entries.length });
  } catch (error) {
    console.error('Dictionary GET error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch dictionary entries.' },
      { status: 500 }
    );
  }
}
