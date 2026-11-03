import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Phone, MessageSquare, LifeBuoy, Send, CheckCircle2, AlertTriangle, 
  HelpCircle, MessageSquarePlus, Bug, Search, FileText, ArrowRight, Shield
} from 'lucide-react';
import { store } from '../../lib/store';
import { analytics } from '../../lib/analytics';
import { SupportCategory, SupportTicket } from '../../types';

export const SupportPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'contact';
  const [activeTab, setActiveTab] = useState<'contact' | 'lookup' | 'faq'>(
    initialTab === 'lookup' ? 'lookup' : 'contact'
  );

  useEffect(() => {
    analytics.pageView('Help and Support');
  }, []);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [category, setCategory] = useState<SupportCategory>('General Inquiries');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [attachmentBase64, setAttachmentBase64] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<SupportTicket | null>(null);
  const [formError, setFormError] = useState('');

  // Lookup state
  const [searchQuery, setSearchQuery] = useState('');
  const [lookupResults, setLookupResults] = useState<SupportTicket[]>([]);
  const [searched, setSearched] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFormError('Attachment file size must not exceed 5 MB.');
      return;
    }

    setFormError('');
    setAttachmentName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      setAttachmentBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Honeypot spam protection
    if (honeypot) {
      setFormError('Spam submission detected.');
      return;
    }

    if (!fullName.trim() || !email.trim() || !subject.trim() || !description.trim()) {
      setFormError('Please fill in all mandatory fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = store.submitSupportTicket({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        college_name: collegeName.trim() || undefined,
        category,
        subject: subject.trim(),
        description: description.trim(),
        attachment_name: attachmentName || undefined,
        attachment_url: attachmentBase64
      });

      if (res.success && res.ticket) {
        setSubmittedTicket(res.ticket);
        analytics.formSubmit('support_ticket', true);
        // Reset form fields
        setFullName('');
        setEmail('');
        setPhone('');
        setCollegeName('');
        setSubject('');
        setDescription('');
        setAttachmentName('');
        setAttachmentBase64(undefined);
      } else {
        setFormError(res.error || 'Failed to submit support ticket.');
        analytics.formSubmit('support_ticket', false);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to submit support ticket.';
      setFormError(message);
      analytics.formSubmit('support_ticket', false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setLookupResults([]);
      return;
    }

    const all: SupportTicket[] = store.getSupportTickets();
    const matches = all.filter(
      (t: SupportTicket) =>
        t.id.toLowerCase() === q ||
        t.email.toLowerCase() === q ||
        (t.full_name || t.name).toLowerCase().includes(q)
    );
    setLookupResults(matches);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Top Banner / Hero */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider">
            <LifeBuoy className="w-4 h-4" />
            Support Center
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How can we help you today?
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Get instant assistance, track open requests, report technical glitches, or connect with our support specialists.
          </p>
        </div>

        {/* Official Direct Contact Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm">
              <Shield className="w-3.5 h-3.5" />
              Verified Official Channels
            </div>
            <h2 className="text-xl font-bold">CampusSaathi Direct Support Desk</h2>
            <p className="text-xs text-blue-100">
              Direct telephone and WhatsApp lines for college onboarding, attendance locks, and emergency assistance.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              href="tel:6203025057"
              onClick={() => analytics.ctaClick('support_phone_call', 'support_hero')}
              className="px-4 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold flex items-center gap-2 shadow-md transition-all focus:ring-2 focus:ring-white"
            >
              <Phone className="w-4 h-4 text-blue-600" />
              Call: 6203025057
            </a>
            <a
              href="https://wa.me/916203025057"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => analytics.ctaClick('support_whatsapp', 'support_hero')}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all focus:ring-2 focus:ring-emerald-300"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp: +91 6203025057
            </a>
          </div>
        </div>

        {/* Quick Links / Sub-actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/feedback"
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500 hover:shadow-md transition-all flex items-center gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <MessageSquarePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                Submit Feedback
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Share suggestions or praise</p>
            </div>
          </Link>

          <Link
            to="/report-bug"
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-red-500 hover:shadow-md transition-all flex items-center gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
              <Bug className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-red-600 transition-colors">
                Report a Technical Bug
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Submit UI or data glitches</p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setActiveTab('lookup')}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500 hover:shadow-md transition-all flex items-center gap-3.5 group text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                My Support Requests
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Track ticket status by ID</p>
            </div>
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'contact'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Open Support Ticket
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('lookup')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'lookup'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Lookup My Tickets
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('faq')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'faq'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Frequently Asked Questions
          </button>
        </div>

        {/* Active Tab View */}
        {activeTab === 'contact' && (
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Submit a Support Request
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Each ticket receives a verified reference ID (e.g., CS-SUP-2026-XXXX) for tracking.
              </p>
            </div>

            {submittedTicket && (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2 animate-in fade-in">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Support Ticket Submitted Successfully!
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  Your ticket reference is{' '}
                  <strong className="font-mono bg-white dark:bg-emerald-900 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-700">
                    {submittedTicket.id}
                  </strong>
                  . You can track updates under "Lookup My Tickets" using this ID.
                </p>
              </div>
            )}

            {formError && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot field (hidden from real users) */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="hp_sup">Leave this blank</label>
                <input
                  type="text"
                  id="hp_sup"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Ramesh Kumar / Ananya Sen"
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
                    placeholder="institutional or personal email"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone / Mobile (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 9876543210"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Affiliated Institution / College (Optional)
                  </label>
                  <input
                    type="text"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder="e.g. KCET Amritsar / ABC Institute"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SupportCategory)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Attendance Issues">Attendance Issues</option>
                    <option value="Account & Login">Account & Login</option>
                    <option value="Marks & Results">Marks & Results</option>
                    <option value="College Registration">College Registration</option>
                    <option value="Hostel & Mess">Hostel & Mess</option>
                    <option value="General Inquiries">General Inquiries</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief summary of issue"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide all context, class section, date of attendance discrepancy, or error message observed..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Attachment (Optional, max 5MB - Screenshot, Circular, or PDF)
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 dark:file:bg-slate-800 dark:file:text-blue-400 hover:file:bg-blue-100 cursor-pointer"
                />
                {attachmentName && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
                    ✓ Attached: {attachmentName}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white flex items-center gap-2 shadow-md transition-all focus:ring-2 focus:ring-blue-500"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Submitting...' : 'Submit Support Ticket'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab: Lookup */}
        {activeTab === 'lookup' && (
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Lookup Support Requests
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Search by Ticket ID (e.g. CS-SUP-2026-001) or by your registered email address.
              </p>
            </div>

            <form onSubmit={handleLookup} className="flex gap-2">
              <input
                type="text"
                required
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Ticket ID (CS-SUP-...) or Email"
                className="flex-1 px-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 shadow-sm"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </form>

            {searched && (
              <div className="space-y-3 pt-2">
                {lookupResults.length === 0 ? (
                  <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      No tickets found matching "{searchQuery}".
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Check your Ticket ID spelling or try submitting a new inquiry.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Results ({lookupResults.length})
                    </h3>
                    {lookupResults.map((t) => (
                      <div
                        key={t.id}
                        className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                              {t.id}
                            </span>
                            <span className="text-xs font-medium text-slate-500">
                              • {new Date(t.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              t.status === 'Resolved'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : t.status === 'In Progress'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                            }`}
                          >
                            {t.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                          {t.subject}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          {t.description || t.message}
                        </p>
                        {t.admin_notes && (
                          <div className="mt-2 p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-200">
                            <strong>Support Team Response:</strong> {t.admin_notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab: FAQ */}
        {activeTab === 'faq' && (
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Common inquiries regarding platform access, attendance calculations, and verification.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  How does the 75% attendance rule work in CampusSaathi?
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  CampusSaathi computes live percentage metrics for every subject. If your attendance falls below 75%, an alert badge appears on your student dashboard, indicating you may be debarred from end-semester examinations unless approved by the dean.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  How do colleges verify their institution on the platform?
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Registered colleges submit their affiliation details. Platform Super Administrators verify the institution's official credentials and activate the "Verified Tenant" toggle in the Administrative console.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Can parents access student records directly?
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Yes, but only through an authorized association process requiring the student roll number, an institutional offline PIN, and college administrator authorization.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
