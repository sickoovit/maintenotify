import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getDevices = async (req, res) => {
  const devices = await prisma.device.findMany();
  res.json(devices);
};

export const addDevice = async (req, res) => {
  const { name, customer } = req.body;
  const device = await prisma.device.create({
    data: { name, customer },
  });
  res.json(device);
};

export const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowed = ["RECEIVED", "WORKING", "DONE", "DELIVERED"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const device = await prisma.device.update({
    where: { id: Number(id) },
    data: { status },
  });

  res.json(device);
};
