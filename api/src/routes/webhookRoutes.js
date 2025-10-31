import express from "express";
import {
  verifyWebhook,
  handleWebhook,
} from "../controllers/webhookController.js";

const router = express.Router();

router.get("/whatsapp", verifyWebhook);

router.post("/whatsapp", handleWebhook);

export default router;
