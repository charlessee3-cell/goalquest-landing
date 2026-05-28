'use client';

import { useState } from 'react';

export default function WaitlistForm({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage(data.message ?? "You're on the list! We'll be in touch soon. 🎉");
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error ?? 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className={`flex items-center gap-3 rounded-2xl px-5 py-4 ${dark ? 'bg-white/10 text-white' : 'bg-success/10 text-success'}`}>
        <span className="text-2xl">🎉</span>
        <p className="font-semibold text-sm">{message}</p>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`flex-1 rounded-full px-5 py-3 text-sm font-medium outline-none transition-all border ${
            dark
              ? 'bg-white/15 border-white/20 text-white placeholder:text-white/50 focus:border-white/50'
              : 'bg-white border-border text-app-text placeholder:text-subtext focus:border-primary'
          }`}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className={`rounded-full px-7 py-3 text-sm font-bold whitespace-nowrap transition-all shadow-soft disabled:opacity-60 ${
            dark
              ? 'bg-white text-primary hover:bg-primary-light'
              : 'bg-primary text-white hover:bg-primary-dark'
          }`}
        >
          {status === 'loading' ? 'Joining…' : 'Join the Waitlist →'}
        </button>
      </form>
      {status === 'error' && (
        <p className={`mt-2 text-xs text-center ${dark ? 'text-red-300' : 'text-danger'}`}>{message}</p>
      )}
      <p className={`mt-3 text-xs text-center ${dark ? 'text-white/50' : 'text-subtext'}`}>
        Free to download · No spam · Unsubscribe anytime
      </p>
    </div>
  );
}
