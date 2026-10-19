import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const portalDir = path.resolve(__dirname, '..');

// Load environment variables from portal/.env.local or portal/.env
if (fs.existsSync(path.join(portalDir, '.env.local'))) {
  dotenv.config({ path: path.join(portalDir, '.env.local') });
} else if (fs.existsSync(path.join(portalDir, '.env'))) {
  dotenv.config({ path: path.join(portalDir, '.env') });
}

const { Client } = pg;

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres.lxazaytwwudocouivoqc:WamyDorms2026@aws-0-eu-west-1.pooler.supabase.com:6543/postgres';

async function runMigration() {
  console.log('===========================================================');
  console.log('  OUR QURAN INSTITUTE - SUPABASE DATABASE MIGRATION RUNNER');
  console.log('===========================================================');
  console.log(`Connecting to database...`);
  console.log(`Endpoint: ${connectionString.split('@')[1] || connectionString}`);

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    await client.connect();
    console.log('✅ Connection established successfully.\n');

    // 1. Run Schema DDL
    console.log('--- Step 1: Executing Schema DDL ---');
    const schemaSqlPath = path.join(portalDir, 'migrations', '001_initial_schema.sql');
    const schemaSql = fs.readFileSync(schemaSqlPath, 'utf8');
    await client.query(schemaSql);
    console.log('✅ Schema migration executed successfully: All 14 tables created / verified.\n');

    // 2. Import Seed Data from db.js
    console.log('--- Step 2: Seeding Initial Datasets ---');
    const dbModule = await import('../lib/db.js');

    // Users
    const users = globalThis.__QURAN_USERS__ || (dbModule.getAllUsers ? dbModule.getAllUsers() : []);
    for (const u of users) {
      const userPassword = u.password || (u.role === 'admin' ? 'admin123' : 'password123');
      await client.query(
        `INSERT INTO users (
          id, name, email, password, role, title, department, avatar, status,
          registered_at, permissions, is_database_provisioned_only, sanad_certification,
          specialization, years_experience, rate_per_class, hourly_rate, total_classes_taught,
          all_time_successful_classes, students_count, next_session, assigned_teacher_id,
          mentor, parent_id, parent_name, memorized_juz, total_juz, children_ids, phone
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9,
          $10, $11, $12, $13,
          $14, $15, $16, $17, $18,
          $19, $20, $21, $22,
          $23, $24, $25, $26, $27, $28, $29
        ) ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          email = EXCLUDED.email,
          password = EXCLUDED.password,
          role = EXCLUDED.role,
          status = EXCLUDED.status,
          updated_at = NOW();`,
        [
          u.id,
          u.name,
          u.email,
          userPassword,
          u.role,
          u.title || null,
          u.department || null,
          u.avatar || null,
          u.status || 'Active',
          u.registeredAt || new Date().toISOString(),
          JSON.stringify(u.permissions || []),
          !!u.isDatabaseProvisionedOnly,
          u.sanadCertification || null,
          u.specialization || null,
          u.yearsExperience || null,
          u.ratePerClass || u.hourlyRate || 0,
          u.hourlyRate || u.ratePerClass || 0,
          u.totalClassesTaught || 0,
          u.allTimeSuccessfulClasses || 0,
          u.studentsCount || 0,
          u.nextSession || null,
          u.assignedTeacherId || null,
          u.mentor || null,
          u.parentId || null,
          u.parentName || null,
          u.memorizedJuz || 0,
          u.totalJuz || 30,
          JSON.stringify(u.childrenIds || []),
          u.phone || null,
        ]
      );
    }
    console.log(`✅ Seeded ${users.length} users into 'users' table.`);

    // Courses
    const courses = dbModule.getAllCourses ? dbModule.getAllCourses() : [];
    for (const c of courses) {
      await client.query(
        `INSERT INTO courses (
          id, title, arabic_title, slug, category, level, author_id,
          assigned_teacher_id, teacher_name, thumbnail, description,
          total_duration, passing_grade, status, modules
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11,
          $12, $13, $14, $15
        ) ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          modules = EXCLUDED.modules,
          updated_at = NOW();`,
        [
          c.id,
          c.title,
          c.arabicTitle || null,
          c.slug,
          c.category || 'quran',
          c.level || null,
          c.authorId || null,
          c.assignedTeacherId || null,
          c.teacherName || null,
          c.thumbnail || null,
          c.description || null,
          c.totalDuration || null,
          c.passingGrade || 80,
          c.status || 'published',
          JSON.stringify(c.modules || []),
        ]
      );
    }
    console.log(`✅ Seeded ${courses.length} courses into 'courses' table.`);

    // Quizzes
    const initialQuizzes = globalThis.__QURAN_QUIZZES__ || [];
    for (const q of initialQuizzes) {
      await client.query(
        `INSERT INTO quizzes (
          id, module_id, title, time_limit_minutes, passing_score, questions
        ) VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          questions = EXCLUDED.questions;`,
        [
          q.id,
          q.moduleId || null,
          q.title,
          q.timeLimitMinutes || 15,
          q.passingScore || 80,
          JSON.stringify(q.questions || []),
        ]
      );
    }
    console.log(`✅ Seeded ${initialQuizzes.length} quizzes into 'quizzes' table.`);

    // Enrollments
    const enrollments = globalThis.__QURAN_ENROLLMENTS__ || [];
    for (const e of enrollments) {
      await client.query(
        `INSERT INTO enrollments (
          id, student_id, student_name, course_id, teacher_id, teacher_name,
          enrolled_at, progress_percent, completed_lessons, completed_quizzes, status, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (id) DO NOTHING;`,
        [
          e.id,
          e.studentId,
          e.studentName || null,
          e.courseId,
          e.teacherId || null,
          e.teacherName || null,
          e.enrolledAt || new Date().toISOString(),
          e.progressPercent || 0,
          JSON.stringify(e.completedLessons || []),
          JSON.stringify(e.completedQuizzes || []),
          e.status || 'active',
          e.notes || null,
        ]
      );
    }
    console.log(`✅ Seeded ${enrollments.length} enrollments into 'enrollments' table.`);

    // Student Mistakes
    const mistakes = globalThis.__QURAN_MISTAKES__ || [];
    for (const m of mistakes) {
      await client.query(
        `INSERT INTO student_mistakes (
          id, student_id, student_name, course_id, teacher_id, teacher_name,
          surah_number, surah_name, ayah_number, word_index, word_text,
          mistake_category, category_label, severity, correction_note, status,
          flagged_at, resolved_at, resolved_note
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        ON CONFLICT (id) DO NOTHING;`,
        [
          m.id,
          m.studentId,
          m.studentName || null,
          m.courseId || 'QI-CRS-001',
          m.teacherId || null,
          m.teacherName || null,
          m.surahNumber,
          m.surahName,
          m.ayahNumber,
          m.wordIndex,
          m.wordText,
          m.mistakeCategory,
          m.categoryLabel || null,
          m.severity || 'minor',
          m.correctionNote || null,
          m.status || 'active',
          m.flaggedAt || new Date().toISOString(),
          m.resolvedAt || null,
          m.resolvedNote || null,
        ]
      );
    }
    console.log(`✅ Seeded ${mistakes.length} mistake annotations into 'student_mistakes' table.`);

    // Attendance
    const attendance = globalThis.__QURAN_ATTENDANCE__ || [];
    for (const a of attendance) {
      await client.query(
        `INSERT INTO attendance (
          id, student_id, student_name, teacher_id, teacher_name, course_id, date, status, note, timestamp
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO NOTHING;`,
        [
          a.id,
          a.studentId,
          a.studentName || null,
          a.teacherId,
          a.teacherName || null,
          a.courseId || 'QI-CRS-001',
          a.date,
          a.status || 'present',
          a.note || null,
          a.timestamp || new Date().toISOString(),
        ]
      );
    }
    console.log(`✅ Seeded ${attendance.length} attendance records into 'attendance' table.`);

    // Daily Progress
    const dailyProgress = globalThis.__QURAN_DAILY_PROGRESS__ || [];
    for (const dp of dailyProgress) {
      await client.query(
        `INSERT INTO daily_progress (
          id, student_id, student_name, teacher_id, teacher_name, date,
          sabaq, sabqi, manzil, tarbiyah, teacher_feedback, timestamp
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (id) DO NOTHING;`,
        [
          dp.id,
          dp.studentId,
          dp.studentName || null,
          dp.teacherId || null,
          dp.teacherName || null,
          dp.date,
          JSON.stringify(dp.sabaq || {}),
          JSON.stringify(dp.sabqi || {}),
          dp.manzil || null,
          JSON.stringify(dp.tarbiyah || {}),
          dp.teacherFeedback || null,
          dp.timestamp || new Date().toISOString(),
        ]
      );
    }
    console.log(`✅ Seeded ${dailyProgress.length} daily progress records into 'daily_progress' table.`);

    // Screen Time Records
    const screenTime = globalThis.__QURAN_SCREENTIME__ || [];
    for (const st of screenTime) {
      await client.query(
        `INSERT INTO screen_time_records (
          id, student_id, surah_number, surah_name, duration_seconds, date, timestamp
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO NOTHING;`,
        [
          st.id,
          st.studentId,
          st.surahNumber,
          st.surahName,
          st.durationSeconds || 0,
          st.date,
          st.timestamp || new Date().toISOString(),
        ]
      );
    }
    console.log(`✅ Seeded ${screenTime.length} screen time records into 'screen_time_records' table.`);

    // Reviews
    const reviews = globalThis.__QURAN_REVIEWS__ || [];
    for (const r of reviews) {
      await client.query(
        `INSERT INTO reviews (
          id, teacher_id, teacher_name, student_id, student_name, parent_id, parent_name,
          reviewer_role, rating, comment, date, timestamp
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (id) DO NOTHING;`,
        [
          r.id,
          r.teacherId,
          r.teacherName || null,
          r.studentId || null,
          r.studentName || null,
          r.parentId || null,
          r.parentName || null,
          r.reviewerRole || 'student',
          r.rating || 5.0,
          r.comment || null,
          r.date || null,
          r.timestamp || new Date().toISOString(),
        ]
      );
    }
    console.log(`✅ Seeded ${reviews.length} reviews into 'reviews' table.`);

    // Invoices
    const invoices = globalThis.__QURAN_INVOICES__ || [];
    for (const inv of invoices) {
      await client.query(
        `INSERT INTO invoices (
          id, invoice_number, student_id, student_name, parent_id, parent_name,
          month, amount_usd, amount_bdt, currency, status, payment_method,
          transaction_id, due_date, paid_at, items
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        ON CONFLICT (id) DO NOTHING;`,
        [
          inv.id,
          inv.invoiceNumber || inv.id,
          inv.studentId || null,
          inv.studentName || null,
          inv.parentId || null,
          inv.parentName || null,
          inv.month || null,
          inv.amountUSD || inv.amount || 0,
          inv.amountBDT || 0,
          inv.currency || 'USD',
          inv.status || 'Pending',
          inv.paymentMethod || null,
          inv.transactionId || null,
          inv.dueDate || null,
          inv.paidAt || null,
          JSON.stringify(inv.items || []),
        ]
      );
    }
    console.log(`✅ Seeded ${invoices.length} invoices into 'invoices' table.`);

    // Teacher Salaries
    const salaries = globalThis.__QURAN_TEACHER_SALARIES__ || [];
    for (const sal of salaries) {
      await client.query(
        `INSERT INTO teacher_salaries (
          id, teacher_id, teacher_name, month, rate_per_class, hourly_rate,
          total_classes_taught, calculated_salary, bonus, total_payable,
          sessions_count, total_hours_taught, status, approved_by, approved_at,
          disbursed_at, notes, classes_list
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        ON CONFLICT (id) DO NOTHING;`,
        [
          sal.id,
          sal.teacherId,
          sal.teacherName || null,
          sal.month,
          sal.ratePerClass || sal.hourlyRate || 0,
          sal.hourlyRate || sal.ratePerClass || 0,
          sal.totalClassesTaught || sal.sessionsCount || 0,
          sal.calculatedSalary || 0,
          sal.bonus || 0,
          sal.totalPayable || 0,
          sal.sessionsCount || sal.totalClassesTaught || 0,
          sal.totalHoursTaught || 0,
          sal.status || 'Pending Approval',
          sal.approvedBy || null,
          sal.approvedAt || null,
          sal.disbursedAt || null,
          sal.notes || null,
          JSON.stringify(sal.classesList || []),
        ]
      );
    }
    console.log(`✅ Seeded ${salaries.length} teacher salary records into 'teacher_salaries' table.`);

    // System Settings
    const sysSettings = dbModule.getSystemSettings ? dbModule.getSystemSettings() : {};
    await client.query(
      `INSERT INTO system_settings (
        id, institute_name, academic_year, term, default_language, timezone,
        contact_email, contact_phone, tuition_fee_standard, director_signature,
        notifications_enabled, allow_student_quran_screen_timer, system_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT (id) DO UPDATE SET
        institute_name = EXCLUDED.institute_name,
        academic_year = EXCLUDED.academic_year,
        system_status = EXCLUDED.system_status,
        updated_at = NOW();`,
      [
        'default',
        sysSettings.instituteName || 'Our Quran Institute',
        sysSettings.academicYear || '1447-1448 AH (2026-2027)',
        sysSettings.term || 'Fall Intensive Hifz & Tajweed Trimester',
        sysSettings.defaultLanguage || 'en',
        sysSettings.timezone || 'Asia/Dhaka (GMT+6)',
        sysSettings.contactEmail || 'academics@quraninstitute.org',
        sysSettings.contactPhone || '+880 1711-223344',
        sysSettings.tuitionFeeStandard || 65.0,
        sysSettings.directorSignature || 'Dr. Sheikh Ibrahim Al-Mansoor',
        sysSettings.notificationsEnabled !== false,
        sysSettings.allowStudentQuranScreenTimer !== false,
        sysSettings.systemStatus || 'Operational & Connected to Sanad Registry',
      ]
    );
    console.log(`✅ Seeded system settings into 'system_settings' table.`);

    // Announcements
    const announcements = globalThis.__QURAN_ANNOUNCEMENTS__ || [];
    for (const ann of announcements) {
      await client.query(
        `INSERT INTO announcements (
          id, title, arabic_title, message, target_audience, priority, date, author
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO NOTHING;`,
        [
          ann.id,
          ann.title,
          ann.arabicTitle || null,
          ann.message,
          ann.targetAudience || 'all',
          ann.priority || 'normal',
          ann.date,
          ann.author || 'Administration',
        ]
      );
    }
    console.log(`✅ Seeded ${announcements.length} announcements into 'announcements' table.`);

    // Dictionary
    const dictionary = globalThis.__QURAN_DICTIONARY__ || [];
    for (const dict of dictionary) {
      await client.query(
        `INSERT INTO dictionary (
          id, term_arabic, term_translit, term_english, category, definition, example
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO NOTHING;`,
        [
          dict.id,
          dict.termArabic,
          dict.termTranslit,
          dict.termEnglish,
          dict.category,
          dict.definition,
          dict.example || null,
        ]
      );
    }
    console.log(`✅ Seeded ${dictionary.length} dictionary entries into 'dictionary' table.\n`);

    // 3. Verification & Summary
    console.log('--- Step 3: Verifying Database Table Counts ---');
    const tableNames = [
      'users',
      'courses',
      'quizzes',
      'enrollments',
      'student_mistakes',
      'attendance',
      'daily_progress',
      'screen_time_records',
      'reviews',
      'invoices',
      'teacher_salaries',
      'system_settings',
      'announcements',
      'dictionary',
    ];

    for (const tbl of tableNames) {
      const res = await client.query(`SELECT count(*) FROM ${tbl}`);
      console.log(`  📊 ${tbl.padEnd(22)} : ${res.rows[0].count} rows`);
    }

    console.log('\n===========================================================');
    console.log('🎉 ALL MIGRATIONS COMPLETED SUCCESSFULLY!');
    console.log('===========================================================');
  } catch (error) {
    console.error('❌ MIGRATION FAILED:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
