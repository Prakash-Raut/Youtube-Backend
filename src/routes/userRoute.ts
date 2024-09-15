import { Router } from "express";
import {
	changeCurrentPassword,
	getCurrentUser,
	getUserChannelProfile,
	getWatchHistory,
	loginUser,
	logoutUser,
	refreshAccessToken,
	registerUser,
	updateAccountDetails,
	updateAvatar,
} from "../controllers/UserController";
import { verifyJWT } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/multerMiddleware";

const userRouter = Router();

userRouter.post(
	"/register",
	upload.fields([
		{ name: "avatar", maxCount: 1 },
		{ name: "coverImage", maxCount: 1 },
	]),
	registerUser
);

userRouter.post("/login", loginUser);

//secured routes
userRouter.post("/logout", verifyJWT, logoutUser);
userRouter.post("/refresh-token", refreshAccessToken);
userRouter.post("/change-password", verifyJWT, changeCurrentPassword);
userRouter.get("/current-user", verifyJWT, getCurrentUser);
userRouter.patch("/update-account", updateAccountDetails);
userRouter.patch("/avatar", verifyJWT, upload.single("avatar"), updateAvatar);
userRouter.patch(
	"/cover-image",
	verifyJWT,
	upload.single("coverImage"),
	updateAvatar
);
userRouter.get("/c/:username", verifyJWT, getUserChannelProfile);
userRouter.get("/history", verifyJWT, getWatchHistory);

export { userRouter };
