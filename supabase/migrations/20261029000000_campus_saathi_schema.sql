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

