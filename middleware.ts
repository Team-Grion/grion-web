import { NextResponse, type NextRequest } from 'next/server';

import {
  ACCESS_TOKEN_COOKIE,
  HOME_PATH,
  LOGIN_PATH,
} from '@/lib/auth/constants';

/** 로그인하지 않아도 볼 수 있는 경로 */
const PUBLIC_PATHS = [LOGIN_PATH];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function middleware(request: NextRequest) {
  const hasToken = !!request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  if (!hasToken && !isPublicPath(pathname)) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  if (hasToken && isPublicPath(pathname)) {
    return NextResponse.redirect(new URL(HOME_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  // API 라우트, 정적 파일, 이미지 최적화 요청은 검사하지 않는다
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)'],
};
