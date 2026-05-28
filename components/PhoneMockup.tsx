// Renders a phone frame with a simplified app screen inside.
// Pass screen="dashboard" | "goals" | "rewards"

type Screen = 'dashboard' | 'goals' | 'rewards';

function DashboardScreen() {
  return (
    <div className="flex flex-col h-full text-[8px] overflow-hidden">
      {/* Header */}
      <div className="bg-[#5C3524] px-3 pt-3 pb-2">
        <div className="text-white font-bold text-[9px]">GoalQuest 🏆</div>
        <div className="text-white/70 text-[7px] mt-0.5">Good morning! Ready to crush it?</div>
      </div>
      {/* Stats row */}
      <div className="flex gap-1 p-2 bg-[#F7F3F0]">
        {[['🔥 14', 'Best Streak'], ['3', 'Milestones'], ['8', 'Active Habits']].map(([n, l]) => (
          <div key={l} className="flex-1 bg-white rounded-lg p-1.5 text-center shadow-sm">
            <div className="font-bold text-[#2B1510] text-[8px]">{n}</div>
            <div className="text-[#957A6E] text-[6px] mt-0.5">{l}</div>
          </div>
        ))}
      </div>
      {/* Category tiles */}
      <div className="px-2 pb-1">
        <div className="text-[7px] font-semibold text-[#957A6E] uppercase tracking-wide mb-1.5">Categories</div>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { e: '💪', l: 'Fitness', c: '#A07868', bg: '#F5EDEA' },
            { e: '💼', l: 'Career', c: '#7D5C4F', bg: '#EEE5E1' },
            { e: '💰', l: 'Budget', c: '#4A2B22', bg: '#E8DAD5' },
            { e: '❤️', l: 'Health', c: '#9B7320', bg: '#F5EDD8' },
          ].map(({ e, l, c, bg }) => (
            <div key={l} className="rounded-lg p-2 flex items-center gap-1.5" style={{ backgroundColor: bg }}>
              <span className="text-[10px]">{e}</span>
              <span className="font-semibold text-[7px]" style={{ color: c }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Today habits */}
      <div className="px-2">
        <div className="text-[7px] font-semibold text-[#957A6E] uppercase tracking-wide mb-1.5">Today</div>
        {[
          { t: 'Morning Run', s: '🔥 12', done: true },
          { t: 'Read 20 min', s: '🔥 7', done: false },
        ].map(({ t, s, done }) => (
          <div key={t} className="bg-white rounded-lg p-1.5 mb-1 flex items-center justify-between shadow-sm">
            <div>
              <div className="font-semibold text-[#2B1510] text-[7px]">{t}</div>
              <div className="text-[#957A6E] text-[6px]">{s} in a row</div>
            </div>
            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[7px] ${done ? 'bg-[#6B8F71] text-white' : 'border border-[#E5D9D2]'}`}>
              {done ? '✓' : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GoalsScreen() {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#F7F3F0]">
      {/* Header */}
      <div className="bg-[#5C3524] px-3 pt-3 pb-2">
        <div className="text-white font-bold text-[9px]">My Goals</div>
      </div>
      {/* Filter chips */}
      <div className="flex gap-1.5 px-2 py-2 bg-white border-b border-[#E5D9D2]">
        {['All', 'Habits', 'Milestones'].map((f, i) => (
          <div key={f} className={`px-2 py-0.5 rounded-full text-[7px] font-semibold ${i === 0 ? 'bg-[#5C3524] text-white' : 'bg-[#EFE8E3] text-[#957A6E]'}`}>
            {f}
          </div>
        ))}
      </div>
      {/* Goal cards */}
      <div className="px-2 pt-2 flex flex-col gap-1.5">
        {/* Milestone */}
        <div className="bg-white rounded-xl p-2 shadow-sm border border-[#E5D9D2]">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-[8px]">🏁</span>
            <span className="text-[7px] font-bold text-[#2B1510]">Run a 5K</span>
            <span className="ml-auto text-[6px] bg-[#F5EDD8] text-[#9B7320] px-1 py-0.5 rounded-full font-semibold">68%</span>
          </div>
          <div className="h-1.5 bg-[#EFE8E3] rounded-full overflow-hidden">
            <div className="h-full bg-[#5C3524] rounded-full" style={{ width: '68%' }} />
          </div>
        </div>
        {/* Habits */}
        {[
          { t: 'Morning Run 3x/wk', s: 12, done: true },
          { t: 'Evening Stretch', s: 4, done: false },
        ].map(({ t, s, done }) => (
          <div key={t} className="bg-white rounded-xl p-2 shadow-sm border border-[#E5D9D2]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[7px] font-semibold text-[#2B1510]">{t}</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[6px] bg-[#F2EAE5] text-[#5C3524] px-1.5 py-0.5 rounded-full font-semibold">🔥 {s} in a row</span>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[7px] ${done ? 'bg-[#6B8F71] border-[#6B8F71] text-white' : 'border-[#E5D9D2]'}`}>
                {done ? '✓' : ''}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RewardsScreen() {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#F7F3F0]">
      {/* Header */}
      <div className="bg-[#5C3524] px-3 pt-3 pb-2">
        <div className="text-white font-bold text-[9px]">Reward Shop</div>
      </div>
      {/* Points balance */}
      <div className="mx-2 mt-2 bg-[#5C3524] rounded-xl p-3 text-center">
        <div className="text-white/80 text-[7px]">Your Balance</div>
        <div className="text-white font-bold text-[14px] mt-0.5">⭐ 1,240</div>
        <div className="text-white/60 text-[6px]">points available</div>
      </div>
      {/* Rewards */}
      <div className="px-2 pt-2 flex flex-col gap-1.5">
        {[
          { e: '🍕', t: 'Pizza Night', c: 300, locked: false },
          { e: '🎬', t: 'Movie Night', c: 500, locked: false },
          { e: '✈️', t: 'Weekend Trip', c: 2000, locked: true },
        ].map(({ e, t, c, locked }) => (
          <div key={t} className={`bg-white rounded-xl p-2 shadow-sm flex items-center gap-2 ${locked ? 'opacity-60' : ''}`}>
            <div className="w-7 h-7 bg-[#F2EAE5] rounded-lg flex items-center justify-center text-[12px]">{e}</div>
            <div className="flex-1">
              <div className="text-[7px] font-semibold text-[#2B1510]">{t}</div>
              <div className="text-[6px] text-[#957A6E]">⭐ {c} pts</div>
            </div>
            <div className={`text-[6px] font-semibold px-1.5 py-0.5 rounded-full ${locked ? 'bg-[#EFE8E3] text-[#957A6E]' : 'bg-[#6B8F71] text-white'}`}>
              {locked ? '🔒' : 'Redeem'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PhoneMockup({ screen = 'dashboard' }: { screen?: Screen }) {
  const screens: Record<Screen, React.ReactNode> = {
    dashboard: <DashboardScreen />,
    goals: <GoalsScreen />,
    rewards: <RewardsScreen />,
  };

  return (
    <div className="relative w-[160px] mx-auto select-none">
      {/* Phone shell */}
      <div className="relative bg-[#1C1C1E] rounded-[32px] p-[6px] shadow-strong">
        {/* Dynamic island */}
        <div className="absolute top-[14px] left-1/2 -translate-x-1/2 w-[40px] h-[8px] bg-black rounded-full z-10" />
        {/* Screen */}
        <div className="bg-[#F7F3F0] rounded-[28px] overflow-hidden" style={{ height: '320px' }}>
          <div className="pt-[18px] h-full">
            {screens[screen]}
          </div>
        </div>
        {/* Home indicator */}
        <div className="flex justify-center pt-1.5 pb-0.5">
          <div className="w-[40px] h-[3px] bg-white/40 rounded-full" />
        </div>
      </div>
    </div>
  );
}
