import { Router } from "express";
import { healthcheck } from "../controllers/HealthcheckController";

const healthcheckRouter = Router();

healthcheckRouter.get("/", healthcheck);

export { healthcheckRouter };
