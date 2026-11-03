import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { campusStore } from '../../lib/store';
import { Complaint, PriorityLevel } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Select, Textarea } from '../../components/ui/Input';
import { CollegeBackground } from '../../components/common/CollegeBackground';
import {
  Hotel,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserCheck,
  Search,
  Filter,
  Layers,
  Wrench,
  ShieldAlert,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const WardenDashboard: React.FC = () => {
  const { user, institution } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Assignment Modal State
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [staffTarget, setStaffTarget] = useState('usr-maintenance');
  const [staffName, setStaffName] = useState('Ramesh Kumar (Electrical & Facility)');
  const [officialPriority, setOfficialPriority] = useState<PriorityLevel>('URGENT');
  const [instructions, setInstructions] = useState('');

  // Verification Modal State (Resolution Photo Review)
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [verifyComplaint, setVerifyComplaint] = useState<Complaint | null>(null);
  const [verifyDecision, setVerifyDecision] = useState<'RESOLVE' | 'REOPEN'>('RESOLVE');
  const [verifyNotes, setVerifyNotes] = useState('');

  useEffect(() => {
    const update = () => {
      setComplaints(campusStore.getComplaints(institution?.id));
    };
    update();
    return campusStore.subscribe(update);
  }, [institution]);

  const urgentQueue = complaints.filter(
    (c) => (c.official_priority === 'URGENT' || c.suggested_priority === 'URGENT') && c.status !== 'RESOLVED'
  );
  const awaitingVerificationQueue = complaints.filter((c) => c.status === 'AWAITING_VERIFICATION');

  const filtered = complaints.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.reference_no.toLowerCase().includes(search.toLowerCase()) ||
      c.building.toLowerCase().includes(search.toLowerCase()) ||
      c.student_name.toLowerCase().includes(search.toLowerCase());

    if (!matchSearch) return false;
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'URGENT') return c.official_priority === 'URGENT' && c.status !== 'RESOLVED';
    if (statusFilter === 'UNASSIGNED') return c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW';
    if (statusFilter === 'AWAITING') return c.status === 'AWAITING_VERIFICATION';
    if (statusFilter === 'RESOLVED') return c.status === 'RESOLVED';
    return true;
  });

  const handleOpenAssign = (cmp: Complaint) => {
    setSelectedComplaint(cmp);
    setOfficialPriority(cmp.suggested_priority || 'MEDIUM');
    setInstructions(`Repair and verify ${cmp.category} at ${cmp.building} (${cmp.room_number || 'Common area'})`);
    setAssignModalOpen(true);
  };

  const handleConfirmAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint || !user) return;

    campusStore.assignComplaint(
      selectedComplaint.id,
      staffTarget,
      staffName,
      officialPriority,
      instructions,
      user.full_name
    );
    setAssignModalOpen(false);
    setSelectedComplaint(null);
  };

  const handleOpenVerify = (cmp: Complaint) => {
    setVerifyComplaint(cmp);
    setVerifyDecision('RESOLVE');
    setVerifyNotes('Inspected photographic resolution proof and physical site. Work order completed to standard.');
    setVerifyModalOpen(true);
  };

  const handleConfirmVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyComplaint || !user) return;

    campusStore.verifyResolution(
      verifyComplaint.id,
      verifyDecision,
      user.full_name,
      verifyNotes
    );
    setVerifyModalOpen(false);
    setVerifyComplaint(null);
  };

  return (
    <div className="space-y-6">
      {/* Console Header Banner with Cinematic College Background */}
      <CollegeBackground
        variant="hero"
        overlayOpacity="medium"
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-xs font-semibold backdrop-blur-xs">
            <Hotel className="w-3.5 h-3.5" /> Hostel & Campus Warden Console
          </div>
          <h1 className="text-2xl font-extrabold mt-1 text-white drop-shadow-sm">
            Grievance Dispatch & Verification Center
          </h1>
          <p className="text-xs text-slate-200">
            Warden: <span className="font-semibold text-white">{user?.full_name}</span> • Bhagat Singh & Kalpana Chawla Hostels
          </p>
        </div>

        <div className="flex items-center gap-2">
          {awaitingVerificationQueue.length > 0 && (
            <div className="px-3.5 py-1.5 rounded-xl bg-teal-brand text-white text-xs font-bold flex items-center gap-2 animate-pulse shadow-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>{awaitingVerificationQueue.length} Proofs Ready for Verification</span>
            </div>
          )}
        </div>
      </CollegeBackground>

      {/* Metric Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Urgent Issues</p>
              <h3 className="text-2xl font-bold text-danger mt-1">{urgentQueue.length}</h3>
              <span className="text-[10px] text-danger font-semibold">Requires immediate dispatch</span>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 text-danger">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Awaiting Verification</p>
              <h3 className="text-2xl font-bold text-teal-brand mt-1">{awaitingVerificationQueue.length}</h3>
              <span className="text-[10px] text-teal-brand font-semibold">Proof uploaded by staff</span>
            </div>
            <div className="p-3 rounded-xl bg-teal-50 text-teal-brand">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">In Progress</p>
              <h3 className="text-2xl font-bold text-amber-600 mt-1">
                {complaints.filter((c) => c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED').length}
              </h3>
              <span className="text-[10px] text-muted font-semibold">Under maintenance repair</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
              <Wrench className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Hostel Occupancy</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">94.2%</h3>
              <span className="text-[10px] text-slate-500 font-semibold">612 / 650 beds allocated</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-100 text-slate-700">
              <Hotel className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reference, room, or student..."
            className="w-full pl-10 pr-4 py-2 bg-[var(--input-background)] text-[var(--input-foreground)] text-xs border border-[var(--card-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {['ALL', 'URGENT', 'UNASSIGNED', 'AWAITING', 'RESOLVED'].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === f ? 'bg-primary text-white shadow-xs' : 'bg-[var(--surface-background)] border border-[var(--card-border)] text-foreground hover:bg-[var(--nested-surface)]'
              }`}
            >
              {f === 'ALL' && 'All Grievances'}
              {f === 'URGENT' && '🚨 Urgent Queue'}
              {f === 'UNASSIGNED' && 'Unassigned'}
              {f === 'AWAITING' && 'Verification Queue'}
              {f === 'RESOLVED' && 'Resolved'}
            </button>
          ))}
        </div>
      </div>

      {/* Grievance Management Table / Cards */}
      <div className="space-y-4">
        {filtered.map((cmp) => (
          <Card
            key={cmp.id}
            className={`transition-all hover:shadow-card border ${
              cmp.official_priority === 'URGENT' && cmp.status !== 'RESOLVED'
                ? 'border-danger/40 bg-rose-50/20'
                : cmp.status === 'AWAITING_VERIFICATION'
                ? 'border-teal-brand/40 bg-teal-50/15'
                : 'border-slate-200'
            }`}
          >
            <CardContent className="p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {cmp.reference_no}
                  </span>
                  <StatusBadge status={cmp.status} />
                  <PriorityBadge priority={cmp.official_priority} />
                  <span className="text-xs font-medium text-slate-600">
                    Category: <strong className="text-foreground">{cmp.category}</strong>
                  </span>
                </div>

                <div className="text-xs text-muted">
                  Reported by: <span className="font-semibold text-foreground">{cmp.student_name}</span> ({cmp.student_roll})
                </div>
              </div>

              {/* Duplicate alert banner if detected */}
              {cmp.is_duplicate_of && (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Duplicate Clustered:</strong> Similar issue previously logged as <span className="font-mono font-bold">{cmp.is_duplicate_of}</span> at the same building location.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1">
                  <h3 className="text-sm font-bold text-foreground">{cmp.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{cmp.description}</p>
                  <div className="text-xs text-muted pt-2 flex flex-wrap items-center gap-4">
                    <span>📍 {cmp.building} {cmp.room_number ? `• Room ${cmp.room_number}` : ''}</span>
                    {cmp.assigned_staff_name && (
                      <span className="text-teal-brand font-medium">
                        Assigned: {cmp.assigned_staff_name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Evidence preview peek */}
                <div className="flex items-center gap-2 justify-end">
                  {cmp.problem_photo_url && (
                    <div className="text-center">
                      <span className="text-[10px] text-muted block mb-1">Problem Photo</span>
                      <img
                        src={cmp.problem_photo_url}
                        alt="Problem"
                        className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                      />
                    </div>
                  )}

                  {cmp.resolution_photo_url && (
                    <div className="text-center">
                      <span className="text-[10px] text-teal-brand font-bold block mb-1">Repair Proof</span>
                      <img
                        src={cmp.resolution_photo_url}
                        alt="Resolution"
                        className="w-16 h-16 object-cover rounded-lg border-2 border-teal-brand"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <div className="text-xs text-muted">
                  Last updated:{' '}
                  {new Date(cmp.updated_at).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>

                <div className="flex items-center gap-2">
                  {/* If Awaiting Verification -> Show Verification Button */}
                  {cmp.status === 'AWAITING_VERIFICATION' && (
                    <Button
                      size="sm"
                      variant="teal"
                      leftIcon={<CheckCircle2 className="w-4 h-4" />}
                      onClick={() => handleOpenVerify(cmp)}
                    >
                      Verify Resolution Proof
                    </Button>
                  )}

                  {/* If Unassigned or needs Reassignment */}
                  {(cmp.status === 'SUBMITTED' || cmp.status === 'UNDER_REVIEW' || cmp.status === 'REOPENED') && (
                    <Button
                      size="sm"
                      variant="primary"
                      leftIcon={<UserCheck className="w-4 h-4" />}
                      onClick={() => handleOpenAssign(cmp)}
                    >
                      Assign Technician
                    </Button>
                  )}

                  {cmp.status === 'ASSIGNED' && (
                    <Button
                      size="sm"
                      variant="outline"
                      leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                      onClick={() => handleOpenAssign(cmp)}
                    >
                      Reassign Work Order
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ASSIGNMENT MODAL */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title={`Assign Grievance ${selectedComplaint?.reference_no}`}
        description="Delegate maintenance task and dispatch instructions to authorized technician"
        maxWidth="lg"
      >
        <form onSubmit={handleConfirmAssign} className="space-y-4">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
            <div><span className="font-semibold">Issue:</span> {selectedComplaint?.title}</div>
            <div><span className="font-semibold">Location:</span> {selectedComplaint?.building} {selectedComplaint?.room_number || ''}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Assigned Technician"
              value={staffTarget}
              onChange={(e) => {
                setStaffTarget(e.target.value);
                setStaffName(
                  e.target.value === 'usr-maintenance'
                    ? 'Ramesh Kumar (Electrical & Facility)'
                    : 'Sunil Mehta (Plumbing & Sanitation)'
                );
              }}
              required
            >
              <option value="usr-maintenance">Ramesh Kumar (Senior Electrician & Facility)</option>
              <option value="usr-maintenance-2">Sunil Mehta (Plumbing & Sanitation Staff)</option>
              <option value="usr-mess">Chef Surinder Gill (Dining & Kitchen Staff)</option>
            </Select>

            <Select
              label="Official Confirmed Priority"
              value={officialPriority}
              onChange={(e) => setOfficialPriority(e.target.value as PriorityLevel)}
              required
            >
              <option value="LOW">Low (Cosmetic / routine repair)</option>
              <option value="MEDIUM">Medium (Normal hostel work)</option>
              <option value="HIGH">High (Urgent study/amenity impact)</option>
              <option value="URGENT">Urgent (Safety / Fire / Critical hazard)</option>
            </Select>
          </div>

          <Textarea
            label="Specific Instructions for Technician"
            rows={3}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Confirm & Dispatch Work Order
            </Button>
          </div>
        </form>
      </Modal>

      {/* RESOLUTION VERIFICATION MODAL */}
      <Modal
        isOpen={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
        title={`Verify Resolution Evidence: ${verifyComplaint?.reference_no}`}
        description="Inspect side-by-side photographic evidence submitted by technician before approving closure"
        maxWidth="2xl"
      >
        <form onSubmit={handleConfirmVerify} className="space-y-5">
          {/* Side-by-Side Photo Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Student Problem Photo */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-xs font-bold text-slate-700 block mb-2">
                Student Problem Photo
              </span>
              {verifyComplaint?.problem_photo_url ? (
                <img
                  src={verifyComplaint.problem_photo_url}
                  alt="Student problem"
                  className="w-full h-44 object-cover rounded-lg border border-slate-300"
                />
              ) : (
                <div className="h-44 rounded-lg bg-slate-200/50 flex items-center justify-center text-xs text-muted">
                  No original photo
                </div>
              )}
            </div>

            {/* Staff Resolution Photo Proof */}
            <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-200 text-center">
              <span className="text-xs font-bold text-teal-900 block mb-2 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-teal-brand" /> Staff Resolution Proof
              </span>
              {verifyComplaint?.resolution_photo_url ? (
                <img
                  src={verifyComplaint.resolution_photo_url}
                  alt="Staff proof"
                  className="w-full h-44 object-cover rounded-lg border-2 border-teal-brand shadow-sm"
                />
              ) : (
                <div className="h-44 rounded-lg bg-teal-100/50 flex items-center justify-center text-xs text-teal-800">
                  No proof photo uploaded
                </div>
              )}
            </div>
          </div>

          {verifyComplaint?.resolution_notes && (
            <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-700">
              <span className="font-semibold text-primary">Technician's Repair Log:</span>{' '}
              {verifyComplaint.resolution_notes}
            </div>
          )}

          {/* Verification Decision */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-foreground">Warden Inspection Verdict</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setVerifyDecision('RESOLVE')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  verifyDecision === 'RESOLVE'
                    ? 'bg-teal-brand text-white border-teal-brand shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Mark Resolved</span>
              </button>

              <button
                type="button"
                onClick={() => setVerifyDecision('REOPEN')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  verifyDecision === 'REOPEN'
                    ? 'bg-danger text-white border-danger shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reject & Request Rework</span>
              </button>
            </div>

            <Textarea
              label="Warden Verification Notes"
              rows={2}
              value={verifyNotes}
              onChange={(e) => setVerifyNotes(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setVerifyModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant={verifyDecision === 'RESOLVE' ? 'teal' : 'danger'}>
              {verifyDecision === 'RESOLVE' ? 'Confirm Resolution' : 'Reopen Grievance'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

