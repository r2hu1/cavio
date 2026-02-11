import { db } from "@/db/client";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { sendEmail } from "./email";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import "dotenv/config";

export const auth = betterAuth({
  trustedOrigins: ["http://localhost:3000", process.env.BETTER_AUTH_URL!],
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        type: "reset-password",
        to: user.email,
        subject: "Cavio - Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
    resetPasswordTokenExpiresIn: 3600,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      const verificationUrl = `${process.env.BETTER_AUTH_URL}/api/auth/verify-email?token=${token}&callbackURL=${process.env.EMAIL_VERIFICATION_CALLBACK_URL}`;
      await sendEmail({
        type: "verify-email",
        to: user.email,
        subject: "Cavio - Verify your email address",
        text: `Click the link to verify your email: ${verificationUrl}`,
      });
    },
  },
  user: {
    deleteUser: {
      enabled: true,
      afterDelete: async (u) => {
        await db.delete(user).where(eq(user.id, u.id));
      },
      sendDeleteAccountVerification: async ({ user, url, token }, request) => {
        await sendEmail({
          type: "delete-account",
          to: user.email,
          subject: "Cavio - Delete your account",
          text: `Click the link to delete your account: ${url}`,
        });
      },
    },
  },
});
