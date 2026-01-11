import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createOrder,
  getMyOrders,
  cancelOrder,
  getOrderDetails,
} from "../controllers/order.controller.js";

const router = Router();

router.post("/", authMiddleware, createOrder);
router.get("/me", authMiddleware, getMyOrders);
router.patch("/:id/cancel", authMiddleware, cancelOrder);
router.get("/:id", authMiddleware, getOrderDetails);

export default router;
