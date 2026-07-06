// ─── Types ────────────────────────────────────────────────────────────────────

export interface SponsorProfile {
  id: string;
  email: string;
  name: string;
  logo_emoji: string;
  category: string;
  created_at: string;
}

export interface ApiQuest {
  id: string;
  sponsor_id: string;
  title: string;
  description: string;
  challenge: string;
  category: string;
  reward: string;
  reward_icon: string;
  sponsor_logo: string;
  address: string;
  deadline: string;
  max_participants: number;
  proof_methods: string[];
  status: 'draft' | 'active' | 'ended';
  // Computed stats from JOIN
  participants: number;
  pending_reviews: number;
  approved: number;
  rejected: number;
  redeemed: number;
  created_at: string;
}

export interface ApiSubmission {
  id: string;
  quest_id: string;
  user_id: string;
  method: string;
  proof_uri: string | null;
  proof_note: string | null;
  submitted_at: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewer_note: string | null;
  // Joined fields
  user_name: string;
  user_email: string;
  quest_title: string;
  quest_category: string;
}

export interface ApiAnalytics {
  totalParticipants: number;
  totalApproved: number;
  totalRedeemed: number;
  avgCompletionRate: number;
  categoryBreakdown: { category: string; count: number; color?: string }[];
  questPerformance: {
    id: string;
    title: string;
    participants: number;
    approved: number;
    redeemed: number;
    completionRate: number;
  }[];
}

export interface CreateQuestBody {
  title: string;
  description: string;
  challenge: string;
  category: string;
  reward: string;
  reward_icon: string;
  sponsor_logo: string;
  address: string;
  latitude?: number;
  longitude?: number;
  deadline: string;
  max_participants: number;
  proof_methods: string[];
  status: 'draft' | 'active';
}

// ─── Client ───────────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://goalquest-api-production.up.railway.app';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('gq_sponsor_token');
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(options?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function sponsorLogin(email: string, password: string) {
  const data = await apiFetch<{ token: string; sponsor: SponsorProfile }>('/sponsor/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem('gq_sponsor_token', data.token);
  localStorage.setItem('gq_sponsor_name', data.sponsor.name);
  localStorage.setItem('gq_sponsor_auth', '1');
  return data;
}

export async function sponsorRegister(body: {
  email: string;
  password: string;
  name: string;
  logo_emoji?: string;
  category?: string;
}) {
  const data = await apiFetch<{ token: string; sponsor: SponsorProfile }>('/sponsor/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  localStorage.setItem('gq_sponsor_token', data.token);
  localStorage.setItem('gq_sponsor_name', data.sponsor.name);
  localStorage.setItem('gq_sponsor_auth', '1');
  return data;
}

export function sponsorLogout() {
  localStorage.removeItem('gq_sponsor_token');
  localStorage.removeItem('gq_sponsor_name');
  localStorage.removeItem('gq_sponsor_auth');
}

// ─── Quests ───────────────────────────────────────────────────────────────────

export async function getQuests() {
  return apiFetch<ApiQuest[]>('/sponsor/quests');
}

export async function createQuest(body: CreateQuestBody) {
  return apiFetch<ApiQuest>('/sponsor/quests', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getQuest(id: string) {
  return apiFetch<{ quest: ApiQuest; submissions: ApiSubmission[] }>(`/sponsor/quests/${id}`);
}

export async function updateQuest(id: string, body: Partial<CreateQuestBody>) {
  return apiFetch<ApiQuest>(`/sponsor/quests/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

// ─── Submissions ──────────────────────────────────────────────────────────────

export async function getSubmissions(status?: string) {
  const qs = status ? `?status=${status}` : '';
  return apiFetch<ApiSubmission[]>(`/sponsor/submissions${qs}`);
}

export async function reviewSubmission(
  id: string,
  status: 'approved' | 'rejected',
  reviewer_note?: string
) {
  return apiFetch<ApiSubmission>(`/sponsor/submissions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status, reviewer_note }),
  });
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export async function getAnalytics() {
  return apiFetch<ApiAnalytics>('/sponsor/analytics');
}
