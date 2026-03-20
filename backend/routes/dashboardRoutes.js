import { Router } from "express";
import { validate } from "../middlewares/validatorMiddleware.js";
import { getDashboardData } from "../controllers/dashboardControllers.js";
import { authMiddleware } from "../middlewares/auth.js";
const dashboardRouter=Router();

dashboardRouter.get('/',authMiddleware, getDashboardData);

export default dashboardRouter;