'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAnalytics, ApiAnalytics } from '@/lib/sponsorApi';

const RANGES = ['Last 7 days', 'Last 30 days', 'All time'];

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

export default function AnalyticsPage() {
  const [range, setRange] = useState('Last 30 days');
  const [analytics, setAnalytics] = useState<ApiAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  if (error || !analytics) {
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

  const maxBreakdown =
    analytics.categoryBreakdown.length > 0
      ? Math.max(...analytics.categoryBreakdown.map((c) => c.count))
      : 1;

  const redemptionRate =
    analytics.totalApproved > 0
      ? Math.round((analytics.totalRedeemed / analytics.totalApproved) * 100)
      : 0;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-app-text">Analytics</h1>
          <p className="text-subtext text-sm mt-1">Track performance across all your SideQuests.</p>
        </div>
        <div className="flex gap-2">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                range === r
                  ? 'bg-primary text-white'
                  : 'bg-card border border-border text-subtext hover:text-app-text'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Participants',
            value: analytics.totalParticipants.toLocaleString(),
            sub: 'across all quests',
            icon: '👥',
          },
          {
            label: 'Completion Rate',
            value: `${analytics.avgCompletionRate}%`,
            sub: 'proof approved',
            icon: '✅',
          },
          {
            label: 'Redemption Rate',
            value: `${redemptionRate}%`,
            sub: 'of approved rewards',
            icon: '🎁',
          },
          {
            label: 'Total Approved',
            value: analytics.totalApproved.toLocaleString(),
            sub: 'submissions approved',
            icon: '⭐',
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-2xl shadow-soft p-5">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-bold text-app-text">{stat.value}</div>
            <div className="text-subtext text-xs mt-1 font-medium">{stat.label}</div>
            <div className="text-subtext text-xs mt-0.5">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Category breakdown */}
        <div className="bg-card border border-border rounded-2xl shadow-soft p-5">
          <h2 className="font-semibold text-app-text mb-4">Participants by Category</h2>
          {analytics.categoryBreakdown.length === 0 ? (
            <p className="text-subtext text-sm text-center py-6">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {analytics.categoryBreakdown.map((cat) => {
                const pct = Math.round((cat.count / maxBreakdown) * 100);
                const color =
                  cat.color ?? CATEGORY_COLORS[cat.category.toLowerCase()] ?? '#5C3524';
                return (
                  <div key={cat.category}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-app-text capitalize">{cat.category}</span>
                      <span className="text-subtext">{cat.count} participants</span>
                    </div>
                    <div className="h-2 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quest performance summary */}
        <div className="bg-card border border-border rounded-2xl shadow-soft p-5">
          <h2 className="font-semibold text-app-text mb-1">Quest Performance</h2>
          <p className="text-subtext text-xs mb-5">Completion rate per quest</p>
          {analytics.questPerformance.length === 0 ? (
            <p className="text-subtext text-sm text-center py-6">No quests yet.</p>
          ) : (
            <div className="space-y-3">
              {analytics.questPerformance.map((qp) => (
                <div key={qp.id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-app-text truncate max-w-[60%]">{qp.title}</span>
                    <span className="text-subtext">{qp.completionRate}% completion</span>
                  </div>
                  <div className="h-2 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${qp.completionRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quest performance table */}
      <div className="bg-card border border-border rounded-2xl shadow-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-app-text">Quest Performance Table</h2>
        </div>
        {analytics.questPerformance.length === 0 ? (
          <div className="px-5 py-8 text-center text-subtext text-sm">No quest data yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-subtext uppercase tracking-wide">
                    Quest
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-subtext uppercase tracking-wide">
                    Enrolled
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-subtext uppercase tracking-wide">
                    Approved
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-subtext uppercase tracking-wide">
                    Redeemed
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-subtext uppercase tracking-wide">
                    Rate
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {analytics.questPerformance.map((qp) => (
                  <tr key={qp.id} className="hover:bg-background transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-app-text leading-tight">{qp.title}</div>
                    </td>
                    <td className="px-4 py-3.5 text-right font-medium text-app-text">
                      {qp.participants}
                    </td>
                    <td className="px-4 py-3.5 text-right font-medium text-app-text">
                      {qp.approved}
                    </td>
                    <td className="px-4 py-3.5 text-right font-medium text-app-text">
                      {qp.redeemed}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          qp.completionRate >= 70
                            ? 'bg-green-100 text-green-700'
                            : qp.completionRate >= 40
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {qp.completionRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
