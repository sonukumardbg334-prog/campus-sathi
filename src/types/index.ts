// CampusSaathi Domain Types

export type UserRole =
  | 'platform_admin'
  | 'institution_admin'
  | 'student'
  | 'parent'
  | 'teacher'
  | 'warden'
  | 'mess_manager'
  | 'maintenance'
  | 'staff';

export type InstitutionStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'SUSPENDED' | 'REJECTED';

export type ComplaintStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'AWAITING_VERIFICATION'
  | 'RESOLVED'
  | 'REOPENED'
  | 'REJECTED'
  | 'CANCELLED';

export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export type MealType = 'BREAKFAST' | 'LUNCH' | 'SNACKS' | 'DINNER';

export type LinkStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVOKED';

export interface InstitutionThemeConfig {
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  card_style?: 'glass_light' | 'glass_dark' | 'solid';
  custom_tagline?: string;
  glass_opacity?: number;
}

export interface Institution {
  id: string;
  code: string;
  name: string;
  type: string;
  official_email: string;
  phone?: string;
  state: string;
  city: string;
  campus_count?: number;
  website?: string;
  description?: string;
  status: InstitutionStatus;
  verification_enabled?: boolean;
  logo_url?: string;
  background_images?: string[];
  hero_tagline?: string;
  theme_config?: InstitutionThemeConfig;
  created_at: string;
  updated_at?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  role: UserRole;
  institution_id?: string;
  institution_name?: string;
  department_name?: string;
  is_active: boolean;
  created_at: string;
}

export interface Student {
  id: string;
  user_id: string;
  institution_id: string;
  full_name: string;
  email: string;
  enrollment_no: string;
  roll_no: string;
  current_semester: number;
  batch_year: number;
  department_name: string;
  course_name: string;
  hostel_name?: string;
  hostel_block?: string;
  room_number?: string;
  overall_attendance: number;
}

export interface ParentLinkRequest {
  id: string;
  parent_user_id: string;
  parent_name: string;
  parent_email: string;
  institution_id: string;
  student_enrollment_no: string;
  student_name: string;
  verification_pin: string;
  relationship_type: 'FATHER' | 'MOTHER' | 'GUARDIAN';
  status: LinkStatus;
  created_at: string;
}

export interface ParentStudentLink {
  id: string;
  parent_user_id: string;
  student_id: string;
  student: Student;
  institution_id: string;
  relationship_type: 'FATHER' | 'MOTHER' | 'GUARDIAN';
  status: LinkStatus;
  verified_at?: string;
  created_at: string;
}

export interface Complaint {
  id: string;
  reference_no: string;
  institution_id: string;
  campus_name?: string;
  student_id: string;
  student_name: string;
  student_roll: string;
  category: string;
  title: string;
  description: string;
  building: string;
  block?: string;
  floor?: string;
  room_number?: string;
  suggested_priority: PriorityLevel;
  official_priority: PriorityLevel;
  status: ComplaintStatus;
  problem_photo_url?: string;
  resolution_photo_url?: string;
  assigned_to_staff_id?: string;
  assigned_staff_name?: string;
  verified_by_warden_id?: string;
  verified_warden_name?: string;
  resolution_notes?: string;
  is_duplicate_of?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
  status_history: ComplaintStatusEntry[];
}

export interface ComplaintStatusEntry {
  id: string;
  complaint_id: string;
  previous_status?: ComplaintStatus;
  new_status: ComplaintStatus;
  changed_by_name: string;
  comment?: string;
  resolution_photo_url?: string;
  timestamp: string;
}

export interface AttendanceRecord {
  id: string;
  institution_id: string;
  session_id?: string;
  student_id: string;
  student_name: string;
  roll_no: string;
  course_name?: string;
  semester?: number;
  section?: string;
  subject_name: string;
  session_date: string;
  status: AttendanceStatus;
  topic?: string;
  recorded_by_name: string;
  submission_id?: string;
}

// Academic Hierarchy & Structure
export interface AcademicYear {
  id: string;
  institution_id: string;
  name: string; // e.g. "2025-2026"
  start_date: string;
  end_date: string;
  is_current: boolean;
}

export interface Course {
  id: string;
  institution_id: string;
  name: string; // e.g. "B.Tech Computer Science & Engineering"
  code: string; // e.g. "BTECH-CSE"
  degree_level: 'Undergraduate' | 'Postgraduate' | 'Diploma' | 'Doctoral';
  total_semesters: number;
  department_name: string;
}

export interface Semester {
  id: string;
  institution_id: string;
  course_id: string;
  course_name: string;
  semester_number: number;
  academic_year: string;
}

export interface Section {
  id: string;
  institution_id: string;
  course_name: string;
  semester: number;
  name: string; // e.g. "Section A", "Section B"
  room_number?: string;
}

export interface Subject {
  id: string;
  institution_id: string;
  course_id: string;
  course_name: string;
  semester: number;
  name: string;
  code: string;
  credits: number;
  teacher_id?: string;
  teacher_name?: string;
}

export interface Teacher {
  id: string;
  user_id: string;
  institution_id: string;
  full_name: string;
  email: string;
  phone?: string;
  employee_id: string;
  department: string;
  designation: string;
  assigned_subjects: string[];
  assigned_classes: string[];
  joined_date: string;
}

// Complete Attendance Workflow Models (15-Day / Monthly)
export interface AttendanceConfig {
  id: string;
  institution_id: string;
  frequency: '15_DAY' | 'MONTHLY';
  approval_required: boolean;
  current_period_name: string;
  period_start_date: string;
  period_end_date: string;
  submission_deadline: string;
  late_submission_policy: string;
  minimum_percentage?: number;
  auto_lock_days?: number;
}

export interface AttendanceSession {
  id: string;
  institution_id: string;
  subject_id: string;
  subject_name: string;
  course_name: string;
  semester: number;
  section: string;
  teacher_id: string;
  teacher_name: string;
  session_date: string;
  topic: string;
  status: 'CONDUCTED' | 'CANCELLED';
  created_at: string;
}

export interface AttendanceSubmission {
  id: string;
  institution_id: string;
  period_name: string;
  frequency: '15_DAY' | 'MONTHLY';
  subject_name: string;
  course_name: string;
  semester: number;
  section: string;
  teacher_id: string;
  teacher_name: string;
  total_conducted: number;
  total_records: number;
  present_count: number;
  absent_count: number;
  late_count: number;
  excused_count: number;
  average_attendance_pct: number;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  submission_date: string;
  reviewed_by?: string;
  reviewed_at?: string;
  rejection_reason?: string;
  records_count: number;
}

export interface AttendanceCorrectionRequest {
  id: string;
  institution_id: string;
  attendance_record_id: string;
  student_id: string;
  student_name: string;
  roll_no: string;
  subject_name: string;
  session_date: string;
  original_status: AttendanceStatus;
  proposed_status: AttendanceStatus;
  reason: string;
  requested_by_name: string;
  requested_by_role: UserRole;
  requested_at: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewed_by?: string;
  reviewed_at?: string;
  review_notes?: string;
}

// Assignments & Submissions
export interface Assignment {
  id: string;
  institution_id: string;
  course_name: string;
  semester: number;
  section?: string;
  subject_name: string;
  title: string;
  description: string;
  due_date: string;
  max_marks: number;
  created_by_name: string;
  attachment_name?: string;
  created_at: string;
}

export interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  institution_id: string;
  student_id: string;
  student_name: string;
  student_roll: string;
  submission_text: string;
  attachment_name?: string;
  submitted_at: string;
  status: 'SUBMITTED' | 'GRADED' | 'LATE';
  marks?: number;
  feedback?: string;
  graded_by?: string;
  graded_at?: string;
}

// Study Materials & Academic Resources
export interface StudyMaterial {
  id: string;
  institution_id: string;
  course_name: string;
  semester: number;
  subject_name: string;
  title: string;
  description: string;
  file_type: 'PDF' | 'PPT' | 'DOC' | 'NOTES';
  file_url?: string;
  file_size: string;
  uploaded_by_name: string;
  uploaded_at: string;
  download_count: number;
}

// Examination & Results Management
export interface Examination {
  id: string;
  institution_id: string;
  name: string;
  academic_year: string;
  course_name: string;
  semester: number;
  subject_name: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  venue: string;
  max_marks: number;
  status: 'SCHEDULED' | 'COMPLETED' | 'RESULTS_PUBLISHED';
}

export interface ExamResult {
  id: string;
  institution_id: string;
  exam_id: string;
  exam_name: string;
  student_id: string;
  student_name: string;
  student_roll: string;
  subject_name: string;
  marks_obtained: number;
  max_marks: number;
  percentage: number;
  grade: string;
  is_published: boolean;
  remarks?: string;
  published_at?: string;
}

// Academic Calendar Events
export interface AcademicCalendarEvent {
  id: string;
  institution_id: string;
  title: string;
  event_type: 'SEMESTER_START' | 'SEMESTER_END' | 'EXAM' | 'HOLIDAY' | 'SUBMISSION_DEADLINE' | 'COLLEGE_EVENT';
  start_date: string;
  end_date: string;
  description: string;
}

export interface AcademicRecord {
  id: string;
  institution_id: string;
  student_id: string;
  student_name: string;
  subject_name: string;
  assessment_title: string;
  max_marks: number;
  marks_obtained: number;
  percentage: number;
  grade: string;
  feedback?: string;
  assessment_date: string;
}

export interface TimetableSlot {
  id: string;
  institution_id: string;
  course_name: string;
  semester: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  subject_name: string;
  room_no: string;
  teacher_name: string;
}

export interface Announcement {
  id: string;
  institution_id: string;
  title: string;
  content: string;
  audience: 'ALL' | 'STUDENTS' | 'PARENTS' | 'TEACHERS' | 'STAFF' | 'WARDENS';
  priority: 'NORMAL' | 'URGENT';
  course_name?: string;
  semester?: number;
  attachment_name?: string;
  author_name: string;
  published_at: string;
  expires_at?: string;
}

export interface MessMenu {
  id: string;
  institution_id: string;
  day_of_week: string;
  meal_type: MealType;
  menu_items: string;
  dietary_notes?: string;
  is_active: boolean;
}

export interface MessFeedback {
  id: string;
  institution_id: string;
  student_id: string;
  student_name: string;
  meal_type: MealType;
  rating: number; // 1-5
  category: 'TASTE' | 'HYGIENE' | 'TEMPERATURE' | 'SHORTAGE' | 'OTHER';
  comments: string;
  photo_url?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  recipient_user_id: string;
  institution_id?: string;
  type: 'COMPLAINT_UPDATE' | 'ASSIGNMENT' | 'ATTENDANCE_WARNING' | 'ANNOUNCEMENT' | 'LINK_REQUEST' | 'SYSTEM';
  title: string;
  message: string;
  related_id?: string;
  is_read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  institution_id?: string;
  actor_name: string;
  actor_role: UserRole;
  action: string;
  resource_type: string;
  details: string;
  timestamp: string;
}

export interface RoleInvitation {
  id: string;
  institution_id: string;
  code: string;
  intended_role: UserRole;
  department?: string;
  expires_at: string;
  usage_limit: number;
  usage_count: number;
  is_active: boolean;
  created_by: string;
}

export interface RoleRegistrationPayload {
  role: UserRole;
  full_name: string;
  email: string;
  password?: string;
  institution_id: string;
  verification_code?: string;
  department?: string;
  designation?: string;
  roll_no?: string;
  enrollment_no?: string;
  semester?: number;
  course_name?: string;
  employee_id?: string;
  hostel_assignment?: string;
  service_area?: string;
  student_reference?: string;
  relationship_type?: 'FATHER' | 'MOTHER' | 'GUARDIAN';
}

// ============================================================
// Support, Feedback, Bug Reporting & Compliance Types
// ============================================================

export type SupportTicketStatus =
  | 'Open'
  | 'Submitted'
  | 'Under Review'
  | 'In Progress'
  | 'Awaiting User Response'
  | 'Resolved'
  | 'Closed';

export type SupportCategory =
  | 'GENERAL'
  | 'General Inquiries'
  | 'Attendance Issues'
  | 'Account & Login'
  | 'Marks & Results'
  | 'College Registration'
  | 'Hostel & Mess'
  | 'LOGIN_ACCESS'
  | 'ACADEMIC_PORTAL'
  | 'ATTENDANCE_QUERY'
  | 'GRIEVANCE_HELP'
  | 'INSTITUTION_ONBOARDING'
  | 'OTHER';

export interface SupportTicket {
  id: string; // e.g. CS-SUP-2026-1001
  institution_id?: string;
  user_id?: string;
  name: string;
  full_name?: string;
  email: string;
  phone?: string;
  college_name?: string;
  category: SupportCategory;
  subject: string;
  message: string;
  description?: string;
  attachment_url?: string;
  attachment_name?: string;
  status: SupportTicketStatus;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | string;
  created_at: string;
  updated_at?: string;
  admin_notes?: string;
  admin_reply?: string;
  replied_by?: string;
}

export type FeedbackCategory =
  | 'UI_UX'
  | 'User Experience (UI/UX)'
  | 'Feature Suggestion'
  | 'Performance & Speed'
  | 'Attendance System'
  | 'Role Portals'
  | 'General Praise / Other'
  | 'PERFORMANCE'
  | 'ACADEMICS'
  | 'ATTENDANCE'
  | 'HOSTEL_MESS'
  | 'FEATURE_REQUEST'
  | 'OTHER';

export interface UserFeedback {
  id: string; // e.g. CS-FDB-2026-2001
  institution_id?: string;
  user_name?: string;
  full_name?: string;
  user_email?: string;
  email?: string;
  role?: string;
  category: FeedbackCategory;
  title?: string;
  feedback?: string;
  comment?: string;
  rating: number; // 1-5
  screenshot_url?: string;
  created_at: string;
}

export type BugSeverity =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL'
  | 'Low (Cosmetic)'
  | 'Medium (Partial function blocked)'
  | 'High (Core feature unusable)'
  | 'Critical (Security / Data integrity)';

export type BugCategory =
  | 'LOGIN_AUTH'
  | 'Visual / Styling Glitch'
  | 'Attendance Calculation Error'
  | 'Form Submission Failure'
  | 'Authentication / Session Issue'
  | 'Role Permission Discrepancy'
  | 'Performance / Slow Loading'
  | 'Other Technical Issue'
  | 'ATTENDANCE'
  | 'DASHBOARD'
  | 'FORMS'
  | 'NAVIGATION'
  | 'THEME_DISPLAY'
  | 'OTHER';

export interface BugReport {
  id: string; // e.g. CS-BUG-2026-3001
  institution_id?: string;
  reporter_name: string;
  reporter_email?: string;
  email?: string;
  title: string;
  category: BugCategory;
  description?: string;
  steps_to_reproduce: string;
  expected_result?: string;
  expected_behavior?: string;
  actual_result?: string;
  actual_behavior?: string;
  severity: BugSeverity;
  affected_page?: string;
  browser_device_info?: string;
  browser_info?: string;
  attachment_url?: string;
  attachment_name?: string;
  status: SupportTicketStatus | 'Investigating';
  created_at: string;
  updated_at?: string;
  admin_notes?: string;
}

export interface CookieConsentPreferences {
  necessary: boolean; // Always true
  essential?: boolean; // Alias for necessary
  analytics: boolean;
  functional: boolean;
  timestamp: string;
}
