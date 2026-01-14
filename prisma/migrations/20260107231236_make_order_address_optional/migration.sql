/*
  Warnings:

  - You are about to drop the column `apartmentNumber` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Adress" ALTER COLUMN "country" DROP NOT NULL,
ALTER COLUMN "apartmentNumber" DROP NOT NULL,
ALTER COLUMN "postalCode" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "apartmentNumber",
DROP COLUMN "province",
ADD COLUMN     "stockUpdated" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "picture" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "country" DROP NOT NULL;
