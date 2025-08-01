import {
  upload,
  registerUser,
  loginUser,
  logOutUser,
  refreshAccessToken,
  verifyJwt,
  changeCurrentPassword,
  updateAccountDetails,
  updateAvatarProfile,
  updateCoverImage,
  getUserChannelProfile,
  getUserWatchHistory,
} from "../middlewares/multer.middlewares.js";
import { Router } from "express";

const router = Router();
// Example route: Get all users
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 5 },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJwt, logOutUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").post(verifyJwt, changeCurrentPassword);

router.route("/update-account").post(verifyJwt, updateAccountDetails);

router
  .route("/update-avatar")
  .patch(verifyJwt, upload.single("avatar"), updateAvatarProfile);

router
  .route("/update-coverImage")
  .patch(verifyJwt, upload.single("coverImage"), updateCoverImage);

router.route("/C/:username").get(verifyJwt, getUserChannelProfile);

router.route("/watch-history").get(verifyJwt, getUserWatchHistory);
export default router;
