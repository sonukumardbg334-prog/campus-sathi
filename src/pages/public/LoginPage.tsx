import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DEMO_USERS } from '../../lib/mockData';
import { campusStore } from '../../lib/store';
import { CollegeBackground } from '../../components/common/CollegeBackground';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import {
  GraduationCap,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Hotel,
  Users,
  BookOpen,
  Wrench,
  UtensilsCrossed,
  Building,
  ShieldAlert,
  ChevronDown,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginAsDemoRole, authError } = useAuth();
  const navigate = useNavigate();

  // Institution selection state (Multi-Tenant personalization)
  const institutions = campusStore.getInstitutions();
  const [selectedInstId, setSelectedInstId] = useState<string>('inst-1'); // Default Khalsa College

  const currentInstitution = institutions.find((i) => i.id === selectedInstId) || institutions[0];

  // Active role tab filter
  const [activeRoleTab, setActiveRoleTab] = useState<string>('ALL');

  // Form credentials
  const [email, setEmail] = useState('sonukumardbg334@gmail.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const demoPersonas = [
    { key: 'student', title: 'Student Login', name: 'Sonu Kumar', email: 'sonukumardbg334@gmail.com', icon: GraduationCap, route: '/app/student', role: 'student', desc: 'Grievance cell, attendance & academics' },
    { key: 'warden', title: 'Warden Login', name: 'Col. Balwinder Singh', email: 'warden.boys@khalsa.edu.in', icon: Hotel, route: '/app/warden', role: 'warden', desc: 'Review, technician assign & verification' },
    { key: 'maintenance', title: 'Maintenance Login', name: 'Ramesh Kumar', email: 'ramesh.maint@khalsa.edu.in', icon: Wrench, route: '/app/maintenance', role: 'maintenance', desc: 'Work orders & resolution photo proof' },
    { key: 'parent', title: 'Parent Login', name: 'S. Harjit Singh', email: 'harjit.singh@gmail.com', icon: Users, route: '/app/parent', role: 'parent', desc: 'PIN verification & ward monitoring' },
    { key: 'teacher', title: 'Teacher Login', name: 'Dr. Neha Verma', email: 'neha.cse@khalsa.edu.in', icon: BookOpen, route: '/app/teacher', role: 'teacher', desc: '1-click attendance marking & grading' },
    { key: 'institution_admin', title: 'Admin Login', name: 'Prof. Gurpreet Singh', email: 'admin@khalsa.edu.in', icon: Building, route: '/app/admin', role: 'institution_admin', desc: 'Campus governance & approvals' },
    { key: 'mess_manager', title: 'Mess Login', name: 'Chef Surinder Gill', email: 'mess.manager@khalsa.edu.in', icon: UtensilsCrossed, role: 'mess_manager', desc: 'Daily menu planner & meal reviews' },
    { key: 'superadmin', title: 'Super Admin Login', name: 'Dr. Rajesh Sharma', email: 'superadmin@campussaathi.in', icon: ShieldAlert, route: '/app/superadmin', role: 'platform_admin', desc: 'Platform tenant controls & audit' },
  ];

  const filteredPersonas = activeRoleTab === 'ALL'
    ? demoPersonas
    : demoPersonas.filter((p) => p.role === activeRoleTab);

  const handleRoleTabClick = (role: string) => {
    setActiveRoleTab(role);
    const target = demoPersonas.find((p) => p.role === role);
    if (target) {
      setEmail(target.email);
    }
  };

  const handleQuickPersona = (roleKey: string, targetRoute?: string) => {
    loginAsDemoRole(roleKey);
    navigate(targetRoute || '/app/student');
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const ok = await login(email, password);
      if (ok) {
        const found = campusStore.getUserByEmail(email);
        const targetRole = found?.role || 'student';
        if (targetRole === 'warden') navigate('/app/warden');
        else if (targetRole === 'teacher') navigate('/app/teacher');
        else if (targetRole === 'parent') navigate('/app/parent');
        else if (targetRole === 'maintenance') navigate('/app/maintenance');
        else if (targetRole === 'institution_admin') navigate('/app/admin');
        else if (targetRole === 'mess_manager') navigate('/app/mess');
        else if (targetRole === 'platform_admin') navigate('/app/superadmin');
        else navigate('/app/student');
      } else {
        setError(authError || 'Invalid credentials or unapproved institution membership.');
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check network.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CollegeBackground
      institutionId={selectedInstId}
      variant="fullscreen"
      overlayOpacity="medium"
      showControls={true}
      className="py-10 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto space-y-8 my-auto">
        {/* Top Institution Switcher & Branding Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--card-background)] backdrop-blur-xl border border-[var(--card-border)] text-[var(--card-foreground)] shadow-lg transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-teal-brand p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-primary rounded-[10px] flex items-center justify-center text-teal-300 font-bold text-lg">
                CS
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-[var(--card-foreground)] tracking-tight">
                  {currentInstitution.name}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/15 dark:bg-teal-brand/30 text-blue-700 dark:text-teal-200 border border-blue-400/30 dark:border-teal-400/30">
                  {currentInstitution.code}
                </span>
              </div>
              <p className="text-xs text-[var(--muted-foreground)]">
                {currentInstitution.hero_tagline || 'One Campus. Every Connection.'}
              </p>
            </div>
          </div>

          {/* Institution Selector for Multi-Tenant Testing */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--muted-foreground)] font-medium whitespace-nowrap">Institution:</span>
            <select
              value={selectedInstId}
              onChange={(e) => setSelectedInstId(e.target.value)}
              className="bg-[var(--input-background)] text-[var(--input-foreground)] text-xs font-semibold rounded-lg px-3 py-1.5 border border-[var(--card-border)] focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors cursor-pointer shadow-xs"
            >
              {institutions.map((inst) => (
                <option key={inst.id} value={inst.id} className="text-slate-900 bg-white dark:text-white dark:bg-slate-900">
                  {inst.name} ({inst.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Role Tabs for Direct Role Logins */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {[
            { label: 'All Roles', value: 'ALL' },
            { label: 'Student Login', value: 'student' },
            { label: 'Teacher Login', value: 'teacher' },
            { label: 'Warden Login', value: 'warden' },
            { label: 'Parent/Guardian Login', value: 'parent' },
            { label: 'Maintenance Login', value: 'maintenance' },
            { label: 'Mess Login', value: 'mess_manager' },
            { label: 'Admin Login', value: 'institution_admin' },
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => handleRoleTabClick(tab.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeRoleTab === tab.value
                  ? 'bg-blue-600 text-white shadow-soft ring-2 ring-blue-400/40'
                  : 'bg-[var(--surface-background)] hover:bg-[var(--card-background)] text-[var(--card-foreground)] border border-[var(--card-border)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 1-Click Fast Persona Switcher Cards (Glassmorphism) */}
        <div className="bg-[var(--card-background)] backdrop-blur-xl rounded-2xl p-5 border border-[var(--card-border)] shadow-2xl space-y-3 text-[var(--card-foreground)]">
          <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-600 dark:text-teal-300 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-teal-200">
                1-Click Role Direct Access
              </span>
            </div>
            <span className="text-[11px] text-[var(--muted-foreground)]">
              Evaluator shortcuts • No password required
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {filteredPersonas.map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => handleQuickPersona(p.key, p.route)}
                  className="p-3 bg-[var(--nested-surface)] hover:bg-[var(--card-background)] border border-[var(--card-border)] rounded-xl text-left transition-all hover:scale-[1.02] flex flex-col justify-between group cursor-pointer shadow-xs text-[var(--card-foreground)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="p-1.5 rounded-lg bg-[var(--card-background)] group-hover:bg-blue-600 dark:group-hover:bg-teal-brand group-hover:text-white transition-colors border border-[var(--card-border)]">
                      <Icon className="w-4 h-4" />
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 dark:text-teal-300" />
                  </div>
                  <div className="mt-2">
                    <div className="text-xs font-bold leading-tight text-[var(--card-foreground)]">{p.title}</div>
                    <div className="text-[10px] text-blue-600 dark:text-teal-300 truncate font-medium">{p.name}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Standard Email/Password Form in Premium Glassmorphism Card */}
        <div className="max-w-md mx-auto w-full">
          <div className="bg-[var(--card-background)] backdrop-blur-xl border border-[var(--card-border)] shadow-2xl rounded-2xl p-6 sm:p-8 space-y-5 text-[var(--card-foreground)]">
            <div className="text-center space-y-1">
              <div className="w-16 h-16 rounded-2xl bg-slate-950/80 border border-amber-400/40 p-1 flex items-center justify-center mx-auto mb-2 shadow-xl overflow-hidden">
                <img
                  src="/assets/campussaathi-logo.png"
                  alt="CampusSaathi Official Emblem"
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className="text-xl font-bold text-[var(--card-foreground)]">Sign In to CampusSaathi</h2>
              <p className="text-xs text-[var(--muted-foreground)]">
                {currentInstitution.name} Unified Portal
              </p>
            </div>

            <form onSubmit={handleManualLogin} className="space-y-4">
              <Input
                label="Registered Institutional Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@college.edu.in"
                required
              />

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[var(--page-foreground)]">Password</label>
                  <Link to="/forgot-password" className="text-xs text-secondary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-xs text-danger font-medium">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full shadow-md"
                isLoading={isLoading}
              >
                Sign In to Campus
              </Button>

              <div className="text-center text-xs text-muted pt-2 border-t border-[var(--card-border)] flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                <div>
                  <span>Need an account? </span>
                  <Link to="/register" className="text-blue-600 dark:text-cyan-400 font-semibold hover:underline">
                    Register Role
                  </Link>
                </div>
                <span className="hidden sm:inline text-slate-400 dark:text-slate-500">•</span>
                <div>
                  <span>New campus? </span>
                  <Link to="/register-institution" className="text-blue-600 dark:text-cyan-400 font-semibold hover:underline">
                    Register Institution
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </CollegeBackground>
  );
};
