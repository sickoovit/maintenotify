import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createMessage = async (data) => {
  return await prisma.message.create({
    data,
    include: {
      client: true,
      device: true,
    },
  });
};

export const findMessagesByClient = async (clientId, limit = 50) => {
  return await prisma.message.findMany({
    where: { clientId },
    include: {
      client: true,
      device: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
};

export const findMessagesByDevice = async (deviceId, limit = 50) => {
  return await prisma.message.findMany({
    where: { deviceId },
    include: {
      client: true,
      device: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
};

export const updateMessageStatus = async (whatsappMessageId, status) => {
  return await prisma.message.update({
    where: { whatsappMessageId },
    data: { status },
  });
};

export const findAllConversations = async () => {
  return await prisma.message.findMany({
    distinct: ["clientId"],
    orderBy: { createdAt: "desc" },
    include: {
      client: true,
      device: true,
    },
  });
};
