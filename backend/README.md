# MeetFlow Backend

Express + MongoDB (Mongoose) + Socket.IO backend for the MeetFlow video
conferencing frontend.

## What's included
- **Auth API** — register, login (JWT), get/update current user
- **Meetings API** — create, list, fetch by Room ID, join, update status
- **Socket.IO** — real-time in-meeting chat, participant presence, and
  WebRTC signaling relay (offer / answer / ICE candidates). Actual peer
  video/audio streams still flow browser-to-browser via WebRTC — this
  server only relays the signaling messages needed to set that up.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your values:
   ```
   cp .env.example .env
   ```
   - `MONGO_URI` — local MongoDB (`mongodb://127.0.0.1:27017/meetflow`) or a
     MongoDB Atlas connection string
   - `JWT_SECRET` — any long random string
   - `CLIENT_URL` — your frontend origin (default `http://localhost:5173`)

3. Start MongoDB locally (if not using Atlas), then run the server:
   ```
   npm run dev
   ```
   Server starts on `http://localhost:5000` by default.

## REST API

| Method | Route                          | Auth | Description                  |
|--------|---------------------------------|------|-------------------------------|
| POST   | /api/auth/register              | No   | Create an account             |
| POST   | /api/auth/login                 | No   | Log in, returns JWT           |
| GET    | /api/auth/me                    | Yes  | Get current user              |
| PATCH  | /api/auth/me                    | Yes  | Update name/email             |
| POST   | /api/meetings                   | Yes  | Create a meeting (Room ID auto-generated) |
| GET    | /api/meetings                   | Yes  | List meetings you host        |
| GET    | /api/meetings/:roomId           | Yes  | Get meeting details           |
| POST   | /api/meetings/:roomId/join      | Yes  | Validate a room before joining|
| PATCH  | /api/meetings/:roomId/status    | Yes  | Update status (upcoming/live/completed) |

Send the JWT as `Authorization: Bearer <token>` on protected routes.

## Socket.IO events

Connect with the JWT in the handshake auth payload:
```js
const socket = io("http://localhost:5000", { auth: { token } });
```

**Client → Server**
- `join-room` `{ roomId, micOn, cameraOn }`
- `webrtc-offer` `{ to, offer }`
- `webrtc-answer` `{ to, answer }`
- `webrtc-ice-candidate` `{ to, candidate }`
- `toggle-mic` `{ micOn }`
- `toggle-camera` `{ cameraOn }`
- `send-message` `{ roomId, text }`
- `leave-room`

**Server → Client**
- `room-participants` — current roster on join
- `user-joined` / `user-left`
- `webrtc-offer` / `webrtc-answer` / `webrtc-ice-candidate` — relayed to a specific peer
- `participant-updated` — mic/camera state changed
- `receive-message` — new chat message

## Connecting the existing frontend

The frontend currently uses mock data in `AuthContext` and `MeetingContext`.
To wire it up:
1. Replace the mock `login`/`register` calls with `axios.post` to
   `/api/auth/login` and `/api/auth/register`, and store the returned JWT
   (e.g. in memory or `sessionStorage`).
2. Replace `createMeeting`/`findMeetingByRoomId` with calls to the
   `/api/meetings` endpoints, sending the JWT on each request.
3. In `MeetingRoom.jsx`, connect a Socket.IO client on mount, emit
   `join-room`, and use `RTCPeerConnection` + the signaling events above to
   set up real audio/video between participants.
