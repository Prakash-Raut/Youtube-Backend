import { model, Model, Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

interface IComment {
	content: string;
	video: Schema.Types.ObjectId;
	owner: Schema.Types.ObjectId;
}

interface ICommentMethods {}

interface CommentModel extends Model<IComment, {}, ICommentMethods> {}

const commentSchema = new Schema<IComment, CommentModel, ICommentMethods>(
	{
		content: {
			type: String,
			required: true,
		},
		video: {
			type: Schema.Types.ObjectId,
			ref: "Video",
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true }
);

commentSchema.plugin(mongooseAggregatePaginate);

export const Comment = model<IComment, CommentModel>("Comment", commentSchema);
