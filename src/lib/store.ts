import {
  Institution,
  Complaint,
  ComplaintStatus,
  PriorityLevel,
  AttendanceStatus,
  Notification,
  AttendanceRecord,
  AcademicRecord,
  ParentStudentLink,
  ParentLinkRequest,
  MessMenu,
  MessFeedback,
  AuditLog,
  UserProfile,
  UserRole,
  RoleInvitation,
  RoleRegistrationPayload,
  Course,
  Section,
  Subject,
  Teacher,
  Student,
  AttendanceConfig,
  AttendanceSubmission,
  AttendanceCorrectionRequest,
  Assignment,
  AssignmentSubmission,
  StudyMaterial,
  Examination,
  ExamResult,
  AcademicCalendarEvent,
  Announcement,
  TimetableSlot,
  SupportTicket,
  UserFeedback,
  BugReport,
  SupportTicketStatus,
  SupportCategory,
  FeedbackCategory,
  BugCategory,
  BugSeverity,
} from '../types';
import {
  DEMO_INSTITUTIONS,
  DEMO_COMPLAINTS,
  DEMO_NOTIFICATIONS,
  DEMO_ATTENDANCE,
  DEMO_ACADEMICS,
  DEMO_PARENT_LINKS,
  DEMO_PARENT_REQUESTS,
  DEMO_MESS_MENUS,
  DEMO_MESS_FEEDBACK,
  DEMO_AUDIT_LOGS,
  DEMO_STUDENT,
  DEMO_COURSES,
  DEMO_SECTIONS,
  DEMO_SUBJECTS,
  DEMO_STUDENT_ROSTER,
  DEMO_TEACHERS,
  DEMO_ATTENDANCE_CONFIGS,
  DEMO_ATTENDANCE_SUBMISSIONS,
  DEMO_ATTENDANCE_CORRECTIONS,
  DEMO_ASSIGNMENTS,
  DEMO_ASSIGNMENT_SUBMISSIONS,
  DEMO_STUDY_MATERIALS,
  DEMO_EXAMINATIONS,
  DEMO_EXAM_RESULTS,
  DEMO_CALENDAR_EVENTS,
  DEMO_TIMETABLE,
  DEMO_ANNOUNCEMENTS,
  DEMO_SUPPORT_TICKETS,
  DEMO_USER_FEEDBACK,
  DEMO_BUG_REPORTS,
  DEMO_USERS,
} from './mockData';
import { supabase, isLiveSupabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  INSTITUTIONS: 'cs_institutions_v1',
  COMPLAINTS: 'cs_complaints_v1',
  NOTIFICATIONS: 'cs_notifications_v1',
  ATTENDANCE: 'cs_attendance_v1',
  ACADEMICS: 'cs_academics_v1',
  PARENT_LINKS: 'cs_parent_links_v1',
  PARENT_REQUESTS: 'cs_parent_requests_v1',
  MESS_MENUS: 'cs_mess_menus_v1',
  MESS_FEEDBACK: 'cs_mess_feedback_v1',
  AUDIT_LOGS: 'cs_audit_logs_v1',
  INVITATIONS: 'cs_invitations_v1',
  USERS: 'cs_registered_users_v1',
  CREDENTIALS: 'cs_user_credentials_v1',
  COURSES: 'cs_courses_v1',
  SECTIONS: 'cs_sections_v1',
  SUBJECTS: 'cs_subjects_v1',
  STUDENTS: 'cs_students_v1',
  TEACHERS: 'cs_teachers_v1',
  ATTENDANCE_CONFIGS: 'cs_attendance_configs_v1',
  ATTENDANCE_SUBMISSIONS: 'cs_attendance_submissions_v1',
  ATTENDANCE_CORRECTIONS: 'cs_attendance_corrections_v1',
  ASSIGNMENTS: 'cs_assignments_v1',
  ASSIGNMENT_SUBMISSIONS: 'cs_assignment_submissions_v1',
  STUDY_MATERIALS: 'cs_study_materials_v1',
  EXAMINATIONS: 'cs_examinations_v1',
  EXAM_RESULTS: 'cs_exam_results_v1',
  CALENDAR_EVENTS: 'cs_calendar_events_v1',
  ANNOUNCEMENTS: 'cs_announcements_v1',
  TIMETABLES: 'cs_timetables_v1',
  SUPPORT_TICKETS: 'cs_support_tickets_v1',
  USER_FEEDBACK: 'cs_user_feedback_v1',
  BUG_REPORTS: 'cs_bug_reports_v1',
};

export const DEMO_INVITATIONS: RoleInvitation[] = [
  // Khalsa College of Engineering & Technology
  { id: 'inv-1', institution_id: 'inst-1', code: 'KC-STU-2026', intended_role: 'student', expires_at: '2026-12-31T23:59:59Z', usage_limit: 500, usage_count: 12, is_active: true, created_by: 'Registrar Office' },
  { id: 'inv-2', institution_id: 'inst-1', code: 'KC-FAC-2026', intended_role: 'teacher', department: 'Computer Science', expires_at: '2026-12-31T23:59:59Z', usage_limit: 50, usage_count: 8, is_active: true, created_by: 'Dean Academics' },
  { id: 'inv-3', institution_id: 'inst-1', code: 'KC-WAR-2026', intended_role: 'warden', expires_at: '2026-12-31T23:59:59Z', usage_limit: 10, usage_count: 3, is_active: true, created_by: 'Chief Warden' },
  { id: 'inv-4', institution_id: 'inst-1', code: 'KC-MNT-2026', intended_role: 'maintenance', expires_at: '2026-12-31T23:59:59Z', usage_limit: 20, usage_count: 4, is_active: true, created_by: 'Estate Officer' },
  { id: 'inv-5', institution_id: 'inst-1', code: 'KC-MSS-2026', intended_role: 'mess_manager', expires_at: '2026-12-31T23:59:59Z', usage_limit: 10, usage_count: 2, is_active: true, created_by: 'Hostel Committee' },
  { id: 'inv-6', institution_id: 'inst-1', code: 'KC-ADM-2026', intended_role: 'institution_admin', expires_at: '2026-12-31T23:59:59Z', usage_limit: 5, usage_count: 1, is_active: true, created_by: 'Principal' },

  // Lovely Professional University
  { id: 'inv-7', institution_id: 'inst-2', code: 'LPU-STU-2026', intended_role: 'student', expires_at: '2026-12-31T23:59:59Z', usage_limit: 1000, usage_count: 45, is_active: true, created_by: 'Admissions Cell' },
  { id: 'inv-8', institution_id: 'inst-2', code: 'LPU-FAC-2026', intended_role: 'teacher', expires_at: '2026-12-31T23:59:59Z', usage_limit: 100, usage_count: 15, is_active: true, created_by: 'HR Division' },
  { id: 'inv-9', institution_id: 'inst-2', code: 'LPU-WAR-2026', intended_role: 'warden', expires_at: '2026-12-31T23:59:59Z', usage_limit: 30, usage_count: 6, is_active: true, created_by: 'Residential Services' },

  // Indian Institute of Technology Delhi
  { id: 'inv-10', institution_id: 'inst-3', code: 'IITD-STU-2026', intended_role: 'student', expires_at: '2026-12-31T23:59:59Z', usage_limit: 200, usage_count: 22, is_active: true, created_by: 'Dean of Students' },
  { id: 'inv-11', institution_id: 'inst-3', code: 'IITD-FAC-2026', intended_role: 'teacher', expires_at: '2026-12-31T23:59:59Z', usage_limit: 50, usage_count: 11, is_active: true, created_by: 'Faculty Affairs' },

  // Guru Nanak Dev University
  { id: 'inv-12', institution_id: 'inst-4', code: 'GNDU-STU-2026', intended_role: 'student', expires_at: '2026-12-31T23:59:59Z', usage_limit: 300, usage_count: 18, is_active: true, created_by: 'University Senate' },
];

// Safe LocalStorage helpers
function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    if (typeof localStorage === 'undefined') return defaultValue;
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // safe fallback
  }
}

// AI / Smart Rule-based Category & Priority Classifier
export function suggestComplaintMetadata(title: string, description: string): {
  suggestedCategory: string;
  suggestedPriority: PriorityLevel;
  reason: string;
} {
  const combined = `${title} ${description}`.toLowerCase();

  // Priority detection
  let priority: PriorityLevel = 'MEDIUM';
  if (
    combined.includes('spark') ||
    combined.includes('fire') ||
    combined.includes('short circuit') ||
    combined.includes('smoke') ||
    combined.includes('electric shock') ||
    combined.includes('urgent') ||
    combined.includes('hazard') ||
    combined.includes('emergency')
  ) {
    priority = 'URGENT';
  } else if (
    combined.includes('flood') ||
    combined.includes('overflow') ||
    combined.includes('broken door') ||
    combined.includes('exam') ||
    combined.includes('lock') ||
    combined.includes('water shortage')
  ) {
    priority = 'HIGH';
  } else if (combined.includes('clean') || combined.includes('minor') || combined.includes('paint') || combined.includes('slow')) {
    priority = 'LOW';
  }

  // Category detection
  let category = 'General campus issue';
  let reason = 'CampusSaathi Smart Classifier: standard maintenance issue';

  if (combined.includes('fan') || combined.includes('light') || combined.includes('switch') || combined.includes('bulb') || combined.includes('tube light')) {
    category = 'Fan or lighting';
    reason = 'Keywords detected: lighting, fan, or switch components.';
  } else if (combined.includes('electric') || combined.includes('wire') || combined.includes('socket') || combined.includes('fuse') || combined.includes('spark')) {
    category = 'Electrical';
    reason = 'Keywords detected: electrical infrastructure or safety risk.';
  } else if (combined.includes('water') || combined.includes('tap') || combined.includes('leak') || combined.includes('pipe') || combined.includes('flush')) {
    category = 'Water supply';
    reason = 'Keywords detected: plumbing, taps, or water flow issues.';
  } else if (combined.includes('wifi') || combined.includes('internet') || combined.includes('router') || combined.includes('network') || combined.includes('lan')) {
    category = 'Internet and Wi-Fi';
    reason = 'Keywords detected: wireless or campus local network hardware.';
  } else if (combined.includes('food') || combined.includes('mess') || combined.includes('chapati') || combined.includes('roti') || combined.includes('dal') || combined.includes('meal')) {
    category = 'Mess food quality';
    reason = 'Keywords detected: meal taste, temperature, or dining service.';
  } else if (combined.includes('washroom') || combined.includes('toilet') || combined.includes('bathroom') || combined.includes('cleanliness')) {
    category = 'Washroom cleanliness';
    reason = 'Keywords detected: sanitation and hygiene facilities.';
  } else if (combined.includes('chair') || combined.includes('desk') || combined.includes('table') || combined.includes('bed') || combined.includes('cupboard') || combined.includes('almirah')) {
    category = 'Furniture';
    reason = 'Keywords detected: hostel or classroom furniture repair.';
  } else if (combined.includes('lab') || combined.includes('computer') || combined.includes('projector') || combined.includes('monitor')) {
    category = 'Laboratory';
    reason = 'Keywords detected: department laboratory equipment.';
  }

  return { suggestedCategory: category, suggestedPriority: priority, reason };
}

// Global Store State Class
class CampusStore {
  private institutions: Institution[] = loadFromStorage(STORAGE_KEYS.INSTITUTIONS, DEMO_INSTITUTIONS);
  private complaints: Complaint[] = loadFromStorage(STORAGE_KEYS.COMPLAINTS, DEMO_COMPLAINTS);
  private notifications: Notification[] = loadFromStorage(STORAGE_KEYS.NOTIFICATIONS, DEMO_NOTIFICATIONS);
  private attendance: AttendanceRecord[] = loadFromStorage(STORAGE_KEYS.ATTENDANCE, DEMO_ATTENDANCE);
  private academics: AcademicRecord[] = loadFromStorage(STORAGE_KEYS.ACADEMICS, DEMO_ACADEMICS);
  private parentLinks: ParentStudentLink[] = loadFromStorage(STORAGE_KEYS.PARENT_LINKS, DEMO_PARENT_LINKS);
  private parentRequests: ParentLinkRequest[] = loadFromStorage(STORAGE_KEYS.PARENT_REQUESTS, DEMO_PARENT_REQUESTS);
  private messMenus: MessMenu[] = loadFromStorage(STORAGE_KEYS.MESS_MENUS, DEMO_MESS_MENUS);
  private messFeedback: MessFeedback[] = loadFromStorage(STORAGE_KEYS.MESS_FEEDBACK, DEMO_MESS_FEEDBACK);
  private auditLogs: AuditLog[] = loadFromStorage(STORAGE_KEYS.AUDIT_LOGS, DEMO_AUDIT_LOGS);
  private invitations: RoleInvitation[] = loadFromStorage(STORAGE_KEYS.INVITATIONS, DEMO_INVITATIONS);
  private registeredUsers: UserProfile[] = loadFromStorage(STORAGE_KEYS.USERS, []);
  private credentials: Record<string, string> = loadFromStorage(STORAGE_KEYS.CREDENTIALS, {});
  private courses: Course[] = loadFromStorage(STORAGE_KEYS.COURSES, DEMO_COURSES);
  private sections: Section[] = loadFromStorage(STORAGE_KEYS.SECTIONS, DEMO_SECTIONS);
  private subjects: Subject[] = loadFromStorage(STORAGE_KEYS.SUBJECTS, DEMO_SUBJECTS);
  private students: Student[] = loadFromStorage(STORAGE_KEYS.STUDENTS, DEMO_STUDENT_ROSTER);
  private teachers: Teacher[] = loadFromStorage(STORAGE_KEYS.TEACHERS, DEMO_TEACHERS);
  private attendanceConfigs: AttendanceConfig[] = loadFromStorage(STORAGE_KEYS.ATTENDANCE_CONFIGS, DEMO_ATTENDANCE_CONFIGS);
  private attendanceSubmissions: AttendanceSubmission[] = loadFromStorage(STORAGE_KEYS.ATTENDANCE_SUBMISSIONS, DEMO_ATTENDANCE_SUBMISSIONS);
  private attendanceCorrections: AttendanceCorrectionRequest[] = loadFromStorage(STORAGE_KEYS.ATTENDANCE_CORRECTIONS, DEMO_ATTENDANCE_CORRECTIONS);
  private assignments: Assignment[] = loadFromStorage(STORAGE_KEYS.ASSIGNMENTS, DEMO_ASSIGNMENTS);
  private assignmentSubmissions: AssignmentSubmission[] = loadFromStorage(STORAGE_KEYS.ASSIGNMENT_SUBMISSIONS, DEMO_ASSIGNMENT_SUBMISSIONS);
  private studyMaterials: StudyMaterial[] = loadFromStorage(STORAGE_KEYS.STUDY_MATERIALS, DEMO_STUDY_MATERIALS);
  private examinations: Examination[] = loadFromStorage(STORAGE_KEYS.EXAMINATIONS, DEMO_EXAMINATIONS);
  private examResults: ExamResult[] = loadFromStorage(STORAGE_KEYS.EXAM_RESULTS, DEMO_EXAM_RESULTS);
  private calendarEvents: AcademicCalendarEvent[] = loadFromStorage(STORAGE_KEYS.CALENDAR_EVENTS, DEMO_CALENDAR_EVENTS);
  private announcements: Announcement[] = loadFromStorage(STORAGE_KEYS.ANNOUNCEMENTS, DEMO_ANNOUNCEMENTS);
  private timetables: TimetableSlot[] = loadFromStorage(STORAGE_KEYS.TIMETABLES, DEMO_TIMETABLE);
  private supportTickets: SupportTicket[] = loadFromStorage(STORAGE_KEYS.SUPPORT_TICKETS, DEMO_SUPPORT_TICKETS);
  private userFeedbacks: UserFeedback[] = loadFromStorage(STORAGE_KEYS.USER_FEEDBACK, DEMO_USER_FEEDBACK);
  private bugReports: BugReport[] = loadFromStorage(STORAGE_KEYS.BUG_REPORTS, DEMO_BUG_REPORTS);

  private listeners: (() => void)[] = [];

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // --- INSTITUTIONS ---
  public getInstitutions(): Institution[] {
    return [...this.institutions];
  }

  public registerInstitution(institutionData: Omit<Institution, 'id' | 'status' | 'created_at'>): Institution {
    const newInst: Institution = {
      ...institutionData,
      campus_count: institutionData.campus_count ?? 1,
      id: `inst-${Date.now()}`,
      status: 'PENDING_APPROVAL',
      verification_enabled: false,
      created_at: new Date().toISOString(),
    };
    this.institutions.unshift(newInst);
    saveToStorage(STORAGE_KEYS.INSTITUTIONS, this.institutions);

    // Notify Super Admin
    this.addNotification({
      recipient_user_id: 'usr-superadmin',
      type: 'SYSTEM',
      title: 'New Institution Application',
      message: `${newInst.name} has submitted an affiliation application for review.`,
      related_id: newInst.id,
    });

    this.addAuditLog({
      actor_name: institutionData.official_email,
      actor_role: 'institution_admin',
      action: 'REGISTER_INSTITUTION',
      resource_type: 'Institution',
      details: `Submitted registration for ${newInst.name} (${newInst.city}, ${newInst.state})`,
    });

    this.notify();
    return newInst;
  }

  public updateInstitutionStatus(id: string, status: 'APPROVED' | 'REJECTED' | 'SUSPENDED'): void {
    this.institutions = this.institutions.map((inst) =>
      inst.id === id
        ? {
            ...inst,
            status,
            verification_enabled: status === 'APPROVED',
            updated_at: new Date().toISOString(),
          }
        : inst
    );
    saveToStorage(STORAGE_KEYS.INSTITUTIONS, this.institutions);

    this.addAuditLog({
      actor_name: 'Dr. Rajesh Sharma (Platform Superadmin)',
      actor_role: 'platform_admin',
      action: 'UPDATE_INSTITUTION_STATUS',
      resource_type: 'Institution',
      details: `Updated institution ${id} status to ${status}`,
    });

    this.notify();
  }

  public toggleInstitutionVerification(
    id: string,
    enabled: boolean,
    actorRole: UserRole = 'platform_admin',
    actorName: string = 'Dr. Rajesh Sharma (Platform Superadmin)'
  ): { success: boolean; message: string; institution?: Institution } {
    if (actorRole !== 'platform_admin') {
      console.warn('Unauthorized attempt to toggle tenant verification');
      this.addAuditLog({
        actor_name: actorName,
        actor_role: actorRole,
        action: 'SECURITY_ALERT',
        resource_type: 'Institution',
        details: `Unauthorized attempt by ${actorRole} (${actorName}) to toggle verification on tenant ${id}`,
      });
      return {
        success: false,
        message: 'Unauthorized: Only Platform Super Administrators can toggle tenant verification.',
      };
    }

    const inst = this.institutions.find((i) => i.id === id);
    if (!inst) {
      return { success: false, message: 'Institution tenant not found.' };
    }

    const nextStatus = enabled ? 'APPROVED' : (inst.status === 'APPROVED' ? 'PENDING_APPROVAL' : inst.status);

    let updatedInst: Institution | undefined;
    this.institutions = this.institutions.map((i) => {
      if (i.id === id) {
        updatedInst = {
          ...i,
          verification_enabled: enabled,
          status: nextStatus,
          updated_at: new Date().toISOString(),
        };
        return updatedInst;
      }
      return i;
    });

    saveToStorage(STORAGE_KEYS.INSTITUTIONS, this.institutions);

    this.addAuditLog({
      actor_name: actorName,
      actor_role: 'platform_admin',
      action: 'TOGGLE_TENANT_VERIFICATION',
      resource_type: 'Institution',
      details: `Tenant verification ${enabled ? 'ENABLED (ON)' : 'DISABLED (OFF)'} for ${inst.name} (${inst.code}) by ${actorName}`,
    });

    this.notify();
    return {
      success: true,
      message: `Tenant verification ${enabled ? 'enabled (ON)' : 'disabled (OFF)'} successfully.`,
      institution: updatedInst,
    };
  }

  public updateInstitutionBranding(
    id: string,
    branding: Partial<Omit<Institution, 'id' | 'code' | 'created_at'>>,
    actorName: string = 'Campus Administrator',
    actorRole: UserRole = 'institution_admin'
  ): boolean {
    if (actorRole !== 'institution_admin' && actorRole !== 'platform_admin') {
      console.warn('Unauthorized attempt to update institution branding');
      return false;
    }

    const inst = this.institutions.find((i) => i.id === id);
    if (!inst) return false;

    this.institutions = this.institutions.map((i) =>
      i.id === id
        ? {
            ...i,
            ...branding,
            updated_at: new Date().toISOString(),
          }
        : i
    );
    saveToStorage(STORAGE_KEYS.INSTITUTIONS, this.institutions);

    this.addAuditLog({
      actor_name: actorName,
      actor_role: actorRole,
      action: 'UPDATE_INSTITUTION_BRANDING',
      resource_type: 'Institution',
      details: `Updated branding & campus background for ${inst.name}`,
    });

    this.notify();
    return true;
  }

  // --- COMPLAINTS ---
  public getComplaints(institutionId?: string): Complaint[] {
    if (institutionId) {
      return this.complaints.filter((c) => c.institution_id === institutionId);
    }
    return [...this.complaints];
  }

  public getComplaintById(id: string): Complaint | undefined {
    return this.complaints.find((c) => c.id === id);
  }

  // Duplicate Check logic: category, building, floor within institution
  public checkForDuplicates(complaint: { institution_id: string; category: string; building: string; floor?: string }): Complaint | undefined {
    return this.complaints.find((c) =>
      c.institution_id === complaint.institution_id &&
      c.category.toLowerCase() === complaint.category.toLowerCase() &&
      c.building.toLowerCase() === complaint.building.toLowerCase() &&
      c.status !== 'RESOLVED' &&
      c.status !== 'CANCELLED' &&
      c.status !== 'REJECTED'
    );
  }

  public submitComplaint(data: {
    institution_id: string;
    student: UserProfile;
    category: string;
    title: string;
    description: string;
    building: string;
    block?: string;
    floor?: string;
    room_number?: string;
    suggested_priority: PriorityLevel;
    problem_photo_url?: string;
  }): Complaint {
    const nextSeq = 1000 + this.complaints.length + 1;
    const refNo = `CS-2026-${nextSeq}`;

    // Duplicate check
    const existingDupe = this.checkForDuplicates({
      institution_id: data.institution_id,
      category: data.category,
      building: data.building,
      floor: data.floor,
    });

    const newComplaint: Complaint = {
      id: `cmp-${Date.now()}`,
      reference_no: refNo,
      institution_id: data.institution_id,
      campus_name: 'Main Campus',
      student_id: DEMO_STUDENT.id,
      student_name: data.student.full_name,
      student_roll: DEMO_STUDENT.roll_no,
      category: data.category,
      title: data.title,
      description: data.description,
      building: data.building,
      block: data.block,
      floor: data.floor,
      room_number: data.room_number,
      suggested_priority: data.suggested_priority,
      official_priority: data.suggested_priority,
      status: 'SUBMITTED',
      problem_photo_url: data.problem_photo_url,
      is_duplicate_of: existingDupe?.reference_no,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status_history: [
        {
          id: `h-${Date.now()}`,
          complaint_id: `cmp-${Date.now()}`,
          new_status: 'SUBMITTED',
          changed_by_name: data.student.full_name,
          comment: 'Grievance submitted by student with problem evidence',
          timestamp: new Date().toISOString(),
        },
      ],
    };

    this.complaints.unshift(newComplaint);
    saveToStorage(STORAGE_KEYS.COMPLAINTS, this.complaints);

    // Notify Warden & Maintenance Staff
    this.addNotification({
      recipient_user_id: 'usr-warden',
      institution_id: data.institution_id,
      type: 'COMPLAINT_UPDATE',
      title: `New Grievance: ${newComplaint.reference_no}`,
      message: `${newComplaint.category} reported at ${newComplaint.building} (${newComplaint.official_priority})`,
      related_id: newComplaint.id,
    });

    this.addAuditLog({
      actor_name: data.student.full_name,
      actor_role: 'student',
      action: 'SUBMIT_COMPLAINT',
      resource_type: 'Complaint',
      details: `Created grievance ${refNo} at ${data.building} [${data.category}]`,
    });

    this.notify();
    return newComplaint;
  }

  // Warden Action: Assign staff
  public assignComplaint(
    complaintId: string,
    staffId: string,
    staffName: string,
    officialPriority: PriorityLevel,
    instructions: string,
    wardenName: string
  ): void {
    const complaint = this.complaints.find((c) => c.id === complaintId);
    if (!complaint) return;

    complaint.assigned_to_staff_id = staffId;
    complaint.assigned_staff_name = staffName;
    complaint.official_priority = officialPriority;
    complaint.status = 'ASSIGNED';
    complaint.updated_at = new Date().toISOString();

    complaint.status_history.push({
      id: `h-${Date.now()}`,
      complaint_id: complaint.id,
      previous_status: 'UNDER_REVIEW',
      new_status: 'ASSIGNED',
      changed_by_name: wardenName,
      comment: `Assigned to ${staffName}. Priority: ${officialPriority}. Instructions: ${instructions}`,
      timestamp: new Date().toISOString(),
    });

    saveToStorage(STORAGE_KEYS.COMPLAINTS, this.complaints);

    // Notify assigned staff
    this.addNotification({
      recipient_user_id: staffId,
      institution_id: complaint.institution_id,
      type: 'ASSIGNMENT',
      title: `Task Assigned: ${complaint.reference_no}`,
      message: `${wardenName} assigned you work order at ${complaint.building} (${complaint.room_number || 'Common area'})`,
      related_id: complaint.id,
    });

    // Notify student
    this.addNotification({
      recipient_user_id: 'usr-student',
      institution_id: complaint.institution_id,
      type: 'COMPLAINT_UPDATE',
      title: `Grievance Assigned: ${complaint.reference_no}`,
      message: `Your complaint is now assigned to ${staffName}.`,
      related_id: complaint.id,
    });

    this.notify();
  }

  // Maintenance Staff Action: Update Work Order / Upload Resolution Proof
  public updateWorkOrder(
    complaintId: string,
    newStatus: 'IN_PROGRESS' | 'AWAITING_VERIFICATION',
    notes: string,
    resolutionPhotoUrl: string | undefined,
    staffName: string
  ): void {
    const complaint = this.complaints.find((c) => c.id === complaintId);
    if (!complaint) return;

    const prevStatus = complaint.status;
    complaint.status = newStatus;
    complaint.updated_at = new Date().toISOString();

    if (resolutionPhotoUrl) {
      complaint.resolution_photo_url = resolutionPhotoUrl;
    }
    if (notes) {
      complaint.resolution_notes = notes;
    }

    complaint.status_history.push({
      id: `h-${Date.now()}`,
      complaint_id: complaint.id,
      previous_status: prevStatus,
      new_status: newStatus,
      changed_by_name: staffName,
      comment: notes,
      resolution_photo_url: resolutionPhotoUrl,
      timestamp: new Date().toISOString(),
    });

    saveToStorage(STORAGE_KEYS.COMPLAINTS, this.complaints);

    if (newStatus === 'AWAITING_VERIFICATION') {
      // Notify Warden to inspect and verify resolution
      this.addNotification({
        recipient_user_id: 'usr-warden',
        institution_id: complaint.institution_id,
        type: 'COMPLAINT_UPDATE',
        title: `Verification Requested: ${complaint.reference_no}`,
        message: `${staffName} has completed work and submitted photo proof for verification.`,
        related_id: complaint.id,
      });
    }

    this.notify();
  }

  // Warden Verification: Approve resolution or Reopen
  public verifyResolution(
    complaintId: string,
    decision: 'RESOLVE' | 'REOPEN',
    wardenName: string,
    notes: string
  ): void {
    const complaint = this.complaints.find((c) => c.id === complaintId);
    if (!complaint) return;

    const prev = complaint.status;
    const newStatus: ComplaintStatus = decision === 'RESOLVE' ? 'RESOLVED' : 'REOPENED';
    complaint.status = newStatus;
    complaint.updated_at = new Date().toISOString();

    if (decision === 'RESOLVE') {
      complaint.resolved_at = new Date().toISOString();
      complaint.verified_warden_name = wardenName;
      complaint.verified_by_warden_id = 'usr-warden';
    }

    complaint.status_history.push({
      id: `h-${Date.now()}`,
      complaint_id: complaint.id,
      previous_status: prev,
      new_status: newStatus,
      changed_by_name: wardenName,
      comment: notes || (decision === 'RESOLVE' ? 'Resolution verified and accepted' : 'Rework requested'),
      timestamp: new Date().toISOString(),
    });

    saveToStorage(STORAGE_KEYS.COMPLAINTS, this.complaints);

    // Notify student
    this.addNotification({
      recipient_user_id: 'usr-student',
      institution_id: complaint.institution_id,
      type: 'COMPLAINT_UPDATE',
      title: decision === 'RESOLVE' ? `Issue Resolved: ${complaint.reference_no}` : `Grievance Reopened: ${complaint.reference_no}`,
      message: decision === 'RESOLVE' ? `Warden ${wardenName} has verified and marked your grievance resolved.` : `Issue reopened for further maintenance: ${notes}`,
      related_id: complaint.id,
    });

    this.notify();
  }

  // --- ATTENDANCE ---
  public getAttendance(): AttendanceRecord[] {
    return [...this.attendance];
  }

  public recordAttendanceBatch(
    records: Omit<AttendanceRecord, 'id'>[]
  ): void {
    const newRecords: AttendanceRecord[] = records.map((r, i) => ({
      ...r,
      id: `att-${Date.now()}-${i}`,
    }));
    this.attendance = [...newRecords, ...this.attendance];
    saveToStorage(STORAGE_KEYS.ATTENDANCE, this.attendance);

    this.addAuditLog({
      actor_name: records[0]?.recorded_by_name || 'Faculty',
      actor_role: 'teacher',
      action: 'RECORD_ATTENDANCE_BATCH',
      resource_type: 'Attendance',
      details: `Logged session attendance for subject: ${records[0]?.subject_name} (${records.length} students)`,
    });

    this.notify();
  }

  // --- ACADEMICS ---
  public getAcademics(): AcademicRecord[] {
    return [...this.academics];
  }

  // --- PARENT PORTAL & LINKING ---
  public getParentLinks(parentId: string): ParentStudentLink[] {
    return this.parentLinks.filter((l) => l.parent_user_id === parentId && l.status === 'APPROVED');
  }

  public getParentRequests(): ParentLinkRequest[] {
    return [...this.parentRequests];
  }

  public submitParentLinkRequest(data: {
    parent: UserProfile;
    institution_id: string;
    student_enrollment_no: string;
    student_name: string;
    verification_pin: string;
    relationship_type: 'FATHER' | 'MOTHER' | 'GUARDIAN';
  }): ParentLinkRequest {
    const newReq: ParentLinkRequest = {
      id: `req-${Date.now()}`,
      parent_user_id: data.parent.id,
      parent_name: data.parent.full_name,
      parent_email: data.parent.email,
      institution_id: data.institution_id,
      student_enrollment_no: data.student_enrollment_no,
      student_name: data.student_name,
      verification_pin: data.verification_pin,
      relationship_type: data.relationship_type,
      status: 'PENDING',
      created_at: new Date().toISOString(),
    };

    this.parentRequests.unshift(newReq);
    saveToStorage(STORAGE_KEYS.PARENT_REQUESTS, this.parentRequests);

    // Notify Institution Admin
    this.addNotification({
      recipient_user_id: 'usr-admin',
      institution_id: data.institution_id,
      type: 'LINK_REQUEST',
      title: 'Parent-Student Link Request',
      message: `${data.parent.full_name} requested connection to student ${data.student_name} (${data.student_enrollment_no}).`,
      related_id: newReq.id,
    });

    this.notify();
    return newReq;
  }

  public approveParentLinkRequest(requestId: string, adminName: string): void {
    const req = this.parentRequests.find((r) => r.id === requestId);
    if (!req) return;

    req.status = 'APPROVED';
    saveToStorage(STORAGE_KEYS.PARENT_REQUESTS, this.parentRequests);

    // Create approved link
    const newLink: ParentStudentLink = {
      id: `link-${Date.now()}`,
      parent_user_id: req.parent_user_id,
      student_id: DEMO_STUDENT.id,
      student: DEMO_STUDENT,
      institution_id: req.institution_id,
      relationship_type: req.relationship_type,
      status: 'APPROVED',
      verified_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    this.parentLinks.push(newLink);
    saveToStorage(STORAGE_KEYS.PARENT_LINKS, this.parentLinks);

    // Notify parent
    this.addNotification({
      recipient_user_id: req.parent_user_id,
      institution_id: req.institution_id,
      type: 'SYSTEM',
      title: 'Parent Verification Approved',
      message: `Your linking request for ${req.student_name} has been verified and approved by ${adminName}.`,
    });

    this.notify();
  }

  // --- MESS MANAGEMENT ---
  public getMessMenus(institutionId?: string): MessMenu[] {
    if (institutionId) {
      return this.messMenus.filter((m) => m.institution_id === institutionId);
    }
    return [...this.messMenus];
  }

  public updateMessMenu(id: string, menuItems: string, dietaryNotes?: string): void {
    this.messMenus = this.messMenus.map((m) =>
      m.id === id ? { ...m, menu_items: menuItems, dietary_notes: dietaryNotes } : m
    );
    saveToStorage(STORAGE_KEYS.MESS_MENUS, this.messMenus);
    this.notify();
  }

  public getMessFeedback(): MessFeedback[] {
    return [...this.messFeedback];
  }

  public submitMessFeedback(feedback: Omit<MessFeedback, 'id' | 'created_at'>): void {
    const newFb: MessFeedback = {
      ...feedback,
      id: `fb-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.messFeedback.unshift(newFb);
    saveToStorage(STORAGE_KEYS.MESS_FEEDBACK, this.messFeedback);

    this.addNotification({
      recipient_user_id: 'usr-mess',
      type: 'SYSTEM',
      title: 'New Mess Meal Feedback',
      message: `${feedback.student_name} rated ${feedback.meal_type} with ${feedback.rating} stars [${feedback.category}]`,
      related_id: newFb.id,
    });

    this.notify();
  }

  // --- NOTIFICATIONS ---
  public getNotifications(userId: string): Notification[] {
    return this.notifications.filter((n) => n.recipient_user_id === userId);
  }

  public markNotificationRead(id: string): void {
    this.notifications = this.notifications.map((n) =>
      n.id === id ? { ...n, is_read: true } : n
    );
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    this.notify();
  }

  public markAllNotificationsRead(userId: string): void {
    this.notifications = this.notifications.map((n) =>
      n.recipient_user_id === userId ? { ...n, is_read: true } : n
    );
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    this.notify();
  }

  private addNotification(notif: Omit<Notification, 'id' | 'is_read' | 'created_at'>): void {
    const newN: Notification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    this.notifications.unshift(newN);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
  }

  // --- AUDIT LOGS ---
  public getAuditLogs(): AuditLog[] {
    return [...this.auditLogs];
  }

  private addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): void {
    const newLog: AuditLog = {
      ...log,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(newLog);
    saveToStorage(STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);
  }

  // --- ROLE INVITATIONS & VERIFICATION CODES (PART 12) ---
  public getRoleInvitations(institutionId?: string): RoleInvitation[] {
    if (!institutionId) return [...this.invitations];
    return this.invitations.filter((inv) => inv.institution_id === institutionId);
  }

  public validateRoleInvitation(
    institutionId: string,
    role: UserRole,
    code: string
  ): { valid: boolean; message: string; invitation?: RoleInvitation } {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { valid: false, message: 'Please provide a valid invitation or verification code.' };
    }

    const invitation = this.invitations.find(
      (inv) => inv.code.trim().toUpperCase() === cleanCode
    );

    if (!invitation) {
      return { valid: false, message: 'Invalid verification code. Please check with your campus administrator.' };
    }

    if (invitation.institution_id !== institutionId) {
      return {
        valid: false,
        message: 'This verification code belongs to a different institution. Cross-campus registration is restricted.',
      };
    }

    if (invitation.intended_role !== role) {
      return {
        valid: false,
        message: `This verification code is authorized for ${invitation.intended_role.replace('_', ' ')} registration, not ${role.replace('_', ' ')}.`,
      };
    }

    if (!invitation.is_active) {
      return { valid: false, message: 'This invitation code has been revoked or deactivated.' };
    }

    if (new Date(invitation.expires_at) < new Date()) {
      return { valid: false, message: 'This invitation code has expired.' };
    }

    if (invitation.usage_count >= invitation.usage_limit) {
      return { valid: false, message: 'This invitation code has reached its maximum usage limit.' };
    }

    return { valid: true, message: 'Code successfully verified.', invitation };
  }

  public registerUserWithRole(
    payload: RoleRegistrationPayload
  ): { success: boolean; message: string; user?: UserProfile } {
    // 1. Guardrail against self-registering Platform Super Admin
    if (payload.role === 'platform_admin') {
      return {
        success: false,
        message: 'Platform Super Admin accounts cannot be self-registered publicly. Provisioning requires root server authorization.',
      };
    }

    const institution = this.institutions.find((i) => i.id === payload.institution_id);
    if (!institution) {
      return { success: false, message: 'Selected institution not found or inactive.' };
    }

    // 2. Roles requiring verification codes (Faculty, Warden, Maintenance, Mess Manager, Institution Admin)
    const requiresCode = ['teacher', 'warden', 'maintenance', 'mess_manager', 'institution_admin'].includes(
      payload.role
    );

    if (requiresCode) {
      if (!payload.verification_code) {
        return {
          success: false,
          message: `An official campus invitation or authorization code is mandatory for ${payload.role.replace('_', ' ')} registration.`,
        };
      }

      const val = this.validateRoleInvitation(payload.institution_id, payload.role, payload.verification_code);
      if (!val.valid) {
        return { success: false, message: val.message };
      }

      // Increment usage count of the invitation code
      if (val.invitation) {
        val.invitation.usage_count += 1;
        saveToStorage(STORAGE_KEYS.INVITATIONS, this.invitations);
      }
    } else if (payload.verification_code && payload.role === 'student') {
      // Optional student verification code check
      const val = this.validateRoleInvitation(payload.institution_id, payload.role, payload.verification_code);
      if (!val.valid) {
        return { success: false, message: val.message };
      }
      if (val.invitation) {
        val.invitation.usage_count += 1;
        saveToStorage(STORAGE_KEYS.INVITATIONS, this.invitations);
      }
    }

    // 3. Create User Profile
    const newUser: UserProfile = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      email: payload.email.trim().toLowerCase(),
      full_name: payload.full_name.trim(),
      role: payload.role,
      institution_id: payload.institution_id,
      institution_name: institution.name,
      department_name: payload.department || (payload.role === 'student' ? 'Computer Science & Engineering' : undefined),
      is_active: true,
      created_at: new Date().toISOString(),
    };

    this.registeredUsers.unshift(newUser);
    saveToStorage(STORAGE_KEYS.USERS, this.registeredUsers);

    if (payload.password) {
      this.credentials[payload.email.trim().toLowerCase()] = payload.password;
      saveToStorage(STORAGE_KEYS.CREDENTIALS, this.credentials);
    }

    if (isLiveSupabaseConfigured && payload.password) {
      supabase.auth.signUp({
        email: payload.email.trim().toLowerCase(),
        password: payload.password,
        options: {
          data: {
            full_name: payload.full_name.trim(),
            role: payload.role,
            institution_id: payload.institution_id,
          },
        },
      }).catch((e) => console.warn('[Supabase Auth Sync] signUp error:', e));
    }

    // 4. Role-specific record creation
    if (payload.role === 'parent' && payload.student_reference) {
      this.submitParentLinkRequest({
        parent: newUser,
        institution_id: payload.institution_id,
        student_enrollment_no: payload.student_reference,
        student_name: 'Enrolled Student',
        verification_pin: payload.verification_code || '9999',
        relationship_type: payload.relationship_type || 'GUARDIAN',
      });
    }

    // 5. Audit Log
    this.addAuditLog({
      institution_id: payload.institution_id,
      actor_name: newUser.full_name,
      actor_role: payload.role,
      action: 'USER_REGISTRATION',
      resource_type: 'AUTH',
      details: `New ${payload.role.replace('_', ' ')} registered for ${institution.name} (${institution.code})`,
    });

    this.notify();

    return {
      success: true,
      message: `Registration successful! You are authorized as ${payload.role.replace('_', ' ')} at ${institution.name}.`,
      user: newUser,
    };
  }

  public getRegisteredUsers(): UserProfile[] {
    return [...this.registeredUsers];
  }

  public getUserByEmail(email: string): UserProfile | undefined {
    const norm = email.trim().toLowerCase();
    const demo = Object.values(DEMO_USERS).find((u) => u.email.toLowerCase() === norm);
    if (demo) return demo;
    return this.registeredUsers.find((u) => u.email.toLowerCase() === norm);
  }

  public getUserRoleByEmail(email: string): UserRole | undefined {
    return this.getUserByEmail(email)?.role;
  }

  public authenticateUser(
    email: string,
    pass: string
  ): { success: boolean; user?: UserProfile; message?: string } {
    const norm = email.trim().toLowerCase();
    const demo = Object.values(DEMO_USERS).find((u) => u.email.toLowerCase() === norm);
    if (demo) {
      if (!pass || pass.trim() !== 'password123') {
        return { success: false, message: 'Invalid password. Demo accounts use password123' };
      }
      return { success: true, user: demo };
    }

    const registered = this.registeredUsers.find((u) => u.email.toLowerCase() === norm);
    if (registered) {
      const storedPass = this.credentials[norm];
      if (storedPass && storedPass !== pass) {
        return { success: false, message: 'Incorrect password for registered account.' };
      }
      return { success: true, user: registered };
    }

    return {
      success: false,
      message: 'No account found for this email. Please register your role first.',
    };
  }

  // ========================================================
  // ACADEMIC STRUCTURE & MANAGEMENT
  // ========================================================

  public getCourses(institutionId?: string): Course[] {
    if (institutionId) {
      return this.courses.filter((c) => c.institution_id === institutionId);
    }
    return [...this.courses];
  }

  public addCourse(data: Omit<Course, 'id'>): Course {
    const newCourse: Course = {
      ...data,
      id: `course-${Date.now()}`,
    };
    this.courses.unshift(newCourse);
    saveToStorage(STORAGE_KEYS.COURSES, this.courses);
    this.addAuditLog({
      institution_id: data.institution_id,
      actor_name: 'College Administrator',
      actor_role: 'institution_admin',
      action: 'ADD_COURSE',
      resource_type: 'Course',
      details: `Created new course curriculum: ${data.name} (${data.code})`,
    });
    this.notify();
    return newCourse;
  }

  public getSections(institutionId?: string, courseName?: string, semester?: number): Section[] {
    let result = this.sections;
    if (institutionId) result = result.filter((s) => s.institution_id === institutionId);
    if (courseName) result = result.filter((s) => s.course_name === courseName);
    if (semester !== undefined) result = result.filter((s) => s.semester === semester);
    return [...result];
  }

  public addSection(data: Omit<Section, 'id'>): Section {
    const newSection: Section = {
      ...data,
      id: `sec-${Date.now()}`,
    };
    this.sections.push(newSection);
    saveToStorage(STORAGE_KEYS.SECTIONS, this.sections);
    this.notify();
    return newSection;
  }

  public getSubjects(institutionId?: string, courseName?: string, semester?: number): Subject[] {
    let list = this.subjects;
    if (institutionId) list = list.filter((s) => s.institution_id === institutionId);
    if (courseName) list = list.filter((s) => s.course_name === courseName);
    if (semester !== undefined) list = list.filter((s) => s.semester === semester);
    return [...list];
  }

  public addSubject(data: Omit<Subject, 'id'>): Subject {
    const newSubject: Subject = {
      ...data,
      id: `sub-${Date.now()}`,
    };
    this.subjects.push(newSubject);
    saveToStorage(STORAGE_KEYS.SUBJECTS, this.subjects);
    this.addAuditLog({
      institution_id: data.institution_id,
      actor_name: 'College Administrator',
      actor_role: 'institution_admin',
      action: 'ADD_SUBJECT',
      resource_type: 'Subject',
      details: `Added subject ${data.name} (${data.code}) to ${data.course_name} Sem ${data.semester}`,
    });
    this.notify();
    return newSubject;
  }

  public assignSubjectTeacher(subjectId: string, teacherId: string, teacherName: string): boolean {
    const sub = this.subjects.find((s) => s.id === subjectId);
    if (!sub) return false;
    sub.teacher_id = teacherId;
    sub.teacher_name = teacherName;
    saveToStorage(STORAGE_KEYS.SUBJECTS, this.subjects);

    // Also update teacher assigned_subjects
    const teacher = this.teachers.find((t) => t.id === teacherId || t.user_id === teacherId);
    if (teacher && !teacher.assigned_subjects.includes(sub.name)) {
      teacher.assigned_subjects.push(sub.name);
      saveToStorage(STORAGE_KEYS.TEACHERS, this.teachers);
    }

    this.notify();
    return true;
  }

  // ========================================================
  // TEACHERS & STUDENTS MANAGEMENT
  // ========================================================

  public getTeachers(institutionId?: string): Teacher[] {
    if (institutionId) {
      return this.teachers.filter((t) => t.institution_id === institutionId);
    }
    return [...this.teachers];
  }

  public addTeacher(data: Omit<Teacher, 'id' | 'joined_date'>): Teacher {
    const newTeacher: Teacher = {
      ...data,
      id: `tch-${Date.now()}`,
      joined_date: new Date().toISOString().split('T')[0],
    };
    this.teachers.unshift(newTeacher);
    saveToStorage(STORAGE_KEYS.TEACHERS, this.teachers);
    this.addAuditLog({
      institution_id: data.institution_id,
      actor_name: 'College Administrator',
      actor_role: 'institution_admin',
      action: 'ADD_TEACHER',
      resource_type: 'Teacher',
      details: `Appointed faculty member: ${data.full_name} (${data.employee_id}, ${data.department})`,
    });
    this.notify();
    return newTeacher;
  }

  public updateTeacherAssignments(teacherId: string, assignedSubjects: string[], assignedClasses: string[]): boolean {
    const teacher = this.teachers.find((t) => t.id === teacherId || t.user_id === teacherId);
    if (!teacher) return false;
    teacher.assigned_subjects = assignedSubjects;
    teacher.assigned_classes = assignedClasses;
    saveToStorage(STORAGE_KEYS.TEACHERS, this.teachers);
    this.notify();
    return true;
  }

  public getStudents(institutionId?: string, courseName?: string, semester?: number): Student[] {
    let list = this.students;
    if (institutionId) list = list.filter((s) => s.institution_id === institutionId);
    if (courseName) list = list.filter((s) => s.course_name === courseName);
    if (semester !== undefined) list = list.filter((s) => s.current_semester === semester);
    return [...list];
  }

  public addStudent(data: Omit<Student, 'id' | 'overall_attendance'>): Student {
    const newStudent: Student = {
      ...data,
      id: `stu-${Date.now()}`,
      overall_attendance: 100.0,
    };
    this.students.unshift(newStudent);
    saveToStorage(STORAGE_KEYS.STUDENTS, this.students);
    this.addAuditLog({
      institution_id: data.institution_id,
      actor_name: 'College Administrator',
      actor_role: 'institution_admin',
      action: 'ENROLL_STUDENT',
      resource_type: 'Student',
      details: `Enrolled student ${data.full_name} (Roll: ${data.roll_no}, Enrollment: ${data.enrollment_no})`,
    });
    this.notify();
    return newStudent;
  }

  public getStudentByRoll(institutionId: string, rollNo: string): Student | undefined {
    return this.students.find(
      (s) => s.institution_id === institutionId && s.roll_no.trim().toUpperCase() === rollNo.trim().toUpperCase()
    );
  }

  // ========================================================
  // ATTENDANCE MANAGEMENT & VALIDATION ENGINE
  // ========================================================

  public getAttendanceConfig(institutionId: string): AttendanceConfig {
    const cfg = this.attendanceConfigs.find((c) => c.institution_id === institutionId);
    if (cfg) return cfg;
    return {
      id: `cfg-${institutionId}`,
      institution_id: institutionId,
      frequency: '15_DAY',
      approval_required: true,
      current_period_name: 'Cycle 2 (16th Oct - 31st Oct 2026)',
      period_start_date: '2026-10-16',
      period_end_date: '2026-10-31',
      submission_deadline: '2026-11-03',
      late_submission_policy: 'Late submission requires Dean clearance',
    };
  }

  public updateAttendanceConfig(institutionId: string, config: Partial<AttendanceConfig>): AttendanceConfig {
    const existing = this.attendanceConfigs.find((c) => c.institution_id === institutionId);
    let updated: AttendanceConfig;
    if (existing) {
      Object.assign(existing, config);
      updated = existing;
    } else {
      updated = {
        id: `cfg-${institutionId}`,
        institution_id: institutionId,
        frequency: config.frequency || '15_DAY',
        approval_required: config.approval_required ?? true,
        current_period_name: config.current_period_name || 'Active Term Cycle',
        period_start_date: config.period_start_date || '2026-10-16',
        period_end_date: config.period_end_date || '2026-10-31',
        submission_deadline: config.submission_deadline || '2026-11-03',
        late_submission_policy: config.late_submission_policy || 'Standard college policy',
      };
      this.attendanceConfigs.push(updated);
    }
    saveToStorage(STORAGE_KEYS.ATTENDANCE_CONFIGS, this.attendanceConfigs);
    this.addAuditLog({
      institution_id: institutionId,
      actor_name: 'College Administrator',
      actor_role: 'institution_admin',
      action: 'UPDATE_ATTENDANCE_CONFIG',
      resource_type: 'AttendanceConfig',
      details: `Updated submission schedule: ${updated.frequency} (${updated.current_period_name})`,
    });
    this.notify();
    return updated;
  }

  public getAttendanceSubmissions(institutionId?: string): AttendanceSubmission[] {
    if (institutionId) {
      return this.attendanceSubmissions.filter((s) => s.institution_id === institutionId);
    }
    return [...this.attendanceSubmissions];
  }

  public submitAttendanceReport(
    report: Omit<AttendanceSubmission, 'id' | 'submission_date' | 'status'>
  ): AttendanceSubmission {
    const config = this.getAttendanceConfig(report.institution_id);
    const initialStatus: 'PENDING_APPROVAL' | 'APPROVED' = config.approval_required ? 'PENDING_APPROVAL' : 'APPROVED';

    const newSubm: AttendanceSubmission = {
      ...report,
      id: `subm-${Date.now()}`,
      status: initialStatus,
      submission_date: new Date().toISOString(),
    };

    this.attendanceSubmissions.unshift(newSubm);
    saveToStorage(STORAGE_KEYS.ATTENDANCE_SUBMISSIONS, this.attendanceSubmissions);

    // Notify College Admin
    this.addNotification({
      recipient_user_id: 'usr-admin',
      institution_id: report.institution_id,
      type: 'SYSTEM',
      title: 'Attendance Report Submitted for Review',
      message: `${report.teacher_name} submitted ${report.frequency} attendance for ${report.subject_name} (${report.period_name})`,
      related_id: newSubm.id,
    });

    this.addAuditLog({
      institution_id: report.institution_id,
      actor_name: report.teacher_name,
      actor_role: 'teacher',
      action: 'SUBMIT_ATTENDANCE_REPORT',
      resource_type: 'AttendanceSubmission',
      details: `Submitted ${report.frequency} report for ${report.subject_name} [${report.total_records} records, Avg: ${report.average_attendance_pct}%]`,
    });

    this.notify();
    return newSubm;
  }

  public reviewAttendanceSubmission(
    submissionId: string,
    decision: 'APPROVE' | 'REJECT',
    reviewedBy: string,
    rejectionReason?: string
  ): boolean {
    const subm = this.attendanceSubmissions.find((s) => s.id === submissionId);
    if (!subm) return false;

    subm.status = decision === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    subm.reviewed_by = reviewedBy;
    subm.reviewed_at = new Date().toISOString();
    if (decision === 'REJECT') {
      subm.rejection_reason = rejectionReason || 'Discrepancy in recorded session counts';
    }

    saveToStorage(STORAGE_KEYS.ATTENDANCE_SUBMISSIONS, this.attendanceSubmissions);

    // Notify Teacher
    this.addNotification({
      recipient_user_id: subm.teacher_id,
      institution_id: subm.institution_id,
      type: 'SYSTEM',
      title: decision === 'APPROVE' ? 'Attendance Report Approved' : 'Attendance Report Rejected',
      message:
        decision === 'APPROVE'
          ? `Your attendance report for ${subm.subject_name} (${subm.period_name}) has been approved by ${reviewedBy}.`
          : `Your attendance report for ${subm.subject_name} was rejected: ${subm.rejection_reason}`,
      related_id: subm.id,
    });

    this.addAuditLog({
      institution_id: subm.institution_id,
      actor_name: reviewedBy,
      actor_role: 'institution_admin',
      action: decision === 'APPROVE' ? 'APPROVE_ATTENDANCE' : 'REJECT_ATTENDANCE',
      resource_type: 'AttendanceSubmission',
      details: `${decision} attendance report ${subm.id} for ${subm.subject_name}`,
    });

    this.notify();
    return true;
  }

  public getAttendanceCorrections(institutionId?: string): AttendanceCorrectionRequest[] {
    if (institutionId) {
      return this.attendanceCorrections.filter((c) => c.institution_id === institutionId);
    }
    return [...this.attendanceCorrections];
  }

  public requestAttendanceCorrection(
    data: Omit<AttendanceCorrectionRequest, 'id' | 'requested_at' | 'status'>
  ): AttendanceCorrectionRequest {
    const newCorr: AttendanceCorrectionRequest = {
      ...data,
      id: `corr-${Date.now()}`,
      status: 'PENDING',
      requested_at: new Date().toISOString(),
    };
    this.attendanceCorrections.unshift(newCorr);
    saveToStorage(STORAGE_KEYS.ATTENDANCE_CORRECTIONS, this.attendanceCorrections);

    // Notify College Admin
    this.addNotification({
      recipient_user_id: 'usr-admin',
      institution_id: data.institution_id,
      type: 'SYSTEM',
      title: 'Attendance Correction Requested',
      message: `${data.requested_by_name} requested attendance correction for ${data.student_name} (${data.roll_no}) in ${data.subject_name}`,
      related_id: newCorr.id,
    });

    this.notify();
    return newCorr;
  }

  public reviewAttendanceCorrection(
    correctionId: string,
    decision: 'APPROVE' | 'REJECT',
    reviewedBy: string,
    notes?: string
  ): boolean {
    const corr = this.attendanceCorrections.find((c) => c.id === correctionId);
    if (!corr) return false;

    corr.status = decision === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    corr.reviewed_by = reviewedBy;
    corr.reviewed_at = new Date().toISOString();
    corr.review_notes = notes;

    if (decision === 'APPROVE') {
      // Update actual attendance record if matching
      const targetRecord = this.attendance.find(
        (a) =>
          a.id === corr.attendance_record_id ||
          (a.roll_no === corr.roll_no && a.session_date === corr.session_date && a.subject_name === corr.subject_name)
      );
      if (targetRecord) {
        targetRecord.status = corr.proposed_status;
        saveToStorage(STORAGE_KEYS.ATTENDANCE, this.attendance);
      }
    }

    saveToStorage(STORAGE_KEYS.ATTENDANCE_CORRECTIONS, this.attendanceCorrections);

    this.addAuditLog({
      institution_id: corr.institution_id,
      actor_name: reviewedBy,
      actor_role: 'institution_admin',
      action: decision === 'APPROVE' ? 'APPROVE_CORRECTION' : 'REJECT_CORRECTION',
      resource_type: 'AttendanceCorrection',
      details: `${decision} correction request for ${corr.student_name} (${corr.original_status} -> ${corr.proposed_status})`,
    });

    this.notify();
    return true;
  }

  /**
   * Complete Excel/CSV Attendance Importer with row-by-row validation (Section 9.2)
   */
  public validateAndParseAttendanceCSV(
    csvText: string,
    institutionId: string,
    courseName: string,
    semester: number,
    subjectName: string
  ): {
    validRecords: Omit<AttendanceRecord, 'id'>[];
    errors: { row: number; rollNo?: string; error: string }[];
    summary: { totalRows: number; validCount: number; errorCount: number };
  } {
    const lines = csvText.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
    const errors: { row: number; rollNo?: string; error: string }[] = [];
    const validRecords: Omit<AttendanceRecord, 'id'>[] = [];

    if (lines.length === 0) {
      return {
        validRecords: [],
        errors: [{ row: 0, error: 'The uploaded file is empty. Please provide attendance data.' }],
        summary: { totalRows: 0, validCount: 0, errorCount: 1 },
      };
    }

    // Inspect header row
    const headerTokens = lines[0].split(',').map((t) => t.trim().toLowerCase().replace(/['"]/g, ''));
    const hasHeader = headerTokens.some((t) => t.includes('roll') || t.includes('status') || t.includes('date'));
    const startIdx = hasHeader ? 1 : 0;

    // Detect column indexes
    let rollCol = 0;
    let nameCol = 1;
    let dateCol = 2;
    let statusCol = 3;

    if (hasHeader) {
      rollCol = headerTokens.findIndex((t) => t.includes('roll') || t.includes('enroll'));
      nameCol = headerTokens.findIndex((t) => t.includes('name'));
      dateCol = headerTokens.findIndex((t) => t.includes('date') || t.includes('session'));
      statusCol = headerTokens.findIndex((t) => t.includes('status') || t.includes('attendance'));

      if (rollCol === -1) rollCol = 0;
      if (nameCol === -1) nameCol = 1;
      if (dateCol === -1) dateCol = 2;
      if (statusCol === -1) statusCol = 3;
    }

    const enrolledStudents = this.getStudents(institutionId, courseName, semester);
    const existingAttendance = this.attendance.filter(
      (a) => a.institution_id === institutionId && a.subject_name.toLowerCase() === subjectName.toLowerCase()
    );

    for (let i = startIdx; i < lines.length; i++) {
      const rowNum = i + 1;
      const rawLine = lines[i].trim();
      if (!rawLine) continue;

      const tokens = rawLine.split(',').map((t) => t.trim().replace(/^["']|["']$/g, ''));
      if (tokens.length < 3) {
        errors.push({
          row: rowNum,
          error: `Insufficient columns in row (${tokens.length} found, minimum 3 required). Expected: Roll Number, Date, Status.`,
        });
        continue;
      }

      const rawRoll = tokens[rollCol]?.trim() || '';
      const rawName = nameCol < tokens.length ? tokens[nameCol]?.trim() : '';
      const rawDate = dateCol < tokens.length ? tokens[dateCol]?.trim() : '';
      const rawStatus = statusCol < tokens.length ? tokens[statusCol]?.trim() : '';

      if (!rawRoll) {
        errors.push({ row: rowNum, error: 'Roll number cannot be empty.' });
        continue;
      }

      // 1. Validate student enrollment
      const studentMatch = enrolledStudents.find(
        (s) => s.roll_no.toLowerCase() === rawRoll.toLowerCase() || s.enrollment_no.toLowerCase() === rawRoll.toLowerCase()
      );

      if (!studentMatch) {
        errors.push({
          row: rowNum,
          rollNo: rawRoll,
          error: `Student with Roll/Enrollment '${rawRoll}' is not enrolled in ${courseName} Semester ${semester}.`,
        });
        continue;
      }

      // 2. Validate session date
      if (!rawDate || isNaN(Date.parse(rawDate))) {
        errors.push({
          row: rowNum,
          rollNo: rawRoll,
          error: `Invalid session date '${rawDate}'. Expected YYYY-MM-DD or standard ISO date format.`,
        });
        continue;
      }

      // 3. Validate status
      const normalizedStatus = rawStatus.toUpperCase();
      let finalStatus: AttendanceStatus | null = null;
      if (['PRESENT', 'P', '1'].includes(normalizedStatus)) finalStatus = 'PRESENT';
      else if (['ABSENT', 'A', '0'].includes(normalizedStatus)) finalStatus = 'ABSENT';
      else if (['LATE', 'L'].includes(normalizedStatus)) finalStatus = 'LATE';
      else if (['EXCUSED', 'E', 'OD', 'DUTY'].includes(normalizedStatus)) finalStatus = 'EXCUSED';

      if (!finalStatus) {
        errors.push({
          row: rowNum,
          rollNo: rawRoll,
          error: `Invalid attendance status '${rawStatus}'. Allowed statuses: Present (P), Absent (A), Late (L), Excused (E).`,
        });
        continue;
      }

      // 4. Duplicate check within file and database
      const alreadyInValid = validRecords.some(
        (vr) => vr.roll_no.toLowerCase() === rawRoll.toLowerCase() && vr.session_date === rawDate
      );
      if (alreadyInValid) {
        errors.push({
          row: rowNum,
          rollNo: rawRoll,
          error: `Duplicate entry in upload file for ${rawRoll} on ${rawDate}.`,
        });
        continue;
      }

      const alreadyInDb = existingAttendance.some(
        (a) => a.roll_no.toLowerCase() === rawRoll.toLowerCase() && a.session_date === rawDate
      );
      if (alreadyInDb) {
        errors.push({
          row: rowNum,
          rollNo: rawRoll,
          error: `Attendance already recorded in database for ${rawRoll} on ${rawDate}. Use Correction Request to modify.`,
        });
        continue;
      }

      validRecords.push({
        institution_id: institutionId,
        student_id: studentMatch.id,
        student_name: studentMatch.full_name || rawName,
        roll_no: studentMatch.roll_no,
        course_name: courseName,
        semester,
        subject_name: subjectName,
        session_date: rawDate,
        status: finalStatus,
        topic: 'Imported batch register session',
        recorded_by_name: 'Verified Excel/CSV Register',
      });
    }

    return {
      validRecords,
      errors,
      summary: {
        totalRows: lines.length - startIdx,
        validCount: validRecords.length,
        errorCount: errors.length,
      },
    };
  }

  /**
   * Accurate Attendance Calculator (Section 9.4)
   * Formula: (Present + (0.5 * Late)) / Countable Classes * 100
   * Avoids average-of-averages and division-by-zero.
   */
  public calculateStudentAttendance(
    studentRoll: string,
    institutionId?: string,
    subjectName?: string
  ): {
    overallPercentage: number | null;
    conductedSessions: number;
    attendedSessions: number;
    absentSessions: number;
    lateSessions: number;
    excusedSessions: number;
    subjectWise: {
      subjectName: string;
      conducted: number;
      attended: number;
      absent: number;
      late: number;
      excused: number;
      percentage: number | null;
      status: 'ELIGIBLE' | 'SHORTAGE' | 'NOT_STARTED';
    }[];
  } {
    let studentRecords = this.attendance.filter(
      (a) => a.roll_no.trim().toUpperCase() === studentRoll.trim().toUpperCase()
    );

    if (institutionId) {
      studentRecords = studentRecords.filter((a) => a.institution_id === institutionId);
    }

    if (subjectName) {
      studentRecords = studentRecords.filter((a) => a.subject_name.toLowerCase() === subjectName.toLowerCase());
    }

    // Group by subject
    const subjectMap = new Map<
      string,
      { conducted: number; present: number; absent: number; late: number; excused: number }
    >();

    studentRecords.forEach((rec) => {
      const sub = rec.subject_name;
      if (!subjectMap.has(sub)) {
        subjectMap.set(sub, { conducted: 0, present: 0, absent: 0, late: 0, excused: 0 });
      }
      const data = subjectMap.get(sub)!;
      data.conducted += 1;
      if (rec.status === 'PRESENT') data.present += 1;
      else if (rec.status === 'ABSENT') data.absent += 1;
      else if (rec.status === 'LATE') data.late += 1;
      else if (rec.status === 'EXCUSED') data.excused += 1;
    });

    // Also include default subjects for student's course so empty subjects show 0 conducted rather than disappearing
    const enrolled = this.students.find(
      (s) => s.roll_no.trim().toUpperCase() === studentRoll.trim().toUpperCase()
    );
    if (enrolled) {
      const courseSubjects = this.getSubjects(enrolled.institution_id, enrolled.course_name, enrolled.current_semester);
      courseSubjects.forEach((cs) => {
        if (!subjectMap.has(cs.name)) {
          subjectMap.set(cs.name, { conducted: 0, present: 0, absent: 0, late: 0, excused: 0 });
        }
      });
    }

    let totalConducted = 0;
    let totalPresent = 0;
    let totalAbsent = 0;
    let totalLate = 0;
    let totalExcused = 0;

    const subjectWise = Array.from(subjectMap.entries()).map(([subName, stats]) => {
      totalConducted += stats.conducted;
      totalPresent += stats.present;
      totalAbsent += stats.absent;
      totalLate += stats.late;
      totalExcused += stats.excused;

      if (stats.conducted === 0) {
        return {
          subjectName: subName,
          conducted: 0,
          attended: 0,
          absent: 0,
          late: 0,
          excused: 0,
          percentage: null,
          status: 'NOT_STARTED' as const,
        };
      }

      // Safe calculation without division by zero
      const pct = Math.round(((stats.present + stats.late * 0.5) / stats.conducted) * 100);
      return {
        subjectName: subName,
        conducted: stats.conducted,
        attended: stats.present,
        absent: stats.absent,
        late: stats.late,
        excused: stats.excused,
        percentage: pct,
        status: (pct < 75 ? 'SHORTAGE' : 'ELIGIBLE') as 'ELIGIBLE' | 'SHORTAGE',
      };
    });

    const overallPercentage =
      totalConducted > 0
        ? Math.round(((totalPresent + totalLate * 0.5) / totalConducted) * 100)
        : null;

    return {
      overallPercentage,
      conductedSessions: totalConducted,
      attendedSessions: totalPresent,
      absentSessions: totalAbsent,
      lateSessions: totalLate,
      excusedSessions: totalExcused,
      subjectWise,
    };
  }

  // ========================================================
  // ASSIGNMENTS & SUBMISSIONS
  // ========================================================

  public getAssignments(institutionId?: string, courseName?: string, semester?: number): Assignment[] {
    let list = this.assignments;
    if (institutionId) list = list.filter((a) => a.institution_id === institutionId);
    if (courseName) list = list.filter((a) => a.course_name === courseName);
    if (semester !== undefined) list = list.filter((a) => a.semester === semester);
    return [...list];
  }

  public createAssignment(data: Omit<Assignment, 'id' | 'created_at'>): Assignment {
    const newAsg: Assignment = {
      ...data,
      id: `asg-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.assignments.unshift(newAsg);
    saveToStorage(STORAGE_KEYS.ASSIGNMENTS, this.assignments);

    // Notify students
    this.addNotification({
      recipient_user_id: 'usr-student',
      institution_id: data.institution_id,
      type: 'ASSIGNMENT',
      title: `New Assignment: ${data.subject_name}`,
      message: `${data.title} posted by ${data.created_by_name}. Due by ${new Date(data.due_date).toLocaleDateString()}.`,
      related_id: newAsg.id,
    });

    this.addAuditLog({
      institution_id: data.institution_id,
      actor_name: data.created_by_name,
      actor_role: 'teacher',
      action: 'CREATE_ASSIGNMENT',
      resource_type: 'Assignment',
      details: `Created assignment '${data.title}' for ${data.course_name} Sem ${data.semester}`,
    });

    this.notify();
    return newAsg;
  }

  public getAssignmentSubmissions(assignmentId?: string, studentId?: string): AssignmentSubmission[] {
    let list = this.assignmentSubmissions;
    if (assignmentId) list = list.filter((s) => s.assignment_id === assignmentId);
    if (studentId) list = list.filter((s) => s.student_id === studentId);
    return [...list];
  }

  public submitAssignment(data: Omit<AssignmentSubmission, 'id' | 'submitted_at' | 'status'>): AssignmentSubmission {
    const existing = this.assignmentSubmissions.find(
      (s) => s.assignment_id === data.assignment_id && s.student_id === data.student_id
    );

    if (existing) {
      existing.submission_text = data.submission_text;
      existing.attachment_name = data.attachment_name;
      existing.submitted_at = new Date().toISOString();
      existing.status = 'SUBMITTED';
      saveToStorage(STORAGE_KEYS.ASSIGNMENT_SUBMISSIONS, this.assignmentSubmissions);
      this.notify();
      return existing;
    }

    const newSubm: AssignmentSubmission = {
      ...data,
      id: `subm-asg-${Date.now()}`,
      status: 'SUBMITTED',
      submitted_at: new Date().toISOString(),
    };
    this.assignmentSubmissions.unshift(newSubm);
    saveToStorage(STORAGE_KEYS.ASSIGNMENT_SUBMISSIONS, this.assignmentSubmissions);
    this.notify();
    return newSubm;
  }

  public gradeAssignmentSubmission(
    submissionId: string,
    marks: number,
    feedback: string,
    gradedBy: string
  ): boolean {
    const subm = this.assignmentSubmissions.find((s) => s.id === submissionId);
    if (!subm) return false;

    subm.marks = marks;
    subm.feedback = feedback;
    subm.graded_by = gradedBy;
    subm.graded_at = new Date().toISOString();
    subm.status = 'GRADED';

    saveToStorage(STORAGE_KEYS.ASSIGNMENT_SUBMISSIONS, this.assignmentSubmissions);

    // Notify student
    this.addNotification({
      recipient_user_id: subm.student_id,
      institution_id: subm.institution_id,
      type: 'ASSIGNMENT',
      title: 'Assignment Graded',
      message: `Your submission has been evaluated by ${gradedBy}: ${marks} marks awarded.`,
      related_id: subm.id,
    });

    this.notify();
    return true;
  }

  // ========================================================
  // STUDY MATERIALS & LECTURE NOTES
  // ========================================================

  public getStudyMaterials(
    institutionId?: string,
    courseName?: string,
    semester?: number,
    subjectName?: string
  ): StudyMaterial[] {
    let list = this.studyMaterials;
    if (institutionId) list = list.filter((m) => m.institution_id === institutionId);
    if (courseName) list = list.filter((m) => m.course_name === courseName);
    if (semester !== undefined) list = list.filter((m) => m.semester === semester);
    if (subjectName) list = list.filter((m) => m.subject_name.toLowerCase() === subjectName.toLowerCase());
    return [...list];
  }

  public uploadStudyMaterial(
    data: Omit<StudyMaterial, 'id' | 'uploaded_at' | 'download_count'>
  ): StudyMaterial {
    const newMat: StudyMaterial = {
      ...data,
      id: `mat-${Date.now()}`,
      uploaded_at: new Date().toISOString(),
      download_count: 0,
    };
    this.studyMaterials.unshift(newMat);
    saveToStorage(STORAGE_KEYS.STUDY_MATERIALS, this.studyMaterials);

    this.addAuditLog({
      institution_id: data.institution_id,
      actor_name: data.uploaded_by_name,
      actor_role: 'teacher',
      action: 'UPLOAD_MATERIAL',
      resource_type: 'StudyMaterial',
      details: `Uploaded ${data.file_type} material: '${data.title}' for ${data.subject_name}`,
    });

    this.notify();
    return newMat;
  }

  public incrementDownloadCount(materialId: string): void {
    const mat = this.studyMaterials.find((m) => m.id === materialId);
    if (mat) {
      mat.download_count += 1;
      saveToStorage(STORAGE_KEYS.STUDY_MATERIALS, this.studyMaterials);
      this.notify();
    }
  }

  // ========================================================
  // NOTICES & ANNOUNCEMENTS
  // ========================================================

  public getAnnouncements(institutionId?: string, audienceFilter?: string): Announcement[] {
    let list = this.announcements;
    if (institutionId) list = list.filter((a) => a.institution_id === institutionId);
    if (audienceFilter && audienceFilter !== 'ALL') {
      list = list.filter((a) => a.audience === 'ALL' || a.audience === audienceFilter);
    }
    return [...list];
  }

  public publishAnnouncement(data: Omit<Announcement, 'id' | 'published_at'>): Announcement {
    const newNotice: Announcement = {
      ...data,
      id: `notice-${Date.now()}`,
      published_at: new Date().toISOString(),
    };
    this.announcements.unshift(newNotice);
    saveToStorage(STORAGE_KEYS.ANNOUNCEMENTS, this.announcements);

    this.addNotification({
      recipient_user_id: 'ALL',
      institution_id: data.institution_id,
      type: 'ANNOUNCEMENT',
      title: `Campus Notice: ${data.title}`,
      message: data.content.substring(0, 120) + (data.content.length > 120 ? '...' : ''),
      related_id: newNotice.id,
    });

    this.addAuditLog({
      institution_id: data.institution_id,
      actor_name: data.author_name,
      actor_role: 'institution_admin',
      action: 'PUBLISH_NOTICE',
      resource_type: 'Announcement',
      details: `Published notice '${data.title}' [Audience: ${data.audience}]`,
    });

    this.notify();
    return newNotice;
  }

  public deleteAnnouncement(id: string): boolean {
    const idx = this.announcements.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    this.announcements.splice(idx, 1);
    saveToStorage(STORAGE_KEYS.ANNOUNCEMENTS, this.announcements);
    this.notify();
    return true;
  }

  // ========================================================
  // TIMETABLE MANAGEMENT
  // ========================================================

  public getTimetables(institutionId?: string, courseName?: string, semester?: number): TimetableSlot[] {
    let list = this.timetables;
    if (institutionId) list = list.filter((t) => t.institution_id === institutionId);
    if (courseName) list = list.filter((t) => t.course_name === courseName);
    if (semester !== undefined) list = list.filter((t) => t.semester === semester);
    return [...list];
  }

  public addTimetableSlot(data: Omit<TimetableSlot, 'id'>): TimetableSlot {
    const newSlot: TimetableSlot = {
      ...data,
      id: `slot-${Date.now()}`,
    };
    this.timetables.push(newSlot);
    saveToStorage(STORAGE_KEYS.TIMETABLES, this.timetables);
    this.notify();
    return newSlot;
  }

  public deleteTimetableSlot(id: string): boolean {
    const idx = this.timetables.findIndex((t) => t.id === id);
    if (idx === -1) return false;
    this.timetables.splice(idx, 1);
    saveToStorage(STORAGE_KEYS.TIMETABLES, this.timetables);
    this.notify();
    return true;
  }

  // ========================================================
  // EXAMINATIONS & RESULTS MANAGEMENT
  // ========================================================

  public getExaminations(institutionId?: string, courseName?: string, semester?: number): Examination[] {
    let list = this.examinations;
    if (institutionId) list = list.filter((e) => e.institution_id === institutionId);
    if (courseName) list = list.filter((e) => e.course_name === courseName);
    if (semester !== undefined) list = list.filter((e) => e.semester === semester);
    return [...list];
  }

  public createExamination(data: Omit<Examination, 'id'>): Examination {
    const newExam: Examination = {
      ...data,
      id: `exam-${Date.now()}`,
    };
    this.examinations.unshift(newExam);
    saveToStorage(STORAGE_KEYS.EXAMINATIONS, this.examinations);
    this.notify();
    return newExam;
  }

  public getExamResults(
    institutionId?: string,
    examId?: string,
    studentRoll?: string,
    isStudentView: boolean = false
  ): ExamResult[] {
    let list = this.examResults;
    if (institutionId) list = list.filter((r) => r.institution_id === institutionId);
    if (examId) list = list.filter((r) => r.exam_id === examId);
    if (studentRoll) {
      list = list.filter((r) => r.student_roll.trim().toUpperCase() === studentRoll.trim().toUpperCase());
    }
    if (isStudentView) {
      // Students only see officially published results!
      list = list.filter((r) => r.is_published === true);
    }
    return [...list];
  }

  public recordExamResult(data: Omit<ExamResult, 'id' | 'percentage' | 'grade'>): ExamResult {
    const pct = Math.round((data.marks_obtained / data.max_marks) * 100);
    let grade = 'F';
    if (pct >= 90) grade = 'O';
    else if (pct >= 80) grade = 'A+';
    else if (pct >= 70) grade = 'A';
    else if (pct >= 60) grade = 'B+';
    else if (pct >= 50) grade = 'B';
    else if (pct >= 40) grade = 'C';

    const newRes: ExamResult = {
      ...data,
      id: `res-${Date.now()}`,
      percentage: pct,
      grade,
    };
    this.examResults.unshift(newRes);
    saveToStorage(STORAGE_KEYS.EXAM_RESULTS, this.examResults);
    this.notify();
    return newRes;
  }

  public publishExamResults(examId: string): boolean {
    const exam = this.examinations.find((e) => e.id === examId);
    if (exam) {
      exam.status = 'RESULTS_PUBLISHED';
      saveToStorage(STORAGE_KEYS.EXAMINATIONS, this.examinations);
    }

    this.examResults = this.examResults.map((r) =>
      r.exam_id === examId
        ? { ...r, is_published: true, published_at: new Date().toISOString() }
        : r
    );
    saveToStorage(STORAGE_KEYS.EXAM_RESULTS, this.examResults);

    // Notify students
    this.addNotification({
      recipient_user_id: 'usr-student',
      institution_id: exam?.institution_id,
      type: 'SYSTEM',
      title: 'Examination Results Published',
      message: `Results for ${exam?.name || 'Examination'} are now available in your Student Academic Portal.`,
      related_id: examId,
    });

    this.notify();
    return true;
  }

  // ========================================================
  // ACADEMIC CALENDAR EVENTS
  // ========================================================

  public getCalendarEvents(institutionId?: string): AcademicCalendarEvent[] {
    if (institutionId) {
      return this.calendarEvents.filter((c) => c.institution_id === institutionId);
    }
    return [...this.calendarEvents];
  }

  public addCalendarEvent(data: Omit<AcademicCalendarEvent, 'id'>): AcademicCalendarEvent {
    const newEvent: AcademicCalendarEvent = {
      ...data,
      id: `cal-${Date.now()}`,
    };
    this.calendarEvents.unshift(newEvent);
    saveToStorage(STORAGE_KEYS.CALENDAR_EVENTS, this.calendarEvents);
    this.notify();
    return newEvent;
  }

  // ========================================================
  // REPORT EXPORT GENERATORS (CSV)
  // ========================================================

  public exportAttendanceToCSV(input?: AttendanceRecord[] | string): string {
    const records = Array.isArray(input) ? input : this.getAttendance();
    const headers = ['Record ID', 'Roll No', 'Student Name', 'Subject', 'Date', 'Status', 'Recorded By'];
    const rows = records.map((r) => [
      r.id,
      `"${r.roll_no}"`,
      `"${r.student_name}"`,
      `"${r.subject_name}"`,
      r.session_date,
      r.status,
      `"${r.recorded_by_name}"`,
    ]);
    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  }

  public exportStudentsToCSV(input?: Student[] | string): string {
    const students = Array.isArray(input) ? input : this.getStudents(typeof input === 'string' ? input : undefined);
    const headers = ['Student ID', 'Roll No', 'Enrollment No', 'Full Name', 'Course', 'Semester', 'Attendance %'];
    const rows = students.map((s) => [
      s.id,
      `"${s.roll_no}"`,
      `"${s.enrollment_no}"`,
      `"${s.full_name}"`,
      `"${s.course_name}"`,
      s.current_semester,
      `${s.overall_attendance}%`,
    ]);
    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  }

  public exportExamResultsToCSV(input?: ExamResult[] | string): string {
    const results = Array.isArray(input)
      ? input
      : typeof input === 'string'
      ? this.getExamResults(input)
      : [];
    const headers = ['Result ID', 'Exam Name', 'Roll No', 'Student Name', 'Subject', 'Marks', 'Max Marks', 'Percentage', 'Grade'];
    const rows = results.map((r) => [
      r.id,
      `"${r.exam_name}"`,
      `"${r.student_roll}"`,
      `"${r.student_name}"`,
      `"${r.subject_name}"`,
      r.marks_obtained,
      r.max_marks,
      `${r.percentage}%`,
      r.grade,
    ]);
    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  }

  // --- SUPPORT, FEEDBACK & BUG REPORTING ---

  public submitSupportTicket(ticket: {
    institution_id?: string;
    user_id?: string;
    name?: string;
    full_name?: string;
    email: string;
    phone?: string;
    college_name?: string;
    category: SupportCategory;
    subject: string;
    message?: string;
    description?: string;
    attachment_url?: string;
    attachment_name?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    honeypot?: string;
    attachment_size_mb?: number;
  }): { success: boolean; id?: string; error?: string; ticket?: SupportTicket } {
    if (ticket.honeypot && ticket.honeypot.trim().length > 0) {
      return { success: false, error: 'Spam submission detected and blocked.' };
    }

    const tName = (ticket.full_name || ticket.name || '').trim();
    if (tName.length < 2) {
      return { success: false, error: 'Please enter a valid full name (minimum 2 characters).' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!ticket.email || !emailRegex.test(ticket.email.trim())) {
      return { success: false, error: 'Please provide a valid official or personal email address.' };
    }

    if (!ticket.subject || ticket.subject.trim().length < 4) {
      return { success: false, error: 'Subject is required and must be at least 4 characters.' };
    }

    const tMsg = (ticket.description || ticket.message || '').trim();
    if (tMsg.length < 10) {
      return { success: false, error: 'Please provide a detailed description of your request (at least 10 characters).' };
    }

    if (ticket.attachment_size_mb && ticket.attachment_size_mb > 5) {
      return { success: false, error: 'Attachment file size exceeds the allowed 5 MB maximum limit.' };
    }

    const now = new Date();
    const uniqueNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `CS-SUP-${now.getFullYear()}-${uniqueNum}`;

    const newTicket: SupportTicket = {
      id: newId,
      institution_id: ticket.institution_id || 'inst-1',
      user_id: ticket.user_id,
      name: tName,
      full_name: tName,
      email: ticket.email.trim().toLowerCase(),
      phone: ticket.phone ? ticket.phone.trim() : undefined,
      college_name: ticket.college_name ? ticket.college_name.trim() : undefined,
      category: ticket.category || 'GENERAL',
      subject: ticket.subject.trim(),
      message: tMsg,
      description: tMsg,
      attachment_url: ticket.attachment_url,
      attachment_name: ticket.attachment_name,
      status: 'Open',
      priority: ticket.priority || 'MEDIUM',
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    };

    this.supportTickets.unshift(newTicket);
    saveToStorage(STORAGE_KEYS.SUPPORT_TICKETS, this.supportTickets);
    this.notify();

    if (isLiveSupabaseConfigured) {
      Promise.resolve(
        supabase
          .from('support_tickets')
          .insert({
            id: newId,
            institution_id: newTicket.institution_id || null,
            name: newTicket.name,
            email: newTicket.email,
            phone: newTicket.phone || null,
            college_name: newTicket.college_name || null,
            category: newTicket.category,
            subject: newTicket.subject,
            description: newTicket.description,
            attachment_url: newTicket.attachment_url || null,
            attachment_name: newTicket.attachment_name || null,
            status: newTicket.status,
            priority: newTicket.priority,
          })
      )
        .then(({ error }: any) => {
          if (error) console.warn('[Supabase Sync] support_tickets error:', error.message);
        })
        .catch((e: unknown) => console.warn('[Supabase Sync] support_tickets network error:', e));
    }

    return { success: true, id: newId, ticket: newTicket };
  }

  public getSupportTickets(userEmail?: string, institutionId?: string): SupportTicket[] {
    let list = this.supportTickets;
    if (institutionId) {
      list = list.filter((t) => !t.institution_id || t.institution_id === institutionId);
    }
    if (userEmail) {
      const normalizedEmail = userEmail.trim().toLowerCase();
      list = list.filter((t) => t.email.toLowerCase() === normalizedEmail);
    }
    return [...list];
  }

  public getSupportTicketById(id: string): SupportTicket | undefined {
    return this.supportTickets.find((t) => t.id.toLowerCase() === id.trim().toLowerCase());
  }

  public updateSupportTicketStatus(
    id: string,
    status: SupportTicketStatus,
    adminNotes?: string,
    adminReply?: string,
    repliedBy?: string
  ): boolean {
    const ticket = this.supportTickets.find((t) => t.id.toLowerCase() === id.trim().toLowerCase());
    if (!ticket) return false;

    ticket.status = status;
    ticket.updated_at = new Date().toISOString();
    if (adminNotes !== undefined) ticket.admin_notes = adminNotes;
    if (adminReply !== undefined) ticket.admin_reply = adminReply;
    if (repliedBy !== undefined) ticket.replied_by = repliedBy;

    saveToStorage(STORAGE_KEYS.SUPPORT_TICKETS, this.supportTickets);
    this.notify();
    return true;
  }

  public submitFeedback(feedback: {
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
    rating?: number;
    screenshot_url?: string;
    honeypot?: string;
  }): { success: boolean; id?: string; error?: string; feedback?: UserFeedback } {
    if (feedback.honeypot && feedback.honeypot.trim().length > 0) {
      return { success: false, error: 'Spam submission detected and blocked.' };
    }

    const fbName = (feedback.full_name || feedback.user_name || '').trim();
    if (fbName.length < 2) {
      return { success: false, error: 'Please enter your name.' };
    }

    const fbEmail = (feedback.email || feedback.user_email || '').trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!fbEmail || !emailRegex.test(fbEmail)) {
      return { success: false, error: 'Please provide a valid email address.' };
    }

    const fbText = (feedback.comment || feedback.feedback || '').trim();
    if (fbText.length < 5) {
      return { success: false, error: 'Please provide detailed feedback comments.' };
    }

    const fbTitle = (feedback.title || (fbText.substring(0, 30) + '...')).trim();

    const now = new Date();
    const uniqueNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `CS-FDB-${now.getFullYear()}-${uniqueNum}`;

    const newFeedback: UserFeedback = {
      id: newId,
      institution_id: feedback.institution_id || 'inst-1',
      user_name: fbName,
      full_name: fbName,
      user_email: fbEmail.toLowerCase(),
      email: fbEmail.toLowerCase(),
      role: feedback.role || 'student',
      category: feedback.category || 'OTHER',
      title: fbTitle,
      feedback: fbText,
      comment: fbText,
      rating: feedback.rating || 5,
      screenshot_url: feedback.screenshot_url,
      created_at: now.toISOString(),
    };

    this.userFeedbacks.unshift(newFeedback);
    saveToStorage(STORAGE_KEYS.USER_FEEDBACK, this.userFeedbacks);
    this.notify();

    if (isLiveSupabaseConfigured) {
      Promise.resolve(
        supabase
          .from('user_feedback')
          .insert({
            id: newId,
            institution_id: newFeedback.institution_id || null,
            user_name: newFeedback.user_name,
            user_email: newFeedback.user_email,
            role: newFeedback.role || 'student',
            category: newFeedback.category,
            title: newFeedback.title,
            comment: newFeedback.comment,
            rating: newFeedback.rating || 5,
          })
      )
        .then(({ error }: any) => {
          if (error) console.warn('[Supabase Sync] user_feedback error:', error.message);
        })
        .catch((e: unknown) => console.warn('[Supabase Sync] user_feedback network error:', e));
    }

    return { success: true, id: newId, feedback: newFeedback };
  }

  public getFeedbacks(institutionId?: string): UserFeedback[] {
    if (institutionId) {
      return this.userFeedbacks.filter((f) => !f.institution_id || f.institution_id === institutionId);
    }
    return [...this.userFeedbacks];
  }

  public submitBugReport(bug: {
    institution_id?: string;
    reporter_name?: string;
    name?: string;
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
    severity?: BugSeverity;
    affected_page?: string;
    browser_device_info?: string;
    browser_info?: string;
    attachment_url?: string;
    attachment_name?: string;
    honeypot?: string;
    attachment_size_mb?: number;
  }): { success: boolean; id?: string; error?: string; report?: BugReport } {
    if (bug.honeypot && bug.honeypot.trim().length > 0) {
      return { success: false, error: 'Spam submission detected and blocked.' };
    }

    const rName = (bug.reporter_name || bug.name || '').trim();
    if (rName.length < 2) {
      return { success: false, error: 'Reporter name is required.' };
    }

    const rEmail = (bug.email || bug.reporter_email || '').trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!rEmail || !emailRegex.test(rEmail)) {
      return { success: false, error: 'Valid reporter email is required.' };
    }

    if (!bug.title || bug.title.trim().length < 4) {
      return { success: false, error: 'Bug title is required.' };
    }

    const rActual = (bug.actual_behavior || bug.actual_result || bug.description || '').trim();
    if (rActual.length < 5) {
      return { success: false, error: 'Please describe the bug symptoms in detail.' };
    }

    if (bug.attachment_size_mb && bug.attachment_size_mb > 5) {
      return { success: false, error: 'Screenshot file size exceeds 5 MB limit.' };
    }

    const now = new Date();
    const uniqueNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `CS-BUG-${now.getFullYear()}-${uniqueNum}`;

    const newBug: BugReport = {
      id: newId,
      institution_id: bug.institution_id || 'inst-1',
      reporter_name: rName,
      reporter_email: rEmail.toLowerCase(),
      email: rEmail.toLowerCase(),
      title: bug.title.trim(),
      category: bug.category || 'OTHER',
      description: bug.description ? bug.description.trim() : rActual,
      steps_to_reproduce: bug.steps_to_reproduce ? bug.steps_to_reproduce.trim() : 'N/A',
      expected_result: bug.expected_behavior || bug.expected_result || 'System operates normally without errors',
      expected_behavior: bug.expected_behavior || bug.expected_result || 'System operates normally without errors',
      actual_result: rActual,
      actual_behavior: rActual,
      severity: bug.severity || 'MEDIUM',
      affected_page: bug.affected_page || '/',
      browser_device_info: bug.browser_info || bug.browser_device_info || 'Chrome on Windows',
      browser_info: bug.browser_info || bug.browser_device_info || 'Chrome on Windows',
      attachment_url: bug.attachment_url,
      attachment_name: bug.attachment_name,
      status: 'Open',
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    };

    this.bugReports.unshift(newBug);
    saveToStorage(STORAGE_KEYS.BUG_REPORTS, this.bugReports);
    this.notify();

    if (isLiveSupabaseConfigured) {
      Promise.resolve(
        supabase
          .from('bug_reports')
          .insert({
            id: newId,
            institution_id: newBug.institution_id || null,
            reporter_name: newBug.reporter_name,
            reporter_email: newBug.reporter_email,
            title: newBug.title,
            category: newBug.category,
            severity: newBug.severity,
            steps_to_reproduce: newBug.steps_to_reproduce,
            expected_behavior: newBug.expected_behavior,
            actual_behavior: newBug.actual_behavior,
            browser_info: newBug.browser_info || null,
            attachment_url: newBug.attachment_url || null,
            status: newBug.status,
          })
      )
        .then(({ error }: any) => {
          if (error) console.warn('[Supabase Sync] bug_reports error:', error.message);
        })
        .catch((e: unknown) => console.warn('[Supabase Sync] bug_reports network error:', e));
    }

    return { success: true, id: newId, report: newBug };
  }

  public getBugReports(institutionId?: string): BugReport[] {
    if (institutionId) {
      return this.bugReports.filter((b) => !b.institution_id || b.institution_id === institutionId);
    }
    return [...this.bugReports];
  }

  public updateBugReportStatus(id: string, status: SupportTicketStatus, adminNotes?: string): boolean {
    const bug = this.bugReports.find((b) => b.id.toLowerCase() === id.trim().toLowerCase());
    if (!bug) return false;

    bug.status = status;
    if (adminNotes !== undefined) bug.admin_notes = adminNotes;

    saveToStorage(STORAGE_KEYS.BUG_REPORTS, this.bugReports);
    this.notify();
    return true;
  }

  // --- RESET SYSTEM ---
  public resetToDemo(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    this.institutions = [...DEMO_INSTITUTIONS];
    this.complaints = [...DEMO_COMPLAINTS];
    this.notifications = [...DEMO_NOTIFICATIONS];
    this.attendance = [...DEMO_ATTENDANCE];
    this.academics = [...DEMO_ACADEMICS];
    this.parentLinks = [...DEMO_PARENT_LINKS];
    this.parentRequests = [...DEMO_PARENT_REQUESTS];
    this.messMenus = [...DEMO_MESS_MENUS];
    this.messFeedback = [...DEMO_MESS_FEEDBACK];
    this.auditLogs = [...DEMO_AUDIT_LOGS];
    this.courses = [...DEMO_COURSES];
    this.sections = [...DEMO_SECTIONS];
    this.subjects = [...DEMO_SUBJECTS];
    this.students = [...DEMO_STUDENT_ROSTER];
    this.teachers = [...DEMO_TEACHERS];
    this.attendanceConfigs = [...DEMO_ATTENDANCE_CONFIGS];
    this.attendanceSubmissions = [...DEMO_ATTENDANCE_SUBMISSIONS];
    this.attendanceCorrections = [...DEMO_ATTENDANCE_CORRECTIONS];
    this.assignments = [...DEMO_ASSIGNMENTS];
    this.assignmentSubmissions = [...DEMO_ASSIGNMENT_SUBMISSIONS];
    this.studyMaterials = [...DEMO_STUDY_MATERIALS];
    this.examinations = [...DEMO_EXAMINATIONS];
    this.examResults = [...DEMO_EXAM_RESULTS];
    this.calendarEvents = [...DEMO_CALENDAR_EVENTS];
    this.announcements = [...DEMO_ANNOUNCEMENTS];
    this.timetables = [...DEMO_TIMETABLE];
    this.supportTickets = [...DEMO_SUPPORT_TICKETS];
    this.userFeedbacks = [...DEMO_USER_FEEDBACK];
    this.bugReports = [...DEMO_BUG_REPORTS];
    this.notify();
  }
}

export const campusStore = new CampusStore();
export const store = campusStore;
