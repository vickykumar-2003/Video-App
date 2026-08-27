import { createContext, useContext, useState, useCallback } from "react";
import { initialMeetings, generateRoomId } from "../data/mockData.js";

const MeetingContext = createContext(null);

export function MeetingProvider({ children }) {
  const [meetings, setMeetings] = useState(initialMeetings);

  // Mock create — replace with axios.post('/api/meetings') later
  const createMeeting = useCallback(({ title, description }) => {
    const newMeeting = {
      id: `m_${Date.now()}`,
      title: title?.trim() || "Untitled Meeting",
      description: description?.trim() || "",
      roomId: generateRoomId(),
      date: new Date().toISOString(),
      status: "upcoming",
    };
    setMeetings((prev) => [newMeeting, ...prev]);
    return newMeeting;
  }, []);

  // Mock lookup — replace with axios.get(`/api/meetings/${roomId}`) later
  const findMeetingByRoomId = useCallback(
    (roomId) => meetings.find((m) => m.roomId.toUpperCase() === roomId.toUpperCase()),
    [meetings]
  );

  return (
    <MeetingContext.Provider value={{ meetings, createMeeting, findMeetingByRoomId }}>
      {children}
    </MeetingContext.Provider>
  );
}

export function useMeetings() {
  const ctx = useContext(MeetingContext);
  if (!ctx) throw new Error("useMeetings must be used within MeetingProvider");
  return ctx;
}
