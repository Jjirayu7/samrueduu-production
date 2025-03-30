/*
  Warnings:

  - You are about to drop the column `cost` on the `BillSaleDetail` table. All the data in the column will be lost.
  - Added the required column `cost123` to the `BillSaleDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BillSaleDetail" DROP COLUMN "cost",
ADD COLUMN     "cost123" INTEGER NOT NULL;
