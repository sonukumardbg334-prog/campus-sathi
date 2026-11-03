import React, { useEffect } from 'react';
import { Scale, ShieldCheck, FileCheck, Phone, MessageSquare, AlertTriangle } from 'lucide-react';
import { analytics } from '../../lib/analytics';

export const TermsPage: React.FC = () => {
  useEffect(() => {
    analytics.pageView('Terms and Conditions');
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Scale className="w-4 h-4" />
            Legal Agreement
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Terms & Conditions of Service
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Effective Date: October 30, 2026 • Governing Higher Education Multi-Tenant Usage in India
          </p>
        </div>

        {/* Content Card */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-10 space-y-9 leading-relaxed text-sm sm:text-base">

          {/* Clause 1 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              1. Preamble & Acceptance of Terms
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              These Terms & Conditions ("Agreement") constitute a legally binding agreement between you ("User", "you", or "Institution") and CampusSaathi ("Platform", "we", "us"). By accessing or utilizing the CampusSaathi platform, portals, or APIs, you signify that you have read, understood, and agreed to be bound by these Terms and our Privacy Policy. If you do not agree, you must not access or use the Platform.
            </p>
          </section>

          {/* Clause 2 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              2. Definition of Platform & Multi-Tenant Architecture
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              CampusSaathi operates a secure multi-tenant educational cloud platform providing college management, attendance tracking, faculty record management, examination results publication, timetable scheduling, and hostel/campus operations. Each institutional tenant is isolated through database Row-Level Security (RLS) policies.
            </p>
          </section>

          {/* Clause 3 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              3. User Eligibility & Institutional Affiliation
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Platform access is restricted to bona fide students, appointed faculty, authorized administrators, wardens, and parents affiliated with an accredited higher-education institution onboarded onto CampusSaathi. Users must possess valid institutional credentials.
            </p>
          </section>

          {/* Clause 4 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              4. User Roles & Account Responsibilities
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              The Platform enforces distinct access rights across 4 primary tiers:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-300 text-sm">
              <li><strong>Students:</strong> View attendance, review grades, download study materials, and submit assignments.</li>
              <li><strong>Teachers / Faculty:</strong> Record daily and 15-day/monthly attendance, grade submissions, and publish academic announcements.</li>
              <li><strong>College Administrators:</strong> Manage college course catalogues, faculty assignments, tenant verification status, and student rosters.</li>
              <li><strong>Platform Super Administrators:</strong> Maintain platform security, onboard institutions, and oversee global system reliability.</li>
            </ul>
          </section>

          {/* Clause 5 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              5. Credential Security & Password Rules
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Users are responsible for maintaining the confidentiality of their login credentials. Any activity occurring under your account is your sole responsibility. Immediate notification to CampusSaathi Support is required upon detecting any unauthorized access.
            </p>
          </section>

          {/* Clause 6 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              6. Institutional Onboarding & Tenant Verification
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Institutions requesting onboarding undergo strict administrative tenant verification. Platform Super Admins reserve the right to verify college accreditation, official email domains, and signatory credentials before toggling tenant status to Verified.
            </p>
          </section>

          {/* Clause 7 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              7. Academic Data Accuracy & Record Ownership
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              The participating college retains full legal ownership of student academic records, marks, and enrollments. CampusSaathi acts as a secure Data Processor under Indian data protection legislation, maintaining records according to the institution's lawful instructions.
            </p>
          </section>

          {/* Clause 8 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              8. Attendance Tracking & Approval Workflows
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Attendance records recorded by faculty undergo validation cycles (15-day and monthly submissions). Once an attendance period is formally finalized or approved by the department head, modifications are locked and logged in tamper-evident audit trails.
            </p>
          </section>

          {/* Clause 9 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              9. Examination Results & Grading Integrity
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Grades and examination marks entered into the platform are authoritative reflections of institutional evaluations. Students cannot edit results. Any discrepancies must be routed to the respective college Controller of Examinations.
            </p>
          </section>

          {/* Clause 10 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              10. Study Materials & Intellectual Property
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Faculty members and colleges retain intellectual property rights over course materials, lecture notes, and syllabi uploaded to the Platform. By uploading, the Institution grants CampusSaathi a non-exclusive license to store and serve the content to enrolled students.
            </p>
          </section>

          {/* Clause 11 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              11. Prohibited Activities & Security Probing
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Users may not attempt SQL injection, cross-tenant enumeration, denial of service attacks, scraping, reverse engineering, or bypassing authentication barriers. Violations result in immediate permanent account termination and referral to law enforcement under the Information Technology Act, 2000.
            </p>
          </section>

          {/* Clause 12 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              12. Third-Party Integrations & Cloud Infrastructure
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              The Platform leverages enterprise cloud databases (PostgreSQL/Supabase) and encrypted hosting. Third-party services comply with enterprise security certifications including SOC2 and ISO 27001.
            </p>
          </section>

          {/* Clause 13 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              13. Service Availability, Maintenance Windows & Uptime
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              We aim for 99.9% platform availability. Scheduled maintenance windows are announced to institution administrators in advance during off-peak academic hours whenever possible.
            </p>
          </section>

          {/* Clause 14 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              14. Mobile & Device Compatibility
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              CampusSaathi is fully responsive and optimized for modern web browsers on desktop, tablet, and mobile devices (Chrome, Firefox, Safari, Edge). Users are responsible for procuring compatible devices and Internet connectivity.
            </p>
          </section>

          {/* Clause 15 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              15. Fees, Subscriptions & Payment Terms
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Institutional subscription fees are governed by individual Service Level Agreements (SLAs) executed between the participating college and CampusSaathi. Enrolled students and faculty do not incur platform licensing charges.
            </p>
          </section>

          {/* Clause 16 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              16. Suspension, Termination & De-registration
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              CampusSaathi or college administrators may suspend access upon graduation, withdrawal, employment termination, breach of institutional conduct policies, or violation of these Terms.
            </p>
          </section>

          {/* Clause 17 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              17. Limitation of Liability
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              To the maximum extent permitted by Indian law, CampusSaathi shall not be liable for indirect, incidental, or consequential damages arising from examination results published by institutions or internet connectivity failures beyond our immediate network perimeter.
            </p>
          </section>

          {/* Clause 18 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              18. Indemnification
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Institutions and users agree to indemnify and hold harmless CampusSaathi, its affiliates, and engineers against claims arising from inaccurate academic information submitted by institutional staff or unauthorized account sharing.
            </p>
          </section>

          {/* Clause 19 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              19. Force Majeure
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Neither party shall be held liable for delays or service interruptions resulting from natural disasters, telecommunications grid collapse, civil unrest, or statutory government mandates.
            </p>
          </section>

          {/* Clause 20 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              20. Modifications to Terms
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              We reserve the right to amend these Terms to reflect legislative changes (e.g. DPDP rules) or new platform features. Notice of material updates will be posted with an updated effective date.
            </p>
          </section>

          {/* Clause 21 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              21. Governing Law & Dispute Resolution
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              This Agreement shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising hereunder shall be subject to the exclusive jurisdiction of the competent courts in India.
            </p>
          </section>

          {/* Clause 22 */}
          <section className="p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 space-y-4">
            <h2 className="text-lg font-bold text-indigo-900 dark:text-indigo-200">
              22. Official Support & Legal Notices Contact
            </h2>
            <p className="text-xs sm:text-sm text-indigo-800 dark:text-indigo-300">
              For legal inquiries, contract clarifications, or urgent administrative assistance, contact our designated support channel directly:
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
              <a
                href="tel:6203025057"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-all focus:ring-2 focus:ring-indigo-500"
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
              <span className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">
                Official Support: CampusSaathi Support
              </span>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
