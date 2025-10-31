import { sendWhatsAppMessage } from "./whatsappService.js";
import * as messageRepo from "../repositories/messageRepository.js";
import * as clientRepo from "../repositories/clientRepository.js";

/**
 * Send a message and track it in the database
 * This is the main function to use when sending messages manually
 */
export async function sendAndTrackMessage(
  clientPhone,
  content,
  deviceId = null
) {
  try {
    // Find client by phone
    const client = await clientRepo.findClientByPhone(clientPhone);

    if (!client) {
      return {
        success: false,
        error: "Client not found. Please add client first.",
      };
    }

    // Send via WhatsApp
    const result = await sendWhatsAppMessage(clientPhone, content);

    // Track in database if sent successfully
    if (result.success && result.data?.messages?.[0]?.id) {
      await messageRepo.createMessage({
        clientId: client.id,
        deviceId: deviceId,
        content: content,
        direction: "OUTBOUND",
        whatsappMessageId: result.data.messages[0].id,
        status: "SENT",
      });

      console.log(`💾 Message tracked for client ${client.name}`);
    }

    return result;
  } catch (error) {
    console.error("Error sending and tracking message:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Send a message to a client (by client ID)
 */
export async function sendMessageToClient(clientId, content, deviceId = null) {
  try {
    // Get client info
    const client = await clientRepo.findClientByPhone(null); // We need a new repo method

    // For now, get client from a different query
    const message = await messageRepo.createMessage({
      clientId: clientId,
      deviceId: deviceId,
      content: content,
      direction: "OUTBOUND",
      status: "PENDING", // Will update after sending
    });

    // Get client phone to send
    const clientWithPhone = message.client;

    // Send via WhatsApp
    const result = await sendWhatsAppMessage(clientWithPhone.phone, content);

    // Update with WhatsApp message ID
    if (result.success && result.data?.messages?.[0]?.id) {
      await messageRepo.updateMessageStatus(result.data.messages[0].id, "SENT");
    }

    return result;
  } catch (error) {
    console.error("Error sending message to client:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get conversation history with a client
 */
export async function getConversation(clientId, limit = 50) {
  return await messageRepo.findMessagesByClient(clientId, limit);
}

/**
 * Get all recent conversations
 */
export async function getAllConversations() {
  return await messageRepo.findAllConversations();
}
