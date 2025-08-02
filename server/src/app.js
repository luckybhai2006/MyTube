import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

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

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);

export { app };
