-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "userCustomerId" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userCustomerId_fkey" FOREIGN KEY ("userCustomerId") REFERENCES "UserCustomer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
