import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import Button from "../components/common/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getInitials } from "../utils/helpers.js";

export default function PreJoin() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-6 py-12">
      <div className="w-full max-w-md text-center">
        <h1 className="text-xl font-bold text-white">Ready to join?</h1>
        <p className="mt-1 text-sm text-slate-400">
          Room <span className="font-mono text-primary-400">{roomId}</span>
        </p>

        <div className="relative mx-auto mt-6 aspect-video overflow-hidden rounded-2xl shadow-xl">
          {cameraOn ? (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-500 to-indigo-700">
              <span className="text-4xl font-bold text-white/90">{getInitials(user?.name)}</span>
            </div>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-800 text-slate-400">
              <VideoOff className="h-8 w-8" />
              <span className="text-xs">Camera is off</span>
            </div>
          )}
          <span className="absolute bottom-3 left-3 rounded-lg bg-black/40 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {user?.name}
          </span>
        </div>

        <div className="mt-5 flex items-center justify-center gap-4">
          <button
            onClick={() => setMicOn((v) => !v)}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
              micOn ? "bg-slate-700 text-white hover:bg-slate-600" : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setCameraOn((v) => !v)}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
              cameraOn ? "bg-slate-700 text-white hover:bg-slate-600" : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            {cameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </button>
        </div>

        <div className="mt-8 flex justify-center gap-3">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button onClick={() => navigate(`/meeting/${roomId}`, { state: { micOn, cameraOn } })}>
            Join Now
          </Button>
        </div>
      </div>
    </div>
  );
}
