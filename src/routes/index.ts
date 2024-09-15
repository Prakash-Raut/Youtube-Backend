import { Router } from "express";
import { commentRouter } from "./commentRoute";
import { dashboardRouter } from "./dashboardRoute";
import { healthcheckRouter } from "./healthcheckRoute";
import { likeRouter } from "./likeRouter";
import { playlistRouter } from "./playlistRouter";
import { subscriptionRouter } from "./subscriptionRoute";
import { tweetRouter } from "./tweetRoute";
import { userRouter } from "./userRoute";
import { videoRouter } from "./videoRouter";

const v1Router = Router();

v1Router.use("/healthcheck", healthcheckRouter);
v1Router.use("/users", userRouter);
v1Router.use("/tweets", tweetRouter);
v1Router.use("/subscriptions", subscriptionRouter);
v1Router.use("/comments", commentRouter);
v1Router.use("/likes", likeRouter);
v1Router.use("/playlist", playlistRouter);
v1Router.use("/videos", videoRouter);
v1Router.use("/dashboard", dashboardRouter);

export { v1Router };
