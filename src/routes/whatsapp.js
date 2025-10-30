import express from "express";
import { sendWhatsAppMessage } from "../services/whatsappService.js";

const router = express.Router();

router.post("/send", async (req, res) => {
  try {
    const { to, message } = req.body;

    if (!to || !message)
      return res
        .status(400)
        .json({ error: "Missing 'to' or 'message' field." });

    const result = await sendWhatsAppMessage(to, message);
    res.status(200).json({ success: true, result });
  } catch (err) {
    console.error("Error sending WhatsApp message:", err.response?.data || err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
