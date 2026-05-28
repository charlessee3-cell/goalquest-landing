import type { Metadata } from 'next';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'GoalQuest Privacy Policy — how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  return (
    <>
      <main className="max-w-3xl mx-auto px-6 py-24">
        <a href="/" className="text-primary text-sm font-semibold hover:underline mb-8 inline-block">← Back to GoalQuest</a>
        <h1 className="text-4xl font-black text-app-text mb-4">Privacy Policy</h1>
        <p className="text-subtext text-sm mb-10">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="prose prose-sm max-w-none text-app-text space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-3">1. Information We Collect</h2>
            <p className="text-subtext leading-relaxed">GoalQuest currently stores all data locally on your device using AsyncStorage. We do not collect, transmit, or store any personal data on external servers at this time. Your goals, habits, streaks, and history remain on your device unless you choose to export them.</p>
            <p className="text-subtext leading-relaxed mt-3">When you join our waitlist at goalquest.club, we collect your email address solely to notify you of our launch. We use Resend to send transactional emails and do not share your email with any third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">2. How We Use Your Information</h2>
            <p className="text-subtext leading-relaxed">Your email address (waitlist only) is used exclusively to:</p>
            <ul className="list-disc pl-6 text-subtext space-y-1 mt-2">
              <li>Confirm your place on the waitlist</li>
              <li>Notify you when GoalQuest launches</li>
              <li>Share important product updates relevant to early members</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">3. Data Sharing</h2>
            <p className="text-subtext leading-relaxed">We do not sell, trade, or rent your personal information to any third party. We do not use your data for advertising purposes.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">4. Data Retention</h2>
            <p className="text-subtext leading-relaxed">Waitlist emails are retained until you request removal or until six months after the app launch, whichever comes first. In-app data is stored locally on your device and can be deleted at any time via Settings → Reset All Data.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">5. Your Rights</h2>
            <p className="text-subtext leading-relaxed">You may request deletion of your waitlist email at any time by contacting us at <a href="mailto:support@goalquest.club" className="text-primary hover:underline">support@goalquest.club</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">6. Changes to This Policy</h2>
            <p className="text-subtext leading-relaxed">We will update this policy as the app evolves. Material changes will be communicated via email to waitlist members and in-app to existing users.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">7. Contact</h2>
            <p className="text-subtext leading-relaxed">Questions? Reach us at <a href="mailto:support@goalquest.club" className="text-primary hover:underline">support@goalquest.club</a>.</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
