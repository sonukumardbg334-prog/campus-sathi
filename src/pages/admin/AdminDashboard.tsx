import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBackgroundTheme } from '../../context/BackgroundThemeContext';
import { campusStore, store } from '../../lib/store';
import {
  Complaint,
  ParentLinkRequest,
  Student,
  Teacher,
  Course,
  Section,
  Subject,
  AttendanceSubmission,
  AttendanceCorrectionRequest,
  AttendanceConfig,
  Examination,
  ExamResult,
  AcademicCalendarEvent,
  Announcement,
  SupportTicket,
  UserFeedback,
  BugReport,
} from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CollegeBackground } from '../../components/common/CollegeBackground';
import { CampusImageUploader } from '../../components/common/CampusImageUploader';
import {
  Building,
  Users,
  AlertCircle,
  CheckCircle2,
  Settings,
  Download,
  ShieldCheck,
  UserCheck,
  Clock,
  Palette,
  Image as ImageIcon,
  Sparkles,
  BookOpen,
  CalendarCheck,
  Award,
  Upload,
  Calendar,
  Bell,
  Plus,
  Search,
  Check,
  X,
  FileSpreadsheet,
  Layers,
  LifeBuoy,
  Bug,
  MessageSquarePlus,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminDashboard: React.FC = () => {
  const { user, institution } = useAuth();
  const { refreshTheme } = useBackgroundTheme();
  const instId = institution?.id || 'demo-inst-001';

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    | 'OVERVIEW'
    | 'STUDENTS'
    | 'FACULTY'
    | 'ACADEMICS'
    | 'ATTENDANCE'
    | 'EXAMS'
    | 'NOTICES'
    | 'CALENDAR'
    | 'PARENT_APPROVALS'
    | 'BRANDING'
    | 'SETTINGS'
    | 'SUPPORT_TICKETS'
  >('OVERVIEW');

  // Support & Helpdesk States
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [feedbacks, setFeedbacks] = useState<UserFeedback[]>([]);
  const [bugReports, setBugReports] = useState<BugReport[]>([]);
  const [supportSubTab, setSupportSubTab] = useState<'TICKETS' | 'BUGS' | 'FEEDBACK'>('TICKETS');
  const [supportFilterStatus, setSupportFilterStatus] = useState<string>('ALL');
  const [supportSearchQuery, setSupportSearchQuery] = useState<string>('');
  const [adminNoteInput, setAdminNoteInput] = useState<{ [id: string]: string }>({});

  // Core Data States
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [parentRequests, setParentRequests] = useState<ParentLinkRequest[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [attendanceConfig, setAttendanceConfig] = useState<AttendanceConfig | null>(null);
  const [attendanceSubmissions, setAttendanceSubmissions] = useState<AttendanceSubmission[]>([]);
  const [attendanceCorrections, setAttendanceCorrections] = useState<AttendanceCorrectionRequest[]>([]);
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<AcademicCalendarEvent[]>([]);

  // Search filters
  const [studentSearch, setStudentSearch] = useState('');
  const [teacherSearch, setTeacherSearch] = useState('');

  // Form Modals / Sub-states
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentRoll, setNewStudentRoll] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');

  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherEmpId, setNewTeacherEmpId] = useState('');
  const [newTeacherDept, setNewTeacherDept] = useState('Computer Science');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');

  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');
  const [newSubjectCredits, setNewSubjectCredits] = useState(4);

  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticeAudience, setNewNoticeAudience] = useState<'ALL' | 'STUDENTS' | 'TEACHERS' | 'PARENTS'>('ALL');
  const [newNoticePriority, setNewNoticePriority] = useState<'NORMAL' | 'URGENT'>('NORMAL');

  // Institution Settings state
  const [parentVisibility, setParentVisibility] = useState(true);
  const [duplicateAlerts, setDuplicateAlerts] = useState(true);
  const [attendanceThreshold, setAttendanceThreshold] = useState(75);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Institution Branding states
  const [brandBg, setBrandBg] = useState<string | undefined>(
    institution?.background_images?.[0] || '/assets/khalsa-college-bg.jpg'
  );
  const [brandLogo, setBrandLogo] = useState<string | undefined>(institution?.logo_url);
  const [brandTagline, setBrandTagline] = useState<string>(institution?.hero_tagline || '');
  const [brandDescription, setBrandDescription] = useState<string>(institution?.description || '');
  const [brandPrimary, setBrandPrimary] = useState<string>(
    institution?.theme_config?.primary_color || '#142B4A'
  );
  const [brandSecondary, setBrandSecondary] = useState<string>(
    institution?.theme_config?.secondary_color || '#2563EB'
  );
  const [brandAccent, setBrandAccent] = useState<string>(
    institution?.theme_config?.accent_color || '#06B6D4'
  );
  const [brandingSaved, setBrandingSaved] = useState(false);

  // Sync state from store
  const refreshAllData = () => {
    setComplaints(campusStore.getComplaints(instId));
    setParentRequests(campusStore.getParentRequests());
    setStudents(campusStore.getStudents(instId));
    setTeachers(campusStore.getTeachers(instId));
    setCourses(campusStore.getCourses(instId));
    setSections(campusStore.getSections(instId));
    setSubjects(campusStore.getSubjects(instId));
    setAttendanceConfig(campusStore.getAttendanceConfig(instId));
    setAttendanceSubmissions(campusStore.getAttendanceSubmissions(instId));
    setAttendanceCorrections(campusStore.getAttendanceCorrections(instId));
    setExaminations(campusStore.getExaminations(instId));
    setAnnouncements(campusStore.getAnnouncements(instId));
    setCalendarEvents(campusStore.getCalendarEvents(instId));
    setSupportTickets(store.getSupportTickets());
    setFeedbacks(store.getFeedbacks());
    setBugReports(store.getBugReports());
  };

  useEffect(() => {
    refreshAllData();
    return campusStore.subscribe(refreshAllData);
  }, [instId]);

  useEffect(() => {
    if (institution) {
      setBrandBg(institution.background_images?.[0] || '/assets/khalsa-college-bg.jpg');
      setBrandLogo(institution.logo_url);
      setBrandTagline(institution.hero_tagline || '');
      setBrandDescription(institution.description || '');
      setBrandPrimary(institution.theme_config?.primary_color || '#142B4A');
      setBrandSecondary(institution.theme_config?.secondary_color || '#2563EB');
      setBrandAccent(institution.theme_config?.accent_color || '#06B6D4');
    }
  }, [institution]);

  const handleApproveParentLink = (reqId: string) => {
    if (!user) return;
    campusStore.approveParentLinkRequest(reqId, user.full_name);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    campusStore.updateAttendanceConfig(instId, {
      minimum_percentage: attendanceThreshold,
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution) return;

    const success = campusStore.updateInstitutionBranding(
      institution.id,
      {
        background_images: brandBg ? [brandBg] : ['/assets/khalsa-college-bg.jpg'],
        logo_url: brandLogo,
        hero_tagline: brandTagline,
        description: brandDescription,
        theme_config: {
          primary_color: brandPrimary,
          secondary_color: brandSecondary,
          accent_color: brandAccent,
          custom_tagline: brandTagline,
        },
      },
      user?.full_name || 'Campus Administrator',
      user?.role || 'institution_admin'
    );

    if (success) {
      refreshTheme();
      setBrandingSaved(true);
      setTimeout(() => setBrandingSaved(false), 3500);
    }
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newStudentRoll) return;
    campusStore.addStudent({
      institution_id: instId,
      user_id: `user-${Date.now()}`,
      full_name: newStudentName,
      email: newStudentEmail || `${newStudentRoll.toLowerCase()}@khalsa.ac.in`,
      enrollment_no: `ENR-2026-${newStudentRoll}`,
      roll_no: newStudentRoll,
      current_semester: 6,
      batch_year: 2026,
      department_name: 'Computer Science & AI',
      course_name: courses[0]?.name || 'B.Tech Computer Science & Engineering',
    });
    setNewStudentName('');
    setNewStudentRoll('');
    setNewStudentEmail('');
    setShowAddStudentModal(false);
  };

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName || !newTeacherEmpId) return;
    campusStore.addTeacher({
      institution_id: instId,
      user_id: `user-${Date.now()}`,
      full_name: newTeacherName,
      employee_id: newTeacherEmpId,
      department: newTeacherDept,
      designation: 'Assistant Professor',
      email: newTeacherEmail || `${newTeacherEmpId.toLowerCase()}@khalsa.ac.in`,
      phone: '+91 98111 22334',
      assigned_subjects: [],
      assigned_classes: [],
    });
    setNewTeacherName('');
    setNewTeacherEmpId('');
    setNewTeacherEmail('');
    setShowAddTeacherModal(false);
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName || !newSubjectCode) return;
    campusStore.addSubject({
      institution_id: instId,
      course_id: courses[0]?.id || 'course-btech-cse',
      course_name: courses[0]?.name || 'B.Tech Computer Science & Engineering',
      semester: 6,
      name: newSubjectName,
      code: newSubjectCode,
      credits: Number(newSubjectCredits),
    });
    setNewSubjectName('');
    setNewSubjectCode('');
    setShowAddSubjectModal(false);
  };

  const handlePublishNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle || !newNoticeContent) return;
    campusStore.publishAnnouncement({
      institution_id: instId,
      title: newNoticeTitle,
      content: newNoticeContent,
      audience: newNoticeAudience,
      priority: newNoticePriority,
      author_name: user?.full_name || 'Dean Academic Affairs',
    });
    setNewNoticeTitle('');
    setNewNoticeContent('');
    confetti({ particleCount: 35, spread: 60 });
  };

  // CSV Exporters
  const downloadAttendanceCSV = () => {
    const csv = campusStore.exportAttendanceToCSV(instId);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `attendance_records_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const downloadStudentsCSV = () => {
    const csv = campusStore.exportStudentsToCSV(instId);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `student_roster_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const downloadExamResultsCSV = () => {
    if (examinations.length === 0) return;
    const csv = campusStore.exportExamResultsToCSV(examinations[0].id);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `exam_results_${examinations[0].id}.csv`;
    link.click();
  };

  // Analytics Metrics
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const pendingSubmissions = attendanceSubmissions.filter((s) => s.status === 'PENDING_APPROVAL').length;
  const pendingCorrections = attendanceCorrections.filter((c) => c.status === 'PENDING').length;
  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter((c) => c.status === 'RESOLVED').length;
  const pendingParentLinks = parentRequests.filter((r) => r.status === 'PENDING').length;

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-white p-4 sm:p-6 space-y-6">
      <CollegeBackground variant="subtle-dash" overlayOpacity="deep-navy" />

      {/* Main Administrative Header Card */}
      <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-xl backdrop-blur-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  Campus Administration Console
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {institution?.name || 'Khalsa College of Engineering and Technology'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-slate-900 dark:text-white">
                Academic Operations & Campus Governance
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                Multi-Department Control: Students, Faculty, Timetables, Attendance Governance & Examination Gating.
              </p>
            </div>

            {/* Quick Export Hub */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                onClick={downloadAttendanceCSV}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" /> Attendance CSV
              </Button>
              <Button
                onClick={downloadStudentsCSV}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Users className="w-3.5 h-3.5 text-blue-400" /> Student CSV
              </Button>
            </div>
          </div>

          {/* Navigation Bar Tabs */}
          <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-200 dark:border-white/10">
            {[
              { id: 'OVERVIEW', label: 'Analytics Overview', icon: Building },
              { id: 'STUDENTS', label: `Students (${totalStudents})`, icon: Users },
              { id: 'FACULTY', label: `Faculty (${totalTeachers})`, icon: BookOpen },
              { id: 'ACADEMICS', label: 'Courses & Subjects', icon: Layers },
              {
                id: 'ATTENDANCE',
                label: `Attendance Approval (${pendingSubmissions})`,
                icon: CalendarCheck,
                badge: pendingSubmissions > 0,
              },
              { id: 'EXAMS', label: 'Examinations & Gating', icon: Award },
              { id: 'NOTICES', label: 'Broadcast Notices', icon: Bell },
              { id: 'CALENDAR', label: 'Academic Calendar', icon: Calendar },
              {
                id: 'PARENT_APPROVALS',
                label: `Parent Verification (${pendingParentLinks})`,
                icon: UserCheck,
              },
              { id: 'BRANDING', label: 'Campus Theme & Branding', icon: Palette },
              { id: 'SETTINGS', label: 'Policies & Security', icon: Settings },
              {
                id: 'SUPPORT_TICKETS',
                label: `Helpdesk & Issues (${supportTickets.filter(t => t.status !== 'Resolved').length})`,
                icon: LifeBuoy,
                badge: supportTickets.filter(t => t.status !== 'Resolved').length > 0,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all relative ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Enrolled Students</span>
                  <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{totalStudents}</div>
                  <span className="text-[11px] text-teal-600 dark:text-teal-400 font-bold">100% Verified Profiles</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Faculty Members</span>
                  <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{totalTeachers}</div>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">All Departments Assigned</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pending Attendance Cycles</span>
                  <div className="text-3xl font-extrabold text-amber-500 mt-1">{pendingSubmissions}</div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">15-Day & Monthly Reports</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <CalendarCheck className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Grievance Resolutions</span>
                  <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                    {resolvedComplaints} / {totalComplaints}
                  </div>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                    {totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 100}% Resolved
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Notice Broadcast Form */}
          <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
            <CardHeader className="py-4 px-6 border-b border-slate-200 dark:border-white/10">
              <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-500" />
                Rapid Broadcast Notice to Campus
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handlePublishNotice} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Circular / Notice Title
                    </label>
                    <input
                      type="text"
                      required
                      value={newNoticeTitle}
                      onChange={(e) => setNewNoticeTitle(e.target.value)}
                      placeholder="e.g. Mandatory End-Semester Exam Registration & 75% Attendance Cutoff"
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Target Audience
                    </label>
                    <select
                      value={newNoticeAudience}
                      onChange={(e) => setNewNoticeAudience(e.target.value as any)}
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                    >
                      <option value="ALL">Entire Campus Community</option>
                      <option value="STUDENTS">Students Only</option>
                      <option value="TEACHERS">Faculty Only</option>
                      <option value="PARENTS">Parents Only</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Notice Description & Directives
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={newNoticeContent}
                    onChange={(e) => setNewNoticeContent(e.target.value)}
                    placeholder="Provide full text of administrative circular..."
                    className="w-full p-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2">
                    Publish Official Notice
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: STUDENTS */}
      {activeTab === 'STUDENTS' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by Roll No or Name..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={downloadStudentsCSV}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Export Roster CSV
              </Button>
              <Button
                onClick={() => setShowAddStudentModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add New Student
              </Button>
            </div>
          </div>

          {showAddStudentModal && (
            <Card className="border border-blue-500/40 bg-white/95 dark:bg-slate-900/90 shadow-xl p-5">
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Enroll New Student</h3>
                  <button type="button" onClick={() => setShowAddStudentModal(false)}>
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      placeholder="e.g. Jaspreet Singh"
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Roll Number</label>
                    <input
                      type="text"
                      required
                      value={newStudentRoll}
                      onChange={(e) => setNewStudentRoll(e.target.value)}
                      placeholder="e.g. 22CS115"
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Official Email</label>
                    <input
                      type="email"
                      value={newStudentEmail}
                      onChange={(e) => setNewStudentEmail(e.target.value)}
                      placeholder="e.g. 22cs115@khalsa.ac.in"
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddStudentModal(false)} className="text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold">
                    Enroll Student
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Students Table */}
          <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
            <CardHeader className="py-4 px-6 border-b border-slate-200 dark:border-white/10">
              <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white">
                Enrolled Student Directory ({students.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-900 dark:text-white">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-white/10">
                    <tr>
                      <th className="py-3 px-4">Roll Number</th>
                      <th className="py-3 px-4">Full Name</th>
                      <th className="py-3 px-4">Course & Term</th>
                      <th className="py-3 px-4">Contact Email</th>
                      <th className="py-3 px-4 text-center">Attendance Health</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-white/10 font-medium">
                    {students
                      .filter(
                        (s) =>
                          s.full_name.toLowerCase().includes(studentSearch.toLowerCase()) ||
                          s.roll_no.toLowerCase().includes(studentSearch.toLowerCase())
                      )
                      .map((stu) => {
                        const att = campusStore.calculateStudentAttendance(stu.roll_no, instId);
                        const isShortage = att.overallPercentage !== null && att.overallPercentage < 75;
                        return (
                          <tr key={stu.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                            <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                              {stu.roll_no}
                            </td>
                            <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{stu.full_name}</td>
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                              {stu.course_name} (Sem {stu.current_semester})
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">{stu.email}</td>
                            <td className="py-3 px-4 text-center">
                              {att.overallPercentage !== null ? (
                                <span
                                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                    isShortage
                                      ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                                      : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                  }`}
                                >
                                  {att.overallPercentage}% {isShortage && '⚠️'}
                                </span>
                              ) : (
                                <span className="text-slate-400 text-[11px]">No sessions</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 3: FACULTY */}
      {activeTab === 'FACULTY' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search Faculty by Name or ID..."
                value={teacherSearch}
                onChange={(e) => setTeacherSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
              />
            </div>

            <Button
              onClick={() => setShowAddTeacherModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Faculty Member
            </Button>
          </div>

          {showAddTeacherModal && (
            <Card className="border border-blue-500/40 bg-white/95 dark:bg-slate-900/90 shadow-xl p-5">
              <form onSubmit={handleAddTeacher} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Appoint Faculty Member</h3>
                  <button type="button" onClick={() => setShowAddTeacherModal(false)}>
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Faculty Name</label>
                    <input
                      type="text"
                      required
                      value={newTeacherName}
                      onChange={(e) => setNewTeacherName(e.target.value)}
                      placeholder="e.g. Dr. Harpreet Kaur"
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Employee ID</label>
                    <input
                      type="text"
                      required
                      value={newTeacherEmpId}
                      onChange={(e) => setNewTeacherEmpId(e.target.value)}
                      placeholder="e.g. FAC-2026-08"
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                    <input
                      type="text"
                      value={newTeacherDept}
                      onChange={(e) => setNewTeacherDept(e.target.value)}
                      placeholder="Computer Science"
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                    <input
                      type="email"
                      value={newTeacherEmail}
                      onChange={(e) => setNewTeacherEmail(e.target.value)}
                      placeholder="faculty@khalsa.ac.in"
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddTeacherModal(false)} className="text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold">
                    Confirm Appointment
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Faculty Table */}
          <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
            <CardHeader className="py-4 px-6 border-b border-slate-200 dark:border-white/10">
              <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white">
                Faculty & Teaching Staff Directory ({teachers.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-900 dark:text-white">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-white/10">
                    <tr>
                      <th className="py-3 px-4">Employee ID</th>
                      <th className="py-3 px-4">Faculty Name</th>
                      <th className="py-3 px-4">Designation & Dept</th>
                      <th className="py-3 px-4">Assigned Subjects</th>
                      <th className="py-3 px-4 text-right">Official Email</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-white/10 font-medium">
                    {teachers
                      .filter(
                        (t) =>
                          t.full_name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
                          t.employee_id.toLowerCase().includes(teacherSearch.toLowerCase())
                      )
                      .map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                            {t.employee_id}
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{t.full_name}</td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                            {t.designation} • {t.department}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                              {t.assigned_subjects.length} Subjects
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-slate-500 dark:text-slate-400">
                            {t.email}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 4: ACADEMICS */}
      {activeTab === 'ACADEMICS' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Curriculum & Subjects</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage degrees, semesters, sections, and credit structures.
              </p>
            </div>
            <Button
              onClick={() => setShowAddSubjectModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Subject to Curriculum
            </Button>
          </div>

          {showAddSubjectModal && (
            <Card className="border border-blue-500/40 bg-white/95 dark:bg-slate-900/90 shadow-xl p-5">
              <form onSubmit={handleAddSubject} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Add Curriculum Subject</h3>
                  <button type="button" onClick={() => setShowAddSubjectModal(false)}>
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subject Name</label>
                    <input
                      type="text"
                      required
                      value={newSubjectName}
                      onChange={(e) => setNewSubjectName(e.target.value)}
                      placeholder="e.g. Distributed Cloud Systems"
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Course Code</label>
                    <input
                      type="text"
                      required
                      value={newSubjectCode}
                      onChange={(e) => setNewSubjectCode(e.target.value)}
                      placeholder="e.g. CS-602"
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Credits</label>
                    <input
                      type="number"
                      min={1}
                      max={6}
                      value={newSubjectCredits}
                      onChange={(e) => setNewSubjectCredits(Number(e.target.value))}
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddSubjectModal(false)} className="text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold">
                    Add Subject
                  </Button>
                </div>
              </form>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subj) => (
              <Card key={subj.id} className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
                <CardContent className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-blue-500/15 text-blue-600 dark:text-blue-400">
                      {subj.code}
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {subj.credits} Credits • Sem {subj.semester}
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{subj.name}</h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                    <span>Assigned Faculty:</span>
                    <span className="font-semibold text-teal-600 dark:text-teal-400">
                      {subj.teacher_name || 'Dr. Neha Verma'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: ATTENDANCE APPROVAL & WORKFLOW */}
      {activeTab === 'ATTENDANCE' && (
        <div className="space-y-6">
          <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
            <CardHeader className="py-4 px-6 border-b border-slate-200 dark:border-white/10">
              <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-emerald-500" />
                Attendance Policy Configuration & Statutory Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Statutory Cycle</span>
                  <div className="text-lg font-black text-slate-900 dark:text-white mt-1">15-Day & Monthly</div>
                  <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">Strict Faculty Submission</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Statutory Cutoff Threshold</span>
                  <div className="text-lg font-black text-amber-500 mt-1">75.0% Mandatory</div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Under 75% Triggers Parent Alert</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Calculation Standard</span>
                  <div className="text-lg font-black text-blue-600 dark:text-blue-400 mt-1">
                    (Present + 0.5×Late) / Total
                  </div>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Zero-division Protected</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
            <CardHeader className="py-4 px-6 border-b border-slate-200 dark:border-white/10">
              <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white">
                Faculty Attendance Submissions Review Queue ({attendanceSubmissions.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-900 dark:text-white">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-white/10">
                    <tr>
                      <th className="py-3 px-4">Faculty & Subject</th>
                      <th className="py-3 px-4">Cycle & Period</th>
                      <th className="py-3 px-4 text-center">Conducted</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Admin Approval Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-white/10 font-medium">
                    {attendanceSubmissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">{sub.teacher_name}</div>
                          <div className="text-[11px] text-blue-600 dark:text-blue-400">{sub.subject_name} ({sub.section})</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-mono font-bold">{sub.frequency}</div>
                          <div className="text-[11px] text-slate-400">{sub.period_name}</div>
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-slate-900 dark:text-white">
                          {sub.total_conducted}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              sub.status === 'APPROVED'
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                : sub.status === 'REJECTED'
                                ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                                : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                            }`}
                          >
                            {sub.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          {sub.status === 'PENDING_APPROVAL' ? (
                            <>
                              <button
                                onClick={() => {
                                  campusStore.reviewAttendanceSubmission(
                                    sub.id,
                                    'APPROVE',
                                    user?.full_name || 'College Admin'
                                  );
                                  setAttendanceSubmissions(campusStore.getAttendanceSubmissions(instId));
                                }}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs"
                              >
                                Approve Cycle
                              </button>
                              <button
                                onClick={() => {
                                  campusStore.reviewAttendanceSubmission(
                                    sub.id,
                                    'REJECT',
                                    user?.full_name || 'College Admin',
                                    'Discrepancy in conducted class count.'
                                  );
                                  setAttendanceSubmissions(campusStore.getAttendanceSubmissions(instId));
                                }}
                                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded text-xs"
                              >
                                Reject
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-slate-400">Reviewed by {sub.reviewed_by}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 6: EXAMINATIONS & GATING */}
      {activeTab === 'EXAMS' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Assessments & Results Gating Control</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Control publication of exam results. Gated results remain hidden from student and parent portals.
              </p>
            </div>
            <Button
              onClick={downloadExamResultsCSV}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export Results CSV
            </Button>
          </div>

          <div className="space-y-4">
            {examinations.map((ex) => (
              <Card key={ex.id} className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
                <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400">
                        {ex.status}
                      </span>
                      <span className="text-xs text-slate-400">Exam Date: {ex.exam_date}</span>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                      {ex.name} — {ex.subject_name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Total Weightage: {ex.max_marks} marks • Venue: {ex.venue}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                        ex.status === 'RESULTS_PUBLISHED'
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {ex.status === 'RESULTS_PUBLISHED' ? 'LIVE (Published)' : 'LOCKED (Gated)'}
                    </span>

                    <Button
                      onClick={() => {
                        campusStore.publishExamResults(ex.id);
                        setExaminations(campusStore.getExaminations(instId));
                      }}
                      className={
                        ex.status === 'RESULTS_PUBLISHED'
                          ? 'bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold'
                      }
                    >
                      {ex.status === 'RESULTS_PUBLISHED' ? 'Published' : 'Publish Results to Portal'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: NOTICES */}
      {activeTab === 'NOTICES' && (
        <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
          <CardHeader className="py-4 px-6 border-b border-slate-200 dark:border-white/10">
            <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white">
              Official Campus Notices ({announcements.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-200 dark:divide-white/10">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-5 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/15 text-blue-600 dark:text-blue-400 font-bold uppercase">
                        {ann.audience}
                      </span>
                      {ann.priority === 'URGENT' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400">
                          URGENT
                        </span>
                      )}
                      <span className="text-xs text-slate-400">
                        {new Date(ann.published_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{ann.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{ann.content}</p>
                  </div>

                  <button
                    onClick={() => {
                      campusStore.deleteAnnouncement(ann.id);
                      setAnnouncements(campusStore.getAnnouncements(instId));
                    }}
                    className="text-slate-400 hover:text-rose-500 text-xs font-semibold"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 8: CALENDAR */}
      {activeTab === 'CALENDAR' && (
        <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
          <CardHeader className="py-4 px-6 border-b border-slate-200 dark:border-white/10">
            <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              University Academic Calendar Events (2025-26 Term)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {calendarEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/60 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400">
                      {ev.event_type}
                    </span>
                    <span className="font-mono text-xs text-slate-500 dark:text-slate-400 font-semibold">
                      {ev.start_date} {ev.end_date ? `to ${ev.end_date}` : ''}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{ev.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{ev.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 9: PARENT APPROVALS */}
      {activeTab === 'PARENT_APPROVALS' && (
        <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
          <CardHeader className="py-4 px-6 border-b border-slate-200 dark:border-white/10">
            <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white">
              Parent-Student Verification Queue ({parentRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-900 dark:text-white">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-white/10">
                  <tr>
                    <th className="py-3 px-4">Parent Name & Contact</th>
                    <th className="py-3 px-4">Ward Roll No</th>
                    <th className="py-3 px-4">Relationship</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/10 font-medium">
                  {parentRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4">
                        <div className="font-bold">{req.parent_name}</div>
                        <div className="text-slate-400">{req.parent_email}</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {req.student_enrollment_no}
                      </td>
                      <td className="py-3 px-4 capitalize">{req.relationship_type}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            req.status === 'APPROVED'
                              ? 'bg-emerald-500/20 text-emerald-500'
                              : 'bg-amber-500/20 text-amber-500'
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {req.status === 'PENDING' ? (
                          <Button
                            onClick={() => handleApproveParentLink(req.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                          >
                            Verify & Link
                          </Button>
                        ) : (
                          <span className="text-xs text-slate-400">Verified</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 10: BRANDING */}
      {activeTab === 'BRANDING' && (
        <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
          <CardHeader className="py-4 px-6 border-b border-slate-200 dark:border-white/10">
            <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-teal-500" />
              Institution Identity, Hero Imagery & Brand System
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {brandingSaved && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Campus branding & theme synchronized successfully across all student and faculty screens!</span>
              </div>
            )}

            <form onSubmit={handleSaveBranding} className="space-y-4">
              <CampusImageUploader
                label="Campus Hero Background Photograph"
                value={brandBg}
                onChange={(url: string | undefined) => setBrandBg(url)}
                aspectRatio="hero"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Official College Tagline
                  </label>
                  <input
                    type="text"
                    value={brandTagline}
                    onChange={(e) => setBrandTagline(e.target.value)}
                    placeholder="e.g. Tradition | Technology | Tomorrow"
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Brand Color
                  </label>
                  <div className="flex items-center gap-2 h-10 px-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800">
                    <input
                      type="color"
                      value={brandPrimary}
                      onChange={(e) => setBrandPrimary(e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer"
                    />
                    <span className="font-mono text-xs">{brandPrimary}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2">
                  Save & Apply Branding
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* TAB 11: SETTINGS */}
      {activeTab === 'SETTINGS' && (
        <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
          <CardHeader className="py-4 px-6 border-b border-slate-200 dark:border-white/10">
            <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-500" />
              Institutional Security Policies & Statutory Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {settingsSaved && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Policies synced with database security checks.</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/60">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Allow Parents to View Resolved Grievances</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Hostel and campus maintenance updates visible to verified guardians
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={parentVisibility}
                  onChange={(e) => setParentVisibility(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                  <span>Automated Low-Attendance Alert Threshold</span>
                  <span className="font-mono text-amber-500 font-black">{attendanceThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="85"
                  step="1"
                  value={attendanceThreshold}
                  onChange={(e) => setAttendanceThreshold(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Automated notification dispatched to parents when attendance drops below this number.
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2">
                  Save Policy Configuration
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* TAB 12: SUPPORT TICKETS & BUG REPORTS */}
      {activeTab === 'SUPPORT_TICKETS' && (
        <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
          <CardHeader className="py-4 px-6 border-b border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <LifeBuoy className="w-4 h-4 text-blue-500" />
                Helpdesk Inquiries, Feedback & Bug Reports
              </CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Review submitted requests, update resolution status, and add internal engineer notes.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={() => {
                  let csv = '';
                  if (supportSubTab === 'TICKETS') {
                    csv = 'ID,Date,Name,Email,Category,Subject,Status,AdminNotes\n' +
                      supportTickets.map(t => `"${t.id}","${t.created_at}","${t.full_name || t.name}","${t.email}","${t.category}","${t.subject.replace(/"/g, '""')}","${t.status}","${(t.admin_notes || '').replace(/"/g, '""')}"`).join('\n');
                  } else if (supportSubTab === 'BUGS') {
                    csv = 'ID,Date,Reporter,Email,Category,Severity,Title,Status\n' +
                      bugReports.map(b => `"${b.id}","${b.created_at}","${b.reporter_name}","${b.email || b.reporter_email || ''}","${b.category}","${b.severity}","${b.title.replace(/"/g, '""')}","${b.status}"`).join('\n');
                  } else {
                    csv = 'ID,Date,Name,Email,Role,Rating,Category,Comment\n' +
                      feedbacks.map(f => `"${f.id}","${f.created_at}","${f.full_name || f.user_name || ''}","${f.email || f.user_email || ''}","${f.role || ''}",${f.rating ?? 5},"${f.category}","${(f.comment || f.feedback || '').replace(/"/g, '""')}"`).join('\n');
                  }
                  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `campussaathi_${supportSubTab.toLowerCase()}_export.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-5">
            {/* Sub-tab navigation */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSupportSubTab('TICKETS')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    supportSubTab === 'TICKETS'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Support Tickets ({supportTickets.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSupportSubTab('BUGS')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    supportSubTab === 'BUGS'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Bug Reports ({bugReports.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSupportSubTab('FEEDBACK')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    supportSubTab === 'FEEDBACK'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  User Feedback ({feedbacks.length})
                </button>
              </div>

              {/* Search & Filter */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search ID, sender, keywords..."
                  value={supportSearchQuery}
                  onChange={(e) => setSupportSearchQuery(e.target.value)}
                  className="px-3 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <select
                  value={supportFilterStatus}
                  onChange={(e) => setSupportFilterStatus(e.target.value)}
                  className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>

            {/* Content for TICKETS */}
            {supportSubTab === 'TICKETS' && (
              <div className="space-y-4">
                {supportTickets
                  .filter((t) => {
                    const matchStatus = supportFilterStatus === 'ALL' || t.status === supportFilterStatus;
                    const q = supportSearchQuery.toLowerCase();
                    const matchQ =
                      !q ||
                      t.id.toLowerCase().includes(q) ||
                      (t.full_name || t.name).toLowerCase().includes(q) ||
                      t.email.toLowerCase().includes(q) ||
                      t.subject.toLowerCase().includes(q);
                    return matchStatus && matchQ;
                  })
                  .map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                            {ticket.id}
                          </span>
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                            {ticket.full_name || ticket.name} ({ticket.email})
                          </span>
                          {ticket.phone && (
                            <span className="text-[11px] text-slate-500">📞 {ticket.phone}</span>
                          )}
                          {ticket.college_name && (
                            <span className="text-[11px] text-slate-500">• {ticket.college_name}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            {ticket.category}
                          </span>
                          <select
                            value={ticket.status}
                            onChange={(e) => {
                              store.updateSupportTicketStatus(ticket.id, e.target.value as any);
                              setSupportTickets(store.getSupportTickets());
                            }}
                            className="text-xs font-bold rounded-lg px-2 py-1 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                          >
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                          {ticket.subject}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          {ticket.description || ticket.message}
                        </p>
                      </div>

                      {ticket.attachment_name && (
                        <div className="text-[11px] text-blue-600 dark:text-cyan-400 flex items-center gap-1 font-semibold">
                          📎 Attachment: {ticket.attachment_name}
                        </div>
                      )}

                      {/* Admin Note Section */}
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700/80 flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Add official resolution or internal note..."
                          value={adminNoteInput[ticket.id] !== undefined ? adminNoteInput[ticket.id] : (ticket.admin_notes || '')}
                          onChange={(e) =>
                            setAdminNoteInput({ ...adminNoteInput, [ticket.id]: e.target.value })
                          }
                          className="flex-1 px-3 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const note = adminNoteInput[ticket.id] ?? ticket.admin_notes ?? '';
                            store.updateSupportTicketStatus(ticket.id, ticket.status, note);
                            setSupportTickets(store.getSupportTickets());
                          }}
                          className="px-3 py-1 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Save Note
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Content for BUGS */}
            {supportSubTab === 'BUGS' && (
              <div className="space-y-4">
                {bugReports.map((bug) => (
                  <div
                    key={bug.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/40 px-2 py-0.5 rounded border border-red-200 dark:border-red-800">
                          {bug.id}
                        </span>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {bug.reporter_name} ({bug.email || bug.reporter_email || ''})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300">
                          {bug.severity}
                        </span>
                        <select
                          value={bug.status}
                          onChange={(e) => {
                            store.updateBugReportStatus(bug.id, e.target.value as any);
                            setBugReports(store.getBugReports());
                          }}
                          className="text-xs font-bold rounded-lg px-2 py-1 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                          <option value="Open">Open</option>
                          <option value="Investigating">Investigating</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {bug.title}
                    </h4>

                    <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                      <div>
                        <strong>Steps:</strong> <span className="font-mono">{bug.steps_to_reproduce}</span>
                      </div>
                      <div>
                        <strong>Actual:</strong> {bug.actual_behavior || bug.actual_result || ''}
                      </div>
                      {(bug.browser_info || bug.browser_device_info) && (
                        <div className="text-[11px] text-slate-500 font-mono truncate">
                          Env: {bug.browser_info || bug.browser_device_info}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Content for FEEDBACK */}
            {supportSubTab === 'FEEDBACK' && (
              <div className="space-y-4">
                {feedbacks.map((fb) => (
                  <div
                    key={fb.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                          {fb.id}
                        </span>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {fb.full_name || fb.user_name || 'Anonymous'} ({fb.role || 'Member'})
                        </span>
                      </div>
                      <span className="text-xs font-bold text-amber-500">
                        {'★'.repeat(fb.rating ?? 5)}{'☆'.repeat(5 - (fb.rating ?? 5))}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                      "{fb.comment || fb.feedback || ''}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
