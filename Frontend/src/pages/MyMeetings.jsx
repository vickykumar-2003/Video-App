import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Plus, CalendarX2 } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import MeetingCard from "../components/meeting/MeetingCard.jsx";
import CreateMeetingModal from "../components/meeting/CreateMeetingModal.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import { useMeetings } from "../context/MeetingContext.jsx";

export default function MyMeetings() {
  const { meetings } = useMeetings();
  const [query, setQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filtered = useMemo(() => {
    if (!query.trim()) return meetings;
    const q = query.toLowerCase();
    return meetings.filter(
      (m) => m.title.toLowerCase().includes(q) || m.roomId.toLowerCase().includes(q)
    );
  }, [meetings, query]);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-800">My Meetings</h1>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search meetings..."
              className="input-field w-56 pl-10"
            />
          </div>
          <button className="btn-secondary">
            <SlidersHorizontal className="h-4 w-4" />
            Filter
          </button>
          <button onClick={() => setShowCreateModal(true)} className="btn-primary">
            <Plus className="h-4 w-4" />
            Create Meeting
          </button>
        </div>
      </div>

      <div className="mt-8">
        {meetings.length === 0 ? (
          <EmptyState
            icon={CalendarX2}
            title="No meetings yet"
            description="Create your first meeting to get started."
            action={
              <button onClick={() => setShowCreateModal(true)} className="btn-primary">
                Create Meeting
              </button>
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No results found"
            description={`We couldn't find any meetings matching "${query}".`}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((m) => (
              <MeetingCard key={m.id} meeting={m} />
            ))}
          </div>
        )}
      </div>

      <CreateMeetingModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </DashboardLayout>
  );
}
