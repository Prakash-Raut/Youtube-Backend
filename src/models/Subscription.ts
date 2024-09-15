import { model, Model, Schema } from "mongoose";

interface ISubscription {
	subscriber: Schema.Types.ObjectId;
	channel: Schema.Types.ObjectId;
}

interface ISubscriptionMethods {}

interface SubscriptionModel
	extends Model<ISubscription, {}, ISubscriptionMethods> {}

const subscriptionSchema = new Schema<
	ISubscription,
	SubscriptionModel,
	ISubscriptionMethods
>(
	{
		subscriber: {
			type: Schema.Types.ObjectId, // one who is subscribing
			ref: "User",
		},
		channel: {
			type: Schema.Types.ObjectId, // one to whom 'subscriber' is subscribing
			ref: "User",
		},
	},
	{ timestamps: true }
);

export const Subscription = model<ISubscription, SubscriptionModel>(
	"Subscription",
	subscriptionSchema
);
