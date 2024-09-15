import { z } from "zod";

export const tweetCreateSchema = z.object({
	content: z.string().min(1).max(280),
});


export const tweetUpdateSchema = z.object({
    content: z.string().min(1).max(280),
});
