import z from "zod";

export const documentSchema = z.object({
	title: z.string(),
	content: z.string().optional().default(""),
	isPublished: z.boolean().optional().default(false),
	privacy: z.string().optional().default("private"),
	collaborators: z.array(z.string()).optional().default([]),
	url: z.string().optional().default(""),
	folderId: z.string(),
});
