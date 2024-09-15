import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import {
	CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET,
	CLOUDINARY_CLOUD_NAME,
} from "./env";

cloudinary.config({
	cloud_name: CLOUDINARY_CLOUD_NAME,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath: string) => {
	try {
		if (!localFilePath) {
			throw new Error("No file path provided");
		}

		const response = await cloudinary.uploader.upload(localFilePath, {
			resource_type: "auto",
		});

		fs.unlinkSync(localFilePath);

		return response;
	} catch (error) {
		console.error("Error uploading file to cloudinary", error);
		fs.unlinkSync(localFilePath);
		return null;
	}
};
