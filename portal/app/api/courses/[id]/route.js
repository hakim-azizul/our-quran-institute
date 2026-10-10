import { NextResponse } from 'next/server';
import { getSessionCookie } from '../../../../lib/auth';
import { getCourseById, updateCourseModule, addCourseModule } from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const course = getCourseById(params.id);
    if (!course) {
      return NextResponse.json({ error: 'Course not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error('Course GET by ID error:', error);
    return NextResponse.json({ error: 'Failed to fetch course details.' }, { status: 500 });
  }
}

// Teacher or Admin updates module / lesson guidelines or adds module
export async function PATCH(request, { params }) {
  try {
    const session = getSessionCookie();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();
    const { moduleId, updatedModuleData, action, newModule } = body;

    if (action === 'add_module') {
      const addedModule = addCourseModule(
        params.id,
        newModule || updatedModuleData || {},
        session.role,
        session.userId
      );
      return NextResponse.json({ success: true, module: addedModule });
    }

    if (!moduleId || !updatedModuleData) {
      return NextResponse.json({ error: 'Module ID and updated data are required.' }, { status: 400 });
    }

    const updatedModule = updateCourseModule(
      params.id,
      moduleId,
      updatedModuleData,
      session.role,
      session.userId
    );

    return NextResponse.json({ success: true, module: updatedModule });
  } catch (error) {
    console.error('Course module update error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update module.' }, { status: 500 });
  }
}
