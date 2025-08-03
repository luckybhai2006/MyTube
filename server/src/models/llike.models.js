import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      default: null,
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    tweet: {
      type: Schema.Types.ObjectId,
      ref: "Tweet",
      default: null,
    },
    likedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Ensure only one target (video/comment/tweet) is liked per document
likeSchema.pre("save", function (next) {
  const targets = [this.video, this.comment, this.tweet].filter(Boolean);
  if (targets.length !== 1) {
    return next(
      new Error("Exactly one of video, comment, or tweet must be provided")
    );
  }
  next();
});

export const Like = mongoose.model("Like", likeSchema);
