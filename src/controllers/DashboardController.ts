import { Request, Response } from "express";
import { Like } from "../models/Like";
import { Subscription } from "../models/Subscription";
import { Video } from "../models/Video";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const getChannelStats = asyncHandler(async (req: Request, res: Response) => {
	// TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

	try {
		const videos = await Video.find({ owner: req.user?._id });

		if (!videos) {
			return new ApiError(404, "No videos found");
		}

		const totalVideos = videos.length;

		const totalVideoViews = videos.reduce(
			(acc, video) => acc + video.views,
			0
		);

		const subscribers = await Subscription.find({ channel: req.user?._id });

		if (!subscribers) {
			return new ApiError(404, "No subscribers found");
		}

		const totalSubscribers = subscribers.length;

		const liked = await Like.find({
			video: { $in: videos.map((video) => video._id) },
		});

		if (!liked) {
			return new ApiError(404, "No likes found");
		}

		const totalLikes = liked.length;

		return res.status(200).json(
			new ApiResponse(
				200,
				{
					totalVideoViews,
					totalSubscribers,
					totalVideos,
					totalLikes,
				},
				"Channel Stats"
			)
		);
	} catch (error) {
		return res
			.status(500)
			.json(new ApiResponse(500, null, "Internal server error"));
	}
});

const getChannelVideos = asyncHandler(async (req: Request, res: Response) => {
	// TODO: Get all the videos uploaded by the channel

	try {
		const videos = await Video.find({ owner: req.user?._id });

		if (!videos) {
			return new ApiError(404, "No videos found");
		}

		return res.status(200).json(new ApiResponse(200, videos, "Videos"));
	} catch (error) {
		return res
			.status(500)
			.json(new ApiResponse(500, null, "Internal server error"));
	}
});

export { getChannelStats, getChannelVideos };
