import { Router } from "express";
import {
  createMeeting,
  getMyMeetings,
  getMeetingByRoomId,
  joinMeeting,
  updateMeetingStatus,
} from "../controllers/meetingController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/", protect, createMeeting);
router.get("/", protect, getMyMeetings);
router.get("/:roomId", protect, getMeetingByRoomId);
router.post("/:roomId/join", protect, joinMeeting);
router.patch("/:roomId/status", protect, updateMeetingStatus);

export default router;
