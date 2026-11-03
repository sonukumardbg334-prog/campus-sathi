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

