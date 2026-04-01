'use client';

import { authClient } from '@/lib/auth/auth-client';

export default function LoginPage() {
  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: 'kakao',
      callbackURL: '/dashboard',
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <div>
        <button onClick={handleLogin} className="cursor-pointer">
          카카오로 로그인
        </button>
      </div>
    </div>
  );
}
