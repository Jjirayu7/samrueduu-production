-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "userCustomerId" SET DEFAULT 2;
