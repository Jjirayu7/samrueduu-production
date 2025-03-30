/*
  Warnings:

  - Made the column `session_id` on table `orders` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "session_id" SET NOT NULL;
