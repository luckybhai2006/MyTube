import mongoose, { Schema } from "mongoose";

const subscriberSchema = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId, // one who subscribes
      ref: "User",
    },
    channel: {
      type: Schema.Types.ObjectId, // channel being subscribed to
      ref: "User",
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

const Subscription = mongoose.model("Subscription", subscriberSchema);
