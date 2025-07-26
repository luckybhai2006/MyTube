import { asyncHandler } from "../utils/asynchandeler.js";
import { ApiError } from "../utils/apierror.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { getRounds } from "bcrypt";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.save({ validationBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating tokens: " + error.message);
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // ger user details from frontend

  const { fullname, email, password, username } = req.body;

  // validation - not empty

  if (!fullname || !email || !password || !username) {
    throw new ApiError(400, "Please fill all the required fields");
  }

  // check if user already exists

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // check for images, check for avatar

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }
  if (!avatarLocalPath) {
    throw new ApiError(400, "Please upload an avatar image");
  }
  // console.log("avatarLocalPath:", avatarLocalPath);
  // upload them to cloudinary, avatar

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  // console.log("Cloudinary avatar upload result:", avatar);
  const cover = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Please upload an avatarrr image");
  }

  // create user object - create entry in db

  const user = await User.create({
    fullname,
    email,
    password,
    avatar: avatar.url,
    coverImage: cover?.url || "",
    username: username.toLowerCase(),
  });

  // remove password and refresh token feild from response

  const userCreated = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // check for users crearion

  if (!userCreated) {
    throw new ApiError(500, "Something went wrong, while regestering user");
  }

  // return res

  return res
    .status(201)
    .json(new ApiResponse(200, userCreated, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // login logic here
  const { email, username, password } = req.body;
  if (!email && !username) {
    throw new ApiError(400, "Please provide email or username to login");
  }
  const user = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  // check password
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid password");
  }

  // generate access and refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loginUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const option = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("refreshToken", refreshToken, option)
    .cookie("accessToken", accessToken, option)
    .json(
      new ApiResponse(
        200,
        {
          user: loginUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logOutUser = asyncHandler(async (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    {
      new: true,
    }
  );
  const option = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("refreshToken", "", option)
    .cookie("accessToken", "", option)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
      throw new ApiError(401, "Refresh token is missing or invalid");
    }
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is invalid");
    }

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    const option = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, option)
      .cookie("refreshToken", newRefreshToken, option)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access tokens refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, "Error refreshing tokens: " + error?.message);
  }
});

export { registerUser, loginUser, logOutUser, refreshAccessToken };
