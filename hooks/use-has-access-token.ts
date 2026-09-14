import { useSyncExternalStore } from 'react';

import { hasAccessToken } from '@/lib/auth/token';

function subscribe() {
  return () => {};
}

/**
 * 토큰은 브라우저 쿠키에만 있어 서버는 로그인 여부를 알 수 없다.
 * 서버 렌더와 하이드레이션 첫 렌더에서는 `null`(모름)을 돌려주고,
 * 그 직후 클라이언트에서 실제 값으로 다시 렌더한다.
 */
export function useHasAccessToken(): boolean | null {
  return useSyncExternalStore(subscribe, hasAccessToken, () => null);
}
