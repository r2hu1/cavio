import z from "zod";

export const foldersSchema = z.object({
  title: z.string(),
});

export const getFoldersByIdSchema = z.object({
  id: z.string(),
});
