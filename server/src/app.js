import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
console.log("Allowed origin:", process.env.CORS_ORIGIN);

app.use(express.json({ limit: "200mb" })); // Limit request body size to 2MB
app.use(express.urlencoded({ extended: true, limit: "200mb" })); // Limit URL-encoded data size to 2MB
app.use(express.static("public")); // Serve static files from the 'public' directory
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Import routes
import userRouter from "./routes/userr.router.js";
import videoRouter from "./routes/video.router.js";
import commentRouter from "./routes/comment.router.js";
import subscriptionRouter from "./routes/subscription.router.js";
import likeRouter from "./routes/like.router.js";
import tweetRouter from "./routes/tweet.router.js";
import playlistRouter from "./routes/playlist.router.js";
import dashboardRouter from "./routes/dashboard.router.js";

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/playlist", playlistRouter);

export { app };
