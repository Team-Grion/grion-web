import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from '@/lib/auth/constants';
import { getCookie, removeCookie, setCookie } from '@/lib/auth/cookie';

/**
 * 쿠키 보관 기간은 넉넉하게 둔다.
 * 토큰이 실제로 유효한지는 서버만 판단할 수 있고,
 * 만료된 경우는 API 응답 401 → refresh 흐름에서 처리한다.
 */
const TOKEN_MAX_AGE = 60 * 60 * 24 * 14; // 14일

export function getAccessToken(): string | null {
  return getCookie(ACCESS_TOKEN_COOKIE);
}

export function hasAccessToken(): boolean {
  return getAccessToken() !== null;
}

export function getRefreshToken(): string | null {
  return getCookie(REFRESH_TOKEN_COOKIE);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  setCookie(ACCESS_TOKEN_COOKIE, accessToken, { maxAge: TOKEN_MAX_AGE });
  setCookie(REFRESH_TOKEN_COOKIE, refreshToken, { maxAge: TOKEN_MAX_AGE });
}

export function setAccessToken(accessToken: string): void {
  setCookie(ACCESS_TOKEN_COOKIE, accessToken, { maxAge: TOKEN_MAX_AGE });
}

export function clearTokens(): void {
  removeCookie(ACCESS_TOKEN_COOKIE);
  removeCookie(REFRESH_TOKEN_COOKIE);
}
