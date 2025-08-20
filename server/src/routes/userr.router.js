import { upload } from "../middlewares/multer.middlewares.js";
import { registerUser } from "../controllers/user.controller.js";
import { loginUser } from "../controllers/user.controller.js";
import { getCurrentUser } from "../controllers/user.controller.js";
import { logOutUser } from "../controllers/user.controller.js";
import { refreshAccessToken } from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { changeCurrentPassword } from "../controllers/user.controller.js";
import { updateAccountDetails } from "../controllers/user.controller.js";
import { updateAvatarProfile } from "../controllers/user.controller.js";
import { updateCoverImage } from "../controllers/user.controller.js";
import {
  getUserChannelProfile,
  addToWatchHistory,
  getUserWatchHistory,
  removeFromWatchHistory,
  clearWatchHistory,
  togglePauseWatchHistory,
} from "../controllers/user.controller.js";
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
// routes/user.router.js
router.route("/me").get(verifyJwt, getCurrentUser);

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
router.post("/watch-history/add/:videoId", verifyJwt, addToWatchHistory);
router.route("/watch-history").get(verifyJwt, getUserWatchHistory);

router.delete("/watch-history/:videoId", verifyJwt, removeFromWatchHistory);
router.delete("/history/clear", verifyJwt, clearWatchHistory);
// In routes/userRoutes.js
router.patch("/watch-history/pause", verifyJwt, togglePauseWatchHistory);
// router.get("/watch-history/status", verifyJwt, togglePauseWatchHistory);

export default router;
