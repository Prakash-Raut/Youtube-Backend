import { model, Model, Schema } from "mongoose";

interface IPlaylist {
	name: string;
	description: string;
	videos: Schema.Types.ObjectId[];
	owner: Schema.Types.ObjectId;
}

interface IPlaylistMethods {}

interface PlaylistModel extends Model<IPlaylist, {}, IPlaylistMethods> {}

const playlistSchema = new Schema<IPlaylist, PlaylistModel, IPlaylistMethods>(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		videos: [
			{
				type: Schema.Types.ObjectId,
				ref: "Video",
			},
		],
		owner: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true }
);

export const Playlist = model<IPlaylist, PlaylistModel>(
	"Playlist",
	playlistSchema
);
