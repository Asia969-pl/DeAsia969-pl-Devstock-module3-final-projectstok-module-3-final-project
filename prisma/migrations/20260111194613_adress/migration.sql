/*
  Warnings:

  - You are about to drop the column `apartmentNumber` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `streetNumber` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `apartmentNumber` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `streetNumber` on the `Order` table. All the data in the column will be lost.
  - Made the column `country` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `addressId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "apartmentNumber",
DROP COLUMN "street",
DROP COLUMN "streetNumber",
ALTER COLUMN "country" SET NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "apartmentNumber",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "postalCode",
DROP COLUMN "province",
DROP COLUMN "status",
DROP COLUMN "street",
DROP COLUMN "streetNumber",
ADD COLUMN     "addressId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
