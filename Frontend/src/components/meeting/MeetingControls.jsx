import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  Users,
  MessageSquare,
  Link2,
  PhoneOff,
} from "lucide-react";
import Tooltip from "../common/Tooltip.jsx";

function ControlButton({ label, icon: Icon, active, onClick, danger }) {
  return (
    <Tooltip label={label}>
      <button
        onClick={onClick}
        className={`flex h-12 w-12 items-center justify-center rounded-full transition-all active:scale-95 ${
          danger
            ? "bg-red-500 text-white hover:bg-red-600"
            : active
            ? "bg-slate-700 text-white hover:bg-slate-600"
            : "bg-red-500/90 text-white hover:bg-red-500"
        }`}
      >
        <Icon className="h-5 w-5" />
      </button>
    </Tooltip>
  );
}

export default function MeetingControls({
  micOn,
  cameraOn,
  onToggleMic,
  onToggleCamera,
  onToggleParticipants,
  onToggleChat,
  onCopyLink,
  onLeave,
}) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-2xl bg-slate-900/90 px-5 py-3 backdrop-blur-md">
      <ControlButton label={micOn ? "Mute" : "Unmute"} icon={micOn ? Mic : MicOff} active={micOn} onClick={onToggleMic} />
      <ControlButton
        label={cameraOn ? "Turn off camera" : "Turn on camera"}
        icon={cameraOn ? Video : VideoOff}
        active={cameraOn}
        onClick={onToggleCamera}
      />
      <Tooltip label="Share screen">
        <button className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-700 text-white transition-all hover:bg-slate-600 active:scale-95">
          <ScreenShare className="h-5 w-5" />
        </button>
      </Tooltip>
      <Tooltip label="Participants">
        <button
          onClick={onToggleParticipants}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-700 text-white transition-all hover:bg-slate-600 active:scale-95"
        >
          <Users className="h-5 w-5" />
        </button>
      </Tooltip>
      <Tooltip label="Chat">
        <button
          onClick={onToggleChat}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-700 text-white transition-all hover:bg-slate-600 active:scale-95"
        >
          <MessageSquare className="h-5 w-5" />
        </button>
      </Tooltip>
      <Tooltip label="Copy meeting link">
        <button
          onClick={onCopyLink}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-700 text-white transition-all hover:bg-slate-600 active:scale-95"
        >
          <Link2 className="h-5 w-5" />
        </button>
      </Tooltip>
      <div className="mx-1 h-8 w-px bg-slate-700" />
      <Tooltip label="Leave meeting">
        <button
          onClick={onLeave}
          className="flex h-12 items-center gap-2 rounded-full bg-red-500 px-5 text-white transition-all hover:bg-red-600 active:scale-95"
        >
          <PhoneOff className="h-5 w-5" />
          <span className="hidden text-sm font-semibold sm:inline">Leave</span>
        </button>
      </Tooltip>
    </div>
  );
}
