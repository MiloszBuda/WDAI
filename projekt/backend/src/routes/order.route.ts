import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createOrder,
  getMyOrders,
  updateOrderStatus,
  cancelOrder,
  getOrderDetails,
} from "../controllers/order.controller.js";
import { adminOnlyMiddleware } from "../middleware/admin.middleware.js";

const router = Router();

router.post("/", authMiddleware, createOrder);
router.get("/me", authMiddleware, getMyOrders);
router.patch(
  "/:id/status",
  authMiddleware,
  adminOnlyMiddleware,
  updateOrderStatus
);
router.post("/:id/cancel", authMiddleware, cancelOrder);
router.get("/:id", authMiddleware, getOrderDetails);

export default router;
