'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSubmissions, reviewSubmission, ApiSubmission } from '@/lib/sponsorApi';

type Filter = 'pending' | 'approved' | 'rejected' | 'all';

const METHOD_LABELS: Record<string, string> = {
  photo: 'Photo Proof',
  healthkit: 'Apple Health',
  goalquest: 'GoalQuest Goal',
  strava: 'Strava',
  canvas: 'Canvas LMS',
};
const METHOD_ICONS: Record<string, string> = {
  photo: '📷', healthkit: '❤️', goalquest: '🏆', strava: '🏃', canvas: '📚',
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<ApiSubmission[]>([]);
  const [filter, setFilter] = useState<Filter>('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSubmissions();
      setSubmissions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  async function approve(id: string) {
    // Optimistic update
    setSubmissions((prev) => prev.map((s) => s.id === id ? { ...s, status: 'approved' as const } : s));
    try {
      await reviewSubmission(id, 'approved');
      showToast('✅ Submission approved — reward unlocked for participant');
    } catch (err) {
      // Revert
      setSubmissions((prev) => prev.map((s) => s.id === id ? { ...s, status: 'pending' as const } : s));
      showToast(`Error: ${err instanceof Error ? err.message : 'Failed to approve'}`);
    }
  }

  async function reject(id: string) {
    // Optimistic update
    setSubmissions((prev) => prev.map((s) => s.id === id ? { ...s, status: 'rejected' as const } : s));
    try {
      await reviewSubmission(id, 'rejected');
      showToast('❌ Submission rejected — participant will be notified');
    } catch (err) {
      // Revert
      setSubmissions((prev) => prev.map((s) => s.id === id ? { ...s, status: 'pending' as const } : s));
      showToast(`Error: ${err instanceof Error ? err.message : 'Failed to reject'}`);
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-border rounded-xl w-48" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-border rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-4xl mb-3">⚠️</div>
        <p className="font-semibold text-app-text">Failed to load data</p>
        <p className="text-subtext text-sm mt-1">{error}</p>
        <button onClick={fetchData} className="mt-4 text-primary text-sm font-medium hover:underline">
          Try again
        </button>
      </div>
    );
  }

  const counts = {
    all: submissions.length,
    pending: submissions.filter((s) => s.status === 'pending').length,
    approved: submissions.filter((s) => s.status === 'approved').length,
    rejected: submissions.filter((s) => s.status === 'rejected').length,
  };

  const visible = filter === 'all' ? submissions : submissions.filter((s) => s.status === filter);

  const tabs: { key: Filter; label: string }[] = [
    { key: 'pending', label: `Pending (${counts.pending})` },
    { key: 'approved', label: `Approved (${counts.approved})` },
    { key: 'rejected', label: `Rejected (${counts.rejected})` },
    { key: 'all', label: `All (${counts.all})` },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-app-text text-white text-sm font-medium px-5 py-3 rounded-full shadow-strong">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-app-text">Proof Review Queue</h1>
        <p className="text-subtext text-sm mt-1">
          Review participant submissions and approve or reject their proof.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              filter === tab.key
                ? 'bg-primary text-white shadow-soft'
                : 'bg-card border border-border text-subtext hover:text-app-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Submission cards */}
      {visible.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">✅</div>
          <p className="font-semibold text-app-text">All caught up!</p>
          <p className="text-subtext text-sm mt-1">
            No {filter === 'all' ? '' : filter} submissions to show.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map((sub) => {
            const initials = sub.user_name
              .split(' ')
              .map((w: string) => w[0])
              .slice(0, 2)
              .join('');
            return (
              <div
                key={sub.id}
                className={`bg-card border rounded-2xl shadow-soft p-5 ${
                  sub.status === 'pending' ? 'border-border' : 'border-border opacity-80'
                }`}
              >
                {/* Top row */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 bg-primary">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-app-text text-sm">{sub.user_name}</span>
                      <span className="text-subtext text-xs">·</span>
                      <span className="text-xs text-primary font-medium">{sub.quest_title}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-subtext">
                      <span>{METHOD_ICONS[sub.method] ?? '📎'}</span>
                      <span>{METHOD_LABELS[sub.method] ?? sub.method}</span>
                      <span>·</span>
                      <span>{timeAgo(sub.submitted_at)}</span>
                      <span
                        className={`ml-1 px-2 py-0.5 rounded-full font-semibold ${
                          sub.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : sub.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Proof note */}
                <div className="bg-background rounded-xl px-4 py-3 text-sm text-app-text leading-relaxed mb-4 border border-border">
                  {sub.method === 'photo' && sub.proof_uri && (
                    <div className="w-full h-32 bg-border rounded-lg mb-3 flex items-center justify-center text-subtext text-sm gap-2">
                      <span>📷</span> Photo attachment
                    </div>
                  )}
                  {sub.proof_note ? (
                    <>&ldquo;{sub.proof_note}&rdquo;</>
                  ) : (
                    <span className="text-subtext italic">No note provided.</span>
                  )}
                </div>

                {/* Actions (pending only) */}
                {sub.status === 'pending' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => reject(sub.id)}
                      className="flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all hover:bg-red-50"
                      style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => approve(sub.id)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                      style={{ backgroundColor: 'var(--color-success)' }}
                    >
                      Approve &amp; Unlock Reward
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
