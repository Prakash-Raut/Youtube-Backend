import {z} from "zod";

export const likeCreateSchema = z.object({
    postId: z.string(),
});