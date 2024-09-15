import { model, Model, Schema } from "mongoose";

interface ITweet {
	content: string;
	owner: Schema.Types.ObjectId;
}

interface ITweetMethods {}

interface TweetModel extends Model<ITweet, {}, ITweetMethods> {}

const tweetSchema = new Schema<ITweet, TweetModel, ITweetMethods>(
	{
		content: {
			type: String,
			required: true,
			trim: true,
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true }
);

export const Tweet = model<ITweet, TweetModel>("Tweet", tweetSchema);
