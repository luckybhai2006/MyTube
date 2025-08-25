import { Router } from "express";
import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from "../controllers/comment.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

// 👇 Public route - anyone can view comments
router.get("/:videoId", getVideoComments);

// 👇 Protected routes - only logged in users can do these
router.post("/:videoId", verifyJwt, addComment);
router.patch("/c/:commentId", verifyJwt, updateComment);
router.delete("/c/:commentId", verifyJwt, deleteComment);

export default router;
