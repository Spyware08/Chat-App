import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import socket from "../API/socket";
import API from "../API/Api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState({});
  const [unreadGroupMessages, setUnreadGroupMessages] = useState([]);

  const navigate = useNavigate();
  const { state } = useLocation();
  const username = state.username;

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();

      console.log("rn")
    }

    socket.emit("register", username);

    socket.on("online_users", (list) => {
      setUsers(list.filter((u) => u !== username));
    });

    //  private messages
    socket.on("private_message", (data) => {
      const { from, message } = data;

      setUnreadMessages((prev) => ({
        ...prev,
        [from]: [...(prev[from] || []), { from, message }],
      }));
    });

    // rom messages
    socket.on("group_message", (data) => {
      setUnreadGroupMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("online_users");
      socket.off("private_message");
      socket.off("group_message");
    };
  }, [username]);

  //  private chat
  const openChat = (user) => {
    const messages = unreadMessages[user] || [];

    setUnreadMessages((prev) => {
      const copy = { ...prev };
      delete copy[user];
      return copy;
    });

    navigate(`/chat/${user}`, {
      state: {
        username,
        initialMessages: messages,
      },
    });
  };

  //  global chat
  const openGroupChat = () => {
    const messages = unreadGroupMessages;

    setUnreadGroupMessages([]);

    navigate("/group-chat", {
      state: {
        username,
        initialMessages: messages,
      },
    });
  };

  const handlePost = async () => {
    const res = await API.post("chat/postnotification", {
      title: "New Post",
      message: "socket notification",
    });

    console.log(res.data);
  }

  return (
    <div className="w-full">


      {/* room CHAT */}
      <div
        onClick={openGroupChat}
        className="
          relative cursor-pointer mb-5
          bg-purple-700 hover:bg-purple-600
          text-white text-center
          px-4 py-2 rounded
        "
      >
        Global Chat Join

        {unreadGroupMessages.length > 0 && (
          <span
            className="
              absolute top-1 right-2
              bg-red-600 text-white
              text-xs px-2 py-0.5
              rounded-full
            "
          >
            {unreadGroupMessages.length}
          </span>
        )}
      </div>

      <h2 className="mb-4 font-semibold text-gray-200">
        Online Users are :
      </h2>
      {/*  PRIVATE USERS */}
      {users.length === 0 && (
        <p className="text-gray-400 text-sm">
          No users online
        </p>
      )}

      <div className="space-y-2">
        {users.map((i) => (
          <div
            key={i}
            onClick={() => openChat(i)}
            className="
              relative cursor-pointer
              bg-gray-800 hover:bg-gray-700
              px-4 py-2 rounded
              text-white
            "
          >
            {i}

            {unreadMessages[i]?.length > 0 && (
              <span
                className="
                  absolute top-1 right-2
                  bg-red-600 text-white
                  text-xs px-2 py-0.5
                  rounded-full
                "
              >
                {unreadMessages[i].length}
              </span>
            )}
          </div>
        ))}
      </div>
      {/* <button
        onClick={handlePost}
        className="w-full mt-4 bg-blue-600 py-2 rounded"
      >
        Post
      </button> */}
    </div>
  );
}
