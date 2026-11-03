import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { campusStore } from '../../lib/store';
import {
  AttendanceStatus,
  AttendanceSubmission,
  AttendanceCorrectionRequest,
  Assignment,
  AssignmentSubmission,
  StudyMaterial,
  Examination,
  ExamResult,
  Subject,
  Section,
} from '../../types';

interface StudentRosterItem {
  id: string;
  name: string;
  roll: string;
  status: AttendanceStatus;
}
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CollegeBackground } from '../../components/common/CollegeBackground';
import {
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  Users,
  Clock,
  Sparkles,
  Upload,
  AlertTriangle,
  FileText,
  Download,
  Award,
  Send,
  Plus,
  X,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TeacherDashboard: React.FC = () => {
  const { user, institution } = useAuth();
  const instId = institution?.id || 'demo-inst-001';

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<
    'DAILY_REGISTER' | 'SUBMISSIONS_IMPORT' | 'CORRECTIONS' | 'ASSIGNMENTS' | 'STUDY_MATERIALS' | 'TIMETABLE' | 'EXAM_MARKS'
  >('DAILY_REGISTER');

  // Teacher Info & Subjects
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');

  // Daily Register State
  const [roster, setRoster] = useState<StudentRosterItem[]>([]);
  const [sessionTopic, setSessionTopic] = useState('Dynamic Programming & Graph Traversal');
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [sessionSavedMessage, setSessionSavedMessage] = useState<string | null>(null);

  // 15-Day / Monthly Submissions State
  const [submissions, setSubmissions] = useState<AttendanceSubmission[]>([]);
  const [submissionCycle, setSubmissionCycle] = useState<'15_DAY' | 'MONTHLY'>('15_DAY');
  const [subPeriodName, setSubPeriodName] = useState('Cycle 1 (Oct 1 - Oct 15, 2026)');
  const [subTotalClasses, setSubTotalClasses] = useState(12);
  const [subRemarks, setSubRemarks] = useState('');
  const [csvContent, setCsvContent] = useState('');
  const [csvValidationReport, setCsvValidationReport] = useState<{
    valid: boolean;
    validCount: number;
    errorCount: number;
    errors: { row: number; rollNo?: string; error: string }[];
  } | null>(null);

  // Corrections State
  const [corrections, setCorrections] = useState<AttendanceCorrectionRequest[]>([]);

  // Assignments State
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('');
  const [submissionsList, setSubmissionsList] = useState<AssignmentSubmission[]>([]);
  const [newAssignmentTitle, setNewAssignmentTitle] = useState('');
  const [newAssignmentDesc, setNewAssignmentDesc] = useState('');
  const [newAssignmentDueDate, setNewAssignmentDueDate] = useState('2026-11-10');
  const [newAssignmentMaxMarks, setNewAssignmentMaxMarks] = useState(100);
  const [showNewAssignmentModal, setShowNewAssignmentModal] = useState(false);

  // Study Materials State
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([]);
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialDesc, setMaterialDesc] = useState('');
  const [materialUrl, setMaterialUrl] = useState('https://storage.campussaathi.edu/notes/module-3.pdf');
  const [materialFileType, setMaterialFileType] = useState<'PDF' | 'DOC' | 'PPT' | 'NOTES'>('PDF');

  // Examinations & Marks
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [examMarksEntry, setExamMarksEntry] = useState<{ [studentId: string]: { marks: number; remarks: string } }>({});

  // Sync with store
  const refreshData = () => {
    const subjList = campusStore.getSubjects(instId);
    setSubjects(subjList);
    if (subjList.length > 0 && !selectedSubjectId) {
      setSelectedSubjectId(subjList[0].id);
    }

    const secList = campusStore.getSections(instId);
    setSections(secList);
    if (secList.length > 0 && !selectedSectionId) {
      setSelectedSectionId(secList[0].id);
    }

    const stuList = campusStore.getStudents(instId);
    setRoster(
      stuList.map((stu) => ({
        id: stu.id,
        name: stu.full_name,
        roll: stu.roll_no,
        status: 'PRESENT',
      }))
    );

    setSubmissions(campusStore.getAttendanceSubmissions(instId));
    setCorrections(campusStore.getAttendanceCorrections(instId));

    const asgList = campusStore.getAssignments(instId);
    setAssignments(asgList);
    if (asgList.length > 0 && !selectedAssignmentId) {
      setSelectedAssignmentId(asgList[0].id);
      setSubmissionsList(campusStore.getAssignmentSubmissions(asgList[0].id));
    }

    setStudyMaterials(campusStore.getStudyMaterials(instId));

    const examList = campusStore.getExaminations(instId);
    setExaminations(examList);
    if (examList.length > 0 && !selectedExamId) {
      setSelectedExamId(examList[0].id);
      const res = campusStore.getExamResults(examList[0].id);
      setExamResults(res);
      const markMap: { [studentId: string]: { marks: number; remarks: string } } = {};
      res.forEach((r) => {
        markMap[r.student_id] = { marks: r.marks_obtained, remarks: r.remarks || '' };
      });
      setExamMarksEntry(markMap);
    }
  };

  useEffect(() => {
    refreshData();
    return campusStore.subscribe(refreshData);
  }, [instId]);

  useEffect(() => {
    if (selectedAssignmentId) {
      setSubmissionsList(campusStore.getAssignmentSubmissions(selectedAssignmentId));
    }
  }, [selectedAssignmentId]);

  useEffect(() => {
    if (selectedExamId) {
      const res = campusStore.getExamResults(selectedExamId);
      setExamResults(res);
      const markMap: { [studentId: string]: { marks: number; remarks: string } } = {};
      res.forEach((r) => {
        markMap[r.student_id] = { marks: r.marks_obtained, remarks: r.remarks || '' };
      });
      setExamMarksEntry(markMap);
    }
  }, [selectedExamId]);

  // Bulk actions for daily roster
  const setAllStatus = (status: AttendanceStatus) => {
    setRoster((prev) => prev.map((s) => ({ ...s, status })));
  };

  const invertStatus = () => {
    setRoster((prev) =>
      prev.map((s) => ({
        ...s,
        status: s.status === 'PRESENT' ? 'ABSENT' : 'PRESENT',
      }))
    );
  };

  const handleSaveDailySession = () => {
    const subj = subjects.find((s) => s.id === selectedSubjectId);
    const sec = sections.find((s) => s.id === selectedSectionId);

    const newRecords = roster.map((stu) => ({
      institution_id: instId,
      student_id: stu.id,
      student_name: stu.name,
      roll_no: stu.roll,
      subject_name: subj ? subj.name : 'Computer Science',
      session_date: sessionDate,
      status: stu.status,
      semester: sec ? sec.semester : 6,
      section: sec ? sec.name : 'Section A',
      recorded_by_name: user?.full_name || 'Dr. Neha Verma',
    }));
    campusStore.recordAttendanceBatch(newRecords);

    confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    setSessionSavedMessage(`Attendance recorded for ${roster.length} students on ${sessionDate}!`);
    setTimeout(() => setSessionSavedMessage(null), 4000);
  };

  // CSV Validator & Importer
  const handleValidateCSV = () => {
    const report = campusStore.validateAndParseAttendanceCSV(
      csvContent,
      instId,
      'B.Tech Computer Science & Engineering',
      6,
      'Artificial Intelligence & Neural Nets'
    );
    setCsvValidationReport({
      valid: report.errors.length === 0,
      validCount: report.validRecords.length,
      errorCount: report.errors.length,
      errors: report.errors,
    });
  };

  const handleSubmitAttendanceReport = () => {
    const subj = subjects.find((s) => s.id === selectedSubjectId);
    const sec = sections.find((s) => s.id === selectedSectionId);
    const presentCount = roster.filter((s) => s.status === 'PRESENT').length;
    const lateCount = roster.filter((s) => s.status === 'LATE').length;
    const absentCount = roster.filter((s) => s.status === 'ABSENT').length;
    const excusedCount = roster.filter((s) => s.status === 'EXCUSED').length;

    campusStore.submitAttendanceReport({
      institution_id: instId,
      period_name: subPeriodName,
      frequency: submissionCycle,
      subject_name: subj?.name || 'Computer Science',
      course_name: 'B.Tech Computer Science & Engineering',
      semester: sec ? sec.semester : 6,
      section: sec ? sec.name : 'Section A',
      teacher_id: user?.id || 'teacher-01',
      teacher_name: user?.full_name || 'Dr. Neha Verma',
      total_conducted: subTotalClasses,
      total_records: roster.length * subTotalClasses,
      present_count: presentCount * subTotalClasses,
      absent_count: absentCount * subTotalClasses,
      late_count: lateCount * subTotalClasses,
      excused_count: excusedCount * subTotalClasses,
      average_attendance_pct: Math.round(((presentCount + 0.5 * lateCount) / (roster.length || 1)) * 100),
      records_count: roster.length,
    });

    confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
    setSubmissions(campusStore.getAttendanceSubmissions(instId));
    setSubRemarks('');
    setCsvValidationReport(null);
    setCsvContent('');
    setSessionSavedMessage('Attendance report submitted to College Admin for approval!');
    setTimeout(() => setSessionSavedMessage(null), 4000);
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignmentTitle) return;
    const subj = subjects.find((s) => s.id === selectedSubjectId);
    const sec = sections.find((s) => s.id === selectedSectionId);

    campusStore.createAssignment({
      institution_id: instId,
      course_name: 'B.Tech Computer Science & Engineering',
      semester: sec ? sec.semester : 6,
      section: sec ? sec.name : 'Section A',
      subject_name: subj?.name || 'Computer Science',
      title: newAssignmentTitle,
      description: newAssignmentDesc,
      due_date: newAssignmentDueDate,
      max_marks: Number(newAssignmentMaxMarks),
      created_by_name: user?.full_name || 'Dr. Neha Verma',
    });

    setAssignments(campusStore.getAssignments(instId));
    setNewAssignmentTitle('');
    setNewAssignmentDesc('');
    setShowNewAssignmentModal(false);
  };

  const handleSaveGrade = (submissionId: string, studentId: string) => {
    const markEntry = examMarksEntry[studentId];
    if (markEntry) {
      campusStore.gradeAssignmentSubmission(
        submissionId,
        markEntry.marks,
        markEntry.remarks,
        user?.full_name || 'Dr. Neha Verma'
      );
      setSubmissionsList(campusStore.getAssignmentSubmissions(selectedAssignmentId));
    }
  };

  const handleUploadMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialTitle) return;
    const subj = subjects.find((s) => s.id === selectedSubjectId);
    const sec = sections.find((s) => s.id === selectedSectionId);

    campusStore.uploadStudyMaterial({
      institution_id: instId,
      course_name: 'B.Tech Computer Science & Engineering',
      semester: sec ? sec.semester : 6,
      subject_name: subj?.name || 'Computer Science',
      title: materialTitle,
      description: materialDesc,
      file_type: materialFileType,
      file_url: materialUrl,
      file_size: '4.2 MB',
      uploaded_by_name: user?.full_name || 'Dr. Neha Verma',
    });

    setStudyMaterials(campusStore.getStudyMaterials(instId));
    setMaterialTitle('');
    setMaterialDesc('');
  };

  const handleSaveExamMarks = () => {
    if (!selectedExamId) return;
    const stuList = campusStore.getStudents(instId);
    const exam = examinations.find((e) => e.id === selectedExamId);

    stuList.forEach((stu) => {
      const entry = examMarksEntry[stu.id];
      if (entry) {
        campusStore.recordExamResult({
          institution_id: instId,
          exam_id: selectedExamId,
          exam_name: exam?.name || 'Assessment',
          student_id: stu.id,
          student_name: stu.full_name,
          student_roll: stu.roll_no,
          subject_name: exam?.subject_name || 'Computer Science',
          marks_obtained: entry.marks,
          max_marks: exam?.max_marks || 100,
          is_published: exam?.status === 'RESULTS_PUBLISHED',
          remarks: entry.remarks,
        });
      }
    });

    setExamResults(campusStore.getExamResults(selectedExamId));
    confetti({ particleCount: 30, spread: 50 });
    setSessionSavedMessage('Examination marks recorded successfully!');
    setTimeout(() => setSessionSavedMessage(null), 3000);
  };

  const presentCount = roster.filter((s) => s.status === 'PRESENT').length;
  const lateCount = roster.filter((s) => s.status === 'LATE').length;
  const absentCount = roster.filter((s) => s.status === 'ABSENT').length;
  const excusedCount = roster.filter((s) => s.status === 'EXCUSED').length;

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-white p-4 sm:p-6 space-y-6">
      <CollegeBackground variant="subtle-dash" overlayOpacity="deep-navy" />

      {/* Top Header Card */}
      <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-xl backdrop-blur-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                  Faculty ERP Portal
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Term: Spring 2026 • Academic Year 2025-26
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-slate-900 dark:text-white">
                {user?.full_name || 'Dr. Neha Verma'}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                Senior Associate Professor • Department of Computer Science & Artificial Intelligence
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3">
              <div className="text-center px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10">
                <span className="block text-xl font-black text-slate-900 dark:text-white">{subjects.length}</span>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Assigned Subjects</span>
              </div>
              <div className="text-center px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10">
                <span className="block text-xl font-black text-teal-600 dark:text-teal-400">
                  {submissions.filter((s) => s.status === 'PENDING_APPROVAL').length}
                </span>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Pending Cycles</span>
              </div>
              <div className="text-center px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10">
                <span className="block text-xl font-black text-amber-500">{assignments.length}</span>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Active Tasks</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-200 dark:border-white/10">
            {[
              { id: 'DAILY_REGISTER', label: 'Daily Session Register', icon: CalendarCheck },
              { id: 'SUBMISSIONS_IMPORT', label: '15-Day / Monthly Submissions & CSV', icon: Upload },
              { id: 'CORRECTIONS', label: `Corrections (${corrections.filter((c) => c.status === 'PENDING').length})`, icon: AlertTriangle },
              { id: 'ASSIGNMENTS', label: 'Assignments & Grading', icon: BookOpen },
              { id: 'STUDY_MATERIALS', label: 'Course Materials', icon: FileText },
              { id: 'TIMETABLE', label: 'My Lecture Timetable', icon: Clock },
              { id: 'EXAM_MARKS', label: 'Exam Marks Entry', icon: Award },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Success Notification Alert */}
      {sessionSavedMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-800 dark:text-emerald-200 flex items-center justify-between animate-fade-in text-xs font-bold">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>{sessionSavedMessage}</span>
          </div>
          <button onClick={() => setSessionSavedMessage(null)} className="underline">
            Dismiss
          </button>
        </div>
      )}

      {/* TAB 1: DAILY SESSION REGISTER */}
      {activeTab === 'DAILY_REGISTER' && (
        <div className="space-y-6">
          <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
            <CardContent className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Select Subject
                  </label>
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.code} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Section & Classroom
                  </label>
                  <select
                    value={selectedSectionId}
                    onChange={(e) => setSelectedSectionId(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
                  >
                    {sections.map((sec) => (
                      <option key={sec.id} value={sec.id}>
                        {sec.name} ({sec.room_number || 'Room 304'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Session Date
                  </label>
                  <input
                    type="date"
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Lecture Topic Covered
                  </label>
                  <input
                    type="text"
                    value={sessionTopic}
                    onChange={(e) => setSessionTopic(e.target.value)}
                    placeholder="e.g. Backpropagation, Matrix Calculus"
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Fast Bulk Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Bulk Actions:</span>
                  <button
                    onClick={() => setAllStatus('PRESENT')}
                    className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25"
                  >
                    All Present
                  </button>
                  <button
                    onClick={() => setAllStatus('ABSENT')}
                    className="px-2.5 py-1 text-xs font-semibold rounded bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 hover:bg-rose-500/25"
                  >
                    All Absent
                  </button>
                  <button
                    onClick={invertStatus}
                    className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300"
                  >
                    Invert Marks
                  </button>
                </div>

                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="text-emerald-600 dark:text-emerald-400">Present: {presentCount}</span>
                  <span className="text-amber-600 dark:text-amber-400">Late: {lateCount}</span>
                  <span className="text-rose-600 dark:text-rose-400">Absent: {absentCount}</span>
                  <span className="text-blue-600 dark:text-blue-400">Excused: {excusedCount}</span>
                  <Button
                    onClick={handleSaveDailySession}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 text-xs flex items-center gap-1.5 shadow"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Save Daily Session
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student Roster Table */}
          <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
            <CardHeader className="py-4 px-6 border-b border-slate-200 dark:border-white/10 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white">
                  Class Student Register ({roster.length} Enrolled)
                </CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Tap or click status buttons to toggle student attendance in real time.
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-900 dark:text-white">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-white/10">
                    <tr>
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">Roll Number</th>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4 text-center">Attendance Status</th>
                      <th className="py-3 px-4 text-right">Action Quick-Toggle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-white/10 font-medium">
                    {roster.map((stu, idx) => (
                      <tr key={stu.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{idx + 1}</td>
                        <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                          {stu.roll}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{stu.name}</td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              stu.status === 'PRESENT'
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                : stu.status === 'LATE'
                                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                                : stu.status === 'ABSENT'
                                ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                                : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                            }`}
                          >
                            {stu.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex rounded-lg shadow-sm border border-slate-300 dark:border-white/20 overflow-hidden">
                            {(['PRESENT', 'LATE', 'ABSENT', 'EXCUSED'] as AttendanceStatus[]).map((st) => (
                              <button
                                key={st}
                                onClick={() => {
                                  setRoster((prev) =>
                                    prev.map((s) => (s.id === stu.id ? { ...s, status: st } : s))
                                  );
                                }}
                                className={`px-2 py-1 text-[10px] font-bold transition-colors ${
                                  stu.status === st
                                    ? st === 'PRESENT'
                                      ? 'bg-emerald-600 text-white'
                                      : st === 'LATE'
                                      ? 'bg-amber-600 text-white'
                                      : st === 'ABSENT'
                                      ? 'bg-rose-600 text-white'
                                      : 'bg-blue-600 text-white'
                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`}
                              >
                                {st[0]}
                              </button>
                            ))}
                          </div>
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

      {/* TAB 2: 15-DAY / MONTHLY SUBMISSIONS & CSV */}
      {activeTab === 'SUBMISSIONS_IMPORT' && (
        <div className="space-y-6">
          <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
            <CardHeader className="py-4 px-6 border-b border-slate-200 dark:border-white/10">
              <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-500" />
                Submit 15-Day / Monthly Attendance Report to College Admin
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Cycle Type
                  </label>
                  <select
                    value={submissionCycle}
                    onChange={(e) => setSubmissionCycle(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                  >
                    <option value="15_DAY">15-Day Cycle</option>
                    <option value="MONTHLY">Full Month Cycle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Cycle Period Name
                  </label>
                  <input
                    type="text"
                    value={subPeriodName}
                    onChange={(e) => setSubPeriodName(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Total Classes Conducted
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={subTotalClasses}
                    onChange={(e) => setSubTotalClasses(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                  />
                </div>
              </div>

              {/* CSV Upload & Validation Area */}
              <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-slate-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-teal-500" />
                    Paste or Import CSV Attendance Records
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setCsvContent(
                        'Roll No,Student Name,Date,Status\n22CS104,Sonu Kumar,2026-10-15,PRESENT\n22CS105,Simran Sharma,2026-10-15,PRESENT\n22CS106,Rohit Verma,2026-10-15,LATE\n22CS107,Harpreet Singh,2026-10-15,ABSENT'
                      );
                    }}
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Load Sample CSV Template
                  </button>
                </div>

                <textarea
                  value={csvContent}
                  onChange={(e) => setCsvContent(e.target.value)}
                  placeholder="Paste CSV with columns: Roll No, Student Name, Date, Status..."
                  rows={4}
                  className="w-full p-3 font-mono text-xs rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />

                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    onClick={handleValidateCSV}
                    disabled={!csvContent.trim()}
                    className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-1.5"
                  >
                    Validate CSV Rows
                  </Button>

                  {csvValidationReport && (
                    <div className="text-xs font-semibold flex items-center gap-3">
                      <span className="text-emerald-600 dark:text-emerald-400">
                        Valid: {csvValidationReport.validCount}
                      </span>
                      {csvValidationReport.errorCount > 0 && (
                        <span className="text-rose-600 dark:text-rose-400">
                          Errors: {csvValidationReport.errorCount}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {csvValidationReport && csvValidationReport.errors.length > 0 && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-300 text-xs space-y-1">
                    <span className="font-bold">Validation Errors Detected:</span>
                    <ul className="list-disc pl-4 space-y-0.5">
                      {csvValidationReport.errors.map((err, i) => (
                        <li key={i}>
                          Row {err.row} ({err.rollNo ? `Roll: ${err.rollNo}` : 'Missing Roll'}): {err.error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSubmitAttendanceReport}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 text-xs flex items-center gap-2 shadow"
                >
                  <Send className="w-4 h-4" /> Submit Report for Admin Approval
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Submissions Table */}
          <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
            <CardHeader className="py-4 px-6 border-b border-slate-200 dark:border-white/10">
              <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white">
                Prior Attendance Cycle Submissions ({submissions.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-900 dark:text-white">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-white/10">
                    <tr>
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-4">Cycle</th>
                      <th className="py-3 px-4">Period</th>
                      <th className="py-3 px-4 text-center">Conducted</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-white/10 font-medium">
                    {submissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                          {sub.subject_name} ({sub.section})
                        </td>
                        <td className="py-3 px-4 font-mono">{sub.frequency}</td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{sub.period_name}</td>
                        <td className="py-3 px-4 text-center font-bold">{sub.total_conducted}</td>
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
                        <td className="py-3 px-4 text-right text-slate-400">
                          {new Date(sub.submission_date).toLocaleDateString()}
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

      {/* TAB 3: CORRECTIONS */}
      {activeTab === 'CORRECTIONS' && (
        <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
          <CardHeader className="py-4 px-6 border-b border-slate-200 dark:border-white/10">
            <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Student Attendance Correction Requests
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-900 dark:text-white">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-white/10">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Subject & Date</th>
                    <th className="py-3 px-4">Current → Proposed</th>
                    <th className="py-3 px-4">Reason</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Faculty Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/10 font-medium">
                  {corrections.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{req.student_name}</div>
                        <div className="font-mono text-blue-600 dark:text-blue-400 text-[11px]">{req.roll_no}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold">{req.subject_name}</div>
                        <div className="text-slate-400 text-[11px]">{req.session_date}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="line-through text-rose-500 mr-2">{req.original_status}</span>
                        <span className="font-bold text-emerald-500">{req.proposed_status}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                        {req.reason}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            req.status === 'APPROVED'
                              ? 'bg-emerald-500/20 text-emerald-500'
                              : req.status === 'REJECTED'
                              ? 'bg-rose-500/20 text-rose-500'
                              : 'bg-amber-500/20 text-amber-500'
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        {req.status === 'PENDING' ? (
                          <>
                            <button
                              onClick={() => {
                                campusStore.reviewAttendanceCorrection(
                                  req.id,
                                  'APPROVE',
                                  user?.full_name || 'Dr. Neha Verma',
                                  'Verified by faculty.'
                                );
                                setCorrections(campusStore.getAttendanceCorrections(instId));
                              }}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                campusStore.reviewAttendanceCorrection(
                                  req.id,
                                  'REJECT',
                                  user?.full_name || 'Dr. Neha Verma',
                                  'Insufficient proof.'
                                );
                                setCorrections(campusStore.getAttendanceCorrections(instId));
                              }}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded text-xs"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-slate-400">Resolved</span>
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

      {/* TAB 4: ASSIGNMENTS & GRADING */}
      {activeTab === 'ASSIGNMENTS' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Course Assignments & Evaluations</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Create assignments, track submissions, and evaluate coursework.
              </p>
            </div>
            <Button
              onClick={() => setShowNewAssignmentModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" /> Create New Assignment
            </Button>
          </div>

          {showNewAssignmentModal && (
            <Card className="border border-blue-500/40 bg-white/95 dark:bg-slate-900/90 shadow-xl p-5">
              <form onSubmit={handleCreateAssignment} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">New Course Assignment</h3>
                  <button type="button" onClick={() => setShowNewAssignmentModal(false)}>
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Assignment Title
                    </label>
                    <input
                      type="text"
                      required
                      value={newAssignmentTitle}
                      onChange={(e) => setNewAssignmentTitle(e.target.value)}
                      placeholder="e.g. Lab 4: Multi-Threaded HTTP Server"
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={newAssignmentDueDate}
                      onChange={(e) => setNewAssignmentDueDate(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Maximum Marks
                    </label>
                    <input
                      type="number"
                      value={newAssignmentMaxMarks}
                      onChange={(e) => setNewAssignmentMaxMarks(Number(e.target.value))}
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Subject
                    </label>
                    <select
                      value={selectedSubjectId}
                      onChange={(e) => setSelectedSubjectId(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                    >
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Problem Statement
                  </label>
                  <textarea
                    rows={3}
                    value={newAssignmentDesc}
                    onChange={(e) => setNewAssignmentDesc(e.target.value)}
                    placeholder="Instructions for students..."
                    className="w-full p-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowNewAssignmentModal(false)} className="text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold">
                    Publish Assignment
                  </Button>
                </div>
              </form>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
              <CardHeader className="py-3 px-4 border-b border-slate-200 dark:border-white/10">
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">Active Assignments</CardTitle>
              </CardHeader>
              <CardContent className="p-2 space-y-2">
                {assignments.map((asg) => (
                  <div
                    key={asg.id}
                    onClick={() => setSelectedAssignmentId(asg.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-all border ${
                      selectedAssignmentId === asg.id
                        ? 'bg-blue-500/15 border-blue-500 text-blue-900 dark:text-blue-100'
                        : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-white/10 hover:border-blue-400'
                    }`}
                  >
                    <div className="font-bold text-xs">{asg.title}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      {asg.subject_name} • Max: {asg.max_marks} pts
                    </div>
                    <div className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold mt-1">
                      Due: {asg.due_date}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="lg:col-span-2">
              <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
                <CardHeader className="py-4 px-6 border-b border-slate-200 dark:border-white/10">
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                    Student Submissions & Evaluation Queue
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-900 dark:text-white">
                      <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-white/10">
                        <tr>
                          <th className="py-3 px-4">Student</th>
                          <th className="py-3 px-4">Submission Text</th>
                          <th className="py-3 px-4 text-center">Marks</th>
                          <th className="py-3 px-4">Feedback Remarks</th>
                          <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-white/10 font-medium">
                        {submissionsList.map((sub) => (
                          <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900 dark:text-white">{sub.student_name}</div>
                              <div className="font-mono text-blue-600 dark:text-blue-400 text-[11px]">{sub.student_roll}</div>
                            </td>
                            <td className="py-3 px-4 max-w-xs">
                              <p className="truncate text-slate-600 dark:text-slate-300">{sub.submission_text || 'Submitted coursework'}</p>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <input
                                type="number"
                                defaultValue={sub.marks ?? 85}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  setExamMarksEntry((prev) => ({
                                    ...prev,
                                    [sub.student_id]: {
                                      marks: val,
                                      remarks: prev[sub.student_id]?.remarks || 'Well structured solution.',
                                    },
                                  }));
                                }}
                                className="w-16 h-8 text-center rounded border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-xs font-bold"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <input
                                type="text"
                                defaultValue={sub.feedback || 'Well prepared submission.'}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setExamMarksEntry((prev) => ({
                                    ...prev,
                                    [sub.student_id]: {
                                      marks: prev[sub.student_id]?.marks ?? 85,
                                      remarks: val,
                                    },
                                  }));
                                }}
                                className="w-full h-8 px-2 rounded border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-xs"
                              />
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button
                                onClick={() => handleSaveGrade(sub.id, sub.student_id)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] px-2.5 py-1"
                              >
                                Save Grade
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: STUDY MATERIALS */}
      {activeTab === 'STUDY_MATERIALS' && (
        <div className="space-y-6">
          <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
            <CardHeader className="py-4 px-6 border-b border-slate-200 dark:border-white/10">
              <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-500" />
                Upload Course Notes & Study Material
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleUploadMaterial} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Material Title
                    </label>
                    <input
                      type="text"
                      required
                      value={materialTitle}
                      onChange={(e) => setMaterialTitle(e.target.value)}
                      placeholder="e.g. Unit 3: Graph Theory & Neural Networks"
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Subject
                    </label>
                    <select
                      value={selectedSubjectId}
                      onChange={(e) => setSelectedSubjectId(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                    >
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      File Resource URL
                    </label>
                    <input
                      type="url"
                      value={materialUrl}
                      onChange={(e) => setMaterialUrl(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-2">
                    Publish Course Material
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
            <CardHeader className="py-4 px-6 border-b border-slate-200 dark:border-white/10">
              <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white">
                Course Study Material Repository ({studyMaterials.length} Files)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-900 dark:text-white">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-white/10">
                    <tr>
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-4">Format</th>
                      <th className="py-3 px-4 text-center">Downloads</th>
                      <th className="py-3 px-4 text-right">Resource Link</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-white/10 font-medium">
                    {studyMaterials.map((mat) => (
                      <tr key={mat.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{mat.title}</td>
                        <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{mat.subject_name}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono">
                            {mat.file_type} ({mat.file_size})
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400">
                          {mat.download_count}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <a
                            href={mat.file_url || '#'}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                          >
                            <Download className="w-3.5 h-3.5" /> Download Asset
                          </a>
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

      {/* TAB 6: TIMETABLE */}
      {activeTab === 'TIMETABLE' && (
        <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
          <CardHeader className="py-4 px-6 border-b border-slate-200 dark:border-white/10">
            <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              Weekly Faculty Teaching Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { day: 'Monday', time: '09:00 - 10:30', room: '304', subject: 'Artificial Intelligence & Neural Nets', sec: 'Section A' },
                { day: 'Monday', time: '11:00 - 12:30', room: 'Lab 2', subject: 'AI Hands-on Lab', sec: 'Section B' },
                { day: 'Tuesday', time: '10:00 - 11:30', room: '304', subject: 'Deep Learning Architectures', sec: 'Section A' },
                { day: 'Wednesday', time: '09:00 - 10:30', room: '304', subject: 'Artificial Intelligence & Neural Nets', sec: 'Section A' },
                { day: 'Thursday', time: '14:00 - 15:30', room: 'Lab 3', subject: 'GPU Accelerated Computing', sec: 'Section A' },
                { day: 'Friday', time: '10:00 - 11:30', room: 'Auditorium B', subject: 'Seminar & Capstone Guidance', sec: 'All Sections' },
              ].map((slot, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/60 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400">
                      {slot.day}
                    </span>
                    <span className="font-mono text-xs text-slate-500 dark:text-slate-400 font-semibold">{slot.time}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{slot.subject}</h4>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span>Room: {slot.room}</span>
                    <span className="font-semibold text-teal-600 dark:text-teal-400">{slot.sec}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 7: EXAM MARKS ENTRY */}
      {activeTab === 'EXAM_MARKS' && (
        <div className="space-y-6">
          <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
            <CardHeader className="py-4 px-6 border-b border-slate-200 dark:border-white/10">
              <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Mid-Term & End-Semester Marks Entry
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Select Examination
                  </label>
                  <select
                    value={selectedExamId}
                    onChange={(e) => setSelectedExamId(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                  >
                    {examinations.map((ex) => (
                      <option key={ex.id} value={ex.id}>
                        {ex.name} ({ex.subject_name} - Max: {ex.max_marks})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Status of Results
                  </label>
                  <div className="h-10 px-3 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800 flex items-center">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      Gated (Admin Approval Required to Publish)
                    </span>
                  </div>
                </div>

                <div className="flex items-end">
                  <Button
                    onClick={handleSaveExamMarks}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-10 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Save & Record Marks
                  </Button>
                </div>
              </div>

              {/* Marks Roster Table */}
              <div className="overflow-x-auto border border-slate-200 dark:border-white/10 rounded-xl mt-4">
                <table className="w-full text-left text-xs text-slate-900 dark:text-white">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-white/10">
                    <tr>
                      <th className="py-3 px-4">Roll Number</th>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4 text-center">Marks Obtained</th>
                      <th className="py-3 px-4">Faculty Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-white/10 font-medium">
                    {roster.map((stu) => {
                      const entry = examMarksEntry[stu.id] || { marks: 85, remarks: 'Satisfactory' };
                      return (
                        <tr key={stu.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                            {stu.roll}
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{stu.name}</td>
                          <td className="py-3 px-4 text-center">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={entry.marks}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setExamMarksEntry((prev) => ({
                                  ...prev,
                                  [stu.id]: { marks: val, remarks: prev[stu.id]?.remarks || '' },
                                }));
                              }}
                              className="w-20 h-8 text-center rounded border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-xs font-bold"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              value={entry.remarks}
                              onChange={(e) => {
                                const val = e.target.value;
                                setExamMarksEntry((prev) => ({
                                  ...prev,
                                  [stu.id]: { marks: prev[stu.id]?.marks ?? 85, remarks: val },
                                }));
                              }}
                              placeholder="e.g. Good derivation of equations"
                              className="w-full h-8 px-2 rounded border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-xs"
                            />
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
    </div>
  );
};
