import z from "zod";

export const foldersSchema = z.object({
  title: z
    .string()
    .nonempty({ message: "Title is required" })
    .max(100, { message: "Folder name should not be this long!" }),
});

export const getFoldersByIdSchema = z.object({
  id: z.string(),
}); 

export const updateFoldersByIdSchema = z.object({
  title: z.string().min(1).max(100),
  documents: z.string().optional(),
  id: z.string(),
});
