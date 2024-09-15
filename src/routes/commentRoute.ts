import { Router } from "express";
import {
	addComment,
	deleteComment,
	getVideoComments,
	updateComment,
} from "../controllers/CommentController";
import { verifyJWT } from "../middlewares/authMiddleware";

const commentRouter = Router();

commentRouter.use(verifyJWT);

commentRouter.get("/:videoId", getVideoComments);
commentRouter.post("/:videoId", addComment);
commentRouter.delete("/c/:commentId", deleteComment);
commentRouter.patch("/c/:commentId", updateComment);

export { commentRouter };
