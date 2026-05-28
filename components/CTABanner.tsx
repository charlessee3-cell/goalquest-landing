import WaitlistForm from './WaitlistForm';

export default function CTABanner() {
  return (
    <section className="py-24 bg-primary-gradient">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div className="text-5xl mb-6">🏆</div>
        <h2 className="text-4xl font-black text-white mb-4 text-balance">
          Ready to start keeping your goals?
        </h2>
        <p className="text-white/70 text-lg mb-10 leading-relaxed">
          Join the waitlist — be first in line when GoalQuest launches on iOS and Android.
          Early members get priority access and the first look at new features.
        </p>
        <WaitlistForm dark />
      </div>
    </section>
  );
}
