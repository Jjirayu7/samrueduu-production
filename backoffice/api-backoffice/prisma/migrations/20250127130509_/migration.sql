/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `UserCustomer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserCustomer" ALTER COLUMN "email" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "UserCustomer_email_key" ON "UserCustomer"("email");
