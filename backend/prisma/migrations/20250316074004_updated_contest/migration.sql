/*
  Warnings:

  - Changed the type of `startsAt` on the `Contest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Contest" DROP COLUMN "startsAt",
ADD COLUMN     "startsAt" INTEGER NOT NULL;
