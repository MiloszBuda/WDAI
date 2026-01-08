import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { use } from "react";

const router = Router();

router.get("/", authMiddleware, (req, res) => {
  res.json({ message: "Orders for user", user: req.user });
});

export default router;
