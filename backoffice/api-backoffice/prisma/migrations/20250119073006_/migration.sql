/*
  Warnings:

  - Added the required column `detail1` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `detail2` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `detail3` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "detail1" TEXT NOT NULL,
ADD COLUMN     "detail2" TEXT NOT NULL,
ADD COLUMN     "detail3" TEXT NOT NULL;
