import { Router } from "express";
import { authToken } from "../middleware/auth.middleware.js";
import {
  createOrder,
  getMyOrders,
  cancelOrder,
  getOrderDetails,
} from "../controllers/order.controller.js";

const router = Router();

router.post("/", authToken, createOrder);
router.get("/me", authToken, getMyOrders);
router.patch("/:id/cancel", authToken, cancelOrder);
router.get("/:id", authToken, getOrderDetails);

export default router;
