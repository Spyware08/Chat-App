import { createContext, useContext, useEffect, useState } from "react";
import socket from "../API/socket";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [username, setUsername] = useState(null);

  // online users
  const [onlineUsers, setOnlineUsers] = useState([]);

  // private chats: { user: [{ from, message }] }
  const [privateChats, setPrivateChats] = useState({});

  // group chat
  const [groupMessages, setGroupMessages] = useState([]);

  // unread counts
  const [unreadPrivate, setUnreadPrivate] = useState({});
  const [unreadGroup, setUnreadGroup] = useState(0);

  useEffect(() => {
    if (!username) return;

    if (!socket.connected) socket.connect();
    socket.emit("register", username);

    // online user
    socket.on("online_users", (users) => {
      setOnlineUsers(users.filter((u) => u !== username));
    });

    // recieved personal Msg
    socket.on("private_message", (data) => {
      const { from } = data;

      setPrivateChats((prev) => ({
        ...prev,
        [from]: [...(prev[from] || []), data],
      }));

      setUnreadPrivate((prev) => ({
        ...prev,
        [from]: (prev[from] || 0) + 1,
      }));
    });

    // group Chat
    socket.on("group_message", (data) => {
      setGroupMessages((prev) => [...prev, data]);
      setUnreadGroup((prev) => prev + 1);
    });

    return () => {
      socket.off("online_users");
      socket.off("private_message");
      socket.off("group_message");
    };
  }, [username]);

  // send private msg
  const sendPrivateMessage = ({ from, to, message }) => {
    socket.emit("private_message", { from, to, message });

    // store locally immediately
    setPrivateChats((prev) => ({
      ...prev,
      [to]: [...(prev[to] || []), { from, message }],
    }));
  };

  return (
    <ChatContext.Provider
      value={{
        username,
        setUsername,

        onlineUsers,
        setOnlineUsers,
        privateChats,

        sendPrivateMessage,

        groupMessages,

        unreadPrivate,
        setUnreadPrivate,

        unreadGroup,
        setUnreadGroup,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
