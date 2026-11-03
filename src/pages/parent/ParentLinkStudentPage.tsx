import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { campusStore } from '../../lib/store';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Input, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Users, ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';

export const ParentLinkStudentPage: React.FC = () => {
  const { user, institution } = useAuth();
  const navigate = useNavigate();

  const [studentEnrollment, setStudentEnrollment] = useState('KCET/2023/BTECH/042');
  const [studentName, setStudentName] = useState('Sonu Kumar');
  const [verificationPin, setVerificationPin] = useState('8492');
  const [relationship, setRelationship] = useState<'FATHER' | 'MOTHER' | 'GUARDIAN'>('FATHER');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !studentEnrollment || !verificationPin) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    campusStore.submitParentLinkRequest({
      parent: user,
      institution_id: institution?.id || 'inst-1',
      student_enrollment_no: studentEnrollment.trim(),
      student_name: studentName.trim(),
      verification_pin: verificationPin.trim(),
      relationship_type: relationship,
    });

    setLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/app/parent')}
        className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Parent Console
      </button>

      {isSubmitted ? (
        <Card className="border-teal-brand/30 shadow-card">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-teal-50 text-teal-brand rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Link Request Dispatched</h2>
            <p className="text-xs text-muted max-w-md mx-auto">
              Your link request for student <span className="font-semibold text-foreground">{studentName}</span> has been logged with status <span className="font-semibold text-amber-600">PENDING APPROVAL</span>.
            </p>
            <div className="p-3 bg-[var(--nested-surface)] rounded-xl text-xs text-muted border border-[var(--card-border)]">
              Institution administrators will verify your relationship PIN before access to marks and attendance is granted.
            </div>
            <div className="pt-2">
              <Button variant="primary" onClick={() => navigate('/app/parent')}>
                Return to Parent Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-2 text-teal-brand text-xs font-semibold uppercase tracking-wider">
              <Users className="w-4 h-4" /> Secure Guardian Authorization
            </div>
            <CardTitle className="text-xl font-bold">Link Student to Parent Account</CardTitle>
            <CardDescription>
              To protect student privacy and prevent unauthorized roll number lookups, linking requires the official college enrollment ID and verification PIN.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Student Full Name"
                placeholder="e.g. Sonu Kumar"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
              />

              <Input
                label="Official University Enrollment Number"
                placeholder="e.g. KCET/2023/BTECH/042"
                value={studentEnrollment}
                onChange={(e) => setStudentEnrollment(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Relationship to Student"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value as any)}
                  required
                >
                  <option value="FATHER">Father</option>
                  <option value="MOTHER">Mother</option>
                  <option value="GUARDIAN">Legal Guardian</option>
                </Select>

                <Input
                  label="Offline Verification PIN"
                  placeholder="e.g. 8492"
                  value={verificationPin}
                  onChange={(e) => setVerificationPin(e.target.value)}
                  helperText="Issued on student admission slip"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-[var(--nested-surface)] border border-[var(--card-border)] text-xs text-muted flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-brand shrink-0 mt-0.5" />
                <span>
                  <strong>Anti-Enumeration Guard:</strong> Public search by roll number is disabled. Requests require verification by the Dean of Student Welfare.
                </span>
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={loading}>
                Submit Link Request for Approval
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

