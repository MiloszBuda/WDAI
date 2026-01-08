import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { aminOnlyMiddleware } from "../middleware/admin.middleware.js";
import {
  getProducts,
  getProductById,
  createProduct,
} from "../controllers/product.controller.js";

const router = Router();

router.get("/", getProducts);
router.post("/:id", getProductById);
router.post("/", authMiddleware, aminOnlyMiddleware, createProduct);

export default router;
