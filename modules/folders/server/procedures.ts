import { db } from "@/db/client";
import { polarClient } from "@/lib/polar";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { count, eq } from "drizzle-orm";
import z from "zod";
import { TRPCError } from "@trpc/server";
import { folders } from "@/db/schema";
import { foldersSchema, getFoldersByIdSchema } from "../schema";

export const foldersRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ input, ctx }) => {
    const [currentFolders] = await db
      .select()
      .from(folders)
      .where(eq(folders.userId, ctx.auth.user.id));
    return currentFolders;
  }),
  create: premiumProcedure()
    .input(foldersSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdFolder] = await db
        .insert(folders)
        .values({
          title: input.title,
          userId: ctx.auth.user.id,
          documents: JSON.stringify(input.documents),
        })
        .returning();
      return createdFolder;
    }),
  getById: protectedProcedure
    .input(getFoldersByIdSchema)
    .query(async ({ input, ctx }) => {
      const [folder] = await db
        .select()
        .from(folders)
        .where(eq(folders.id, input.id));
      if (!folder) throw new TRPCError({ code: "NOT_FOUND" });
      if (folder.userId != ctx.auth.user.id)
        throw new TRPCError({ code: "UNAUTHORIZED" });
      return JSON.parse(folder.documents);
    }),
});
