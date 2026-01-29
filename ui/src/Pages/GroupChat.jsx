import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import socket from "../API/socket";

export default function GroupChat() {
  const { state } = useLocation();
  const username = state.username;
  const initialMessages = state.initialMessages || [];

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(initialMessages);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.emit("register", username);

    socket.on("group_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("group_message");
  }, [username]);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("group_message", {
      from: username,
      message,
    });

    setMessage("");
  };

  return (
    <div className="w-full">
      <h2 className="mb-4 font-semibold">
        Room Chat
      </h2>

      <div className="h-64 bg-gray-800 p-3 rounded overflow-y-auto mb-3 space-y-1">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`text-sm ${
              m.from === username ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block px-3 py-1 rounded-lg ${
                m.from === username
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-200"
              }`}
            >
              <b>{m.from}:</b> {m.message}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 bg-gray-800 border border-gray-600 px-3 py-2 rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
        />

        <button
          onClick={sendMessage}
          className="bg-purple-600 px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
