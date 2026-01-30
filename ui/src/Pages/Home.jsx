import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
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

 

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-gray-900 border border-gray-700 rounded-xl">

        <div className="p-6 border-b border-gray-700 text-center">
          <h1 className="text-2xl font-semibold">
            Rapid Chat
          </h1>
        </div>

        <div className="p-6 min-h-[60vh] flex items-center justify-center">

          {isHomePage && (
            <div className="w-full max-w-sm">
              <input
                className="w-full bg-gray-800 border border-gray-600 px-4 py-2 rounded"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <button
                onClick={handleRegister}
                className="w-full mt-4 bg-blue-600 py-2 rounded"
              >
                Register
              </button>
            </div>
          )}

          {!isHomePage && <Outlet />}

        </div>
      </div>
    </div>
  );
}
