import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import socket from "../API/socket";
import { useChat } from "../context/ChatContext";

export default function GroupChat() {
  const { username, groupMessages, setUnreadGroup } = useChat();

  const [message, setMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  const emojiRef = useRef(null);

  // clear unread when opening group chat
  useEffect(() => {
    setUnreadGroup(0);
  }, []);

  // close emoji picker on outside click
  useEffect(() => {
    const handler = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowEmoji(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("group_message", {
      from: username,
      message,
    });

    setMessage("");
  };

  const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="w-full">
      {/* MESSAGES */}
      <div className="h-96 bg-gray-800 p-3 rounded overflow-y-auto mb-3">
        {groupMessages.map((m, i) => (
          <div
            key={i}
            className={`py-0.5 ${
              m.from === username ? "text-right" : "text-left"
            }`}
          >
            <span className="inline-block px-3 py-1 rounded bg-purple-600 text-white">
              <b className="font-serif">{m.from}:</b> {m.message}
            </span>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="relative flex gap-2 items-center">
        {/* Emoji button */}
        <button
          onClick={() => setShowEmoji((p) => !p)}
          className="text-2xl px-2"
        >
          😊
        </button>

        {/* Emoji picker */}
        {showEmoji && (
          <div
            ref={emojiRef}
            className="absolute bottom-14 left-0 z-50"
          >
            <EmojiPicker
              theme="dark"
              onEmojiClick={onEmojiClick}
              height={350}
              width={300}
            />
          </div>
        )}

        <input
          className="flex-1 bg-gray-800 px-3 py-2 rounded text-white"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message"
        />

        <button
          onClick={sendMessage}
          className="bg-purple-600 px-4 rounded text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
}
