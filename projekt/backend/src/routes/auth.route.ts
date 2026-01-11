import { Router } from "express";
import {
  login,
  register,
  me,
  refresh,
  logout,
} from "../controllers/auth.controller.js";
import { authToken } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/me", authToken, me);
router.get("/refresh", refresh);
router.post("/logout", logout);

export default router;
