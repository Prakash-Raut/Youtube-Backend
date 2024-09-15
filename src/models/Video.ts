import { Document, model, Model, Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

interface IVideo extends Document{
	videoFile: string;
	thumbnail: string;
	title: string;
	description: string;
	duration: number;
	views: number;
	isPublished: boolean;
	owner: Schema.Types.ObjectId;
}

interface IVideoMethods {}

interface VideoModel extends Model<IVideo, {}, IVideoMethods> {}

const videoSchema = new Schema<IVideo, VideoModel, IVideoMethods>(
	{
		videoFile: {
			type: String, //cloudinary url
			required: true,
		},
		thumbnail: {
			type: String, //cloudinary url
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		duration: {
			type: Number,
			required: true,
		},
		views: {
			type: Number,
			default: 0,
		},
		isPublished: {
			type: Boolean,
			default: true,
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{
		timestamps: true,
	}
);

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = model<IVideo, VideoModel>("Video", videoSchema);
