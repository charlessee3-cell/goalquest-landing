'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DEMO_CREDENTIALS } from '@/lib/sponsorData';

export default function SponsorLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    const auth = localStorage.getItem('gq_sponsor_auth');
    if (auth === '1') {
      router.replace('/sponsor/dashboard');
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      email.trim().toLowerCase() === DEMO_CREDENTIALS.email &&
      password === DEMO_CREDENTIALS.password
    ) {
      localStorage.setItem('gq_sponsor_auth', '1');
      localStorage.setItem('gq_sponsor_name', 'Fitness Zone Gym');
      router.push('/sponsor/dashboard');
    } else {
      setError('Invalid email or password. Use the demo credentials below.');
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
          <h2 className="text-lg font-semibold text-app-text mb-1">Welcome back</h2>
          <p className="text-subtext text-xs mb-5">Sign in to manage your quests and submissions</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-subtext mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sponsor@goalquest.club"
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
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-app-text text-sm placeholder:text-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2.5 text-xs text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-white rounded-full py-2.5 text-sm font-semibold hover:bg-primary-dark transition-colors shadow-soft"
            >
              Sign In
            </button>
          </form>
        </div>

        {/* Demo hint */}
        <div className="mt-4 rounded-xl bg-primary-light border border-border px-4 py-3 text-xs text-subtext">
          <div className="font-semibold text-primary mb-0.5">Demo credentials</div>
          <div>{DEMO_CREDENTIALS.email}</div>
          <div>Password: {DEMO_CREDENTIALS.password}</div>
        </div>
      </div>
    </div>
  );
}
