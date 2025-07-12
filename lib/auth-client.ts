import { polarClient } from "@polar-sh/better-auth";
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  plugins: [polarClient()],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  forgetPassword,
  resetPassword,
  polar,
} = authClient;
