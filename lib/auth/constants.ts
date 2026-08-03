/**
 * 브라우저(token.ts)와 서버(middleware.ts) 양쪽에서 참조하므로
 * 브라우저 API에 의존하지 않는 파일로 분리한다.
 */
export const ACCESS_TOKEN_COOKIE = 'grion_access_token';
export const REFRESH_TOKEN_COOKIE = 'grion_refresh_token';

export const LOGIN_PATH = '/login';
export const HOME_PATH = '/memorial';
