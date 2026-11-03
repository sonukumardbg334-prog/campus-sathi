import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { campusStore } from '../../lib/store';
import { AttendanceRecord, AttendanceCorrectionRequest, AttendanceStatus } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CollegeBackground } from '../../components/common/CollegeBackground';
import {
  CalendarCheck,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Info,
  Clock,
  HelpCircle,
  FileCheck,
  Send,
  Plus,
  X,
  ShieldAlert,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const StudentAttendancePage: React.FC = () => {
  const { user, institution } = useAuth();
  const studentRoll = '2440404';
  const instId = institution?.id || 'demo-inst-001';

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [corrections, setCorrections] = useState<AttendanceCorrectionRequest[]>([]);
  const [attendanceStats, setAttendanceStats] = useState(() =>
    campusStore.calculateStudentAttendance(studentRoll, instId)
  );

  // Correction Request Modal
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionDate, setCorrectionDate] = useState('2026-10-24');
  const [correctionSubject, setCorrectionSubject] = useState('Artificial Intelligence & Neural Nets');
  const [correctionOriginalStatus, setCorrectionOriginalStatus] = useState<AttendanceStatus>('ABSENT');
  const [correctionProposedStatus, setCorrectionProposedStatus] = useState<AttendanceStatus>('EXCUSED');
  const [correctionReason, setCorrectionReason] = useState('');
  const [requestSubmittedMessage, setRequestSubmittedMessage] = useState<string | null>(null);

  const refreshAttendance = () => {
    setRecords(campusStore.getAttendance().filter((a) => a.roll_no === studentRoll));
    setCorrections(
      campusStore.getAttendanceCorrections(instId).filter((c) => c.roll_no === studentRoll)
    );
    setAttendanceStats(campusStore.calculateStudentAttendance(studentRoll, instId));
  };

  useEffect(() => {
    refreshAttendance();
    return campusStore.subscribe(refreshAttendance);
  }, [studentRoll, instId]);

  const handleRequestCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionReason.trim()) return;

    campusStore.requestAttendanceCorrection({
      institution_id: instId,
      attendance_record_id: `rec-${Date.now()}`,
      student_id: user?.id || 'stu-101',
      student_name: user?.full_name || 'Sonu Kumar',
      roll_no: studentRoll,
      session_date: correctionDate,
      subject_name: correctionSubject,
      original_status: correctionOriginalStatus,
      proposed_status: correctionProposedStatus,
      reason: correctionReason,
      requested_by_name: user?.full_name || 'Sonu Kumar',
      requested_by_role: 'student',
    });

    confetti({ particleCount: 30, spread: 50 });
    setRequestSubmittedMessage('Correction request submitted to faculty and college admin for review.');
    setCorrectionReason('');
    setShowCorrectionModal(false);
    setTimeout(() => setRequestSubmittedMessage(null), 4000);
  };

  const isEligible = attendanceStats.overallPercentage !== null && attendanceStats.overallPercentage >= 75.0;

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-white p-4 sm:p-6 space-y-6">
      <CollegeBackground variant="subtle-dash" overlayOpacity="deep-navy" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Official University ERP • Statutory Record
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Attendance Tracker
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time synchronized attendance percentage. Minimum statutory university requirement is 75.0%.
          </p>
        </div>

        <Button
          onClick={() => setShowCorrectionModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" /> Request Attendance Correction
        </Button>
      </div>

      {/* Success Notification */}
      {requestSubmittedMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-800 dark:text-emerald-200 flex items-center justify-between text-xs font-bold animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{requestSubmittedMessage}</span>
          </div>
          <button onClick={() => setRequestSubmittedMessage(null)} className="underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card
          className={
            isEligible
              ? 'bg-gradient-to-br from-blue-700 to-blue-900 text-white shadow-lg border-blue-600'
              : 'bg-gradient-to-br from-rose-700 to-rose-900 text-white shadow-lg border-rose-600'
          }
        >
          <CardContent className="p-5">
            <span className="text-xs text-slate-200 font-medium">Cumulative ERP Attendance</span>
            <div className="text-3xl font-black mt-1">
              {attendanceStats.overallPercentage !== null ? `${attendanceStats.overallPercentage}%` : 'Not Started'}
            </div>
            <div className="text-xs text-teal-200 mt-1 font-semibold flex items-center gap-1">
              {isEligible ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Eligible for End-Semester Exams
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-300" /> Critical Shortage: Below 75% Cutoff
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
          <CardContent className="p-5">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Sessions Held</span>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
              {attendanceStats.conductedSessions}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {attendanceStats.attendedSessions} Present • {attendanceStats.absentSessions} Absent • {attendanceStats.lateSessions} Late
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
          <CardContent className="p-5">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Statutory Cutoff Threshold</span>
            <div className="text-3xl font-black text-amber-500 mt-1">75.0%</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Automated parent notification trigger
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Correction Modal */}
      {showCorrectionModal && (
        <Card className="border border-blue-500/40 bg-white/95 dark:bg-slate-900/90 shadow-xl p-5">
          <form onSubmit={handleRequestCorrection} className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Submit Attendance Correction Request
              </h3>
              <button type="button" onClick={() => setShowCorrectionModal(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Session Date
                </label>
                <input
                  type="date"
                  required
                  value={correctionDate}
                  onChange={(e) => setCorrectionDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subject
                </label>
                <select
                  value={correctionSubject}
                  onChange={(e) => setCorrectionSubject(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                >
                  <option value="Artificial Intelligence & Neural Nets">Artificial Intelligence & Neural Nets</option>
                  <option value="Distributed Cloud Systems">Distributed Cloud Systems</option>
                  <option value="Cybersecurity & Cryptography">Cybersecurity & Cryptography</option>
                  <option value="Design & Analysis of Algorithms">Design & Analysis of Algorithms</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Recorded Status
                </label>
                <select
                  value={correctionOriginalStatus}
                  onChange={(e) => setCorrectionOriginalStatus(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                >
                  <option value="ABSENT">ABSENT</option>
                  <option value="LATE">LATE</option>
                  <option value="PRESENT">PRESENT</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Proposed Status
                </label>
                <select
                  value={correctionProposedStatus}
                  onChange={(e) => setCorrectionProposedStatus(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                >
                  <option value="EXCUSED">EXCUSED (Duty / Medical Leave)</option>
                  <option value="PRESENT">PRESENT</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Reason & Evidence Description
              </label>
              <textarea
                required
                rows={2}
                value={correctionReason}
                onChange={(e) => setCorrectionReason(e.target.value)}
                placeholder="Detail reason for absence (e.g. Represented college in Technical Fest Hackathon, approved by Dean)..."
                className="w-full p-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowCorrectionModal(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold">
                Submit Request
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Subject-Wise Attendance Breakdown */}
      <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
        <CardHeader className="py-4 px-6 border-b border-slate-200 dark:border-white/10">
          <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white">
            Subject-Wise Statutory Attendance Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-900 dark:text-white">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-white/10">
                <tr>
                  <th className="py-3 px-4">Subject Name</th>
                  <th className="py-3 px-4 text-center">Attended / Conducted</th>
                  <th className="py-3 px-4 text-center">Percentage</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/10 font-medium">
                {attendanceStats.subjectWise.map((item, idx) => {
                  const subjectPct = item.percentage;
                  const isSafe = item.status === 'ELIGIBLE' || item.status === 'NOT_STARTED';
                  return (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {item.subjectName}
                      </td>
                      <td className="py-3 px-4 text-center font-semibold">
                        {item.attended} / {item.conducted}
                      </td>
                      <td className="py-3 px-4 text-center font-bold">
                        {subjectPct !== null ? `${subjectPct}%` : 'Not Started'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            isSafe
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {item.status}
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

      {/* Daily Attendance Log */}
      <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
        <CardHeader className="py-4 px-6 border-b border-slate-200 dark:border-white/10">
          <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white">
            Daily Attendance Session Logs ({records.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-900 dark:text-white">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-white/10">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Term & Section</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/10 font-medium">
                {records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {rec.session_date}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {rec.subject_name}
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                      Sem {rec.semester} • {rec.section}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          rec.status === 'PRESENT'
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            : rec.status === 'LATE'
                            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                            : rec.status === 'ABSENT'
                            ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                            : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Prior Correction Requests Status */}
      {corrections.length > 0 && (
        <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
          <CardHeader className="py-4 px-6 border-b border-slate-200 dark:border-white/10">
            <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white">
              My Attendance Correction Requests ({corrections.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-900 dark:text-white">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-white/10">
                  <tr>
                    <th className="py-3 px-4">Subject & Date</th>
                    <th className="py-3 px-4">Status Adjustment</th>
                    <th className="py-3 px-4">Reason</th>
                    <th className="py-3 px-4 text-center">Approval Status</th>
                    <th className="py-3 px-4">Faculty / Admin Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/10 font-medium">
                  {corrections.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4">
                        <div className="font-bold">{req.subject_name}</div>
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
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            req.status === 'APPROVED'
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                              : req.status === 'REJECTED'
                              ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                              : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                        {req.review_notes || 'Pending faculty review'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
