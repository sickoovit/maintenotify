import * as messageService from "../services/messageService.js";

// Send a message manually from dashboard
export const sendMessage = async (req, res) => {
  try {
    const { clientPhone, content, deviceId } = req.body;

    if (!clientPhone || !content) {
      return res.status(400).json({
        error: "clientPhone and content are required",
      });
    }

    const result = await messageService.sendAndTrackMessage(
      clientPhone,
      content,
      deviceId || null
    );

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    res.json({
      success: true,
      message: "Message sent successfully",
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
};

// Get conversation history with a client
export const getConversation = async (req, res) => {
  try {
    const { clientId } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    const messages = await messageService.getConversation(
      Number(clientId),
      limit
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch conversation" });
  }
};

// Get all conversations (for dashboard inbox view)
export const getAllConversations = async (req, res) => {
  try {
    const conversations = await messageService.getAllConversations();
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
};
