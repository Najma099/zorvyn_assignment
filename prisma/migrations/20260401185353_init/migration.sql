-- CreateEnum
CREATE TYPE "RoleCode" AS ENUM ('VIEWER', 'ANALYST', 'ADMIN');

-- CreateEnum
CREATE TYPE "StatusCode" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "RecordType" AS ENUM ('INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('FOOD', 'RENT', 'SALARY', 'TRAVEL');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" "StatusCode" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "role" "RoleCode" NOT NULL DEFAULT 'VIEWER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "keystores" (
    "id" SERIAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    "primary_key" TEXT NOT NULL,
    "secondary_key" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "keystores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinanceRecord" (
    "id" SERIAL NOT NULL,
    "recordType" "RecordType" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "notes" TEXT,
    "category" "Category" NOT NULL,
    "userId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "keystores_client_id_idx" ON "keystores"("client_id");

-- CreateIndex
CREATE INDEX "keystores_client_id_primary_key_status_idx" ON "keystores"("client_id", "primary_key", "status");

-- CreateIndex
CREATE INDEX "keystores_client_id_primary_key_secondary_key_idx" ON "keystores"("client_id", "primary_key", "secondary_key");

-- CreateIndex
CREATE INDEX "FinanceRecord_userId_idx" ON "FinanceRecord"("userId");

-- CreateIndex
CREATE INDEX "FinanceRecord_userId_recordType_idx" ON "FinanceRecord"("userId", "recordType");

-- CreateIndex
CREATE INDEX "FinanceRecord_userId_category_idx" ON "FinanceRecord"("userId", "category");

-- CreateIndex
CREATE INDEX "FinanceRecord_userId_date_idx" ON "FinanceRecord"("userId", "date");

-- CreateIndex
CREATE INDEX "FinanceRecord_userId_recordType_category_date_idx" ON "FinanceRecord"("userId", "recordType", "category", "date");

-- AddForeignKey
ALTER TABLE "keystores" ADD CONSTRAINT "keystores_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinanceRecord" ADD CONSTRAINT "FinanceRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
