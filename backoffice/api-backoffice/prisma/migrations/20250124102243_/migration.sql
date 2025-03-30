/*
  Warnings:

  - You are about to drop the column `userCustomerId` on the `orders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_userCustomerId_fkey";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "userCustomerId";
