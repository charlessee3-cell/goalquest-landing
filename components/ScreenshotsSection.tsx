import PhoneMockup from './PhoneMockup';

const screens = [
  { key: 'dashboard' as const, label: 'Dashboard', desc: 'See all your active habits, streaks, and milestone progress at a glance.' },
  { key: 'goals' as const,     label: 'Goals',     desc: 'Milestones sit above their linked habits — progress is automatic.' },
  { key: 'rewards' as const,   label: 'Rewards',   desc: 'Set real rewards, earn points, and redeem when you hit your targets.' },
];

export default function ScreenshotsSection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Inside the app</p>
          <h2 className="text-4xl font-black text-app-text text-balance">
            Built for the way you actually work
          </h2>
          <p className="text-subtext mt-4 max-w-xl mx-auto leading-relaxed">
            Clean, focused screens that get out of your way. No clutter — just your goals, your streaks, and your next reward.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {screens.map(({ key, label, desc }, i) => (
            <div
              key={key}
              className={`flex flex-col items-center text-center ${i === 1 ? 'md:-mt-6' : ''}`}
            >
              <PhoneMockup screen={key} />
              <div className="mt-6">
                <h3 className="text-lg font-bold text-app-text mb-2">{label}</h3>
                <p className="text-subtext text-sm leading-relaxed max-w-[200px] mx-auto">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
