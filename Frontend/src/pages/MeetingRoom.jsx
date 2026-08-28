import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Video, Wifi } from "lucide-react";
import { io } from "socket.io-client";

import VideoTile from "../components/meeting/VideoTile.jsx";
import MeetingControls from "../components/meeting/MeetingControls.jsx";
import ParticipantsPanel from "../components/meeting/ParticipantsPanel.jsx";
import ChatPanel from "../components/meeting/ChatPanel.jsx";

import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../components/common/Toast.jsx";
import { copyToClipboard } from "../utils/helpers.js";

const SOCKET_URL = "http://localhost:5000";

export default function MeetingRoom() {
  const { roomId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const { user } = useAuth();
  const { showToast } = useToast();

  const [micOn, setMicOn] = useState(state?.micOn ?? true);
  const [cameraOn, setCameraOn] = useState(state?.cameraOn ?? true);

  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);

  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});

  const socketRef = useRef(null);
  const peersRef = useRef({});
  const localStreamRef = useRef(null);

  // --------------------------------
  // Create WebRTC Peer Connection
  // --------------------------------
  const createPeerConnection = useCallback((socketId) => {
    if (peersRef.current[socketId]) {
      return peersRef.current[socketId];
    }

    const pc = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });

    // Add local audio + video tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current);
      });
    }

    // Send ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit("webrtc-ice-candidate", {
          to: socketId,
          candidate: event.candidate,
        });
      }
    };

    // Receive remote stream
    pc.ontrack = (event) => {
      console.log("Remote track received:", event.track.kind);

      setRemoteStreams((prev) => {
        const stream = prev[socketId] || new MediaStream();
        stream.addTrack(event.track);

        return {
          ...prev,
          [socketId]: stream,
        };
      });
    };

    pc.onconnectionstatechange = () => {
      console.log("Peer state:", socketId, pc.connectionState);

      if (
        pc.connectionState === "failed" ||
        pc.connectionState === "closed"
      ) {
        pc.close();

        delete peersRef.current[socketId];

        setRemoteStreams((prev) => {
          const updated = { ...prev };
          delete updated[socketId];
          return updated;
        });
      }
    };

    peersRef.current[socketId] = pc;

    return pc;
  }, []);

  // --------------------------------
  // Start Camera + Microphone
  // --------------------------------
  useEffect(() => {
    let stream = null;
    let socket = null;
    let isMounted = true;

    const startMedia = async () => {
      try {
        // Get camera and microphone
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        // Initial mic state
        stream.getAudioTracks().forEach((track) => {
          track.enabled = state?.micOn ?? true;
        });

        // Initial camera state
        stream.getVideoTracks().forEach((track) => {
          track.enabled = state?.cameraOn ?? true;
        });

        localStreamRef.current = stream;
        setLocalStream(stream);

        console.log(
          "Local stream started:",
          stream.getTracks().map((track) => track.kind)
        );

        const token = localStorage.getItem("token");

        if (!token) {
          stream.getTracks().forEach((track) => track.stop());

          showToast("Please login again", "error");
          navigate("/login");
          return;
        }

        // Connect socket
        socket = io(SOCKET_URL, {
          auth: {
            token,
          },
        });

        socketRef.current = socket;

        // Socket connected
        socket.on("connect", () => {
          console.log("Socket connected:", socket.id);

          socket.emit("join-room", {
            roomId,
            micOn: stream.getAudioTracks()[0]?.enabled ?? false,
            cameraOn: stream.getVideoTracks()[0]?.enabled ?? false,
          });
        });

        // Existing participants
        socket.on("room-participants", async (roomParticipants) => {
          console.log("Room participants:", roomParticipants);

          // Remove duplicate participants
          const uniqueParticipants = roomParticipants.filter(
            (participant, index, array) =>
              participant.socketId &&
              array.findIndex(
                (p) => p.socketId === participant.socketId
              ) === index
          );

          setParticipants(uniqueParticipants);

          // Create offers only for OTHER users
          for (const participant of uniqueParticipants) {
            if (
              participant.socketId === socket.id ||
              participant.userId === user?.id ||
              participant.userId === user?._id
            ) continue;

            try {
              const pc = createPeerConnection(participant.socketId);

              const offer = await pc.createOffer();

              await pc.setLocalDescription(offer);

              socket.emit("webrtc-offer", {
                to: participant.socketId,
                offer,
              });
            } catch (error) {
              console.error("Offer error:", error);
            }
          }
        });

        // New participant joined
        socket.on("user-joined", (participant) => {
          console.log("User joined:", participant);

          // Don't add yourself
          if (
            participant.socketId === socket.id ||
            participant.userId === user?.id ||
            participant.userId === user?._id
          ) return;

          setParticipants((prev) => {
            const exists = prev.some(
              (p) => p.socketId === participant.socketId
            );

            if (exists) return prev;

            return [...prev, participant];
          });
        });

        // Receive WebRTC offer
        socket.on("webrtc-offer", async ({ from, offer }) => {
          try {
            if (from === socket.id) return;

            console.log("Received offer from:", from);

            const pc = createPeerConnection(from);

            await pc.setRemoteDescription(
              new RTCSessionDescription(offer)
            );

            const answer = await pc.createAnswer();

            await pc.setLocalDescription(answer);

            socket.emit("webrtc-answer", {
              to: from,
              answer,
            });
          } catch (error) {
            console.error("Answer error:", error);
          }
        });

        // Receive WebRTC answer
        socket.on("webrtc-answer", async ({ from, answer }) => {
          try {
            if (from === socket.id) return;

            const pc = peersRef.current[from];

            if (!pc) return;

            console.log("Received answer from:", from);

            await pc.setRemoteDescription(
              new RTCSessionDescription(answer)
            );
          } catch (error) {
            console.error("Set answer error:", error);
          }
        });

        // Receive ICE candidate
        socket.on(
          "webrtc-ice-candidate",
          async ({ from, candidate }) => {
            try {
              if (from === socket.id) return;

              const pc = peersRef.current[from];

              if (!pc) return;

              await pc.addIceCandidate(
                new RTCIceCandidate(candidate)
              );
            } catch (error) {
              console.error("ICE candidate error:", error);
            }
          }
        );

        // Participant mic/camera updated
        socket.on("participant-updated", (data) => {
          setParticipants((prev) =>
            prev.map((participant) =>
              participant.socketId === data.socketId
                ? { ...participant, ...data }
                : participant
            )
          );
        });

        // User left
        socket.on("user-left", ({ socketId }) => {
          console.log("User left:", socketId);

          setParticipants((prev) =>
            prev.filter(
              (participant) => participant.socketId !== socketId
            )
          );

          const pc = peersRef.current[socketId];

          if (pc) {
            pc.close();
            delete peersRef.current[socketId];
          }

          setRemoteStreams((prev) => {
            const updated = { ...prev };
            delete updated[socketId];
            return updated;
          });
        });

        // Receive chat message
        socket.on("receive-message", (message) => {
          setMessages((prev) => [...prev, message]);
        });

        // Socket error
        socket.on("connect_error", (error) => {
          console.error("Socket error:", error.message);
          showToast(error.message, "error");
        });
      } catch (error) {
        console.error("Media error:", error);

        showToast(
          "Camera and microphone permission is required",
          "error"
        );
      }
    };

    startMedia();

    // Cleanup
    return () => {
      isMounted = false;

      if (socket) {
        // Remove all listeners to prevent memory leaks or duplicate execution
        socket.off("connect");
        socket.off("room-participants");
        socket.off("user-joined");
        socket.off("webrtc-offer");
        socket.off("webrtc-answer");
        socket.off("webrtc-ice-candidate");
        socket.off("participant-updated");
        socket.off("user-left");
        socket.off("receive-message");
        socket.off("connect_error");

        socket.emit("leave-room");
        socket.disconnect();
      }

      Object.values(peersRef.current).forEach((pc) => {
        pc.close();
      });

      peersRef.current = {};

      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }

      localStreamRef.current = null;
      socketRef.current = null;
    };
  }, [
    roomId,
    createPeerConnection,
    navigate,
    showToast,
    state?.micOn,
    state?.cameraOn,
  ]);

  // --------------------------------
  // Toggle Microphone
  // --------------------------------
  const handleToggleMic = () => {
    const nextValue = !micOn;

    setMicOn(nextValue);

    if (localStreamRef.current) {
      localStreamRef.current
        .getAudioTracks()
        .forEach((track) => {
          track.enabled = nextValue;
        });
    }

    socketRef.current?.emit("toggle-mic", {
      micOn: nextValue,
    });
  };

  // --------------------------------
  // Toggle Camera
  // --------------------------------
  const handleToggleCamera = () => {
    const nextValue = !cameraOn;

    setCameraOn(nextValue);

    if (localStreamRef.current) {
      localStreamRef.current
        .getVideoTracks()
        .forEach((track) => {
          track.enabled = nextValue;
        });
    }

    socketRef.current?.emit("toggle-camera", {
      cameraOn: nextValue,
    });
  };

  // --------------------------------
  // Send Chat Message
  // --------------------------------
  const handleSendMessage = (text) => {
    if (!text?.trim()) return;

    socketRef.current?.emit("send-message", {
      roomId,
      text,
    });
  };

  // --------------------------------
  // Copy Meeting Link
  // --------------------------------
  const handleCopyLink = async () => {
    const ok = await copyToClipboard(
      `${window.location.origin}/meeting/${roomId}/prejoin`
    );

    showToast(
      ok ? "Meeting link copied" : "Couldn't copy link",
      ok ? "success" : "error"
    );
  };

  // --------------------------------
  // Leave Meeting
  // --------------------------------
  const handleLeave = () => {
    socketRef.current?.emit("leave-room");

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
    }

    socketRef.current?.disconnect();

    navigate("/dashboard");
  };

  // --------------------------------
  // ONLY REMOTE PARTICIPANTS
  // --------------------------------
  const remoteParticipants = participants.filter(
    (participant) =>
      participant.socketId &&
      participant.socketId !== socketRef.current?.id &&
      participant.userId !== user?.id &&
      participant.userId !== user?._id
  );

  return (
    <div className="flex h-screen flex-col bg-slate-950">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
            <Video className="h-4 w-4" />
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              MeetFlow · {roomId}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Wifi className="h-3.5 w-3.5 text-green-400" />
            Connected
          </span>

          <span>
            {remoteParticipants.length + 1} participant
            {remoteParticipants.length + 1 !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {/* Remote users */}
            {remoteParticipants.map((participant, index) => (
              <VideoTile
                key={participant.socketId}
                name={participant.name}
                micOn={participant.micOn ?? true}
                cameraOn={participant.cameraOn ?? true}
                isLocal={false}
                gradientIndex={index}
                stream={
                  remoteStreams[participant.socketId] ?? null
                }
              />
            ))}

            {/* Local user - ONLY ONE TIME */}
            <VideoTile
              name={user?.name || "You"}
              micOn={micOn}
              cameraOn={cameraOn}
              isLocal={true}
              gradientIndex={3}
              stream={localStream}
            />
          </div>
        </div>

        {/* Participants Panel */}
        <ParticipantsPanel
          isOpen={showParticipants}
          onClose={() => setShowParticipants(false)}
          participants={[
            {
              id: "local",
              name: user?.name || "You",
              micOn,
              cameraOn,
              isHost: true,
            },
            ...remoteParticipants.map((participant) => ({
              id: participant.socketId,
              ...participant,
            })),
          ]}
        />

        {/* Chat Panel */}
        <ChatPanel
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      </div>

      {/* Controls */}
      <div className="flex justify-center border-t border-slate-800 px-5 py-4">
        <MeetingControls
          micOn={micOn}
          cameraOn={cameraOn}
          onToggleMic={handleToggleMic}
          onToggleCamera={handleToggleCamera}
          onToggleParticipants={() => {
            setShowParticipants((value) => !value);
            setShowChat(false);
          }}
          onToggleChat={() => {
            setShowChat((value) => !value);
            setShowParticipants(false);
          }}
          onCopyLink={handleCopyLink}
          onLeave={handleLeave}
        />
      </div>
    </div>
  );
}