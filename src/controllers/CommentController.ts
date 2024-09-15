import { Request, Response } from "express";
import { Comment } from "../models/Comment";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import {
	commentCreateSchema,
	commentDeleteSchema,
	commentUpdateSchema,
} from "../validations/commentValidation";

const getVideoComments = asyncHandler(async (req: Request, res: Response) => {
	try {
		const { videoId } = req.params;
		const { page = 1, limit = 10 } = req.query;

		const options = {
			page: parseInt(page as string, 10),
			limit: parseInt(limit as string, 10),
		};

		const comments = await Comment.find({ video: videoId }, null, options);

		if (!comments) {
			return new ApiError(400, "No comments found for this video");
		}

		return res
			.status(200)
			.json(
				new ApiResponse(200, comments, "Comments fetched successfully")
			);
	} catch (error) {
		return res
			.status(500)
			.json(new ApiResponse(500, null, "Internal server error"));
	}
});

const addComment = asyncHandler(async (req: Request, res: Response) => {
	try {
		const { videoId } = req.params;

		const result = commentCreateSchema.safeParse(req.body);

		if (!result.success) {
			return new ApiError(400, "Validation Error");
		}

		const comment = await Comment.create({
			content: result.data.text,
			video: videoId,
			owner: req.user?._id,
		});

		if (!comment) {
			return new ApiError(
				400,
				"Something went wrong while adding comment"
			);
		}

		return res
			.status(201)
			.json(new ApiResponse(201, comment, "Comment added successfully"));
	} catch (error) {
		return res
			.status(500)
			.json(new ApiResponse(500, null, "Internal server error"));
	}
});

const updateComment = asyncHandler(async (req: Request, res: Response) => {
	try {
		const { commentId } = req.params;

		const result = commentUpdateSchema.safeParse(req.body);

		if (!result.success) {
			return new ApiError(400, "Validation Error");
		}

		const comment = await Comment.findByIdAndUpdate(commentId, {
			content: result.data.text,
		});

		if (!comment) {
			return new ApiError(
				400,
				"Something went wrong while updating comment"
			);
		}

		return res
			.status(200)
			.json(
				new ApiResponse(200, comment, "Comment updated successfully")
			);
	} catch (error) {
		return res
			.status(500)
			.json(new ApiResponse(500, null, "Internal server error"));
	}
});

const deleteComment = asyncHandler(async (req: Request, res: Response) => {
	try {
		const { commentId } = req.params;

		const result = commentDeleteSchema.safeParse(req.body);

		if (!result.success) {
			return new ApiError(400, "Validation Error");
		}

		const comment = await Comment.findByIdAndDelete(commentId);

		if (!comment) {
			return new ApiError(
				400,
				"Something went wrong while deleting comment"
			);
		}

		return res
			.status(200)
			.json(
				new ApiResponse(200, comment, "Comment deleted successfully")
			);
	} catch (error) {
		return res
			.status(500)
			.json(new ApiResponse(500, null, "Internal server error"));
	}
});

export { addComment, deleteComment, getVideoComments, updateComment };
