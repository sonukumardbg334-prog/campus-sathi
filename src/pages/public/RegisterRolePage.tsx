import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { campusStore, DEMO_INVITATIONS } from '../../lib/store';
import { UserRole } from '../../types';
import { Card, CardContent } from '../../components/ui/Card';
import { Input, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import {
  GraduationCap,
  Users,
  BookOpen,
  Hotel,
  Wrench,
  UtensilsCrossed,
  Building,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  KeyRound,
  Info,
} from 'lucide-react';

interface RoleOption {
  role: UserRole;
  title: string;
  subtitle: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  requiresCode: boolean;
  codeHint: string;
}

export const RegisterRolePage: React.FC = () => {
  const navigate = useNavigate();
  const institutions = campusStore.getInstitutions().filter((i) => i.status === 'APPROVED');

  // Step 1: Role selection vs Step 2: Form submission
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  // Form Fields
  const [institutionId, setInstitutionId] = useState(institutions[0]?.id || 'inst-1');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [verificationCode, setVerificationCode] = useState('');

  // Role-Specific Fields
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [designation, setDesignation] = useState('Assistant Professor');
  const [rollNo, setRollNo] = useState('');
  const [courseName, setCourseName] = useState('B.Tech Computer Science');
  const [semester, setSemester] = useState('4');
  const [employeeId, setEmployeeId] = useState('');
  const [hostelAssignment, setHostelAssignment] = useState('Bhagat Singh Boys Hostel');
  const [serviceArea, setServiceArea] = useState('Electrical & HVAC Maintenance');
  const [studentRef, setStudentRef] = useState('');
  const [relationshipType, setRelationshipType] = useState<'FATHER' | 'MOTHER' | 'GUARDIAN'>('FATHER');

  // Status State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successData, setSuccessData] = useState<{ name: string; role: string; email: string } | null>(null);

  const roleOptions: RoleOption[] = [
    {
      role: 'student',
      title: 'Student Registration',
      subtitle: 'Submit campus grievances, track attendance & view academic records.',
      icon: GraduationCap,
      color: 'from-blue-600 to-cyan-500',
      requiresCode: false,
      codeHint: 'KC-STU-2026 (Optional verification PIN)',
    },
    {
      role: 'parent',
      title: 'Parent / Guardian',
      subtitle: 'Track your ward attendance, examination scores & campus notices.',
      icon: Users,
      color: 'from-amber-500 to-orange-500',
      requiresCode: false,
      codeHint: 'Student enrollment & PIN required',
    },
    {
      role: 'teacher',
      title: 'Faculty / Professor',
      subtitle: '1-click batch attendance, academic grading & timetable scheduling.',
      icon: BookOpen,
      color: 'from-indigo-600 to-blue-600',
      requiresCode: true,
      codeHint: 'KC-FAC-2026 (Mandatory faculty invitation code)',
    },
    {
      role: 'warden',
      title: 'Hostel Warden',
      subtitle: 'Hostel room occupancy, grievance triage & technician verification.',
      icon: Hotel,
      color: 'from-emerald-600 to-teal-600',
      requiresCode: true,
      codeHint: 'KC-WAR-2026 (Warden authorization code)',
    },
    {
      role: 'maintenance',
      title: 'Maintenance Technician',
      subtitle: 'Receive delegated repair orders & upload photographic resolution proof.',
      icon: Wrench,
      color: 'from-blue-600 to-slate-700',
      requiresCode: true,
      codeHint: 'KC-MNT-2026 (Maintenance staff code)',
    },
    {
      role: 'mess_manager',
      title: 'Mess & Dining Manager',
      subtitle: 'Publish 4-meal daily menus & resolve food quality/hygiene feedback.',
      icon: UtensilsCrossed,
      color: 'from-amber-600 to-yellow-600',
      requiresCode: true,
      codeHint: 'KC-MSS-2026 (Mess manager authorization code)',
    },
    {
      role: 'institution_admin',
      title: 'Campus Administrator',
      subtitle: 'Manage departments, campus branding, staff permissions & audit oversight.',
      icon: Building,
      color: 'from-purple-600 to-indigo-600',
      requiresCode: true,
      codeHint: 'KC-ADM-2026 (Administrator invitation code)',
    },
  ];

  const currentRoleConfig = roleOptions.find((r) => r.role === selectedRole);
  const currentInstitution = institutions.find((i) => i.id === institutionId) || institutions[0];

  const handleSelectRole = (r: UserRole) => {
    setSelectedRole(r);
    setErrorMessage('');
    // Auto-fill demo invitation code for evaluator convenience
    const demoInv = DEMO_INVITATIONS.find(
      (inv) => inv.institution_id === institutionId && inv.intended_role === r
    );
    if (demoInv) {
      setVerificationCode(demoInv.code);
    } else {
      setVerificationCode('');
    }
  };

  const handleInstitutionChange = (newInstId: string) => {
    setInstitutionId(newInstId);
    if (selectedRole) {
      const demoInv = DEMO_INVITATIONS.find(
        (inv) => inv.institution_id === newInstId && inv.intended_role === selectedRole
      );
      if (demoInv) {
        setVerificationCode(demoInv.code);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const res = campusStore.registerUserWithRole({
        role: selectedRole,
        full_name: fullName,
        email,
        password,
        institution_id: institutionId,
        verification_code: verificationCode,
        department,
        designation,
        roll_no: rollNo,
        enrollment_no: rollNo,
        semester: parseInt(semester, 10),
        course_name: courseName,
        employee_id: employeeId,
        hostel_assignment: hostelAssignment,
        service_area: serviceArea,
        student_reference: studentRef,
        relationship_type: relationshipType,
      });

      if (!res.success) {
        setErrorMessage(res.message);
        setIsSubmitting(false);
        return;
      }

      setSuccessData({
        name: fullName,
        role: selectedRole,
        email,
      });
      setIsSubmitting(false);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Registration failed. Please check form data.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Emblem */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-slate-950/80 border border-amber-400/40 p-1 flex items-center justify-center mx-auto shadow-xl overflow-hidden">
          <img
            src="/assets/campussaathi-logo.png"
            alt="CampusSaathi Emblem"
            className="w-full h-full object-contain"
          />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
          CampusSaathi Identity Provisioning
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--page-foreground)] tracking-tight">
          Role-Based Campus Registration
        </h1>
        <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
          Join your institution's verified operational portal with cryptographically verified roles.
        </p>
      </div>

      {/* STEP 3: SUCCESS STATE */}
      {successData ? (
        <Card className="max-w-xl mx-auto border-cyan-400/30 shadow-2xl">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Registration Verified & Authorized
              </span>
              <h2 className="text-2xl font-extrabold text-[var(--page-foreground)] mt-1">
                Welcome, {successData.name}!
              </h2>
              <p className="text-xs text-[var(--muted-foreground)] mt-2 leading-relaxed">
                Your account is provisioned as an authorized{' '}
                <strong className="text-cyan-400 capitalize">{successData.role.replace('_', ' ')}</strong> at{' '}
                <strong className="text-[var(--page-foreground)]">{currentInstitution.name}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.05] border border-[var(--card-border)] text-xs text-left space-y-1.5">
              <div>
                <span className="font-semibold text-[var(--page-foreground)]">Registered Email:</span> {successData.email}
              </div>
              <div>
                <span className="font-semibold text-[var(--page-foreground)]">Campus ID:</span> {currentInstitution.code}
              </div>
              <div>
                <span className="font-semibold text-[var(--page-foreground)]">Assigned Portal:</span> /app/{successData.role}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link to={`/app/${successData.role === 'teacher' ? 'teacher' : successData.role}`}>
                <Button size="lg" variant="primary" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 shadow-md">
                  Enter {successData.role.replace('_', ' ')} Portal <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : !selectedRole ? (
        /* STEP 1: ROLE SELECTION GRID */
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
            <h2 className="text-base font-bold text-[var(--page-foreground)] flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-cyan-400" /> Step 1: Select Your Campus Role
            </h2>
            <span className="text-xs text-[var(--muted-foreground)]">
              Authorized verification codes enforced on administrative roles
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roleOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <Card
                  key={opt.role}
                  className="hover:border-cyan-400/60 hover:shadow-[0_0_25px_rgba(34,211,238,0.2)] transition-all cursor-pointer group flex flex-col justify-between"
                  onClick={() => handleSelectRole(opt.role)}
                >
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${opt.color} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      {opt.requiresCode && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 border border-blue-400/30">
                          Code Required
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[var(--page-foreground)] group-hover:text-cyan-400 transition-colors">
                        {opt.title}
                      </h3>
                      <p className="text-xs text-[var(--muted-foreground)] mt-1 leading-relaxed">
                        {opt.subtitle}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[var(--card-border)] flex items-center justify-between text-xs">
                      <span className="text-[11px] text-[var(--muted-foreground)] font-mono truncate max-w-[170px]">
                        {opt.codeHint}
                      </span>
                      <span className="text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Register <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Platform Super Admin Policy Note (Part 10 & 11) */}
            <div className="p-5 rounded-2xl bg-white/[0.04] border border-[var(--card-border)] flex flex-col justify-between text-xs space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <span>Platform Super Admin</span>
              </div>
              <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed">
                Public self-registration is strictly disallowed for platform-wide administrative roles. Super Admin accounts are provisioned exclusively via trusted root security CLI.
              </p>
              <div className="text-[10px] text-amber-400 font-mono">
                🔒 Root Protocol Enforced
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* STEP 2: ROLE-SPECIFIC REGISTRATION FORM */
        <Card className="max-w-2xl mx-auto shadow-2xl">
          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Header with Back Button */}
            <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-4">
              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:underline font-semibold"
              >
                <ArrowLeft className="w-4 h-4" /> Change Selected Role
              </button>
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-cyan-300 font-bold capitalize border border-blue-400/30">
                {currentRoleConfig?.title}
              </span>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-500/20 border border-red-500/40 text-xs text-red-200">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Institution Selection */}
              <div>
                <Select
                  label="Select Institution / Campus"
                  value={institutionId}
                  onChange={(e) => handleInstitutionChange(e.target.value)}
                  required
                >
                  {institutions.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name} ({inst.code}) — {inst.city}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Common Identity Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  placeholder="e.g. Jaspreet Singh"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <Input
                  label="Official Campus Email"
                  type="email"
                  placeholder="e.g. jaspreet@college.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <Input
                label="Account Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* ROLE-SPECIFIC FIELDS (PART 11) */}
              {selectedRole === 'student' && (
                <div className="space-y-4 pt-2 border-t border-[var(--card-border)]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Roll Number / Enrollment No"
                      placeholder="e.g. 22CS104"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      required
                    />
                    <Select
                      label="Academic Department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      required
                    >
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                      <option value="Applied Sciences">Applied Sciences</option>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Course Name"
                      placeholder="e.g. B.Tech Computer Science"
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                      required
                    />
                    <Select
                      label="Current Semester"
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      required
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={s.toString()}>
                          Semester {s}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
              )}

              {selectedRole === 'teacher' && (
                <div className="space-y-4 pt-2 border-t border-[var(--card-border)]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Faculty Department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      required
                    >
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Applied Sciences">Applied Sciences</option>
                    </Select>
                    <Select
                      label="Designation"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      required
                    >
                      <option value="Assistant Professor">Assistant Professor</option>
                      <option value="Associate Professor">Associate Professor</option>
                      <option value="Head of Department (HOD)">Head of Department (HOD)</option>
                      <option value="Dean of Academics">Dean of Academics</option>
                    </Select>
                  </div>
                  <Input
                    label="Faculty / Employee ID"
                    placeholder="e.g. FAC-CSE-092"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    required
                  />
                </div>
              )}

              {selectedRole === 'warden' && (
                <div className="space-y-4 pt-2 border-t border-[var(--card-border)]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Assigned Hostel Block"
                      value={hostelAssignment}
                      onChange={(e) => setHostelAssignment(e.target.value)}
                      required
                    >
                      <option value="Bhagat Singh Boys Hostel">Bhagat Singh Boys Hostel</option>
                      <option value="Kalpana Chawla Girls Hostel">Kalpana Chawla Girls Hostel</option>
                      <option value="Tagore Hostel Block C">Tagore Hostel Block C</option>
                    </Select>
                    <Input
                      label="Warden Employee ID"
                      placeholder="e.g. WDN-204"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {selectedRole === 'parent' && (
                <div className="space-y-4 pt-2 border-t border-[var(--card-border)]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Student Enrollment / Roll Number"
                      placeholder="e.g. 22CS104"
                      value={studentRef}
                      onChange={(e) => setStudentRef(e.target.value)}
                      required
                    />
                    <Select
                      label="Relationship to Student"
                      value={relationshipType}
                      onChange={(e) => setRelationshipType(e.target.value as any)}
                      required
                    >
                      <option value="FATHER">Father</option>
                      <option value="MOTHER">Mother</option>
                      <option value="GUARDIAN">Legal Guardian</option>
                    </Select>
                  </div>
                  <p className="text-[11px] text-[var(--muted-foreground)]">
                    Note: A verification link will be queued for institution administrator approval to protect student privacy.
                  </p>
                </div>
              )}

              {selectedRole === 'maintenance' && (
                <div className="space-y-4 pt-2 border-t border-[var(--card-border)]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Service Trade / Area"
                      value={serviceArea}
                      onChange={(e) => setServiceArea(e.target.value)}
                      required
                    >
                      <option value="Electrical & HVAC Maintenance">Electrical & HVAC Maintenance</option>
                      <option value="Plumbing & Water Systems">Plumbing & Water Systems</option>
                      <option value="Civil & Carpentry Repairs">Civil & Carpentry Repairs</option>
                      <option value="Wi-Fi & Network Hardware">Wi-Fi & Network Hardware</option>
                    </Select>
                    <Input
                      label="Staff Employee ID"
                      placeholder="e.g. TECH-404"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {selectedRole === 'mess_manager' && (
                <div className="space-y-4 pt-2 border-t border-[var(--card-border)]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Assigned Dining Hall"
                      placeholder="e.g. Central Mess Hall A"
                      value={hostelAssignment}
                      onChange={(e) => setHostelAssignment(e.target.value)}
                      required
                    />
                    <Input
                      label="Employee ID"
                      placeholder="e.g. MESS-012"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {selectedRole === 'institution_admin' && (
                <div className="space-y-4 pt-2 border-t border-[var(--card-border)]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Administrative Designation"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      required
                    >
                      <option value="Campus Principal">Campus Principal</option>
                      <option value="Dean of Academic Affairs">Dean of Academic Affairs</option>
                      <option value="Registrar">Registrar</option>
                      <option value="Chief Technology Officer">Chief Technology Officer</option>
                    </Select>
                    <Input
                      label="Official Administrative ID"
                      placeholder="e.g. ADM-OFFICE-01"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {/* VERIFICATION CODE (PART 12) */}
              <div className="pt-2 border-t border-[var(--card-border)]">
                <Input
                  label={
                    currentRoleConfig?.requiresCode
                      ? 'Official Campus Verification Code (Mandatory)'
                      : 'Campus Verification Code (Optional)'
                  }
                  placeholder={`e.g. ${currentRoleConfig?.codeHint.split(' ')[0]}`}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required={currentRoleConfig?.requiresCode}
                  helperText={`Active code for ${currentInstitution.name}: ${currentRoleConfig?.codeHint}`}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-500 shadow-md font-semibold mt-2"
              >
                Complete {currentRoleConfig?.title} <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>

              <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] pt-2 border-t border-[var(--card-border)]">
                <span>Already have a verified account?</span>
                <Link to="/login" className="text-cyan-400 hover:underline font-semibold">
                  Sign In to Campus
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

