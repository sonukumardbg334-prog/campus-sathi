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

