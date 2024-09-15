import { Request, Response } from "express";
import { Playlist } from "../models/Playlist";
import { Video } from "../models/Video";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const createPlaylist = asyncHandler(async (req: Request, res: Response) => {
	try {
		const { name, description } = req.body;

		const playlist = await Playlist.create({
			name,
			description,
			owner: req.user?._id,
		});

		if (!playlist) {
			return new ApiError(
				400,
				"Something went wrong while creating playlist"
			);
		}

		return res
			.status(201)
			.json(
				new ApiResponse(201, playlist, "Playlist created successfully")
			);
	} catch (error) {
		return res
			.status(500)
			.json(new ApiResponse(500, null, "Internal server error"));
	}
});

const getUserPlaylists = asyncHandler(async (req: Request, res: Response) => {
	try {
		const { userId } = req.params;

		const playlists = await Playlist.find({ owner: userId });

		if (!playlists) {
			return new ApiError(404, "No playlists found");
		}

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					playlists,
					"User playlists fetched successfully"
				)
			);
	} catch (error) {
		return res
			.status(500)
			.json(new ApiResponse(500, null, "Internal server error"));
	}
});

const getPlaylistById = asyncHandler(async (req: Request, res: Response) => {
	try {
		const { playlistId } = req.params;

		const playlist = await Playlist.findById(playlistId);

		if (!playlist) {
			return new ApiError(404, "No playlist found");
		}

		return res
			.status(200)
			.json(
				new ApiResponse(200, playlist, "Playlist fetched successfully")
			);
	} catch (error) {
		return res
			.status(500)
			.json(new ApiResponse(500, null, "Internal server error"));
	}
});

const addVideoToPlaylist = asyncHandler(async (req: Request, res: Response) => {
	try {
		const { playlistId, videoId } = req.params;

		const playlist = await Playlist.findById(playlistId);

		if (!playlist) {
			return new ApiError(404, "No playlist found");
		}

		const video = await Video.findById(videoId);

		if (!video) {
			return new ApiError(404, "No video found");
		}

		const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId, {
			$addToSet: { videos: video },
		});

		if (!updatedPlaylist) {
			return new ApiError(
				500,
				"Something went wrong while adding video to playlist"
			);
		}

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					updatePlaylist,
					"Video added to playlist successfully"
				)
			);
	} catch (error) {
		return res
			.status(500)
			.json(new ApiResponse(500, null, "Internal server error"));
	}
});

const removeVideoFromPlaylist = asyncHandler(
	async (req: Request, res: Response) => {
		try {
			const { playlistId, videoId } = req.params;

			const updatedPlaylist = await Playlist.findByIdAndUpdate(
				playlistId,
				{
					$pull: { videos: videoId },
				}
			);

			if (!updatedPlaylist) {
				return new ApiError(
					500,
					"Something went wrong while removing video from playlist"
				);
			}

			return res
				.status(200)
				.json(
					new ApiResponse(
						200,
						updatedPlaylist,
						"Video removed from playlist successfully"
					)
				);
		} catch (error) {
			return res
				.status(500)
				.json(new ApiResponse(500, null, "Internal server error"));
		}
	}
);

const deletePlaylist = asyncHandler(async (req: Request, res: Response) => {
	try {
		const { playlistId } = req.params;
		// TODO: delete playlist

		const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);

		if (!deletedPlaylist) {
			return new ApiError(404, "No playlist found");
		}

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					deletedPlaylist,
					"Playlist deleted successfully"
				)
			);
	} catch (error) {
		return res
			.status(500)
			.json(new ApiResponse(500, null, "Internal server error"));
	}
});

const updatePlaylist = asyncHandler(async (req: Request, res: Response) => {
	try {
		const { playlistId } = req.params;
		const { name, description } = req.body;

		const updatedPlaylist = await Playlist.findByIdAndUpdate(
			playlistId,
			{ name, description },
			{ new: true }
		);

		if (!updatedPlaylist) {
			return new ApiError(
				500,
				"Something went wrong while updating playlist"
			);
		}

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					updatedPlaylist,
					"Playlist updated successfully"
				)
			);
	} catch (error) {
		return res
			.status(500)
			.json(new ApiResponse(500, null, "Internal server error"));
	}
});

export {
	addVideoToPlaylist,
	createPlaylist,
	deletePlaylist,
	getPlaylistById,
	getUserPlaylists,
	removeVideoFromPlaylist,
	updatePlaylist,
};
