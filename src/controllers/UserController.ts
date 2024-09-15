import type { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../config/cloudinary";
import { REFRESH_TOKEN_SECRET } from "../config/env";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import {
	createUserSchema,
	getUserChannelProfileSchema,
	loginUserSchema,
	updateUserPasswordSchema,
	updateUserSchema,
} from "../validations/userValidation";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
	try {
		const result = createUserSchema.safeParse(req.body);

		if (!result.success) {
			throw new ApiError(400, "All feilds are required", result.error);
		}

		const existedUser = await User.findOne({
			$or: [
				{ username: result.data.username },
				{ email: result.data.email },
			],
		});

		if (existedUser) {
			throw new ApiError(
				409,
				"User with email or username already exists"
			);
		}

		console.log("Files: ", req.files);

		if (!req.files?.avatar) {
			throw new ApiError(400, "Avatar is required");
		}

		if (!req.files?.coverImage) {
			throw new ApiError(400, "Cover image is not provided");
		}

		const avatarLocalPath = req.files?.avatar[0]?.path;

		const coverImageLocalPath = req.files?.coverImage[0]?.path;

		if (!avatarLocalPath) {
			throw new ApiError(400, "Avatar is required");
		}

		const avatar = await uploadOnCloudinary(avatarLocalPath);
		const coverImage = await uploadOnCloudinary(coverImageLocalPath);

		if (!avatar) {
			throw new ApiError(500, "Failed to upload avatar");
		}

		const user = await User.create({
			email: result.data.email,
			fullName: result.data.fullName,
			password: result.data.password,
			username: result.data.username.toLowerCase(),
			avatar: avatar.url,
			coverImage: coverImage?.url ?? "",
		});

		const createdUser = await User.findById(user._id).select(
			"-password -refreshToken"
		);

		if (!createdUser) {
			throw new ApiError(500, "Something went wrong while creating user");
		}

		return res
			.status(201)
			.json(
				new ApiResponse(
					200,
					createdUser,
					"User registered successfully"
				)
			);
	} catch (error) {
		return res
			.status(500)
			.json(new ApiResponse(500, null, "Internal server error"));
	}
});

const generateAccessAndRefereshTokens = async (userId: string) => {
	try {
		const user = await User.findById(userId);

		if (!user) {
			throw new ApiError(404, "User not found");
		}

		const accessToken = await user.generateAccessToken();

		const refreshToken = await user.generateRefreshToken();

		if (refreshToken) {
			user.refreshToken = refreshToken;
		}

		await user.save({ validateBeforeSave: false });

		return { accessToken, refreshToken };
	} catch (error) {
		console.log("Error: ", error);
		throw new ApiError(
			500,
			"Something went wrong while generating referesh and access token"
		);
	}
};

const loginUser = asyncHandler(async (req: Request, res: Response) => {
	try {
		const result = loginUserSchema.safeParse(req.body);

		if (!result.success) {
			throw new ApiError(400, "All feilds are required");
		}

		const user = await User.findOne({
			$or: [
				{ username: result.data.username },
				{ email: result.data.email },
			],
		});

		if (!user) {
			throw new ApiError(404, "User does not exist");
		}

		const isMatch = await user.isPasswordCorrect(result.data.password);

		if (!isMatch) {
			throw new ApiError(400, "Invalid credentials");
		}

		const { accessToken, refreshToken } =
			await generateAccessAndRefereshTokens(user._id.toString());

		if (!accessToken || !refreshToken) {
			throw new ApiError(500, "Failed to generate tokens");
		}

		const loggedInUser = await User.findById(user._id).select(
			"-password -refreshToken"
		);

		const options = {
			httpOnly: true,
			secure: true,
		};

		return res
			.status(200)
			.cookie("accessToken", accessToken, options)
			.cookie("refreshToken", refreshToken, options)
			.json(
				new ApiResponse(
					200,
					{
						user: loggedInUser,
						accessToken,
						refreshToken,
					},
					"User logged in successfully"
				)
			);
	} catch (error) {
		return res
			.status(500)
			.json(new ApiResponse(500, null, "Internal server error"));
	}
});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
	try {
		await User.findByIdAndUpdate(
			req.user?._id,
			{
				$unset: {
					refreshToken: 1,
				},
			},
			{
				new: true,
			}
		);

		const options = {
			httpOnly: true,
			secure: true,
		};

		return res
			.status(200)
			.clearCookie("accessToken", options)
			.clearCookie("refreshToken", options)
			.json(new ApiResponse(200, null, "User logged out successfully"));
	} catch (error) {
		return res
			.status(500)
			.json(new ApiResponse(500, null, "Internal server error"));
	}
});

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
	try {
		const incomingRefreshToken =
			req.cookies?.refreshToken || req.body.refreshToken;

		if (!incomingRefreshToken) {
			throw new ApiError(401, "Unauthorized request");
		}

		const decodedToken = jwt.verify(
			incomingRefreshToken,
			REFRESH_TOKEN_SECRET
		) as JwtPayload;

		const user = await User.findById(decodedToken?._id);

		if (!user) {
			throw new ApiError(401, "Invalid refresh token");
		}

		if (incomingRefreshToken !== user.refreshToken) {
			throw new ApiError(401, "Refresh token is expired");
		}

		const { accessToken, refreshToken } =
			await generateAccessAndRefereshTokens(user._id);

		const options = {
			httpOnly: true,
			secure: true,
		};

		return res
			.status(200)
			.cookie("accessToken", accessToken, options)
			.cookie("refreshToken", refreshToken, options)
			.json(
				new ApiResponse(
					200,
					{ accessToken, refreshToken },
					"Access token refreshed"
				)
			);
	} catch (error) {
		return res
			.status(500)
			.json(new ApiResponse(500, null, "Internal server error"));
	}
});

const changeCurrentPassword = asyncHandler(
	async (req: Request, res: Response) => {
		try {
			const result = updateUserPasswordSchema.safeParse(req.body);

			if (!result.success) {
				throw new ApiError(
					400,
					"All fields are required",
					result.error
				);
			}

			const user = await User.findById(req.user?._id);

			if (!user) {
				throw new ApiError(404, "User not found");
			}

			const isPasswordCorrect = await user.isPasswordCorrect(
				result.data.oldPassword
			);

			if (!isPasswordCorrect) {
				throw new ApiError(400, "Invalid password");
			}

			user.password = result.data.newPassword;

			await user.save({ validateBeforeSave: false });

			return res
				.status(200)
				.json(
					new ApiResponse(200, {}, "Password changed successfully")
				);
		} catch (error) {
			return res
				.status(500)
				.json(new ApiResponse(500, null, "Internal server error"));
		}
	}
);

const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
	return res
		.status(200)
		.json(
			new ApiResponse(200, req.user, "Current user fetched successfully")
		);
});

const updateAccountDetails = asyncHandler(
	async (req: Request, res: Response) => {
		try {
			const result = updateUserSchema.safeParse(req.body);

			if (!result.success) {
				throw new ApiError(
					400,
					"All fields are required",
					result.error
				);
			}

			const user = await User.findByIdAndUpdate(
				req.user?._id,
				{
					$set: {
						email: result.data.email,
						fullName: result.data.fullName,
					},
				},
				{ new: true }
			).select("-password -refreshToken");

			if (!user) {
				throw new ApiError(500, "Failed to update user details");
			}

			return res
				.status(200)
				.json(
					new ApiResponse(
						200,
						user,
						"User details updated successfully"
					)
				);
		} catch (error) {
			return res
				.status(500)
				.json(new ApiResponse(500, null, "Internal server error"));
		}
	}
);

const updateAvatar = asyncHandler(async (req: Request, res: Response) => {
	try {
		const avatarLocalPath = req.file?.path;

		if (!avatarLocalPath) {
			throw new ApiError(400, "Avatar is missing");
		}

		const avatar = await uploadOnCloudinary(avatarLocalPath);

		if (!avatar?.url) {
			throw new ApiError(500, "Error while uploading avatar");
		}

		const user = await User.findByIdAndUpdate(
			req.user?._id,
			{
				$set: {
					avatar: avatar.url,
				},
			},
			{ new: true }
		).select("-password -refreshToken");

		if (!user) {
			throw new ApiError(500, "Failed to update avatar");
		}

		return res
			.status(200)
			.json(new ApiResponse(200, user, "Avatar updated successfully"));
	} catch (error) {
		return res
			.status(500)
			.json(new ApiResponse(500, null, "Internal server error"));
	}
});

const updateCoverImage = asyncHandler(async (req: Request, res: Response) => {
	try {
		const coverImageLocalPath = req.file?.path;

		if (!coverImageLocalPath) {
			throw new ApiError(400, "Cover image is missing");
		}

		const coverImage = await uploadOnCloudinary(coverImageLocalPath);

		if (!coverImage?.url) {
			throw new ApiError(500, "Error while uploading cover image");
		}

		const user = await User.findByIdAndUpdate(
			req.user?._id,
			{
				$set: {
					coverImage: coverImage.url,
				},
			},
			{ new: true }
		).select("-password -refreshToken");

		if (!user) {
			throw new ApiError(500, "Failed to update cover image");
		}

		return res
			.status(200)
			.json(
				new ApiResponse(200, user, "Cover image updated successfully")
			);
	} catch (error) {
		return res
			.status(500)
			.json(new ApiResponse(500, null, "Internal server error"));
	}
});

const getUserChannelProfile = asyncHandler(
	async (req: Request, res: Response) => {
		const result = getUserChannelProfileSchema.safeParse(req.params);

		if (!result.success) {
			throw new ApiError(400, "Invalid username", result.error);
		}

		const channel = await User.aggregate([
			{ $match: { username: result.data.username.toLowerCase() } },
			{
				$lookup: {
					from: "subscriptions",
					localField: "_id",
					foreignField: "channel",
					as: "subscribers",
				},
			},
			{
				$lookup: {
					from: "subscriptions",
					localField: "_id",
					foreignField: "subscriber",
					as: "subscribedTo",
				},
			},
			{
				$addFields: {
					subscribersCount: { $size: "$subscribers" },
					channelsSubscribedToCount: { $size: "$subscribedTo" },
					isSubscribed: {
						$cond: {
							if: {
								$in: [req.user?._id, "$subscribers.subscriber"],
							},
							then: true,
							else: false,
						},
					},
				},
			},
			{
				$project: {
					fullName: 1,
					username: 1,
					subscribersCount: 1,
					channelsSubscribedToCount: 1,
					isSubscribed: 1,
					avatar: 1,
					coverImage: 1,
					email: 1,
				},
			},
		]);

		if (!channel?.length) {
			throw new ApiError(404, "Channel does not exists");
		}

		console.log("Channel Pipeline: ", channel);

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					channel[0],
					"User channel profile fetched successfully"
				)
			);
	}
);

const getWatchHistory = asyncHandler(async (req: Request, res: Response) => {
	try {
		const user = await User.aggregate([
			{ $match: { _id: new mongoose.Types.ObjectId(req.user?._id) } },
			{
				$lookup: {
					from: "videos",
					localField: "watchHistory",
					foreignField: "_id",
					as: "watchHistory",
					pipeline: [
						{
							$lookup: {
								from: "users",
								localField: "owner",
								foreignField: "_id",
								as: "owner",
								pipeline: [
									{
										$project: {
											fullName: 1,
											username: 1,
											avatar: 1,
										},
									},
								],
							},
						},
						{
							$addFields: {
								owner: {
									$first: "$owner",
								},
							},
						},
					],
				},
			},
		]);

		if (!user?.length) {
			throw new ApiError(404, "Watch history not found");
		}

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					user[0].watchHistory,
					"Watch history fetched successfully"
				)
			);
	} catch (error) {
		console.error("Error: ", error);
		return res
			.status(500)
			.json(new ApiResponse(500, null, "Internal server error"));
	}
});

export {
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
	updateCoverImage,
};
