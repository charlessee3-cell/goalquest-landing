'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sponsorUpdateProfile } from '@/lib/sponsorApi';

const CATEGORIES = [
  { value: 'fitness', label: 'Fitness & Gym', emoji: '💪' },
  { value: 'food', label: 'Food & Beverage', emoji: '🍕' },
  { value: 'retail', label: 'Retail & Shopping', emoji: '🛍️' },
  { value: 'wellness', label: 'Wellness & Spa', emoji: '🧘' },
  { value: 'education', label: 'Education', emoji: '📚' },
  { value: 'community', label: 'Community & Nonprofit', emoji: '🤝' },
  { value: 'entertainment', label: 'Entertainment', emoji: '🎮' },
  { value: 'general', label: 'Other', emoji: '🏪' },
];

const LOGO_EMOJIS = ['🏪', '💪', '🏋️', '🍕', '☕', '🛍️', '🧘', '📚', '🤝', '🎯', '⭐', '🏅'];

const GOAL_OPTIONS = [
  { id: 'brand', label: 'Increase brand awareness in my community' },
  { id: 'foot_traffic', label: 'Drive more foot traffic to my location' },
  { id: 'loyalty', label: 'Build customer loyalty and repeat visits' },
  { id: 'new_customers', label: 'Attract new customers from a younger demographic' },
  { id: 'engagement', label: 'Boost social media engagement and buzz' },
  { id: 'retention', label: 'Improve customer retention with incentives' },
];

const HELP_OPTIONS = [
  { id: 'quests', label: 'Sponsored quests that reward my customers' },
  { id: 'submissions', label: 'Proof-based submission reviews I control' },
  { id: 'analytics', label: 'Analytics to track campaign performance' },
  { id: 'reach', label: 'Reaching GoalQuest\'s active user base' },
];

type Step = 1 | 2 | 3;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [sponsorName, setSponsorName] = useState('your business');

  const [form, setForm] = useState({
    contact_name: '',
    website: '',
    category: '',
    logo_emoji: '🏪',
    description: '',
    selected_goals: [] as string[],
    goals_other: '',
    selected_help: [] as string[],
    help_other: '',
  });

  useEffect(() => {
    const auth = localStorage.getItem('gq_sponsor_auth');
    const token = localStorage.getItem('gq_sponsor_token');
    if (!auth || !token) {
      router.replace('/sponsor');
      return;
    }
    const name = localStorage.getItem('gq_sponsor_name');
    if (name) setSponsorName(name);
  }, [router]);

  const toggleGoal = (id: string) => {
    setForm((prev) => ({
      ...prev,
      selected_goals: prev.selected_goals.includes(id)
        ? prev.selected_goals.filter((g) => g !== id)
        : [...prev.selected_goals, id],
    }));
  };

  const toggleHelp = (id: string) => {
    setForm((prev) => ({
      ...prev,
      selected_help: prev.selected_help.includes(id)
        ? prev.selected_help.filter((h) => h !== id)
        : [...prev.selected_help, id],
    }));
  };

  const handleFinish = async () => {
    setError('');
    setSubmitting(true);

    const goalLabels = [
      ...form.selected_goals.map((id) => GOAL_OPTIONS.find((g) => g.id === id)?.label ?? id),
      ...(form.goals_other.trim() ? [form.goals_other.trim()] : []),
    ];
    const helpLabels = [
      ...form.selected_help.map((id) => HELP_OPTIONS.find((h) => h.id === id)?.label ?? id),
      ...(form.help_other.trim() ? [form.help_other.trim()] : []),
    ];

    try {
      await sponsorUpdateProfile({
        contact_name: form.contact_name.trim() || undefined,
        website: form.website.trim() || undefined,
        category: form.category || undefined,
        logo_emoji: form.logo_emoji,
        description: form.description.trim() || undefined,
        onboarding_goals: goalLabels.length ? goalLabels.join(' | ') : undefined,
        onboarding_completed: true,
      });
      // Store the help preferences locally — no separate column needed
      if (helpLabels.length) {
        localStorage.setItem('gq_sponsor_help_prefs', helpLabels.join(' | '));
      }
      router.push('/sponsor/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  const handleSkip = async () => {
    setSubmitting(true);
    try {
      await sponsorUpdateProfile({ onboarding_completed: true });
    } catch {
      // Best effort — skip regardless
    }
    router.push('/sponsor/dashboard');
  };

  const STEPS = ['Your Business', 'Your Goals', 'How We Help'];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ background: 'radial-gradient(ellipse at 60% 0%, #F2EAE5 0%, #F7F3F0 60%)' }}
    >
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-medium">
            G
          </div>
          <h1 className="text-2xl font-bold text-app-text">Welcome to GoalQuest!</h1>
          <p className="text-subtext text-sm mt-1">
            Let&apos;s get {sponsorName} set up — takes about 2 minutes.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6 justify-center">
          {STEPS.map((label, i) => {
            const n = (i + 1) as Step;
            const active = step === n;
            const done = step > n;
            return (
              <div key={label} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 ${active ? '' : 'opacity-60'}`}>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      done
                        ? 'bg-success text-white'
                        : active
                        ? 'bg-primary text-white'
                        : 'bg-border text-subtext'
                    }`}
                    style={done ? { backgroundColor: 'var(--color-success)' } : undefined}
                  >
                    {done ? '✓' : n}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${active ? 'text-app-text' : 'text-subtext'}`}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-8 h-px ${done ? 'bg-primary' : 'bg-border'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl shadow-medium p-6">

          {/* ── Step 1: About your business ── */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-app-text">About your business</h2>
                <p className="text-subtext text-xs mt-0.5">Help us understand who you are.</p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-subtext mb-2">Business type</label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, category: cat.value }))}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all text-left ${
                        form.category === cat.value
                          ? 'border-primary bg-primary-light text-primary'
                          : 'border-border bg-background text-app-text hover:border-primary/40'
                      }`}
                    >
                      <span>{cat.emoji}</span>
                      <span className="text-xs">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Logo emoji */}
              <div>
                <label className="block text-xs font-medium text-subtext mb-2">Business logo (pick an emoji)</label>
                <div className="flex flex-wrap gap-2">
                  {LOGO_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, logo_emoji: emoji }))}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                        form.logo_emoji === emoji
                          ? 'bg-primary text-white shadow-soft scale-110'
                          : 'bg-background border border-border hover:border-primary/40'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-subtext mb-1.5">
                  Brief description <span className="text-subtext font-normal">(optional)</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="e.g. A local gym focused on community fitness and personal training..."
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-app-text text-sm placeholder:text-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition resize-none"
                />
              </div>

              {/* Contact name + website */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-subtext mb-1.5">Your name</label>
                  <input
                    type="text"
                    value={form.contact_name}
                    onChange={(e) => setForm((p) => ({ ...p, contact_name: e.target.value }))}
                    placeholder="Jane Smith"
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-app-text text-sm placeholder:text-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-subtext mb-1.5">Website</label>
                  <input
                    type="url"
                    value={form.website}
                    onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-app-text text-sm placeholder:text-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full bg-primary text-white rounded-full py-2.5 text-sm font-semibold hover:bg-primary-dark transition-colors shadow-soft"
              >
                Next →
              </button>
            </div>
          )}

          {/* ── Step 2: Near-term goals ── */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-app-text">What are your near-term goals?</h2>
                <p className="text-subtext text-xs mt-0.5">Select all that apply.</p>
              </div>

              <div className="space-y-2">
                {GOAL_OPTIONS.map((goal) => (
                  <label
                    key={goal.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      form.selected_goals.includes(goal.id)
                        ? 'border-primary bg-primary-light'
                        : 'border-border hover:border-primary/30 bg-background'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.selected_goals.includes(goal.id)}
                      onChange={() => toggleGoal(goal.id)}
                      className="accent-primary"
                    />
                    <span className="text-sm text-app-text">{goal.label}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium text-subtext mb-1.5">
                  Anything else? <span className="font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.goals_other}
                  onChange={(e) => setForm((p) => ({ ...p, goals_other: e.target.value }))}
                  placeholder="Tell us more..."
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-app-text text-sm placeholder:text-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-background border border-border text-app-text rounded-full py-2.5 text-sm font-semibold hover:bg-primary-light transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 bg-primary text-white rounded-full py-2.5 text-sm font-semibold hover:bg-primary-dark transition-colors shadow-soft"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: How GoalQuest helps ── */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-app-text">How can GoalQuest help?</h2>
                <p className="text-subtext text-xs mt-0.5">
                  What features are most valuable to you? We&apos;ll tailor your experience.
                </p>
              </div>

              <div className="space-y-2">
                {HELP_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      form.selected_help.includes(opt.id)
                        ? 'border-primary bg-primary-light'
                        : 'border-border hover:border-primary/30 bg-background'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.selected_help.includes(opt.id)}
                      onChange={() => toggleHelp(opt.id)}
                      className="accent-primary"
                    />
                    <span className="text-sm text-app-text">{opt.label}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium text-subtext mb-1.5">
                  Anything specific you&apos;re hoping for? <span className="font-normal">(optional)</span>
                </label>
                <textarea
                  value={form.help_other}
                  onChange={(e) => setForm((p) => ({ ...p, help_other: e.target.value }))}
                  placeholder="e.g. We want to run a 30-day fitness challenge tied to a membership promotion..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-app-text text-sm placeholder:text-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition resize-none"
                />
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2.5 text-xs text-red-700">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 bg-background border border-border text-app-text rounded-full py-2.5 text-sm font-semibold hover:bg-primary-light transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  disabled={submitting}
                  className="flex-1 bg-primary text-white rounded-full py-2.5 text-sm font-semibold hover:bg-primary-dark transition-colors shadow-soft disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving…' : 'Go to Dashboard →'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Skip */}
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={handleSkip}
            disabled={submitting}
            className="text-subtext text-xs hover:text-app-text transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
