import express from "express";
import { register, login, getMe } from "../controllers/authController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/me", auth, getMe);

export default router;
