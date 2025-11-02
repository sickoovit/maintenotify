import axios from "axios";
import { API_BASE_URL } from "../config";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Devices
export const getDevices = () => api.get("/api/devices");
export const createDevice = (data) => api.post("/api/devices", data);
export const updateDeviceStatus = (id, status) =>
  api.patch(`/api/devices/${id}/status`, { status });

// Messages
export const getConversations = () => api.get("/api/messages/conversations");
export const getConversation = (clientId) =>
  api.get(`/api/messages/conversation/${clientId}`);
export const sendMessage = (data) => api.post("/api/messages/send", data);

export default api;
