import { Router } from "express";
import { authToken } from "../middleware/auth.middleware.js";
import { adminOnlyMiddleware } from "../middleware/admin.middleware.js";
import {
  addReview,
  getProductReviews,
  deleteReview,
  getAllReviews,
  editOwnReview,
  deleteOwnReview,
  canReview,
} from "../controllers/review.controller.js";

const router = Router();

router.post("/", authToken, addReview);
router.get("/product/:id", getProductReviews);
router.delete("/:id", authToken, adminOnlyMiddleware, deleteReview);
router.get("/", authToken, adminOnlyMiddleware, getAllReviews);
router.put("/own/:id", authToken, editOwnReview);
router.delete("/own/:id", authToken, deleteOwnReview);
router.get("/can-review/:id", authToken, canReview);

export default router;
