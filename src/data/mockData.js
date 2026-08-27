// Frontend-only mock data. Swap for real API responses later.

export function generateRoomId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const seg = (len) =>
    Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `MEET-${seg(4)}-${seg(4)}`;
}

export const initialMeetings = [
  {
    id: "m_1",
    title: "Product Roadmap Sync",
    roomId: "MEET-7XK9-PQ2L",
    date: "2026-08-25T10:00:00",
    status: "upcoming",
    description: "Q3 roadmap review with the product team.",
  },
  {
    id: "m_2",
    title: "Design Review — MeetFlow UI",
    roomId: "MEET-3F8H-M4T1",
    date: "2026-08-24T15:30:00",
    status: "completed",
    description: "Walkthrough of the new dashboard designs.",
  },
  {
    id: "m_3",
    title: "1:1 with Rahul",
    roomId: "MEET-9Q2Z-K7WX",
    date: "2026-08-26T11:00:00",
    status: "upcoming",
    description: "",
  },
  {
    id: "m_4",
    title: "Engineering Standup",
    roomId: "MEET-2L5T-BV8N",
    date: "2026-08-23T09:15:00",
    status: "completed",
    description: "Daily sync on sprint progress.",
  },
];

export const mockParticipants = [
  { id: "p_1", name: "Vicky Kumar (You)", isHost: true, micOn: true, cameraOn: true },
  { id: "p_2", name: "Rahul Sharma", isHost: false, micOn: true, cameraOn: false },
  { id: "p_3", name: "Priya Singh", isHost: false, micOn: false, cameraOn: true },
  { id: "p_4", name: "Aman Verma", isHost: false, micOn: true, cameraOn: true },
];

export const mockMessages = [
  { id: "c_1", sender: "Priya Singh", text: "Good morning everyone!", time: "09:58 AM" },
  { id: "c_2", sender: "Rahul Sharma", text: "Sharing the deck now.", time: "10:01 AM" },
  { id: "c_3", sender: "Aman Verma", text: "Looks great, no notes from me.", time: "10:04 AM" },
];
