import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DEMO_USERS } from '../../lib/mockData';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Building,
  GraduationCap,
  Users,
  BookOpen,
  Hotel,
  Wrench,
  UtensilsCrossed,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { user, loginAsDemoRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const roles = [
    { key: 'student', label: 'Student', name: 'Amanpreet Kaur', icon: GraduationCap, route: '/app/student', tag: 'B.Tech CSE' },
    { key: 'warden', label: 'Hostel Warden', name: 'Col. Balwinder Singh', icon: Hotel, route: '/app/warden', tag: 'Boys Hostel' },
    { key: 'maintenance', label: 'Maintenance Staff', name: 'Ramesh Kumar', icon: Wrench, route: '/app/maintenance', tag: 'Electrician' },
    { key: 'teacher', label: 'Faculty / Teacher', name: 'Dr. Neha Verma', icon: BookOpen, route: '/app/teacher', tag: 'CSE Dept' },
    { key: 'parent', label: 'Parent / Guardian', name: 'S. Harjit Singh', icon: Users, route: '/app/parent', tag: 'Approved Parent' },
    { key: 'institution_admin', label: 'Institution Admin', name: 'Prof. Gurpreet Singh', icon: Building, route: '/app/admin', tag: 'Khalsa College' },
    { key: 'mess_manager', label: 'Mess Manager', name: 'Chef Surinder Gill', icon: UtensilsCrossed, route: '/app/mess', tag: 'Dining Hall' },
    { key: 'superadmin', label: 'Super Admin', name: 'Dr. Rajesh Sharma', icon: ShieldAlert, route: '/app/superadmin', tag: 'Platform Master' },
  ];

  const handleSelect = (key: string, route: string) => {
    loginAsDemoRole(key);
    navigate(route);
    setIsOpen(false);
  };

  const currentRoleObj = roles.find((r) => r.key === (user?.role === 'platform_admin' ? 'superadmin' : user?.role)) || roles[0];
  const CurrentIcon = currentRoleObj.icon;

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white rounded-xl text-xs font-semibold border border-slate-300 dark:border-white/20 transition-all focus:outline-none shadow-xs"
        title="Switch Demo Persona"
      >
        <span className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <CurrentIcon className="w-3.5 h-3.5" />
        </span>
        <span className="max-w-[130px] truncate">{currentRoleObj.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl ring-1 ring-black/5 z-50 p-2 border border-slate-200 dark:border-white/20 text-slate-900 dark:text-white animate-fade-in">
            <div className="px-3 py-2 border-b border-slate-100 dark:border-white/10 mb-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                1-Click Persona Fast Switch
              </p>
              <p className="text-[11px] text-[var(--muted-foreground)]">Test any role workflow during evaluation</p>
            </div>

            <div className="space-y-1 max-h-80 overflow-y-auto">
              {roles.map((r) => {
                const Icon = r.icon;
                const isSelected = user?.role === (r.key === 'superadmin' ? 'platform_admin' : r.key);
                return (
                  <button
                    key={r.key}
                    onClick={() => handleSelect(r.key, r.route)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-600/30 text-blue-700 dark:text-cyan-300 font-semibold border border-blue-200 dark:border-blue-500/30'
                        : 'hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-[var(--page-foreground)]">{r.label}</div>
                        <div className="text-[10px] text-[var(--muted-foreground)]">{r.name}</div>
                      </div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-[var(--muted-foreground)] font-normal border border-slate-200 dark:border-white/10">
                      {r.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

