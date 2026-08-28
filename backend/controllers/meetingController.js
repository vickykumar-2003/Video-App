import Meeting from "../models/Meeting.js";
import { generateRoomId } from "../utils/roomId.js";

// @route  POST /api/meetings
export async function createMeeting(req, res, next) {
  try {
    const { title, description } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Meeting title is required" });
    }

    let roomId = generateRoomId();
    // Extremely unlikely collision, but guard anyway.
    while (await Meeting.findOne({ roomId })) {
      roomId = generateRoomId();
    }

    const meeting = await Meeting.create({
      title: title.trim(),
      description: description?.trim() || "",
      roomId,
      host: req.user._id,
    });

    res.status(201).json({ meeting });
  } catch (err) {
    next(err);
  }
}

// @route  GET /api/meetings
export async function getMyMeetings(req, res, next) {
  try {
    const meetings = await Meeting.find({ host: req.user._id }).sort({ createdAt: -1 });
    res.json({ meetings });
  } catch (err) {
    next(err);
  }
}

// @route  GET /api/meetings/:roomId
export async function getMeetingByRoomId(req, res, next) {
  try {
    const meeting = await Meeting.findOne({ roomId: req.params.roomId.toUpperCase() }).populate(
      "host",
      "name email avatarInitials"
    );
    if (!meeting) {
      return res.status(404).json({ message: "No meeting found with that Room ID" });
    }
    res.json({ meeting });
  } catch (err) {
    next(err);
  }
}

// @route  POST /api/meetings/:roomId/join
// Validates a room exists and is joinable; actual realtime join happens over Socket.IO.
export async function joinMeeting(req, res, next) {
  try {
    const meeting = await Meeting.findOne({ roomId: req.params.roomId.toUpperCase() });
    if (!meeting) {
      return res.status(404).json({ message: "No meeting found with that Room ID" });
    }
    if (meeting.status === "completed") {
      return res.status(400).json({ message: "This meeting has already ended" });
    }
    res.json({ meeting });
  } catch (err) {
    next(err);
  }
}

// @route  PATCH /api/meetings/:roomId/status
export async function updateMeetingStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!["upcoming", "live", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    const meeting = await Meeting.findOneAndUpdate(
      { roomId: req.params.roomId.toUpperCase() },
      { status },
      { new: true }
    );
    if (!meeting) {
      return res.status(404).json({ message: "No meeting found with that Room ID" });
    }
    res.json({ meeting });
  } catch (err) {
    next(err);
  }
}
