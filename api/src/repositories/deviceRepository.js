import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findAllDevices = async () => {
  return await prisma.device.findMany({
    include: { client: true },
  });
};

export const findDeviceById = async (id) => {
  return await prisma.device.findUnique({
    where: { id },
    include: { client: true },
  });
};

export const createDevice = async (name, clientId) => {
  return await prisma.device.create({
    data: { name, clientId },
    include: { client: true },
  });
};

export const updateDeviceStatus = async (id, status) => {
  return await prisma.device.update({
    where: { id },
    data: { status },
    include: { client: true },
  });
};

export const deleteDevice = async (id) => {
  return await prisma.device.delete({
    where: { id },
  });
};
