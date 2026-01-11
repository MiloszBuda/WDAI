import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminOnlyMiddleware } from "../middleware/admin.middleware.js";
import {
  getAllOrders,
  updateOrderStatus,
} from "../controllers/admin.controller.js";

const router = Router();

router.get("/orders", authMiddleware, adminOnlyMiddleware, getAllOrders);
router.patch(
  "/orders/:id/status",
  authMiddleware,
  adminOnlyMiddleware,
  updateOrderStatus
);

export default router;
