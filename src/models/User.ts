import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { model, Model, Schema } from "mongoose";
import {
	JWT_EXPIRY,
	JWT_SECRET,
	REFRESH_TOKEN_EXPIRY,
	REFRESH_TOKEN_SECRET,
	SALT_ROUNDS,
} from "../config/env";

interface IUser {
	_id?: string;
	username: string;
	email: string;
	fullName: string;
	avatar: string;
	coverImage: string;
	watchHistory: string[];
	password: string;
	refreshToken: string;
}

interface IUserMethods {
	isPasswordCorrect(password: string): Promise<boolean>;
	generateAccessToken(): Promise<string | undefined>;
	generateRefreshToken(): Promise<string | undefined>;
}

interface UserModel extends Model<IUser, {}, IUserMethods> {}

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			index: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowecase: true,
			trim: true,
		},
		fullName: {
			type: String,
			required: true,
			trim: true,
			index: true,
		},
		avatar: {
			type: String, // cloudinary url
			required: true,
		},
		coverImage: {
			type: String, // cloudinary url
		},
		watchHistory: [
			{
				type: Schema.Types.ObjectId,
				ref: "Video",
			},
		],
		password: {
			type: String,
			required: [true, "Password is required"],
		},
		refreshToken: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
	next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
	return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
	return new Promise((resolve, reject) => {
		jwt.sign(
			{ _id: this._id },
			JWT_SECRET,
			{ expiresIn: JWT_EXPIRY },
			(err, token) => {
				if (err) {
					return reject(err);
				}
				resolve(token);
			}
		);
	});
};

userSchema.methods.generateRefreshToken = function () {
	return new Promise((resolve, reject) => {
		jwt.sign(
			{ _id: this._id },
			REFRESH_TOKEN_SECRET,
			{ expiresIn: REFRESH_TOKEN_EXPIRY },
			(err, token) => {
				if (err) {
					return reject(err);
				}
				resolve(token);
			}
		);
	});
};

export const User = model<IUser, UserModel>("User", userSchema);
