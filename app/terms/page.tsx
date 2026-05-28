import type { Metadata } from 'next';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'GoalQuest Terms of Service.',
};

export default function TermsPage() {
  return (
    <>
      <main className="max-w-3xl mx-auto px-6 py-24">
        <a href="/" className="text-primary text-sm font-semibold hover:underline mb-8 inline-block">← Back to GoalQuest</a>
        <h1 className="text-4xl font-black text-app-text mb-4">Terms of Service</h1>
        <p className="text-subtext text-sm mb-10">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="space-y-8 text-sm">
          {[
            ['1. Acceptance', 'By using GoalQuest (the "App") or visiting goalquest.club (the "Site"), you agree to these Terms. If you do not agree, do not use our services.'],
            ['2. Use of the App', 'GoalQuest is a personal productivity tool. You agree to use it only for lawful purposes and in a way that does not infringe the rights of others. You are responsible for the content you create within the app (goals, notes, photos).'],
            ['3. No Warranty', 'GoalQuest is provided "as is" without warranty of any kind. We do not guarantee that the app will be error-free, uninterrupted, or that it will meet your specific requirements.'],
            ['4. Limitation of Liability', 'To the fullest extent permitted by law, GoalQuest and its creators shall not be liable for any indirect, incidental, or consequential damages arising from your use of the app or site.'],
            ['5. Intellectual Property', 'All content, branding, and code in the GoalQuest app and website are owned by GoalQuest. You may not copy, reproduce, or distribute any part of our product without written permission.'],
            ['6. Termination', 'We reserve the right to discontinue the service at any time. You may stop using the app at any time.'],
            ['7. Governing Law', 'These Terms are governed by the laws of the jurisdiction in which GoalQuest is registered.'],
            ['8. Changes', 'We may update these Terms at any time. Continued use of the app after changes constitutes acceptance of the new Terms.'],
            ['9. Contact', 'Questions about these Terms? Contact us at support@goalquest.club.'],
          ].map(([title, body]) => (
            <section key={title as string}>
              <h2 className="text-xl font-bold text-app-text mb-3">{title}</h2>
              <p className="text-subtext leading-relaxed">
                {title === '9. Contact'
                  ? <>{body.split('support@goalquest.club')[0]}<a href="mailto:support@goalquest.club" className="text-primary hover:underline">support@goalquest.club</a>.</>
                  : body
                }
              </p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
