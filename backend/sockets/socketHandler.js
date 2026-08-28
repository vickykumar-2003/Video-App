import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Message from "../models/Message.js";

// In-memory presence map: roomId -> Map(socketId -> participant info)
// Fine for a single-server setup; swap for Redis if you scale to multiple instances.
const rooms = new Map();

function getRoom(roomId) {
  if (!rooms.has(roomId)) rooms.set(roomId, new Map());
  return rooms.get(roomId);
}

function participantsList(roomId) {
  return Array.from(getRoom(roomId).values());
}

async function authenticateSocket(socket, next) {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication token missing"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return next(new Error("User no longer exists"));

    socket.user = { id: user._id.toString(), name: user.name, avatarInitials: user.avatarInitials };
    next();
  } catch (err) {
    next(new Error("Invalid or expired token"));
  }
}

export function initSocket(io) {
  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id} (${socket.user.name})`);

    let currentRoomId = null;

    // ---- Join a meeting room ----
    socket.on("join-room", ({ roomId, micOn = true, cameraOn = true }) => {
      currentRoomId = roomId.toUpperCase();
      socket.join(currentRoomId);

      const room = getRoom(currentRoomId);
      room.set(socket.id, {
        socketId: socket.id,
        userId: socket.user.id,
        name: socket.user.name,
        micOn,
        cameraOn,
        isHost: room.size === 0,
      });

      // Tell existing participants a new peer joined (for WebRTC offer/answer setup)
      socket.to(currentRoomId).emit("user-joined", {
        socketId: socket.id,
        userId: socket.user.id,
        name: socket.user.name,
        micOn,
        cameraOn,
      });

      // Send the new participant the current roster
      socket.emit("room-participants", participantsList(currentRoomId));
    });

    // ---- WebRTC signaling relay ----
    socket.on("webrtc-offer", ({ to, offer }) => {
      io.to(to).emit("webrtc-offer", { from: socket.id, offer });
    });

    socket.on("webrtc-answer", ({ to, answer }) => {
      io.to(to).emit("webrtc-answer", { from: socket.id, answer });
    });

    socket.on("webrtc-ice-candidate", ({ to, candidate }) => {
      io.to(to).emit("webrtc-ice-candidate", { from: socket.id, candidate });
    });

    // ---- Mic / camera state broadcast ----
    socket.on("toggle-mic", ({ micOn }) => {
      if (!currentRoomId) return;
      const room = getRoom(currentRoomId);
      const p = room.get(socket.id);
      if (p) p.micOn = micOn;
      io.to(currentRoomId).emit("participant-updated", { socketId: socket.id, micOn });
    });

    socket.on("toggle-camera", ({ cameraOn }) => {
      if (!currentRoomId) return;
      const room = getRoom(currentRoomId);
      const p = room.get(socket.id);
      if (p) p.cameraOn = cameraOn;
      io.to(currentRoomId).emit("participant-updated", { socketId: socket.id, cameraOn });
    });

    // ---- In-meeting chat ----
    socket.on("send-message", async ({ roomId, text }) => {
      if (!text?.trim()) return;
      const trimmed = text.trim();

      try {
        await Message.create({
          roomId: roomId.toUpperCase(),
          sender: socket.user.id,
          senderName: socket.user.name,
          text: trimmed,
        });
      } catch (err) {
        console.error("Failed to persist chat message:", err.message);
      }

      io.to(roomId.toUpperCase()).emit("receive-message", {
        id: `${Date.now()}-${socket.id}`,
        sender: socket.user.name,
        senderId: socket.user.id,
        text: trimmed,
        time: new Date().toISOString(),
      });
    });

    // ---- Leave / disconnect ----
    function leaveCurrentRoom() {
      if (!currentRoomId) return;
      const room = getRoom(currentRoomId);
      room.delete(socket.id);

      socket.to(currentRoomId).emit("user-left", { socketId: socket.id });

      if (room.size === 0) rooms.delete(currentRoomId);
      socket.leave(currentRoomId);
      currentRoomId = null;
    }

    socket.on("leave-room", leaveCurrentRoom);

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
      leaveCurrentRoom();
    });
  });
}
