import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { campusStore } from '../../lib/store';
import { Complaint, ComplaintStatus } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  User,
  Wrench,
  ShieldCheck,
  PlusCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const STATUS_STEPS: { status: ComplaintStatus; label: string }[] = [
  { status: 'SUBMITTED', label: 'Submitted' },
  { status: 'ASSIGNED', label: 'Assigned' },
  { status: 'IN_PROGRESS', label: 'In Progress' },
  { status: 'AWAITING_VERIFICATION', label: 'Verification' },
  { status: 'RESOLVED', label: 'Resolved' },
];

export const ComplaintTrackerPage: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'RESOLVED'>('ALL');

  useEffect(() => {
    const update = () => {
      setComplaints(campusStore.getComplaints().filter((c) => c.student_name === user?.full_name || c.student_id === 'stu-101'));
    };
    update();
    return campusStore.subscribe(update);
  }, [user]);

  const filtered = complaints.filter((c) => {
    if (filter === 'ACTIVE') return c.status !== 'RESOLVED' && c.status !== 'CANCELLED';
    if (filter === 'RESOLVED') return c.status === 'RESOLVED';
    return true;
  });

  const getStepIndex = (status: ComplaintStatus) => {
    switch (status) {
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
        return 0;
      case 'ASSIGNED':
        return 1;
      case 'IN_PROGRESS':
        return 2;
      case 'AWAITING_VERIFICATION':
        return 3;
      case 'RESOLVED':
        return 4;
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-brand">Live Grievance Hub</span>
          <h1 className="text-2xl font-extrabold text-foreground mt-1">My Reported Complaints</h1>
          <p className="text-xs text-muted">
            Track status progression, maintenance assignments, and photographic resolution evidence.
          </p>
        </div>

        <Link to="/app/student/new-complaint">
          <Button variant="primary" leftIcon={<PlusCircle className="w-4 h-4" />}>
            Report New Grievance
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'ALL' ? 'bg-primary text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Complaints ({complaints.length})
        </button>
        <button
          onClick={() => setFilter('ACTIVE')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'ACTIVE' ? 'bg-primary text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Active / In Progress ({complaints.filter((c) => c.status !== 'RESOLVED').length})
        </button>
        <button
          onClick={() => setFilter('RESOLVED')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'RESOLVED' ? 'bg-primary text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Resolved ({complaints.filter((c) => c.status === 'RESOLVED').length})
        </button>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-muted text-xs">
              No grievances found in this filter category.
            </CardContent>
          </Card>
        ) : (
          filtered.map((cmp) => {
            const isExpanded = expandedId === cmp.id;
            const currentStep = getStepIndex(cmp.status);

            return (
              <Card key={cmp.id} className="overflow-hidden border border-slate-200/90 shadow-soft">
                <div
                  className="p-5 cursor-pointer hover:bg-slate-50/50 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : cmp.id)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                        {cmp.reference_no}
                      </span>
                      <StatusBadge status={cmp.status} />
                      <PriorityBadge priority={cmp.official_priority} />
                      <span className="text-xs text-slate-500 font-medium ml-1">
                        • {cmp.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted">
                        {new Date(cmp.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  <div className="mt-3">
                    <h3 className="text-sm font-bold text-foreground">{cmp.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-1">{cmp.description}</p>
                  </div>

                  {/* Horizontal Progress Stepper */}
                  <div className="mt-4 pt-4 border-t border-slate-100 hidden sm:block">
                    <div className="flex items-center justify-between relative">
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
                      {STATUS_STEPS.map((step, idx) => {
                        const isDone = idx <= currentStep;
                        const isCurrent = idx === currentStep;
                        return (
                          <div key={step.status} className="relative z-10 flex flex-col items-center">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                                isDone
                                  ? 'bg-teal-brand text-white ring-4 ring-teal-50'
                                  : 'bg-white border-2 border-slate-300 text-slate-400'
                              } ${isCurrent ? 'scale-110 ring-4 ring-teal-200' : ''}`}
                            >
                              {idx + 1}
                            </div>
                            <span
                              className={`text-[10px] mt-1 font-semibold ${
                                isDone ? 'text-teal-900' : 'text-slate-400'
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="bg-slate-50/70 border-t border-slate-200 p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left: Location & Assignment Info */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                          Location & Assignment
                        </h4>
                        <div className="p-4 rounded-xl bg-white border border-slate-200/80 text-xs space-y-2">
                          <div>
                            <span className="text-muted">Building:</span>{' '}
                            <span className="font-semibold text-foreground">{cmp.building}</span>
                          </div>
                          {cmp.block && (
                            <div>
                              <span className="text-muted">Block / Floor:</span>{' '}
                              <span className="font-semibold text-foreground">
                                {cmp.block} ({cmp.floor || 'N/A'})
                              </span>
                            </div>
                          )}
                          {cmp.room_number && (
                            <div>
                              <span className="text-muted">Room Number:</span>{' '}
                              <span className="font-semibold text-foreground">{cmp.room_number}</span>
                            </div>
                          )}
                          <div className="pt-2 border-t border-slate-100">
                            <span className="text-muted">Assigned Technician:</span>{' '}
                            <span className="font-semibold text-teal-brand">
                              {cmp.assigned_staff_name || 'Pending assignment by Warden'}
                            </span>
                          </div>
                          {cmp.verified_warden_name && (
                            <div>
                              <span className="text-muted">Verified By Warden:</span>{' '}
                              <span className="font-semibold text-primary">
                                {cmp.verified_warden_name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Problem & Resolution Photos */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                          Visual Evidence
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          {/* Problem Photo */}
                          <div className="rounded-xl border border-slate-200 bg-white p-2 text-center">
                            <p className="text-[11px] font-semibold text-muted mb-1.5">
                              Problem Evidence
                            </p>
                            {cmp.problem_photo_url ? (
                              <img
                                src={cmp.problem_photo_url}
                                alt="Problem proof"
                                className="w-full h-28 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="h-28 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                                No photo attached
                              </div>
                            )}
                          </div>

                          {/* Resolution Photo */}
                          <div className="rounded-xl border border-slate-200 bg-white p-2 text-center">
                            <p className="text-[11px] font-semibold text-muted mb-1.5">
                              Resolution Proof
                            </p>
                            {cmp.resolution_photo_url ? (
                              <img
                                src={cmp.resolution_photo_url}
                                alt="Resolution proof"
                                className="w-full h-28 object-cover rounded-lg border border-teal-200"
                              />
                            ) : (
                              <div className="h-28 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                                Pending repair
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline History */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
                        Activity & Status Timeline
                      </h4>
                      <div className="space-y-2">
                        {cmp.status_history.map((entry) => (
                          <div
                            key={entry.id}
                            className="p-3 bg-white rounded-xl border border-slate-200/70 text-xs flex items-start gap-3"
                          >
                            <div className="p-1.5 bg-primary/5 text-primary rounded-lg shrink-0 mt-0.5">
                              <Clock className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-foreground">
                                  {entry.new_status}
                                </span>
                                <span className="text-[10px] text-muted">
                                  {new Date(entry.timestamp).toLocaleTimeString('en-IN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-600 mt-0.5">
                                <span className="font-medium text-slate-800">{entry.changed_by_name}:</span>{' '}
                                {entry.comment || 'Status updated'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

