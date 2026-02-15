import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiRefreshCw } from "react-icons/fi";
import socket from "../API/socket";
import { useChat } from "../context/ChatContext";
import API from "../API/Api";

export default function Users() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const {
    setUsername,
    onlineUsers,
    setOnlineUsers,
    unreadPrivate,
    unreadGroup,
    setUnreadGroup,
  } = useChat();

  const username = state?.username;

  const [loading, setLoading] = useState(false);

  // Register user when component mounts
  useEffect(() => {
    if (!username) return;

    setUsername(username);

    if (!socket.connected) socket.connect();
    socket.emit("register", username);

    // Listen for updated online users list
    socket.on("online-users", (users) => {
      setOnlineUsers(users);
      setLoading(false);
    });

    return () => {
      socket.off("online-users");
    };
  }, [username]);

  // Manual refresh button
  const handleRefresh = async() => {
    setLoading(true);
 
  try {
    const response = await API.get("/users");

    console.log(response); 
        setOnlineUsers(response.data?.filter(i=>i!=username));
  } catch (error) {
    console.error("Error fetching users:", error);
  }
    setLoading(false);


  };

  const openChat = (user) => {
    navigate(`/chat/${user}`);
  };

  const openGroupChat = () => {
    setUnreadGroup(0);
    navigate("/group-chat");
  };

  return (
    <div className="w-full p-4">
      {/* GLOBAL CHAT */}
      <div
        onClick={openGroupChat}
        className="relative cursor-pointer mb-5 bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition"
      >
        Global Chat
        {unreadGroup > 0 && (
          <span className="absolute top-1 right-2 bg-red-600 text-xs px-2 rounded-full">
            {unreadGroup}
          </span>
        )}
      </div>

      {/* ONLINE USERS HEADER + REFRESH */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-gray-300 text-lg font-semibold">
          Online Users
        </h2>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-2 py-2 rounded transition"
        >
          <FiRefreshCw
            size={14}
            className={loading ? "animate-spin" : ""}
          />
          {/* {loading ? "Fetching" : "Refresh"} */}
        </button>
      </div>

      {/* NO USERS */}
      {onlineUsers.length === 0 && (
        <p className="text-gray-500 text-sm">No users online</p>
      )}

      {/* USERS LIST */}
      {onlineUsers?.map((u, ind) => (
        <div
          key={u}
          onClick={() => openChat(u)}
          className="
            relative flex items-center gap-2
            bg-gray-800 hover:bg-gray-700
            px-3 py-2 rounded
            text-white cursor-pointer mb-2
            transition
          "
        >
          <span>
            {ind + 1}. &nbsp; {u}
          </span>

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
