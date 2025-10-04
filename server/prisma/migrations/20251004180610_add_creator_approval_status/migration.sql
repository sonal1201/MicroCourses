-- CreateEnum
CREATE TYPE "Approval" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "creatorApprovalStatus" "Approval" NOT NULL DEFAULT 'PENDING';
