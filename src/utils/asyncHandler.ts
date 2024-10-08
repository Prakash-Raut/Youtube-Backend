import { NextFunction, Request, Response } from "express";
import { ApiError } from "./ApiError";

export const asyncHandler =
	(requestHandler: any) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await requestHandler(req, res, next);
		} catch (error: any) {
			const err = error as ApiError;
			console.log(err);
			res.status(error.statusCode || 500).json(
				new ApiError(err.statusCode || 500, err.message, err.errors)
			);
		}
	};
