import { Router } from "express";
import { login } from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", login);

router.get("/test", (req, res) => {
  res.send("auth works");
});

export default router;
