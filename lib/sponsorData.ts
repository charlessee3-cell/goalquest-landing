// ─── Types ────────────────────────────────────────────────────────────────────

export type SponsorQuest = {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  sponsorLogo: string;
  reward: string;
  rewardIcon: string;
  deadline: string; // ISO date string
  status: 'active' | 'draft' | 'ended';
  participants: number;
  pendingReviews: number;
  approved: number;
  rejected: number;
  redeemed: number;
  maxParticipants: number;
  description: string;
  challenge: string;
  proofMethods: ('photo' | 'healthkit' | 'goalquest' | 'strava' | 'canvas')[];
};

export type Submission = {
  id: string;
  questId: string;
  questTitle: string;
  questCategory: string;
  categoryColor: string;
  userId: string;
  userName: string;
  userInitials: string;
  submittedAt: string; // ISO datetime string
  method: 'photo' | 'healthkit' | 'goalquest' | 'strava' | 'canvas';
  proofNote: string;
  status: 'pending' | 'approved' | 'rejected';
};

export type CategoryBreakdown = {
  category: string;
  count: number;
  color: string;
};

export type AnalyticsSummary = {
  totalParticipants: number;
  totalApproved: number;
  totalRedeemed: number;
  avgCompletionRate: number;
  categoryBreakdown: CategoryBreakdown[];
};

// ─── Demo Credentials ─────────────────────────────────────────────────────────

export const DEMO_CREDENTIALS = {
  email: 'sponsor@goalquest.club',
  password: 'demo1234',
};

// ─── Mock Quests ──────────────────────────────────────────────────────────────

export const SPONSOR_QUESTS: SponsorQuest[] = [
  {
    id: 'q1',
    title: 'Morning Mile Club',
    category: 'Fitness',
    categoryColor: '#4A90D9',
    sponsorLogo: '🏃',
    reward: '1 Month Free Membership',
    rewardIcon: '🎟️',
    deadline: '2026-07-31',
    status: 'active',
    participants: 247,
    pendingReviews: 3,
    approved: 189,
    rejected: 12,
    redeemed: 43,
    maxParticipants: 500,
    description: 'Kick off your morning with a mile run every day for 30 days. Track your progress and earn a free gym membership!',
    challenge: 'Complete a 1-mile run each morning for 30 consecutive days. Log your run via Strava or Apple Health.',
    proofMethods: ['strava', 'healthkit'],
  },
  {
    id: 'q2',
    title: 'Brew at Home Challenge',
    category: 'Lifestyle',
    categoryColor: '#8B5A2B',
    sponsorLogo: '☕',
    reward: '$25 Coffee Credit',
    rewardIcon: '💳',
    deadline: '2026-08-15',
    status: 'active',
    participants: 134,
    pendingReviews: 0,
    approved: 98,
    rejected: 8,
    redeemed: 28,
    maxParticipants: 300,
    description: 'Skip the coffee shop and brew at home for 2 weeks. Save money, discover new flavors, earn rewards.',
    challenge: 'Brew your own coffee at home every day for 14 days. No coffee shop purchases allowed. Share your daily brew photo.',
    proofMethods: ['photo', 'goalquest'],
  },
  {
    id: 'q3',
    title: 'LinkedIn Hustle',
    category: 'Career',
    categoryColor: '#0077B5',
    sponsorLogo: '💼',
    reward: 'LinkedIn Premium (3 months)',
    rewardIcon: '⭐',
    deadline: '2026-09-01',
    status: 'active',
    participants: 89,
    pendingReviews: 0,
    approved: 61,
    rejected: 5,
    redeemed: 14,
    maxParticipants: 200,
    description: 'Build your professional brand by posting consistently on LinkedIn for 21 days.',
    challenge: 'Post one original piece of content on LinkedIn every day for 21 days. Each post must be original thought leadership.',
    proofMethods: ['canvas', 'photo'],
  },
  {
    id: 'q4',
    title: 'Community Cleanup Day',
    category: 'Community',
    categoryColor: '#6B8F71',
    sponsorLogo: '🌱',
    reward: '$50 Local Business Gift Card',
    rewardIcon: '🎁',
    deadline: '2026-07-20',
    status: 'ended',
    participants: 312,
    pendingReviews: 0,
    approved: 280,
    rejected: 22,
    redeemed: 198,
    maxParticipants: 400,
    description: 'Join your neighbors in a community cleanup event. Make your neighborhood shine and earn rewards for your effort.',
    challenge: 'Participate in a community cleanup event. Collect at least 2 bags of trash and document your work.',
    proofMethods: ['photo'],
  },
  {
    id: 'q5',
    title: '30-Day Content Creator',
    category: 'Creativity',
    categoryColor: '#C4892A',
    sponsorLogo: '🎨',
    reward: 'Adobe Creative Cloud (1 year)',
    rewardIcon: '🖥️',
    deadline: '2026-10-01',
    status: 'draft',
    participants: 0,
    pendingReviews: 0,
    approved: 0,
    rejected: 0,
    redeemed: 0,
    maxParticipants: 150,
    description: 'Create and publish original content every day for 30 days. Build your portfolio, grow your audience.',
    challenge: 'Publish one original piece of creative content daily for 30 days. Can be video, photo, writing, music, or art.',
    proofMethods: ['photo', 'canvas', 'goalquest'],
  },
];

// ─── Mock Submissions ─────────────────────────────────────────────────────────

export const SUBMISSIONS: Submission[] = [
  {
    id: 's1',
    questId: 'q1',
    questTitle: 'Morning Mile Club',
    questCategory: 'Fitness',
    categoryColor: '#4A90D9',
    userId: 'u1',
    userName: 'Alex Johnson',
    userInitials: 'AJ',
    submittedAt: '2026-07-05T07:23:00Z',
    method: 'strava',
    proofNote: 'Completed my morning mile in 8:42. Strava activity linked to run along the riverside trail.',
    status: 'pending',
  },
  {
    id: 's2',
    questId: 'q1',
    questTitle: 'Morning Mile Club',
    questCategory: 'Fitness',
    categoryColor: '#4A90D9',
    userId: 'u2',
    userName: 'Maria Santos',
    userInitials: 'MS',
    submittedAt: '2026-07-05T06:55:00Z',
    method: 'healthkit',
    proofNote: 'Apple Health shows 1.2 miles run this morning at 6:50 AM. Screenshot attached.',
    status: 'pending',
  },
  {
    id: 's3',
    questId: 'q1',
    questTitle: 'Morning Mile Club',
    questCategory: 'Fitness',
    categoryColor: '#4A90D9',
    userId: 'u3',
    userName: 'David Kim',
    userInitials: 'DK',
    submittedAt: '2026-07-04T07:11:00Z',
    method: 'strava',
    proofNote: 'Day 15 of 30. Strava shows 1.05 miles in 9:15. Feeling great!',
    status: 'approved',
  },
  {
    id: 's4',
    questId: 'q2',
    questTitle: 'Brew at Home Challenge',
    questCategory: 'Lifestyle',
    categoryColor: '#8B5A2B',
    userId: 'u4',
    userName: 'Sarah Chen',
    userInitials: 'SC',
    submittedAt: '2026-07-05T08:30:00Z',
    method: 'photo',
    proofNote: 'My morning pour-over with Ethiopian beans! Day 7 complete. Recipe and grind notes attached.',
    status: 'pending',
  },
  {
    id: 's5',
    questId: 'q2',
    questTitle: 'Brew at Home Challenge',
    questCategory: 'Lifestyle',
    categoryColor: '#8B5A2B',
    userId: 'u5',
    userName: 'James Miller',
    userInitials: 'JM',
    submittedAt: '2026-07-04T09:00:00Z',
    method: 'goalquest',
    proofNote: 'Logged my daily brew habit in GoalQuest. 11-day streak going strong. French press today.',
    status: 'approved',
  },
  {
    id: 's6',
    questId: 'q3',
    questTitle: 'LinkedIn Hustle',
    questCategory: 'Career',
    categoryColor: '#0077B5',
    userId: 'u6',
    userName: 'Priya Patel',
    userInitials: 'PP',
    submittedAt: '2026-07-05T10:45:00Z',
    method: 'canvas',
    proofNote: 'Posted about the future of remote work tools. Got 847 impressions and 34 reactions. Link in Canvas submission.',
    status: 'approved',
  },
  {
    id: 's7',
    questId: 'q3',
    questTitle: 'LinkedIn Hustle',
    questCategory: 'Career',
    categoryColor: '#0077B5',
    userId: 'u7',
    userName: 'Tom Richards',
    userInitials: 'TR',
    submittedAt: '2026-07-03T14:20:00Z',
    method: 'photo',
    proofNote: 'Screenshot of my post about leadership lessons. Only 12 impressions though...',
    status: 'rejected',
  },
  {
    id: 's8',
    questId: 'q1',
    questTitle: 'Morning Mile Club',
    questCategory: 'Fitness',
    categoryColor: '#4A90D9',
    userId: 'u8',
    userName: 'Emma Wilson',
    userInitials: 'EW',
    submittedAt: '2026-07-05T06:30:00Z',
    method: 'healthkit',
    proofNote: 'Apple Health confirms 1.1 miles at 6:25 AM this morning. Day 22 of my streak!',
    status: 'approved',
  },
  {
    id: 's9',
    questId: 'q2',
    questTitle: 'Brew at Home Challenge',
    questCategory: 'Lifestyle',
    categoryColor: '#8B5A2B',
    userId: 'u9',
    userName: 'Carlos Ruiz',
    userInitials: 'CR',
    submittedAt: '2026-07-02T08:15:00Z',
    method: 'photo',
    proofNote: 'Attempted cold brew for first time. Left beans soaking in fridge. Photo shows setup.',
    status: 'rejected',
  },
  {
    id: 's10',
    questId: 'q3',
    questTitle: 'LinkedIn Hustle',
    questCategory: 'Career',
    categoryColor: '#0077B5',
    userId: 'u10',
    userName: 'Lisa Thompson',
    userInitials: 'LT',
    submittedAt: '2026-07-05T11:00:00Z',
    method: 'canvas',
    proofNote: 'Day 18 - shared a case study about scaling startup teams. 2.3k impressions, 89 reactions, 12 comments.',
    status: 'pending',
  },
];

// ─── Analytics Summary ────────────────────────────────────────────────────────

export const ANALYTICS: AnalyticsSummary = {
  totalParticipants: 782,
  totalApproved: 628,
  totalRedeemed: 283,
  avgCompletionRate: 76.4,
  categoryBreakdown: [
    { category: 'Fitness', count: 247, color: '#4A90D9' },
    { category: 'Community', count: 312, color: '#6B8F71' },
    { category: 'Lifestyle', count: 134, color: '#8B5A2B' },
    { category: 'Career', count: 89, color: '#0077B5' },
  ],
};
