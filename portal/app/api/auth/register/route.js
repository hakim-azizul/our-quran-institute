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
    const normalizedRole = typeof role === 'string' ? role.trim().toLowerCase() : 'student';

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

    // 2. Validate allowed roles (Student or Teacher)
    if (!ALLOWED_ROLES.includes(normalizedRole)) {
      return NextResponse.json(
        {
          error: 'Registration is open for Students and Teachers/Scholars.',
          allowedRoles: ALLOWED_ROLES,
        },
        { status: 400 }
      );
    }

    // 3. Basic credentials validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Full name, email or phone number, and password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    let cleanEmail = String(email || '').trim().toLowerCase();
    let cleanPhone = String(body.phone || '').trim();

    // EDGE CASE: User entered a mobile phone number into the email field (e.g. 01784413139)
    if (!cleanEmail.includes('@')) {
      const digitsOnly = cleanEmail.replace(/[^0-9]/g, '');
      if (digitsOnly.length >= 8) {
        if (!cleanPhone) cleanPhone = cleanEmail;
        cleanEmail = `${digitsOnly}@phone.ourquran.org`;
      }
    }

    // 4. Duplicate email / phone verification
    const existingByEmail = findUserByEmail(cleanEmail);
    const existingByPhone = cleanPhone ? findUserByEmail(cleanPhone) : null;
    const existing = existingByEmail || existingByPhone;

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email address or phone number already exists. Please Sign In.', code: 'DUPLICATE_USER' },
        { status: 409 }
      );
    }

    // 5. Assemble safe payload based on student or teacher role
    const newUserData = {
      name: name.trim(),
      email: cleanEmail,
      phone: cleanPhone || null,
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
        status: 'Enrolled',
      }),
      ...(normalizedRole === 'teacher' && {
        honorific: body.honorific || (body.division === 'sisters' ? 'الأستاذة' : 'فضيلة الشيخ'),
        title: body.title || `${body.specialization || 'Quran & Tajweed'} Instructor`,
        division: body.division || 'brothers',
        category: body.category || 'tajweed',
        credentials: body.credentials || 'Al-Azhar / Islamic University Accreditation',
        sanad: body.sanad || body.sanadCertification || 'Verified Ijazah with Connected Sanad',
        sanadCertification: body.sanad || body.sanadCertification || 'Verified Ijazah with Connected Sanad',
        specialization: body.specialization || 'Tajweed & Qira’at',
        yearsExperience: body.yearsExperience || '3+ years',
        experience: body.yearsExperience || '3+ years',
        ratePerClass: Number(body.ratePerClass) || 25,
        hourlyRate: Number(body.ratePerClass) || 25,
        studentsCount: 0,
        status: 'Pending Credential Verification',
        bio: body.bio || `${name} has applied as a faculty scholar for our Quranic Recitations department.`,
        specialties: body.specialties || [body.specialization || 'Tajweed Rules', 'Hifz'],
        certificates: body.certificates || [],
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
          'Faculty application submitted successfully! Your credentials are under review by the Academic Affairs committee. You will be able to log in once approved.',
        user: userSafe,
        redirectUrl: '/login?pendingApproval=true',
      });
    }

    // Students receive instant session token
    const token = createSessionToken(createdUser);
    const response = NextResponse.json({
      success: true,
      message: 'Student account registered successfully! Opening your dashboard...',
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
