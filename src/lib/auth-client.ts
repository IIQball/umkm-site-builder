import { createAuthClient } from "better-auth/svelte";

export const authClient = createAuthClient({
  baseURL: import.meta.env.SITE_URL || "http://localhost:4321",
});

export const { signIn, signUp, signOut, useSession } = authClient;
