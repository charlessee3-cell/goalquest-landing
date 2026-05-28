import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://goalquest.club'),
  title: {
    default: 'GoalQuest — Stop Setting Goals. Start Keeping Them.',
    template: '%s | GoalQuest',
  },
  description:
    'GoalQuest links your daily habits to the milestones that matter — so every rep, run, and routine builds toward something real. Track streaks, hit milestones, earn rewards, share your wins.',
  keywords: ['habit tracker', 'goal setting', 'streaks', 'milestones', 'rewards', 'productivity', 'accountability', 'fitness goals'],
  authors: [{ name: 'GoalQuest' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://goalquest.club',
    siteName: 'GoalQuest',
    title: 'GoalQuest — Stop Setting Goals. Start Keeping Them.',
    description:
      'Build daily habits. Hit milestones. Earn real rewards. Share your wins. Coming soon to iOS & Android.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'GoalQuest App' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GoalQuest — Stop Setting Goals. Start Keeping Them.',
    description: 'Build daily habits. Hit milestones. Earn real rewards.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
