import { Router } from "express";
import {
	getChannelStats,
	getChannelVideos,
} from "../controllers/DashboardController";
import { verifyJWT } from "../middlewares/authMiddleware";

const dashboardRouter = Router();

dashboardRouter.use(verifyJWT);

dashboardRouter.get("/stats", getChannelStats);
dashboardRouter.get("/videos", getChannelVideos);

export { dashboardRouter };
