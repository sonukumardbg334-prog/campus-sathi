import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Users,
  Hotel,
  Wrench,
  UtensilsCrossed,
  CalendarCheck,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

export const FeaturesPage: React.FC = () => {
  const featureList = [
    {
      title: 'Complaint & Grievance Lifecycle',
      icon: AlertCircle,
      items: [
        'Photo evidence upload with mobile camera integration and image preview',
        'Automatic smart category & priority classifier (Fan, Electrical, Wi-Fi, Water, Mess)',
        'Duplicate grievance detection engine based on location & category',
        'Transparent status progression: Submitted → Under Review → Assigned → In Progress → Awaiting Verification → Resolved',
        'Tamper-proof audit history recording every status change and note',
      ],
    },
    {
      title: 'Hostel Warden Operational Console',
      icon: Hotel,
      items: [
        'Live queue of pending hostel grievances with urgency indicators',
        'Technician assignment workflow with custom repair instructions',
        'Side-by-side photographic comparison of problem vs. resolution proof',
        'Reopening capability if repair does not meet quality standards',
        'Block and room occupancy tracking with maintenance history',
      ],
    },
    {
      title: 'Parent / Guardian Portal & Verified Linking',
      icon: Users,
      items: [
        'Secure student enrollment number and secret PIN verification workflow',
        'Two-factor administrative relationship approval before data access',
        'Daily and subject-wise attendance percentages with automated low-attendance warnings',
        'Mid-term examination grades, assignment submissions, and progress indicators',
        'Zero enumeration risk: strictly prevents guessing or scraping unauthorized students',
      ],
    },
    {
      title: 'Faculty Attendance & Academic Tracking',
      icon: CalendarCheck,
      items: [
        'Fast 1-click batch attendance marking (Present, Absent, Late, Excused)',
        'Duplicate attendance prevention for same subject session and date',
        'Formula calculated percentage: (Present sessions / Total sessions) * 100',
        'Academic assessment entry with maximum marks, weightage, and teacher feedback',
        'Class-wide timetable scheduling and announcement broadcasting',
      ],
    },
    {
      title: 'Mess & Dining Hall Management',
      icon: UtensilsCrossed,
      items: [
        '4-meal daily menu scheduling (Breakfast, Lunch, Evening Snacks, Dinner)',
        'Student meal satisfaction ratings and anonymous feedback reporting',
        'Category breakdown for food taste, temperature, hygiene, or shortage',
        'Mess manager resolution notes and menu dietary adjustments',
      ],
    },
    {
      title: 'Multi-Tenant Security & Governance',
      icon: ShieldCheck,
      items: [
        'Multi-tenant institutional isolation ensuring college records remain private',
        'Platform Super Administrator dashboard to approve/reject college applications',
        'Comprehensive security audit logging for privileged administrative operations',
        'Private storage buckets for sensitive student and resolution evidence',
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 text-[var(--page-foreground)]">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">Comprehensive Platform Modules</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--page-foreground)] tracking-tight">
          Engineered for Enterprise Campus Operations
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
          Explore the modular capabilities powering CampusSaathi for administrators, faculty, wardens, students, and parents.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featureList.map((f) => {
          const Icon = f.icon;
          return (
            <Card key={f.title} className="bg-[var(--card-background)] backdrop-blur-xl border border-[var(--card-border)] text-[var(--card-foreground)] shadow-xl hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(34,211,238,0.15)] transition-all group">
              <CardHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-[var(--card-border)]">
                <div className="p-2.5 rounded-xl bg-blue-500/15 dark:bg-blue-500/20 border border-blue-400/30 text-blue-600 dark:text-cyan-400 group-hover:scale-105 transition-transform shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
                <CardTitle className="text-base text-[var(--card-foreground)] font-bold">{f.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2.5">
                  {f.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[var(--muted-foreground)] leading-relaxed">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
