export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary-dark py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <span className="text-2xl">🏆</span>
            <span>GoalQuest</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-white/50">
            <a href="/privacy" className="hover:text-white/80 transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-white/80 transition-colors">Terms of Service</a>
            <a href="mailto:support@goalquest.club" className="hover:text-white/80 transition-colors">Support</a>
          </div>

          {/* Copyright */}
          <p className="text-white/40 text-sm">
            © {year} GoalQuest. All rights reserved.
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-white/30 text-xs">
            Built for accountability · goalquest.club
          </p>
        </div>
      </div>
    </footer>
  );
}
