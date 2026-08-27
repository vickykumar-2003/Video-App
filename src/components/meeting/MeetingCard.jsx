import { useNavigate } from "react-router-dom";
import { Video, MoreVertical, Clock } from "lucide-react";
import { formatDate, formatTime } from "../../utils/helpers.js";

const STATUS_STYLES = {
  upcoming: "bg-primary-50 text-primary-700",
  completed: "bg-slate-100 text-slate-500",
  live: "bg-green-50 text-green-700",
};

export default function MeetingCard({ meeting }) {
  const navigate = useNavigate();

  return (
    <div className="card flex flex-col gap-4 p-5 transition-shadow hover:shadow-soft">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <Video className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800">{meeting.title}</h4>
            <p className="font-mono text-xs text-slate-400">{meeting.roomId}</p>
          </div>
        </div>
        <button className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
          <MoreVertical className="h-4.5 w-4.5" />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Clock className="h-3.5 w-3.5" />
          {formatDate(meeting.date)} &middot; {formatTime(meeting.date)}
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[meeting.status]}`}
        >
          {meeting.status}
        </span>
      </div>

      <button
        onClick={() => navigate(`/meeting/${meeting.roomId}/prejoin`)}
        className="btn-primary w-full"
      >
        Join
      </button>
    </div>
  );
}
