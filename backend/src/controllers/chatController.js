import Chat from '../models/chat.js';

export const getChatByRoom = async (req, res) => {
  try {
    const messages = await Chat.find({ roomId: req.params.roomId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
