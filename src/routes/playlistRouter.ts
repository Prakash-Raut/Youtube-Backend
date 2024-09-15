import { Router } from "express";
import {
	addVideoToPlaylist,
	createPlaylist,
	deletePlaylist,
	getPlaylistById,
	getUserPlaylists,
	removeVideoFromPlaylist,
	updatePlaylist,
} from "../controllers/PlaylistController";
import { verifyJWT } from "../middlewares/authMiddleware";

const playlistRouter = Router();

playlistRouter.use(verifyJWT);

playlistRouter.post("/", createPlaylist);

playlistRouter.get("/:playlistId", getPlaylistById);
playlistRouter.patch("/:playlistId", updatePlaylist);
playlistRouter.delete("/:playlistId", deletePlaylist);

playlistRouter.patch("/add/:videoId/:playlistId", addVideoToPlaylist);
playlistRouter.patch("/remove/:videoId/:playlistId", removeVideoFromPlaylist);

playlistRouter.get("/user/:userId", getUserPlaylists);

export { playlistRouter };
