/*
  Warnings:

  - You are about to drop the `BillSaleDetail` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BillSaleDetail" DROP CONSTRAINT "BillSaleDetail_billSaleId_fkey";

-- DropForeignKey
ALTER TABLE "BillSaleDetail" DROP CONSTRAINT "BillSaleDetail_productId_fkey";

-- DropTable
DROP TABLE "BillSaleDetail";

-- CreateTable
CREATE TABLE "orderDetail" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "ordersId" INTEGER NOT NULL,
    "cost" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "orderDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "orderDetail" ADD CONSTRAINT "orderDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderDetail" ADD CONSTRAINT "orderDetail_ordersId_fkey" FOREIGN KEY ("ordersId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
