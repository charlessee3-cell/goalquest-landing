const features = [
  {
    icon: '🔥',
    color: '#FFF3E0',
    title: 'Streak Tracking',
    body: 'Build unstoppable momentum with habit streaks that reset if you miss — so consistency is always on the line. See your personal bests grow.',
  },
  {
    icon: '🏁',
    color: '#E8F5E9',
    title: 'Milestones',
    body: 'Link daily habits to bigger goals. Every completion automatically moves you closer to the finish line. Hit the target, unlock the reward.',
  },
  {
    icon: '⭐',
    color: '#FFF8E1',
    title: 'Real Rewards',
    body: "Earn points for every completion. Set your own rewards — a pizza night, a weekend trip, new gear — and redeem them when you've earned it.",
  },
  {
    icon: '👥',
    color: '#E3F2FD',
    title: 'Social Accountability',
    body: 'Add friends, share progress, cheer each other on, and sponsor each other\'s rewards. Goals are easier when someone\'s watching.',
  },
  {
    icon: '⏰',
    color: '#F3E5F5',
    title: 'Smart Reminders',
    body: "GoalQuest learns when you actually complete habits and automatically shifts your reminders to match. No more pings at the wrong time.",
  },
  {
    icon: '📊',
    color: '#E0F7FA',
    title: 'Progress Analytics',
    body: 'Visualise 7 and 30-day completion trends. See which categories you crush and where you need more focus.',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-sm font-bold text-primary uppercase tracking-widest mb-3">What you get</p>
          <h2 className="text-4xl font-black text-app-text text-balance">
            Everything you need to actually follow through
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon, color, title, body }) => (
            <div
              key={title}
              className="bg-card rounded-3xl p-8 border border-border shadow-soft hover:shadow-medium transition-shadow"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"
                style={{ backgroundColor: color }}
              >
                {icon}
              </div>
              <h3 className="text-lg font-bold text-app-text mb-2">{title}</h3>
              <p className="text-subtext text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
