import localFont from 'next/font/local';

/**
 * Geist는 라틴 문자 전용이라 한글이 대부분인 이 앱에서 실제로는
 * 시스템 기본 폰트로 렌더링되고 있었다. Pretendard로 교체한다.
 */
export const pretendard = localFont({
  src: '../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});
