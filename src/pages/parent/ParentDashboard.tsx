import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { campusStore } from '../../lib/store';
import { ParentStudentLink, AttendanceRecord, AcademicRecord, Announcement } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Link } from 'react-router-dom';
import { CollegeBackground } from '../../components/common/CollegeBackground';
import {
  Users,
  CalendarCheck,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Mail,
  PlusCircle,
  FileText,
  ShieldCheck,
} from 'lucide-react';

export const ParentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [links, setLinks] = useState<ParentStudentLink[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [academics, setAcademics] = useState<AcademicRecord[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const update = () => {
      if (user) {
        setLinks(campusStore.getParentLinks(user.id));
      }
      setAttendance(campusStore.getAttendance());
      setAcademics(campusStore.getAcademics());
    };
    update();
    return campusStore.subscribe(update);
  }, [user]);

  const activeLink = links[0]; // Primary linked student

  return (
    <div className="space-y-6">
      {/* Header Banner with Cinematic College Background */}
      <CollegeBackground
        variant="hero"
        overlayOpacity="medium"
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-xs font-semibold backdrop-blur-xs">
            <Users className="w-3.5 h-3.5" /> Verified Parent Guardian Portal
          </div>
          <h1 className="text-2xl font-extrabold mt-1 text-white drop-shadow-sm">
            Guardian Academic Console
          </h1>
          <p className="text-xs text-slate-200">
            Welcome, <span className="font-semibold text-white">{user?.full_name}</span> • Institution-verified relationship
          </p>
        </div>

        <Link to="/app/parent/link-student">
          <Button variant="teal" size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
            Link Additional Ward
          </Button>
        </Link>
      </CollegeBackground>

      {links.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center space-y-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">No Verified Student Linked</h3>
              <p className="text-xs text-muted mt-1 max-w-sm mx-auto">
                To access attendance and examination scores, submit a link request with your student's official enrollment number and university-provided verification PIN.
              </p>
            </div>
            <Link to="/app/parent/link-student">
              <Button variant="primary">Submit Student Link Request</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Linked Student Profile Card */}
          <Card className="border-l-4 border-l-teal-brand shadow-soft">
            <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-base flex items-center justify-center ring-2 ring-primary/20">
                  {activeLink.student.full_name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-foreground">{activeLink.student.full_name}</h2>
                    <Badge variant="success" className="text-[10px]">Verified {activeLink.relationship_type}</Badge>
                  </div>
                  <p className="text-xs text-muted mt-0.5">
                    {activeLink.student.course_name} • Semester {activeLink.student.current_semester} • Roll: <span className="font-mono font-semibold">{activeLink.student.roll_no}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="text-[10px] text-muted block uppercase tracking-wider font-semibold">Overall Attendance</span>
                  <span className="text-xl font-black text-teal-brand font-mono">
                    {activeLink.student.overall_attendance}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metric Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted font-medium">Verified Attendance</p>
                  <h3 className="text-2xl font-bold text-teal-brand mt-1">84.6%</h3>
                  <span className="text-[10px] text-teal-800 font-semibold">Exceeds 75% norm</span>
                </div>
                <div className="p-3 rounded-xl bg-teal-50 text-teal-brand">
                  <CalendarCheck className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted font-medium">Mid-Semester GPA</p>
                  <h3 className="text-2xl font-bold text-foreground mt-1">9.12 / 10</h3>
                  <span className="text-[10px] text-primary font-semibold">Top 5% in CSE Dept</span>
                </div>
                <div className="p-3 rounded-xl bg-primary/5 text-primary">
                  <BookOpen className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted font-medium">Hostel Room</p>
                  <h3 className="text-xl font-bold text-foreground mt-1">Block A-204</h3>
                  <span className="text-[10px] text-muted font-semibold">Kalpana Chawla Hostel</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-100 text-slate-700">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Academic Records & Feedback */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Recent Examination Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4">
                {academics.slice(0, 3).map((a) => (
                  <div key={a.id} className="p-3 rounded-xl bg-[var(--nested-surface)] border border-[var(--card-border)] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-foreground">{a.subject_name}</span>
                      <span className="font-mono font-bold text-xs text-teal-brand">
                        {a.marks_obtained} / {a.max_marks} ({a.percentage}%)
                      </span>
                    </div>
                    <p className="text-[11px] text-muted italic">"{a.feedback}"</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Attendance breakdown by subject */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Subject Attendance Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">AI & Neural Networks</span>
                    <span className="font-bold text-teal-brand font-mono">88.9%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-teal-brand h-2 rounded-full" style={{ width: '88.9%' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">Distributed Cloud Systems</span>
                    <span className="font-bold text-teal-brand font-mono">91.7%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-teal-brand h-2 rounded-full" style={{ width: '91.7%' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">Design & Analysis of Algorithms</span>
                    <span className="font-bold text-danger font-mono">68.8% (Warning)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-danger h-2 rounded-full" style={{ width: '68.8%' }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

