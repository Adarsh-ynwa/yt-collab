import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  videoUrl: { type: String, default: '' },
});

export default mongoose.model('Room', roomSchema);
