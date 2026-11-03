import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { campusStore } from '../../lib/store';
import { Complaint, MessMenu, Announcement } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import { CollegeBackground } from '../../components/common/CollegeBackground';
import {
  PlusCircle,
  AlertCircle,
  CalendarCheck,
  BookOpen,
  Clock,
  ArrowRight,
  Sparkles,
  UtensilsCrossed,
  CheckCircle2,
  ChevronRight,
  Bell,
  Award,
  FileText,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user, institution } = useAuth();
  const studentRoll = '2440404';
  const instId = institution?.id || 'demo-inst-001';

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [messMenus, setMessMenus] = useState<MessMenu[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [attendanceStats, setAttendanceStats] = useState(() =>
    campusStore.calculateStudentAttendance(studentRoll, instId)
  );

  useEffect(() => {
    const update = () => {
      setComplaints(
        campusStore
          .getComplaints()
          .filter((c) => c.student_name === user?.full_name || c.student_id === 'stu-101')
      );
      setMessMenus(campusStore.getMessMenus());
      setAnnouncements(campusStore.getAnnouncements(instId));
      setAttendanceStats(campusStore.calculateStudentAttendance(studentRoll, instId));
    };
    update();
    return campusStore.subscribe(update);
  }, [user, instId]);

  const activeComplaints = complaints.filter((c) => c.status !== 'RESOLVED' && c.status !== 'CANCELLED');
  const resolvedCount = complaints.filter((c) => c.status === 'RESOLVED').length;

  return (
    <div className="space-y-6 text-slate-900 dark:text-white">
      {/* Top Welcome Card with Cinematic College Background */}
      <CollegeBackground
        variant="hero"
        overlayOpacity="medium"
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" /> Student Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
            Welcome back, {user?.full_name || 'Sonu Kumar'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-200">
            Bachelor of Computer Applications (BCA) • Roll:{' '}
            <span className="font-mono font-semibold text-teal-300">{studentRoll}</span> • C-Block (Room H-1 79)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/app/student/attendance">
            <Button size="md" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5">
              <CalendarCheck className="w-4 h-4" /> View Attendance
            </Button>
          </Link>
          <Link to="/app/student/new-complaint">
            <Button size="md" variant="teal" leftIcon={<PlusCircle className="w-4 h-4" />}>
              Report Campus Issue
            </Button>
          </Link>
        </div>
      </CollegeBackground>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/app/student/attendance" className="block">
          <Card className="hover:border-blue-500/40 transition-colors border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
            <CardContent className="p-4 sm:p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">ERP Attendance</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {attendanceStats.overallPercentage !== null ? `${attendanceStats.overallPercentage}%` : 'Not Started'}
                </h3>
                <span
                  className={`text-[10px] font-bold ${
                    attendanceStats.overallPercentage !== null && attendanceStats.overallPercentage < 75
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-teal-600 dark:text-teal-400'
                  }`}
                >
                  {attendanceStats.overallPercentage !== null && attendanceStats.overallPercentage < 75
                    ? '⚠️ Below 75% Cutoff'
                    : 'Above 75% Requirement'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <CalendarCheck className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/app/student/complaints" className="block">
          <Card className="hover:border-amber-500/40 transition-colors border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
            <CardContent className="p-4 sm:p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Grievances</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{activeComplaints.length}</h3>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                  {resolvedCount} resolved historically
                </span>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600">
                <AlertCircle className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/app/student/academics" className="block">
          <Card className="hover:border-blue-500/40 transition-colors border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
            <CardContent className="p-4 sm:p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Cumulative SGPA</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">9.12 / 10</h3>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                  Dean's Merit Scholar
                </span>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600">
                <Award className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/app/student/timetable" className="block">
          <Card className="hover:border-slate-400 transition-colors border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
            <CardContent className="p-4 sm:p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Today's Lectures</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">4 Classes</h3>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                  Next: Room 304 (AI & Nets)
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <Clock className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Main Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My Active Grievances & Announcements */}
        <div className="lg:col-span-2 space-y-6">
          {/* Official Notices Peek */}
          <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
            <CardHeader className="py-4 px-6 border-b border-slate-200 dark:border-white/10 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-500" />
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                  University ERP Broadcast Notices
                </CardTitle>
              </div>
              <span className="text-xs text-slate-400">{announcements.length} Published</span>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-200 dark:divide-white/10">
                {announcements.slice(0, 2).map((ann) => (
                  <div key={ann.id} className="p-4 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/15 text-blue-600 dark:text-blue-400">
                        {ann.audience || 'ALL'}
                      </span>
                      {ann.priority === 'URGENT' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400">
                          URGENT
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400">
                        {new Date(ann.published_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{ann.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{ann.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Grievances Tracker */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">My Campus Grievances</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Track real-time progress and technician assignments</p>
              </div>
              <Link to="/app/student/complaints">
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  View All ({complaints.length})
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {complaints.length === 0 ? (
                <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
                  <CardContent className="p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
                    No grievances reported yet. Everything in order!
                  </CardContent>
                </Card>
              ) : (
                complaints.slice(0, 3).map((cmp) => (
                  <Card key={cmp.id} className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md hover:shadow-lg transition-all">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                            {cmp.reference_no}
                          </span>
                          <StatusBadge status={cmp.status} />
                          <PriorityBadge priority={cmp.official_priority} />
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {new Date(cmp.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{cmp.title}</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{cmp.description}</p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-white/10 text-xs text-slate-500 dark:text-slate-400">
                        <span>
                          📍 {cmp.building} {cmp.room_number ? `• Room ${cmp.room_number}` : ''}
                        </span>
                        {cmp.assigned_staff_name && (
                          <span className="font-medium text-teal-600 dark:text-teal-400">
                            Assigned: {cmp.assigned_staff_name}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Dining Peek & Attendance Safeguard */}
        <div className="space-y-6">
          <Card className="border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-slate-900/90 shadow-md">
            <CardHeader className="py-4 px-6 border-b border-slate-200 dark:border-white/10 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-blue-500" />
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">Today's Dining Menu</CardTitle>
              </div>
              <Link to="/app/student/mess" className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Feedback
              </Link>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              {messMenus.slice(0, 2).map((m) => (
                <div key={m.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 space-y-1">
                  <span className="font-bold text-[10px] uppercase tracking-wider text-teal-600 dark:text-teal-400">
                    {m.meal_type}
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-snug">{m.menu_items}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Statutory Safeguard Card */}
          <div className="p-5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-teal-800 dark:text-teal-200">
              <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
              <span>Statutory University Cutoff Policy</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
              Minimum attendance required for semester exam eligibility is <strong>75.0%</strong>. Students with duty leaves or medical certificates must submit correction requests within 7 working days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
