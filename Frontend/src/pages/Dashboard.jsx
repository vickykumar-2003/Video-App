import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Video, LogIn } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import MeetingCard from "../components/meeting/MeetingCard.jsx";
import CreateMeetingModal from "../components/meeting/CreateMeetingModal.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useMeetings } from "../context/MeetingContext.jsx";
import { getInitials } from "../utils/helpers.js";

export default function Dashboard() {
  const { user } = useAuth();
  const { meetings } = useMeetings();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome back, {user?.name?.split(" ")[0]} 👋</h1>
          <p className="mt-1 text-sm text-slate-500">Ready to start your next meeting?</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 hover:bg-slate-50">
            <Bell className="h-4.5 w-4.5" />
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white">
            {getInitials(user?.name)}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-3xl bg-gradient-to-br from-primary-600 to-indigo-700 p-8 text-white">
        <h2 className="text-xl font-bold sm:text-2xl">Start Connecting</h2>
        <p className="mt-1.5 max-w-md text-sm text-primary-100">
          Create a new meeting or join an existing one.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-primary-700 shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Video className="h-4 w-4" />
            Start New Meeting
          </button>
          <button
            onClick={() => navigate("/join")}
            className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <LogIn className="h-4 w-4" />
            Join Meeting
          </button>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="mb-4 text-base font-semibold text-slate-800">Recent Meetings</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {meetings.slice(0, 4).map((m) => (
            <MeetingCard key={m.id} meeting={m} />
          ))}
        </div>
      </div>

      <CreateMeetingModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </DashboardLayout>
  );
}
