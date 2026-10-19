-- =========================================================================
-- OUR QURAN INSTITUTE: SANCTUARY PORTAL PRODUCTION POSTGRESQL SCHEMA
-- Initial Database Migration (Supabase PostgreSQL)
-- =========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE (Admins, Faculty Scholars, Students, Parents)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  department VARCHAR(255),
  avatar VARCHAR(255),
  status VARCHAR(100) DEFAULT 'Active',
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  permissions JSONB DEFAULT '[]'::jsonb,
  is_database_provisioned_only BOOLEAN DEFAULT FALSE,
  sanad_certification TEXT,
  specialization TEXT,
  years_experience VARCHAR(50),
  rate_per_class NUMERIC(10, 2) DEFAULT 0,
  hourly_rate NUMERIC(10, 2) DEFAULT 0,
  total_classes_taught INT DEFAULT 0,
  all_time_successful_classes INT DEFAULT 0,
  students_count INT DEFAULT 0,
  next_session TEXT,
  assigned_teacher_id VARCHAR(64),
  mentor VARCHAR(255),
  parent_id VARCHAR(64),
  parent_name VARCHAR(255),
  memorized_juz INT DEFAULT 0,
  total_juz INT DEFAULT 30,
  children_ids JSONB DEFAULT '[]'::jsonb,
  phone VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- 2. COURSES TABLE
CREATE TABLE IF NOT EXISTS courses (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  arabic_title VARCHAR(255),
  slug VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(100) DEFAULT 'quran',
  level VARCHAR(100),
  author_id VARCHAR(64),
  assigned_teacher_id VARCHAR(64),
  teacher_name VARCHAR(255),
  thumbnail TEXT,
  description TEXT,
  total_duration VARCHAR(100),
  passing_grade INT DEFAULT 80,
  status VARCHAR(50) DEFAULT 'published',
  modules JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);

-- 3. QUIZZES TABLE
CREATE TABLE IF NOT EXISTS quizzes (
  id VARCHAR(64) PRIMARY KEY,
  module_id VARCHAR(64),
  title VARCHAR(255) NOT NULL,
  time_limit_minutes INT DEFAULT 15,
  passing_score INT DEFAULT 80,
  questions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ENROLLMENTS TABLE
CREATE TABLE IF NOT EXISTS enrollments (
  id VARCHAR(64) PRIMARY KEY,
  student_id VARCHAR(64) NOT NULL,
  student_name VARCHAR(255),
  course_id VARCHAR(64) NOT NULL,
  teacher_id VARCHAR(64),
  teacher_name VARCHAR(255),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  progress_percent INT DEFAULT 0,
  completed_lessons JSONB DEFAULT '[]'::jsonb,
  completed_quizzes JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(50) DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_teacher ON enrollments(teacher_id);

-- 5. STUDENT MISTAKE ANNOTATIONS (Word-by-word Quran Ayah correction tracker)
CREATE TABLE IF NOT EXISTS student_mistakes (
  id VARCHAR(64) PRIMARY KEY,
  student_id VARCHAR(64) NOT NULL,
  student_name VARCHAR(255),
  course_id VARCHAR(64),
  teacher_id VARCHAR(64),
  teacher_name VARCHAR(255),
  surah_number INT NOT NULL,
  surah_name VARCHAR(100) NOT NULL,
  ayah_number INT NOT NULL,
  word_index INT NOT NULL,
  word_text VARCHAR(255) NOT NULL,
  mistake_category VARCHAR(100) NOT NULL,
  category_label VARCHAR(255),
  severity VARCHAR(50) DEFAULT 'minor',
  correction_note TEXT,
  status VARCHAR(50) DEFAULT 'active',
  flagged_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolved_note TEXT
);

CREATE INDEX IF NOT EXISTS idx_mistakes_student ON student_mistakes(student_id);
CREATE INDEX IF NOT EXISTS idx_mistakes_status ON student_mistakes(status);

-- 6. ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS attendance (
  id VARCHAR(64) PRIMARY KEY,
  student_id VARCHAR(64) NOT NULL,
  student_name VARCHAR(255),
  teacher_id VARCHAR(64) NOT NULL,
  teacher_name VARCHAR(255),
  course_id VARCHAR(64) DEFAULT 'QI-CRS-001',
  date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'present',
  note TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_teacher_date ON attendance(teacher_id, date);

-- 7. DAILY PROGRESS (Hifz Sabaq, Sabqi, Manzil, Tarbiyah)
CREATE TABLE IF NOT EXISTS daily_progress (
  id VARCHAR(64) PRIMARY KEY,
  student_id VARCHAR(64) NOT NULL,
  student_name VARCHAR(255),
  teacher_id VARCHAR(64),
  teacher_name VARCHAR(255),
  date DATE NOT NULL,
  sabaq JSONB DEFAULT '{}'::jsonb,
  sabqi JSONB DEFAULT '{}'::jsonb,
  manzil TEXT,
  tarbiyah JSONB DEFAULT '{}'::jsonb,
  teacher_feedback TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_daily_progress_student ON daily_progress(student_id);

-- 8. SCREEN TIME RECORDS (Digital Quran reading tracking)
CREATE TABLE IF NOT EXISTS screen_time_records (
  id VARCHAR(64) PRIMARY KEY,
  student_id VARCHAR(64) NOT NULL,
  surah_number INT NOT NULL,
  surah_name VARCHAR(100) NOT NULL,
  duration_seconds INT NOT NULL DEFAULT 0,
  date DATE NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_screen_time_student ON screen_time_records(student_id);

-- 9. REVIEWS TABLE (Parent & Student Scholar Feedback)
CREATE TABLE IF NOT EXISTS reviews (
  id VARCHAR(64) PRIMARY KEY,
  teacher_id VARCHAR(64) NOT NULL,
  teacher_name VARCHAR(255),
  student_id VARCHAR(64),
  student_name VARCHAR(255),
  parent_id VARCHAR(64),
  parent_name VARCHAR(255),
  reviewer_role VARCHAR(50),
  rating NUMERIC(3, 1) NOT NULL,
  comment TEXT,
  date DATE,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_teacher ON reviews(teacher_id);

-- 10. INVOICES TABLE (Fee Billing & Payment Verification)
CREATE TABLE IF NOT EXISTS invoices (
  id VARCHAR(64) PRIMARY KEY,
  invoice_number VARCHAR(64) UNIQUE,
  student_id VARCHAR(64),
  student_name VARCHAR(255),
  parent_id VARCHAR(64),
  parent_name VARCHAR(255),
  month VARCHAR(100),
  amount_usd NUMERIC(10, 2) DEFAULT 0,
  amount_bdt NUMERIC(10, 2) DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'Pending',
  payment_method VARCHAR(100),
  transaction_id VARCHAR(100),
  due_date DATE,
  paid_at TIMESTAMPTZ,
  items JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoices_student ON invoices(student_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

-- 11. TEACHER SALARIES TABLE (Faculty Payroll & Disbursement Records)
CREATE TABLE IF NOT EXISTS teacher_salaries (
  id VARCHAR(64) PRIMARY KEY,
  teacher_id VARCHAR(64) NOT NULL,
  teacher_name VARCHAR(255),
  month VARCHAR(100) NOT NULL,
  rate_per_class NUMERIC(10, 2) DEFAULT 0,
  hourly_rate NUMERIC(10, 2) DEFAULT 0,
  total_classes_taught INT DEFAULT 0,
  calculated_salary NUMERIC(10, 2) DEFAULT 0,
  bonus NUMERIC(10, 2) DEFAULT 0,
  total_payable NUMERIC(10, 2) DEFAULT 0,
  sessions_count INT DEFAULT 0,
  total_hours_taught NUMERIC(10, 2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'Pending Approval',
  approved_by VARCHAR(64),
  approved_at TIMESTAMPTZ,
  disbursed_at TIMESTAMPTZ,
  notes TEXT,
  classes_list JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_salaries_teacher ON teacher_salaries(teacher_id);

-- 12. SYSTEM SETTINGS TABLE
CREATE TABLE IF NOT EXISTS system_settings (
  id VARCHAR(64) PRIMARY KEY DEFAULT 'default',
  institute_name VARCHAR(255),
  academic_year VARCHAR(255),
  term VARCHAR(255),
  default_language VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(100),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(255),
  tuition_fee_standard NUMERIC(10, 2) DEFAULT 65.0,
  director_signature VARCHAR(255),
  notifications_enabled BOOLEAN DEFAULT TRUE,
  allow_student_quran_screen_timer BOOLEAN DEFAULT TRUE,
  system_status VARCHAR(255),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS announcements (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  arabic_title VARCHAR(255),
  message TEXT NOT NULL,
  target_audience VARCHAR(50) DEFAULT 'all',
  priority VARCHAR(50) DEFAULT 'normal',
  date DATE NOT NULL,
  author VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. TAJWEED DICTIONARY TABLE
CREATE TABLE IF NOT EXISTS dictionary (
  id VARCHAR(64) PRIMARY KEY,
  term_arabic VARCHAR(255) NOT NULL,
  term_translit VARCHAR(255) NOT NULL,
  term_english VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  definition TEXT NOT NULL,
  example TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
