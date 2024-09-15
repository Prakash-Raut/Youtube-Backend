import { connect } from "mongoose";
import { MONGO_URL_DEV, NODE_ENV } from "./env";

export const connectDB = async () => {
	try {
		if (NODE_ENV == "DEVELOPMENT") {
			await connect(MONGO_URL_DEV);
			console.log("Database connected...");
		}
	} catch (error) {
		console.error("Database connection failed");
		process.exit(1);
	}
};
