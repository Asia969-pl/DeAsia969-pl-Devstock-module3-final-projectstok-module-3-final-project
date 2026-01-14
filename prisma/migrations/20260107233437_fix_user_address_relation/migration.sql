/*
  Warnings:

  - Made the column `picture` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "province" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "picture" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;
