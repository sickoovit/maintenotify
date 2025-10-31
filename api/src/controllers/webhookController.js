import * as messageRepo from "../repositories/messageRepository.js";
import * as clientRepo from "../repositories/clientRepository.js";

const WEBHOOK_VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

// Webhook verification (required by Meta)
export const verifyWebhook = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    console.log("✅ Webhook verified successfully");
    res.status(200).send(challenge);
  } else {
    console.error("❌ Webhook verification failed");
    res.sendStatus(403);
  }
};

// Handle incoming messages
export const handleWebhook = async (req, res) => {
  try {
    const body = req.body;

    // Acknowledge receipt immediately
    res.sendStatus(200);

    // Check if it's a WhatsApp message event
    if (body.object !== "whatsapp_business_account") {
      console.log("⚠️  Not a WhatsApp event, ignoring");
      return;
    }

    // Process each entry
    for (const entry of body.entry) {
      for (const change of entry.changes) {
        if (change.field !== "messages") continue;

        const value = change.value;

        // Handle incoming messages
        if (value.messages) {
          for (const message of value.messages) {
            await processIncomingMessage(message, value.metadata);
          }
        }

        // Handle status updates (delivered, read, etc.)
        if (value.statuses) {
          for (const status of value.statuses) {
            await processStatusUpdate(status);
          }
        }
      }
    }
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
  }
};

async function processIncomingMessage(message, metadata) {
  try {
    const { from, type, text, id: whatsappMessageId } = message;

    // Only handle text messages for now
    if (type !== "text") {
      console.log(`⚠️  Received ${type} message, skipping for now`);
      return;
    }

    const messageContent = text?.body;
    if (!messageContent) return;

    console.log(`📨 Incoming message from ${from}: ${messageContent}`);

    // Find or create client by phone number
    let client = await clientRepo.findClientByPhone(from);

    if (!client) {
      // Create new client with phone number
      // Name will be "Unknown" until we get it from WhatsApp profile or they provide it
      client = await clientRepo.createClient("Unknown Client", from);
      console.log(`✨ Created new client: ${from}`);
    }

    // Save message to database
    await messageRepo.createMessage({
      clientId: client.id,
      content: messageContent,
      direction: "INBOUND",
      whatsappMessageId,
      status: "DELIVERED",
    });

    console.log(`💾 Message saved for client ${client.name}`);

    // TODO: You could add auto-reply logic here
    // Or emit a Socket.io event to update the dashboard in real-time
  } catch (error) {
    console.error("❌ Error processing incoming message:", error);
  }
}

async function processStatusUpdate(status) {
  try {
    const { id: whatsappMessageId, status: messageStatus } = status;

    // Map WhatsApp status to our enum
    const statusMap = {
      sent: "SENT",
      delivered: "DELIVERED",
      read: "READ",
      failed: "FAILED",
    };

    const mappedStatus = statusMap[messageStatus];
    if (!mappedStatus) return;

    // Update message status in database
    await messageRepo.updateMessageStatus(whatsappMessageId, mappedStatus);

    console.log(`📊 Message ${whatsappMessageId} status: ${mappedStatus}`);
  } catch (error) {
    // It's okay if message doesn't exist in database
    // This happens for outbound messages that we don't track yet
    if (error.code === "P2025") {
      // Silently ignore - this is expected for messages not in our DB
      return;
    }
    console.error("❌ Error processing status update:", error);
  }
}
