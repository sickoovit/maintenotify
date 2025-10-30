import { sendWhatsAppMessage } from "./whatsappService.js";

export const sendDeviceStatusUpdate = async (device) => {
  if (!device.client?.phone) return;

  const message = `Hello ${device.client.name}, your device "${device.name}" status is now: ${device.status}.`;
  await sendWhatsAppMessage(device.client.phone, message);
};

export const sendDeviceReceived = async (device) => {
  if (!device.client?.phone) return;

  const message = `Hello ${device.client.name}! We have successfully received your device "${device.name}".`;
  await sendWhatsAppMessage(device.client.phone, message);
};
