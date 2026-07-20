import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth/auth';

import { Toaster } from '@/components/ui/sonner';
import { AppTopBar } from '@/components/app-top-bar';
import { BottomNav } from '@/components/bottom-nav';
import { LeaveConfirmProvider } from '@/components/leave-confirm-provider';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect('/login');

  return (
    <div className="relative flex min-h-dvh flex-col">
      <LeaveConfirmProvider>
        <AppTopBar />
        <main className="flex-1 pb-16">{children}</main>
        <BottomNav />
      </LeaveConfirmProvider>
      <Toaster position="bottom-center" offset={80} />
    </div>
  );
}
