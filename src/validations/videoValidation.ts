import { z } from "zod";

export const videoCreateSchema = z.object({
	title: z.string().min(1).max(100),
	description: z.string().min(1).max(500),
});

export const videoUpdateSchema = z.object({
	title: z.string().min(1).max(100),
	description: z.string().min(1).max(500),
	thumbnail: z.string().min(1),
	duration: z.number().min(1),
});

export const videoStatusUpdateSchema = z.object({
	videoId: z.string(),
	isPublished: z.boolean(),
});

export const videoQuerySchema = z.object({
	page: z
		.string()
		.optional()
		.default("1")
		.transform((val) => parseInt(val, 10)),
	limit: z
		.string()
		.optional()
		.default("10")
		.transform((val) => parseInt(val, 10)),
	query: z.string().optional(),
	sortBy: z.string().optional().default("createdAt"),
	sortType: z.enum(["asc", "desc"]).optional().default("desc"),
	userId: z.string().optional(),
});
