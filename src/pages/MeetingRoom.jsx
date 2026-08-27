import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Video, Wifi } from "lucide-react";
import VideoTile from "../components/meeting/VideoTile.jsx";
import MeetingControls from "../components/meeting/MeetingControls.jsx";
import ParticipantsPanel from "../components/meeting/ParticipantsPanel.jsx";
import ChatPanel from "../components/meeting/ChatPanel.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../components/common/Toast.jsx";
import { mockParticipants, mockMessages } from "../data/mockData.js";
import { copyToClipboard } from "../utils/helpers.js";

export default function MeetingRoom() {
  const { roomId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [micOn, setMicOn] = useState(state?.micOn ?? true);
  const [cameraOn, setCameraOn] = useState(state?.cameraOn ?? true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState(mockMessages);

  const remoteParticipants = mockParticipants.filter((p) => !p.isHost);

  const handleSendMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `c_${Date.now()}`,
        sender: user?.name || "You",
        text,
        time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const handleCopyLink = async () => {
    const ok = await copyToClipboard(`${window.location.origin}/meeting/${roomId}/prejoin`);
    showToast(ok ? "Meeting link copied" : "Couldn't copy link", ok ? "success" : "error");
  };

  return (
    <div className="flex h-screen flex-col bg-slate-950">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
            <Video className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">MeetFlow &middot; {roomId}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Wifi className="h-3.5 w-3.5 text-green-400" /> Connected
          </span>
          <span>32:14</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {remoteParticipants.map((p, i) => (
              <VideoTile key={p.id} name={p.name} micOn={p.micOn} cameraOn={p.cameraOn} gradientIndex={i} />
            ))}
            <VideoTile name={user?.name || "You"} micOn={micOn} cameraOn={cameraOn} isLocal gradientIndex={3} />
          </div>
        </div>

        <ParticipantsPanel
          isOpen={showParticipants}
          onClose={() => setShowParticipants(false)}
          participants={mockParticipants}
        />
        <ChatPanel
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      </div>

      {/* Controls */}
      <div className="flex justify-center border-t border-slate-800 px-5 py-4">
        <MeetingControls
          micOn={micOn}
          cameraOn={cameraOn}
          onToggleMic={() => setMicOn((v) => !v)}
          onToggleCamera={() => setCameraOn((v) => !v)}
          onToggleParticipants={() => {
            setShowParticipants((v) => !v);
            setShowChat(false);
          }}
          onToggleChat={() => {
            setShowChat((v) => !v);
            setShowParticipants(false);
          }}
          onCopyLink={handleCopyLink}
          onLeave={() => navigate("/dashboard")}
        />
      </div>
    </div>
  );
}
