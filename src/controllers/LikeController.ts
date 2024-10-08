import { Request, Response } from "express";
import { Like } from "../models/Like";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const toggleVideoLike = asyncHandler(async (req: Request, res: Response) => {
	const { videoId } = req.params;

	// Check if the like already exists
	const existingVideoLike = await Like.findOne({
		video: videoId,
		likedBy: req.user?._id,
	});

	// If like exists, remove it (unlike)
	if (existingVideoLike) {
		const deletedVideoLike = await Like.findByIdAndDelete(
			existingVideoLike._id
		);

		if (!deletedVideoLike) {
			return new ApiError(
				400,
				"Something went wrong while unliking video"
			);
		}

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					deletedVideoLike,
					"Video unliked successfully"
				)
			);
	}

	// Otherwise, create a new like
	const video = await Like.create({
		video: videoId,
		likedBy: req.user?._id,
	});

	if (!video) {
		return new ApiError(400, "Something went wrong while liking video");
	}

	return res
		.status(201)
		.json(new ApiResponse(201, video, "Video liked successfully"));
});

const toggleCommentLike = asyncHandler(async (req: Request, res: Response) => {
	const { commentId } = req.params;

	const existingCommentLike = await Like.findOne({
		comment: commentId,
		likedBy: req.user?._id,
	});

	// If like exists, remove it (unlike)
	if (existingCommentLike) {
		const deletedCommentLike = await Like.findByIdAndDelete(
			existingCommentLike._id
		);

		if (!deletedCommentLike) {
			return new ApiError(
				400,
				"Something went wrong while unliking comment"
			);
		}

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					deletedCommentLike,
					"Comment unliked successfully"
				)
			);
	}

	const comment = await Like.create({
		comment: commentId,
		likedBy: req.user?._id,
	});

	if (!comment) {
		return new ApiError(400, "Something went wrong while liking comment");
	}

	return res
		.status(201)
		.json(new ApiResponse(201, comment, "Comment liked successfully"));
});

const toggleTweetLike = asyncHandler(async (req: Request, res: Response) => {
	const { tweetId } = req.params;

	const existingTweetLike = await Like.findOne({
		tweet: tweetId,
		likedBy: req.user?._id,
	});

	if (existingTweetLike) {
		const deletedTweetLike = await Like.findByIdAndDelete(
			existingTweetLike._id
		);

		if (!deletedTweetLike) {
			return new ApiError(
				400,
				"Something went wrong while unliking tweet"
			);
		}

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					deletedTweetLike,
					"Tweet unliked successfully"
				)
			);
	}

	const tweet = await Like.create({
		tweet: tweetId,
		likedBy: req.user?._id,
	});

	if (!tweet) {
		return new ApiError(400, "Something went wrong while liking tweet");
	}

	return res
		.status(201)
		.json(new ApiResponse(201, tweet, "Tweet liked successfully"));
});

const getLikedVideos = asyncHandler(async (req: Request, res: Response) => {
	const likedVideos = await Like.find({
		likedBy: req.user?._id,
		video: { $exists: true },
	})
		.populate("video")
		.exec();

	if (!likedVideos || likedVideos.length === 0) {
		return new ApiError(404, "No liked videos found");
	}

	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				likedVideos,
				"Liked videos fetched successfully"
			)
		);
});

export { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike };
