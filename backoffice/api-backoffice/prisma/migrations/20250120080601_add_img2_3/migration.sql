/*
  Warnings:

  - You are about to drop the column `imgSec1` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `imgSec2` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `imgSec3` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "imgSec1",
DROP COLUMN "imgSec2",
DROP COLUMN "imgSec3",
ADD COLUMN     "img2" TEXT,
ADD COLUMN     "img3" TEXT;
