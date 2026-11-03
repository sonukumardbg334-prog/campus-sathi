import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Camera,
  CheckCircle2,
  Users,
  Hotel,
  Wrench,
  UtensilsCrossed,
  BookOpen,
  Building2,
  Lock,
  Server,
  Rocket,
  PlayCircle,
  Landmark,
  Mail,
  User,
  ChevronDown,
  BarChart3,
  Cloud,
  FileText,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { campusStore } from '../../lib/store';
import { IndiaLocationSelector } from '../../components/common/IndiaLocationSelector';

export const HomePage: React.FC = () => {
  // Hero registration form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'Engineering College',
    official_email: '',
    contact_person: '',
    state: 'Punjab',
    city: 'Amritsar',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const institutionTypes = [
    'Engineering College',
    'University',
    'Autonomous College',
    'Medical College',
    'Management Institute',
    'Polytechnic Institute',
  ];

  const handleStateChange = (newState: string) => {
    setFormData((prev) => ({
      ...prev,
      state: newState,
    }));
  };

  const handleCityChange = (newCity: string) => {
    setFormData((prev) => ({
      ...prev,
      city: newCity,
    }));
  };

  const handleHeroRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.official_email.trim()) {
      setFormError('Please enter the Institution Name and Official Email.');
      return;
    }
    setFormError('');

    // Generate simple code from name initials
    const words = formData.name.trim().split(/\s+/);
    const code =
      words.length >= 2
        ? words
            .slice(0, 4)
            .map((w) => w[0].toUpperCase())
            .join('')
        : formData.name.slice(0, 4).toUpperCase();

    campusStore.registerInstitution({
      name: formData.name,
      code,
      type: formData.type,
      official_email: formData.official_email,
      state: formData.state,
      city: formData.city,
      campus_count: 1,
    });

    setFormSubmitted(true);
  };

  // Exactly 9 Bottom Feature Cards matching reference screenshot media_1793295987366_48532159.jpg
  const featureCards = [
    {
      title: 'Students',
      desc: 'Attendance, Complaints, Timetable & More',
      icon: GraduationCap,
      link: '/app/student',
    },
    {
      title: 'Parents',
      desc: 'Track Progress, Get Updates',
      icon: Users,
      link: '/app/parent',
    },
    {
      title: 'Faculty',
      desc: 'Manage Classes, Academic Records',
      icon: BookOpen,
      link: '/app/teacher',
    },
    {
      title: 'Wardens',
      desc: 'Hostel Management, Complaint Resolution',
      icon: ShieldCheck,
      link: '/app/warden',
    },
    {
      title: 'Mess Manager',
      desc: 'Food Feedback, Hygiene & Menu',
      icon: UtensilsCrossed,
      link: '/app/mess',
    },
    {
      title: 'Maintenance',
      desc: 'Task Management, Work Tracking',
      icon: Wrench,
      link: '/app/maintenance',
    },
    {
      title: 'Institution Admin',
      desc: 'Full Campus Control',
      icon: Building2,
      link: '/app/admin',
    },
    {
      title: 'Analytics',
      desc: 'Reports & Insights',
      icon: BarChart3,
      link: '/app/superadmin',
    },
    {
      title: 'Multi-College',
      desc: 'Secure & Scalable',
      icon: Cloud,
      link: '/institutions',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Student Lodges Grievance',
      desc: 'Mobile-first submission with camera photo evidence, automatic location tagging, and AI suggested priority.',
      icon: Camera,
    },
    {
      num: '02',
      title: 'Warden Queue & Assignment',
      desc: 'Warden reviews issue severity, checks duplicate alerts, and delegates work order to verified maintenance staff.',
      icon: Hotel,
    },
    {
      num: '03',
      title: 'Staff Execution & Proof',
      desc: 'Technician updates job in progress, repairs hardware, and uploads resolution photo evidence for accountability.',
      icon: Wrench,
    },
    {
      num: '04',
      title: 'Verification & Closure',
      desc: 'Warden inspects side-by-side photographic evidence, approves resolution, and student receives instant in-app notification.',
      icon: CheckCircle2,
    },
  ];

  const personas = [
    {
      title: 'Students',
      role: 'Fast resolution on tap',
      desc: 'Report broken fans, Wi-Fi outages, or mess issues in 30 seconds with photo proof and real-time status tracking.',
      icon: GraduationCap,
    },
    {
      title: 'Hostel Wardens',
      role: 'Live Operational Command',
      desc: 'Filter urgent issues, detect duplicate room complaints, assign technicians, and verify photographic repair evidence.',
      icon: Hotel,
    },
    {
      title: 'Parents & Guardians',
      role: 'Verified Academic Trust',
      desc: 'Secure PIN-verified link to student attendance percentages, mid-term academic scores, and university notices.',
      icon: Users,
    },
    {
      title: 'Faculty & Teachers',
      role: 'Effortless Attendance',
      desc: '1-click batch attendance recording, duplicate entry prevention, grade entry, and instant student alerts.',
      icon: BookOpen,
    },
    {
      title: 'Campus Administrators',
      role: 'Multi-Tenant Governance',
      desc: 'Full visibility over departments, staff work orders, resolution metrics, and multi-college tenant security.',
      icon: Building2,
    },
  ];

  return (
    <div className="space-y-16 pb-20 overflow-x-hidden">
      {/* ========================================================
          FULL-SCREEN CINEMATIC HERO SECTION
          Exact recreation of reference screenshot media_1793295987366_48532159.jpg
          ======================================================== */}
      <section className="relative min-h-screen lg:h-screen w-full flex flex-col justify-between overflow-hidden">
        {/* Middle Content: Left Hero Text + Right Glassmorphism Registration Card */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-22 lg:pt-20 pb-2 my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            {/* LEFT COLUMN: HERO HEADLINE & ACTIONS */}
            <div className="lg:col-span-7 space-y-4 text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/50 backdrop-blur-md border border-slate-300/80 dark:border-white/20 text-xs font-semibold text-slate-800 dark:text-white/95 shadow-sm">
                <img src="/assets/campussaathi-logo.png" alt="CampusSaathi Emblem" className="w-4 h-4 object-contain inline-block" />
                <span>Multi-College Smart Campus Management Platform</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                One Campus. <br />
                <span className="text-slate-900 dark:text-white">Every </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 dark:from-sky-400 dark:via-cyan-300 dark:to-teal-300 drop-shadow-[0_0_35px_rgba(56,189,248,0.55)]">
                  Connection.
                </span>
              </h1>

              {/* Description Paragraph */}
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200/90 leading-relaxed max-w-xl font-normal">
                CampusSaathi unites higher-ed colleges, hostels, students, parents, faculty, wardens, and maintenance crews on a single, secure, multi-tenant cloud platform.
              </p>

              {/* 3 Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link to="/app/student">
                  <button className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-500 hover:to-blue-400 text-white font-medium text-sm shadow-[0_0_25px_rgba(37,99,235,0.5)] flex items-center gap-2 transition transform hover:scale-[1.02]">
                    <Rocket className="w-4 h-4 text-white" />
                    <span>Launch Live Demo Portal</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </Link>

                <a href="#features">
                  <button className="px-5 py-3 rounded-xl bg-white/80 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900/60 backdrop-blur-md border border-slate-300 dark:border-white/25 text-slate-800 dark:text-white font-medium text-sm flex items-center gap-2 transition hover:border-blue-400">
                    <PlayCircle className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                    <span>Explore Features</span>
                  </button>
                </a>

                <button
                  onClick={() => {
                    const el = document.getElementById('hero-register-form');
                    el?.scrollIntoView({ behavior: 'smooth' });
                    const nameInput = document.getElementById('reg-inst-name');
                    nameInput?.focus();
                  }}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-medium text-sm shadow-[0_0_20px_rgba(20,184,166,0.35)] flex items-center gap-2 transition transform hover:scale-[1.02]"
                >
                  <Building2 className="w-4 h-4 text-white" />
                  <span>Register Campus</span>
                </button>
              </div>

              {/* Live Campus Performance Metrics */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-3 max-w-lg">
                <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/80 dark:border-white/10 text-center">
                  <div className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-sky-400 dark:to-teal-300">
                    99.4%
                  </div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">Resolution Rate</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/80 dark:border-white/10 text-center">
                  <div className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500 dark:from-teal-300 dark:to-emerald-300">
                    &lt; 3.8 hrs
                  </div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">Avg Repair Speed</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/80 dark:border-white/10 text-center">
                  <div className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-300 dark:to-pink-300">
                    35,000+
                  </div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">Active Students</div>
                </div>
              </div>

              {/* Status / Evaluation line */}
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300/90 pt-1">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0" />
                <span>Multi-College Cloud ERP: 1-Click Fast Switch between 9 User Roles</span>
              </div>
            </div>

            {/* RIGHT COLUMN: FROSTED GLASS REGISTRATION CARD */}
            <div className="lg:col-span-5 w-full flex justify-end">
              <div
                id="hero-register-form"
                className="w-full max-w-md rounded-3xl bg-[var(--card-background)] backdrop-blur-2xl border border-[var(--card-border)] p-5 sm:p-6 shadow-[0_0_50px_rgba(37,99,235,0.2)] text-[var(--card-foreground)] relative transition-all"
              >
                {/* Card Header */}
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-950/80 border border-amber-400/40 p-1 flex items-center justify-center shrink-0 shadow-lg overflow-hidden">
                    <img
                      src="/assets/campussaathi-logo.png"
                      alt="CampusSaathi Emblem"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--card-foreground)] tracking-tight">Register Your Campus</h3>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5 leading-snug">
                      Join the CampusSaathi platform and digitalize your institution.
                    </p>
                  </div>
                </div>

                {formSubmitted ? (
                  <div className="py-6 text-center space-y-4 animate-fade-in">
                    <div className="w-14 h-14 bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 border border-emerald-400/30 rounded-full flex items-center justify-center mx-auto shadow-lg">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[var(--card-foreground)]">Application Received!</h4>
                      <p className="text-xs text-[var(--muted-foreground)] mt-1 max-w-xs mx-auto leading-relaxed">
                        <strong className="text-[var(--card-foreground)]">{formData.name}</strong> has been queued for verification. Our onboarding team will reach out to <strong className="text-blue-600 dark:text-cyan-300">{formData.official_email}</strong> within 24 hours.
                      </p>
                    </div>
                    <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                      <Link to="/institutions">
                        <Button size="sm" variant="outline" className="w-full text-[var(--card-foreground)] border-[var(--card-border)] hover:bg-[var(--nested-surface)]">
                          View Directory
                        </Button>
                      </Link>
                      <button
                        onClick={() => {
                          setFormSubmitted(false);
                          setFormData({
                            name: '',
                            type: 'Engineering College',
                            official_email: '',
                            contact_person: '',
                            state: 'Punjab',
                            city: 'Amritsar',
                          });
                        }}
                        className="text-xs text-blue-600 dark:text-cyan-300 hover:underline py-1"
                      >
                        Register Another
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleHeroRegisterSubmit} className="space-y-3">
                    {formError && (
                      <div className="p-2.5 rounded-lg bg-red-500/20 border border-red-500/40 text-red-600 dark:text-red-200 text-xs">
                        {formError}
                      </div>
                    )}

                    {/* Field 1: Institution Name */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-300">
                        <Landmark className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-inst-name"
                        type="text"
                        placeholder="Institution Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--input-background)] border border-[var(--card-border)] text-sm text-[var(--input-foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition backdrop-blur-sm"
                        required
                      />
                    </div>

                    {/* Field 2: Institution Type */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-300">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[var(--input-background)] border border-[var(--card-border)] text-sm text-[var(--input-foreground)] appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition cursor-pointer backdrop-blur-sm"
                      >
                        {institutionTypes.map((type) => (
                          <option key={type} value={type} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                            {type}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Field 3: Official Email */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-300">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        placeholder="Official Email"
                        value={formData.official_email}
                        onChange={(e) => setFormData({ ...formData, official_email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--input-background)] border border-[var(--card-border)] text-sm text-[var(--input-foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition backdrop-blur-sm"
                        required
                      />
                    </div>

                    {/* Field 4: Contact Person Name */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-300">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="Contact Person Name"
                        value={formData.contact_person}
                        onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--input-background)] border border-[var(--card-border)] text-sm text-[var(--input-foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition backdrop-blur-sm"
                      />
                    </div>

                    {/* Field 5 & 6: Nationwide State / UT & District Selector */}
                    <IndiaLocationSelector
                      selectedState={formData.state}
                      selectedCity={formData.city}
                      onStateChange={handleStateChange}
                      onCityChange={handleCityChange}
                      glassmorphism={true}
                    />

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full mt-1.5 py-3 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl shadow-[0_0_25px_rgba(37,99,235,0.5)] transition duration-200 flex items-center justify-center gap-2 text-sm transform hover:scale-[1.01]"
                    >
                      <span>Register Campus</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM TIER: EXACTLY 9 GLASSMORPHISM FEATURE CARDS */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 sm:pb-4 lg:pb-5 z-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
            {featureCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.title}
                  to={card.link}
                  className="rounded-2xl bg-[var(--card-background)] hover:bg-[var(--surface-background)] backdrop-blur-xl border border-[var(--card-border)] hover:border-cyan-400/60 p-2.5 sm:py-3 sm:px-2 text-center flex flex-col items-center justify-between transition-all duration-300 group shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] cursor-pointer transform hover:-translate-y-1 min-h-[90px]"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-1 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform filter drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="text-xs font-bold text-[var(--card-foreground)] group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors text-center leading-tight">
                    {card.title}
                  </div>
                  <div className="text-[10px] text-[var(--muted-foreground)] leading-tight mt-0.5 line-clamp-2 text-center font-normal">
                    {card.desc}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          END-TO-END GRIEVANCE WORKCYCLE (GLASSMORPHISM)
          ======================================================== */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">Verified Accountability</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--page-foreground)] mt-1">
            End-to-End Campus Complaint Lifecycle
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-2">
            No more lost registers or unverified repairs. CampusSaathi enforces visual proof at both problem submission and resolution completion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="relative bg-[var(--card-background)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--card-border)] hover:border-cyan-400/50 shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-cyan-600/40 dark:text-cyan-400/40 group-hover:text-cyan-600 dark:group-hover:text-cyan-400/70 transition-colors">
                    {s.num}
                  </span>
                  <div className="p-3 rounded-xl bg-blue-500/15 dark:bg-blue-500/20 border border-blue-400/30 text-blue-600 dark:text-cyan-400 group-hover:bg-cyan-500/25 transition-colors shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-[var(--card-foreground)] mb-1.5">{s.title}</h3>
                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          5 AUDIENCE BENEFITS (GLASSMORPHISM)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400">Tailored Portals</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--page-foreground)] mt-1">
            Built for Every Campus Stakeholder
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-2">
            Dedicated secure portals sharing the same unified design system and database.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {personas.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="bg-[var(--card-background)] backdrop-blur-xl rounded-2xl p-5 border border-[var(--card-border)] hover:border-blue-400/50 shadow-xl flex flex-col justify-between group transition-all"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 dark:bg-cyan-500/20 border border-blue-400/30 dark:border-cyan-400/30 text-blue-600 dark:text-cyan-300 flex items-center justify-center mb-4 shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-[var(--card-foreground)]">{p.title}</h3>
                  <div className="text-[11px] font-semibold text-blue-600 dark:text-cyan-400 mb-2">{p.role}</div>
                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          MULTI-INSTITUTION & SECURITY ARCHITECTURE (GLASSMORPHISM)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[var(--card-background)] backdrop-blur-2xl text-[var(--card-foreground)] rounded-3xl p-8 sm:p-12 border border-[var(--card-border)] shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 dark:bg-cyan-500/20 border border-blue-400/30 dark:border-cyan-400/30 text-blue-700 dark:text-cyan-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Institutional Data Protection
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--card-foreground)] tracking-tight">
                Enterprise Multi-College Privacy & Security Architecture
              </h2>
              <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
                CampusSaathi is built with multi-institution isolation at its core. Each college operates in its own protected space, ensuring student grievances, academic marks, attendance records, and faculty data remain strictly confidential.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-[var(--nested-surface)] border border-[var(--card-border)] text-xs">
                  <div className="font-semibold text-blue-600 dark:text-cyan-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" /> Strict Tenant Isolation
                  </div>
                  <div className="text-[11px] text-[var(--muted-foreground)] mt-1">Institutional records are isolated by verified college membership boundaries.</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--nested-surface)] border border-[var(--card-border)] text-xs">
                  <div className="font-semibold text-blue-600 dark:text-cyan-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Authorizations
                  </div>
                  <div className="text-[11px] text-[var(--muted-foreground)] mt-1">Parent linkages and staff provisioning require official PIN and admin approvals.</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[var(--nested-surface)] border border-[var(--card-border)] flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--card-foreground)]">Role-Based Access Control (RBAC)</h3>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                    Granular permissions across 8 distinct roles ensure students, teachers, wardens, and campus admins only access their authorized tools.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--nested-surface)] border border-[var(--card-border)] flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--card-foreground)]">DPDP Act 2023 & Privacy Compliance</h3>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                    Full alignment with Indian digital personal data regulations, including cookie preferences, explicit consent, and transparent grievance logging.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--nested-surface)] border border-[var(--card-border)] flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--card-foreground)]">Tamper-Evident Audit Logs</h3>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                    Critical operations, status changes, and administrative actions are logged with timestamps and actor credentials for institutional transparency.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          CALL TO ACTION (GLASSMORPHISM)
          ======================================================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-[var(--card-background)] backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-[var(--card-border)] shadow-2xl space-y-5 text-[var(--card-foreground)]">
          <h2 className="text-3xl font-extrabold text-[var(--card-foreground)]">
            Ready to Modernize Your Campus Management?
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] max-w-xl mx-auto">
            Start your college onboarding or explore our live multi-role sandbox demonstration today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link to="/app/student">
              <Button size="lg" variant="primary" className="bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.5)]" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Open Live Demo
              </Button>
            </Link>
            <Link to="/register-institution">
              <Button size="lg" variant="outline" className="text-[var(--card-foreground)] border-[var(--card-border)] hover:bg-[var(--nested-surface)]">
                Register Your College
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
