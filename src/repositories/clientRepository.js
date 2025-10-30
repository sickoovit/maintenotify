import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findClientByPhone = async (phone) => {
  return await prisma.client.findUnique({
    where: { phone },
  });
};

export const createClient = async (name, phone) => {
  return await prisma.client.create({
    data: { name, phone },
  });
};

export const findOrCreateClient = async (name, phone) => {
  let client = await findClientByPhone(phone);
  if (!client) {
    client = await createClient(name, phone);
  }
  return client;
};
