'use client';

import { useState } from 'react';

const faqs = [
  {
    q: 'Is GoalQuest free?',
    a: 'Yes — completely free to download and use. No subscriptions, no paywalls on core features. We believe accountability tools should be accessible to everyone.',
  },
  {
    q: "What's the difference between a habit and a milestone?",
    a: "Habits are recurring actions — things you do on a schedule (daily run, read 20 minutes). Milestones are bigger goals with a finish line (run a 5K, save $1,000). The magic happens when you link habits to a milestone: every habit completion automatically moves your milestone progress forward.",
  },
  {
    q: 'How do the rewards work?',
    a: 'You set your own rewards — anything that motivates you. A pizza night, a new pair of shoes, a weekend away. Every habit completion earns points based on difficulty. When you have enough points, you redeem the reward. Friends and family can even sponsor a reward for you.',
  },
  {
    q: 'What are Smart Reminders?',
    a: "GoalQuest watches when you actually complete each habit and uses that pattern to automatically shift your reminder time. If you always run at 7am but your reminder is set for 8am, it adjusts. No manual tweaking needed.",
  },
  {
    q: 'Can I use it with Apple Health or a fitness wearable?',
    a: 'Apple Health integration (auto-completing fitness habits from your activity data) is on our roadmap and coming in a future update. For now, habits are logged manually with optional photo proof.',
  },
  {
    q: 'When is GoalQuest launching?',
    a: "We're putting the finishing touches on the app now. Join the waitlist and you'll be the first to know — plus you'll get priority access when we go live.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-semibold text-app-text text-sm">{q}</span>
        <span className={`text-primary transition-transform shrink-0 ${open ? 'rotate-45' : ''}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </button>
      {open && (
        <p className="text-subtext text-sm leading-relaxed pb-5">{a}</p>
      )}
    </div>
  );
}

export default function FAQSection() {
  return (
    <section id="faq" className="py-24 bg-background">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Got questions?</p>
          <h2 className="text-4xl font-black text-app-text">Frequently asked</h2>
        </div>

        <div className="bg-card rounded-3xl border border-border shadow-soft px-8">
          {faqs.map((faq) => (
            <FAQItem key={faq.q} {...faq} />
          ))}
        </div>
      </div>
    </section>
  );
}
