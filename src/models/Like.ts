import { model, Model, Schema } from "mongoose";

interface ILike {
	video: Schema.Types.ObjectId;
	comment: Schema.Types.ObjectId;
	tweet: Schema.Types.ObjectId;
	likedBy: Schema.Types.ObjectId;
}

interface ILikeMethods {}

interface LikeModel extends Model<ILike, {}, ILikeMethods> {}

const likeSchema = new Schema<ILike, LikeModel, ILikeMethods>(
	{
		video: {
			type: Schema.Types.ObjectId,
			ref: "Video",
		},
		comment: {
			type: Schema.Types.ObjectId,
			ref: "Comment",
		},
		tweet: {
			type: Schema.Types.ObjectId,
			ref: "Tweet",
		},
		likedBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true }
);

export const Like = model<ILike, LikeModel>("Like", likeSchema);
