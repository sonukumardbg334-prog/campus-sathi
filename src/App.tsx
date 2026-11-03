import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from './components/layout/PublicLayout';
import { AppLayout } from './components/layout/AppLayout';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Public pages
import { HomePage } from './pages/public/HomePage';
import { FeaturesPage } from './pages/public/FeaturesPage';
import { InstitutionsPage } from './pages/public/InstitutionsPage';
import { RegisterInstitutionPage } from './pages/public/RegisterInstitutionPage';
import { RegisterRolePage } from './pages/public/RegisterRolePage';
import { LoginPage } from './pages/public/LoginPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';
import { PrivacyPage } from './pages/public/PrivacyPage';
import { TermsPage } from './pages/public/TermsPage';
import { ContactPage } from './pages/public/ContactPage';
import { SupportPage } from './pages/public/SupportPage';
import { FeedbackPage } from './pages/public/FeedbackPage';
import { BugReportPage } from './pages/public/BugReportPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Authenticated Role pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { NewComplaintPage } from './pages/student/NewComplaintPage';
import { ComplaintTrackerPage } from './pages/student/ComplaintTrackerPage';
import { StudentAttendancePage } from './pages/student/StudentAttendancePage';
import { StudentAcademicsPage } from './pages/student/StudentAcademicsPage';
import { StudentTimetablePage } from './pages/student/StudentTimetablePage';
import { StudentMessFeedbackPage } from './pages/student/StudentMessFeedbackPage';

import { WardenDashboard } from './pages/warden/WardenDashboard';
import { MaintenanceDashboard } from './pages/maintenance/MaintenanceDashboard';
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { ParentDashboard } from './pages/parent/ParentDashboard';
import { ParentLinkStudentPage } from './pages/parent/ParentLinkStudentPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { SuperAdminDashboard } from './pages/superadmin/SuperAdminDashboard';
import { MessDashboard } from './pages/mess/MessDashboard';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Public Marketing & Informational Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/institutions" element={<InstitutionsPage />} />
          <Route path="/register-institution" element={<RegisterInstitutionPage />} />
          <Route path="/register" element={<RegisterRolePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/privacy-policy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/terms-and-conditions" element={<TermsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/report-bug" element={<BugReportPage />} />
          <Route path="/my-support-requests" element={<SupportPage />} />
        </Route>

      {/* Authenticated CampusSaathi Application Portals */}
      <Route path="/app" element={<AppLayout />}>
        {/* Student Routes */}
        <Route path="student" element={<StudentDashboard />} />
        <Route path="student/new-complaint" element={<NewComplaintPage />} />
        <Route path="student/complaints" element={<ComplaintTrackerPage />} />
        <Route path="student/attendance" element={<StudentAttendancePage />} />
        <Route path="student/academics" element={<StudentAcademicsPage />} />
        <Route path="student/timetable" element={<StudentTimetablePage />} />
        <Route path="student/mess" element={<StudentMessFeedbackPage />} />

        {/* Warden Routes */}
        <Route path="warden" element={<WardenDashboard />} />
        <Route path="warden/complaints" element={<WardenDashboard />} />
        <Route path="warden/verification" element={<WardenDashboard />} />
        <Route path="warden/hostel" element={<WardenDashboard />} />
        <Route path="warden/announcements" element={<WardenDashboard />} />

        {/* Maintenance Routes */}
        <Route path="maintenance" element={<MaintenanceDashboard />} />
        <Route path="maintenance/proof" element={<MaintenanceDashboard />} />
        <Route path="maintenance/history" element={<MaintenanceDashboard />} />

        {/* Teacher / Faculty Routes */}
        <Route path="teacher" element={<TeacherDashboard />} />
        <Route path="teacher/attendance" element={<TeacherDashboard />} />
        <Route path="teacher/academics" element={<TeacherDashboard />} />
        <Route path="teacher/timetable" element={<TeacherDashboard />} />
        <Route path="teacher/announcements" element={<TeacherDashboard />} />

        {/* Parent / Guardian Routes */}
        <Route path="parent" element={<ParentDashboard />} />
        <Route path="parent/attendance" element={<ParentDashboard />} />
        <Route path="parent/academics" element={<ParentDashboard />} />
        <Route path="parent/link-student" element={<ParentLinkStudentPage />} />

        {/* Institution Admin Routes */}
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="admin/complaints" element={<AdminDashboard />} />
        <Route path="admin/parent-links" element={<AdminDashboard />} />
        <Route path="admin/staff" element={<AdminDashboard />} />
        <Route path="admin/settings" element={<AdminDashboard />} />

        {/* Platform Super Admin Routes */}
        <Route path="superadmin" element={<SuperAdminDashboard />} />
        <Route path="superadmin/institutions" element={<SuperAdminDashboard />} />
        <Route path="superadmin/audit" element={<SuperAdminDashboard />} />

        {/* Mess Manager Routes */}
        <Route path="mess" element={<MessDashboard />} />
        <Route path="mess/menu" element={<MessDashboard />} />
        <Route path="mess/feedback" element={<MessDashboard />} />
      </Route>

      {/* Fallback to custom 404 page */}
      <Route path="*" element={<PublicLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  </ErrorBoundary>
  );
};

export default App;
