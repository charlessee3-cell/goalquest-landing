import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const APP_STORE_URL  = 'https://apps.apple.com/app/id000000000';       // ← update after App Store approval
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.goalquest.app';
const FALLBACK_URL   = 'https://goalquest.club';

export default async function DownloadPage() {
  const headersList = await headers();
  const ua = headersList.get('user-agent') ?? '';

  if (/android/i.test(ua)) redirect(PLAY_STORE_URL);
  if (/iphone|ipad|ipod/i.test(ua)) redirect(APP_STORE_URL);

  // Desktop or unknown — show a page with both store links
  return (
    <main className="min-h-screen bg-primary-gradient flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-strong">
        <div className="text-6xl mb-4">🏆</div>
        <h1 className="text-2xl font-black text-app-text mb-2">Download GoalQuest</h1>
        <p className="text-subtext mb-8 text-sm leading-relaxed">
          Open this link on your iPhone or Android phone, or choose your store below.
        </p>
        <div className="flex flex-col gap-3">
          <a
            href={APP_STORE_URL}
            className="bg-primary text-white font-bold py-4 rounded-2xl hover:bg-primary-dark transition-colors text-sm"
          >
            📱 Download on the App Store
          </a>
          <a
            href={PLAY_STORE_URL}
            className="bg-app-text text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity text-sm"
          >
            🤖 Get it on Google Play
          </a>
          <a href={FALLBACK_URL} className="text-subtext text-xs mt-2 hover:text-primary">
            ← Back to goalquest.club
          </a>
        </div>
      </div>
    </main>
  );
}
