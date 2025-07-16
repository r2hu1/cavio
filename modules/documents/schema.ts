import z from "zod";

export const documentSchema = z.object({
  title: z.string(),
  content: z.string().min(1).max(Infinity),
  folderId: z.string(),
});
