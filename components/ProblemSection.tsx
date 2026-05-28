const problems = [
  {
    icon: '📱',
    title: 'Apps track habits but go nowhere',
    body: "You log a workout. You get a checkmark. That's it. There's no bigger picture — no sense that today's effort is building toward anything meaningful.",
  },
  {
    icon: '💔',
    title: 'One miss and motivation collapses',
    body: "Streak breaks and most people quit within 48 hours. Every app resets your progress without giving you a way to recover momentum or understand why you fell off.",
  },
  {
    icon: '🤷',
    title: "You're grinding alone",
    body: "Accountability is the #1 predictor of follow-through. But most habit trackers are solo experiences — no one to cheer you on, challenge you, or notice when you go quiet.",
  },
];

export default function ProblemSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Sound familiar?</p>
          <h2 className="text-4xl font-black text-app-text text-balance">
            Most habit apps set you up to fail
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map(({ icon, title, body }) => (
            <div key={title} className="bg-background rounded-3xl p-8 border border-border">
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="text-lg font-bold text-app-text mb-3">{title}</h3>
              <p className="text-subtext leading-relaxed text-sm">{body}</p>
            </div>
          ))}
        </div>

        {/* Bridge line */}
        <p className="text-center text-subtext text-lg mt-14 font-medium">
          GoalQuest was built to fix all three.
        </p>
      </div>
    </section>
  );
}
