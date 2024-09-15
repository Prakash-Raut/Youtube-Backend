import { Request, Response } from "express";
import { uploadOnCloudinary } from "../config/cloudinary";
import { Video } from "../models/Video";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import {
	videoCreateSchema,
	videoQuerySchema,
	videoStatusUpdateSchema,
	videoUpdateSchema,
} from "../validations/videoValidation";

const getAllVideos = asyncHandler(async (req: Request, res: Response) => {
	try {
		// Validate the query parameters with Zod
		const validatedQuery = videoQuerySchema.safeParse(req.query);

		if (!validatedQuery.success) {
			return new ApiError(400, "Invalid query parameters");
		}

		const { page, limit, query, sortBy, sortType, userId } =
			validatedQuery.data;

		// Build filter object
		const filter: any = {};
		if (query) {
			filter.title = { $regex: query, $options: "i" }; // Example: search by title
		}
		if (userId) {
			filter.userId = userId;
		}

		// Pagination and sorting options
		const skip = (page - 1) * limit;
		const sortOption: [string, 1 | -1][] = [
			[sortBy, sortType === "asc" ? 1 : -1],
		];

		// Fetch videos from the database
		const videos = await Video.find(filter)
			.skip(skip)
			.limit(limit)
			.sort(sortOption);

		// Get total count for pagination purposes
		const totalVideos = await Video.countDocuments(filter);

		// Respond with videos and pagination details
		return res.status(200).json(
			new ApiResponse(
				200,
				{
					videos,
					page,
					limit,
					totalVideos,
					totalPages: Math.ceil(totalVideos / limit),
				},
				"Videos fetched successfully"
			)
		);
	} catch (error) {
		return res
			.status(500)
			.json(new ApiResponse(500, null, "Internal server error"));
	}
});

const publishAVideo = asyncHandler(async (req: Request, res: Response) => {
	// TODO: get video, upload to cloudinary, create video
	try {
		const result = videoCreateSchema.safeParse(req.body);

		if (!result.success) {
			return new ApiError(400, "Validation Error");
		}

		if (!req.files?.videoFile || !req.files?.thumbnail) {
			return new ApiError(
				400,
				"Video file and thumbnail both are required"
			);
		}

		const videoFileLocalPath = req.files?.["videoFile"][0].path;
		const thumbnailFileLocalPath = req.files?.["thumbnail"][0].path;

		if (!videoFileLocalPath) {
			return new ApiError(400, "Video file is required");
		}

		if (!thumbnailFileLocalPath) {
			return new ApiError(400, "Thumbnail file is required");
		}

		const video = await uploadOnCloudinary(videoFileLocalPath);
		const thumbnail = await uploadOnCloudinary(thumbnailFileLocalPath);

		if (!video) {
			return new ApiError(500, "Failed to upload video");
		}

		if (!thumbnail) {
			return new ApiError(500, "Failed to upload thumbnail");
		}

		console.log("Video URL: ", video);
		console.log("Thumbnail URL: ", thumbnail);

		const publishedVideo = await Video.create({
			videoFile: video.url,
			thumbnail: thumbnail.url,
			title: result.data.title,
			description: result.data.description,
			duration: video?.duration,
			owner: req.user?._id,
		});

		if (!publishedVideo) {
			return new ApiError(500, "Failed to upload video");
		}

		return res
			.status(201)
			.json(
				new ApiResponse(
					201,
					publishedVideo,
					"Video uploaded successfully"
				)
			);
	} catch (error) {
		return res
			.status(500)
			.json(new ApiResponse(500, null, "Internal server error"));
	}
});

const getVideoById = asyncHandler(async (req: Request, res: Response) => {
	try {
		const { videoId } = req.params;

		const video = await Video.findById(videoId);

		if (!video) {
			return new ApiError(404, "Video not found");
		}

		return res.status(200).json(new ApiResponse(200, video, "Video found"));
	} catch (error) {
		return res
			.status(500)
			.json(new ApiResponse(500, null, "Internal server error"));
	}
});

const updateVideo = asyncHandler(async (req: Request, res: Response) => {
	try {
		const { videoId } = req.params;

		const result = videoUpdateSchema.safeParse(req.body);

		if (!result.success) {
			return new ApiError(400, "Invalid video data");
		}

		const updatedVideo = await Video.findByIdAndUpdate(videoId, {
			title: result.data.title,
			description: result.data.description,
			thumbnail: result.data.thumbnail,
			duration: result.data.duration,
		});

		if (!updatedVideo) {
			return new ApiError(
				500,
				"Something went wrong while updating video"
			);
		}

		return res
			.status(200)
			.json(
				new ApiResponse(200, updatedVideo, "Video updated successfully")
			);
	} catch (error) {
		return res
			.status(500)
			.json(new ApiResponse(500, null, "Internal server error"));
	}
});

const deleteVideo = asyncHandler(async (req: Request, res: Response) => {
	try {
		const { videoId } = req.params;

		const deletedVideo = await Video.findByIdAndDelete(videoId);

		if (!deletedVideo) {
			return new ApiError(
				500,
				"Something went wrong while deleting video"
			);
		}

		return res
			.status(200)
			.json(
				new ApiResponse(200, deletedVideo, "Video deleted successfully")
			);
	} catch (error) {
		return res
			.status(500)
			.json(new ApiResponse(500, null, "Internal server error"));
	}
});

const togglePublishStatus = asyncHandler(
	async (req: Request, res: Response) => {
		try {
			const result = videoStatusUpdateSchema.safeParse(req.params);

			if (!result.success) {
				return new ApiError(400, "Invalid video id");
			}

			const video = await Video.findByIdAndUpdate(result.data.videoId, {
				isPublished: !result.data.isPublished,
			});

			if (!video) {
				return new ApiError(
					500,
					"Something went wrong while updating video status"
				);
			}

			return res
				.status(200)
				.json(
					new ApiResponse(
						200,
						video,
						"Video publish status updated successfully"
					)
				);
		} catch (error) {
			return res
				.status(500)
				.json(new ApiResponse(500, null, "Internal server error"));
		}
	}
);

export {
	deleteVideo,
	getAllVideos,
	getVideoById,
	publishAVideo,
	togglePublishStatus,
	updateVideo,
};
