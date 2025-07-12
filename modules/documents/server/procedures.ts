import { db } from "@/db/client";
import { documents } from "@/db/schema";
import { polarClient } from "@/lib/polar";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { count, eq } from "drizzle-orm";
import z from "zod";
import { documentSchema } from "../schema";
import { TRPCError } from "@trpc/server";

export const documentsRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ input, ctx }) => {
    const [document] = await db
      .select()
      .from(documents)
      .where(eq(documents.userId, ctx.auth.user.id));
    // if (!document || document.userId !== ctx.auth.user.id) {
    //   throw new TRPCError({ code: "UNAUTHORIZED", message: "UNAUTHORIZED" });
    // }
    return document;
  }),
  create: premiumProcedure()
    .input(documentSchema)
    .mutation(async ({ input, ctx }) => {
      const [document] = await db
        .insert(documents)
        .values({ ...input, userId: ctx.auth.user.id })
        .returning();
      return document;
    }),
});
