import { Router } from "express";
import { registerUser, loginUser, getMe, updateMe } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.patch("/me", protect, updateMe);

export default router;
