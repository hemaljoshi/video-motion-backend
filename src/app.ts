import express from "express";
import cors from "cors";
import coookieParser from "cookie-parser";

export const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(coookieParser());

// Routes
import userRouter from "./routes/user.routes";
import vidoRouter from "./routes/video.routes"
import playlistRouter from "./routes/playlist.routes"

app.use("/api/v1/users", userRouter);
app.use("/api/v1/video", vidoRouter)
app.use("/api/v1/playlist", playlistRouter)
