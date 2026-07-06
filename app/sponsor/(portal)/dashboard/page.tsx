'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { getQuests, getSubmissions, ApiQuest, ApiSubmission } from '@/lib/sponsorApi';

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const METHOD_ICONS: Record<string, string> = {
  photo: '📷',
  healthkit: '❤️',
  goalquest: '🏆',
  strava: '🏃',
  canvas: '📚',
};

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  approved: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
};

export default function DashboardPage() {
  const [sponsorName, setSponsorName] = useState('there');
  const [quests, setQuests] = useState<ApiQuest[]>([]);
  const [submissions, setSubmissions] = useState<ApiSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [q, s] = await Promise.all([getQuests(), getSubmissions()]);
      setQuests(q);
      setSubmissions(s);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const name = localStorage.getItem('gq_sponsor_name');
    if (name) setSponsorName(name);
    fetchData();
  }, [fetchData]);

  const activeQuests = quests.filter((q) => q.status === 'active');
  const pendingCount = submissions.filter((s) => s.status === 'pending').length;
  const totalParticipants = quests.reduce((sum, q) => sum + Number(q.participants), 0);
  const totalRedeemed = quests.reduce((sum, q) => sum + Number(q.redeemed), 0);
  const recentSubmissions = [...submissions]
    .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
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
        <button
          onClick={fetchData}
          className="mt-4 text-primary text-sm font-medium hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-app-text">
          Welcome back, {sponsorName} 👋
        </h1>
        <p className="text-subtext text-sm mt-1">
          Here&apos;s what&apos;s happening with your quests today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-2xl shadow-soft p-5">
          <div className="text-3xl font-bold text-app-text">{activeQuests.length}</div>
          <div className="text-subtext text-xs mt-1 font-medium">Active Quests</div>
        </div>
        <div className="bg-card border border-border rounded-2xl shadow-soft p-5">
          <div className="text-3xl font-bold text-app-text">{totalParticipants.toLocaleString()}</div>
          <div className="text-subtext text-xs mt-1 font-medium">Total Participants</div>
        </div>
        <div
          className={`border rounded-2xl shadow-soft p-5 ${
            pendingCount > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-card border-border'
          }`}
        >
          <div
            className={`text-3xl font-bold ${
              pendingCount > 0 ? 'text-yellow-700' : 'text-app-text'
            }`}
          >
            {pendingCount}
          </div>
          <div
            className={`text-xs mt-1 font-medium ${
              pendingCount > 0 ? 'text-yellow-600' : 'text-subtext'
            }`}
          >
            Pending Reviews
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl shadow-soft p-5">
          <div className="text-3xl font-bold text-app-text">{totalRedeemed}</div>
          <div className="text-subtext text-xs mt-1 font-medium">Rewards Redeemed</div>
        </div>
      </div>

      {/* Pending CTA */}
      {pendingCount > 0 && (
        <div className="mb-8 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 flex items-center gap-4">
          <div className="text-2xl">⏳</div>
          <div className="flex-1">
            <div className="font-semibold text-yellow-800 text-sm">
              {pendingCount} submission{pendingCount !== 1 ? 's' : ''} waiting for review
            </div>
            <div className="text-yellow-600 text-xs mt-0.5">
              Review and approve participant submissions to release rewards.
            </div>
          </div>
          <Link
            href="/sponsor/submissions"
            className="bg-yellow-700 text-white rounded-full px-4 py-2 text-sm font-semibold hover:bg-yellow-800 transition-colors whitespace-nowrap"
          >
            Review Now
          </Link>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active Quests */}
        <div className="bg-card border border-border rounded-2xl shadow-soft p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-app-text text-sm">Active Quests</h2>
            <Link href="/sponsor/quests" className="text-primary text-xs font-medium hover:underline">
              View all
            </Link>
          </div>
          {activeQuests.length === 0 ? (
            <p className="text-subtext text-sm text-center py-6">No active quests yet.</p>
          ) : (
            <div className="space-y-4">
              {activeQuests.map((quest) => {
                const participants = Number(quest.participants);
                const pct = Math.round((participants / quest.max_participants) * 100);
                const pendingReviews = Number(quest.pending_reviews);
                return (
                  <Link key={quest.id} href={`/sponsor/quests/${quest.id}`}>
                    <div className="group cursor-pointer">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xl">{quest.sponsor_logo}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-app-text text-xs font-semibold truncate group-hover:text-primary transition-colors">
                            {quest.title}
                          </div>
                          <div className="text-subtext text-xs">
                            {participants} / {quest.max_participants} participants
                          </div>
                        </div>
                        {pendingReviews > 0 && (
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: 'var(--color-danger)' }}
                          >
                            {pendingReviews}
                          </span>
                        )}
                      </div>
                      <div className="h-1.5 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="text-right text-xs text-subtext mt-1">{pct}% full</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-2xl shadow-soft p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-app-text text-sm">Recent Submissions</h2>
            <Link href="/sponsor/submissions" className="text-primary text-xs font-medium hover:underline">
              View all
            </Link>
          </div>
          {recentSubmissions.length === 0 ? (
            <p className="text-subtext text-sm text-center py-6">No submissions yet.</p>
          ) : (
            <div className="space-y-3">
              {recentSubmissions.map((sub) => {
                const initials = sub.user_name
                  .split(' ')
                  .map((w: string) => w[0])
                  .slice(0, 2)
                  .join('');
                return (
                  <div key={sub.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 bg-primary">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-app-text text-xs font-semibold">{sub.user_name}</span>
                        <span className="text-subtext text-xs">·</span>
                        <span className="text-subtext text-xs truncate">{sub.quest_title}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs">{METHOD_ICONS[sub.method] ?? '📎'}</span>
                        <span className="text-subtext text-xs">{timeAgo(sub.submitted_at)}</span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full border font-medium ${STATUS_STYLES[sub.status]}`}
                        >
                          {sub.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
