import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState,useEffect } from "react";
import socket from "../API/socket";
import API from "../API/Api";

export default function Home() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  const handleRegister = () => {
    if (!username.trim()) return;

    socket.connect();
    socket.emit("register", username);

    navigate("/users", { state: { username } });
  };
  useEffect(() => {
    //disconnet
    if (isHomePage && socket.connected) {
      socket.disconnect();
  
    }else{
await function checkBackend(){
     const response = await API.get("/")
      console.log("check backedn", response)
}
      checkBackend()
    }
  }, [isHomePage]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-950 via-gray-900 to-black relative overflow-hidden">
      
      {/* Decorative blurred circles */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl" />

      <div className="relative w-full max-w-4xl bg-gray-900/70 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-xl">

        {/* Header */}
        <div className="p-6 border-b border-gray-700 text-center">
          <h1 className="text-3xl font-bold tracking-wide bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Rapid Chat⚡
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Real-time conversations. Simple. Fast. Secure.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[60vh] flex items-center justify-center">

          {isHomePage && (
            <div className="w-full max-w-sm text-center space-y-6 animate-fade-in">

              <p className="text-gray-300 text-sm">
                Pick a username and start the conversation.
              </p>

              <input
                className="w-full bg-gray-800/80 border border-gray-600 px-4 py-3 rounded-xl text-white placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              />

              <button
                onClick={handleRegister}
                className="w-full py-3 rounded-xl font-medium
                           bg-gradient-to-r from-blue-600 to-purple-600
                           hover:from-blue-500 hover:to-purple-500
                           active:scale-[0.98]
                           transition-all duration-200 shadow-lg"
              >
                Join Chat
              </button>

              <p className="text-xs text-gray-500">
                No sign-up. No password. Just chat.
              </p>
            </div>
          )}

          {!isHomePage && <Outlet />}

        </div>
      </div>
    </div>
  );
}
