const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();

const mainRoute = require("./route/mainRoute");
const {socketHandler} = require("./Socket/socket");

const app = express();
const server = http.createServer(app);

app.use(express.json());
const corsOptions = {
  origin: process.env.api.split(","), 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

// main routes
app.use("/", mainRoute);

// socket init
socketHandler(server);

const port = process.env.PORT ;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
