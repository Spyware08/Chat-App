import { useState } from "react";
import socket from "../API/socket";
import { useChat } from "../context/ChatContext";

export default function GroupChat() {
  const { username, groupMessages, setUnreadGroup } = useChat();
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("group_message", {
      from: username,
      message,
    });

    setMessage("");
  };

  useState(() => setUnreadGroup(0), []);

  return (
    <div className="w-full">
      <div className="h-100 bg-gray-800 p-3 rounded overflow-y-auto mb-3">
        {groupMessages.map((m, i) => (
          <div key={i} className={`${m.from === username ? "text-right" : "text-left"} py-0.5`}>
            <span className="inline-block px-3 py-1 rounded bg-purple-600 text-white">
              <b className="font-serif under">{m.from}:</b> {m.message}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 bg-gray-800 px-3 py-2 rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage} className="bg-purple-600 px-4 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
