import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth/auth';

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  console.log(session);

  return (
    <div>
      <h1>대시보드</h1>
      <p>{session.user.name}님 안녕하세요</p>
    </div>
  );
}
