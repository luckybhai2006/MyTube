import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true, // Trim leading and trailing whitespace
      minlength: 3,
      index: true, // Create a unique index on username
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true, // Trim leading and trailing whitespace
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true, // Create a unique index on fullname
    },
    avatar: {
      type: String, // cloudinary URL for the user's avatar
      required: true,
    },
    coverImage: {
      type: String, // cloudinary URL for the user's cover image
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video", // Reference to the Video model
      },
    ],
    watchHistoryPaused: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Minimum length for password
    },
    refreshToken: {
      type: String,
    }, // Refresh token for JWT authentication
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = new mongoose.model("User", userSchema);
