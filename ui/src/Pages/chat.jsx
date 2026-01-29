import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import { useChat } from "../context/ChatContext";

export default function Chat() {
  const { user } = useParams();

  const {
    username,
    privateChats,
    sendPrivateMessage,
    setUnreadPrivate,
  } = useChat();

  const [message, setMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  const emojiRef = useRef(null);

  const messages = privateChats[user] || [];

  // clear unread
  useEffect(() => {
    setUnreadPrivate((prev) => ({
      ...prev,
      [user]: 0,
    }));
  }, [user]);

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

    sendPrivateMessage({
      from: username,
      to: user,
      message,
    });

    setMessage("");
  };

  const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="w-full">
      <h2 className="mb-4 font-semibold text-white">
        Chat with
        <span className="text-violet-600 font-serif mx-1">
          {user}
        </span>
      </h2>

      {/* MESSAGES */}
      <div className="h-96 bg-gray-800 p-3 rounded overflow-y-auto mb-3 space-y-1">
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
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-200"
              }`}
            >
              {m.message}
            </span>
          </div>
        ))}
      </div>

      <div className="relative flex gap-2 items-center">
      
        <input
          className="flex-1 bg-gray-800 border border-gray-600 px-3 py-2 rounded text-white"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message"
        />
        <button
          onClick={() => setShowEmoji((p) => !p)}
          className="text-2xl px-1"
        >
          😊
        </button>

        {showEmoji && (
          <div ref={emojiRef} className="absolute bottom-14 left-0 z-50">
            <EmojiPicker
              theme="dark"
              onEmojiClick={onEmojiClick}
              height={350}
              width={300}
            />
          </div>
        )}

        <button
          onClick={sendMessage}
          className="bg-blue-600 px-3 py-2 rounded text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
}
