import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Chat from "./Pages/chat";
import Users from "./Pages/User";
import GroupChat from "./Pages/GroupChat";
import { useEffect } from "react";
import socket from "./API/socket";



function App() {
  useEffect(() => {
    socket.on("postNotification", (payload) => {
      console.log("Notification form socket", payload);
    });

    return () => socket.off("postNotification");
  }, []);

  //    useEffect(() => {
  //   socket.on("connect", () => {
  //     console.log("Socket connected:", socket.id);
  //   });

  //   socket.on("postNotification", (payload) => {
  //     console.log(" Notification:", payload);
  //   });

  //   return () => {
  //     socket.off("connect");
  //     socket.off("postNotification");
  //   };
  // }, []);
  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route path="users" element={<Users />} />
        <Route path="group-chat" element={<GroupChat />} />
        <Route path="chat/:user" element={<Chat />} />
      </Route>
    </Routes>
  );
}

export default App;
