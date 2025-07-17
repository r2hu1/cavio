import z from "zod";

export const foldersSchema = z.object({
  title: z.string(),
});

export const getFoldersByIdSchema = z.object({
  id: z.string(),
});

export const updateFoldersByIdSchema = z.object({
  title: z.string().min(1).max(100),
  documents: z.string().optional(),
  id: z.string(),
});
