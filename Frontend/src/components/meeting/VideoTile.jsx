import { useEffect, useRef } from "react";
import { Mic, MicOff, VideoOff } from "lucide-react";
import { getInitials } from "../../utils/helpers.js";

const AVATAR_GRADIENTS = [
  "from-primary-500 to-indigo-700",
  "from-fuchsia-500 to-purple-700",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-700",
];

export default function VideoTile({
  name,
  micOn = true,
  cameraOn = true,
  isLocal = false,
  gradientIndex = 0,
  stream = null,
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !stream) return;

    video.srcObject = stream;

    video.play().catch((error) => {
      console.log("Video play error:", error);
    });
  }, [stream, cameraOn]);

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-800 shadow-lg">
      
      {/* Video always mounted */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className={`h-full w-full object-cover ${
          isLocal ? "scale-x-[-1]" : ""
        } ${cameraOn ? "block" : "hidden"}`}
      />

      {/* Camera Off Screen */}
      {!cameraOn && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-800 text-slate-400">
          <VideoOff className="h-8 w-8" />
          <span className="text-xs">Camera off</span>
        </div>
      )}

      {/* No stream fallback */}
      {cameraOn && !stream && (
        <div
          className={`absolute inset-0 flex h-full w-full items-center justify-center bg-gradient-to-br ${
            AVATAR_GRADIENTS[
              gradientIndex % AVATAR_GRADIENTS.length
            ]
          }`}
        >
          <span className="text-4xl font-bold text-white/90">
            {getInitials(name)}
          </span>
        </div>
      )}

      {/* Name */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-black/40 px-2.5 py-1 backdrop-blur-sm">
        <span className="text-xs font-medium text-white">
          {name} {isLocal && "(You)"}
        </span>
      </div>

      {/* Mic status */}
      <div className="absolute bottom-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
        {micOn ? (
          <Mic className="h-3.5 w-3.5 text-white" />
        ) : (
          <MicOff className="h-3.5 w-3.5 text-red-400" />
        )}
      </div>
    </div>
  );
}