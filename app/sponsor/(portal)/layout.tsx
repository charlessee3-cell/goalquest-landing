import SponsorShell from '@/components/SponsorShell';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  // pendingCount is managed dynamically within the shell via submissions fetched per-page
  return <SponsorShell>{children}</SponsorShell>;
}
