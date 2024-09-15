import { Router } from "express";
import {
	createTweet,
	deleteTweet,
	getUserTweets,
	updateTweet,
} from "../controllers/TweetController";
import { verifyJWT } from "../middlewares/authMiddleware";

const tweetRouter = Router();

tweetRouter.use(verifyJWT);

tweetRouter.post("/", createTweet);
tweetRouter.get("/user/:userId", getUserTweets);
tweetRouter.patch("/:tweetId", updateTweet);
tweetRouter.delete("/:tweetId", deleteTweet);

export { tweetRouter };
