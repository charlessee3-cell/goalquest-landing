'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getQuests, ApiQuest } from '@/lib/sponsorApi';

type FilterTab = 'all' | 'active' | 'draft' | 'ended';

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-green-50 text-green-700 border border-green-200',
  draft: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  ended: 'bg-gray-100 text-gray-500 border border-gray-200',
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

function categoryColor(category: string): string {
  return CATEGORY_COLORS[category.toLowerCase()] ?? '#5C3524';
}

function QuestCard({ quest }: { quest: ApiQuest }) {
  const deadline = new Date(quest.deadline).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const participants = Number(quest.participants);
  const pct =
    quest.max_participants > 0 ? Math.round((participants / quest.max_participants) * 100) : 0;
  const approved = Number(quest.approved);
  const redeemed = Number(quest.redeemed);
  const pendingReviews = Number(quest.pending_reviews);

  return (
    <Link href={`/sponsor/quests/${quest.id}`}>
      <div className="bg-card border border-border rounded-2xl shadow-soft p-5 hover:shadow-medium hover:border-primary/30 transition-all cursor-pointer group">
        <div className="flex items-start gap-4">
          <div className="text-3xl flex-shrink-0">{quest.sponsor_logo}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <h3 className="font-semibold text-app-text text-sm group-hover:text-primary transition-colors">
                  {quest.title}
                </h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium text-white"
                    style={{ backgroundColor: categoryColor(quest.category) }}
                  >
                    {quest.category}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_STYLES[quest.status]}`}
                  >
                    {quest.status}
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs text-subtext">Deadline</div>
                <div className="text-xs font-semibold text-app-text">{deadline}</div>
              </div>
            </div>

            {/* Reward */}
            <div className="flex items-center gap-1.5 mt-3 text-xs text-subtext">
              <span>{quest.reward_icon}</span>
              <span>{quest.reward}</span>
            </div>

            {/* Progress */}
            {quest.status !== 'draft' && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-subtext">{participants.toLocaleString()} enrolled</span>
                  <span className="text-subtext">{quest.max_participants.toLocaleString()} max</span>
                </div>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 mt-3 text-xs text-subtext">
              <span>✅ {approved} approved</span>
              <span>🔄 {redeemed} redeemed</span>
              {pendingReviews > 0 && (
                <span
                  className="font-semibold text-white px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: 'var(--color-danger)' }}
                >
                  {pendingReviews} pending
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function QuestsPage() {
  const [quests, setQuests] = useState<ApiQuest[]>([]);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getQuests();
      setQuests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  const filtered = filter === 'all' ? quests : quests.filter((q) => q.status === filter);

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: `All (${quests.length})` },
    { key: 'active', label: `Active (${quests.filter((q) => q.status === 'active').length})` },
    { key: 'draft', label: `Draft (${quests.filter((q) => q.status === 'draft').length})` },
    { key: 'ended', label: `Ended (${quests.filter((q) => q.status === 'ended').length})` },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-app-text">My Quests</h1>
          <p className="text-subtext text-sm mt-0.5">Manage your sponsored challenges</p>
        </div>
        <Link
          href="/sponsor/quests/new"
          className="bg-primary text-white rounded-full px-4 py-2 text-sm font-semibold hover:bg-primary-dark transition-colors shadow-soft"
        >
          + Create Quest
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-primary-light border border-border rounded-xl p-1 mb-6 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === tab.key
                ? 'bg-primary text-white shadow-soft'
                : 'text-subtext hover:text-app-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Quest list */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-subtext">
            <div className="text-4xl mb-3">🏆</div>
            <div className="font-medium">No quests in this category</div>
            <Link
              href="/sponsor/quests/new"
              className="text-primary text-sm mt-2 inline-block hover:underline"
            >
              Create your first quest
            </Link>
          </div>
        ) : (
          filtered.map((quest) => <QuestCard key={quest.id} quest={quest} />)
        )}
      </div>
    </div>
  );
}
