import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, Link2, CheckCircle2 } from "lucide-react";
import Modal from "../common/Modal.jsx";
import Input from "../common/Input.jsx";
import Button from "../common/Button.jsx";
import { useMeetings } from "../../context/MeetingContext.jsx";
import { useToast } from "../common/Toast.jsx";
import { copyToClipboard } from "../../utils/helpers.js";

export default function CreateMeetingModal({ isOpen, onClose }) {
  const { createMeeting } = useMeetings();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(null);

  const handleCreate = async () => {
    if (!title.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const meeting = createMeeting({ title, description });
    setCreated(meeting);
    setLoading(false);
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setCreated(null);
    onClose();
  };

  const meetingLink = created ? `${window.location.origin}/meeting/${created.roomId}/prejoin` : "";

  const handleCopy = async (text, label) => {
    const ok = await copyToClipboard(text);
    showToast(ok ? `${label} copied to clipboard` : "Couldn't copy — try again", ok ? "success" : "error");
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={created ? "Meeting Created" : "Start New Meeting"}>
      {!created ? (
        <div className="space-y-4">
          <Input label="Meeting Title" placeholder="e.g. Product Sync" value={title} onChange={(e) => setTitle(e.target.value)} />
          <div className="w-full">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Description <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="What's this meeting about?"
              className="input-field resize-none"
            />
          </div>
          <Button onClick={handleCreate} loading={loading} disabled={!title.trim()} className="w-full">
            Create Meeting
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center gap-3 rounded-xl bg-green-50 px-4 py-3 text-green-700">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <p className="text-sm font-medium">Meeting Created Successfully</p>
          </div>

          <div className="space-y-3 rounded-xl border border-slate-200 p-4">
            <div>
              <p className="text-xs font-medium text-slate-400">Meeting Name</p>
              <p className="text-sm font-semibold text-slate-800">{created.title}</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">Room ID</p>
                <p className="font-mono text-sm font-semibold text-primary-700">{created.roomId}</p>
              </div>
              <button onClick={() => handleCopy(created.roomId, "Room ID")} className="btn-secondary !px-3 !py-1.5">
                <Copy className="h-3.5 w-3.5" /> Copy
              </button>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-400">Meeting Link</p>
                <p className="truncate text-xs text-slate-600">{meetingLink}</p>
              </div>
              <button onClick={() => handleCopy(meetingLink, "Meeting link")} className="btn-secondary shrink-0 !px-3 !py-1.5">
                <Link2 className="h-3.5 w-3.5" /> Copy
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleClose} className="flex-1">
              Close
            </Button>
            <Button
              onClick={() => {
                handleClose();
                navigate(`/meeting/${created.roomId}/prejoin`);
              }}
              className="flex-1"
            >
              Join Now
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
