import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  subscription: text("subscription"),
  updatedAt: timestamp("updated_at").notNull(),
  onboardingCompleted: boolean("onboarding_completed").notNull().default(false),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey(),
  createdTime: timestamp("created_time").defaultNow(),
  subscriptionId: text("subscription_id"),
  stripeUserId: text("stripe_user_id"),
  status: text("status"),
  startDate: text("start_date"),
  endDate: text("end_date"),
  planId: text("plan_id"),
  defaultPaymentMethodId: text("default_payment_method_id"),
  email: text("email"),
  userId: text("user_id"),
});

export const subscriptionPlans = pgTable("subscriptions_plans", {
  id: text("id").primaryKey(),
  createdTime: timestamp("created_time").defaultNow(),
  planId: text("plan_id"),
  name: text("name"),
  description: text("description"),
  amount: text("amount"),
  currency: text("currency"),
  interval: text("interval"),
});

export const invoices = pgTable("invoices", {
  id: text("id").primaryKey(),
  createdTime: timestamp("created_time").defaultNow(),
  invoiceId: text("invoice_id"),
  subscriptionId: text("subscription_id"),
  amountPaid: text("amount_paid"),
  amountDue: text("amount_due"),
  currency: text("currency"),
  status: text("status"),
  email: text("email"),
  userId: text("user_id"),
});

export const feedback = pgTable("feedback", {
  id: text("id").primaryKey(),
  createdTime: timestamp("created_time").defaultNow(),
  userId: text("user_id"),
  feedbackContent: text("feedback_content"),
  stars: integer().notNull(),
});
