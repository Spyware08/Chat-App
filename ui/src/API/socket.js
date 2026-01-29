// import { io } from "socket.io-client";

// const socket = io("http://192.168.31.107:8000", {
//   autoConnect: false,
// });

// export default socket;

import { io } from "socket.io-client";
const API_URL = import.meta.env.VITE_API_URL;
console.log("API URL:", import.meta.env.VITE_API_URL);

const socket = io(API_URL, {
  autoConnect: false,
});

export default socket;

