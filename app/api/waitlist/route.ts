import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Simple in-memory dedup for serverless warm instances (use a DB in production)
const seen = new Set<string>();

export async function POST(req: NextRequest) {
  // Lazy-init so build succeeds without env vars present
  const resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder');

  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }

    const normalised = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalised)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (seen.has(normalised)) {
      return NextResponse.json({ message: "You're already on the list! We'll be in touch. 🎉" });
    }
    seen.add(normalised);

    // Send confirmation to the user
    await resend.emails.send({
      from: 'GoalQuest <hello@goalquest.club>',
      to: normalised,
      subject: "You're on the GoalQuest waitlist! 🏆",
      html: `
        <div style="font-family: -apple-system, 'Inter', sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 24px; background: #F7F3F0;">
          <div style="background: #5C3524; border-radius: 20px; padding: 32px; text-align: center; margin-bottom: 24px;">
            <div style="font-size: 48px; margin-bottom: 12px;">🏆</div>
            <h1 style="color: white; font-size: 24px; font-weight: 800; margin: 0 0 8px;">You're on the list!</h1>
            <p style="color: rgba(255,255,255,0.75); margin: 0; font-size: 15px;">Welcome to the GoalQuest waitlist</p>
          </div>

          <div style="background: white; border-radius: 16px; padding: 24px; margin-bottom: 16px; border: 1px solid #E5D9D2;">
            <p style="color: #2B1510; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
              Hey there — thanks for joining early. We're putting the final touches on GoalQuest and you'll be among the <strong>first to know</strong> when we launch on iOS and Android.
            </p>
            <p style="color: #957A6E; font-size: 14px; line-height: 1.6; margin: 0;">
              In the meantime, here's what's waiting for you:
            </p>
          </div>

          <div style="background: white; border-radius: 16px; padding: 24px; border: 1px solid #E5D9D2;">
            ${[
              ['🔥', 'Habit streaks', 'Build momentum with daily streaks that mean something'],
              ['🏁', 'Milestones', 'Link habits to bigger goals — progress is automatic'],
              ['⭐', 'Real rewards', 'Set your own rewards and earn them with points'],
              ['👥', 'Social', 'Share wins, cheer friends, sponsor each other'],
            ].map(([e, t, d]) => `
              <div style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px;">
                <div style="font-size: 20px; margin-top: 2px;">${e}</div>
                <div>
                  <div style="font-weight: 700; color: #2B1510; font-size: 14px;">${t}</div>
                  <div style="color: #957A6E; font-size: 13px; margin-top: 2px;">${d}</div>
                </div>
              </div>
            `).join('')}
          </div>

          <p style="color: #957A6E; font-size: 12px; text-align: center; margin-top: 24px;">
            📬 <strong style="color: #5C3524;">Found this in Promotions?</strong> Move it to your Primary inbox so you don't miss our launch.<br><br>
            You're receiving this because you joined the waitlist at goalquest.club<br>
            <a href="mailto:support@goalquest.club" style="color: #5C3524;">Unsubscribe</a>
          </p>
        </div>
      `,
    });

    // Notify yourself of every new signup
    if (process.env.NOTIFY_EMAIL) {
      await resend.emails.send({
        from: 'GoalQuest Waitlist <hello@goalquest.club>',
        to: process.env.NOTIFY_EMAIL,
        subject: `New waitlist signup: ${normalised}`,
        html: `<p>New signup: <strong>${normalised}</strong></p>`,
      });
    }

    return NextResponse.json({ message: "You're on the list! Check your inbox for a confirmation. 🎉" });
  } catch (err) {
    console.error('Waitlist error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
