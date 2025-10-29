/*
  Warnings:

  - The `status` column on the `Device` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('RECEIVED', 'WORKING', 'DONE', 'DELIVERED');

-- AlterTable
ALTER TABLE "Device" DROP COLUMN "status",
ADD COLUMN     "status" "DeviceStatus" NOT NULL DEFAULT 'RECEIVED';
