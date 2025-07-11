import { polarClient } from "@polar-sh/better-auth";
import { createAuthClient } from "better-auth/react";
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  forgetPassword,
  resetPassword,
  polar,
} = createAuthClient({
  plugins: [polarClient()],
});
