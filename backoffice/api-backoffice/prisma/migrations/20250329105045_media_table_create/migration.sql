/*
  Warnings:

  - The `src` column on the `media` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "media" DROP COLUMN "src",
ADD COLUMN     "src" TEXT[];
