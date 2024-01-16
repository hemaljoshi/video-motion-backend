import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { verifyJwtToken } from "./middlewares/auth.middleware";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

export const app = express();

const SWAGGER_OPTIONS = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Video Motion API",
      version: "1.0.0",
      description: "Video Motion API",
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
      {
        url: "https://nodejs-production-5890.up.railway.app",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const specs = swaggerJsdoc(SWAGGER_OPTIONS);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.routes";
import videoRouter from "./routes/video.routes";
import playlistRouter from "./routes/playlist.routes"
import commentRouter from "./routes/comment.routes"
import tweetRouter from "./routes/tweet.routes"
import likeRouter from "./routes/like.routes"
import dashboardRouter from "./routes/dashboard.routes";
import healthRouter from "./routes/healthcheck.routes";
import subscriptionRouter from "./routes/subscription.routes";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/like", likeRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/healthcheck", healthRouter);
app.use("/api/v1/subscription", subscriptionRouter);
app.use("/api/v1/api-docs", swaggerUi.serve, swaggerUi.setup(specs));