import React, { useState, useEffect } from 'react';
import { Bug, AlertTriangle, Send, CheckCircle2, Monitor, ShieldAlert, Paperclip } from 'lucide-react';
import { store } from '../../lib/store';
import { analytics } from '../../lib/analytics';
import { BugCategory, BugSeverity, BugReport } from '../../types';

export const BugReportPage: React.FC = () => {
  useEffect(() => {
    analytics.pageView('Report a Bug');
  }, []);

  const [reporterName, setReporterName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<BugCategory>('Visual / Styling Glitch');
  const [severity, setSeverity] = useState<BugSeverity>('Medium (Partial function blocked)');
  const [title, setTitle] = useState('');
  const [stepsToReproduce, setStepsToReproduce] = useState('');
  const [expectedBehavior, setExpectedBehavior] = useState('');
  const [actualBehavior, setActualBehavior] = useState('');
  const [browserInfo, setBrowserInfo] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [attachmentBase64, setAttachmentBase64] = useState<string | undefined>();
  const [honeypot, setHoneypot] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<BugReport | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-detect environment details
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const details = `${navigator.userAgent} | Screen: ${window.screen.width}x${window.screen.height} | URL: ${window.location.href}`;
      setBrowserInfo(details);
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Attachment size exceeds 5 MB limit.');
      return;
    }

    setErrorMessage('');
    setAttachmentName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setAttachmentBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (honeypot) {
      setErrorMessage('Automated submission detected.');
      return;
    }

    if (!reporterName.trim() || !email.trim() || !title.trim() || !stepsToReproduce.trim() || !actualBehavior.trim()) {
      setErrorMessage('Please fill in all mandatory bug report fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = store.submitBugReport({
        reporter_name: reporterName.trim(),
        email: email.trim(),
        category,
        severity,
        title: title.trim(),
        steps_to_reproduce: stepsToReproduce.trim(),
        expected_behavior: expectedBehavior.trim() || 'Expected feature to operate without error.',
        actual_behavior: actualBehavior.trim(),
        browser_info: browserInfo,
        attachment_name: attachmentName || undefined,
        attachment_url: attachmentBase64
      });

      if (res.success && res.report) {
        setSubmittedReport(res.report);
        analytics.formSubmit('bug_report', true);
        // Reset
        setTitle('');
        setStepsToReproduce('');
        setExpectedBehavior('');
        setActualBehavior('');
        setAttachmentName('');
        setAttachmentBase64(undefined);
      } else {
        setErrorMessage(res.error || 'Failed to record bug report.');
        analytics.formSubmit('bug_report', false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to record bug report.';
      setErrorMessage(msg);
      analytics.formSubmit('bug_report', false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs font-semibold uppercase tracking-wider">
            <Bug className="w-4 h-4" />
            Issue Tracker
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Report a Technical Bug
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Help us maintain a robust and bug-free campus management platform. Reports are reviewed by our platform engineering team.
          </p>
        </div>

        {/* Bug Report Form */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Bug Incident Details
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Provide reproducible steps so our engineering team can diagnose and patch the behavior.
            </p>
          </div>

          {submittedReport && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 font-semibold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Bug Report Logged Successfully!
              </div>
              <p className="text-xs">
                Reference ID: <strong className="font-mono bg-white dark:bg-emerald-900 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-700">{submittedReport.id}</strong>.
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                Our QA engineers have queued this report for triage and reproduction.
              </p>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="hp_bug">Leave empty</label>
              <input
                type="text"
                id="hp_bug"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reporter Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. priya@college.edu"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Bug Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as BugCategory)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Visual / Styling Glitch">Visual / Styling Glitch</option>
                  <option value="Attendance Calculation Error">Attendance Calculation Error</option>
                  <option value="Form Submission Failure">Form Submission Failure</option>
                  <option value="Authentication / Session Issue">Authentication / Session Issue</option>
                  <option value="Role Permission Discrepancy">Role Permission Discrepancy</option>
                  <option value="Performance / Slow Loading">Performance / Slow Loading</option>
                  <option value="Other Technical Issue">Other Technical Issue</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Severity Level <span className="text-red-500">*</span>
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as BugSeverity)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Low (Cosmetic)">Low (Cosmetic)</option>
                  <option value="Medium (Partial function blocked)">Medium (Partial function blocked)</option>
                  <option value="High (Core feature unusable)">High (Core feature unusable)</option>
                  <option value="Critical (Security / Data integrity)">Critical (Security / Data integrity)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Bug Summary / Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Student attendance card shows NaN% when total classes is 0"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Steps to Reproduce <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={stepsToReproduce}
                onChange={(e) => setStepsToReproduce(e.target.value)}
                placeholder="1. Navigate to Student Portal&#10;2. Click Attendance Tab&#10;3. Observe the calculation..."
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Expected Behavior
                </label>
                <textarea
                  rows={2}
                  value={expectedBehavior}
                  onChange={(e) => setExpectedBehavior(e.target.value)}
                  placeholder="Should display 0% with 'No classes logged yet' notice"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Actual Behavior <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={actualBehavior}
                  onChange={(e) => setActualBehavior(e.target.value)}
                  placeholder="Shows NaN% and red alert badge"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Environment / Browser Information (Auto-Captured)
              </label>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                <Monitor className="w-4 h-4 shrink-0 text-slate-500" />
                <span className="truncate">{browserInfo}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Screenshot / Attachment (Optional, max 5MB)
              </label>
              <input
                type="file"
                accept="image/*,.pdf,.log"
                onChange={handleFileUpload}
                className="block w-full text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 dark:file:bg-slate-800 dark:file:text-red-400 hover:file:bg-red-100 cursor-pointer"
              />
              {attachmentName && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
                  ✓ File ready: {attachmentName}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 text-xs font-semibold rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 shadow-md transition-all focus:ring-2 focus:ring-red-500"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Logging Bug...' : 'Submit Bug Report'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
