import axios, { type AxiosError } from 'axios';

import { LOGIN_PATH } from '@/lib/auth/constants';
import { clearTokens, getAccessToken } from '@/lib/auth/token';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // 서버에 토큰 재발급 엔드포인트가 아직 없으므로 만료 시 재로그인만 유도한다.
    // (access 30일 / refresh 60일이라 당장 만료가 잦지는 않다)
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      clearTokens();
      window.location.replace(LOGIN_PATH);
    }
    return Promise.reject(error);
  },
);
