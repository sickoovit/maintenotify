import {
  sendDeviceReceived,
  sendDeviceStatusUpdate,
} from "../services/notificationService.js";
import * as deviceRepo from "../repositories/deviceRepository.js";
import * as clientRepo from "../repositories/clientRepository.js";

const ALLOWED_STATUSES = ["RECEIVED", "WORKING", "DONE", "DELIVERED"];

export const getDevices = async (req, res) => {
  try {
    const devices = await deviceRepo.findAllDevices();
    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch devices" });
  }
};

export const addDevice = async (req, res) => {
  try {
    const { name, clientName, clientPhone } = req.body;

    const client = await clientRepo.findOrCreateClient(clientName, clientPhone);
    const device = await deviceRepo.createDevice(name, client.id);

    await sendDeviceReceived(device);

    res.json(device);
  } catch (error) {
    res.status(500).json({ error: "Failed to add device" });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const device = await deviceRepo.updateDeviceStatus(Number(id), status);

    await sendDeviceStatusUpdate(device);

    res.json(device);
  } catch (error) {
    res.status(500).json({ error: "Failed to update device status" });
  }
};
