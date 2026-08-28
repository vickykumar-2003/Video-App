const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function segment(length) {
  return Array.from({ length }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join("");
}

export function generateRoomId() {
  return `MEET-${segment(4)}-${segment(4)}`;
}
