import axios from "axios";

const WHATSAPP_API_URL = "https://graph.facebook.com/v21.0";

// Helper function to get env vars (evaluated when called, not at import time)
// This fixes the timing issue where destructuring happens before dotenv loads
const getWhatsAppConfig = () => ({
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
  token: process.env.WHATSAPP_TOKEN,
});

// Validate config and warn once if missing
let hasWarned = false;
const validateAndGetConfig = () => {
  const { phoneNumberId, token } = getWhatsAppConfig();

  if ((!phoneNumberId || !token) && !hasWarned) {
    console.warn(
      "⚠️  WhatsApp credentials not configured. Messages will not be sent."
    );
    hasWarned = true;
  }

  return { phoneNumberId, token };
};

export async function sendWhatsAppMessage(to, message) {
  const { phoneNumberId, token } = validateAndGetConfig();

  // Skip if credentials are missing
  if (!phoneNumberId || !token) {
    console.log(
      `[WhatsApp] Skipping message to ${to} (credentials not configured)`
    );
    return { success: false, skipped: true };
  }

  try {
    const url = `${WHATSAPP_API_URL}/${phoneNumberId}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: message },
    };

    const res = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
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
  const { phoneNumberId, token } = validateAndGetConfig();

  if (!phoneNumberId || !token) {
    console.log(
      `[WhatsApp] Skipping template to ${to} (credentials not configured)`
    );
    return { success: false, skipped: true };
  }

  try {
    const url = `${WHATSAPP_API_URL}/${phoneNumberId}/messages`;

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
        Authorization: `Bearer ${token}`,
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
