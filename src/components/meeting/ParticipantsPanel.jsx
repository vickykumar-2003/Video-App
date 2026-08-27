import { X, Mic, MicOff, MoreVertical, Crown } from "lucide-react";
import { getInitials } from "../../utils/helpers.js";

export default function ParticipantsPanel({ isOpen, onClose, participants }) {
  if (!isOpen) return null;

  return (
    <div className="flex h-full w-80 shrink-0 flex-col border-l border-slate-800 bg-slate-900 text-white">
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
        <h3 className="text-sm font-semibold">Participants ({participants.length})</h3>
        <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800">
          <X className="h-4.5 w-4.5" />
        </button>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto p-3">
        {participants.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-slate-800"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-xs font-semibold">
                {getInitials(p.name)}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium">{p.name}</span>
                {p.isHost && <Crown className="h-3.5 w-3.5 text-amber-400" />}
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              {p.micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4 text-red-400" />}
              <button className="hover:text-white">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
