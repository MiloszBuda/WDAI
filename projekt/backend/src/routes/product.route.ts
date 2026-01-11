import { Router } from "express";
import { authToken } from "../middleware/auth.middleware.js";
import { adminOnlyMiddleware } from "../middleware/admin.middleware.js";
import {
  getProducts,
  getProductById,
  createProduct,
} from "../controllers/product.controller.js";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", authToken, adminOnlyMiddleware, createProduct);

export default router;
