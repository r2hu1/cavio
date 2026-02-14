import { aiRouter } from "@/modules/ai/server/procedures";
import { documentsRouter } from "@/modules/documents/server/procedures";
import { foldersRouter } from "@/modules/folders/server/procedures";
import { createTRPCRouter } from "../init";
export const appRouter = createTRPCRouter({
	document: documentsRouter,
	folder: foldersRouter,
	ai: aiRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
