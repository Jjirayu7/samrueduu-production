/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `UserCustomer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserCustomer" ADD COLUMN     "email" TEXT NOT NULL DEFAULT 'asdasd@gmal.cp',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "userCustomerId" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "UserCustomer_email_key" ON "UserCustomer"("email");
