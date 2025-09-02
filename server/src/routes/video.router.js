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
  getVideosByCategory,
} from "../controllers/video.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { Video } from "../models/video.model.js";

const router = Router();
// router.use(verifyJwt);

router
  .route("/")
  .get(verifyJwt, getAllVideos)
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
    verifyJwt,
    publishAVideo
  );

// GET /api/videos/random
router.get("/random", async (req, res) => {
  try {
    const videos = await Video.aggregate([{ $sample: { size: 20 } }]);
    // size: 20 means 20 random videos, change as you like
    const populatedVideos = await Video.populate(videos, {
      path: "owner",
      select: "username avatar",
    });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching random videos", error });
  }
});
router.get("/category", getVideosByCategory);
router
  .route("/:videoId")
  .get(getVideoById)
  .delete(verifyJwt, deleteVideo)
  .patch(verifyJwt, upload.single("thumbnail"), updateVideo);
// routes/video.routes.js

router.route("/toggle/publish/:videoId").patch(verifyJwt, togglePublishStatus);

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
