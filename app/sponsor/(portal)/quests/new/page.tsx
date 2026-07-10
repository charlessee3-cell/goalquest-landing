'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createQuest } from '@/lib/sponsorApi';

const CATEGORIES = ['Fitness', 'Lifestyle', 'Career', 'Community', 'Creativity', 'Education', 'Health', 'Finance'];
const REWARD_EMOJIS = ['🎟️', '💳', '⭐', '🎁', '🏅', '🎯', '💰', '🛍️', '🍕', '🎮'];
const PROOF_METHODS = [
  { id: 'goalquest', label: 'GoalQuest Goal', icon: '🏆' },
  { id: 'healthkit', label: 'Apple Health', icon: '❤️' },
  { id: 'photo', label: 'Photo Proof', icon: '📷' },
  { id: 'strava', label: 'Strava', icon: '🏃' },
  { id: 'canvas', label: 'Canvas / Portfolio', icon: '📚' },
];

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-app-text text-white px-5 py-3 rounded-2xl shadow-strong text-sm font-medium flex items-center gap-3">
      <span>✅</span>
      <span>{message}</span>
      <button onClick={onClose} className="text-white/60 hover:text-white ml-2">
        ✕
      </button>
    </div>
  );
}

export default function NewQuestPage() {
  const router = useRouter();
  const [toast, setToast] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [form, setForm] = useState({
    title: '',
    category: 'Fitness',
    description: '',
    challenge: '',
    reward: '',
    rewardIcon: '🎁',
    deadline: '',
    maxParticipants: '500',
    proofMethods: ['photo'] as string[],
    address: '',
    autoApprove: false,
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleProofMethod = (id: string) => {
    setForm((prev) => ({
      ...prev,
      proofMethods: prev.proofMethods.includes(id)
        ? prev.proofMethods.filter((m) => m !== id)
        : [...prev.proofMethods, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent, asDraft = false) => {
    e.preventDefault();
    setApiError('');
    setSubmitting(true);
    try {
      await createQuest({
        title: form.title,
        description: form.description,
        challenge: form.challenge,
        category: form.category.toLowerCase(),
        reward: form.reward,
        reward_icon: form.rewardIcon,
        sponsor_logo: '🏪',
        address: form.address,
        deadline: form.deadline,
        max_participants: parseInt(form.maxParticipants, 10) || 500,
        proof_methods: form.proofMethods,
        auto_approve: form.autoApprove,
        status: asDraft ? 'draft' : 'active',
      });
      setToast(asDraft ? 'Quest saved as draft!' : 'Quest published successfully!');
      setTimeout(() => {
        router.push('/sponsor/quests');
      }, 1800);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Failed to create quest. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const categoryColorMap: Record<string, string> = {
    Fitness: '#4A90D9',
    Lifestyle: '#8B5A2B',
    Career: '#0077B5',
    Community: '#6B8F71',
    Creativity: '#C4892A',
    Education: '#7C3AED',
    Health: '#DC2626',
    Finance: '#047857',
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {toast && <Toast message={toast} onClose={() => setToast('')} />}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-app-text">Create New Quest</h1>
        <p className="text-subtext text-sm mt-0.5">
          Configure your sponsored challenge for GoalQuest users
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-5">
          {/* Basic Info */}
          <div className="bg-card border border-border rounded-2xl shadow-soft p-5">
            <h2 className="font-semibold text-app-text text-sm mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-subtext mb-1.5">Quest Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g. Morning Mile Club"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-app-text text-sm placeholder:text-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-subtext mb-1.5">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-app-text text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-subtext mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe your quest and what participants will get out of it..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-app-text text-sm placeholder:text-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-subtext mb-1.5">
                  Challenge (what must participants complete?) *
                </label>
                <textarea
                  value={form.challenge}
                  onChange={(e) => handleChange('challenge', e.target.value)}
                  placeholder="e.g. Run 1 mile every morning for 30 consecutive days and log your run..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-app-text text-sm placeholder:text-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition resize-none"
                />
              </div>
            </div>
          </div>

          {/* Reward */}
          <div className="bg-card border border-border rounded-2xl shadow-soft p-5">
            <h2 className="font-semibold text-app-text text-sm mb-4">Reward</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-subtext mb-1.5">
                  Reward Description *
                </label>
                <input
                  type="text"
                  value={form.reward}
                  onChange={(e) => handleChange('reward', e.target.value)}
                  placeholder="e.g. 1 Month Free Gym Membership"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-app-text text-sm placeholder:text-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-subtext mb-2">Reward Icon</label>
                <div className="flex flex-wrap gap-2">
                  {REWARD_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleChange('rewardIcon', emoji)}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                        form.rewardIcon === emoji
                          ? 'bg-primary text-white shadow-soft scale-110'
                          : 'bg-background border border-border hover:border-primary/40'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-card border border-border rounded-2xl shadow-soft p-5">
            <h2 className="font-semibold text-app-text text-sm mb-4">Quest Settings</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-subtext mb-1.5">Deadline *</label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => handleChange('deadline', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-app-text text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-subtext mb-1.5">Max Participants</label>
                <input
                  type="number"
                  value={form.maxParticipants}
                  onChange={(e) => handleChange('maxParticipants', e.target.value)}
                  min="1"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-app-text text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-card border border-border rounded-2xl shadow-soft p-5">
            <h2 className="font-semibold text-app-text text-sm mb-1">Location</h2>
            <p className="text-subtext text-xs mb-4">
              Where participants go to complete or redeem the quest. Shown as a pin on the in-app map.
            </p>
            <div>
              <label className="block text-xs font-medium text-subtext mb-1.5">Street Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="e.g. 123 Main St, Cincinnati, OH 45202"
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-app-text text-sm placeholder:text-subtext focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
              />
            </div>
          </div>

          {/* Proof Methods */}
          <div className="bg-card border border-border rounded-2xl shadow-soft p-5">
            <h2 className="font-semibold text-app-text text-sm mb-1">Accepted Proof Methods</h2>
            <p className="text-subtext text-xs mb-4">
              How can participants prove they completed the quest?
            </p>
            <div className="space-y-2">
              {PROOF_METHODS.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    form.proofMethods.includes(method.id)
                      ? 'border-primary bg-primary-light'
                      : 'border-border hover:border-primary/30 bg-background'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.proofMethods.includes(method.id)}
                    onChange={() => toggleProofMethod(method.id)}
                    className="accent-primary"
                  />
                  <span className="text-lg">{method.icon}</span>
                  <span className="text-sm font-medium text-app-text">{method.label}</span>
                </label>
              ))}
            </div>

            {/* Auto-approve toggle */}
            <div className="mt-4 pt-4 border-t border-border">
              <label className="flex items-start gap-3 cursor-pointer">
                <div className="relative mt-0.5 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={form.autoApprove}
                    onChange={(e) => handleChange('autoApprove', e.target.checked as unknown as string)}
                    className="sr-only"
                  />
                  <div
                    onClick={() => setForm((p) => ({ ...p, autoApprove: !p.autoApprove }))}
                    className={`w-10 h-6 rounded-full transition-colors cursor-pointer ${
                      form.autoApprove ? 'bg-primary' : 'bg-border'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow transition-transform mt-1 ${
                        form.autoApprove ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-app-text">Auto-approve submissions</div>
                  <div className="text-xs text-subtext mt-0.5">
                    Submitted proofs are instantly verified without manual review. Reward vouchers unlock immediately for participants.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {apiError && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {apiError}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={submitting}
              className="flex-1 bg-background border border-border text-app-text rounded-full py-2.5 text-sm font-semibold hover:bg-primary-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, false)}
              disabled={submitting}
              className="flex-1 bg-primary text-white rounded-full py-2.5 text-sm font-semibold hover:bg-primary-dark transition-colors shadow-soft disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Publishing…' : 'Publish Quest'}
            </button>
          </div>
        </div>

        {/* Preview card */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <h2 className="font-semibold text-app-text text-sm mb-3">App Preview</h2>
            <div className="bg-card border border-border rounded-2xl shadow-soft p-4">
              <div className="text-xs text-subtext uppercase font-semibold mb-3 tracking-wide">
                How it looks in the app
              </div>
              <div className="bg-background rounded-xl p-3 border border-border">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{form.rewardIcon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-app-text text-sm truncate">
                      {form.title || 'Quest Title'}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
                        style={{ backgroundColor: categoryColorMap[form.category] || '#5C3524' }}
                      >
                        {form.category}
                      </span>
                    </div>
                  </div>
                </div>

                {form.reward && (
                  <div className="mt-3 bg-card rounded-lg px-3 py-2 border border-border">
                    <div className="text-xs text-subtext">Reward</div>
                    <div className="text-sm font-semibold text-app-text">{form.reward}</div>
                  </div>
                )}

                {form.description && (
                  <div className="mt-3 text-xs text-subtext leading-relaxed line-clamp-3">
                    {form.description}
                  </div>
                )}

                {form.address && (
                  <div className="mt-3 text-xs text-subtext flex items-start gap-1">
                    <span>📍</span>
                    <span className="line-clamp-2">{form.address}</span>
                  </div>
                )}

                {form.deadline && (
                  <div className="mt-3 text-xs text-subtext">
                    Deadline:{' '}
                    <span className="text-app-text font-medium">
                      {new Date(form.deadline).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                )}

                <div className="mt-3 flex flex-wrap gap-1">
                  {form.proofMethods.map((m) => {
                    const method = PROOF_METHODS.find((pm) => pm.id === m);
                    return method ? (
                      <span key={m} className="text-xs bg-primary-light text-primary px-2 py-0.5 rounded-full">
                        {method.icon} {method.label}
                      </span>
                    ) : null;
                  })}
                </div>

                <button className="w-full mt-4 bg-primary text-white rounded-full py-2 text-xs font-semibold">
                  Join Quest
                </button>
              </div>

              <div className="mt-3 text-xs text-subtext text-center">
                {form.maxParticipants} spots available
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
