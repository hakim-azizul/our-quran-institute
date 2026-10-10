import { NextResponse } from 'next/server';
import { findUserByEmail, createUser } from '../../../../lib/db';
import { createSessionToken, setSessionCookie } from '../../../../lib/auth';

const ALLOWED_ROLES = ['student', 'teacher'];

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      password,
      role = 'student',
      // Student fields
      tajweedLevel,
      targetGoal,
      dailyCommitment,
      // Teacher fields
      sanadCertification,
      specialization,
      yearsExperience,
      qiraat,
    } = body;

    // 1. STRICT SECURITY VALIDATION: Prevent any admin creation via API
    const normalizedRole = typeof role === 'string' ? role.trim().toLowerCase() : '';

    if (normalizedRole === 'admin' || (body.role && String(body.role).toLowerCase() === 'admin')) {
      return NextResponse.json(
        {
          error:
            'SECURITY POLICY VIOLATION: Admin accounts cannot be created via the public registration API. System Administrators are strictly provisioned directly through database configuration.',
          code: 'ADMIN_REGISTRATION_FORBIDDEN',
        },
        { status: 403 }
      );
    }

    // 2. Validate allowed roles (Only Student and Teacher are allowed)
    if (!ALLOWED_ROLES.includes(normalizedRole)) {
      return NextResponse.json(
        {
          error: 'Registration is exclusively open for Students and Teachers/Scholars.',
          allowedRoles: ALLOWED_ROLES,
        },
        { status: 400 }
      );
    }

    // 3. Basic credentials validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Full name, email address, and password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // 4. Duplicate email verification
    const existing = findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email address already exists. Please log in.' },
        { status: 409 }
      );
    }

    // 5. Assemble safe payload based on student or teacher role
    const newUserData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: normalizedRole,
      ...(normalizedRole === 'student' && {
        tajweedLevel: tajweedLevel || 'Beginner (Learning letters and Noorani Qaida)',
        targetGoal: targetGoal || 'Hifz Memorization & Sanad',
        dailyCommitment: dailyCommitment || '30-45 minutes / day',
        mentor: 'Pending Scholar Assignment',
        nextSession: 'Orientation Call with Academic Advisor (Upcoming)',
        memorizedJuz: 0,
        totalJuz: 30,
      }),
      ...(normalizedRole === 'teacher' && {
        sanadCertification: sanadCertification || 'Verified Ijazah with Connected Sanad',
        specialization: specialization || 'Tajweed & Qira’at',
        yearsExperience: yearsExperience || '3+ years',
        qiraat: qiraat || 'Hafs ‘an ‘Asim',
        studentsCount: 0,
        nextSession: 'Faculty Onboarding Interview (Upcoming)',
      }),
    };

    const createdUser = createUser(newUserData);
    const { password: _, ...userSafe } = createdUser;

    // Teachers must be approved by an Administrator before they can log in or access the portal
    if (normalizedRole === 'teacher') {
      return NextResponse.json({
        success: true,
        pendingApproval: true,
        message:
          'Faculty scholar registration submitted! Your account is currently pending credential and Sanad verification by Institute Administrators. You will receive access once approved.',
        user: userSafe,
        redirectUrl: '/login?pendingApproval=true',
      });
    }

    // Students receive instant session token
    const token = createSessionToken(createdUser);
    const response = NextResponse.json({
      success: true,
      message: 'Student account registered successfully! Opening your sanctuary workspace...',
      user: userSafe,
      redirectUrl: '/dashboard',
    });

    setSessionCookie(response, token);
    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error while registering account.' },
      { status: 500 }
    );
  }
}
