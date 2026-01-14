/*
  Warnings:

  - You are about to drop the column `cardNumber` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `cvv` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `expiryDate` on the `Card` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Card" DROP COLUMN "cardNumber",
DROP COLUMN "cvv",
DROP COLUMN "expiryDate",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
