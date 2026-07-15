import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth/auth';

import { Toaster } from '@/components/ui/sonner';
import { AppTopBar } from '@/components/app-top-bar';
import { BottomNav } from '@/components/bottom-nav';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect('/login');

  return (
    <div className="relative flex min-h-dvh flex-col">
      <AppTopBar />
      <main className="flex-1 pb-16">{children}</main>
      <BottomNav />
      <Toaster position="bottom-center" offset={80} />
    </div>
  );
}
