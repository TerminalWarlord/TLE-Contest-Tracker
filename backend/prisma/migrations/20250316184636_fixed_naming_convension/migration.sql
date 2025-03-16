/*
  Warnings:

  - You are about to drop the column `youtube_url` on the `Contest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Contest" DROP COLUMN "youtube_url",
ADD COLUMN     "youtubeUrl" TEXT;
