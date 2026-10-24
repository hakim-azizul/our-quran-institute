import { NextResponse } from 'next/server';
import { TEACHERS_DATA } from '../../../src/data/teachersData';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString();
  const portalBase = process.env.NEXT_PUBLIC_PORTAL_URL || process.env.PORTAL_URL || 'http://localhost:3001';
  const portalUrl = `${portalBase}/api/teachers${queryString ? '?' + queryString : ''}`;

  try {
    const res = await fetch(portalUrl, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' },
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch (err) {
    // Portal dev server might be on another port or starting up; proceed to graceful fallback
  }

  // Graceful fallback using local TEACHERS_DATA
  const id = searchParams.get('id') || searchParams.get('slug');
  if (id) {
    const normalized = String(id).toLowerCase().trim();
    const teacher = TEACHERS_DATA.find(
      (t) =>
        t.id.toLowerCase() === normalized ||
        t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalized
    );
    if (teacher) {
      return NextResponse.json({ success: true, teacher });
    }
    return NextResponse.json({ success: false, error: 'Teacher not found' }, { status: 404 });
  }

  const category = searchParams.get('category') || 'all';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '6', 10);

  let list = [...TEACHERS_DATA];
  if (category && category !== 'all') {
    if (category === 'sisters') {
      list = list.filter((t) => t.division === 'sisters' || t.category === 'sisters');
    } else {
      list = list.filter((t) => t.category === category);
    }
  }

  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    list = list.filter((t) =>
      t.name.toLowerCase().includes(q) ||
      (t.credentials && t.credentials.toLowerCase().includes(q)) ||
      (t.sanad && t.sanad.toLowerCase().includes(q)) ||
      (t.specialties && t.specialties.some((s) => s.toLowerCase().includes(q)))
    );
  }

  const total = list.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const offset = (page - 1) * limit;
  const paginated = list.slice(offset, offset + limit);

  return NextResponse.json({
    success: true,
    teachers: paginated,
    total,
    page,
    limit,
    totalPages,
  });
}
