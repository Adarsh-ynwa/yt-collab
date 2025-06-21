import Room from '../models/Room.js';

export const createRoom = async (req, res) => {
  const { roomId, videoUrl } = req.body;
  try {
    const existing = await Room.findOne({ roomId });
    if (existing) return res.status(400).json({ message: 'Room already exists' });

    const room = await Room.create({ roomId, videoUrl });
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRoom = async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
