import express from "express";
import {
  sendMessage,
  getConversation,
  getAllConversations,
} from "../controllers/messageController.js";

const router = express.Router();

// POST /api/messages/send - Send a message manually
router.post("/send", sendMessage);

// GET /api/messages/conversations - Get all conversations
router.get("/conversations", getAllConversations);

// GET /api/messages/conversation/:clientId - Get specific conversation
router.get("/conversation/:clientId", getConversation);

export default router;
