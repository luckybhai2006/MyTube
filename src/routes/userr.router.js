import { upload } from "../middlewares/multer.middlewares.js";
import { registerUser } from "../controllers/user.controller.js";
import { loginUser } from "../controllers/user.controller.js";
import { logOutUser } from "../controllers/user.controller.js";
import { refreshAccessToken } from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
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
export default router;
