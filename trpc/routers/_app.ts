import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { premiumRouter } from "@/modules/premium/server/procedures";
import { documentsRouter } from "@/modules/documents/server/procedures";
import { foldersRouter } from "@/modules/folders/server/procedures";
import { aiRouter } from "@/modules/ai/server/procedures";
export const appRouter = createTRPCRouter({
  premium: premiumRouter,
  document: documentsRouter,
  folder: foldersRouter,
  ai: aiRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
