import { Router } from "express";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  getVideosByUser,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
  addVideoView,
} from "../controllers/video.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { Video } from "../models/video.model.js";

const router = Router();
router.use(verifyJwt); // Apply verifyJWT middleware to all routes in this file

router
  .route("/")
  .get(getAllVideos)
  .post(
    upload.fields([
      {
        name: "videoFile",
        maxCount: 1,
      },
      {
        name: "thumbnail",
        maxCount: 1,
      },
    ]),
    publishAVideo
  );

router
  .route("/:videoId")
  .get(getVideoById)
  .delete(deleteVideo)
  .patch(upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

router.route("/user/:userId").get(getVideosByUser);

router.post("/views/:videoId", addVideoView);
// Like a video
router.post("/like/:videoId", async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  try {
    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    if (!video.likedBy.includes(userId)) {
      video.likes += 1;
      video.likedBy.push(userId);
      await video.save();
    }

    res.status(200).json({ likes: video.likes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Unlike a video
router.post("/unlike/:videoId", async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  try {
    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    if (video.likedBy.includes(userId)) {
      video.likes -= 1;
      video.likedBy = video.likedBy.filter(
        (id) => id.toString() !== userId.toString()
      );
      await video.save();
    }

    res.status(200).json({ likes: video.likes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
