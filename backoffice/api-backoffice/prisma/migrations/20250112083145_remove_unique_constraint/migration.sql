/*
  Warnings:

  - A unique constraint covering the columns `[user]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "user" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_user_key" ON "User"("user");
