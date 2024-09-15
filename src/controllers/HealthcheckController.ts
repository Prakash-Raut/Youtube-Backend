import { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const healthcheck = asyncHandler(async (_req: Request, res: Response) => {
	return res.status(200).json(new ApiResponse(200, {}, "OK"));
});

export { healthcheck };
