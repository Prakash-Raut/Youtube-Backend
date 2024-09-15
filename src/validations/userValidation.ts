import { z } from "zod";

export const createUserSchema = z.object({
	username: z
		.string()
		.min(3, { message: "Username must be at least 3 characters long" })
		.max(20, { message: "Username must be at most 20 characters long" }),
	email: z.string().email({ message: "Invalid email address" }),
	fullName: z
		.string()
		.min(3, { message: "Full name must be at least 3 characters long" }),
	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters long" }),
});

export const loginUserSchema = z.object({
	username: z
		.string()
		.min(3, { message: "Username must be at least 3 characters long" })
		.optional(),
	email: z.string().email({ message: "Invalid email address" }),
	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters long" }),
});

export const updateUserPasswordSchema = z.object({
	oldPassword: z
		.string()
		.min(6, { message: "Password must be at least 6 characters long" }),
	newPassword: z
		.string()
		.min(6, { message: "Password must be at least 6 characters long" })
});

export const updateUserSchema = z.object({
	email: z.string().email({ message: "Invalid email address" }).optional(),
	fullName: z
		.string()
		.min(3, { message: "Full name must be at least 3 characters long" })
		.optional(),
});


export const getUserChannelProfileSchema = z.object({
	username: z
		.string()
		.min(3, { message: "Username must be at least 3 characters long" })
		.max(20, { message: "Username must be at most 20 characters long" }),
})