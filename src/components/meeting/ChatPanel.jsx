import { useState, useRef, useEffect } from "react";
import { X, Send } from "lucide-react";

export default function ChatPanel({ isOpen, onClose, messages, onSendMessage }) {
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!text.trim()) return;
    onSendMessage(text.trim());
    setText("");
  };

  return (
    <div className="flex h-full w-80 shrink-0 flex-col border-l border-slate-800 bg-slate-900 text-white">
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
        <h3 className="text-sm font-semibold">In-Meeting Chat</h3>
        <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800">
          <X className="h-4.5 w-4.5" />
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((m) => (
          <div key={m.id}>
            <div className="mb-1 flex items-baseline gap-2">
              <span className="text-xs font-semibold text-primary-400">{m.sender}</span>
              <span className="text-[10px] text-slate-500">{m.time}</span>
            </div>
            <p className="text-sm text-slate-200">{m.text}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-2 border-t border-slate-800 p-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 rounded-xl bg-slate-800 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button
          onClick={handleSend}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-600 hover:bg-primary-700"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
