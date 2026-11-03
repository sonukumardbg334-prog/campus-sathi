import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { campusStore } from '../../lib/store';
import { Institution, AuditLog } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CollegeBackground } from '../../components/common/CollegeBackground';
import {
  ShieldAlert,
  Building,
  CheckCircle2,
  XCircle,
  FileText,
  Lock,
  Globe,
  Clock,
  Search,
  Image as ImageIcon,
  ExternalLink,
  Server,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export const SuperAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [activeTab, setActiveTab] = useState<'INSTITUTIONS' | 'AUDIT_LOGS' | 'ANALYTICS'>('INSTITUTIONS');
  const [previewInst, setPreviewInst] = useState<Institution | null>(null);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (location.pathname.includes('/institutions')) {
      setActiveTab('INSTITUTIONS');
    } else if (location.pathname.includes('/audit')) {
      setActiveTab('AUDIT_LOGS');
    }
  }, [location.pathname]);

  useEffect(() => {
    const update = () => {
      setInstitutions(campusStore.getInstitutions());
      setAuditLogs(campusStore.getAuditLogs());
    };
    update();
    return campusStore.subscribe(update);
  }, []);

  const handleApprove = (id: string) => {
    campusStore.updateInstitutionStatus(id, 'APPROVED');
    setActionMessage({ text: 'Institution application approved and tenant verification turned ON.', type: 'success' });
    setTimeout(() => setActionMessage(null), 3500);
  };

  const handleReject = (id: string) => {
    campusStore.updateInstitutionStatus(id, 'REJECTED');
    setActionMessage({ text: 'Institution application rejected.', type: 'success' });
    setTimeout(() => setActionMessage(null), 3500);
  };

  const handleToggleSuspend = (id: string, currentStatus: string) => {
    const next = currentStatus === 'SUSPENDED' ? 'APPROVED' : 'SUSPENDED';
    campusStore.updateInstitutionStatus(id, next);
    setActionMessage({ text: `Tenant status updated to ${next}.`, type: 'success' });
    setTimeout(() => setActionMessage(null), 3500);
  };

  const handleToggleVerification = (id: string, currentEnabled: boolean) => {
    const nextState = !currentEnabled;
    const res = campusStore.toggleInstitutionVerification(
      id,
      nextState,
      user?.role || 'platform_admin',
      user?.full_name || 'Dr. Rajesh Sharma (Platform Superadmin)'
    );

    if (res.success) {
      setActionMessage({ text: res.message, type: 'success' });
    } else {
      setActionMessage({ text: res.message, type: 'error' });
    }
    setTimeout(() => setActionMessage(null), 4000);
  };

  const pendingCount = institutions.filter((i) => i.status === 'PENDING_APPROVAL').length;
  const approvedCount = institutions.filter((i) => i.status === 'APPROVED').length;
  const verifiedCount = institutions.filter((i) => i.verification_enabled !== false && i.status === 'APPROVED').length;
  const unverifiedCount = institutions.length - verifiedCount;

  return (
    <div className="space-y-6">
      {/* Platform Super Administrator Hero Banner (Dedicated Platform Background, not single college) */}
      <CollegeBackground
        variant="platform"
        overlayOpacity="platform"
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-cyan-300 text-xs font-semibold backdrop-blur-xs">
            <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" /> Platform Super Administrator
          </div>
          <h1 className="text-2xl font-extrabold mt-1 text-white drop-shadow-sm">
            CampusSaathi Multi-Tenant Master Control
          </h1>
          <p className="text-xs text-slate-300">
            Platform Master: <span className="font-semibold text-white">{user?.full_name}</span> • Zero-Trust Database Orchestrator
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-white/10 text-xs font-semibold text-white backdrop-blur-xs border border-white/15">
            {approvedCount} Active Campuses
          </div>
          {pendingCount > 0 && (
            <div className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-bold animate-pulse shadow-sm">
              {pendingCount} Pending Applications
            </div>
          )}
        </div>
      </CollegeBackground>

      {/* Real-time Status / Audit Feedback Banner */}
      {actionMessage && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-2 shadow-lg animate-fade-in ${
            actionMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <span className="font-medium">{actionMessage.text}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            className="text-xs hover:opacity-75 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--card-border)] pb-2">
        <button
          onClick={() => setActiveTab('INSTITUTIONS')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'INSTITUTIONS'
              ? 'bg-primary text-white shadow-xs'
              : 'text-[var(--muted-foreground)] hover:text-[var(--page-foreground)] hover:bg-slate-100 dark:hover:bg-white/10'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Application Tenants & Verification</span>
          {pendingCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('AUDIT_LOGS')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'AUDIT_LOGS'
              ? 'bg-primary text-white shadow-xs'
              : 'text-[var(--muted-foreground)] hover:text-[var(--page-foreground)] hover:bg-slate-100 dark:hover:bg-white/10'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Security Audit Log Trail</span>
        </button>

        <button
          onClick={() => setActiveTab('ANALYTICS')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'ANALYTICS'
              ? 'bg-primary text-white shadow-xs'
              : 'text-[var(--muted-foreground)] hover:text-[var(--page-foreground)] hover:bg-slate-100 dark:hover:bg-white/10'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>Platform Multi-Tenant Health</span>
        </button>
      </div>

      {activeTab === 'INSTITUTIONS' && (
        <Card className="shadow-card border-[var(--card-border)] bg-[var(--card-background)] text-[var(--card-foreground)]">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-500 dark:text-cyan-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Application Tenant Controls
                  </span>
                </div>
                <CardTitle className="text-base sm:text-lg mt-0.5">
                  Institutional Tenants & Verification Management
                </CardTitle>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Manage tenant schema provisioning and toggle institution verification ON or OFF with PostgreSQL audit logging.
                </p>
              </div>

              {/* Verification Summary Badges */}
              <div className="flex items-center gap-2 text-xs">
                <div className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{verifiedCount} Verified (ON)</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-200/80 dark:bg-slate-800 border border-slate-300 dark:border-white/15 text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>{unverifiedCount} Unverified (OFF)</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100/80 dark:bg-slate-900/80 text-[var(--page-foreground)] font-semibold border-b border-[var(--card-border)]">
                  <tr>
                    <th className="p-4">Campus & Visual Branding</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Official Email</th>
                    <th className="p-4 text-center">Verification Toggle</th>
                    <th className="p-4 text-center">Tenant Status</th>
                    <th className="p-4 text-right">Administrative Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--card-border)]">
                  {institutions.map((inst) => {
                    const hasCustomBg = inst.background_images && inst.background_images.length > 0;
                    const isVerified = inst.verification_enabled !== false && inst.status === 'APPROVED';

                    return (
                      <tr key={inst.id} className="hover:bg-slate-100/50 dark:hover:bg-white/[0.03] transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-10 rounded-lg overflow-hidden bg-slate-950 border border-[var(--card-border)] shrink-0">
                              <img
                                src={hasCustomBg ? inst.background_images![0] : '/assets/khalsa-college-bg.jpg'}
                                alt={inst.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-bold text-[var(--page-foreground)]">{inst.name}</div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="font-mono text-cyan-600 dark:text-cyan-400 font-semibold text-[11px]">
                                  {inst.code}
                                </span>
                                {hasCustomBg && (
                                  <span className="text-[10px] text-teal-700 dark:text-teal-300 font-medium bg-teal-500/10 px-1.5 py-0.2 rounded border border-teal-500/20">
                                    Custom Theme
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-[var(--muted-foreground)]">{inst.type}</td>
                        <td className="p-4 text-[var(--muted-foreground)]">{inst.city}, {inst.state}</td>
                        <td className="p-4 text-[var(--muted-foreground)] font-mono text-[11px]">{inst.official_email}</td>

                        {/* APPLICATION TENANT VERIFICATION ON/OFF TOGGLE */}
                        <td className="p-4 text-center">
                          <div className="flex flex-col items-center gap-1.5">
                            <button
                              type="button"
                              role="switch"
                              aria-checked={isVerified}
                              onClick={() => handleToggleVerification(inst.id, isVerified)}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                                isVerified
                                  ? 'bg-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                                  : 'bg-slate-300 dark:bg-slate-700'
                              }`}
                              title={`Toggle Verification for ${inst.name} (Currently ${isVerified ? 'ON' : 'OFF'})`}
                            >
                              <span className="sr-only">Toggle verification for {inst.name}</span>
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                                  isVerified ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              >
                                {isVerified ? (
                                  <span className="text-[10px] font-black text-emerald-600">✓</span>
                                ) : (
                                  <span className="text-[10px] font-black text-slate-400">✕</span>
                                )}
                              </span>
                            </button>

                            <span
                              className={`text-[11px] font-bold tracking-tight ${
                                isVerified
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              {isVerified ? 'ON (Verified)' : 'OFF (Unverified)'}
                            </span>
                          </div>
                        </td>

                        <td className="p-4 text-center">
                          <Badge
                            variant={
                              inst.status === 'APPROVED'
                                ? 'success'
                                : inst.status === 'PENDING_APPROVAL'
                                ? 'warning'
                                : 'danger'
                            }
                          >
                            {inst.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            {inst.status === 'PENDING_APPROVAL' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="teal"
                                  leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                                  onClick={() => handleApprove(inst.id)}
                                >
                                  Approve Campus
                                </Button>
                                <Button
                                  size="sm"
                                  variant="danger"
                                  leftIcon={<XCircle className="w-3.5 h-3.5" />}
                                  onClick={() => handleReject(inst.id)}
                                >
                                  Reject
                                </Button>
                              </>
                            )}

                            {inst.status === 'APPROVED' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleToggleSuspend(inst.id, inst.status)}
                              >
                                Suspend
                              </Button>
                            )}

                            {inst.status === 'SUSPENDED' && (
                              <Button
                                size="sm"
                                variant="teal"
                                onClick={() => handleToggleSuspend(inst.id, inst.status)}
                              >
                                Reactivate
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'AUDIT_LOGS' && (
        <Card className="shadow-card border-[var(--card-border)] bg-[var(--card-background)] text-[var(--card-foreground)]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Immutable Security Audit Trail</CardTitle>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Record of all privileged administrative events, tenant status changes, and schema interactions.
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/70 dark:bg-slate-800 text-[var(--page-foreground)] text-xs font-mono border border-[var(--card-border)]">
                <Lock className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" /> Hash-Chained Log Ledger
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100/80 dark:bg-slate-900/80 text-[var(--page-foreground)] font-semibold border-b border-[var(--card-border)]">
                  <tr>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Actor & Role</th>
                    <th className="p-3">Action Type</th>
                    <th className="p-3">Resource</th>
                    <th className="p-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--card-border)] font-mono text-[11px]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-100/50 dark:hover:bg-white/[0.03] transition-colors">
                      <td className="p-3 text-[var(--muted-foreground)] whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="p-3 font-semibold text-[var(--page-foreground)]">
                        {log.actor_name} ({log.actor_role})
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-700 dark:text-cyan-300 font-bold border border-blue-500/30">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3 text-[var(--page-foreground)]">{log.resource_type}</td>
                      <td className="p-3 text-[var(--page-foreground)]">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'ANALYTICS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-card border-[var(--card-border)] bg-[var(--card-background)] text-[var(--card-foreground)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">PostgreSQL Row-Level Policies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-[var(--muted-foreground)]">
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-center justify-between font-semibold">
                <span>Kernel Tenant Check</span>
                <span className="font-bold">ACTIVE (100%)</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Database engine validates <code className="text-cyan-600 dark:text-cyan-400 font-mono">current_user_institution()</code> on every SELECT, INSERT, UPDATE, and DELETE statement.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card border-[var(--card-border)] bg-[var(--card-background)] text-[var(--card-foreground)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Storage Bucket Isolation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-[var(--muted-foreground)]">
              <div className="p-3 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-800 dark:text-blue-300 flex items-center justify-between font-semibold">
                <span>Buckets Configured</span>
                <span className="font-bold">4 Dedicated</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Complaint and resolution evidence stored in private buckets with time-limited signed URL retrieval.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card border-[var(--card-border)] bg-[var(--card-background)] text-[var(--card-foreground)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Affiliated Higher-Ed Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-[var(--muted-foreground)]">
              <div className="p-3 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-800 dark:text-purple-300 flex items-center justify-between font-semibold">
                <span>Active Campuses</span>
                <span className="font-bold">{approvedCount} Colleges</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Seamless multi-college operations without inter-tenant data leaks or credential sharing.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
