import { Request, Response } from "express";
import { Subscription } from "../models/Subscription";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const toggleSubscription = asyncHandler(async (req: Request, res: Response) => {
	const { channelId } = req.params;

	const subs = await Subscription.create({
		subscriber: req.user?._id,
		channel: channelId,
	});

	if (!subs) {
		return new ApiError(400, "Something went wrong while subscribing");
	}

	return res.status(200).json(new ApiResponse(200, subs, "Subscribed"));
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(
	async (req: Request, res: Response) => {
		const { channelId } = req.params;

		const subscribers = await Subscription.find({ channel: channelId });

		if (!subscribers) {
			return new ApiError(404, "No subscribers found");
		}

		return res
			.status(200)
			.json(new ApiResponse(200, subscribers, "Subscribers"));
	}
);

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(
	async (req: Request, res: Response) => {
		const { subscriberId } = req.params;

		const subscribedChannels = await Subscription.find({
			subscriber: subscriberId,
		});

		if (!subscribedChannels) {
			return new ApiError(404, "No subscribed channels found");
		}

		return res
			.status(200)
			.json(
				new ApiResponse(200, subscribedChannels, "Subscribed channels")
			);
	}
);

export { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription };
