/*
  Warnings:

  - You are about to drop the column `StripePriceId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "StripePriceId",
ADD COLUMN     "stripePriceId" TEXT;
