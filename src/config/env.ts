import dotenv from "dotenv";

dotenv.config();

export const PORT = Number(process.env.PORT);
export const NODE_ENV = String(process.env.NODE_ENV);
export const MONGO_URL_DEV = String(process.env.MONGO_URL_DEV);
export const CORS_ORIGIN = String(process.env.CORS_ORIGIN);
export const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
export const JWT_SECRET = String(process.env.JWT_SECRET);
export const JWT_EXPIRY = String(process.env.JWT_EXPIRY);
export const REFRESH_TOKEN_SECRET = String(process.env.REFRESH_TOKEN_SECRET);
export const REFRESH_TOKEN_EXPIRY = String(process.env.REFRESH_TOKEN_EXPIRY);
export const CLOUDINARY_CLOUD_NAME = String(process.env.CLOUDINARY_CLOUD_NAME);
export const CLOUDINARY_API_KEY = String(process.env.CLOUDINARY_API_KEY);
export const CLOUDINARY_API_SECRET = String(process.env.CLOUDINARY_API_SECRET);