import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { campusStore } from '../../lib/store';
import {
  Examination,
  ExamResult,
  Assignment,
  AssignmentSubmission,
  StudyMaterial,
  AcademicCalendarEvent,
} from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CollegeBackground } from '../../components/common/CollegeBackground';
import {
  BookOpen,
  Award,
  CheckCircle2,
  FileText,
  Download,
  Calendar,
  Clock,
  Send,
  Upload,
  AlertCircle,
  ExternalLink,
  Lock,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const StudentAcademicsPage: React.FC = () => {
  const { user, institution } = useAuth();
  const instId = institution?.id || 'demo-inst-001';
  const studentRoll = '2440404';

  const [activeTab, setActiveTab] = useState<'EXAMS' | 'ASSIGNMENTS' | 'STUDY_MATERIALS' | 'CALENDAR'>('EXAMS');

  // Examinations & Published Results
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [results, setResults] = useState<{ [examId: string]: ExamResult[] }>({});

  // Assignments & Submissions
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAsgForSubmit, setSelectedAsgForSubmit] = useState<Assignment | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submitSuccessMessage, setSubmitSuccessMessage] = useState<string | null>(null);

  // Study Materials
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);

  // Calendar Events
  const [events, setEvents] = useState<AcademicCalendarEvent[]>([]);

  const refreshAll = () => {
    const examList = campusStore.getExaminations(instId);
    setExaminations(examList);

    const resMap: { [examId: string]: ExamResult[] } = {};
    examList.forEach((ex) => {
      resMap[ex.id] = campusStore.getExamResults(instId, ex.id, studentRoll, true);
    });
    setResults(resMap);

    setAssignments(campusStore.getAssignments(instId));
    setMaterials(campusStore.getStudyMaterials(instId));
    setEvents(campusStore.getCalendarEvents(instId));
  };

  useEffect(() => {
    refreshAll();
    return campusStore.subscribe(refreshAll);
  }, [instId, studentRoll]);

  const handleSubmitAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsgForSubmit || !submissionText.trim()) return;

    campusStore.submitAssignment({
      assignment_id: selectedAsgForSubmit.id,
      institution_id: instId,
      student_id: user?.id || 'stu-101',
      student_name: user?.full_name || 'Sonu Kumar',
      student_roll: studentRoll,
      submission_text: submissionText,
    });

    confetti({ particleCount: 35, spread: 60 });
    setSubmitSuccessMessage(`Assignment "${selectedAsgForSubmit.title}" submitted successfully for grading!`);
    setSelectedAsgForSubmit(null);
    setSubmissionText('');
    setTimeout(() => setSubmitSuccessMessage(null), 4000);
  };

  const handleDownloadMaterial = (materialId: string, url?: string) => {
    campusStore.incrementDownloadCount(materialId);
    if (url) window.open(url, '_blank');
  };

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-white p-4 sm:p-6 space-y-6">
      <CollegeBackground variant="subtle-dash" overlayOpacity="deep-navy" />

      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
          Curriculum, Assessments & Courseware
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Academic Center
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Published examination scores, coursework submissions, faculty lecture notes, and university academic calendar.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-700 to-blue-900 text-white shadow-lg border-blue-600">
          <CardContent className="p-5">
            <span className="text-xs text-slate-200 font-medium">Cumulative SGPA</span>
            <div className="text-3xl font-black mt-1">9.12 / 10.0</div>
            <div className="text-xs text-teal-300 mt-1 font-semibold flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Dean's Merit Scholar
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
          <CardContent className="p-5">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Degree Credits Earned</span>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">118 / 160</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Semester 6 in progress</div>
          </CardContent>
        </Card>

        <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
          <CardContent className="p-5">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Coursework</span>
            <div className="text-3xl font-black text-amber-500 mt-1">{assignments.length}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Assignments due this term</div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-4">
        {[
          { id: 'EXAMS', label: 'Examinations & Marks', icon: Award },
          { id: 'ASSIGNMENTS', label: `Assignments (${assignments.length})`, icon: BookOpen },
          { id: 'STUDY_MATERIALS', label: `Course Notes & Slides (${materials.length})`, icon: FileText },
          { id: 'CALENDAR', label: 'Academic Calendar', icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-white/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Notification */}
      {submitSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-800 dark:text-emerald-200 flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{submitSuccessMessage}</span>
          </div>
          <button onClick={() => setSubmitSuccessMessage(null)} className="underline">
            Dismiss
          </button>
        </div>
      )}

      {/* TAB 1: EXAMINATIONS & PUBLISHED RESULTS */}
      {activeTab === 'EXAMS' && (
        <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
          <CardHeader className="py-4 px-6 border-b border-slate-200 dark:border-white/10">
            <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white">
              Official Assessment Results
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Results are strictly gated by college administration until verified by the examination board.
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-900 dark:text-white">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-white/10">
                  <tr>
                    <th className="py-3 px-4">Examination</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4 text-center">Exam Date</th>
                    <th className="py-3 px-4 text-center">Score Obtained</th>
                    <th className="py-3 px-4">Faculty Remarks</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/10 font-medium">
                  {examinations.map((ex) => {
                    const studentRes = results[ex.id]?.[0];
                    const isPub = ex.status === 'RESULTS_PUBLISHED';
                    return (
                      <tr key={ex.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{ex.name}</td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{ex.subject_name}</td>
                        <td className="py-3 px-4 text-center font-mono text-slate-500 dark:text-slate-400">
                          {ex.exam_date}
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold">
                          {isPub && studentRes ? (
                            <span className="text-blue-600 dark:text-blue-400">
                              {studentRes.marks_obtained} / {ex.max_marks} ({studentRes.grade})
                            </span>
                          ) : (
                            <span className="text-slate-400 flex items-center justify-center gap-1">
                              <Lock className="w-3 h-3" /> Gated / Pending
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                          {isPub && studentRes ? studentRes.remarks || 'Satisfactory' : '—'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isPub
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {isPub ? 'Published' : 'Evaluation Ongoing'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 2: ASSIGNMENTS & SUBMISSION */}
      {activeTab === 'ASSIGNMENTS' && (
        <div className="space-y-6">
          {selectedAsgForSubmit && (
            <Card className="border border-blue-500/40 bg-white/95 dark:bg-slate-900/90 shadow-xl p-5">
              <form onSubmit={handleSubmitAssignment} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      Submit Coursework: {selectedAsgForSubmit.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Subject: {selectedAsgForSubmit.subject_name} • Due: {selectedAsgForSubmit.due_date}
                    </p>
                  </div>
                  <button type="button" onClick={() => setSelectedAsgForSubmit(null)}>
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Submission Text / Code Repository URL / Report Summary
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    placeholder="Provide your solution writeup, explanation, or GitHub repository link..."
                    className="w-full p-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setSelectedAsgForSubmit(null)} className="text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold">
                    Submit Solution
                  </Button>
                </div>
              </form>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.map((asg) => (
              <Card key={asg.id} className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400">
                      {asg.subject_name}
                    </span>
                    <span className="font-mono text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Due: {asg.due_date}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{asg.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {asg.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-white/10">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      Max: {asg.max_marks} marks
                    </span>
                    <Button
                      onClick={() => setSelectedAsgForSubmit(asg)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5"
                    >
                      Turn In Assignment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: STUDY MATERIALS */}
      {activeTab === 'STUDY_MATERIALS' && (
        <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
          <CardHeader className="py-4 px-6 border-b border-slate-200 dark:border-white/10">
            <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white">
              Courseware & Lecture Slides
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-900 dark:text-white">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-white/10">
                  <tr>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Subject & Faculty</th>
                    <th className="py-3 px-4">File Type</th>
                    <th className="py-3 px-4 text-center">Downloads</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/10 font-medium">
                  {materials.map((mat) => (
                    <tr key={mat.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{mat.title}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold">{mat.subject_name}</div>
                        <div className="text-slate-400 text-[11px]">{mat.uploaded_by_name}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-bold">
                          {mat.file_type} ({mat.file_size})
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400">
                        {mat.download_count}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDownloadMaterial(mat.id, mat.file_url)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                        >
                          <Download className="w-3.5 h-3.5" /> Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 4: CALENDAR */}
      {activeTab === 'CALENDAR' && (
        <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
          <CardHeader className="py-4 px-6 border-b border-slate-200 dark:border-white/10">
            <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              University Academic Schedule & Important Milestones
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((ev) => (
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
    </div>
  );
};
