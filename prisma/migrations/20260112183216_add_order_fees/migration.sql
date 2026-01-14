/*
  Warnings:

  - Made the column `totalAmount` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "productTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "protectionTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "serviceFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "shippingCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "totalAmount" SET NOT NULL,
ALTER COLUMN "totalAmount" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "protectionFee" DOUBLE PRECISION NOT NULL DEFAULT 0;
