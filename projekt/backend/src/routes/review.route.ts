import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminOnlyMiddleware } from "../middleware/admin.middleware.js";
import {
  addReview,
  getProductReviews,
  deleteReview,
} from "../controllers/review.controller.js";

const router = Router();

router.post("/", authMiddleware, addReview);
router.get("/product/:id", getProductReviews);
router.delete("/:id", authMiddleware, adminOnlyMiddleware, deleteReview);

export default router;
