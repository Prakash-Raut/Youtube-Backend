import { Router } from "express";
import {
	getLikedVideos,
	toggleCommentLike,
	toggleTweetLike,
	toggleVideoLike,
} from "../controllers/LikeController";
import { verifyJWT } from "../middlewares/authMiddleware";

const likeRouter = Router();

likeRouter.use(verifyJWT);

likeRouter.post("/toggle/v/:videoId", toggleVideoLike);
likeRouter.post("/toggle/c/:commentId", toggleCommentLike);
likeRouter.post("/toggle/t/:tweetId", toggleTweetLike);
likeRouter.get("/videos", getLikedVideos);

export { likeRouter };
