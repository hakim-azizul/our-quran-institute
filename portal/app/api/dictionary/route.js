import { NextResponse } from 'next/server';
import {
  getDictionaryEntries,
  addDictionaryEntry,
  updateDictionaryEntry,
  deleteDictionaryEntry,
} from '../../../lib/db';

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

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.termArabic || !body.termEnglish) {
      return NextResponse.json(
        { error: 'Arabic term and English title are required.' },
        { status: 400 }
      );
    }
    const created = addDictionaryEntry(body);
    return NextResponse.json({ success: true, entry: created });
  } catch (error) {
    console.error('Dictionary POST error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create Tajweed rule.' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ error: 'Entry ID is required.' }, { status: 400 });
    }
    const updated = updateDictionaryEntry(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Rule not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, entry: updated });
  } catch (error) {
    console.error('Dictionary PUT error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update Tajweed rule.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Entry ID is required.' }, { status: 400 });
    }
    const deleted = deleteDictionaryEntry(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Rule not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Tajweed rule deleted successfully.' });
  } catch (error) {
    console.error('Dictionary DELETE error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete Tajweed rule.' },
      { status: 500 }
    );
  }
}

