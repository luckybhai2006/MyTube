import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema(
  {
    videoFile: {
      type: String, // cloudinary URL for the video file
      required: true,
    },
    thumbnail: {
      type: String, // cloudinary URL for the video thumbnail
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Music",
        "Gaming",
        "Education",
        "Entertainment",
        "Sports",
        "Other",
      ],
      default: "Other",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // Duration in seconds
      required: true,
    },
    views: {
      type: Number,
      default: 0, // Default value for views
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    isPublished: {
      type: Boolean,
      default: false, // Default value for isPublished
    },
  },
  { timestamps: true }
);

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = new mongoose.model("Video", videoSchema);
