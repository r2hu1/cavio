import z from "zod";

export const documentSchema = z.object({
  title: z.string(),
  content: z.string(),
  folderId: z.string(),
});
