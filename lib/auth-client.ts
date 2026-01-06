import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : "http://localhost:3000"),
  fetchOptions: {
    credentials: "include",
    onError: (ctx) => {
      console.error("Auth error:", ctx.error);
    },
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;
