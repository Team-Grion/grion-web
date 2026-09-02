import { NextResponse, type NextRequest } from 'next/server';

import {
  ACCESS_TOKEN_COOKIE,
  HOME_PATH,
  LOGIN_PATH,
} from '@/lib/auth/constants';

/** 로그인 여부와 무관하게 항상 열려있는 경로 (하위 경로 포함) */
const OPEN_PATHS = ['/public-memorial'];

/**
 * 로그인 없이도 페이지는 열리지만, 안의 콘텐츠는 로그인 여부에 따라 갈리는 경로.
 * 정확히 일치할 때만 허용한다 — 예: '/memorial'은 열리지만 '/memorial/create'는
 * 로그인이 필요하다.
 */
const SOFT_GATE_PATHS = ['/', HOME_PATH, '/settings'];

function matchesPrefix(pathname: string, paths: string[]): boolean {
  return paths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function middleware(request: NextRequest) {
  const hasToken = !!request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  if (matchesPrefix(pathname, OPEN_PATHS)) {
    return NextResponse.next();
  }

  const isLoginPath = matchesPrefix(pathname, [LOGIN_PATH]);
  const isSoftGated = SOFT_GATE_PATHS.includes(pathname);

  if (!hasToken && !isLoginPath && !isSoftGated) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  if (hasToken && isLoginPath) {
    return NextResponse.redirect(new URL(HOME_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  // API 라우트, 정적 파일, 이미지 최적화 요청은 검사하지 않는다
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)'],
};
