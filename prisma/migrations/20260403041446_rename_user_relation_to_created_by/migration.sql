/*
  Warnings:

  - You are about to alter the column `amount` on the `FinanceRecord` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.

*/
-- DropForeignKey
ALTER TABLE "FinanceRecord" DROP CONSTRAINT "FinanceRecord_userId_fkey";

-- AlterTable
ALTER TABLE "FinanceRecord" ALTER COLUMN "amount" SET DATA TYPE INTEGER,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "FinanceRecord" ADD CONSTRAINT "FinanceRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
