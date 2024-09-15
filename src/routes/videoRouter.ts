import { Router } from "express";
import {
	deleteVideo,
	getAllVideos,
	getVideoById,
	publishAVideo,
	togglePublishStatus,
	updateVideo,
} from "../controllers/VideoController";
import { verifyJWT } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/multerMiddleware";

const videoRouter = Router();

videoRouter.use(verifyJWT);

videoRouter.get("/", getAllVideos);
videoRouter.post(
	"/",
	upload.fields([
		{
			name: "videoFile",
			maxCount: 1,
		},
		{
			name: "thumbnail",
			maxCount: 1,
		},
	]),
	publishAVideo
);

videoRouter.get("/:videoId", getVideoById);
videoRouter.delete("/:videoId", deleteVideo);
videoRouter.patch("/:videoId", upload.single("thumbnail"), updateVideo);

videoRouter.patch("/toggle/publish/:videoId", togglePublishStatus);

export { videoRouter };
