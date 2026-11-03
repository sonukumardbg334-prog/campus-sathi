-- ====================================================================
-- CampusSaathi Multi-College Smart Campus Management Platform
-- Complete PostgreSQL Schema with Multi-Tenant Row Level Security (RLS)
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Enumerated Types
CREATE TYPE user_role AS ENUM (
  'platform_admin',
  'institution_admin',
  'student',
  'parent',
  'teacher',
  'warden',
  'mess_manager',
  'maintenance',
  'staff'
);

CREATE TYPE institution_status AS ENUM (
  'PENDING_APPROVAL',
  'APPROVED',
  'SUSPENDED',
  'REJECTED'
);

CREATE TYPE complaint_status AS ENUM (
  'SUBMITTED',
  'UNDER_REVIEW',
  'ASSIGNED',
  'IN_PROGRESS',
  'AWAITING_VERIFICATION',
  'RESOLVED',
  'REOPENED',
  'REJECTED',
  'CANCELLED'
);

CREATE TYPE priority_level AS ENUM (
  'LOW',
  'MEDIUM',
  'HIGH',
  'URGENT'
);

CREATE TYPE attendance_status AS ENUM (
  'PRESENT',
  'ABSENT',
  'LATE',
  'EXCUSED'
);

CREATE TYPE meal_type AS ENUM (
  'BREAKFAST',
  'LUNCH',
  'SNACKS',
  'DINNER'
);

CREATE TYPE link_status AS ENUM (
  'PENDING',
  'APPROVED',
  'REJECTED',
  'REVOKED'
);

-- ====================================================================
-- 3. Core Tables
-- ====================================================================

-- Table 1: institutions
CREATE TABLE IF NOT EXISTS public.institutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL, -- 'University', 'Engineering College', 'Autonomous Institute', etc.
  official_email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  state VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  campus_count INT DEFAULT 1,
  website VARCHAR(255),
  status institution_status DEFAULT 'PENDING_APPROVAL',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 2: campuses
CREATE TABLE IF NOT EXISTS public.campuses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL,
  address TEXT,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 3: profiles (Syncs with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY, -- references auth.users(id) ON DELETE CASCADE
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  avatar_url TEXT,
  system_role user_role NOT NULL DEFAULT 'student',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 4: institution_memberships
CREATE TABLE IF NOT EXISTS public.institution_memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  designation VARCHAR(150),
  status VARCHAR(50) DEFAULT 'ACTIVE',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(institution_id, user_id, role)
);

-- Table 8: departments
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL,
  head_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 9: courses
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL,
  degree_level VARCHAR(50) DEFAULT 'Undergraduate',
  total_semesters INT DEFAULT 8,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 10: subjects
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  semester INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL,
  credits INT DEFAULT 4,
  teacher_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 11: academic_terms
CREATE TABLE IF NOT EXISTS public.academic_terms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL, -- e.g. 'Autumn 2026', 'Even Sem 2026'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 20: hostels
CREATE TABLE IF NOT EXISTS public.hostels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  gender VARCHAR(20) DEFAULT 'COED', -- 'BOYS', 'GIRLS', 'COED'
  warden_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  capacity INT DEFAULT 200,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 21: hostel_blocks
CREATE TABLE IF NOT EXISTS public.hostel_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  total_floors INT DEFAULT 4,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 22: hostel_rooms
CREATE TABLE IF NOT EXISTS public.hostel_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  block_id UUID NOT NULL REFERENCES public.hostel_blocks(id) ON DELETE CASCADE,
  room_number VARCHAR(50) NOT NULL,
  floor_number INT NOT NULL,
  capacity INT DEFAULT 2,
  occupied_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 5: students
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  campus_id UUID REFERENCES public.campuses(id) ON DELETE SET NULL,
  enrollment_no VARCHAR(100) NOT NULL,
  roll_no VARCHAR(100) NOT NULL,
  current_semester INT DEFAULT 1,
  batch_year INT NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  hostel_room_id UUID REFERENCES public.hostel_rooms(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(institution_id, roll_no),
  UNIQUE(institution_id, enrollment_no)
);

-- Table 6: parent_student_links
CREATE TABLE IF NOT EXISTS public.parent_student_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  relationship_type VARCHAR(50) NOT NULL, -- 'FATHER', 'MOTHER', 'GUARDIAN'
  status link_status DEFAULT 'PENDING',
  verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(parent_user_id, student_id)
);

-- Table 7: parent_link_requests
CREATE TABLE IF NOT EXISTS public.parent_link_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  student_enrollment_no VARCHAR(100) NOT NULL,
  student_name VARCHAR(255) NOT NULL,
  verification_pin VARCHAR(20) NOT NULL,
  relationship_type VARCHAR(50) NOT NULL,
  status link_status DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 12: class_sessions
CREATE TABLE IF NOT EXISTS public.class_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  teacher_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  term_id UUID REFERENCES public.academic_terms(id) ON DELETE SET NULL,
  session_date DATE NOT NULL,
  room_no VARCHAR(50),
  topic_covered VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 13: attendance_records
CREATE TABLE IF NOT EXISTS public.attendance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  class_session_id UUID NOT NULL REFERENCES public.class_sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  status attendance_status NOT NULL DEFAULT 'PRESENT',
  recorded_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(class_session_id, student_id)
);

-- Table 14: assessments
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  term_id UUID REFERENCES public.academic_terms(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  max_marks NUMERIC(5,2) NOT NULL,
  weightage_percent NUMERIC(5,2) DEFAULT 20.00,
  assessment_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 15: academic_records
CREATE TABLE IF NOT EXISTS public.academic_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  marks_obtained NUMERIC(5,2) NOT NULL,
  feedback TEXT,
  graded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(assessment_id, student_id)
);

-- Table 16: assignments
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ NOT NULL,
  max_marks NUMERIC(5,2) DEFAULT 100,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 17: assignment_submissions
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  submission_text TEXT,
  file_url TEXT,
  marks NUMERIC(5,2),
  status VARCHAR(50) DEFAULT 'SUBMITTED',
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(assignment_id, student_id)
);

-- Table 18: timetables
CREATE TABLE IF NOT EXISTS public.timetables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  semester INT NOT NULL,
  day_of_week VARCHAR(20) NOT NULL, -- Monday, Tuesday, ...
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  room_no VARCHAR(50) NOT NULL,
  teacher_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 19: announcements
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  audience VARCHAR(50) NOT NULL DEFAULT 'ALL', -- 'ALL', 'STUDENTS', 'PARENTS', 'TEACHERS', 'WARDENS'
  priority VARCHAR(50) DEFAULT 'NORMAL', -- 'NORMAL', 'URGENT'
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Table 23: room_assignments
CREATE TABLE IF NOT EXISTS public.room_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES public.hostel_rooms(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sequence for Complaint Reference Numbers
CREATE SEQUENCE IF NOT EXISTS complaint_ref_seq START WITH 1001;

-- Table 24: complaints (CORE COMPLAINT ENGINE)
CREATE TABLE IF NOT EXISTS public.complaints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_no VARCHAR(50) UNIQUE NOT NULL DEFAULT ('CS-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(NEXTVAL('complaint_ref_seq')::TEXT, 4, '0')),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  campus_id UUID REFERENCES public.campuses(id) ON DELETE SET NULL,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  building VARCHAR(100) NOT NULL,
  block VARCHAR(100),
  floor VARCHAR(50),
  room_number VARCHAR(50),
  suggested_priority priority_level DEFAULT 'MEDIUM',
  official_priority priority_level DEFAULT 'MEDIUM',
  status complaint_status DEFAULT 'SUBMITTED',
  problem_photo_url TEXT,
  resolution_photo_url TEXT,
  assigned_to_staff_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  verified_by_warden_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_duplicate_of UUID REFERENCES public.complaints(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 25: complaint_attachments
CREATE TABLE IF NOT EXISTS public.complaint_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  uploader_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  attachment_type VARCHAR(50) NOT NULL, -- 'PROBLEM_PHOTO', 'RESOLUTION_PHOTO', 'SUPPORTING_DOC'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 26: complaint_assignments
CREATE TABLE IF NOT EXISTS public.complaint_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  assigned_by_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assigned_to_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  instructions TEXT,
  status VARCHAR(50) DEFAULT 'ASSIGNED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 27: complaint_status_history
CREATE TABLE IF NOT EXISTS public.complaint_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  previous_status complaint_status,
  new_status complaint_status NOT NULL,
  changed_by_user_id UUID NOT NULL REFERENCES public.profiles(id),
  comment TEXT,
  resolution_photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 28: departments_staff
CREATE TABLE IF NOT EXISTS public.departments_staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_title VARCHAR(150),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(department_id, user_id)
);

-- Table 29: staff_work_orders
CREATE TABLE IF NOT EXISTS public.staff_work_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  staff_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  instructions TEXT,
  status complaint_status DEFAULT 'ASSIGNED',
  resolution_notes TEXT,
  resolution_photo_url TEXT,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 30: mess_menus
CREATE TABLE IF NOT EXISTS public.mess_menus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  day_of_week VARCHAR(20) NOT NULL, -- 'Monday', 'Tuesday', ...
  meal_type meal_type NOT NULL,
  menu_items TEXT NOT NULL,
  dietary_notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(institution_id, day_of_week, meal_type)
);

-- Table 31: mess_feedback
CREATE TABLE IF NOT EXISTS public.mess_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  meal_type meal_type NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  category VARCHAR(100) NOT NULL, -- 'TASTE', 'HYGIENE', 'TEMPERATURE', 'SHORTAGE', 'OTHER'
  comments TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 32: notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  related_record_id UUID,
  related_record_type VARCHAR(100),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 33: audit_logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE,
  actor_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100) NOT NULL,
  resource_id UUID,
  metadata JSONB,
  ip_address VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 34: institution_settings
CREATE TABLE IF NOT EXISTS public.institution_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID UNIQUE NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  parent_complaint_visibility BOOLEAN DEFAULT TRUE,
  auto_duplicate_alert BOOLEAN DEFAULT TRUE,
  notify_parents_on_attendance_drop BOOLEAN DEFAULT TRUE,
  attendance_warning_threshold NUMERIC(4,1) DEFAULT 75.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 4. Multi-Tenant Row Level Security (RLS) Policies
-- ====================================================================

ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institution_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_student_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_link_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mess_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mess_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Helper security functions
CREATE OR REPLACE FUNCTION public.get_user_role(p_user_id UUID)
RETURNS user_role AS $$
  SELECT system_role FROM public.profiles WHERE id = p_user_id;
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_user_institution_ids(p_user_id UUID)
RETURNS SETOF UUID AS $$
  SELECT institution_id FROM public.institution_memberships WHERE user_id = p_user_id AND status = 'ACTIVE';
$$ LANGUAGE sql SECURITY DEFINER;

-- Institutions Policy: Platform Admins can see all, others see approved institutions
CREATE POLICY institutions_read_policy ON public.institutions
  FOR SELECT USING (
    status = 'APPROVED' OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND system_role = 'platform_admin')
  );

-- Profiles Policy: Users can view their own profile, or members of the same institution
CREATE POLICY profiles_read_policy ON public.profiles
  FOR SELECT USING (
    id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.institution_memberships m1
      JOIN public.institution_memberships m2 ON m1.institution_id = m2.institution_id
      WHERE m1.user_id = auth.uid() AND m2.user_id = profiles.id
    )
  );

CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE USING (id = auth.uid());

-- Complaints RLS Policies:
-- 1. Student can see their own complaints
-- 2. Wardens and Admins can see complaints in their institution
-- 3. Maintenance staff can see complaints assigned to them
-- 4. Parents can see complaints if parent_complaint_visibility is true for their approved child
CREATE POLICY complaints_select_policy ON public.complaints
  FOR SELECT USING (
    -- Platform admin
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND system_role = 'platform_admin')
    -- Student owner
    OR student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
    -- Institution Admin or Warden in same institution
    OR EXISTS (
      SELECT 1 FROM public.institution_memberships
      WHERE user_id = auth.uid()
        AND institution_id = complaints.institution_id
        AND role IN ('institution_admin', 'warden')
    )
    -- Assigned staff member
    OR assigned_to_staff_id = auth.uid()
    -- Linked Parent
    OR EXISTS (
      SELECT 1 FROM public.parent_student_links psl
      JOIN public.institution_settings iset ON iset.institution_id = complaints.institution_id
      WHERE psl.parent_user_id = auth.uid()
        AND psl.student_id = complaints.student_id
        AND psl.status = 'APPROVED'
        AND iset.parent_complaint_visibility = TRUE
    )
  );

-- Student complaint submission
CREATE POLICY complaints_insert_policy ON public.complaints
  FOR INSERT WITH CHECK (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
  );

-- Complaint updates (Wardens, Admins, Assigned Staff)
CREATE POLICY complaints_update_policy ON public.complaints
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.institution_memberships
      WHERE user_id = auth.uid()
        AND institution_id = complaints.institution_id
        AND role IN ('institution_admin', 'warden')
    )
    OR assigned_to_staff_id = auth.uid()
  );

-- Notifications RLS: Recipients can only see their own notifications
CREATE POLICY notifications_select_policy ON public.notifications
  FOR SELECT USING (recipient_user_id = auth.uid());

CREATE POLICY notifications_update_policy ON public.notifications
  FOR UPDATE USING (recipient_user_id = auth.uid());

-- Attendance RLS: Students read their own, parents read approved linked student, teachers read/write their class
CREATE POLICY attendance_select_policy ON public.attendance_records
  FOR SELECT USING (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.parent_student_links
      WHERE parent_user_id = auth.uid() AND student_id = attendance_records.student_id AND status = 'APPROVED'
    )
    OR EXISTS (
      SELECT 1 FROM public.institution_memberships
      WHERE user_id = auth.uid() AND institution_id = attendance_records.institution_id AND role IN ('institution_admin', 'teacher')
    )
  );

-- Parent student links: Parents see their own links
CREATE POLICY parent_links_select ON public.parent_student_links
  FOR SELECT USING (
    parent_user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.students
      WHERE id = parent_student_links.student_id AND user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.institution_memberships
      WHERE user_id = auth.uid() AND institution_id = parent_student_links.institution_id AND role = 'institution_admin'
    )
  );

-- ====================================================================
-- 5. Storage Buckets Configuration & Policies
-- ====================================================================

-- Note: Run in Supabase SQL editor to create buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('complaint-evidence', 'complaint-evidence', false),
  ('resolution-evidence', 'resolution-evidence', false),
  ('profile-images', 'profile-images', true),
  ('institution-assets', 'institution-assets', true)
ON CONFLICT (id) DO NOTHING;

-- ====================================================================
-- CampusSaathi Migration: Academic Hierarchy, Attendance Submissions,
-- Assignments, Study Materials, Exams, Results, and Academic Calendar
-- ====================================================================

-- 1. Academic Years
CREATE TABLE IF NOT EXISTS public.academic_years (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL, -- e.g. '2025-2026'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(institution_id, name)
);

-- 2. Sections
CREATE TABLE IF NOT EXISTS public.sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  semester INT NOT NULL,
  name VARCHAR(50) NOT NULL, -- 'Section A', 'Section B'
  room_number VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, semester, name)
);

-- 3. Teachers / Faculty Profile Detail
CREATE TABLE IF NOT EXISTS public.teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  employee_id VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  designation VARCHAR(100) NOT NULL,
  phone VARCHAR(50),
  joined_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(institution_id, employee_id)
);

-- 4. Attendance Configuration (15-Day vs Monthly submission policy)
CREATE TABLE IF NOT EXISTS public.attendance_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  frequency VARCHAR(20) NOT NULL DEFAULT '15_DAY', -- '15_DAY' or 'MONTHLY'
  approval_required BOOLEAN DEFAULT TRUE,
  current_period_name VARCHAR(100) NOT NULL,
  period_start_date DATE NOT NULL,
  period_end_date DATE NOT NULL,
  submission_deadline DATE NOT NULL,
  late_submission_policy VARCHAR(255) DEFAULT 'Strict deadline, requires Admin approval for late upload',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(institution_id)
);

-- 5. Attendance Submissions (Batched 15-day / Monthly reports submitted by Faculty)
CREATE TABLE IF NOT EXISTS public.attendance_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  period_name VARCHAR(100) NOT NULL,
  frequency VARCHAR(20) NOT NULL DEFAULT '15_DAY',
  subject_name VARCHAR(255) NOT NULL,
  course_name VARCHAR(255) NOT NULL,
  semester INT NOT NULL,
  section VARCHAR(50) NOT NULL,
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  teacher_name VARCHAR(255) NOT NULL,
  total_conducted INT NOT NULL DEFAULT 0,
  total_records INT NOT NULL DEFAULT 0,
  present_count INT NOT NULL DEFAULT 0,
  absent_count INT NOT NULL DEFAULT 0,
  late_count INT NOT NULL DEFAULT 0,
  excused_count INT NOT NULL DEFAULT 0,
  average_attendance_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING_APPROVAL', -- 'PENDING_APPROVAL', 'APPROVED', 'REJECTED'
  submission_date TIMESTAMPTZ DEFAULT NOW(),
  reviewed_by VARCHAR(255),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Attendance Correction Requests
CREATE TABLE IF NOT EXISTS public.attendance_corrections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  attendance_record_id UUID,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  student_name VARCHAR(255) NOT NULL,
  roll_no VARCHAR(100) NOT NULL,
  subject_name VARCHAR(255) NOT NULL,
  session_date DATE NOT NULL,
  original_status attendance_status NOT NULL,
  proposed_status attendance_status NOT NULL,
  reason TEXT NOT NULL,
  requested_by_name VARCHAR(255) NOT NULL,
  requested_by_role user_role NOT NULL,
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED'
  reviewed_by VARCHAR(255),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Study Materials
CREATE TABLE IF NOT EXISTS public.study_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  course_name VARCHAR(255) NOT NULL,
  semester INT NOT NULL,
  subject_name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_type VARCHAR(20) NOT NULL DEFAULT 'PDF', -- 'PDF', 'PPT', 'DOC', 'NOTES'
  file_url TEXT,
  file_size VARCHAR(50) DEFAULT '2.4 MB',
  uploaded_by_name VARCHAR(255) NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  download_count INT DEFAULT 0
);

-- 8. Examinations
CREATE TABLE IF NOT EXISTS public.examinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  academic_year VARCHAR(50) NOT NULL,
  course_name VARCHAR(255) NOT NULL,
  semester INT NOT NULL,
  subject_name VARCHAR(255) NOT NULL,
  exam_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  venue VARCHAR(100) NOT NULL,
  max_marks NUMERIC(5,2) DEFAULT 100.00,
  status VARCHAR(50) DEFAULT 'SCHEDULED', -- 'SCHEDULED', 'COMPLETED', 'RESULTS_PUBLISHED'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Exam Results
CREATE TABLE IF NOT EXISTS public.exam_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL REFERENCES public.examinations(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  student_name VARCHAR(255) NOT NULL,
  student_roll VARCHAR(100) NOT NULL,
  subject_name VARCHAR(255) NOT NULL,
  marks_obtained NUMERIC(5,2) NOT NULL,
  max_marks NUMERIC(5,2) NOT NULL,
  percentage NUMERIC(5,2) NOT NULL,
  grade VARCHAR(10) NOT NULL,
  is_published BOOLEAN DEFAULT FALSE,
  remarks TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(exam_id, student_id)
);

-- 10. Academic Calendar Events
CREATE TABLE IF NOT EXISTS public.academic_calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  event_type VARCHAR(50) NOT NULL, -- 'SEMESTER_START', 'SEMESTER_END', 'EXAM', 'HOLIDAY', 'SUBMISSION_DEADLINE', 'COLLEGE_EVENT'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- Row Level Security (RLS) Configuration for Multi-College Isolation
-- ====================================================================
ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_corrections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.examinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_calendar_events ENABLE ROW LEVEL SECURITY;

-- Policy helper: Superadmins have platform-wide access, other roles access only their assigned institution_id
CREATE POLICY rls_academic_years_tenant ON public.academic_years
  FOR ALL USING (
    institution_id IN (
      SELECT im.institution_id FROM public.institution_memberships im WHERE im.user_id = auth.uid()
    ) OR EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.system_role = 'platform_admin'
    )
  );

CREATE POLICY rls_attendance_submissions_tenant ON public.attendance_submissions
  FOR ALL USING (
    institution_id IN (
      SELECT im.institution_id FROM public.institution_memberships im WHERE im.user_id = auth.uid()
    ) OR EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.system_role = 'platform_admin'
    )
  );

CREATE POLICY rls_assignments_tenant ON public.assignments
  FOR ALL USING (
    institution_id IN (
      SELECT im.institution_id FROM public.institution_memberships im WHERE im.user_id = auth.uid()
    ) OR EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.system_role = 'platform_admin'
    )
  );

CREATE POLICY rls_study_materials_tenant ON public.study_materials
  FOR ALL USING (
    institution_id IN (
      SELECT im.institution_id FROM public.institution_memberships im WHERE im.user_id = auth.uid()
    ) OR EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.system_role = 'platform_admin'
    )
  );

CREATE POLICY rls_exam_results_tenant ON public.exam_results
  FOR ALL USING (
    (institution_id IN (
      SELECT im.institution_id FROM public.institution_memberships im WHERE im.user_id = auth.uid()
    ) AND is_published = TRUE) OR EXISTS (
      SELECT 1 FROM public.institution_memberships im WHERE im.user_id = auth.uid() AND im.role IN ('institution_admin', 'teacher')
    ) OR EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.system_role = 'platform_admin'
    )
  );

-- ====================================================================
-- CampusSaathi Support Desk, User Feedback & Bug Reporting Schema
-- ====================================================================

-- 1. Table: support_tickets
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id VARCHAR(50) PRIMARY KEY,
  institution_id VARCHAR(50),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  college_name VARCHAR(255),
  category VARCHAR(100) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  attachment_url TEXT,
  attachment_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'Open',
  priority VARCHAR(50) DEFAULT 'MEDIUM',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table: user_feedback
CREATE TABLE IF NOT EXISTS public.user_feedback (
  id VARCHAR(50) PRIMARY KEY,
  institution_id VARCHAR(50),
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'student',
  category VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  comment TEXT NOT NULL,
  rating INT DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table: bug_reports
CREATE TABLE IF NOT EXISTS public.bug_reports (
  id VARCHAR(50) PRIMARY KEY,
  institution_id VARCHAR(50),
  reporter_name VARCHAR(255) NOT NULL,
  reporter_email VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  severity VARCHAR(50) NOT NULL,
  steps_to_reproduce TEXT NOT NULL,
  expected_behavior TEXT NOT NULL,
  actual_behavior TEXT NOT NULL,
  browser_info TEXT,
  attachment_url TEXT,
  status VARCHAR(50) DEFAULT 'Open',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  admin_notes TEXT
);

-- 4. Enable Row Level Security
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bug_reports ENABLE ROW LEVEL SECURITY;

-- 5. Policies: Allow public anonymous insertion (visitors can submit tickets/bugs/feedback)
CREATE POLICY support_tickets_insert ON public.support_tickets
  FOR INSERT WITH CHECK (true);

CREATE POLICY support_tickets_select ON public.support_tickets
  FOR SELECT USING (true);

CREATE POLICY support_tickets_update ON public.support_tickets
  FOR UPDATE USING (true);

CREATE POLICY user_feedback_insert ON public.user_feedback
  FOR INSERT WITH CHECK (true);

CREATE POLICY user_feedback_select ON public.user_feedback
  FOR SELECT USING (true);

CREATE POLICY bug_reports_insert ON public.bug_reports
  FOR INSERT WITH CHECK (true);

CREATE POLICY bug_reports_select ON public.bug_reports
  FOR SELECT USING (true);

CREATE POLICY bug_reports_update ON public.bug_reports
  FOR UPDATE USING (true);

-- 6. Storage Bucket for Support & Bug Attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('support-attachments', 'support-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- ====================================================================
-- CampusSaathi Demo Seed Data (Fictional higher-ed institutions)
-- ====================================================================

-- 1. Institutions
INSERT INTO public.institutions (id, code, name, type, official_email, phone, state, city, campus_count, website, status)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'AITM', 'Apex Institute of Technology & Management', 'Autonomous Institute', 'admin@apextech.edu.in', '+91 180 225 8097', 'Delhi NCR', 'New Delhi', 2, 'https://apextech.edu.in', 'APPROVED'),
  ('22222222-2222-2222-2222-222222222222', 'LPU-PB', 'Lovely Professional University', 'Private University', 'campus@lpu.co.in', '+91 1824 517000', 'Punjab', 'Phagwara', 1, 'https://lpu.in', 'APPROVED'),
  ('33333333-3333-3333-3333-333333333333', 'IITD', 'Indian Institute of Technology Delhi', 'Institute of National Importance', 'office@iitd.ac.in', '+91 11 2659 7135', 'Delhi', 'New Delhi', 1, 'https://iitd.ac.in', 'APPROVED'),
  ('44444444-4444-4444-4444-444444444444', 'GNDU-ASR', 'Guru Nanak Dev University', 'State University', 'registrar@gndu.ac.in', '+91 183 2258802', 'Punjab', 'Amritsar', 1, 'https://gndu.ac.in', 'PENDING_APPROVAL')
ON CONFLICT (id) DO NOTHING;

-- 2. Campuses
INSERT INTO public.campuses (id, institution_id, name, code, city, state)
VALUES
  ('c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Main Heritage Campus', 'KHC-MAIN', 'Amritsar', 'Punjab'),
  ('c1111111-2222-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'North Technology Block', 'KHC-TECH', 'Amritsar', 'Punjab')
ON CONFLICT (id) DO NOTHING;

-- 3. Departments
INSERT INTO public.departments (id, institution_id, name, code, description)
VALUES
  ('d1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Computer Science & Engineering', 'CSE', 'School of Computer Science & Applied AI'),
  ('d2222222-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Electrical & Electronics Engineering', 'EEE', 'Department of Electrical Engineering'),
  ('d3333333-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Estate & Campus Maintenance', 'MAINT', 'Facility, Hostel & Infrastructure Maintenance')
ON CONFLICT (id) DO NOTHING;

-- 4. Hostels & Blocks
INSERT INTO public.hostels (id, institution_id, name, gender, capacity)
VALUES
  ('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Bhagat Singh Boys Hostel', 'BOYS', 350),
  ('12222222-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Kalpana Chawla Girls Hostel', 'GIRLS', 300)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.hostel_blocks (id, hostel_id, name, total_floors)
VALUES
  ('b1111111-1111-1111-1111-111111111111', 'h1111111-1111-1111-1111-111111111111', 'Block A (Aryabhata Wing)', 4),
  ('b2222222-1111-1111-1111-111111111111', 'h1111111-1111-1111-1111-111111111111', 'Block B (Ramanujan Wing)', 4)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.hostel_rooms (id, block_id, room_number, floor_number, capacity, occupied_count)
VALUES
  ('r1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'A-204', 2, 2, 2),
  ('r2222222-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'A-305', 3, 2, 1)
ON CONFLICT (id) DO NOTHING;

-- 5. Mess Menus
INSERT INTO public.mess_menus (institution_id, day_of_week, meal_type, menu_items, dietary_notes)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Monday', 'BREAKFAST', 'Aloo Paratha, Curd, Mint Chutney, Boiled Eggs / Banana, Tea / Coffee', 'Pure Desi Ghee preparation on request'),
  ('11111111-1111-1111-1111-111111111111', 'Monday', 'LUNCH', 'Dal Makhani, Seasonal Mix Veg, Jeera Rice, Tandoori Roti, Salad & Boondi Raita', 'Jain food counter available'),
  ('11111111-1111-1111-1111-111111111111', 'Monday', 'SNACKS', 'Veg Samosa (2 pcs), Green Chutney, Masala Chai', 'Served hot from 4:30 PM to 6:00 PM'),
  ('11111111-1111-1111-1111-111111111111', 'Monday', 'DINNER', 'Shahi Paneer / Chicken Curry, Yellow Dal Tadka, Steam Rice, Chapati, Gulab Jamun', 'Special dessert night')
ON CONFLICT DO NOTHING;

