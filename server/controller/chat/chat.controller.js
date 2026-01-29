// controllers/chat/chat.controller.js
const { getIO } = require("../../Socket/socket");

exports.sendMessage = (req, res) => {
    // const { message } = req.body;

    res.status(200).json({
        success: true,
        message: "Message sent",
        // data: message,
    });
};

exports.getMessages = (req, res) => {
    res.status(200).json({
        success: true,
        messages: ["Hi", "Hello", "How are you?"],
    });
};
exports.postData = (req, res) => {
  const io = getIO();


  io.emit("postNotification", {
    title: "New Post Created",
    data: req.body,
  });

  res.status(200).json({
    success: true,
    data: req.body,
    messages: ["Post Data"],
  });
};
