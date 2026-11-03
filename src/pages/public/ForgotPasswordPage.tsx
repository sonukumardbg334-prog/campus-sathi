import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { KeyRound, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase, isLiveSupabaseConfigured } from '../../lib/supabase';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (isLiveSupabaseConfigured && email.trim()) {
      try {
        await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/login`,
        });
      } catch (err) {
        console.warn('[Supabase Auth] resetPasswordForEmail error:', err);
      }
    } else {
      await new Promise((r) => setTimeout(r, 600));
    }
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Card className="shadow-card">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-2">
            <KeyRound className="w-6 h-6" />
          </div>
          <CardTitle className="text-xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            Enter your institutional email to receive a secure recovery link
          </CardDescription>
        </CardHeader>

        <CardContent>
          {submitted ? (
            <div className="space-y-4 text-center">
              <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/50 text-teal-900 dark:text-teal-200 text-xs flex items-start gap-2.5 text-left">
                <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm">Recovery Instructions Sent</div>
                  <p className="mt-1 text-slate-600 dark:text-slate-300">
                    If an account exists for <span className="font-semibold">{email}</span>, a secure password reset link has been dispatched.
                  </p>
                </div>
              </div>

              {!isLiveSupabaseConfigured && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 rounded-lg text-xs text-amber-900 dark:text-amber-200 text-left flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Demo Environment Note:</strong> Supabase SMTP email delivery requires configuring your SMTP provider (SendGrid / AWS SES) in Supabase Dashboard.
                  </span>
                </div>
              )}

              <Link to="/login" className="inline-block mt-3">
                <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Registered Institutional Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@college.edu.in"
                required
              />

              <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={loading}>
                Send Recovery Link
              </Button>

              <div className="text-center pt-2">
                <Link to="/login" className="text-xs text-muted hover:text-foreground inline-flex items-center gap-1.5">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

