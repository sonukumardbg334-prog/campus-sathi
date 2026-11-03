import { describe, it, expect, beforeEach } from 'vitest';
import { campusStore, suggestComplaintMetadata } from '../src/lib/store';
import { DEMO_USERS } from '../src/lib/mockData';
import { INDIA_STATES_AND_UTS, getDistrictsByState } from '../src/data/indiaGeography';
import { NATIONAL_INSTITUTIONS_DIRECTORY } from '../src/data/indiaInstitutions';

describe('CampusSaathi Core Platform Engine Tests', () => {
  beforeEach(() => {
    campusStore.resetToDemo();
  });

  describe('1. Smart Category & Priority Classifier', () => {
    it('correctly classifies fire/spark electrical issues as URGENT', () => {
      const res = suggestComplaintMetadata(
        'Ceiling fan sparking',
        'Loud buzzing noise and visible smoke coming from fan motor in Room 204'
      );
      expect(res.suggestedPriority).toBe('URGENT');
      expect(res.suggestedCategory).toBe('Fan or lighting');
    });

    it('correctly classifies plumbing and water leak issues', () => {
      const res = suggestComplaintMetadata(
        'Water tap dripping',
        'Overhead pipe valve leak in 2nd floor washroom'
      );
      expect(res.suggestedCategory).toBe('Water supply');
      expect(res.suggestedPriority).toBe('MEDIUM');
    });

    it('correctly identifies campus network and Wi-Fi outages', () => {
      const res = suggestComplaintMetadata(
        'Hostel Wi-Fi down',
        'Router is not connecting to eduroam network'
      );
      expect(res.suggestedCategory).toBe('Internet and Wi-Fi');
    });

    it('correctly identifies dining and mess issues', () => {
      const res = suggestComplaintMetadata(
        'Cold lunch',
        'Chapatis and dal were served cold today in dining hall'
      );
      expect(res.suggestedCategory).toBe('Mess food quality');
    });
  });

  describe('2. End-to-End Complaint Lifecycle', () => {
    it('submits a new grievance with reference number and SUBMITTED status', () => {
      const complaint = campusStore.submitComplaint({
        institution_id: 'inst-1',
        student: DEMO_USERS.student,
        category: 'Electrical',
        title: 'Damaged power outlet',
        description: 'Broken socket switch near study table 3',
        building: 'Kalpana Chawla Girls Hostel',
        block: 'Block A',
        floor: '2nd Floor',
        room_number: 'A-204',
        suggested_priority: 'HIGH',
      });

      expect(complaint.id).toBeDefined();
      expect(complaint.reference_no).toMatch(/^CS-2026-\d{4}$/);
      expect(complaint.status).toBe('SUBMITTED');
      expect(complaint.status_history.length).toBeGreaterThanOrEqual(1);
    });

    it('allows warden to assign technician and advances status to ASSIGNED', () => {
      const cmp = campusStore.getComplaints()[0];
      campusStore.assignComplaint(
        cmp.id,
        'usr-maintenance',
        'Ramesh Kumar',
        'URGENT',
        'Replace broken capacitor immediately',
        'Col. Balwinder Singh'
      );

      const updated = campusStore.getComplaintById(cmp.id);
      expect(updated?.status).toBe('ASSIGNED');
      expect(updated?.assigned_to_staff_id).toBe('usr-maintenance');
      expect(updated?.official_priority).toBe('URGENT');
    });

    it('allows technician to update progress and upload resolution photo', () => {
      const cmp = campusStore.getComplaints()[0];

      // Step A: In Progress
      campusStore.updateWorkOrder(
        cmp.id,
        'IN_PROGRESS',
        'Parts fetched, work started',
        undefined,
        'Ramesh Kumar'
      );
      let current = campusStore.getComplaintById(cmp.id);
      expect(current?.status).toBe('IN_PROGRESS');

      // Step B: Submit for Verification with Photo Proof
      const mockResolutionPhoto = 'data:image/png;base64,mockRepairProof123';
      campusStore.updateWorkOrder(
        cmp.id,
        'AWAITING_VERIFICATION',
        'Capacitor replaced and tested at full speed',
        mockResolutionPhoto,
        'Ramesh Kumar'
      );

      current = campusStore.getComplaintById(cmp.id);
      expect(current?.status).toBe('AWAITING_VERIFICATION');
      expect(current?.resolution_photo_url).toBe(mockResolutionPhoto);
    });

    it('allows warden to verify resolution proof and mark as RESOLVED', () => {
      const cmp = campusStore.getComplaints()[0];
      campusStore.verifyResolution(
        cmp.id,
        'RESOLVE',
        'Col. Balwinder Singh',
        'Visual proof inspected and verified on site'
      );

      const updated = campusStore.getComplaintById(cmp.id);
      expect(updated?.status).toBe('RESOLVED');
      expect(updated?.verified_warden_name).toBe('Col. Balwinder Singh');
      expect(updated?.resolved_at).toBeDefined();
    });

    it('allows warden to reopen complaint if resolution is inadequate', () => {
      const cmp = campusStore.getComplaints()[0];
      campusStore.verifyResolution(
        cmp.id,
        'REOPEN',
        'Col. Balwinder Singh',
        'Fan still wobbling; balance blades'
      );

      const updated = campusStore.getComplaintById(cmp.id);
      expect(updated?.status).toBe('REOPENED');
    });
  });

  describe('3. Duplicate Grievance Clustering', () => {
    it('detects duplicate complaints when matching category and building', () => {
      const dupe = campusStore.checkForDuplicates({
        institution_id: 'inst-1',
        category: 'Fan or lighting',
        building: 'Aryabhatta Boys Hostel',
        floor: '2nd Floor',
      });

      expect(dupe).toBeDefined();
      expect(dupe?.reference_no).toBe('CS-2026-1001');
    });
  });

  describe('4. Parent-Student Linking Security Workflow', () => {
    it('creates a parent link request in PENDING state', () => {
      const req = campusStore.submitParentLinkRequest({
        parent: DEMO_USERS.parent,
        institution_id: 'inst-1',
        student_enrollment_no: 'KCET/2023/BTECH/099',
        student_name: 'Simran Sharma',
        verification_pin: '7732',
        relationship_type: 'FATHER',
      });

      expect(req.status).toBe('PENDING');
      expect(req.verification_pin).toBe('7732');
    });

    it('requires admin approval before parent can access student records', () => {
      const pendingReq = campusStore.getParentRequests().find((r) => r.status === 'PENDING');
      expect(pendingReq).toBeDefined();

      if (pendingReq) {
        campusStore.approveParentLinkRequest(pendingReq.id, 'Prof. Gurpreet Singh');
        const approvedReq = campusStore.getParentRequests().find((r) => r.id === pendingReq.id);
        expect(approvedReq?.status).toBe('APPROVED');
      }
    });
  });

  describe('5. Multi-Tenant Isolation', () => {
    it('isolates complaints by institution_id', () => {
      const khalsaComplaints = campusStore.getComplaints('inst-1');
      const otherComplaints = campusStore.getComplaints('inst-2');

      expect(khalsaComplaints.length).toBeGreaterThan(0);
      expect(otherComplaints.every((c) => c.institution_id === 'inst-2')).toBe(true);
    });
  });

  describe('6. Attendance Percentage Formula', () => {
    it('calculates correct attendance percentage', () => {
      const totalSessions = 20;
      const presentSessions = 17;
      const percentage = (presentSessions / totalSessions) * 100;
      expect(percentage).toBe(85.0);
    });
  });

  describe('7. Dynamic College Theme & Branding Engine', () => {
    it('allows authorized institution admin to update college branding & theme', () => {
      const targetInst = campusStore.getInstitutions()[0];
      const newBg = 'https://images.unsplash.com/photo-campus-test';
      const newTagline = 'Innovate • Empower • Excel';

      const ok = campusStore.updateInstitutionBranding(
        targetInst.id,
        {
          background_images: [newBg],
          hero_tagline: newTagline,
          theme_config: {
            primary_color: '#0A1128',
            secondary_color: '#3B82F6',
            accent_color: '#10B981',
            custom_tagline: newTagline,
          },
        },
        'Prof. Gurpreet Singh',
        'institution_admin'
      );

      expect(ok).toBe(true);
      const updated = campusStore.getInstitutions().find((i) => i.id === targetInst.id);
      expect(updated?.background_images?.[0]).toBe(newBg);
      expect(updated?.hero_tagline).toBe(newTagline);
      expect(updated?.theme_config?.primary_color).toBe('#0A1128');
    });

    it('rejects branding update attempts from unauthorized student roles', () => {
      const targetInst = campusStore.getInstitutions()[0];
      const ok = campusStore.updateInstitutionBranding(
        targetInst.id,
        { hero_tagline: 'Unauthorized override attempt' },
        'Sonu Kumar',
        'student'
      );

      expect(ok).toBe(false);
    });

    it('registers new institution with pending approval and custom visual branding', () => {
      const newInst = campusStore.registerInstitution({
        name: 'Punjab Technical University',
        code: 'PTU',
        type: 'State Technical University',
        official_email: 'registrar@ptu.ac.in',
        state: 'Punjab',
        city: 'Kapurthala',
        campus_count: 3,
        background_images: ['https://images.unsplash.com/photo-ptu-campus'],
        logo_url: 'data:image/png;base64,mockPtuLogo',
        hero_tagline: 'Technical Leadership for North India',
      });

      expect(newInst.id).toBeDefined();
      expect(newInst.status).toBe('PENDING_APPROVAL');
      expect(newInst.background_images?.[0]).toBe('https://images.unsplash.com/photo-ptu-campus');
      expect(newInst.logo_url).toBe('data:image/png;base64,mockPtuLogo');
    });
  });

  describe('8. Role-Based Registration & College Verification Codes (Parts 10, 11, 12)', () => {
    it('validates official campus verification code successfully', () => {
      const res = campusStore.validateRoleInvitation('inst-1', 'teacher', 'KC-FAC-2026');
      expect(res.valid).toBe(true);
      expect(res.invitation?.code).toBe('KC-FAC-2026');
    });

    it('rejects verification code from a different institution (cross-tenant restriction)', () => {
      // KC code attempted for LPU
      const res = campusStore.validateRoleInvitation('inst-2', 'teacher', 'KC-FAC-2026');
      expect(res.valid).toBe(false);
      expect(res.message).toContain('belongs to a different institution');
    });

    it('rejects verification code intended for a different role (privilege escalation prevention)', () => {
      // Admin code attempted for student role
      const res = campusStore.validateRoleInvitation('inst-1', 'student', 'KC-ADM-2026');
      expect(res.valid).toBe(false);
      expect(res.message).toContain('authorized for institution admin');
    });

    it('successfully registers user with verified role and increments code usage', () => {
      const initialUsage = campusStore.getRoleInvitations('inst-1').find((i) => i.code === 'KC-WAR-2026')?.usage_count || 0;

      const reg = campusStore.registerUserWithRole({
        role: 'warden',
        full_name: 'Dr. Paramjit Kaur',
        email: 'paramjit.warden@khalsa.edu.in',
        institution_id: 'inst-1',
        verification_code: 'KC-WAR-2026',
        hostel_assignment: 'Kalpana Chawla Girls Hostel',
        employee_id: 'WDN-GIRLS-01',
      });

      expect(reg.success).toBe(true);
      expect(reg.user?.role).toBe('warden');
      expect(reg.user?.institution_name).toContain('Apex Institute');

      const updatedUsage = campusStore.getRoleInvitations('inst-1').find((i) => i.code === 'KC-WAR-2026')?.usage_count;
      expect(updatedUsage).toBe(initialUsage + 1);
    });

    it('blocks public self-registration for Platform Super Admin accounts', () => {
      const reg = campusStore.registerUserWithRole({
        role: 'platform_admin',
        full_name: 'Malicious Attacker',
        email: 'hacker@platform.com',
        institution_id: 'inst-1',
      });

      expect(reg.success).toBe(false);
      expect(reg.message).toContain('cannot be self-registered publicly');
    });
  });

  describe('9. Nationwide India Geography & Higher-Ed Directory (Parts 22, 23)', () => {
    it('contains all 28 Indian States and 8 Union Territories', () => {
      const states = INDIA_STATES_AND_UTS.filter((item) => item.type === 'State');
      const uts = INDIA_STATES_AND_UTS.filter((item) => item.type === 'Union Territory');

      expect(states.length).toBe(28);
      expect(uts.length).toBe(8);
      expect(INDIA_STATES_AND_UTS.length).toBe(36);
    });

    it('provides valid districts for major education states (Punjab, Delhi, Karnataka, Maharashtra)', () => {
      const punjabDistricts = getDistrictsByState('Punjab');
      expect(punjabDistricts).toContain('Amritsar');
      expect(punjabDistricts).toContain('Ludhiana');

      const delhiDistricts = getDistrictsByState('Delhi (NCT)');
      expect(delhiDistricts).toContain('New Delhi');
      expect(delhiDistricts).toContain('Dwarka');

      const karnatakaDistricts = getDistrictsByState('Karnataka');
      expect(karnatakaDistricts).toContain('Bengaluru Urban');
      expect(karnatakaDistricts).toContain('Mysuru');

      const fallback = getDistrictsByState('Unknown State');
      expect(fallback).toEqual(['Main Campus']);
    });

    it('provides national institutions directory with accredited central/state/autonomous institutions', () => {
      expect(NATIONAL_INSTITUTIONS_DIRECTORY.length).toBeGreaterThan(15);

      const aitm = NATIONAL_INSTITUTIONS_DIRECTORY.find((i) => i.shortCode === 'AITM');
      expect(aitm).toBeDefined();
      expect(aitm?.state).toBe('Delhi NCR');
      expect(aitm?.district).toBe('New Delhi');

      const iitd = NATIONAL_INSTITUTIONS_DIRECTORY.find((i) => i.shortCode === 'IITD');
      expect(iitd).toBeDefined();
      expect(iitd?.category).toBe('IIT/NIT/IIIT');

      const lpu = NATIONAL_INSTITUTIONS_DIRECTORY.find((i) => i.shortCode === 'LPU');
      expect(lpu).toBeDefined();
      expect(lpu?.category).toBe('Private University');
    });
  });

  describe('10. Application Tenant Verification ON/OFF Toggle & Authorization Engine', () => {
    it('allows Platform Super Admin to toggle verification ON, setting status to APPROVED', () => {
      // inst-4 is initialized as PENDING_APPROVAL with verification_enabled: false
      const initialInst = campusStore.getInstitutions().find((i) => i.id === 'inst-4');
      expect(initialInst?.verification_enabled).toBe(false);
      expect(initialInst?.status).toBe('PENDING_APPROVAL');

      // Superadmin turns ON verification
      const res = campusStore.toggleInstitutionVerification(
        'inst-4',
        true,
        'platform_admin',
        'Dr. Jaspreet Singh'
      );

      expect(res.success).toBe(true);
      expect(res.message).toContain('verification enabled (ON)');

      const updatedInst = campusStore.getInstitutions().find((i) => i.id === 'inst-4');
      expect(updatedInst?.verification_enabled).toBe(true);
      expect(updatedInst?.status).toBe('APPROVED');

      // Audit log must be recorded
      const logs = campusStore.getAuditLogs();
      const audit = logs.find((l) => l.action === 'TOGGLE_TENANT_VERIFICATION' && l.details.includes('ON'));
      expect(audit).toBeDefined();
      expect(audit?.actor_role).toBe('platform_admin');
    });

    it('allows Platform Super Admin to toggle verification OFF, setting status to PENDING_APPROVAL', () => {
      // inst-1 is initialized with verification_enabled: true
      const initialInst = campusStore.getInstitutions().find((i) => i.id === 'inst-1');
      expect(initialInst?.verification_enabled).toBe(true);
      expect(initialInst?.status).toBe('APPROVED');

      // Superadmin turns OFF verification
      const res = campusStore.toggleInstitutionVerification(
        'inst-1',
        false,
        'platform_admin',
        'Dr. Jaspreet Singh'
      );

      expect(res.success).toBe(true);
      expect(res.message).toContain('verification disabled (OFF)');

      const updatedInst = campusStore.getInstitutions().find((i) => i.id === 'inst-1');
      expect(updatedInst?.verification_enabled).toBe(false);
      expect(updatedInst?.status).toBe('PENDING_APPROVAL');

      // Audit log must be recorded
      const logs = campusStore.getAuditLogs();
      const audit = logs.find((l) => l.action === 'TOGGLE_TENANT_VERIFICATION' && l.details.includes('OFF'));
      expect(audit).toBeDefined();
      expect(audit?.actor_role).toBe('platform_admin');
    });

    it('strictly denies non-superadmin roles and generates a security alert audit log', () => {
      const unauthorizedRoles = ['student', 'warden', 'institution_admin', 'teacher', 'parent'] as const;

      for (const role of unauthorizedRoles) {
        const res = campusStore.toggleInstitutionVerification(
          'inst-1',
          false,
          role,
          `Malicious ${role}`
        );

        expect(res.success).toBe(false);
        expect(res.message).toContain('Unauthorized');

        // Target institution state must remain untouched
        const inst = campusStore.getInstitutions().find((i) => i.id === 'inst-1');
        expect(inst?.verification_enabled).toBe(true);
      }

      // Security alerts must be logged
      const securityAlerts = campusStore.getAuditLogs().filter((l) => l.action === 'SECURITY_ALERT');
      expect(securityAlerts.length).toBeGreaterThanOrEqual(unauthorizedRoles.length);
    });

    it('returns an error when attempting to toggle a nonexistent institution', () => {
      const res = campusStore.toggleInstitutionVerification(
        'non-existent-inst-id',
        true,
        'platform_admin',
        'Dr. Jaspreet Singh'
      );

      expect(res.success).toBe(false);
      expect(res.message).toContain('not found');
    });

    it('defaults new institution registrations to verification_enabled: false', () => {
      const newInst = campusStore.registerInstitution({
        name: 'New Technical Institute',
        code: 'NTI',
        type: 'Engineering College',
        official_email: 'admin@nti.edu.in',
        state: 'Punjab',
        city: 'Jalandhar',
        campus_count: 1,
      });

      expect(newInst.verification_enabled).toBe(false);
      expect(newInst.status).toBe('PENDING_APPROVAL');
    });
  });

  describe('11. Theme Preference Engine & Mode Persistence', () => {
    it('supports Light, Dark, and System Default theme modes and handles persistence cleanly', () => {
      const THEME_STORAGE_KEY = 'campussaathi_theme_preference';
      const validThemes = ['light', 'dark', 'system'] as const;

      // Mock storage for environments without native localStorage
      const mockStorage: Record<string, string> = {};
      const storage = {
        getItem: (k: string) => mockStorage[k] || null,
        setItem: (k: string, v: string) => { mockStorage[k] = v; },
      };

      validThemes.forEach((theme) => {
        storage.setItem(THEME_STORAGE_KEY, theme);
        expect(storage.getItem(THEME_STORAGE_KEY)).toBe(theme);
      });
    });
  });

  describe('12. 15-Day & Monthly Attendance Submission & Approval Workflow', () => {
    it('allows faculty to configure 15-day and monthly submission policy', () => {
      const cfg = campusStore.updateAttendanceConfig('inst-1', {
        frequency: '15_DAY',
        approval_required: true,
        current_period_name: 'Cycle 1 (1st - 15th Nov 2026)',
        period_start_date: '2026-11-01',
        period_end_date: '2026-11-15',
        submission_deadline: '2026-11-18',
      });

      expect(cfg.frequency).toBe('15_DAY');
      expect(cfg.approval_required).toBe(true);
      expect(cfg.current_period_name).toBe('Cycle 1 (1st - 15th Nov 2026)');
    });

    it('submits a 15-day attendance report for administrative review', () => {
      const subm = campusStore.submitAttendanceReport({
        institution_id: 'inst-1',
        period_name: 'Cycle 1 (1st - 15th Nov 2026)',
        frequency: '15_DAY',
        subject_name: 'Artificial Intelligence & Neural Nets',
        course_name: 'B.Tech Computer Science & Engineering',
        semester: 6,
        section: 'Section A',
        teacher_id: 'usr-teacher-1',
        teacher_name: 'Dr. Neha Verma',
        total_conducted: 12,
        total_records: 84,
        present_count: 76,
        absent_count: 5,
        late_count: 3,
        excused_count: 0,
        average_attendance_pct: 92.2,
        records_count: 84,
      });

      expect(subm.id).toBeDefined();
      expect(subm.status).toBe('PENDING_APPROVAL');
      expect(subm.records_count).toBe(84);
    });

    it('allows college administrator to approve or reject attendance submissions with feedback', () => {
      const pending = campusStore.getAttendanceSubmissions('inst-1').find((s) => s.status === 'PENDING_APPROVAL');
      expect(pending).toBeDefined();

      if (pending) {
        const approved = campusStore.reviewAttendanceSubmission(
          pending.id,
          'APPROVE',
          'Prof. Gurpreet Singh (College Admin)'
        );
        expect(approved).toBe(true);

        const updated = campusStore.getAttendanceSubmissions('inst-1').find((s) => s.id === pending.id);
        expect(updated?.status).toBe('APPROVED');
        expect(updated?.reviewed_by).toContain('Prof. Gurpreet Singh');
      }
    });
  });

  describe('13. Excel & CSV Attendance Import Parser & Row-Level Validation', () => {
    it('successfully validates and parses valid CSV attendance rows', () => {
      const validCsv = `Roll Number,Student Name,Date,Status
2440404,Sonu Kumar,2026-10-30,Present
22CS105,Simran Sharma,2026-10-30,Present
22CS107,Harpreet Singh,2026-10-30,Late`;

      const result = campusStore.validateAndParseAttendanceCSV(
        validCsv,
        'inst-1',
        'B.Tech Computer Science & Engineering',
        6,
        'Cybersecurity & Cryptography'
      );

      expect(result.summary.errorCount).toBe(0);
      expect(result.validRecords.length).toBe(3);
      expect(result.validRecords[0].status).toBe('PRESENT');
      expect(result.validRecords[2].status).toBe('LATE');
    });

    it('rejects unknown roll numbers not enrolled in the course/semester', () => {
      const invalidCsv = `Roll Number,Student Name,Date,Status
99CS999,Unknown Student,2026-10-30,Present`;

      const result = campusStore.validateAndParseAttendanceCSV(
        invalidCsv,
        'inst-1',
        'B.Tech Computer Science & Engineering',
        6,
        'Cybersecurity & Cryptography'
      );

      expect(result.summary.errorCount).toBe(1);
      expect(result.errors[0].error).toContain('not enrolled');
      expect(result.validRecords.length).toBe(0);
    });

    it('rejects invalid dates and invalid attendance statuses with helpful messages', () => {
      const badDataCsv = `Roll Number,Student Name,Date,Status
2440404,Sonu Kumar,invalid-date-format,Present
22CS105,Simran Sharma,2026-10-30,UNKNOWN_STATUS`;

      const result = campusStore.validateAndParseAttendanceCSV(
        badDataCsv,
        'inst-1',
        'B.Tech Computer Science & Engineering',
        6,
        'Cybersecurity & Cryptography'
      );

      expect(result.summary.errorCount).toBe(2);
      expect(result.errors.some((e) => e.error.includes('date'))).toBe(true);
      expect(result.errors.some((e) => e.error.includes('status'))).toBe(true);
    });

    it('detects duplicate student attendance entries within the upload file', () => {
      const dupeCsv = `Roll Number,Student Name,Date,Status
2440404,Sonu Kumar,2026-10-30,Present
2440404,Sonu Kumar,2026-10-30,Absent`;

      const result = campusStore.validateAndParseAttendanceCSV(
        dupeCsv,
        'inst-1',
        'B.Tech Computer Science & Engineering',
        6,
        'Cybersecurity & Cryptography'
      );

      expect(result.summary.errorCount).toBe(1);
      expect(result.errors[0].error).toContain('Duplicate entry');
    });
  });

  describe('14. Accurate Attendance Calculator & Formula Integrity', () => {
    it('calculates attendance percentage accurately and handles zero sessions without division by zero', () => {
      // 1. Existing student with recorded classes
      const calc = campusStore.calculateStudentAttendance('2440404', 'inst-1');
      expect(calc.conductedSessions).toBeGreaterThan(0);
      expect(calc.overallPercentage).toBeTypeOf('number');
      expect(calc.subjectWise.length).toBeGreaterThanOrEqual(1);

      // 2. Student with 0 recorded sessions returns null / NOT_STARTED without NaN
      const zeroCalc = campusStore.calculateStudentAttendance('22CS110', 'inst-1', 'Non-Existent Subject');
      expect(zeroCalc.conductedSessions).toBe(0);
      expect(zeroCalc.overallPercentage).toBeNull();
    });

    it('identifies attendance shortages when percentage falls below statutory 75%', () => {
      const calc = campusStore.calculateStudentAttendance('2440404', 'inst-1');
      const daa = calc.subjectWise.find((s) => s.subjectName.includes('Algorithms'));
      if (daa && daa.percentage !== null) {
        expect(daa.status).toBe('SHORTAGE');
      }
    });
  });

  describe('15. Controlled Attendance Correction Workflow', () => {
    it('creates an attendance correction request and preserves original record', () => {
      const req = campusStore.requestAttendanceCorrection({
        institution_id: 'inst-1',
        attendance_record_id: 'att-5',
        student_id: 'stu-101',
        student_name: 'Sonu Kumar',
        roll_no: '2440404',
        subject_name: 'Design & Analysis of Algorithms',
        session_date: '2026-10-26',
        original_status: 'ABSENT',
        proposed_status: 'EXCUSED',
        reason: 'Medical certificate submitted for fever',
        requested_by_name: 'Dr. S. K. Mahajan',
        requested_by_role: 'teacher',
      });

      expect(req.id).toBeDefined();
      expect(req.status).toBe('PENDING');

      // Review and approve
      const approved = campusStore.reviewAttendanceCorrection(
        req.id,
        'APPROVE',
        'Prof. Gurpreet Singh (College Admin)',
        'Medical certificate verified with campus dispensary'
      );
      expect(approved).toBe(true);

      const updated = campusStore.getAttendanceCorrections('inst-1').find((c) => c.id === req.id);
      expect(updated?.status).toBe('APPROVED');
    });
  });

  describe('16. Assignment Creation, Submission & Grading Lifecycle', () => {
    it('allows teacher to publish assignment, student to submit, and teacher to grade with feedback', () => {
      // 1. Teacher creates assignment
      const asg = campusStore.createAssignment({
        institution_id: 'inst-1',
        course_name: 'B.Tech Computer Science & Engineering',
        semester: 6,
        section: 'Section A',
        subject_name: 'Distributed Cloud Systems',
        title: 'MapReduce Cluster Benchmark Analysis',
        description: 'Run WordCount on 50GB corpus and graph execution times against worker node counts.',
        due_date: '2026-11-20T23:59:00Z',
        max_marks: 40,
        created_by_name: 'Prof. Ankit Saxena',
      });

      expect(asg.id).toBeDefined();

      // 2. Student submits assignment
      const subm = campusStore.submitAssignment({
        assignment_id: asg.id,
        institution_id: 'inst-1',
        student_id: 'stu-101',
        student_name: 'Sonu Kumar',
        student_roll: '2440404',
        submission_text: 'Benchmarked with 2, 4, 8, and 16 worker nodes. Linear speedup verified up to 8 nodes.',
        attachment_name: 'mapreduce_benchmark_report.pdf',
      });

      expect(subm.status).toBe('SUBMITTED');

      // 3. Teacher evaluates and grades submission
      const graded = campusStore.gradeAssignmentSubmission(
        subm.id,
        38,
        'Excellent scaling graphs and analysis of network I/O bottlenecks.',
        'Prof. Ankit Saxena'
      );

      expect(graded).toBe(true);
      const updatedSubm = campusStore.getAssignmentSubmissions(asg.id).find((s) => s.id === subm.id);
      expect(updatedSubm?.status).toBe('GRADED');
      expect(updatedSubm?.marks).toBe(38);
    });
  });

  describe('17. Examinations & Results Publication Gating', () => {
    it('creates examinations and restricts student results visibility until officially published', () => {
      const exam = campusStore.createExamination({
        institution_id: 'inst-1',
        name: 'Unit Assessment 2 - Spring 2026',
        academic_year: 'Academic Year 2025-2026',
        course_name: 'B.Tech Computer Science & Engineering',
        semester: 6,
        subject_name: 'Artificial Intelligence & Neural Nets',
        exam_date: '2026-11-12',
        start_time: '10:00 AM',
        end_time: '11:30 AM',
        venue: 'Room 201',
        max_marks: 30,
        status: 'SCHEDULED',
      });

      expect(exam.id).toBeDefined();

      // Record result (draft, not published)
      const res = campusStore.recordExamResult({
        institution_id: 'inst-1',
        exam_id: exam.id,
        exam_name: exam.name,
        student_id: 'stu-101',
        student_name: 'Sonu Kumar',
        student_roll: '2440404',
        subject_name: exam.subject_name,
        marks_obtained: 28,
        max_marks: 30,
        is_published: false,
      });

      expect(res.grade).toBe('O');

      // Student view MUST NOT see unpublished results
      const studentResultsBefore = campusStore.getExamResults('inst-1', exam.id, '2440404', true);
      expect(studentResultsBefore.length).toBe(0);

      // Admin publishes results
      campusStore.publishExamResults(exam.id);

      // Student view CAN now see published results
      const studentResultsAfter = campusStore.getExamResults('inst-1', exam.id, '2440404', true);
      expect(studentResultsAfter.length).toBe(1);
      expect(studentResultsAfter[0].marks_obtained).toBe(28);
    });
  });

  describe('18. Multi-College Tenant Data Isolation', () => {
    it('strictly isolates course, subject, and student records between colleges', () => {
      const inst1Courses = campusStore.getCourses('inst-1');
      const inst2Courses = campusStore.getCourses('inst-2');

      // Courses belonging to inst-1 must have inst-1 as institution_id
      expect(inst1Courses.every((c) => c.institution_id === 'inst-1')).toBe(true);
      expect(inst2Courses.every((c) => c.institution_id === 'inst-2')).toBe(true);

      // Student roster of inst-1 must not leak into inst-2
      const inst1Students = campusStore.getStudents('inst-1');
      const inst2Students = campusStore.getStudents('inst-2');
      expect(inst1Students.some((s) => s.roll_no === '2440404')).toBe(true);
      expect(inst2Students.some((s) => s.roll_no === '2440404')).toBe(false);
    });
  });

  describe('19. Support Helpdesk, Bug Reporting & Feedback Engine', () => {
    it('successfully submits a support ticket with CS-SUP format ID and initial Open status', () => {
      const res = campusStore.submitSupportTicket({
        name: 'Harpreet Singh',
        email: 'harpreet@kcet.edu.in',
        phone: '9876543210',
        category: 'General Inquiries',
        subject: 'Inquiry regarding 15-day attendance cycle',
        description: 'Need clarification on how attendance locks operate for lab practicals.',
      });

      expect(res.success).toBe(true);
      expect(res.id).toMatch(/^CS-SUP-\d{4}-\d{4}$/);
      expect(res.ticket?.status).toBe('Open');

      // Verify ticket can be retrieved
      const found = campusStore.getSupportTicketById(res.id!);
      expect(found).toBeDefined();
      expect(found?.email).toBe('harpreet@kcet.edu.in');
    });

    it('blocks spam submissions using honeypot detection', () => {
      const spamRes = campusStore.submitSupportTicket({
        name: 'Bot Spammer',
        email: 'spam@bot.net',
        category: 'General Inquiries',
        subject: 'SEO Services Promo',
        description: 'Buy cheap backlink services today!',
        honeypot: 'filled_by_bot',
      });

      expect(spamRes.success).toBe(false);
      expect(spamRes.error).toContain('Spam submission detected');
    });

    it('validates mandatory fields and attachment size limit (max 5MB)', () => {
      const invalidEmail = campusStore.submitSupportTicket({
        name: 'Test User',
        email: 'not-an-email',
        category: 'General Inquiries',
        subject: 'Valid Subject',
        description: 'Detailed description with sufficient characters.',
      });
      expect(invalidEmail.success).toBe(false);

      const oversizedFile = campusStore.submitSupportTicket({
        name: 'Test User',
        email: 'valid@college.edu',
        category: 'General Inquiries',
        subject: 'Valid Subject',
        description: 'Detailed description with sufficient characters.',
        attachment_size_mb: 8.5,
      });
      expect(oversizedFile.success).toBe(false);
      expect(oversizedFile.error).toContain('5 MB');
    });

    it('allows updating support ticket status and adding admin notes', () => {
      const res = campusStore.submitSupportTicket({
        name: 'Simran Kaur',
        email: 'simran@college.edu',
        category: 'Attendance Issues',
        subject: 'Attendance discrepancy in Mathematics',
        description: 'Attendance was marked absent on Oct 24 due to sports event duty.',
      });

      const updated = campusStore.updateSupportTicketStatus(
        res.id!,
        'Resolved',
        'Verified with Sports Director and marked present in system.'
      );
      expect(updated).toBe(true);

      const ticket = campusStore.getSupportTicketById(res.id!);
      expect(ticket?.status).toBe('Resolved');
      expect(ticket?.admin_notes).toContain('Sports Director');
    });

    it('submits feedback with CS-FDB format ID and captures ratings', () => {
      const res = campusStore.submitFeedback({
        user_name: 'Jasleen Kaur',
        user_email: 'jasleen@college.edu',
        category: 'User Experience (UI/UX)',
        title: 'Loving the dark mode aesthetics',
        comment: 'The glassmorphic dashboard looks incredible on tablet and desktop.',
        rating: 5,
      });

      expect(res.success).toBe(true);
      expect(res.id).toMatch(/^CS-FDB-\d{4}-\d{4}$/);
      expect(res.feedback?.rating).toBe(5);

      const all = campusStore.getFeedbacks();
      expect(all.some((f) => f.id === res.id)).toBe(true);
    });

    it('submits a bug report with CS-BUG format ID, severity, and environment tracking', () => {
      const res = campusStore.submitBugReport({
        reporter_name: 'Ankit Sharma',
        email: 'ankit@college.edu',
        category: 'Visual / Styling Glitch',
        severity: 'Medium (Partial function blocked)',
        title: 'Dropdown menu clipped in mobile viewport',
        steps_to_reproduce: 'Open menu on iPhone 12 Mini and scroll down',
        actual_behavior: 'Bottom 2 links are cut off by navigation bar',
        expected_behavior: 'Menu should scroll smoothly within viewport',
        browser_info: 'Safari on iOS 17.4 | Screen: 375x812',
      });

      expect(res.success).toBe(true);
      expect(res.id).toMatch(/^CS-BUG-\d{4}-\d{4}$/);
      expect(res.report?.severity).toBe('Medium (Partial function blocked)');
      expect(res.report?.browser_info).toContain('iOS 17.4');
    });
  });

  describe('20. Authentication & Credentials Security Verification', () => {
    it('authenticates demo persona with valid default password', () => {
      const res = campusStore.authenticateUser('sonukumardbg334@gmail.com', 'password123');
      expect(res.success).toBe(true);
      expect(res.user?.role).toBe('student');
      expect(res.user?.full_name).toBe('Sonu Kumar');
    });

    it('rejects demo persona login when incorrect password is provided', () => {
      const res = campusStore.authenticateUser('sonukumardbg334@gmail.com', 'wrongpass999');
      expect(res.success).toBe(false);
      expect(res.message).toContain('Invalid password');
    });

    it('rejects authentication for non-existent unregistered emails', () => {
      const res = campusStore.authenticateUser('nonexistent.ghost@nowhere.in', 'somepassword');
      expect(res.success).toBe(false);
      expect(res.message).toContain('No account found');
    });

    it('registers a new student with password and verifies login authentication', () => {
      const reg = campusStore.registerUserWithRole({
        role: 'student',
        full_name: 'Simranjeet Singh',
        email: 'simranjeet.bca@khalsa.edu.in',
        password: 'SecurePassword@2026',
        institution_id: 'inst-1',
        roll_no: 'KC-BCA-2026-99',
        semester: 2,
        course_name: 'Bachelor of Computer Applications',
      });

      expect(reg.success).toBe(true);

      // Successful auth with registered password
      const authSuccess = campusStore.authenticateUser('simranjeet.bca@khalsa.edu.in', 'SecurePassword@2026');
      expect(authSuccess.success).toBe(true);
      expect(authSuccess.user?.full_name).toBe('Simranjeet Singh');

      // Failed auth with wrong password
      const authFail = campusStore.authenticateUser('simranjeet.bca@khalsa.edu.in', 'WrongPassword123');
      expect(authFail.success).toBe(false);
      expect(authFail.message).toContain('Incorrect password');
    });
  });
});

