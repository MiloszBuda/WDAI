import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { checkout } from "../controllers/checkout.controller.js";

const router = Router();

router.post("/checkout", authMiddleware, checkout);

export default router;
