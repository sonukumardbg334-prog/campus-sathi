import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { campusStore } from '../../lib/store';
import { Complaint } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Input';
import { PhotoUpload } from '../../components/ui/PhotoUpload';
import { CollegeBackground } from '../../components/common/CollegeBackground';
import {
  Wrench,
  CheckCircle2,
  Clock,
  Camera,
  Play,
  UploadCloud,
  MapPin,
  AlertCircle,
} from 'lucide-react';

export const MaintenanceDashboard: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Complaint[]>([]);

  // Resolution Submission Modal
  const [activeTask, setActiveTask] = useState<Complaint | null>(null);
  const [resolutionModalOpen, setResolutionModalOpen] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolutionPhoto, setResolutionPhoto] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const update = () => {
      // Show complaints assigned to maintenance staff or matching user id
      const all = campusStore.getComplaints();
      const myWork = all.filter(
        (c) =>
          c.assigned_to_staff_id === user?.id ||
          c.assigned_staff_name?.includes('Ramesh') ||
          c.assigned_to_staff_id === 'usr-maintenance'
      );
      setTasks(myWork);
    };
    update();
    return campusStore.subscribe(update);
  }, [user]);

  const handleStartWork = (cmp: Complaint) => {
    if (!user) return;
    campusStore.updateWorkOrder(
      cmp.id,
      'IN_PROGRESS',
      'Technician arrived on site and commenced repairs.',
      undefined,
      user.full_name
    );
  };

  const handleOpenResolutionModal = (cmp: Complaint) => {
    setActiveTask(cmp);
    setResolutionNotes('Completed hardware replacement and tested operation.');
    setResolutionPhoto(undefined);
    setResolutionModalOpen(true);
  };

  const handleSubmitResolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask || !user || !resolutionNotes.trim()) return;

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    // If no custom photo uploaded, provide a realistic clean repair proof photo
    const finalPhoto =
      resolutionPhoto ||
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80';

    campusStore.updateWorkOrder(
      activeTask.id,
      'AWAITING_VERIFICATION',
      resolutionNotes,
      finalPhoto,
      user.full_name
    );

    setIsSubmitting(false);
    setResolutionModalOpen(false);
    setActiveTask(null);
  };

  const pendingTasks = tasks.filter((t) => t.status !== 'RESOLVED');
  const completedTasks = tasks.filter((t) => t.status === 'RESOLVED');

  return (
    <div className="space-y-6">
      <CollegeBackground
        variant="hero"
        overlayOpacity="medium"
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-xs font-semibold backdrop-blur-xs">
            <Wrench className="w-3.5 h-3.5" /> Maintenance & Facility Work Orders
          </div>
          <h1 className="text-2xl font-extrabold mt-1 text-white drop-shadow-sm">
            Assigned Work Order Queue
          </h1>
          <p className="text-xs text-slate-200">
            Technician: <span className="font-semibold text-white">{user?.full_name}</span> • Electrical, HVAC & Facility Maintenance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-white/10 text-xs font-semibold text-white backdrop-blur-xs border border-white/15">
            {pendingTasks.length} Active Jobs
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-teal-brand text-xs font-bold text-white shadow-sm">
            {completedTasks.length} Verified Complete
          </div>
        </div>
      </CollegeBackground>

      {/* Task Queue Cards */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
          Active Assigned Orders ({pendingTasks.length})
        </h2>

        {pendingTasks.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted text-xs">
              All assigned work orders are resolved! Great work.
            </CardContent>
          </Card>
        ) : (
          pendingTasks.map((task) => (
            <Card key={task.id} className="border border-slate-200/90 shadow-soft">
              <CardContent className="p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded">
                      {task.reference_no}
                    </span>
                    <StatusBadge status={task.status} />
                    <PriorityBadge priority={task.official_priority} />
                    <span className="text-xs text-slate-600 font-medium">
                      Category: <strong>{task.category}</strong>
                    </span>
                  </div>

                  <span className="text-xs text-muted flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {task.building} {task.room_number ? `• Room ${task.room_number}` : ''}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <h3 className="text-sm font-bold text-foreground">{task.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{task.description}</p>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                      <span className="font-semibold text-primary">Student Reporter:</span> {task.student_name} ({task.student_roll})
                    </div>
                  </div>

                  {/* Problem Photo inspection */}
                  <div>
                    <span className="text-[11px] font-bold text-muted block mb-1.5">
                      Problem Photo from Student:
                    </span>
                    {task.problem_photo_url ? (
                      <img
                        src={task.problem_photo_url}
                        alt="Problem proof"
                        className="w-full h-32 object-cover rounded-xl border border-slate-200 shadow-xs"
                      />
                    ) : (
                      <div className="h-32 rounded-xl bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                        No photo provided
                      </div>
                    )}
                  </div>
                </div>

                {/* Work Order Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="text-xs text-muted">
                    {task.status === 'ASSIGNED' && 'Waiting for technician to begin work'}
                    {task.status === 'IN_PROGRESS' && 'Repair work is currently in progress'}
                    {task.status === 'AWAITING_VERIFICATION' && 'Resolution proof submitted • Awaiting Warden sign-off'}
                  </div>

                  <div className="flex items-center gap-2">
                    {task.status === 'ASSIGNED' && (
                      <Button
                        size="sm"
                        variant="primary"
                        leftIcon={<Play className="w-4 h-4" />}
                        onClick={() => handleStartWork(task)}
                      >
                        Start Work Order
                      </Button>
                    )}

                    {(task.status === 'IN_PROGRESS' || task.status === 'ASSIGNED') && (
                      <Button
                        size="sm"
                        variant="teal"
                        leftIcon={<Camera className="w-4 h-4" />}
                        onClick={() => handleOpenResolutionModal(task)}
                      >
                        Upload Resolution Proof & Complete
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* RESOLUTION PHOTO SUBMISSION MODAL */}
      <Modal
        isOpen={resolutionModalOpen}
        onClose={() => setResolutionModalOpen(false)}
        title={`Complete Work Order: ${activeTask?.reference_no}`}
        description="Provide resolution notes and attach photographic proof of completed repair"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmitResolution} className="space-y-4">
          <Textarea
            label="Resolution Notes & Work Summary"
            placeholder="Explain what parts were replaced or repaired (e.g. replaced burnt capacitor, rewired socket, verified motor spin)..."
            rows={3}
            value={resolutionNotes}
            onChange={(e) => setResolutionNotes(e.target.value)}
            required
          />

          <PhotoUpload
            label="Resolution Photograph Evidence"
            helperText="Capture or upload photo of the repaired fixture (PNG, JPG up to 5MB)"
            value={resolutionPhoto}
            onChange={setResolutionPhoto}
            captureMode={true}
          />

          <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 text-xs text-teal-800">
            ✓ Submitting will transition grievance status to <strong>AWAITING_VERIFICATION</strong> and alert Warden Col. Balwinder Singh to inspect proof.
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setResolutionModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="teal" isLoading={isSubmitting}>
              Submit for Verification
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

