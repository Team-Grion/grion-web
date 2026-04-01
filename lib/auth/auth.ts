import { betterAuth } from 'better-auth';

export const auth = betterAuth({
  socialProviders: {
    kakao: {
      clientId: process.env.KAKAO_CLIENT_ID as string,
      clientSecret: process.env.KAKAO_CLIENT_SECRET as string,
      scopes: ['profile_nickname', 'profile_image'],
    },
  },
});
