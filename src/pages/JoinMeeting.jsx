import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Hash, Video } from "lucide-react";
import Input from "../components/common/Input.jsx";
import Button from "../components/common/Button.jsx";
import { isValidRoomId } from "../utils/helpers.js";

export default function JoinMeeting() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e) => {
    e.preventDefault();
    const trimmed = roomId.trim();
    if (!trimmed) {
      setError("Please enter a Room ID");
      return;
    }
    if (!isValidRoomId(trimmed)) {
      setError("That Room ID doesn't look right. Format: MEET-XXXX-XXXX");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    navigate(`/meeting/${trimmed.toUpperCase()}/prejoin`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
            <Video className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold text-slate-800">MeetFlow</span>
        </Link>

        <div className="card p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-800">Join a Meeting</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Enter the Room ID shared with you to join the meeting.
          </p>

          <form onSubmit={handleJoin} className="mt-6 space-y-4 text-left">
            <Input
              label="Room ID"
              icon={Hash}
              placeholder="MEET-7XK9-PQ2L"
              value={roomId}
              error={error}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <Button type="submit" loading={loading} className="w-full">
              Join Meeting
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-medium text-slate-400">OR</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <p className="text-sm text-slate-500">
            Don't have a Room ID?{" "}
            <Link to="/dashboard" className="font-semibold text-primary-600 hover:text-primary-700">
              Start a new meeting
            </Link>{" "}
            instead.
          </p>
        </div>
      </div>
    </div>
  );
}
