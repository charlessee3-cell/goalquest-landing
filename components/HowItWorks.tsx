const steps = [
  {
    number: '01',
    icon: '🎯',
    title: 'Set a goal',
    body: 'Create a habit (daily run, read 20 min) or a milestone (run a 5K, save $1,000). Pick a category, set a difficulty, and optionally link habits to a milestone so they power it automatically.',
  },
  {
    number: '02',
    icon: '🔥',
    title: 'Build your streak',
    body: "Complete your habit on schedule. Each completion grows your streak counter and earns points. Miss it — and the streak resets. Smart reminders adapt to when you actually show up.",
  },
  {
    number: '03',
    icon: '🏆',
    title: 'Earn your reward',
    body: "Hit milestones, rack up points, and redeem real rewards you've set for yourself. Share your wins, cheer friends on, and have them sponsor your next goal.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-primary-gradient">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-sm font-bold text-white/60 uppercase tracking-widest mb-3">Simple by design</p>
          <h2 className="text-4xl font-black text-white text-balance">
            Three steps. Infinite progress.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-px bg-white/10" />

          {steps.map(({ number, icon, title, body }) => (
            <div key={number} className="relative text-center">
              <div className="inline-flex flex-col items-center">
                {/* Step number */}
                <div className="text-white/20 text-7xl font-black leading-none mb-2 select-none">
                  {number}
                </div>
                {/* Icon bubble */}
                <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-3xl mb-5 -mt-4">
                  {icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-white/65 text-sm leading-relaxed max-w-xs">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
