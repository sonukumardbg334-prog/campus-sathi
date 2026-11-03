import React, { useEffect, useState } from 'react';
import { Phone, MessageSquare, Shield, Send, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { store } from '../../lib/store';
import { analytics } from '../../lib/analytics';
import { Link } from 'react-router-dom';

export const ContactPage: React.FC = () => {
  useEffect(() => {
    analytics.pageView('Contact Us');
  }, []);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (honeypot) {
      setError('Spam submission detected.');
      return;
    }

    if (!fullName.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = store.submitSupportTicket({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        category: 'General Inquiries',
        subject: subject.trim(),
        description: message.trim()
      });

      if (res.success && res.id) {
        setSubmitted(res.id);
        analytics.formSubmit('contact_inquiry', true);
        setFullName('');
        setEmail('');
        setPhone('');
        setSubject('');
        setMessage('');
      } else {
        setError(res.error || 'Failed to submit inquiry.');
        analytics.formSubmit('contact_inquiry', false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error submitting message.';
      setError(msg);
      analytics.formSubmit('contact_inquiry', false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-[var(--page-foreground)]">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
          Official Support & Assistance
        </span>
        <h1 className="text-3xl font-extrabold text-[var(--page-foreground)] mt-1">
          Contact CampusSaathi
        </h1>
        <p className="text-xs text-[var(--muted-foreground)] mt-1">
          Reach our platform support team directly for campus onboarding, technical inquiries, or assistance.
        </p>
      </div>

      {/* Official Verified Contact Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/10 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200">Official Voice Desk</span>
              <h3 className="text-lg font-bold">CampusSaathi Direct Helpline</h3>
            </div>
          </div>
          <p className="text-xs text-blue-100 leading-relaxed">
            Direct telephonic support for college administrators, deans, teachers, and student queries.
          </p>
          <div className="pt-1">
            <a
              href="tel:18002004567"
              onClick={() => analytics.ctaClick('contact_call_now', 'contact_page')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-800 hover:bg-blue-50 font-bold text-sm shadow-md transition-all focus:ring-2 focus:ring-white"
            >
              <Phone className="w-4 h-4 text-blue-600" />
              Call 1800 200 4567 (Toll Free)
            </a>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xl shadow-emerald-500/10 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-200">Instant Messaging</span>
              <h3 className="text-lg font-bold">CampusSaathi WhatsApp Desk</h3>
            </div>
          </div>
          <p className="text-xs text-emerald-100 leading-relaxed">
            Message our verified WhatsApp channel for quick technical questions, onboarding walk-throughs, or screenshots.
          </p>
          <div className="pt-1">
            <a
              href="https://wa.me/917488330835"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => analytics.ctaClick('contact_whatsapp_now', 'contact_page')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-sm shadow-md transition-all focus:ring-2 focus:ring-white"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              WhatsApp +91 74883 30835
            </a>
          </div>
        </div>
      </div>

      {/* Online Message Form */}
      <Card className="bg-[var(--card-background)] backdrop-blur-xl border border-[var(--card-border)] text-[var(--card-foreground)] shadow-xl">
        <CardContent className="p-6 sm:p-8 space-y-5">
          <div>
            <h3 className="text-lg font-bold text-[var(--card-foreground)]">
              Send an Instant Online Inquiry
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              Your inquiry will be logged directly into our support ticketing system.
            </p>
          </div>

          {submitted && (
            <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 space-y-1.5 animate-in fade-in">
              <div className="flex items-center gap-2 font-semibold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Message received successfully!
              </div>
              <p className="text-xs">
                Your ticket tracking ID is <span className="font-mono font-bold">{submitted}</span>.
              </p>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="hidden" aria-hidden="true">
              <label htmlFor="hp_cnt">Leave blank</label>
              <input
                type="text"
                id="hp_cnt"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--page-foreground)] mb-1">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[var(--input-background)] border border-[var(--input-border)] text-[var(--input-foreground)] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--page-foreground)] mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul@example.com"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[var(--input-background)] border border-[var(--input-border)] text-[var(--input-foreground)] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--page-foreground)] mb-1">
                  Mobile / Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[var(--input-background)] border border-[var(--input-border)] text-[var(--input-foreground)] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--page-foreground)] mb-1">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Inquiry reason"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[var(--input-background)] border border-[var(--input-border)] text-[var(--input-foreground)] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--page-foreground)] mb-1">
                Your Message <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can our support engineering team assist you?"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[var(--input-background)] border border-[var(--input-border)] text-[var(--input-foreground)] focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 shadow-md transition-all focus:ring-2 focus:ring-blue-500"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Sending...' : 'Send Inquiry'}
              </button>

              <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
                <Link to="/support" className="text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-medium">
                  Support Center <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span>•</span>
                <Link to="/report-bug" className="text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 font-medium">
                  Report Bug
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
