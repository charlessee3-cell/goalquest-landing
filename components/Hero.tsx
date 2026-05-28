import PhoneMockup from './PhoneMockup';
import WaitlistForm from './WaitlistForm';

export default function Hero() {
  return (
    <section className="relative bg-primary-gradient min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background texture rings */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/5" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Copy */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="text-sm">🚀</span>
              <span className="text-white/90 text-xs font-semibold tracking-wide">Launching Soon · iOS & Android</span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-black text-white leading-tight text-balance mb-6">
              Stop Setting Goals.<br />
              <span className="text-primary-light">Start Keeping Them.</span>
            </h1>

            <p className="text-lg text-white/75 leading-relaxed mb-8 max-w-lg">
              GoalQuest links your daily habits to the milestones that matter — so every rep, run, and routine
              builds toward something real. Track it. Earn it. Share it.
            </p>

            {/* Social proof mini-stat */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex -space-x-2">
                {['🧑', '👩', '👨', '👧', '🧑‍💼'].map((e, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-white/20 border-2 border-primary flex items-center justify-center text-sm">
                    {e}
                  </div>
                ))}
              </div>
              <p className="text-white/70 text-sm">
                <span className="text-white font-semibold">Join early members</span> already on the waitlist
              </p>
            </div>

            {/* Waitlist form */}
            <div id="waitlist">
              <WaitlistForm dark />
            </div>
          </div>

          {/* Phone mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full scale-75" />
              {/* Main phone */}
              <div className="relative z-10">
                <PhoneMockup screen="dashboard" />
              </div>
              {/* Floating badge — streak */}
              <div className="absolute -left-8 top-16 bg-white rounded-2xl px-3 py-2 shadow-strong flex items-center gap-2 text-xs font-semibold text-app-text">
                <span className="text-lg">🔥</span>
                <div>
                  <div className="font-bold text-primary">14-day streak!</div>
                  <div className="text-subtext text-[10px]">Keep it up</div>
                </div>
              </div>
              {/* Floating badge — points */}
              <div className="absolute -right-6 bottom-20 bg-white rounded-2xl px-3 py-2 shadow-strong flex items-center gap-2 text-xs font-semibold text-app-text">
                <span className="text-lg">⭐</span>
                <div>
                  <div className="font-bold text-primary">+35 pts earned</div>
                  <div className="text-subtext text-[10px]">Goal completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
