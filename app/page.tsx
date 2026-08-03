import { redirect } from 'next/navigation';

import { HOME_PATH } from '@/lib/auth/constants';

export default function Page() {
  // 로그인 여부는 middleware가 이미 판단했으므로 여기선 홈으로 보내기만 한다
  redirect(HOME_PATH);
}
