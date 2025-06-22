// src/socket/socketHandler.js
import Chat from "../models/chat.js";

export default function (io) {
  io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    socket.on("join-room", async (roomId) => {
      if (!roomId) return;
      socket.join(roomId);
      console.log(`📺 ${socket.id} joined room ${roomId}`);

      const socketsInRoom = await io.in(roomId).allSockets();
      console.log(`🧠 Current sockets in room ${roomId}:`, [...socketsInRoom]);
    });

    socket.on("play-video", ({ roomId }) => {
      if (!roomId) return;
      console.log(`🔊 play-video received for ${roomId}`);
      socket.to(roomId).emit("video-play");
    });

    socket.on("pause-video", ({ roomId }) => {
      if (!roomId) return;
      console.log(`🔊 pause-video received for ${roomId}`);
      socket.to(roomId).emit("video-pause");
    });

    socket.on("seek-video", ({ roomId, time }) => {
      if (!roomId || time === undefined) return;
      console.log(`🔊 seek-video to ${time} in ${roomId}`);
      socket.to(roomId).emit("video-seek", { time });
    });

    // ✅ New event: change-video
    socket.on("change-video", ({ roomId, url }) => {
      if (!roomId || !url) return;

      console.log(`🔄 change-video in ${roomId}: ${url}`);
      io.to(roomId).emit("change-video", { url });
    });

    socket.on("send-message", async ({ roomId, message }) => {
      if (!roomId || !message?.text) return;

      const chatMessage = {
        roomId,
        sender: message.sender || "Anonymous",
        text: message.text,
        timestamp: new Date(),
      };

      socket.to(roomId).emit("receive-message", chatMessage);

      try {
        await Chat.create(chatMessage);
        console.log(`💬 Message saved in room ${roomId}: ${message.text}`);
      } catch (err) {
        console.error("❌ Error saving chat:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
}
