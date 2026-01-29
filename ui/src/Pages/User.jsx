import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import socket from "../API/socket";
import { useChat } from "../context/ChatContext";

export default function Users() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const {
    setUsername,
    onlineUsers,
    unreadPrivate,
    unreadGroup,
    setUnreadGroup,
  } = useChat();

  const username = state.username;

  useEffect(() => {
    setUsername(username);

    if (!socket.connected) socket.connect();
    socket.emit("register", username);
  }, [username]);

  const openChat = (user) => {
    navigate(`/chat/${user}`);
  };

  const openGroupChat = () => {
    setUnreadGroup(0);
    navigate("/group-chat");
  };

  return (
    <div className="w-full">
      {/* GLOBAL CHAT */}
      <div
        onClick={openGroupChat}
        className="relative cursor-pointer mb-5 bg-purple-700 text-white px-4 py-2 rounded"
      >
        Global Chat
        {unreadGroup > 0 && (
          <span className="absolute top-1 right-2 bg-red-600 text-xs px-2 rounded-full">
            {unreadGroup}
          </span>
        )}
      </div>

      <h2 className="text-gray-300 mb-2">Online Users</h2>

      {onlineUsers.length === 0 && (
        <p className="text-gray-500 text-sm">No users online</p>
      )}

      {onlineUsers?.map((u, ind) => (
        <div
          key={u}
          onClick={() => openChat(u)}
          className="
      relative flex items-center gap-2
      bg-gray-800 hover:bg-gray-700
      px-3 py-2 rounded
      text-white cursor-pointer mb-2
    "
        >


          <span>{ind + 1}. &nbsp; {u}</span>

          {unreadPrivate[u] > 0 && (
            <span className="absolute top-1 right-2 bg-red-600 text-xs px-2 rounded-full">
              {unreadPrivate[u]}
            </span>
          )}
        </div>
      ))}

    </div>
  );
}
