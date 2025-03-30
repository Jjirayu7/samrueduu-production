-- DropIndex
DROP INDEX "orders_session_id_key";

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "session_id" DROP NOT NULL;
