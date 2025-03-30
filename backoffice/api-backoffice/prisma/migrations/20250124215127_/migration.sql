/*
  Warnings:

  - A unique constraint covering the columns `[session_id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "orders_session_id_key" ON "orders"("session_id");
