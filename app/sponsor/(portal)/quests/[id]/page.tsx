'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getQuest, reviewSubmission, ApiQuest, ApiSubmission } from '@/lib/sponsorApi';

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const METHOD_ICONS: Record<string, string> = {
  photo: '📷', healthkit: '❤️', goalquest: '🏆', strava: '🏃', canvas: '📚',
};
const METHOD_LABELS: Record<string, string> = {
  photo: 'Photo', healthkit: 'Apple Health', goalquest: 'GoalQuest', strava: 'Strava', canvas: 'Canvas',
};

const CATEGORY_COLORS: Record<string, string> = {
  fitness: '#4A90D9',
  lifestyle: '#8B5A2B',
  career: '#0077B5',
  community: '#6B8F71',
  creativity: '#C4892A',
  education: '#7C3AED',
  health: '#DC2626',
  finance: '#047857',
  general: '#5C3524',
};

export default function QuestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [quest, setQuest] = useState<ApiQuest | null>(null);
  const [subs, setSubs] = useState<ApiSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getQuest(id);
      setQuest(data.quest);
      setSubs(data.submissions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quest');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  async function approve(subId: string) {
    try {
      await reviewSubmission(subId, 'approved');
      setSubs((prev) => prev.map((s) => s.id === subId ? { ...s, status: 'approved' as const } : s));
      showToast('✅ Approved — reward unlocked');
    } catch (err) {
      showToast(`Error: ${err instanceof Error ? err.message : 'Failed to approve'}`);
    }
  }

  async function reject(subId: string) {
    try {
      await reviewSubmission(subId, 'rejected');
      setSubs((prev) => prev.map((s) => s.id === subId ? { ...s, status: 'rejected' as const } : s));
      showToast('❌ Rejected — participant notified');
    } catch (err) {
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

  if (error || !quest) {
    return (
      <div className="p-6 text-center">
        <div className="text-4xl mb-3">⚠️</div>
        <p className="font-semibold text-app-text">Failed to load data</p>
        <p className="text-subtext text-sm mt-1">{error ?? 'Quest not found'}</p>
        <button onClick={fetchData} className="mt-4 text-primary text-sm font-medium hover:underline">
          Try again
        </button>
      </div>
    );
  }

  const catColor =
    CATEGORY_COLORS[quest.category.toLowerCase()] ?? '#5C3524';
  const deadlineDate = new Date(quest.deadline);
  const daysLeft = Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const participants = Number(quest.participants);
  const pct = Math.round((participants / quest.max_participants) * 100);
  const pending = subs.filter((s) => s.status === 'pending');

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-app-text text-white text-sm font-medium px-5 py-3 rounded-full shadow-strong">
          {toast}
        </div>
      )}

      {/* Back */}
      <Link
        href="/sponsor/quests"
        className="inline-flex items-center gap-1.5 text-sm text-subtext hover:text-primary transition-colors font-medium"
      >
        ← Back to Quests
      </Link>

      {/* Quest header card */}
      <div className="bg-card border border-border rounded-2xl shadow-soft p-6">
        <div className="flex items-start gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
            style={{ backgroundColor: catColor + '22' }}
          >
            {quest.sponsor_logo}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="text-xl font-bold text-app-text">{quest.title}</h1>
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full text-white capitalize"
                style={{
                  backgroundColor:
                    quest.status === 'active' ? 'var(--color-success)' : 'var(--color-subtext)',
                }}
              >
                {quest.status}
              </span>
            </div>
            <p className="text-subtext text-sm">
              {quest.category} · Ends{' '}
              {deadlineDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}{' '}
              ({daysLeft > 0 ? `${daysLeft} days left` : 'Ended'})
            </p>
            <p className="text-app-text text-sm mt-2 leading-relaxed">{quest.description}</p>
          </div>
        </div>

        {/* Reward */}
        <div className="mt-4 flex items-center gap-3 bg-background rounded-xl px-4 py-3 border border-border">
          <span className="text-xl">{quest.reward_icon}</span>
          <div>
            <div className="text-xs font-semibold text-subtext uppercase tracking-wide">Reward</div>
            <div className="font-semibold text-app-text text-sm">{quest.reward}</div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Enrolled', value: participants, max: quest.max_participants },
          { label: 'Pending', value: pending.length, color: pending.length > 0 ? '#C4892A' : undefined },
          { label: 'Approved', value: Number(quest.approved), color: 'var(--color-success)' },
          { label: 'Redeemed', value: Number(quest.redeemed), color: 'var(--color-primary)' },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center shadow-soft">
            <div className="text-2xl font-bold" style={{ color: s.color ?? 'var(--color-app-text)' }}>
              {s.value}
            </div>
            {s.max && <div className="text-xs text-subtext">of {s.max}</div>}
            <div className="text-xs text-subtext font-medium mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Enrollment bar */}
      <div className="bg-card border border-border rounded-xl shadow-soft px-5 py-4">
        <div className="flex justify-between text-xs text-subtext mb-2">
          <span className="font-medium">Enrollment</span>
          <span>{pct}% full</span>
        </div>
        <div className="h-2 bg-border rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: catColor }} />
        </div>
      </div>

      {/* Submissions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-app-text">Submissions ({subs.length})</h2>
          {pending.length > 0 && (
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
              style={{ backgroundColor: 'var(--color-warning)' }}
            >
              {pending.length} pending
            </span>
          )}
        </div>

        {subs.length === 0 ? (
          <div className="text-center py-12 text-subtext text-sm">
            No submissions yet for this quest.
          </div>
        ) : (
          <div className="space-y-3">
            {subs.map((sub) => {
              const initials = sub.user_name
                .split(' ')
                .map((w: string) => w[0])
                .slice(0, 2)
                .join('');
              return (
                <div
                  key={sub.id}
                  className={`bg-card border border-border rounded-xl p-4 shadow-soft ${
                    sub.status !== 'pending' ? 'opacity-75' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 bg-primary"
                    >
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-app-text text-sm">{sub.user_name}</div>
                      <div className="text-xs text-subtext">
                        {METHOD_ICONS[sub.method] ?? '📎'} {METHOD_LABELS[sub.method] ?? sub.method} ·{' '}
                        {timeAgo(sub.submitted_at)}
                      </div>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
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

                  {sub.proof_note && (
                    <p className="text-sm text-app-text bg-background rounded-lg px-3 py-2 border border-border mb-3 leading-relaxed">
                      &ldquo;{sub.proof_note}&rdquo;
                    </p>
                  )}

                  {sub.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => reject(sub.id)}
                        className="flex-1 py-2 rounded-lg border text-sm font-semibold transition-all hover:bg-red-50"
                        style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => approve(sub.id)}
                        className="flex-1 py-2 rounded-lg text-sm font-semibold text-white"
                        style={{ backgroundColor: 'var(--color-success)' }}
                      >
                        Approve
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
