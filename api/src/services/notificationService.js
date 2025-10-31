import { sendWhatsAppMessage } from "./whatsappService.js";
import * as messageRepo from "../repositories/messageRepository.js";

export async function sendDeviceReceived(device) {
  const message = `Hello ${device.client.name}! 👋\n\nWe've received your ${device.name} for maintenance.\n\nDevice ID: #${device.id}\nStatus: ${device.status}\n\nWe'll keep you updated on the progress!`;

  const result = await sendWhatsAppMessage(device.client.phone, message);

  // Save outbound message to database if sent successfully
  if (result.success && result.data?.messages?.[0]?.id) {
    try {
      await messageRepo.createMessage({
        clientId: device.client.id,
        deviceId: device.id,
        content: message,
        direction: "OUTBOUND",
        whatsappMessageId: result.data.messages[0].id,
        status: "SENT",
      });
      console.log("💾 Outbound message saved to database");
    } catch (error) {
      console.error("Failed to save outbound message:", error);
    }
  }

  return result;
}

export async function sendDeviceStatusUpdate(device) {
  const statusMessages = {
    RECEIVED: `Your ${device.name} has been received and is in queue.`,
    WORKING: `Good news! We've started working on your ${device.name}. 🔧`,
    DONE: `Great news ${device.client.name}! Your ${device.name} is ready for pickup! ✅`,
    DELIVERED: `Thank you for choosing us! Your ${device.name} has been delivered. 🎉`,
  };

  const message =
    statusMessages[device.status] || `Status update: ${device.status}`;
  const fullMessage = `${message}\n\nDevice ID: #${device.id}`;

  const result = await sendWhatsAppMessage(device.client.phone, fullMessage);

  // Save outbound message to database if sent successfully
  if (result.success && result.data?.messages?.[0]?.id) {
    try {
      await messageRepo.createMessage({
        clientId: device.client.id,
        deviceId: device.id,
        content: fullMessage,
        direction: "OUTBOUND",
        whatsappMessageId: result.data.messages[0].id,
        status: "SENT",
      });
      console.log("💾 Outbound message saved to database");
    } catch (error) {
      console.error("Failed to save outbound message:", error);
    }
  }

  return result;
}
