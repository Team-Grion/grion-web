import { betterAuth } from 'better-auth';
import { createPool } from 'mysql2/promise';

export const auth = betterAuth({
  database: createPool(process.env.DATABASE_URL as string),
  socialProviders: {
    kakao: {
      clientId: process.env.KAKAO_CLIENT_ID as string,
      clientSecret: process.env.KAKAO_CLIENT_SECRET as string,
      scopes: ['profile_nickname', 'profile_image'],
    },
  },
});
