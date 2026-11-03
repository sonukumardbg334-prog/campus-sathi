import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RoleSwitcher } from '../ui/RoleSwitcher';
import { NotificationDrawer } from '../ui/NotificationDrawer';
import { ThemeToggle } from '../ui/ThemeToggle';
import { CampusAiAssistant } from '../common/CampusAiAssistant';
import {
  GraduationCap,
  LayoutDashboard,
  AlertCircle,
  ClipboardList,
  CheckCircle2,
  CalendarCheck,
  BookOpen,
  Users,
  Building,
  UtensilsCrossed,
  Wrench,
  Hotel,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  PlusCircle,
  FileText,
  Clock,
  Settings,
} from 'lucide-react';

export const AppLayout: React.FC = () => {
  const { user, role, institution, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Determine role-specific nav items
  const getNavLinks = () => {
    switch (role) {
      case 'student':
        return [
          { label: 'Student Dashboard', path: '/app/student', icon: LayoutDashboard },
          { label: 'Report Grievance', path: '/app/student/new-complaint', icon: PlusCircle },
          { label: 'My Grievances', path: '/app/student/complaints', icon: AlertCircle },
          { label: 'Attendance Records', path: '/app/student/attendance', icon: CalendarCheck },
          { label: 'Academic Performance', path: '/app/student/academics', icon: BookOpen },
          { label: 'Timetable', path: '/app/student/timetable', icon: Clock },
          { label: 'Mess & Dining Feedback', path: '/app/student/mess', icon: UtensilsCrossed },
        ];
      case 'warden':
        return [
          { label: 'Warden Console', path: '/app/warden', icon: LayoutDashboard },
          { label: 'Grievance Review Queue', path: '/app/warden/complaints', icon: AlertCircle },
          { label: 'Resolution Verification', path: '/app/warden/verification', icon: CheckCircle2 },
          { label: 'Hostel Occupancy', path: '/app/warden/hostel', icon: Hotel },
          { label: 'Announcements', path: '/app/warden/announcements', icon: FileText },
        ];
      case 'maintenance':
        return [
          { label: 'My Work Orders', path: '/app/maintenance', icon: Wrench },
          { label: 'Submit Resolution Proof', path: '/app/maintenance/proof', icon: CheckCircle2 },
          { label: 'Task History', path: '/app/maintenance/history', icon: ClipboardList },
        ];
      case 'teacher':
        return [
          { label: 'Faculty Dashboard', path: '/app/teacher', icon: LayoutDashboard },
          { label: 'Take Attendance', path: '/app/teacher/attendance', icon: CalendarCheck },
          { label: 'Student Assessments', path: '/app/teacher/academics', icon: BookOpen },
          { label: 'Timetable', path: '/app/teacher/timetable', icon: Clock },
          { label: 'Publish Notices', path: '/app/teacher/announcements', icon: FileText },
        ];
      case 'parent':
        return [
          { label: 'Parent Dashboard', path: '/app/parent', icon: LayoutDashboard },
          { label: 'Child Attendance', path: '/app/parent/attendance', icon: CalendarCheck },
          { label: 'Academic Grades', path: '/app/parent/academics', icon: BookOpen },
          { label: 'Link Student', path: '/app/parent/link-student', icon: Users },
        ];
      case 'institution_admin':
        return [
          { label: 'Campus Admin Overview', path: '/app/admin', icon: LayoutDashboard },
          { label: 'Grievance Oversight', path: '/app/admin/complaints', icon: AlertCircle },
          { label: 'Parent Link Approvals', path: '/app/admin/parent-links', icon: Users },
          { label: 'Faculty & Staff', path: '/app/admin/staff', icon: Building },
          { label: 'Settings & RLS Policy', path: '/app/admin/settings', icon: Settings },
        ];
      case 'mess_manager':
        return [
          { label: 'Mess Operations', path: '/app/mess', icon: UtensilsCrossed },
          { label: 'Meal Menus', path: '/app/mess/menu', icon: ClipboardList },
          { label: 'Student Food Feedback', path: '/app/mess/feedback', icon: AlertCircle },
        ];
      case 'platform_admin':
        return [
          { label: 'Super Admin Overview', path: '/app/superadmin', icon: ShieldAlert },
          { label: 'Institution Applications', path: '/app/superadmin/institutions', icon: Building },
          { label: 'Security & Audit Logs', path: '/app/superadmin/audit', icon: FileText },
        ];
      default:
        return [
          { label: 'Dashboard', path: '/app/student', icon: LayoutDashboard },
        ];
    }
  };

  const navLinks = getNavLinks();

  const isPlatformAdmin = role === 'platform_admin';
  const campusBgSrc = isPlatformAdmin
    ? 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1920&q=80'
    : institution?.background_images?.[0] || '/assets/khalsa-college-bg.jpg';

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden text-[var(--page-foreground)] bg-[var(--page-background)] transition-colors duration-300">
      {/* Dynamic Animated College Background Visible Throughout Entire Portal */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none">
        <img
          src={campusBgSrc}
          alt="Campus Atmosphere"
          className="w-full h-full object-cover object-center animate-cinematic-bg transform scale-105"
          style={{ willChange: 'transform' }}
        />
        {/* Soft frosted glassmorphism wash preserving college visibility in both light & dark modes */}
        <div className="absolute inset-0 bg-[var(--overlay-color)] backdrop-blur-[2px] transition-colors duration-300" />
      </div>

      {/* Top Application Navbar (Translucent Glassmorphism) */}
      <header className="sticky top-0 z-40 bg-[var(--navbar-background)] backdrop-blur-xl text-[var(--page-foreground)] shadow-xl border-b border-[var(--navbar-border)] transition-colors duration-300">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Mobile hamburger + Brand + Institution Badge */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-[var(--page-foreground)] hover:bg-white/10"
              aria-label="Toggle Navigation Sidebar"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-slate-950/80 border border-amber-400/40 p-0.5 flex items-center justify-center shadow-md overflow-hidden">
                <img
                  src="/assets/campussaathi-logo.png"
                  alt="CampusSaathi Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <span className="text-base font-bold tracking-tight text-[var(--page-foreground)]">CampusSaathi</span>
                <span className="block text-[9px] font-semibold text-cyan-500 dark:text-cyan-400 tracking-wider uppercase -mt-0.5">
                  Unified Campus Platform
                </span>
              </div>
            </Link>

            {/* Institution Badge */}
            <div className="hidden md:flex items-center ml-4 pl-4 border-l border-[var(--card-border)]">
              <div className="px-2.5 py-1 rounded-md bg-white/10 dark:bg-white/5 border border-[var(--card-border)] text-xs font-medium text-[var(--page-foreground)] flex items-center gap-1.5 backdrop-blur-xs">
                <Building className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                <span className="max-w-[200px] truncate">
                  {institution?.name || 'Khalsa College of Eng & Tech'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Role Switcher + Theme Toggle + Notifications + User Avatar + Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 1-click Role Switcher */}
            <RoleSwitcher />

            {/* Theme Toggle (Light / Dark / System) */}
            <ThemeToggle variant="dropdown" />

            {/* Notification Drawer */}
            <NotificationDrawer />

            {/* User Profile & Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-[var(--card-border)]">
              <div className="hidden sm:block text-right">
                <div className="text-xs font-semibold text-[var(--page-foreground)] leading-tight">{user?.full_name}</div>
                <div className="text-[10px] text-cyan-500 dark:text-cyan-400 capitalize">{role.replace('_', ' ')}</div>
              </div>

              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center ring-2 ring-white/20 shadow-md">
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
              </div>

              <button
                onClick={handleLogout}
                className="p-1.5 text-[var(--muted-foreground)] hover:text-[var(--page-foreground)] hover:bg-white/10 rounded-lg transition-colors ml-1"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body: Sidebar + Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar (Translucent Glassmorphism) */}
        <aside className="hidden lg:flex flex-col w-64 bg-[var(--surface-background)] backdrop-blur-xl border-r border-[var(--card-border)] p-4 space-y-1 overflow-y-auto transition-colors duration-300">
          <div className="px-3 py-2 text-[11px] font-bold text-cyan-500 dark:text-cyan-400 uppercase tracking-wider">
            {role.replace('_', ' ')} Portal
          </div>

          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 font-semibold border border-white/20'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--page-foreground)] hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-cyan-500 dark:text-cyan-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Persistent Sidebar Theme Switcher */}
          <div className="mt-auto pt-4 border-t border-[var(--card-border)] space-y-2">
            <div className="px-2 text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
              Theme Mode
            </div>
            <ThemeToggle variant="segmented" className="w-full justify-between" />
          </div>
        </aside>

        {/* Mobile Slide-Over Sidebar Drawer */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[var(--surface-background)] p-5 space-y-3 border-r border-[var(--card-border)] backdrop-blur-2xl text-[var(--page-foreground)]">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--card-border)]">
                <span className="text-sm font-bold capitalize">{role.replace('_', ' ')} Menu</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--page-foreground)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Theme Toggle in Mobile Sidebar */}
              <div className="py-1">
                <ThemeToggle variant="segmented" className="w-full justify-between" />
              </div>

              <div className="space-y-1 py-2 overflow-y-auto flex-1">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                        isActive
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'text-[var(--muted-foreground)] hover:text-[var(--page-foreground)] hover:bg-slate-100 dark:hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-[var(--card-border)]">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 text-xs font-semibold"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Routed Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto relative z-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Floating AI Campus Assistant */}
      <CampusAiAssistant />
    </div>
  );
};
