'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sponsorLogin, sponsorRegister } from '@/lib/sponsorApi';

type Mode = 'signin' | 'signup';

export default function SponsorLoginPage() {
  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('gq_sponsor_auth');
    const token = localStorage.getItem('gq_sponsor_token');
    if (auth === '1' && token) {
      router.replace('/sponsor/dashboard');
    } else {
      localStorage.removeItem('gq_sponsor_auth');
      localStorage.removeItem('gq_sponsor_name');
      setLoading(false);
    }
  }, [router]);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (mode === 'signin') {
        await sponsorLogin(email.trim(), password);
        router.push('/sponsor/dashboard');
      } else {
        await sponsorRegister({ name: name.trim(), email: email.trim(), password });
        router.push('/sponsor/onboarding');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'radial-gradient(ellipse at 60% 0%, #F2EAE5 0%, #F7F3F0 60%)' }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-medium">
            G
          </div>
          <h1 className="text-2xl font-bold text-app-text">GoalQuest</h1>
          <p className="text-subtext text-sm mt-1">Sponsor Portal</p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl shadow-medium p-6">
          {/* Mode tabs */}
          <div className="flex rounded-xl bg-background border border-border p-1 mb-5">
            <button
              type="button"
              onClick={() => switchMode('signin')}
              className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                mode === 'signin'
                  ? 'bg-primary text-white shadow-soft'
                  : 'text-subtext hover:text-app-text'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode('signup')}
              className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-primary text-white shadow-soft'
                  : 'text-subtext hover:text-app-text'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-subtext mb-1.5">
                  Business name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Fitness Zone Gym"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-app-text text-sm placeholder:text-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                  required
                  autoComplete="organization"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-subtext mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourcompany.com"
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-app-text text-sm placeholder:text-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-subtext mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={mode === 'signup' ? 8 : undefined}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-app-text text-sm placeholder:text-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                required
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              />
              {mode === 'signup' && (
                <p className="text-subtext text-xs mt-1">At least 8 characters</p>
              )}
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2.5 text-xs text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-white rounded-full py-2.5 text-sm font-semibold hover:bg-primary-dark transition-colors shadow-soft disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting
                ? mode === 'signin' ? 'Signing in…' : 'Creating account…'
                : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>

        {mode === 'signin' && (
          <div className="mt-4 rounded-xl bg-primary-light border border-border px-4 py-3 text-xs text-subtext">
            <div className="font-semibold text-primary mb-0.5">Test account</div>
            <div>test-sponsor@goalquest.club</div>
            <div>Password: TestPass123</div>
          </div>
        )}
      </div>
    </div>
  );
}
