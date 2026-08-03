interface CookieOptions {
  /** 초 단위 보관 기간. 생략하면 브라우저를 닫을 때까지만 유지된다. */
  maxAge?: number;
  path?: string;
  sameSite?: 'Lax' | 'Strict' | 'None';
  secure?: boolean;
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const prefix = `${encodeURIComponent(name)}=`;
  for (const entry of document.cookie.split('; ')) {
    if (entry.startsWith(prefix)) {
      return decodeURIComponent(entry.slice(prefix.length));
    }
  }
  return null;
}

export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {},
): void {
  if (typeof document === 'undefined') return;

  const {
    maxAge,
    path = '/',
    sameSite = 'Lax',
    secure = window.location.protocol === 'https:',
  } = options;

  const parts = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    `path=${path}`,
    `samesite=${sameSite}`,
  ];
  if (maxAge !== undefined) parts.push(`max-age=${maxAge}`);
  if (secure) parts.push('secure');

  document.cookie = parts.join('; ');
}

export function removeCookie(name: string, path = '/'): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${encodeURIComponent(name)}=; path=${path}; max-age=0`;
}
