import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth/auth';

import { Toaster } from '@/components/ui/sonner';
import { BottomNav } from '@/components/bottom-nav';
import { TopAppBar } from '@/components/top-app-bar';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect('/login');

  return (
    <div className="relative flex min-h-dvh flex-col">
      <TopAppBar />
      <main className="flex-1 pb-16">{children}</main>
      <BottomNav />
      <Toaster position="bottom-center" offset={80} />
    </div>
  );
}
