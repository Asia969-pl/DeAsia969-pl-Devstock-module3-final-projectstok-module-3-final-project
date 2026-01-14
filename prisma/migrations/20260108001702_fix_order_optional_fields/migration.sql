/*
  Warnings:

  - You are about to drop the column `notes` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `paymentStatus` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `transactionId` on the `Order` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Order_transactionId_key";

-- AlterTable
ALTER TABLE "Brand" ALTER COLUMN "image" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "notes",
DROP COLUMN "paymentMethod",
DROP COLUMN "paymentStatus",
DROP COLUMN "transactionId",
ADD COLUMN     "status" TEXT DEFAULT 'pending',
ALTER COLUMN "totalAmount" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "picture" DROP NOT NULL;
