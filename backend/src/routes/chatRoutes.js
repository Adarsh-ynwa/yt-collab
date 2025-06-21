import express from 'express';
import { getChatByRoom } from '../controllers/chatController.js';

const router = express.Router();

router.get('/:roomId', getChatByRoom);

export default router;
