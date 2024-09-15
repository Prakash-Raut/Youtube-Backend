import { Router } from "express";
import {
	getSubscribedChannels,
	getUserChannelSubscribers,
	toggleSubscription,
} from "../controllers/SubscriptionController";
import { verifyJWT } from "../middlewares/authMiddleware";

const subscriptionRouter = Router();
subscriptionRouter.use(verifyJWT);

subscriptionRouter.get("/c/:channelId", getSubscribedChannels);
subscriptionRouter.post("/c/:channelId", toggleSubscription);

subscriptionRouter.get("/u/:subscriberId", getUserChannelSubscribers);

export { subscriptionRouter };
