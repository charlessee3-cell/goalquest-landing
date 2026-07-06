'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { sponsorLogin, sponsorLogout, sponsorRegister } from '@/lib/sponsorApi';

interface SponsorShellProps {
  children: React.ReactNode;
  pendingCount?: number;
}

const NAV_LINKS = [
  { href: '/sponsor/(portal)/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/sponsor/(portal)/quests', label: 'Quests', icon: '🏆' },
  { href: '/sponsor/(portal)/submissions', label: 'Submissions', icon: '📋' },
  { href: '/sponsor/(portal)/analytics', label: 'Analytics', icon: '📈' },
];

// Map display hrefs to actual Next.js route paths
const HREF_MAP: Record<string, string> = {
  '/sponsor/(portal)/dashboard': '/sponsor/dashboard',
  '/sponsor/(portal)/quests': '/sponsor/quests',
  '/sponsor/(portal)/submissions': '/sponsor/submissions',
  '/sponsor/(portal)/analytics': '/sponsor/analytics',
};

function Sidebar({
  sponsorName,
  pendingCount,
  onSignOut,
  onClose,
}: {
  sponsorName: string;
  pendingCount: number;
  onSignOut: () => void;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white text-lg font-bold">
            G
          </div>
          <div>
            <div className="font-bold text-app-text text-sm leading-tight">GoalQuest</div>
            <div className="text-subtext text-xs">Sponsor Portal</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_LINKS.map((link) => {
          const actualHref = HREF_MAP[link.href];
          const isActive =
            pathname === actualHref ||
            (actualHref !== '/sponsor/dashboard' && pathname.startsWith(actualHref));
          return (
            <Link
              key={link.href}
              href={actualHref}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-soft'
                  : 'text-subtext hover:bg-primary-light hover:text-app-text'
              }`}
            >
              <span className="text-base">{link.icon}</span>
              <span>{link.label}</span>
              {link.label === 'Submissions' && pendingCount > 0 && (
                <span
                  className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-danger text-white'
                  }`}
                  style={{ backgroundColor: isActive ? undefined : 'var(--color-danger)' }}
                >
                  {pendingCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary text-xs font-bold">
            {sponsorName
              .split(' ')
              .map((w) => w[0])
              .slice(0, 2)
              .join('')}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-app-text text-xs font-semibold truncate">{sponsorName}</div>
            <div className="text-subtext text-xs">Sponsor</div>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="w-full text-left text-subtext text-xs px-2 py-1.5 rounded-lg hover:bg-primary-light hover:text-danger transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function SponsorShell({ children, pendingCount = 0 }: SponsorShellProps) {
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);
  const [sponsorName, setSponsorName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('gq_sponsor_auth');
    const token = localStorage.getItem('gq_sponsor_token');
    const name = localStorage.getItem('gq_sponsor_name') ?? '';
    // Require both the flag AND a real JWT token — clears stale pre-API sessions
    if (auth === '1' && token) {
      setIsAuthed(true);
      setSponsorName(name);
    } else {
      // Clear any partial/stale auth state
      localStorage.removeItem('gq_sponsor_auth');
      localStorage.removeItem('gq_sponsor_name');
      setIsAuthed(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await sponsorLogin(email.trim(), password);
      setSponsorName(data.sponsor.name);
      setIsAuthed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await sponsorRegister({ name: name.trim(), email: email.trim(), password });
      setSponsorName(data.sponsor.name);
      setIsAuthed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (next: 'signin' | 'signup') => {
    setMode(next);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
  };

  const handleSignOut = () => {
    sponsorLogout();
    setIsAuthed(false);
    router.push('/sponsor');
  };

  // Still checking auth
  if (isAuthed === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not authenticated — show login
  if (!isAuthed) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center p-4"
        style={{ background: 'radial-gradient(ellipse at 60% 0%, #F2EAE5 0%, #F7F3F0 60%)' }}
      >
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              G
            </div>
            <h1 className="text-2xl font-bold text-app-text">GoalQuest</h1>
            <p className="text-subtext text-sm mt-1">Sponsor Portal</p>
          </div>

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

            <form onSubmit={mode === 'signin' ? handleLogin : handleRegister} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-subtext mb-1.5">Business name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Fitness Zone Gym"
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-app-text text-sm placeholder:text-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-subtext mb-1.5">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@yourcompany.com"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-app-text text-sm placeholder:text-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-subtext mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={mode === 'signup' ? 8 : undefined}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-app-text text-sm placeholder:text-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                  required
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
                disabled={loading}
                className="w-full bg-primary text-white rounded-full py-2.5 text-sm font-semibold hover:bg-primary-dark transition-colors shadow-soft disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? mode === 'signin' ? 'Signing in…' : 'Creating account…'
                  : mode === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated — render shell
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-card border-r border-border flex-shrink-0">
        <Sidebar
          sponsorName={sponsorName}
          pendingCount={pendingCount}
          onSignOut={handleSignOut}
        />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-64 bg-card border-r border-border z-50 flex flex-col">
            <Sidebar
              sponsorName={sponsorName}
              pendingCount={pendingCount}
              onSignOut={handleSignOut}
              onClose={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-card border-b border-border">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-lg hover:bg-primary-light transition-colors"
          >
            <svg className="w-5 h-5 text-app-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="font-semibold text-app-text text-sm">GoalQuest Sponsor Portal</div>
          {pendingCount > 0 && (
            <span
              className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: 'var(--color-danger)' }}
            >
              {pendingCount}
            </span>
          )}
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
