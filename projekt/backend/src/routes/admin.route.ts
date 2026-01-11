import { Router } from "express";
import { authToken } from "../middleware/auth.middleware.js";
import { adminOnlyMiddleware } from "../middleware/admin.middleware.js";
import {
  getAllOrders,
  updateOrderStatus,
} from "../controllers/admin.controller.js";

const router = Router();

router.get("/orders", authToken, adminOnlyMiddleware, getAllOrders);
router.patch(
  "/orders/:id/status",
  authToken,
  adminOnlyMiddleware,
  updateOrderStatus
);

export default router;
