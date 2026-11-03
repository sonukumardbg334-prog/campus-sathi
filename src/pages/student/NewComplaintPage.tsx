import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { campusStore, suggestComplaintMetadata } from '../../lib/store';
import { PriorityLevel } from '../../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { PhotoUpload } from '../../components/ui/PhotoUpload';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Camera,
  ArrowLeft,
  Building,
  Info,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CATEGORIES = [
  'Electrical',
  'Fan or lighting',
  'Classroom equipment',
  'Furniture',
  'Hostel maintenance',
  'Washroom cleanliness',
  'Water supply',
  'Drinking water',
  'Internet and Wi-Fi',
  'Mess food quality',
  'Mess hygiene',
  'Security',
  'Library',
  'Laboratory',
  'General campus issue',
  'Other',
];

export const NewComplaintPage: React.FC = () => {
  const { user, institution } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General campus issue');
  const [building, setBuilding] = useState('Kalpana Chawla Girls Hostel');
  const [block, setBlock] = useState('Block A');
  const [floor, setFloor] = useState('2nd Floor');
  const [roomNumber, setRoomNumber] = useState('A-204');
  const [suggestedPriority, setSuggestedPriority] = useState<PriorityLevel>('MEDIUM');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);

  const [aiSuggestion, setAiSuggestion] = useState<{
    category: string;
    priority: PriorityLevel;
    reason: string;
  } | null>(null);

  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  // Smart Classifier Effect: Runs as user enters title or description
  useEffect(() => {
    if (title.length > 3 || description.length > 5) {
      const result = suggestComplaintMetadata(title, description);
      setAiSuggestion({
        category: result.suggestedCategory,
        priority: result.suggestedPriority,
        reason: result.reason,
      });
    } else {
      setAiSuggestion(null);
    }
  }, [title, description]);

  // Duplicate Check Effect
  useEffect(() => {
    if (institution && category && building) {
      const dupe = campusStore.checkForDuplicates({
        institution_id: institution.id,
        category,
        building,
        floor,
      });
      if (dupe) {
        setDuplicateWarning(
          `Notice: An active complaint (${dupe.reference_no} - "${dupe.title}") already exists in ${building} ${floor || ''}. Submitting will link your grievance to ensure coordinated resolution.`
        );
      } else {
        setDuplicateWarning(null);
      }
    }
  }, [institution, category, building, floor]);

  const applyAiSuggestion = () => {
    if (aiSuggestion) {
      setCategory(aiSuggestion.category);
      setSuggestedPriority(aiSuggestion.priority);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !user) return;

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    const newComplaint = campusStore.submitComplaint({
      institution_id: institution?.id || 'inst-1',
      student: user,
      category,
      title: title.trim(),
      description: description.trim(),
      building,
      block,
      floor,
      room_number: roomNumber,
      suggested_priority: suggestedPriority,
      problem_photo_url: photoUrl,
    });

    setIsSubmitting(false);
    setSubmittedRef(newComplaint.reference_no);

    // Launch celebratory confetti for successful registration
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // safe fallback
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb / Back button */}
      <button
        onClick={() => navigate('/app/student')}
        className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Student Dashboard
      </button>

      {submittedRef ? (
        <Card className="border-teal-brand/30 shadow-card">
          <CardContent className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-teal-50 text-teal-brand rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-brand">Grievance Registered</span>
              <h2 className="text-2xl font-bold text-foreground mt-1">
                Reference ID: <span className="font-mono text-primary">{submittedRef}</span>
              </h2>
              <p className="text-xs text-muted mt-2 max-w-md mx-auto">
                Your complaint has entered the warden and maintenance dispatch queue with status{' '}
                <span className="font-semibold text-secondary">SUBMITTED</span>.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <Button
                variant="primary"
                onClick={() => navigate('/app/student/complaints')}
              >
                Track Grievance Status
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSubmittedRef(null);
                  setTitle('');
                  setDescription('');
                  setPhotoUrl(undefined);
                }}
              >
                Submit Another Issue
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-2 text-teal-brand text-xs font-semibold uppercase tracking-wider">
              <Camera className="w-4 h-4" /> Official Campus Grievance Desk
            </div>
            <CardTitle className="text-xl font-bold">Lodge a Problem or Repair Request</CardTitle>
            <CardDescription>
              Submit issues regarding electrical, hostel amenities, plumbing, Wi-Fi, or classroom infrastructure with photograph proof.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <Input
                label="Issue Title"
                placeholder="e.g. Ceiling fan sparking & grinding noise in Room A-204"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              {/* Description */}
              <Textarea
                label="Detailed Description"
                placeholder="Describe the exact problem, when it started, and any immediate hazard..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />

              {/* Smart AI / Rule-based Classifier Suggestion Box */}
              {aiSuggestion && (
                <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200/80 flex items-start justify-between gap-3 animate-fade-in">
                  <div className="flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-teal-brand shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <div className="font-semibold text-teal-900 flex items-center gap-2">
                        <span>Smart Classifier Suggestion:</span>
                        <span className="bg-white px-2 py-0.5 rounded border border-teal-200 font-mono text-[11px] text-teal-800">
                          {aiSuggestion.category}
                        </span>
                        <span className="bg-white px-2 py-0.5 rounded border border-teal-200 font-mono text-[11px] text-teal-800">
                          {aiSuggestion.priority} Priority
                        </span>
                      </div>
                      <p className="text-teal-700 mt-1 text-[11px] leading-relaxed">
                        {aiSuggestion.reason}
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    variant="teal"
                    onClick={applyAiSuggestion}
                    className="shrink-0 text-xs py-1 px-2.5"
                  >
                    Apply Suggestion
                  </Button>
                </div>
              )}

              {/* Duplicate Warning */}
              {duplicateWarning && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{duplicateWarning}</span>
                </div>
              )}

              {/* Category & Priority Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Select>

                <Select
                  label="Suggested Priority"
                  value={suggestedPriority}
                  onChange={(e) => setSuggestedPriority(e.target.value as PriorityLevel)}
                  required
                >
                  <option value="LOW">Low (Minor cosmetic issue)</option>
                  <option value="MEDIUM">Medium (Normal repair)</option>
                  <option value="HIGH">High (Disrupts classes or studying)</option>
                  <option value="URGENT">Urgent (Safety or fire hazard / major outage)</option>
                </Select>
              </div>

              {/* Location Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <Input
                  label="Building / Hostel"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  required
                />
                <Input
                  label="Block / Wing"
                  placeholder="e.g. Block A"
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                />
                <Input
                  label="Floor"
                  placeholder="e.g. 2nd Floor"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                />
                <Input
                  label="Room / Lab No."
                  placeholder="e.g. A-204"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                />
              </div>

              {/* Photo Evidence Upload */}
              <div className="pt-2 border-t border-slate-100">
                <PhotoUpload
                  label="Problem Photograph Evidence"
                  helperText="Attach a clear photo of the damaged fixture, leakage, or hardware (PNG, JPG up to 5MB)"
                  value={photoUrl}
                  onChange={setPhotoUrl}
                  captureMode={true}
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-3">
                <Button
                  type="submit"
                  size="lg"
                  variant="primary"
                  className="w-full"
                  isLoading={isSubmitting}
                >
                  Submit Official Grievance
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

