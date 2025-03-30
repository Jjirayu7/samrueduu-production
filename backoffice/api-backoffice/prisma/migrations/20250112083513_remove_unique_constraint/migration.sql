/*
  Warnings:

  - You are about to drop the `BillSale` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BillSaleDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BillSaleDetail" DROP CONSTRAINT "BillSaleDetail_billSaleId_fkey";

-- DropForeignKey
ALTER TABLE "BillSaleDetail" DROP CONSTRAINT "BillSaleDetail_productId_fkey";

-- DropTable
DROP TABLE "BillSale";

-- DropTable
DROP TABLE "BillSaleDetail";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "User";
