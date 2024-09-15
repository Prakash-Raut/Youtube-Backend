import {z} from "zod";

export const commentCreateSchema = z.object({
    text: z.string().min(1).max(500),
});

export const commentUpdateSchema = z.object({
    text: z.string().min(1).max(500),
});

export const commentDeleteSchema = z.object({
    commentId: z.string(),
});