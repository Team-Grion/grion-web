import { isAxiosError } from 'axios';

import type { ApiResponse } from '@/types/api';

/**
 * 사용자에게 보여줄 실패 사유를 뽑아낸다.
 * 서버가 이유를 ApiResponse.message에 담아주므로 그것을 가장 먼저 본다.
 */
export function describeApiError(error: unknown): string {
  if (isAxiosError(error)) {
    const message = (error.response?.data as ApiResponse<unknown> | undefined)
      ?.message;
    if (message) return message;
  }

  if (error instanceof Error) return error.message;

  // 카카오 SDK는 Error가 아닌 평범한 객체로 실패를 알려준다
  if (error && typeof error === 'object') {
    const { error: code, error_description: description } = error as {
      error?: string;
      error_description?: string;
    };
    if (code || description) {
      return [code, description].filter(Boolean).join(': ');
    }
  }

  return '잠시 후 다시 시도해주세요';
}

/**
 * 서버가 요청 내용을 보고 거절한 경우(4xx)인지 판단한다.
 * 비방글 차단처럼 사용자에게 사유를 알려주면 끝나는 실패라 에러 로그를 남길 필요가 없다.
 */
export function isRejectedByServer(error: unknown): boolean {
  if (!isAxiosError(error) || !error.response) return false;
  const { status } = error.response;
  return status >= 400 && status < 500;
}
