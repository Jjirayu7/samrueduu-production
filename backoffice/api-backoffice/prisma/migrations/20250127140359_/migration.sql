/*
  Warnings:

  - You are about to drop the column `userId` on the `PasswordResetToken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PasswordResetToken" DROP COLUMN "userId";
