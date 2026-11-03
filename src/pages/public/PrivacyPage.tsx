import React, { useEffect } from 'react';
import { Shield, Lock, FileText, CheckCircle2, UserCheck, AlertCircle, Phone, MessageSquare, Database, EyeOff } from 'lucide-react';
import { analytics } from '../../lib/analytics';

export const PrivacyPage: React.FC = () => {
  useEffect(() => {
    analytics.pageView('Privacy Policy');
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            Legal & Compliance
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            CampusSaathi Privacy Policy
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Last Updated: October 30, 2026 • Compliant with the Digital Personal Data Protection Act (DPDP), 2023
          </p>
        </div>

        {/* Card Content */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-10 space-y-10 leading-relaxed text-sm sm:text-base">
          
          {/* Executive Summary */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              1. Commitment to Student & Institutional Privacy
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              CampusSaathi ("Platform", "we", "us", "our") serves higher-education institutions, universities, faculty, students, and campus administrators across India. We strictly respect the privacy of every individual whose personal or academic data is processed through our multi-tenant platform. We never sell, rent, or trade student, faculty, or institutional data to advertising networks, brokers, or unrelated third parties.
            </p>
          </section>

          {/* Data Collected */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
              <UserCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              2. Information We Collect
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Depending on your role (Student, Faculty/Teacher, College Administrator, or Platform Super Admin), CampusSaathi processes the following categories of information:
            </p>
            <div className="grid gap-3 sm:grid-cols-2 pt-1">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Account & Profile Information</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Full name, institutional email address, mobile number, role, enrolled program, semester, section, and institutional registration/roll numbers provided during campus onboarding.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Academic & Evaluation Records</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Daily attendance logs (Present, Absent, Late), 15-day and monthly aggregated attendance figures, assignment submissions, internal grades, and examination records entered by authorized teachers.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Campus Operations & Content</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Study materials, lecture syllabi, notices, circulars, classroom timetables, hostel/mess feedback, and campus support requests.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Diagnostic & Security Logs</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  IP addresses, browser type, operating system version, audit log timestamps for critical actions (attendance lock, marks entry), and session verification tokens.
                </p>
              </div>
            </div>
          </section>

          {/* Security & Multi-Tenancy Architecture */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
              <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              3. Multi-Tenant Isolation & Row-Level Security
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 pt-1">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Row Level Security (RLS)</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Every database table containing institutional data enforces PostgreSQL RLS policies tied to the authenticated user's institution membership. College A can never read or modify records belonging to College B.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Private Storage & Signed URLs</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Sensitive documents, assignments, and resolution proofs are stored in private storage buckets. Direct public URL access is blocked; access requires authenticated short-lived signed URLs.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Parent-Student Verification</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Connection requires official student enrollment numbers and offline administrative authorization, preventing arbitrary browsing or enumeration.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Immutable Audit Logs</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Attendance approvals, marks submission, grievance closures, and permission modifications are cryptographically logged with user identity and timestamps.
                </p>
              </div>
            </div>
          </section>

          {/* Purpose of Processing */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              4. Purpose and Legal Grounds of Processing
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-300">
              <li>
                <strong>Educational Delivery:</strong> Enabling teachers to mark attendance, share course notes, review homework, and publish verified academic evaluations.
              </li>
              <li>
                <strong>Student Support:</strong> Enabling students to monitor attendance compliance thresholds ($\ge 75\%$), submit queries, and receive timely university circulars.
              </li>
              <li>
                <strong>Institutional Administration:</strong> Generating certified reports for statutory university compliance, accreditation audits, and administrative governance.
              </li>
              <li>
                <strong>Security & Tenant Isolation:</strong> Ensuring cryptographic and schema-level separation so each college’s records remain private and tamper-evident.
              </li>
            </ul>
          </section>

          {/* Cookies & Diagnostics */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              5. Cookies and Local Storage Disclosures
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              CampusSaathi uses browser storage responsibly:
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="font-semibold text-slate-900 dark:text-white min-w-[140px]">Essential Cookies:</span>
                <span className="text-slate-600 dark:text-slate-300 text-sm">JWT authentication sessions, tenant identifiers, and UI dark/light theme preferences. These are mandatory for platform security.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-slate-900 dark:text-white min-w-[140px]">Performance Cookies:</span>
                <span className="text-slate-600 dark:text-slate-300 text-sm">Optional anonymous telemetry to measure page speed and UI load times. PII (emails, names, passwords) is completely scrubbed before recording.</span>
              </div>
            </div>
          </section>

          {/* Multi-Tenant Security & Isolation */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
              <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              6. Data Security & Retention
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              We employ defense-in-depth security architecture:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-300 text-sm">
              <li>End-to-end TLS 1.3 encryption in transit for all web traffic and API endpoints.</li>
              <li>AES-256 encryption at rest for cloud databases and document file repositories.</li>
              <li>Database-level institutional barriers ensuring strict multi-tenant separation between different academic institutions.</li>
              <li>Data Retention: Academic records are retained for the duration of the student's program and as mandated by institutional statutory audit rules, after which records are archived or anonymized.</li>
            </ul>
          </section>

          {/* Rights under Indian Law */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              7. Your Rights under Indian Law (DPDP Act 2023)
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Under India’s Digital Personal Data Protection Act, 2023, data principals have enforceable rights:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-300 text-sm">
              <li><strong>Right to Access:</strong> View all profile and academic data associated with your student/faculty account.</li>
              <li><strong>Right to Correction & Erasure:</strong> Request corrections to outdated contact info through your campus administrator.</li>
              <li><strong>Right to Grievance Redressal:</strong> Direct escalation of unresolved privacy or data integrity concerns to our Grievance Officer.</li>
            </ul>
          </section>

          {/* Official Contact & Grievance Officer */}
          <section className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-4">
            <h2 className="text-lg font-bold text-blue-900 dark:text-blue-200">
              8. Official Support & Grievance Redressal
            </h2>
            <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-300">
              For any questions regarding this Privacy Policy, data access requests, or grievance redressal under DPDP Act 2023, contact our designated support team directly:
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
              <a
                href="tel:6203025057"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-all focus:ring-2 focus:ring-blue-500"
              >
                <Phone className="w-4 h-4" />
                Call: 6203025057
              </a>
              <a
                href="https://wa.me/916203025057"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition-all focus:ring-2 focus:ring-emerald-500"
              >
                <MessageSquare className="w-4 h-4" />
                WhatsApp: +91 6203025057
              </a>
              <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                Official Contact: CampusSaathi Support
              </span>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
