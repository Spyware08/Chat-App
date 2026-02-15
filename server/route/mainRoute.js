const express = require("express");
const router = express.Router();
const { onlineUsers } = require("../Socket/socket");

const {
    sendMessage,
    getMessages,
    postData
} = require("../controller/chat/chat.controller");


router.get("/", (req, res) => {
    res.send({ msg: "backend working" });
});

// chat routes
router.post("/chat/send", sendMessage);
router.get("/chat/messages", getMessages);
router.post("/chat/postnotification", postData);
router.get("/users",async(req,res)=>{
    return res.status(200).send(Object.keys(onlineUsers))
})

module.exports = router;
