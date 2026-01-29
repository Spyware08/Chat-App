const express = require("express");
const router = express.Router();

const {
    sendMessage,
    getMessages,
    postData
} = require("../controller/chat/chat.controller");

// health check
router.get("/", (req, res) => {
    res.send({ msg: "API working" });
});

// chat routes
router.post("/chat/send", sendMessage);
router.get("/chat/messages", getMessages);
router.post("/chat/postnotification", postData);

module.exports = router;
