import { Request, Response } from "express";
import { Tweet } from "../models/Tweet";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import {
	tweetCreateSchema,
	tweetUpdateSchema,
} from "../validations/tweetValidation";

const createTweet = asyncHandler(async (req: Request, res: Response) => {
	const result = tweetCreateSchema.safeParse(req.body);

	if (!result.success) {
		return new ApiError(400, "Validation Error");
	}

	const tweet = await Tweet.create({
		content: result.data.content,
		owner: req.user?._id,
	});

	if (!tweet) {
		return new ApiError(400, "Something went wrong while adding tweet");
	}

	return res
		.status(201)
		.json(new ApiResponse(201, tweet, "Tweet added successfully"));
});

const getUserTweets = asyncHandler(async (req: Request, res: Response) => {
	const tweets = await Tweet.find({ owner: req.user?._id });

	if (!tweets) {
		return new ApiError(404, "Tweets not found");
	}

	return res.status(200).json(new ApiResponse(200, tweets, "User tweets"));
});

const updateTweet = asyncHandler(async (req: Request, res: Response) => {
	const { tweetId } = req.params;

	const result = tweetUpdateSchema.safeParse(req.body);

	if (!result.success) {
		return new ApiError(400, "Validation Error");
	}

	const tweet = await Tweet.findByIdAndUpdate(tweetId, {
		content: result.data.content,
	});

	if (!tweet) {
		return new ApiError(404, "Tweet not found");
	}

	return res
		.status(200)
		.json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req: Request, res: Response) => {
	const { tweetId } = req.params;

	const tweet = await Tweet.findByIdAndDelete(tweetId);

	if (!tweet) {
		return new ApiError(404, "Something went wrong while deleting tweet");
	}

	return res
		.status(200)
		.json(new ApiResponse(200, tweet, "Tweet deleted successfully"));
});

export { createTweet, deleteTweet, getUserTweets, updateTweet };
