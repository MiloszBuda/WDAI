import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  addReview,
  getProductReviews,
} from "../controllers/review.controller.js";

const router = Router();

router.post("/", authMiddleware, addReview);
router.get("/product/:id", getProductReviews);

export default router;
