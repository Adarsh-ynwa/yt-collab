import express from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

import socketHandler from './sockets/socketHandler.js';
import roomRoutes from './routes/roomRoutes.js';
import connectDB from './config/db.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());
app.use('/api/rooms', roomRoutes);

// Socket.io logic
socketHandler(io);

const PORT = 5001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
