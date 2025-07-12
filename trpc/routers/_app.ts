import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { premiumRouter } from "@/modules/premium/server/procedures";
export const appRouter = createTRPCRouter({
  premium: premiumRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
