import React, { useState, useEffect } from 'react';
import { Star, MessageSquarePlus, Send, CheckCircle2, AlertTriangle, UserCheck, Heart } from 'lucide-react';
import { store } from '../../lib/store';
import { analytics } from '../../lib/analytics';
import { FeedbackCategory, UserFeedback, UserRole } from '../../types';

export const FeedbackPage: React.FC = () => {
  useEffect(() => {
    analytics.pageView('Submit Feedback');
  }, []);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [category, setCategory] = useState<FeedbackCategory>('User Experience (UI/UX)');
  const [comment, setComment] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedFeedback, setSubmittedFeedback] = useState<UserFeedback | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [feedbacks, setFeedbacks] = useState<UserFeedback[]>([]);

  useEffect(() => {
    setFeedbacks(store.getFeedbacks());
  }, [submittedFeedback]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (honeypot) {
      setErrorMessage('Spam submission detected.');
      return;
    }

    if (!fullName.trim() || !email.trim() || !comment.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = store.submitFeedback({
        full_name: fullName.trim(),
        email: email.trim(),
        role,
        rating,
        category,
        comment: comment.trim()
      });

      if (res.success && res.feedback) {
        setSubmittedFeedback(res.feedback);
        analytics.formSubmit('user_feedback', true);
        // Reset fields
        setFullName('');
        setEmail('');
        setComment('');
        setRating(5);
      } else {
        setErrorMessage(res.error || 'Failed to submit feedback.');
        analytics.formSubmit('user_feedback', false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit feedback.';
      setErrorMessage(msg);
      analytics.formSubmit('user_feedback', false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Top Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <MessageSquarePlus className="w-4 h-4" />
            Product Feedback
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Share Your CampusSaathi Experience
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Your feedback directly guides our engineering roadmap, UI improvements, and feature updates.
          </p>
        </div>

        {/* Feedback Form Card */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Tell Us What You Think
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Rate your experience and let us know what features could make campus management easier.
            </p>
          </div>

          {submittedFeedback && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 space-y-1 animate-in fade-in">
              <div className="flex items-center gap-2 font-semibold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Thank you for your valuable feedback!
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                Logged with reference ID <span className="font-mono font-bold">{submittedFeedback.id}</span>.
              </p>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Honeypot */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="hp_fb">Ignore</label>
              <input
                type="text"
                id="hp_fb"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            {/* Star Rating Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Overall Experience Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 rounded-lg hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-amber-400"
                    aria-label={`${star} Stars`}
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        (hoverRating || rating) >= star
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 ml-2">
                  {rating === 5 && 'Outstanding ★★★★★'}
                  {rating === 4 && 'Very Good ★★★★☆'}
                  {rating === 3 && 'Average ★★★☆☆'}
                  {rating === 2 && 'Needs Improvement ★★☆☆☆'}
                  {rating === 1 && 'Poor ★☆☆☆☆'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Vikram Singh"
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
                  placeholder="e.g. vikram@college.edu"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher / Faculty</option>
                  <option value="admin">College Administrator</option>
                  <option value="parent">Parent</option>
                  <option value="warden">Hostel Warden</option>
                  <option value="maintenance">Maintenance Technician</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Feedback Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FeedbackCategory)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Feature Suggestion">Feature Suggestion</option>
                  <option value="User Experience (UI/UX)">User Experience (UI/UX)</option>
                  <option value="Performance & Speed">Performance & Speed</option>
                  <option value="Attendance System">Attendance System</option>
                  <option value="Role Portals">Role Portals</option>
                  <option value="General Praise / Other">General Praise / Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Your Feedback / Suggestions <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like? What can we do better? Specific details help our product designers greatly..."
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2 shadow-md transition-all focus:ring-2 focus:ring-amber-500"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        </div>

        {/* Community Testimonials / Recent Feedback */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              Recent Institutional Feedback
            </h3>
            <span className="text-xs text-slate-500">{feedbacks.length} reviews</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedbacks.slice(0, 4).map((fb) => (
              <div
                key={fb.id}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          (fb.rating ?? 5) >= s
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {fb.category}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                  "{fb.comment || fb.feedback}"
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {fb.full_name || fb.user_name || 'Anonymous'} ({fb.role || 'Member'})
                  </span>
                  <span>{new Date(fb.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
