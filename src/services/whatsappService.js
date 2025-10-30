import axios from "axios";

const WHATSAPP_API_URL = "https://graph.facebook.com/v21.0";
const { WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_TOKEN } = process.env;

// Validate environment variables on module load
if (!WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_TOKEN) {
  console.warn(
    "⚠️  WhatsApp credentials not configured. Messages will not be sent."
  );
}

export async function sendWhatsAppMessage(to, message) {
  // Skip if credentials are missing
  if (!WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_TOKEN) {
    console.log(
      `[WhatsApp] Skipping message to ${to} (credentials not configured)`
    );
    return { success: false, skipped: true };
  }

  try {
    const url = `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: message },
    };

    const res = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    console.log(`[WhatsApp] Message sent to ${to}:`, res.data);
    return { success: true, data: res.data };
  } catch (error) {
    console.error(`[WhatsApp] Failed to send message to ${to}:`, {
      error: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    // Don't throw - let the application continue even if notification fails
    return {
      success: false,
      error: error.message,
      details: error.response?.data,
    };
  }
}

export async function sendWhatsAppTemplate(
  to,
  templateName,
  languageCode = "en",
  components = []
) {
  if (!WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_TOKEN) {
    console.log(
      `[WhatsApp] Skipping template to ${to} (credentials not configured)`
    );
    return { success: false, skipped: true };
  }

  try {
    const url = `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: templateName,
        language: { code: languageCode },
        components,
      },
    };

    const res = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    console.log(`[WhatsApp] Template sent to ${to}:`, res.data);
    return { success: true, data: res.data };
  } catch (error) {
    console.error(`[WhatsApp] Failed to send template to ${to}:`, {
      error: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    return {
      success: false,
      error: error.message,
      details: error.response?.data,
    };
  }
}
