/*
  Warnings:

  - Added the required column `completeAdress` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "completeAdress" TEXT NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "street" DROP NOT NULL,
ALTER COLUMN "streetNumber" DROP NOT NULL;
