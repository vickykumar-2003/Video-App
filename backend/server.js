import "dotenv/config";
import dns from "dns";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { initSocket } from "./sockets/socketHandler.js";

await connectDB();

const app = express();
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173").split(",");

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/meetings", meetingRoutes);

app.use(notFound);
app.use(errorHandler);

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: allowedOrigins, credentials: true },
});
initSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`MeetFlow backend running on port ${PORT}`);
});
