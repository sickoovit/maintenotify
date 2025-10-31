-- CreateEnum
CREATE TYPE "MessageDirection" AS ENUM ('INBOUND', 'OUTBOUND');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('SENT', 'DELIVERED', 'READ', 'FAILED');

-- DropForeignKey
ALTER TABLE "public"."Device" DROP CONSTRAINT "Device_clientId_fkey";

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "deviceId" INTEGER,
    "content" TEXT NOT NULL,
    "direction" "MessageDirection" NOT NULL,
    "whatsappMessageId" TEXT,
    "status" "MessageStatus" NOT NULL DEFAULT 'SENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Message_whatsappMessageId_key" ON "Message"("whatsappMessageId");

-- CreateIndex
CREATE INDEX "Message_clientId_idx" ON "Message"("clientId");

-- CreateIndex
CREATE INDEX "Message_deviceId_idx" ON "Message"("deviceId");

-- CreateIndex
CREATE INDEX "Message_createdAt_idx" ON "Message"("createdAt");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
