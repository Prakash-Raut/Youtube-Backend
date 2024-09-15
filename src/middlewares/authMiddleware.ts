import type { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

export const verifyJWT = asyncHandler(
	async (req: Request, _: Response, next: NextFunction) => {
		try {
			const token =
				req.cookies?.accessToken ||
				req.header("Authorization")?.replace("Bearer ", "");

			if (!token) {
				throw new ApiError(401, "Unauthorized request");
			}

			const decodedToken: JwtPayload = jwt.verify(
				token,
				JWT_SECRET
			) as JwtPayload;

			const user = await User.findById(decodedToken?._id).select(
				"-password -refreshToken"
			);

			if (!user) {
				throw new ApiError(401, "Invalid Access Token");
			}

			req.user = user;

			next();
		} catch (error) {
			throw new ApiError(401, "Invalid Access Token");
		}
	}
);
