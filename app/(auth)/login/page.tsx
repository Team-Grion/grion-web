import { KakaoLoginButton } from '@/components/kakao-login-button';

import { OnboardingCarousel } from '@/app/(auth)/login/_component/onboarding-carousel';

export default function OnboardingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-[radial-gradient(ellipse_at_top,#FFF8EC_0%,#FAF7F1_60%)]">
      <OnboardingCarousel />
      <div className="px-6 pb-8">
        <KakaoLoginButton />
      </div>
    </div>
  );
}
