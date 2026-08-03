import { AppTopBar } from '@/components/app-top-bar';
import { BottomNav } from '@/components/bottom-nav';
import { LeaveConfirmProvider } from '@/components/leave-confirm-provider';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <LeaveConfirmProvider>
        <AppTopBar />
        <main className="flex-1 pb-16">{children}</main>
        <BottomNav />
      </LeaveConfirmProvider>
    </div>
  );
}
