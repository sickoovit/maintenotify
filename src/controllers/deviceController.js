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
