/*
  Warnings:

  - You are about to drop the column `userId` on the `FinanceRecord` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "FinanceRecord" DROP CONSTRAINT "FinanceRecord_userId_fkey";

-- DropIndex
DROP INDEX "FinanceRecord_userId_category_idx";

-- DropIndex
DROP INDEX "FinanceRecord_userId_date_idx";

-- DropIndex
DROP INDEX "FinanceRecord_userId_idx";

-- DropIndex
DROP INDEX "FinanceRecord_userId_recordType_category_date_idx";

-- DropIndex
DROP INDEX "FinanceRecord_userId_recordType_idx";

-- AlterTable
ALTER TABLE "FinanceRecord" DROP COLUMN "userId",
ADD COLUMN     "createdBy" INTEGER;

-- CreateIndex
CREATE INDEX "FinanceRecord_createdBy_idx" ON "FinanceRecord"("createdBy");

-- CreateIndex
CREATE INDEX "FinanceRecord_createdBy_recordType_idx" ON "FinanceRecord"("createdBy", "recordType");

-- CreateIndex
CREATE INDEX "FinanceRecord_createdBy_category_idx" ON "FinanceRecord"("createdBy", "category");

-- CreateIndex
CREATE INDEX "FinanceRecord_createdBy_date_idx" ON "FinanceRecord"("createdBy", "date");

-- CreateIndex
CREATE INDEX "FinanceRecord_createdBy_recordType_category_date_idx" ON "FinanceRecord"("createdBy", "recordType", "category", "date");

-- AddForeignKey
ALTER TABLE "FinanceRecord" ADD CONSTRAINT "FinanceRecord_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
