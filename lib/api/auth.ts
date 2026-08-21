import type { ApiResponse } from '@/types/api';

import { apiClient } from '@/lib/api/client';

export interface KakaoLoginResult {
  accessToken: string;
  refreshToken: string;
  userId: number;
}

/** 카카오에서 받은 accessToken을 서버 JWT로 교환한다. */
export async function loginWithKakao(
  kakaoAccessToken: string,
): Promise<KakaoLoginResult> {
  const response = await apiClient.post<ApiResponse<KakaoLoginResult>>(
    '/auth/kakao',
    { accessToken: kakaoAccessToken },
  );

  const { data, message } = response.data;
  if (!data) {
    throw new Error(message ?? '로그인 응답에 토큰이 없어요');
  }
  return data;
}
