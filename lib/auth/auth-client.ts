import { createAuthClient } from 'better-auth/client';

export const authClient = createAuthClient();

export const signIn = async () => {
  const data = await authClient.signIn.social({
    provider: 'kakao',
  });
};

export const signOut = async () => {
  await authClient.signOut();
};

export const useSession = async () => {
  const session = await authClient.getSession();
  return session;
};
