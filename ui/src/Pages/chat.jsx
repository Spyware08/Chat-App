import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import socket from "../API/socket";

export default function Chat() {
  const { user } = useParams();
  const { state } = useLocation();

  const from = state.username;
  const initialMessages = state.initialMessages || [];

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(initialMessages);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.emit("register", from);

    socket.on("private_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("private_message");
  }, [from]);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("private_message", {
      from,
      to: user,
      message,
    });

    setMessages((prev) => [...prev, { from, message }]);
    setMessage("");
  };

  return (
    <div className="w-full">
      <h2 className="mb-4 font-semibold">Chat with {user}</h2>

      <div className="h-64 bg-gray-800 p-3 rounded overflow-y-auto mb-3 space-y-1">
        {messages?.map((m, ind) => (
          <div
            key={ind}
            className={`text-sm ${
              m?.from === from ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block px-3 py-1 rounded-lg ${
                m?.from === from
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-200"
              }`}
            >
              {m?.message}
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
          className="bg-blue-600 px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
